// pages/Records.tsx
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
import { User, Download } from "lucide-react";
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
import autoTable from "jspdf-autotable";
import {
    createUnMessPDF,
    getUnMessTableStyles,
    applyWatermarkToAllPages,
    addSectionHeader,
} from "@/lib/pdfUtils";

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

const Records = () => {
    const navigate = useNavigate();
    const {
        mess,
        entriesReport,
        getMessInfo,
        getMessEntries,
        isLoading,
    } = useMessStore();

    const [month, setMonth] = useState(
        String(new Date().getMonth() + 1).padStart(2, "0")
    );
    const [year, setYear] = useState(String(new Date().getFullYear()));
    const [generating, setGenerating] = useState(false);

    const { summary = [], totalMeals = 0, totalDeposits = 0, mealRate = 0 } =
        entriesReport || {};

    useEffect(() => {
        if (!mess) getMessInfo();
    }, [mess, getMessInfo]);

    useEffect(() => {
        if (mess?._id && month && year) {
            getMessEntries(mess._id, month, year);
        }
    }, [mess?._id, month, year, getMessEntries]);

    const generatePDF = () => {
        setGenerating(true);

        // Use setTimeout to allow React to update the UI with spinner
        setTimeout(() => {
            try {
                const monthName = getMonthOptions()[parseInt(month) - 1].label;

                // Create PDF with UnMess branding
                const doc = createUnMessPDF({
                    title: `MEAL REPORT`,
                    subtitle: `Report for ${monthName} ${year}`,
                });

                const tableStyles = getUnMessTableStyles();
                let startY = 45;

                // Financial Summary Section
                addSectionHeader(doc, "FINANCIAL SUMMARY", startY);

                // Summary Table
                autoTable(doc, {
                    startY: startY + 6,
                    body: [
                        ["Total Meals", totalMeals.toString()],
                        ["Total Deposits", `tk ${totalDeposits.toFixed(2)}`],
                        ["Total Meals Cost", `tk ${(totalMeals * mealRate).toFixed(2)}`],
                        ["Meal Rate", `tk ${mealRate.toFixed(2)}`],
                    ],
                    ...tableStyles,
                    columnStyles: {
                        0: { fontStyle: "bold", cellWidth: 90, halign: "left" },
                        1: { halign: "right", cellWidth: 70, fontStyle: "bold" },
                    },
                });

                // Member Summary Section
                const afterSummary = (doc as any).lastAutoTable.finalY + 15;
                addSectionHeader(doc, "MEMBER SUMMARY", afterSummary);

                // Member Table
                autoTable(doc, {
                    startY: afterSummary + 8,
                    head: [["Name", "Deposit (tk)", "Meals", "Balance (tk)", "Status"]],
                    body: summary.map((member) => [
                        member.name,
                        member.totalDeposit.toFixed(2),
                        member.totalMeal.toString(),
                        member.balance.toFixed(2),
                        member.balance < 0 ? "Due" : "Advance",
                    ]),
                    ...tableStyles,
                    columnStyles: {
                        0: { fontStyle: "bold" },
                        1: { halign: "right" },
                        2: { halign: "center" },
                        3: { halign: "right" },
                        4: { halign: "center" },
                    },
                    didParseCell: (data) => {
                        // Color the balance column based on status
                        if (data.column.index === 3 && data.section === "body") {
                            const balance = parseFloat(data.cell.raw as string);
                            if (balance < 0) {
                                data.cell.styles.textColor = [220, 38, 38]; // Red for due
                                data.cell.styles.fontStyle = "bold";
                            } else {
                                data.cell.styles.textColor = [22, 163, 74]; // Green for advance
                                data.cell.styles.fontStyle = "bold";
                            }
                        }
                    },
                });

                // Apply watermark to all pages and add footers
                applyWatermarkToAllPages(doc);

                // Save the PDF
                doc.save(`UnMess_Report_${monthName}_${year}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setGenerating(false);
            }
        }, 100);
    };

    if (!mess?._id || mess._id.trim() === "") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center space-y-4 bg-[#0F1729]">
                <p className="text-lg text-amber-400">⚠️ No mess found.</p>
                <Button
                    className="bg-[#7E22CE] hover:bg-[#6B1AB5]"
                    onClick={() => navigate("/entry-options")}
                >
                    Go to Create/Join A Mess
                </Button>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 min-h-screen bg-[#0F1729]">
            {/* Filters and Download Button */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex flex-col space-y-1 flex-1 sm:flex-initial">
                        <Label className="text-gray-300 text-sm">Month</Label>
                        <Select value={month} onValueChange={setMonth}>
                            <SelectTrigger className="w-full sm:w-40 bg-[#1A2332] border-[#7E22CE]/30 text-white">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A2332] border-[#7E22CE]/30">
                                {getMonthOptions().map((m) => (
                                    <SelectItem key={m.value} value={m.value} className="text-white">
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col space-y-1 flex-1 sm:flex-initial">
                        <Label className="text-gray-300 text-sm">Year</Label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="w-full sm:w-40 bg-[#1A2332] border-[#7E22CE]/30 text-white">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A2332] border-[#7E22CE]/30">
                                {getYearOptions().map((y) => (
                                    <SelectItem key={y.value} value={y.value} className="text-white">
                                        {y.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    onClick={generatePDF}
                    className="w-full sm:w-auto whitespace-nowrap bg-[#7E22CE] hover:bg-[#6B1AB5] text-white border-[#7E22CE]/30"
                    variant="outline"
                    disabled={generating}
                >
                    {generating ? (
                        <>
                            <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                        </>
                    )}
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="bg-[#1A2332] border-[#7E22CE]/30">
                    <CardContent className="p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-400 truncate">Total Meals</p>
                        <p className="text-base sm:text-lg font-semibold text-white">{totalMeals}</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#1A2332] border-[#7E22CE]/30">
                    <CardContent className="p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-400 truncate">Total Deposits (৳)</p>
                        <p className="text-base sm:text-lg font-semibold text-white">৳ {totalDeposits}</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#1A2332] border-[#7E22CE]/30">
                    <CardContent className="p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-400 truncate">Total Meals Cost (৳)</p>
                        <p className="text-base sm:text-lg font-semibold text-white">৳ {(totalMeals * mealRate).toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#1A2332] border-[#7E22CE]/30">
                    <CardContent className="p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-400 truncate">Meal Rate (৳)</p>
                        <p className="text-base sm:text-lg font-semibold text-white">৳ {mealRate.toFixed(2)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Member Summary Table */}
            <div className="bg-[#1A2332] border border-[#7E22CE]/30 rounded-xl shadow overflow-hidden">
                <h2 className="text-base sm:text-lg font-semibold px-3 sm:px-4 py-3 border-b border-[#7E22CE]/30 text-white">
                    Member Summary ({month}/{year})
                </h2>

                {isLoading ? (
                    <div className="flex flex-col justify-center items-center py-10">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7E22CE]"></div>
                        <p className="mt-4 text-gray-400 text-sm">Loading records...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-[#0F1729]">
                                <TableRow className="border-b border-[#7E22CE]/30 hover:bg-[#0F1729]">
                                    <TableHead className="min-w-[80px] text-gray-300">Image</TableHead>
                                    <TableHead className="min-w-[150px] text-gray-300">Name</TableHead>
                                    <TableHead className="min-w-[180px] text-gray-300">Total Deposit (৳)</TableHead>
                                    <TableHead className="min-w-[180px] text-gray-300">Total Meals</TableHead>
                                    <TableHead className="min-w-[130px] text-gray-300">Balance (৳)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.map((member) => (
                                    <TableRow key={member.userId} className="border-b border-[#7E22CE]/10 hover:bg-[#7E22CE]/10">
                                        <TableCell>
                                            {member.image ? (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="h-10 w-10 rounded-full object-cover ring-2 ring-offset-1 ring-[#7E22CE]/30"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#7E22CE] to-[#9D47DE]">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium text-white">{member.name}</TableCell>
                                        <TableCell className="text-gray-300">
                                            ৳ {member.totalDeposit}
                                        </TableCell>
                                        <TableCell className="text-gray-300">
                                            {member.totalMeal}
                                        </TableCell>
                                        <TableCell
                                            className={`font-semibold ${member.balance < 0 ? "text-red-400" : "text-green-400"
                                                }`}
                                        >
                                            ৳ {member.balance.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Records;