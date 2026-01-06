/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessStore } from "@/store/useMessStore";
import { useAuthStore } from "@/store/useAuthStore";
import { LogOut, Phone, Mail, Copy, Check, Search, Grid3x3, List } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

export default function MyMess() {
    const { authUser } = useAuthStore();
    const { mess, members, getMessInfo, getMessMembers, leaveMess, isLoading } = useMessStore();
    const [leaveDialog, setLeaveDialog] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [copiedCode, setCopiedCode] = useState(false);

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

    const copyInviteCode = () => {
        if (mess?.code) {
            navigator.clipboard.writeText(mess.code);
            setCopiedCode(true);
            toast.success("Invite code copied!");
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const filteredAndSortedMembers = members
        .filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "role") {
                if (a.role === "admin" && b.role !== "admin") return -1;
                if (a.role !== "admin" && b.role === "admin") return 1;
                return a.name.localeCompare(b.name);
            }
            return 0;
        });

    const adminCount = members.filter(m => m.role === "admin").length;
    const memberCount = members.filter(m => m.role === "member").length;

    return (
        <div className="min-h-screen bg-[#0F1729] p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {mess && (
                    <>
                        {/* Mess Header */}
                        <div className="space-y-4">
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
                                    {mess.name}
                                </h1>
                            </div>

                            {/* Quick Stats & Actions Bar */}
                            <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        {/* Stats */}
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Users className="w-4 h-4 text-[#7E22CE]" />
                                                <span className="font-medium">{members.length} Members</span>
                                            </div>
                                            <div className="hidden sm:block h-4 w-px bg-gray-600"></div>
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <span className="text-yellow-500">👑</span>
                                                <span>{adminCount} Admin{adminCount !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="hidden sm:block h-4 w-px bg-gray-600"></div>
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <span className="text-blue-500">👤</span>
                                                <span>{memberCount} Member{memberCount !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>

                                        {/* Invite Code */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-2 px-3 py-2 bg-[#0F1729] rounded-lg border border-[#7E22CE]/20">
                                                <Code className="w-4 h-4 text-[#7E22CE]" />
                                                <span className="text-white font-mono font-semibold">{mess.code}</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={copyInviteCode}
                                                className="bg-[#7E22CE] hover:bg-[#6B1AB5] text-white border-0"
                                            >
                                                {copiedCode ? (
                                                    <Check className="w-4 h-4" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Search, Sort, View Controls */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search members..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-[#1A2332] border-[#7E22CE]/30 text-white"
                                    />
                                </div>

                                {/* Sort */}
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full sm:w-40 bg-[#1A2332] border-[#7E22CE]/30 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A2332] border-[#7E22CE]/30">
                                        <SelectItem value="name" className="text-white">Sort by Name</SelectItem>
                                        <SelectItem value="role" className="text-white">Sort by Role</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* View Toggle */}
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant={viewMode === "grid" ? "default" : "outline"}
                                        onClick={() => setViewMode("grid")}
                                        className={viewMode === "grid" ? "bg-[#7E22CE]" : "bg-[#1A2332] border-[#7E22CE]/30 text-white"}
                                    >
                                        <Grid3x3 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={viewMode === "list" ? "default" : "outline"}
                                        onClick={() => setViewMode("list")}
                                        className={viewMode === "list" ? "bg-[#7E22CE]" : "bg-[#1A2332] border-[#7E22CE]/30 text-white"}
                                    >
                                        <List className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Members List */}
                        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "grid gap-4"}>
                            {filteredAndSortedMembers.map((member) => (
                                <Card
                                    key={member._id}
                                    className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332] shadow-lg hover:shadow-[#7E22CE]/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex flex-col gap-3">
                                            {/* Member Info */}
                                            <div className="flex items-start gap-3">
                                                <Avatar className="w-16 h-16 rounded-xl border-2 border-[#7E22CE]/30 shadow-lg flex-shrink-0">
                                                    <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                                                    <AvatarFallback className="bg-gradient-to-br from-[#7E22CE] to-[#9D47DE] text-white text-sm font-semibold">
                                                        {getInitials(member.name)}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0 overflow-hidden">
                                                    <h3 className="text-base font-bold text-white truncate" title={member.name}>
                                                        {member.name}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                                        {member.role === "admin" && (
                                                            <span className="px-2 py-0.5 bg-yellow-500 text-yellow-900 text-xs font-bold rounded-full whitespace-nowrap">
                                                                ADMIN
                                                            </span>
                                                        )}
                                                        {member._id === authUser?._id && (
                                                            <span className="px-2 py-0.5 bg-blue-500 text-blue-900 text-xs font-bold rounded-full whitespace-nowrap">
                                                                YOU
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="space-y-2 pl-1">
                                                <div className="flex items-start gap-2 text-gray-300 min-w-0">
                                                    <Mail className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                                    <span className="text-xs truncate break-all" title={member.email}>
                                                        {member.email}
                                                    </span>
                                                </div>
                                                <div className="flex items-start gap-2 text-gray-300 min-w-0">
                                                    <Phone className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                                    <span className="text-xs truncate">
                                                        {member.phone || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* No Results */}
                        {filteredAndSortedMembers.length === 0 && (
                            <Card className="rounded-xl border border-[#7E22CE]/30 bg-[#1A2332]">
                                <CardContent className="p-12 text-center">
                                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-500 opacity-50" />
                                    <p className="text-gray-300">No members found matching "{searchTerm}"</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Leave Mess Button */}
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
                    </>
                )}
            </div>
        </div>
    );
}