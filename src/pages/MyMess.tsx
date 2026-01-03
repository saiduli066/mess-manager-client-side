/* eslint-disable @typescript-eslint/no-unused-vars */
// components/MyMess.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessStore } from "@/store/useMessStore";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MyMess() {
    const { authUser } = useAuthStore();
    const { mess, members, getMessInfo, getMessMembers, leaveMess, isLoading } = useMessStore();
    const [leaveDialog, setLeaveDialog] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!mess) getMessInfo();
    }, [mess, getMessInfo]);

    useEffect(() => {
        if (mess?._id) {
            getMessMembers();
        }
    }, [mess?._id, getMessMembers]);

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
            <div className="min-h-screen bg-[#0F1729] p-6 flex items-center justify-center">
                <Card className="w-full max-w-md mx-auto bg-[#1A2332] border border-[#7E22CE]/30">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#7E22CE]/20 flex items-center justify-center">
                            <Users className="w-8 h-8 text-[#9D47DE]" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Mess Found</h3>
                        <p className="text-gray-300 mb-6">
                            You are not currently a member of any mess.
                        </p>
                        <Button
                            className="bg-[#7E22CE] hover:bg-[#6B1AB5] text-white"
                            onClick={() => window.location.href = "/entry-options"}
                        >
                            Join or Create a Mess
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleLeaveMess = async () => {
        setProcessing(true);
        try {
            await leaveMess();
            toast.success("Successfully left the mess!", {
                description: "Your historical data has been preserved."
            });
            setLeaveDialog(false);
        } catch (error) {
            // Error handled in store
        } finally {
            setProcessing(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-[#0F1729] p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Mess Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
                        {mess.name}
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-300">
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{members.length} Members</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            <span>Code: {mess.code}</span>
                        </div>
                    </div>
                </div>

                {/* Members List */}
                <div className="grid gap-4">
                    {members.map((member) => (
                        <Card
                            key={member._id}
                            className="rounded-2xl border border-[#7E22CE]/30 bg-[#1A2332] shadow-lg hover:shadow-[#7E22CE]/20 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <CardContent className="p-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    {/* Member Info */}
                                    <div className="flex items-start gap-4 flex-1">
                                        <Avatar className="w-20 h-20 rounded-xl border-4 border-[#7E22CE]/30 shadow-lg">
                                            <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                                            <AvatarFallback className="bg-gradient-to-br from-[#7E22CE] to-[#9D47DE] text-white text-lg font-semibold">
                                                {getInitials(member.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-bold text-white truncate">
                                                    {member.name}
                                                </h3>
                                                {member.role === "admin" && (
                                                    <span className="px-2 py-1 bg-yellow-500 text-yellow-900 text-xs font-bold rounded-full">
                                                        ADMIN
                                                    </span>
                                                )}
                                                {member._id === authUser?._id && (
                                                    <span className="px-2 py-1 bg-blue-500 text-blue-900 text-xs font-bold rounded-full">
                                                        YOU
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Mail className="w-4 h-4" />
                                                    <span className="text-sm truncate">{member.email}</span>
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Phone className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        {member.phone || "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Role Display */}
                                            <div className="mt-3">
                                                <span className="text-sm text-gray-400 capitalize">
                                                    Role: {member.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Leave Mess Button */}
                {mess && (
                    <div className="flex justify-center pt-8">
                        <Button
                            variant="destructive"
                            onClick={() => setLeaveDialog(true)}
                            disabled={processing}
                            className="rounded-2xl bg-red-600 hover:bg-red-700 hover:scale-105 transition-all duration-200 shadow-lg px-8 py-6 text-lg font-semibold"
                        >
                            {processing ? (
                                <>
                                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                    Leaving...
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-5 h-5 mr-2" />
                                    Leave Mess
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            {/* Leave Mess Confirmation Dialog */}
            <AlertDialog open={leaveDialog} onOpenChange={setLeaveDialog}>
                <AlertDialogContent className="bg-[#1A2332] border-[#7E22CE]/30">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-white">
                            <LogOut className="w-5 h-5 text-red-400" />
                            Leave Mess Confirmation
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-300">
                            Are you sure you want to leave <strong className="text-white">{mess?.name}</strong>?
                            <br /><br />
                            ✅ <strong>Your historical data will be preserved</strong> in past records
                            <br />
                            ❌ You will lose access to current mess activities
                            <br />
                            ❌ Your meal switches will be disabled
                            <br />
                            ❌ You won't be able to make new deposits
                            <br /><br />
                            You can always join another mess later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#1A2332] border-[#7E22CE]/30 text-white hover:bg-[#0F1729]">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLeaveMess}
                            disabled={processing}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {processing ? (
                                <>
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                    Leaving...
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Yes, Leave Mess
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div >
    );
}

// Add the missing icons
const Users = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
);

const Code = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);