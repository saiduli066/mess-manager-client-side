// pages/Home.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { User, TrendingUp, Wallet, UtensilsCrossed, DollarSign, Award, AlertCircle } from "lucide-react";
import { useMessStore } from "@/store/useMessStore";

const Home = () => {
    const navigate = useNavigate();
    const { mess, entriesReport, getMessInfo, getMessEntries, isLoading } = useMessStore();

    useEffect(() => {
        if (!mess) getMessInfo();
    }, [mess, getMessInfo]);

    useEffect(() => {
        if (mess?._id) {
            // Explicitly fetch current month's data
            const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
            const currentYear = String(new Date().getFullYear());
            getMessEntries(mess._id, currentMonth, currentYear);
        }
    }, [mess?._id, getMessEntries]);

    if (isLoading || mess === undefined) {
        return (
            <div className="h-screen w-full flex flex-col justify-center items-center bg-[#0F1729]">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7E22CE]"></div>
                <p className="mt-4 text-gray-400">Loading...</p>
            </div>
        );
    }

    if (!mess?._id || mess._id.trim() === "") {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 bg-[#0F1729] p-4">
                <div className="bg-[#1A2332] rounded-3xl p-8 shadow-2xl max-w-md text-center space-y-4 border border-[#7E22CE]/20">
                    <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-white">No Mess Found</h2>
                    <p className="text-gray-300">Join or create a mess to get started</p>
                    <Button
                        className="w-full bg-[#7E22CE] hover:bg-[#6B1AB5] text-white shadow-lg"
                        onClick={() => navigate("/entry-options")}
                    >
                        Get Started
                    </Button>
                </div>
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
        <div className="min-h-screen bg-[#0F1729] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2 px-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white break-words">
                        {mess.name}
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg">Current Month Overview</p>
                </div>

                {/* Highlight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Highest Eater */}
                    <Card className="relative overflow-hidden rounded-3xl border border-[#7E22CE]/30 shadow-2xl hover:shadow-[#7E22CE]/20 transition-all duration-300 hover:scale-[1.02] bg-[#1A2332]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#7E22CE]/20 via-[#9D47DE]/10 to-transparent"></div>

                        <CardContent className="relative z-10 p-3 sm:p-4">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <div className="p-2 bg-[#7E22CE]/20 backdrop-blur-sm rounded-xl border border-[#7E22CE]/30">
                                        <Award className="w-5 h-5 text-[#9D47DE]" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-medium">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="bg-amber-300 text-white p-1 pb-0.5 rounded-sm cursor-help">Top Eater</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Highest meal consumer</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </p>
                                        <p className="text-white text-base sm:text-lg font-bold truncate">{highestEater?.name || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                    <div className="text-right">
                                        <p className="text-gray-400 text-xs mb-0.5">Meals</p>
                                        <p className="text-white text-lg sm:text-xl font-bold">{highestEater?.totalMeal || 0}</p>
                                    </div>
                                    {highestEater?.image ? (
                                        <img
                                            src={highestEater.image}
                                            alt={highestEater.name}
                                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover ring-2 ring-[#7E22CE]/30 shadow-xl"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl bg-[#7E22CE]/20 ring-2 ring-[#7E22CE]/30">
                                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#9D47DE]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lowest Balance */}
                    <Card className="relative overflow-hidden rounded-3xl border border-[#7E22CE]/30 shadow-2xl hover:shadow-[#7E22CE]/20 transition-all duration-300 hover:scale-[1.02] bg-[#1A2332]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9D47DE]/20 via-[#7E22CE]/10 to-transparent"></div>

                        <CardContent className="relative z-10 p-3 sm:p-4">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <div className="p-2 bg-[#7E22CE]/20 backdrop-blur-sm rounded-xl border border-[#7E22CE]/30">
                                        <TrendingUp className="w-5 h-5 text-[#9D47DE]" />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-medium">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="bg-amber-300 text-white p-1 pb-0.5 rounded-sm cursor-help">Needs Deposit</span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Lowest balance holder</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </p>

                                        <p className="text-white text-base sm:text-lg font-bold truncate">{lowestGiver?.name || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                    <div className="text-right">
                                        <p className="text-gray-400 text-xs mb-0.5">Balance</p>
                                        <p className="text-white text-lg sm:text-xl font-bold">৳ {lowestGiver?.balance || 0}</p>
                                    </div>
                                    {lowestGiver?.image ? (
                                        <img
                                            src={lowestGiver.image}
                                            alt={lowestGiver.name}
                                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover ring-2 ring-[#7E22CE]/30 shadow-xl"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl bg-[#7E22CE]/20 ring-2 ring-[#7E22CE]/30">
                                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-[#9D47DE]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: User, label: "Members", value: summary.length, color: "from-[#7E22CE] to-[#9D47DE]" },
                        { icon: Wallet, label: "Total Deposit", value: `৳ ${totalDeposits}`, color: "from-[#9D47DE] to-[#7E22CE]" },
                        { icon: UtensilsCrossed, label: "Total Meals", value: totalMeals, color: "from-[#7E22CE] to-[#9D47DE]" },
                        { icon: DollarSign, label: "Meal Rate", value: `৳ ${mealRate.toFixed(2)}`, color: "from-[#9D47DE] to-[#7E22CE]" },
                    ].map((stat, idx) => (
                        <Card key={idx} className="border border-[#7E22CE]/30 shadow-lg hover:shadow-[#7E22CE]/20 transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden bg-[#1A2332]">
                            <CardContent className="p-3">
                                <div className={`w-12 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400 mb-0.5 truncate">{stat.label}</p>
                                <p className="text-xl sm:text-2xl font-bold text-white truncate">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Member Table */}
                <Card className="border border-[#7E22CE]/30 shadow-2xl rounded-3xl overflow-hidden bg-[#1A2332]">
                    <div className="bg-gradient-to-r from-[#7E22CE] to-[#9D47DE] px-4 sm:px-6 py-3">
                        <h2 className="text-lg sm:text-xl font-bold text-white">Member Summary</h2>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center py-12">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7E22CE]"></div>
                            <p className="mt-4 text-gray-400 text-sm">Loading members...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#0F1729]/50 border-b-2 border-[#7E22CE]/20 hover:bg-[#0F1729]/50">
                                        <TableHead className="font-semibold text-gray-300">Member</TableHead>
                                        <TableHead className="font-semibold text-gray-300">Total Deposit</TableHead>
                                        <TableHead className="font-semibold text-gray-300">Total Meals</TableHead>
                                        <TableHead className="font-semibold text-gray-300">Balance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {summary.map((member, idx) => (
                                        <TableRow
                                            key={member.userId}
                                            className={`transition-all duration-200 hover:bg-[#7E22CE]/10 border-b border-[#7E22CE]/10 ${idx % 2 === 0 ? "bg-[#1A2332]" : "bg-[#0F1729]/50"
                                                }`}
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {member.image ? (
                                                        <img src={member.image} alt={member.name} className="h-10 w-10 rounded-xl object-cover shadow-md border border-[#7E22CE]/30" />
                                                    ) : (
                                                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#7E22CE] to-[#9D47DE] shadow-md">
                                                            <User className="w-5 h-5 text-white" />
                                                        </div>
                                                    )}
                                                    <span className="font-medium text-white">{member.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-300">৳ {member.totalDeposit}</TableCell>
                                            <TableCell className="text-gray-300">{member.totalMeal}</TableCell>
                                            <TableCell>
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${member.balance < 0
                                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                                    : "bg-green-500/20 text-green-400 border border-green-500/30"
                                                    }`}>
                                                    ৳ {member.balance}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Home;