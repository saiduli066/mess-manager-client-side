/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMessStore } from "@/store/useMessStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
    Calendar,
    Download,
    Utensils,
    Soup,
    Drumstick,
    ListChecks,
} from "lucide-react";
import autoTable from "jspdf-autotable";
import {
    createUnMessPDF,
    getUnMessTableStyles,
    applyWatermarkToAllPages,
    addSectionHeader,
} from "@/lib/pdfUtils";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    CartesianGrid,
} from "recharts";

const UserMealStatistics = () => {
    const { userMealStatistics, getUserMealStatistics, isLoading } = useMessStore();
    const { authUser } = useAuthStore();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        loadStatistics();
    }, [selectedMonth, selectedYear]);

    const loadStatistics = async () => {
        await getUserMealStatistics(selectedMonth, selectedYear);
    };

    // Custom date formatter for "12/Sept/25" format
    const formatCustomDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en', { month: 'short' });
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const years = [2023, 2024, 2025, 2026, 2027, 2028, 2029];

    const exportToPDF = () => {
        if (!userMealStatistics) return;

        setExporting(true);

        // Use setTimeout to allow React to update the UI with spinner
        setTimeout(() => {
            try {
                const monthName = months[selectedMonth - 1];

                // Fill in missing days with 0 meals
                const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
                const filledStatistics = [];

                for (let day = 1; day <= daysInMonth; day++) {
                    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const existingDay = userMealStatistics.statistics.find(
                        (stat) => new Date(stat.date).getDate() === day
                    );

                    if (existingDay) {
                        filledStatistics.push(existingDay);
                    } else {
                        filledStatistics.push({
                            date: dateStr,
                            lunch: 0,
                            dinner: 0,
                            total: 0
                        });
                    }
                }

                // Create PDF with UnMess branding
                const doc = createUnMessPDF({
                    title: `MEAL STATISTICS`,
                    subtitle: `${monthName} ${selectedYear} - ${authUser?.name || 'User'}`,
                });

                const tableStyles = getUnMessTableStyles();
                let startY = 45;

                // Monthly Summary Section
                addSectionHeader(doc, "MONTHLY SUMMARY", startY);

                // Summary cards as table
                autoTable(doc, {
                    startY: startY + 6,
                    body: [
                        ["Lunch Meals", userMealStatistics.monthlyTotals.lunch.toString()],
                        ["Dinner Meals", userMealStatistics.monthlyTotals.dinner.toString()],
                        ["Total Meals", userMealStatistics.monthlyTotals.total.toString()],
                        ["Total Days", userMealStatistics.totalDays.toString()],
                    ],
                    ...tableStyles,
                    columnStyles: {
                        0: { fontStyle: "bold", cellWidth: 90, halign: "left" },
                        1: { halign: "right", cellWidth: 70, fontStyle: "bold" },
                    },
                });

                // Daily Breakdown Section
                const afterSummary = (doc as any).lastAutoTable.finalY + 15;
                addSectionHeader(doc, "DAILY BREAKDOWN", afterSummary);

                // Daily meals table
                autoTable(doc, {
                    startY: afterSummary + 8,
                    head: [["Date", "Lunch", "Dinner", "Total"]],
                    body: filledStatistics.map((day) => [
                        formatCustomDate(day.date),
                        day.lunch.toString(),
                        day.dinner.toString(),
                        day.total.toString(),
                    ]),
                    foot: [[
                        "TOTAL",
                        userMealStatistics.monthlyTotals.lunch.toString(),
                        userMealStatistics.monthlyTotals.dinner.toString(),
                        userMealStatistics.monthlyTotals.total.toString(),
                    ]],
                    ...tableStyles,
                    footStyles: {
                        fillColor: [126, 34, 206],
                        textColor: [255, 255, 255],
                        fontStyle: "bold",
                        fontSize: 10,
                        halign: "center",
                    },
                    columnStyles: {
                        0: { fontStyle: "bold" },
                        1: { halign: "center" },
                        2: { halign: "center" },
                        3: { halign: "center", fontStyle: "bold" },
                    },
                    didParseCell: (data) => {
                        // Highlight cells with 0 meals in light red
                        if (data.section === "body" && (data.column.index === 1 || data.column.index === 2)) {
                            if (data.cell.raw === "0") {
                                data.cell.styles.fillColor = [254, 226, 226]; // Light red
                                data.cell.styles.textColor = [185, 28, 28]; // Dark red text
                            }
                        }
                    },
                });

                // Apply watermark to all pages and add footers
                applyWatermarkToAllPages(doc);

                // Save the PDF
                doc.save(`UnMess_MealStats_${monthName}_${selectedYear}.pdf`);
            } catch (error) {
                console.error("Error exporting PDF:", error);
            } finally {
                setExporting(false);
            }
        }, 100);
    };

    const COLORS = ["#eab308", "#3b82f6", "#22c55e"];

    return (
        <div className="mx-2 my-1 min-h-screen bg-[#0F1729] p-4">
            <Card className="w-full shadow-md border border-[#7E22CE]/30 rounded-2xl bg-[#1A2332]">
                <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold text-white">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#9D47DE]" />
                            <span className="truncate">Meal Statistics — {months[selectedMonth - 1]} {selectedYear}</span>
                        </CardTitle>

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex flex-col space-y-1 flex-1 sm:flex-initial">
                                    <Select
                                        value={selectedMonth.toString()}
                                        onValueChange={(val) => setSelectedMonth(parseInt(val))}
                                    >
                                        <SelectTrigger className="w-full sm:w-40 bg-[#0F1729] border-[#7E22CE]/30 text-white">
                                            <SelectValue placeholder="Select Month" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1A2332] border-[#7E22CE]/30">
                                            {months.map((month, index) => (
                                                <SelectItem key={month} value={(index + 1).toString()} className="text-white">
                                                    {month}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex flex-col space-y-1 flex-1 sm:flex-initial">
                                    <Select
                                        value={selectedYear.toString()}
                                        onValueChange={(val) => setSelectedYear(parseInt(val))}
                                    >
                                        <SelectTrigger className="w-full sm:w-40 bg-[#0F1729] border-[#7E22CE]/30 text-white">
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1A2332] border-[#7E22CE]/30">
                                            {years.map((year) => (
                                                <SelectItem key={year} value={year.toString()} className="text-white">
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button onClick={exportToPDF} size="sm" variant="outline" className="bg-[#7E22CE] hover:bg-[#6B1AB5] text-white border-[#7E22CE]/30 w-full sm:w-auto whitespace-nowrap" disabled={exporting}>
                                {exporting ? (
                                    <>
                                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export PDF
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-10">
                            <Utensils className="w-8 h-8 animate-spin mx-auto mb-4 text-[#7E22CE]" />
                            <p className="text-gray-300">Loading statistics...</p>
                        </div>
                    ) : userMealStatistics ? (
                        <div className="space-y-8">
                            {/* Monthly Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: "Lunch", value: userMealStatistics.monthlyTotals.lunch, color: "text-yellow-600", icon: Soup },
                                    { label: "Dinner", value: userMealStatistics.monthlyTotals.dinner, color: "text-blue-600", icon: Drumstick },
                                    { label: "Total Meals", value: userMealStatistics.monthlyTotals.total, color: "text-green-600", icon: ListChecks },
                                ].map((item, idx) => (
                                    <Card key={idx} className="hover:shadow-lg hover:shadow-[#7E22CE]/20 transition-shadow rounded-xl bg-[#0F1729] border border-[#7E22CE]/30">
                                        <CardContent className="p-5 text-center">
                                            <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                                            <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                                            <div className="text-sm text-gray-400">{item.label}</div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Bar Chart */}
                                <Card className="p-4 rounded-xl shadow-sm bg-[#0F1729] border border-[#7E22CE]/30">
                                    <p className="text-sm font-medium mb-3 text-white">Meals Overview (Bar)</p>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart
                                            data={[
                                                { name: "Lunch", value: userMealStatistics.monthlyTotals.lunch },
                                                { name: "Dinner", value: userMealStatistics.monthlyTotals.dinner },
                                            ]}
                                            barCategoryGap="25%"
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                                {COLORS.slice(0, 2).map((c, i) => (
                                                    <Cell key={i} fill={c} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>

                                {/* Pie Chart */}
                                <Card className="p-4 rounded-xl shadow-sm bg-[#0F1729] border border-[#7E22CE]/30">
                                    <p className="text-sm font-medium mb-3 text-white">Meal Share (Pie)</p>
                                    <ResponsiveContainer width="100%" height={260}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: "Lunch", value: userMealStatistics.monthlyTotals.lunch },
                                                    { name: "Dinner", value: userMealStatistics.monthlyTotals.dinner },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={85}
                                                dataKey="value"
                                                label
                                            >
                                                {COLORS.slice(0, 2).map((c, i) => (
                                                    <Cell key={i} fill={c} />
                                                ))}
                                            </Pie>
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </div>

                            {/* Daily Table */}
                            <div className="overflow-x-auto rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                                <table className="w-full text-sm">
                                    <thead className="bg-[#0F1729] sticky top-0 z-10">
                                        <tr>
                                            <th className="p-3 text-left font-medium text-gray-300">Date</th>
                                            <th className="p-3 text-center font-medium text-gray-300">Lunch</th>
                                            <th className="p-3 text-center font-medium text-gray-300">Dinner</th>
                                            <th className="p-3 text-center font-medium text-gray-300">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userMealStatistics.statistics.map((day, index) => (
                                            <tr
                                                key={index}
                                                className="border-t border-[#7E22CE]/10 hover:bg-[#7E22CE]/10 transition-colors"
                                            >
                                                <td className="p-3 font-medium text-white">
                                                    {formatCustomDate(day.date)}
                                                </td>
                                                {[day.lunch, day.dinner].map((meal, i) => (
                                                    <td key={i} className="p-3 text-center">
                                                        <span
                                                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium 
                              ${meal ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
                                                        >
                                                            {meal}
                                                        </span>
                                                    </td>
                                                ))}
                                                <td className="p-3 text-center font-semibold text-white">
                                                    {day.total}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-[#0F1729] font-semibold text-white">
                                            <td className="p-3">TOTAL</td>
                                            <td className="p-3 text-center">{userMealStatistics.monthlyTotals.lunch}</td>
                                            <td className="p-3 text-center">{userMealStatistics.monthlyTotals.dinner}</td>
                                            <td className="p-3 text-center">{userMealStatistics.monthlyTotals.total}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div className="text-sm text-gray-400 mt-2">
                                Showing {userMealStatistics.totalDays} days in{" "}
                                {months[userMealStatistics.month - 1]} {userMealStatistics.year}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            No statistics available for selected period.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserMealStatistics;