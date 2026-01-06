import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Receipt, Plus, Trash2, DollarSign, Users, CheckCircle2, Download, Edit, Check, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useMessStore } from "@/store/useMessStore";
import { axiosInstance } from "@/lib/axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import autoTable from "jspdf-autotable";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
    createUnMessPDF,
    getUnMessTableStyles,
    applyWatermarkToAllPages,
    addSectionHeader,
} from "@/lib/pdfUtils";

import NoMessFound from "@/components/NoMessFound";

interface MemberPayment {
    userId: {
        _id: string;
        name: string;
        image: string;
    };
    paid: boolean;
    paidAt?: string;
}

interface Bill {
    _id: string;
    name: string;
    totalAmount: number;
    date: string;
    members: MemberPayment[];
    perHeadAmount: number;
    month: number;
    year: number;
}

export default function Bills() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [billName, setBillName] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [downloading, setDownloading] = useState(false);
    const [editingBillId, setEditingBillId] = useState<string | null>(null);
    const [editAmount, setEditAmount] = useState("");
    const [updating, setUpdating] = useState(false);

    const { authUser } = useAuthStore();
    const { mess } = useMessStore();
    const { checkOnlineAndWarn } = useOnlineStatus();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    // Fetch bills from API
    const fetchBills = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/bills", {
                params: { month: selectedMonth, year: selectedYear }
            });
            setBills(response.data);
        } catch (error: unknown) {
            console.error("Error fetching bills:", error);
            toast.error("Failed to load bills");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authUser?.messId) {
            fetchBills();
        }
    }, [authUser?.messId, selectedMonth, selectedYear]);

    const createBill = async () => {
        if (!billName.trim() || !totalAmount.trim()) return;

        if (!checkOnlineAndWarn('create a bill')) {
            return;
        }

        try {
            setCreating(true);
            const response = await axiosInstance.post("/bills", {
                name: billName.trim(),
                totalAmount: parseFloat(totalAmount),
                date: new Date().toISOString()
            });
            setBills([response.data, ...bills]);
            setBillName("");
            setTotalAmount("");
            setIsDialogOpen(false);
            toast.success("Bill created successfully");
        } catch (error: unknown) {
            console.error("Error creating bill:", error);
            toast.error("Failed to create bill");
        } finally {
            setCreating(false);
        }
    };

    const togglePayment = async (billId: string, memberId: string) => {
        if (!checkOnlineAndWarn('update payment status')) {
            return;
        }

        try {
            const response = await axiosInstance.patch(`/bills/${billId}/payment/${memberId}`);
            setBills(bills.map((bill) => (bill._id === billId ? response.data : bill)));
            toast.success("Payment status updated");
        } catch (error: unknown) {
            console.error("Error updating payment:", error);
            toast.error("Failed to update payment status");
        }
    };

    const deleteBill = async (billId: string) => {
        if (!checkOnlineAndWarn('delete this bill')) {
            return;
        }

        if (!confirm("Are you sure you want to delete this bill?")) return;

        try {
            await axiosInstance.delete(`/bills/${billId}`);
            setBills(bills.filter((bill) => bill._id !== billId));
            toast.success("Bill deleted successfully");
        } catch (error: unknown) {
            console.error("Error deleting bill:", error);
            toast.error("Failed to delete bill");
        }
    };

    const startEditBill = (bill: Bill) => {
        setEditingBillId(bill._id);
        setEditAmount(bill.totalAmount.toString());
    };

    const cancelEdit = () => {
        setEditingBillId(null);
        setEditAmount("");
    };

    const updateBillAmount = async (billId: string) => {
        if (!editAmount.trim() || parseFloat(editAmount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (!checkOnlineAndWarn('update bill amount')) {
            return;
        }

        try {
            setUpdating(true);
            const response = await axiosInstance.patch(`/bills/${billId}`, {
                totalAmount: parseFloat(editAmount)
            });
            setBills(bills.map((bill) => (bill._id === billId ? response.data : bill)));
            toast.success("Bill amount updated successfully");
            setEditingBillId(null);
            setEditAmount("");
        } catch (error: unknown) {
            console.error("Error updating bill:", error);
            toast.error("Failed to update bill amount");
        } finally {
            setUpdating(false);
        }
    };

    const downloadPDF = async () => {
        try {
            setDownloading(true);
            const response = await axiosInstance.get("/bills/summary", {
                params: { month: selectedMonth, year: selectedYear }
            });
            const summary = response.data;

            const monthName = months[selectedMonth - 1];

            // Create PDF with UnMess branding
            const doc = createUnMessPDF({
                title: `BILLS SUMMARY`,
                subtitle: `${monthName} ${selectedYear}`
            });

            const tableStyles = getUnMessTableStyles();
            let startY = 45;

            // Bills Overview Section
            addSectionHeader(doc, "BILLS OVERVIEW", startY);

            // Summary cards
            autoTable(doc, {
                startY: startY + 8,
                body: [
                    ["Total Bills", summary.totalBills?.toString() || "0"],
                    ["Total Amount", `tk ${summary.totalAmount?.toFixed(2) || "0.00"}`],
                    ["Total Members", summary.mess?.totalMembers?.toString() || "0"],
                ],
                ...tableStyles,
                columnStyles: {
                    0: { fontStyle: "bold", cellWidth: 90, halign: "left" },
                    1: { halign: "right", cellWidth: 70, fontStyle: "bold" },
                },
            });

            // Bills Breakdown Section
            const afterSummary = (doc as any).lastAutoTable.finalY + 15;
            addSectionHeader(doc, "BILLS BREAKDOWN", afterSummary);

            if (summary.bills && summary.bills.length > 0) {
                autoTable(doc, {
                    startY: afterSummary + 8,
                    head: [["Bill Name", "Total Amount", "Per Head", "Date", "Paid/Total"]],
                    body: summary.bills.map((bill: any) => [
                        bill.name,
                        `tk ${bill.totalAmount.toFixed(2)}`,
                        `tk ${bill.perHeadAmount.toFixed(2)}`,
                        new Date(bill.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        }),
                        `${bill.paidCount}/${bill.totalMembers}`,
                    ]),
                    ...tableStyles,
                    columnStyles: {
                        0: { fontStyle: "bold" },
                        1: { halign: "right" },
                        2: { halign: "right" },
                        3: { halign: "center" },
                        4: { halign: "center" },
                    },
                });
            }

            // Member-wise Summary Section
            const afterBills = (doc as any).lastAutoTable.finalY + 15;
            addSectionHeader(doc, "MEMBER-WISE SUMMARY", afterBills);

            if (summary.memberSummary && summary.memberSummary.length > 0) {
                autoTable(doc, {
                    startY: afterBills + 8,
                    head: [["Member", "Total Owed", "Total Paid", "Pending", "Status"]],
                    body: summary.memberSummary.map((member: any) => [
                        member.name,
                        `tk ${member.totalOwed.toFixed(2)}`,
                        `tk ${member.totalPaid.toFixed(2)}`,
                        `tk ${member.totalPending.toFixed(2)}`,
                        member.totalPending === 0 ? "Paid" : "Pending",
                    ]),
                    ...tableStyles,
                    columnStyles: {
                        0: { fontStyle: "bold" },
                        1: { halign: "right" },
                        2: { halign: "right" },
                        3: { halign: "right" },
                        4: { halign: "center" },
                    },
                    didParseCell: (data) => {
                        if (data.column.index === 4 && data.section === "body") {
                            data.cell.styles.textColor = [255, 255, 255];
                            if (data.cell.raw === "Paid") {
                                data.cell.styles.fillColor = [34, 197, 94]; // Green
                                data.cell.styles.fontStyle = "bold";
                            } else {
                                data.cell.styles.fillColor = [239, 68, 68]; // Red
                                data.cell.styles.fontStyle = "bold";
                            }
                        }
                    },
                });
            }

            // Apply watermark to all pages and add footers
            applyWatermarkToAllPages(doc);

            // Save the PDF
            doc.save(`UnMess_Bills_${monthName}_${selectedYear}.pdf`);
            toast.success("Bill summary downloaded");
        } catch (error: unknown) {
            console.error("Error downloading PDF:", error);
            toast.error("Failed to download summary");
        } finally {
            setDownloading(false);
        }
    };

    const isAdmin = authUser?.role === "admin";
    const totalMembers = mess?.members?.length || 0;

    if (!authUser?.messId) {
        return (
            <NoMessFound message="You need to join a mess to manage bills." />
        );
    }

    return (
        <div className="min-h-screen bg-[#0F1729] p-4 sm:p-6">
            <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                            <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-[#7E22CE]" />
                            Mess Bills
                        </h1>
                        <p className="text-gray-400 text-xs sm:text-sm">
                            Track and manage all mess expenses
                        </p>
                    </div>
                    {isAdmin && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full sm:w-auto bg-[#7E22CE] hover:bg-[#6B1AB5] shadow-lg">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Bill
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1A2332] border border-[#7E22CE]/30">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                                        <Receipt className="w-5 h-5 text-[#7E22CE]" />
                                        Create New Bill
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                    <div>
                                        <Label className="text-gray-300">Bill Name</Label>
                                        <Input
                                            value={billName}
                                            onChange={(e) => setBillName(e.target.value)}
                                            placeholder="e.g., Electricity Bill, Gas Bill, Wifi"
                                            className="bg-[#0F1729] border-[#7E22CE]/30 text-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-gray-300">Total Amount (৳)</Label>
                                        <Input
                                            type="number"
                                            value={totalAmount}
                                            onChange={(e) => setTotalAmount(e.target.value)}
                                            placeholder="e.g., 1350"
                                            className="bg-[#0F1729] border-[#7E22CE]/30 text-white"
                                        />
                                    </div>
                                    {totalAmount && totalMembers > 0 && (
                                        <div className="p-4 bg-[#7E22CE]/10 rounded-lg border border-[#7E22CE]/30">
                                            <p className="text-sm text-gray-300">Per Head Amount:</p>
                                            <p className="text-2xl font-bold text-[#7E22CE]">
                                                ৳{(parseFloat(totalAmount) / totalMembers).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {totalAmount} ÷ {totalMembers} members
                                            </p>
                                        </div>
                                    )}
                                    <Button
                                        onClick={createBill}
                                        disabled={!billName.trim() || !totalAmount.trim() || creating}
                                        className="w-full bg-[#7E22CE] hover:bg-[#6B1AB5]"
                                    >
                                        {creating ? (
                                            <>
                                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Bill"
                                        )}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* Filters and Download */}
                <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                    <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex flex-col space-y-1 flex-1 sm:flex-initial">
                                    <Label className="text-gray-300 text-sm">Month</Label>
                                    <Select value={selectedMonth.toString()} onValueChange={(val) => setSelectedMonth(parseInt(val))}>
                                        <SelectTrigger className="bg-[#0F1729] border-[#7E22CE]/30 text-white w-full sm:w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1A2332] border-[#7E22CE]/30">
                                            {months.map((month, index) => (
                                                <SelectItem key={index} value={(index + 1).toString()} className="text-white focus:bg-[#7E22CE]/20">
                                                    {month}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col space-y-1 flex-1 sm:flex-initial">
                                    <Label className="text-gray-300 text-sm">Year</Label>
                                    <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(parseInt(val))}>
                                        <SelectTrigger className="bg-[#0F1729] border-[#7E22CE]/30 text-white w-full sm:w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1A2332] border-[#7E22CE]/30">
                                            {years.map((year) => (
                                                <SelectItem key={year} value={year.toString()} className="text-white focus:bg-[#7E22CE]/20">
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                onClick={downloadPDF}
                                disabled={downloading || bills.length === 0}
                                className="bg-[#7E22CE] hover:bg-[#6B1AB5] w-full sm:w-auto whitespace-nowrap"
                            >
                                {downloading ? (
                                    <>
                                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Summary
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 sm:p-3 rounded-lg bg-[#7E22CE]/20">
                                    <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-[#7E22CE]" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-300">Total Bills</p>
                                    <p className="text-xl sm:text-2xl font-bold text-white">{bills.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 sm:p-3 rounded-lg bg-[#7E22CE]/20">
                                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#7E22CE]" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-300">Total Amount</p>
                                    <p className="text-xl sm:text-2xl font-bold text-white">
                                        ৳{bills.reduce((sum, bill) => sum + bill.totalAmount, 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-lg bg-[#7E22CE]/20">
                                    <Users className="w-6 h-6 text-[#7E22CE]" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">Mess Members</p>
                                    <p className="text-2xl font-bold text-white">{totalMembers}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Loading State */}
                {loading ? (
                    <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                        <CardContent className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7E22CE] mx-auto mb-4"></div>
                            <p className="text-gray-300">Loading bills...</p>
                        </CardContent>
                    </Card>
                ) : bills.length === 0 ? (
                    <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                        <CardContent className="p-12 text-center">
                            <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-50" />
                            <p className="text-lg text-gray-300 mb-2">No bills for {months[selectedMonth - 1]} {selectedYear}</p>
                            <p className="text-sm text-gray-400 mb-6">
                                {isAdmin
                                    ? "Create your first bill using the button below"
                                    : "Ask your admin to create bills"}
                            </p>
                            {isAdmin && (
                                <Button
                                    onClick={() => setIsDialogOpen(true)}
                                    className="bg-[#7E22CE] hover:bg-[#6B1AB5]"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Bill
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {bills.map((bill) => {
                            const paidCount = bill.members.filter((m) => m.paid).length;
                            const unpaidCount = bill.members.length - paidCount;

                            return (
                                <Card key={bill._id} className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                                    <Receipt className="w-5 h-5 text-amber-500" />
                                                    <span className="bg-amber-500 text-white px-3 py-1.5 rounded-lg">
                                                        {bill.name}
                                                    </span>
                                                </CardTitle>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    Created on {new Date(bill.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {isAdmin && (
                                                <div className="flex gap-2">
                                                    {editingBillId === bill._id ? (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => updateBillAmount(bill._id)}
                                                                disabled={updating}
                                                                className="hover:bg-green-500/20"
                                                            >
                                                                {updating ? (
                                                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-400"></div>
                                                                ) : (
                                                                    <Check className="w-4 h-4 text-green-400" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={cancelEdit}
                                                                disabled={updating}
                                                                className="hover:bg-gray-500/20"
                                                            >
                                                                <X className="w-4 h-4 text-gray-400" />
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => startEditBill(bill)}
                                                                className="hover:bg-[#7E22CE]/20"
                                                            >
                                                                <Edit className="w-4 h-4 text-[#7E22CE]" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => deleteBill(bill._id)}
                                                                className="hover:bg-red-500/20"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-400" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Bill Summary */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#0F1729] rounded-lg border border-[#7E22CE]/20">
                                            <div>
                                                <p className="text-sm text-gray-400">Total Amount</p>
                                                {editingBillId === bill._id ? (
                                                    <Input
                                                        type="number"
                                                        value={editAmount}
                                                        onChange={(e) => setEditAmount(e.target.value)}
                                                        className="text-lg font-bold bg-[#0F1729] border-[#7E22CE]/30 text-white mt-1"
                                                        disabled={updating}
                                                    />
                                                ) : (
                                                    <p className="text-lg font-bold text-white">৳{bill.totalAmount.toFixed(2)}</p>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Total Members</p>
                                                <p className="text-lg font-bold text-white">{bill.members.length}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Per Head</p>
                                                <p className="text-lg font-bold text-[#7E22CE]">৳{bill.perHeadAmount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Payment Status</p>
                                                <p className="text-lg font-bold text-white">
                                                    {paidCount}/{bill.members.length}
                                                    <span className="text-sm text-gray-400 ml-2">
                                                        ({unpaidCount} pending)
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Members Payment Status */}
                                        <div>
                                            <h4 className="font-semibold text-white mb-3">Payment Status by Member</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {bill.members.map((member) => (
                                                    <div
                                                        key={member.userId._id}
                                                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${member.paid
                                                            ? "bg-green-500/10 border-green-500/30"
                                                            : "bg-[#0F1729] border-[#7E22CE]/20 hover:border-[#7E22CE]/40"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {member.userId.image ? (
                                                                <img
                                                                    src={member.userId.image}
                                                                    alt={member.userId.name}
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7E22CE] to-[#9D47DE] flex items-center justify-center text-white font-semibold">
                                                                    {member.userId.name.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-medium text-white">{member.userId.name}</p>
                                                                <p className="text-sm text-gray-400">
                                                                    ৳{bill.perHeadAmount.toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => togglePayment(bill._id, member.userId._id)}
                                                            disabled={!isAdmin}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${member.paid
                                                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                                : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
                                                                } ${!isAdmin && "cursor-not-allowed opacity-60"}`}
                                                        >
                                                            {member.paid ? (
                                                                <>
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                    Paid
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="w-4 h-4 rounded-full border-2 border-current" />
                                                                    Unpaid
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
