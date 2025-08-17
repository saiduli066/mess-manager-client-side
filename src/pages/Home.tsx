import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, User } from "lucide-react";
import { useMessStore } from "@/store/useMessStore";

const Home = () => {
    const navigate = useNavigate();
    const { mess, entriesReport, getMessInfo, getMessEntries, isLoading } = useMessStore();

    useEffect(() => {
        if (!mess) getMessInfo();
    }, [mess, getMessInfo]);

    useEffect(() => {
        if (mess?._id) getMessEntries(mess._id);
    }, [mess?._id, getMessEntries]);

    if (isLoading || mess === undefined) {
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!mess?._id || mess._id.trim() === "") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
                <p className="text-lg text-amber-400">⚠️ No mess found.</p>
                <Button className="bg-indigo-700 hover:bg-indigo-900" onClick={() => navigate("/entry-options")}>
                    Go to Create/Join A Mess
                </Button>
            </div>
        );
    }

    const { totalMeals = 0, totalDeposits = 0, mealRate = 0, summary = [] } = entriesReport || {};

    const highestEater = summary.reduce(
        (prev, curr) => (curr.totalMeal > prev.totalMeal ? curr : prev),
        summary[0] || {}
    );

    const lowestGiver = summary.reduce(
        (prev, curr) => (curr.balance < prev.balance ? curr : prev),
        summary[0] || {}
    );

    return (
        <div className="p-4 space-y-6">
            <div className="text-center text-xl md:text-4xl text-medium">Current Month</div>

            {/* Highlight Cards */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Highest Eater */}
                <Card className="relative overflow-hidden rounded-3xl group hover:scale-105 transition-transform duration-300">
                    {/* Gradient animated background */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 animate-[pulse_4s_ease-in-out_infinite]"></div>

                    {/* Hover confetti */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="opacity-0 group-hover:opacity-100 hover-confetti">
                            <span>🍽️</span>
                            <span>🔥</span>
                            <span>🍗</span>
                            <span>🎉</span>
                            <span>✨</span>
                        </div>
                    </div>

                    <CardContent className="relative z-10 flex items-center space-x-4 py-5 px-6 text-white">
                        {highestEater?.image ? (
                            <img
                                src={highestEater.image}
                                alt={highestEater.name}
                                className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                            />
                        ) : (
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white/30 ring-4 ring-white shadow-lg">
                                <User className="w-8 h-8 text-white" />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold flex items-center gap-2 drop-shadow-md">
                                🔥 Highest Eater
                            </p>
                            <p className="text-2xl font-extrabold drop-shadow-lg">
                                {highestEater?.name || "N/A"}
                            </p>
                            <p className="text-sm opacity-90 drop-shadow-md">
                                Total Meals: {highestEater?.totalMeal || 0}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Lowest Balance Holder */}
                <Card className="relative overflow-hidden rounded-3xl group hover:scale-105 transition-transform duration-300">
                    {/* Gradient animated background */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-400 via-pink-400 to-red-500 animate-[pulse_4s_ease-in-out_infinite]"></div>

                    {/* Hover confetti */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                        <div className="opacity-0 group-hover:opacity-100 hover-confetti">
                            <span>💸</span>
                            <span>🔥</span>
                            <span>🍗</span>
                            <span>🎉</span>
                            <span>✨</span>
                        </div>
                    </div>

                    <CardContent className="relative z-10 flex items-center space-x-4 py-5 px-6 text-white">
                        {lowestGiver?.image ? (
                            <img
                                src={lowestGiver.image}
                                alt={lowestGiver.name}
                                className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                            />
                        ) : (
                            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white/30 ring-4 ring-white shadow-lg">
                                <User className="w-8 h-8 text-white" />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold flex items-center gap-2 drop-shadow-md">
                                💸 Lowest Balance Holder
                            </p>
                            <p className="text-2xl font-extrabold drop-shadow-lg">
                                {lowestGiver?.name || "N/A"}
                            </p>
                            <p className="text-sm opacity-90 drop-shadow-md">
                                You are: ৳ {lowestGiver?.balance || 0} behind
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <h2 className="text-lg font-semibold px-4 py-3 border-b">Member Summary</h2>

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
                                    <TableHead className="min-w-[160px]">Total Deposit</TableHead>
                                    <TableHead className="min-w-[130px]">Total Meals</TableHead>
                                    <TableHead className="min-w-[130px]">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.map((member) => (
                                    <TableRow key={member.userId} className={`
        transition-colors duration-200
        ${member.balance < 0
                                            ? "bg-red-50/100 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50"
                                            : "bg-green-50/100 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50"}
      `}>
                                        <TableCell>
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted">
                                                    <User className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{member.name}</TableCell>
                                        <TableCell>৳ {member.totalDeposit}</TableCell>
                                        <TableCell>{member.totalMeal}</TableCell>
                                        <TableCell className={`font-semibold ${member.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                                            ৳ {member.balance}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>        </div>
    );
};

export default Home;
