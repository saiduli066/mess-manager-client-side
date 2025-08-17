/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, User, Download } from "lucide-react";
import { useMessStore } from "@/store/useMessStore";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const getMonthOptions = () =>
    Array.from({ length: 12 }, (_, i) => ({
        label: new Date(0, i).toLocaleString("default", { month: "long" }),
        value: String(i + 1).padStart(2, "0"),
    }));

const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => ({
        label: String(y),
        value: String(y),
    }));
};

interface UpdateModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (amount: number) => void;
    type: "deposit" | "meal";
    currentAmount: number;
    memberName: string;
}

const UpdateModal = ({
    open,
    onClose,
    onSubmit,
    type,
    currentAmount,
    memberName,
}: UpdateModalProps) => {
    const [amount, setAmount] = useState<number>(currentAmount);

    useEffect(() => {
        if (open) setAmount(currentAmount);
    }, [currentAmount, open]);

    const handleSubmit = () => {
        if (isNaN(amount)) {
            alert("Please enter a valid number.");
            return;
        }
        onSubmit(amount);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Update {type === "deposit" ? "Deposit" : "Meal"} for {memberName}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    <Label>{type === "deposit" ? "New Deposit Amount (৳)" : "New Meal Count"}</Label>
                    <input
                        type="number"
                        className="border rounded px-3 py-2"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                </div>
                <DialogFooter className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const Records = () => {
    const navigate = useNavigate();
    const {
        mess,
        entriesReport,
        getMessInfo,
        getMessEntries,
        updateMessEntry,
        isLoading,
    } = useMessStore();

    const [month, setMonth] = useState(
        String(new Date().getMonth() + 1).padStart(2, "0")
    );
    const [year, setYear] = useState(String(new Date().getFullYear()));

    const { summary = [], totalMeals = 0, totalDeposits = 0, mealRate = 0 } =
        entriesReport || {};

    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"deposit" | "meal">("deposit");
    const [modalMemberName, setModalMemberName] = useState("");
    const [modalCurrentAmount, setModalCurrentAmount] = useState(0);
    const [modalUserId, setModalUserId] = useState<string | null>(null);

    useEffect(() => {
        if (!mess) getMessInfo();
    }, [mess, getMessInfo]);

    useEffect(() => {
        if (mess?._id && month && year) {
            getMessEntries(mess._id, month, year);
        }
    }, [mess?._id, month, year, getMessEntries]);

    const openUpdateModal = (
        memberName: string,
        userId: string,
        type: "deposit" | "meal",
        currentAmount: number,
    ) => {
        setModalMemberName(memberName);
        setModalUserId(userId);
        setModalType(type);
        setModalCurrentAmount(currentAmount);
        setModalOpen(true);
    };

    const handleModalSubmit = async (amount: number) => {
        setModalOpen(false);
        if (!modalUserId || !mess?._id) {
            toast("Missing required data for update.");
            return;
        }

        try {
            await updateMessEntry(
                mess._id,
                modalUserId,
                modalType,
                amount,
                parseInt(month),
                parseInt(year)
            );

            await getMessEntries(mess._id, month, year);
        } catch (error) {
            console.error(error);
            toast("Error updating entry.");
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const monthName = getMonthOptions()[parseInt(month) - 1].label;
        const date = new Date().toLocaleDateString();

        // Title
        doc.setFontSize(20);
        doc.setTextColor(33, 33, 33); 
        doc.setFont('helvetica', 'bold');
        doc.text(`Mess Report - ${monthName} ${year}`, 105, 20, { align: 'center' });

        // Subtitle
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated on: ${date}`, 105, 27, { align: 'center' });

        // Summary Section
        doc.setFontSize(15);
        doc.setTextColor(44, 62, 80); 
        doc.setFont('helvetica', 'bold');
        doc.text("Summary", 14, 40);

        // Summary Table
        autoTable(doc, {
            startY: 45,
            body: [
                ['Total Meals', totalMeals],
                ['Total Deposits', `TK ${totalDeposits}`],
                ['Total Meals Cost', `TK ${(totalMeals * mealRate).toFixed(2)}`],
                ['Meal Rate', `TK ${mealRate.toFixed(2)}`],
            ],
            theme: 'grid',
            headStyles: {
                fillColor: [52, 73, 94], 
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 12
            },
            bodyStyles: {
                textColor: [50, 50, 50], 
                fontSize: 11,
                cellPadding: 5
            },
            margin: { top: 40 },
            styles: {
                halign: 'center'
            }
        });

        // Member Summary Section
        doc.setFontSize(15);
        doc.setTextColor(44, 62, 80);
        doc.text("Member Summary", 14, (doc as any).lastAutoTable.finalY + 20);

        // Member Table
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 25,
            head: [['Name', 'Deposit (TK)', 'Meals', 'Balance (TK)', 'Status']],
            body: summary.map(member => [
                member.name,
                member.totalDeposit,
                member.totalMeal,
                member.balance.toFixed(2),
                member.balance < 0 ? 'Due' : 'Advance'
            ]),
            theme: 'grid',
            headStyles: {
                fillColor: [52, 73, 94], 
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 12
            },
            bodyStyles: {
                textColor: [50, 50, 50], 
                fontSize: 11
            },
            columnStyles: {
                0: { fontStyle: 'bold' }, 
                1: { cellWidth: 30, halign: 'right' },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 30, halign: 'right' },
                4: { cellWidth: 25, halign: 'center' }
            },
            didParseCell: (data) => {
                if (data.column.index === 4) {
                    data.cell.styles.textColor = [255, 255, 255]; 
                    if (data.cell.raw === 'Due') {
                        data.cell.styles.fillColor = [231, 76, 60]; 
                    } else {
                        data.cell.styles.fillColor = [39, 174, 96]; 
                    }
                }
            }
        });

        // Save the PDF
        doc.save(`mess_report_${month}_${year}.pdf`);
    };

    //loading
    if (!mess?._id || mess._id.trim() === "") {
        return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-4">
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-3xl scale-150" />
                <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-72 lg:h-72 xl:w-64 xl:h-64">
                    <DotLottieReact
                        src="https://lottie.host/26dfed0f-655e-4d48-bbd1-86cc7bdfd29c/Ia0U6ar4rU.lottie"
                        loop
                        autoplay
                        className="w-full h-full"
                    />
                </div>
            </div>
        </div>
    }

    if (!mess?._id || mess._id.trim() === "") {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
                    <p className="text-lg text-amber-400">⚠️ No mess found.</p>
                    <Button
                        className="bg-indigo-700 hover:bg-indigo-900"
                        onClick={() => navigate("/entry-options")}
                    >
                        Go to Create/Join A Mess
                    </Button>
                </div>
            );
        }
    

    return (
        <div className="p-4 space-y-6">
            {/* Filters and Download Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-row gap-3 md:gap-4">
                    <div className="flex flex-col space-y-1">
                        <Label>Month</Label>
                        <Select value={month} onValueChange={setMonth}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {getMonthOptions().map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <Label>Year</Label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {getYearOptions().map((y) => (
                                    <SelectItem key={y.value} value={y.value}>
                                        {y.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    onClick={generatePDF}
                    className="md:mt-0 self-start md:self-center text-black"
                    variant="outline"
                >
                    <Download className="h-4 w-4  " />
                    Download Report
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Meals</p>
                        <p className="text-lg font-semibold">{totalMeals}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Deposits (৳)</p>
                        <p className="text-lg font-semibold">৳ {totalDeposits}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Meals Cost (৳)</p>
                        <p className="text-lg font-semibold">৳ {(totalMeals * mealRate).toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Meal Rate (৳)</p>
                        <p className="text-lg font-semibold">৳ {mealRate.toFixed(2)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Member Summary Table */}
            <div className="bg-white text-black dark:bg-muted rounded-xl shadow overflow-x-auto">
                <h2 className="text-lg font-semibold px-4 py-3 border-b">
                    Member Summary ({month}/{year})
                </h2>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-gray-100 dark:bg-zinc-800">
                            <TableRow>
                                <TableHead className="min-w-[80px]">Image</TableHead>
                                <TableHead className="min-w-[150px]">Name</TableHead>
                                <TableHead className="min-w-[180px]">Total Deposit (৳)</TableHead>
                                <TableHead className="min-w-[180px]">Total Meals</TableHead>
                                <TableHead className="min-w-[130px]">Balance (৳)</TableHead>
                                <TableHead className="min-w-[180px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {summary.map((member) => (
                                <TableRow key={member.userId}>
                                    <TableCell>
                                        {member.image ? (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-offset-1 ring-gray-200 dark:ring-gray-700"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
                                                <User className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{member.name}</TableCell>
                                    <TableCell className="text-gray-700 dark:text-gray-300">
                                        ৳ {member.totalDeposit}
                                    </TableCell>
                                    <TableCell className="text-gray-700 dark:text-gray-300">
                                        {member.totalMeal}
                                    </TableCell>
                                    <TableCell
                                        className={`font-semibold ${member.balance < 0 ? "text-red-600" : "text-green-600"
                                            }`}
                                    >
                                        ৳ {member.balance.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-primary hover:text-white transition-colors"
                                            onClick={() =>
                                                openUpdateModal(
                                                    member.name,
                                                    member.userId,
                                                    "deposit",
                                                    member.totalDeposit
                                                )
                                            }
                                        >
                                            Update Deposit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hover:bg-primary hover:text-white transition-colors"
                                            onClick={() =>
                                                openUpdateModal(
                                                    member.name,
                                                    member.userId,
                                                    "meal",
                                                    member.totalMeal
                                                )
                                            }
                                        >
                                            Update Meal
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <UpdateModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleModalSubmit}
                type={modalType}
                currentAmount={modalCurrentAmount}
                memberName={modalMemberName}
            />
        </div>
    );
};

export default Records;
