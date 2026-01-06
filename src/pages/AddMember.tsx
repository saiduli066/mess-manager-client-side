import { useEffect } from "react";
import { useMessStore } from "@/store/useMessStore";
import { Clipboard } from "@ark-ui/react/clipboard";
import { UserPlus, Users, Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const AddMember = () => {
    const { mess, getMessInfo, isLoading } = useMessStore();

    useEffect(() => {
        if (!mess) getMessInfo();
    }, [mess, getMessInfo]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0F1729]">
                <div className="flex flex-col items-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7E22CE]"></div>
                    <p className="mt-4 text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    const inviteCode = mess?.code || "";

    return (
        <div className="min-h-screen bg-[#0F1729] p-4 sm:p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7E22CE] to-[#9D47DE] flex items-center justify-center">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Add New Member</h1>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Share the invite code below to let others join your mess
                    </p>
                </div>

                {/* Main Card */}
                <Card className="border-[#7E22CE]/30 shadow-2xl bg-[#1A2332]">
                    <CardContent className="p-6 sm:p-8 space-y-6">
                        {/* Invite Code Section */}
                        <div className="space-y-3">
                            <Label className="text-white text-sm font-medium">Invite Code</Label>
                            <Clipboard.Root value={inviteCode}>
                                <Clipboard.Control className="flex items-center gap-3 border border-[#7E22CE]/30 bg-[#0F1729] rounded-lg px-4 py-3">
                                    <Clipboard.Input
                                        readOnly
                                        className="bg-transparent outline-none flex-1 text-white font-mono text-lg tracking-wider"
                                    />
                                    <Clipboard.Trigger className="flex-shrink-0">
                                        <Clipboard.Indicator copied={
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                <Check className="w-4 h-4 mr-2" />
                                                Copied
                                            </Button>
                                        }>
                                            <Button size="sm" className="bg-[#7E22CE] hover:bg-[#6B1AB5]">
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy
                                            </Button>
                                        </Clipboard.Indicator>
                                    </Clipboard.Trigger>
                                </Clipboard.Control>
                            </Clipboard.Root>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#7E22CE]/20"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-[#1A2332] text-gray-400">How to use</span>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7E22CE]/20 flex items-center justify-center text-[#9D47DE] font-semibold text-sm">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Copy the invite code</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Click the "Copy" button to copy the code to your clipboard
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7E22CE]/20 flex items-center justify-center text-[#9D47DE] font-semibold text-sm">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">Share with your friend</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Send the code via messaging app, email, or in person
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7E22CE]/20 flex items-center justify-center text-[#9D47DE] font-semibold text-sm">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-white font-medium">They join your mess</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Your friend completes signup, then enters the code in "Join Mess" to become a member
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="border-[#7E22CE]/30 bg-[#1A2332]">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-[#9D47DE] flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-white font-medium text-sm">Current Mess: {mess?.name}</h4>
                                <p className="text-xs text-gray-400 mt-1">
                                    New members will be added to this mess automatically after using the code
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
