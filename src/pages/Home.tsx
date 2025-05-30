import { Utensils, Wallet, DollarSign, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import GoBackBtn from "@/components/GoBackBtn"

const Home = () => {
    // Sample data for now
    const totalMeals = 245
    const totalCost = 12500.50
    const totalBalance = 3200.75
    const totalMembers = 8

    const members = [
        { id: 1, name: "John Doe", avatar: "", totalMeals: 30, mealRate: 45.50, totalCost: 1365.00, deposit: 1500.00, balance: 135.00 },
        { id: 2, name: "Jane Smith", avatar: "", totalMeals: 28, mealRate: 45.50, totalCost: 1274.00, deposit: 1200.00, balance: -74.00 },
        { id: 3, name: "Alex Johnson", avatar: "", totalMeals: 32, mealRate: 45.50, totalCost: 1456.00, deposit: 1400.00, balance: -56.00 },
        { id: 4, name: "Sarah Williams", avatar: "", totalMeals: 29, mealRate: 45.50, totalCost: 1319.50, deposit: 1500.00, balance: 180.50 },
        { id: 5, name: "Michael Brown", avatar: "", totalMeals: 31, mealRate: 45.50, totalCost: 1410.50, deposit: 1600.00, balance: 189.50 },
    ]





    return (
        <div className=" p-4 relative">

           

            {/* Header Section */}
            <div className="z-40 mb-4 w-full sm:m-4">
                <h2 className="text-lg sm:text-xl font-semibold bg-[#121b31] text-center">Overview for May 2025</h2>

            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 ">
                <Card className="min-w-0">
                    <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Meals</p>
                            <h3 className="text-xl sm:text-2xl font-bold truncate">{totalMeals}</h3>
                        </div>
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center ml-2">
                            <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-w-0">
                    <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Cost</p>
                            <h3 className="text-xl sm:text-2xl font-bold truncate">{totalCost.toFixed(2)}</h3>
                        </div>
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center ml-2">
                            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-w-0">
                    <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Balance</p>
                            <h3 className="text-xl sm:text-2xl font-bold truncate">{totalBalance.toFixed(2)}</h3>
                        </div>
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center ml-2">
                            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="min-w-0">
                    <CardContent className="p-4 sm:p-6 flex items-center justify-between">
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Members</p>
                            <h3 className="text-xl sm:text-2xl font-bold truncate">{totalMembers}</h3>
                        </div>
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center ml-2">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Members Table - Mobile Optimized */}
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Member Details</h2>
            <div className="rounded-md border overflow-hidden">
                <div className="w-full overflow-x-auto">
                    <Table className="min-w-[600px] sm:min-w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px] sm:w-[200px]">Member</TableHead>
                                <TableHead className="text-center">Meals</TableHead>
                                <TableHead className="text-center">Rate</TableHead>
                                <TableHead className="text-center">Cost</TableHead>
                                <TableHead className="text-center">Deposit</TableHead>
                                <TableHead className="text-center">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium py-2 sm:py-3">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm sm:text-base">{member.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center py-2 sm:py-3 text-sm sm:text-base">{member.totalMeals}</TableCell>
                                    <TableCell className="text-center py-2 sm:py-3 text-sm sm:text-base">{member.mealRate.toFixed(2)}</TableCell>
                                    <TableCell className="text-center py-2 sm:py-3 text-sm sm:text-base">{member.totalCost.toFixed(2)}</TableCell>
                                    <TableCell className="text-center py-2 sm:py-3 text-sm sm:text-base">{member.deposit.toFixed(2)}</TableCell>
                                    <TableCell className={`text-center py-2 sm:py-3 text-sm sm:text-base ${member.balance >= 0 ? "text-green-500" : "text-red-500"
                                        }`}>
                                        {member.balance.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default Home;