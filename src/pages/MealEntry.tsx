import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMessStore } from "@/store/useMessStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Utensils, Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import RippleLoader from "@/components/RippleLoader";

interface MemberMeal {
    userId: string;
    name: string;
    image: string;
    role: string;
    lunch: number;
    dinner: number;
    lunchUseInput: boolean;
    dinnerUseInput: boolean;
}

import NoMessFound from "@/components/NoMessFound";

const MealEntry = () => {
    const today = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [members, setMembers] = useState<MemberMeal[]>([]);
    const [useInputMode, setUseInputMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { authUser } = useAuthStore();
    const { getMealsForDate, submitMeals } = useMessStore();

    // Load meal data for selected date
    const loadMealsForDate = async () => {
        try {
            setLoading(true);
            const data = await getMealsForDate(selectedDate);

            // Initialize members with meal data
            const membersData = data.members.map((member: { userId: string; name: string; image: string; role: string; lunch: number; dinner: number }) => ({
                userId: member.userId,
                name: member.name,
                image: member.image,
                role: member.role,
                lunch: member.lunch || 0,
                dinner: member.dinner || 0,
                lunchUseInput: member.lunch > 0 && member.lunch !== 1,
                dinnerUseInput: member.dinner > 0 && member.dinner !== 1,
            }));

            setMembers(membersData);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to load meal data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authUser?.messId) {
            loadMealsForDate();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, authUser]);

    const handleCheckboxChange = (
        memberId: string,
        mealType: "lunch" | "dinner",
        checked: boolean
    ) => {
        setMembers((prev) =>
            prev.map((member) => {
                if (member.userId === memberId) {
                    return {
                        ...member,
                        [mealType]: checked ? 1 : 0,
                        [`${mealType}UseInput`]: false,
                    };
                }
                return member;
            })
        );
    };

    const handleInputChange = (
        memberId: string,
        mealType: "lunch" | "dinner",
        value: string
    ) => {
        const numValue = parseFloat(value) || 0;
        setMembers((prev) =>
            prev.map((member) => {
                if (member.userId === memberId) {
                    return {
                        ...member,
                        [mealType]: numValue >= 0 ? numValue : 0,
                    };
                }
                return member;
            })
        );
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            // Prepare meals data
            const mealsData = members.map((member) => ({
                userId: member.userId,
                lunch: member.lunch,
                dinner: member.dinner,
            }));

            await submitMeals(selectedDate, mealsData);
            toast.success("Meals submitted successfully!");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Failed to submit meals");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleAllInputMode = (checked: boolean) => {
        setUseInputMode(checked);
        setMembers((prev) =>
            prev.map((member) => ({
                ...member,
                lunchUseInput: checked,
                dinnerUseInput: checked,
                lunch: checked ? member.lunch : member.lunch > 0 ? 1 : 0,
                dinner: checked ? member.dinner : member.dinner > 0 ? 1 : 0,
            }))
        );
    };

    if (!authUser?.messId) {
        return (
            <NoMessFound message="You need to join a mess to use the meal management system." />
        );
    }

    if (authUser?.role !== "admin") {
        return (
            <RippleLoader size="lg" />
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6 p-4 sm:p-6 min-h-screen bg-[#0F1729]">
            {/* Header */}
            <Card className="rounded-xl shadow-md border border-[#7E22CE]/30 bg-[#1A2332]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold text-white">
                        <Utensils className="w-6 h-6" />
                        Meal Count Entry
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row md:justify-between items-center">
                        {/* Date Picker */}
                        <div className="space-y-2 ">
                            <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2 text-gray-300">
                                <Calendar className="w-4 h-4" />
                                Select Date:
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="max-w-xs border-[#7E22CE] text-white font-medium transition-colors [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:saturate-100 [&::-webkit-calendar-picker-indicator]:hue-rotate-[270deg]"
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>

                        {/* Global meal Input  */}
                        <div className="flex gap-2 md:gap-4">
                            <Label htmlFor="global-input-mode" className="sm:text-sm md:text-md  font-medium cursor-pointer text-gray-300">
                                Enable input fields for custom meal counts
                            </Label>
                            <div className="flex items-center space-x-2 p-2  border border-[#7E22CE] rounded-lg shadow-md">
                                <Switch
                                    id="global-input-mode"
                                    checked={useInputMode}
                                    onCheckedChange={toggleAllInputMode}
                                />

                            </div>

                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Members Table */}
            <Card className="rounded-xl shadow-md border border-[#7E22CE]/30 bg-[#1A2332]">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">
                        Members Meal Counts
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7E22CE] mx-auto mb-4"></div>
                            <p className="text-gray-300">Loading meal data...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-[#7E22CE]/30">
                                        <th className="text-left p-3 font-semibold text-gray-300">Member</th>
                                        <th className="text-center p-3 font-semibold text-gray-300">Lunch</th>
                                        <th className="text-center p-3 font-semibold text-gray-300">Dinner</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {members.map((member) => (
                                        <tr key={member.userId} className="border-b border-[#7E22CE]/10 hover:bg-[#7E22CE]/10">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    {member.image ? (
                                                        <img
                                                            src={member.image}
                                                            alt={member.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7E22CE] to-[#9D47DE] flex items-center justify-center text-white font-semibold">
                                                            {member.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-white">{member.name}</p>
                                                        {member.role === "admin" && (
                                                            <span className="text-xs text-[#9D47DE] font-medium">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    {member.lunchUseInput ? (
                                                        <Input
                                                            type="number"
                                                            step="0.5"
                                                            min="0"
                                                            value={member.lunch}
                                                            onChange={(e) =>
                                                                handleInputChange(member.userId, "lunch", e.target.value)
                                                            }
                                                            className="w-24 text-center bg-[#0F1729] border-[#7E22CE]/30 text-white"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="checkbox"
                                                            checked={member.lunch > 0}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(
                                                                    member.userId,
                                                                    "lunch",
                                                                    e.target.checked
                                                                )
                                                            }
                                                            className="w-5 h-5 cursor-pointer accent-[#7E22CE]"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    {member.dinnerUseInput ? (
                                                        <Input
                                                            type="number"
                                                            step="0.5"
                                                            min="0"
                                                            value={member.dinner}
                                                            onChange={(e) =>
                                                                handleInputChange(member.userId, "dinner", e.target.value)
                                                            }
                                                            className="w-24 text-center bg-[#0F1729] border-[#7E22CE]/30 text-white"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="checkbox"
                                                            checked={member.dinner > 0}
                                                            onChange={(e) =>
                                                                handleCheckboxChange(
                                                                    member.userId,
                                                                    "dinner",
                                                                    e.target.checked
                                                                )
                                                            }
                                                            className="w-5 h-5 cursor-pointer accent-[#7E22CE]"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-center">
                        <Button
                            onClick={handleSubmit}
                            disabled={submitting || loading || members.length === 0}
                            className="px-8 py-6 text-lg font-semibold bg-[#7E22CE] hover:bg-[#6B1AB5]"
                            size="lg"
                        >
                            {submitting ? (
                                <>
                                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                    Submitting...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>


        </div>
    );
};

export default MealEntry;
