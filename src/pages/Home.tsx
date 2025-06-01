import { useEffect } from "react";
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

const Home = () => {
    const {
        mess,
        entriesReport,
        getMessInfo,
        getMessEntries,
        isLoading,
    } = useMessStore();

    useEffect(() => {
        if (!mess) getMessInfo();
    }, [mess, getMessInfo]);

    useEffect(() => {
        if (mess?._id) getMessEntries(mess._id);
    }, [mess?._id, getMessEntries]);

    const {
        totalMeals = 0,
        totalDeposits = 0,
        mealRate = 0,
        summary = [],
    } = entriesReport || {};

    return (
        <div className="p-4 space-y-6">
            <div className="text-center text-xl md:text-4xl text-medium">Current Month</div>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
                <Card className="shadow-md rounded-2xl">
                    <CardContent className="py-3 md:py-4 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Total Members</p>
                        <p className="text-xl md:text-3xl font-bold text-primary">{summary.length}</p>
                    </CardContent>
                </Card>
                <Card className="shadow-md rounded-2xl">
                    <CardContent className="py-3 md:py-4 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Total Deposit</p>
                        <p className="text-xl md:text-3xl font-bold text-blue-600">৳ {totalDeposits}</p>
                    </CardContent>
                </Card>
                <Card className="shadow-md rounded-2xl">
                    <CardContent className="py-3 md:py-4 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Total Meals</p>
                        <p className="text-xl md:text-3xl font-bold text-orange-600">{totalMeals}</p>
                    </CardContent>
                </Card>
                <Card className="shadow-md rounded-2xl">
                    <CardContent className="py-3 md:py-4 text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Meal Rate</p>
                        <p className="text-xl md:text-3xl font-bold text-emerald-600">৳ {mealRate}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Member Table */}
            <div className="bg-white text-black dark:bg-muted rounded-xl shadow overflow-hidden">
                <h2 className="text-lg font-semibold px-4 py-3 border-b">
                    Member Summary
                </h2>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
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
                                        <TableCell
                                            className={`font-semibold ${member.balance < 0 ? "text-red-600" : "text-green-600"
                                                }`}
                                        >
                                            ৳ {member.balance}
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

export default Home;
