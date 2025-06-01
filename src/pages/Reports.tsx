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
import { Loader2 } from "lucide-react";
import { useMessStore } from "@/store/useMessStore";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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

const Reports = () => {
    const {
        mess,
        entriesReport,
        getMessInfo,
        getMessEntries,
        isLoading,
    } = useMessStore();

    const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, "0"));
    const [year, setYear] = useState(String(new Date().getFullYear()));

    const { summary = [], totalMeals = 0, totalDeposits = 0, mealRate = 0 } = entriesReport || {};

    useEffect(() => {
        if (!mess) getMessInfo();
    }, [mess, getMessInfo]);

    useEffect(() => {
        if (mess?._id && month && year) {
            getMessEntries(mess._id, month, year); 
        }
    }, [mess?._id, month, year, getMessEntries]); 

    return (
        <div className="p-4 space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
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
                        <p className="text-sm text-muted-foreground">Total Meals (৳)</p>
                        <p className="text-lg font-semibold">৳ {totalMeals}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Meal Rate (৳)</p>
                        <p className="text-lg font-semibold">৳ {mealRate}</p>
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
                                <TableHead className="min-w-[160px]">Total Deposit (৳)</TableHead>
                                <TableHead className="min-w-[130px]">Total Meals</TableHead>
                                <TableHead className="min-w-[130px]">Balance (৳)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {summary.map((member) => (
                                <TableRow key={member.userId}>
                                    <TableCell>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{member.name}</TableCell>
                                    <TableCell>৳ {member.totalDeposit}</TableCell>
                                    <TableCell>{member.totalMeal}</TableCell>
                                    <TableCell>৳ {member.balance}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default Reports;
