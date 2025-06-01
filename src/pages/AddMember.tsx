import { useEffect } from "react";
import { useMessStore } from "@/store/useMessStore";
import { Clipboard } from "@ark-ui/react/clipboard";
import { ClipboardCopyIcon, CheckIcon, UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const AddMember = () => {
    const { mess, getMessInfo, isLoading } = useMessStore();

    useEffect(() => {
        if (!mess) getMessInfo();
    }, [mess, getMessInfo]);

    const inviteCode = mess?.code || "";
    const inviteLink = `${window.location.origin}/join-mess?code=${inviteCode}`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  px-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl w-full max-w-md p-8 space-y-6 text-white">
                <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-3 rounded-full">
                        <UserPlusIcon className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold mt-2">Add New Member</h2>
                    <p className="text-sm text-white/70 text-center">
                        Share the invite code or link below with your friend to let them join your mess.
                    </p>
                </div>

                {/* Invite Code */}
                <div className="space-y-2">
                    <Label className="text-white/80">Invite Code</Label>
                    <Clipboard.Root value={inviteCode}>
                        <Clipboard.Control className="flex items-center gap-2 border border-white/30 bg-white/20 rounded px-3 py-2 text-white text-sm font-mono">
                            <Clipboard.Input readOnly className="bg-transparent outline-none flex-1" />
                            <Clipboard.Trigger>
                                <Clipboard.Indicator copied={<CheckIcon className="text-green-400" />}>
                                    <ClipboardCopyIcon className="w-4 h-4 cursor-pointer" />
                                </Clipboard.Indicator>
                            </Clipboard.Trigger>
                        </Clipboard.Control>
                    </Clipboard.Root>
                </div>

                {/* Invite Link */}
                <div className="space-y-2">
                    <Label className="text-white/80">Invite Link</Label>
                    <Clipboard.Root value={inviteLink}>
                        <Clipboard.Control className="flex items-center gap-2 border border-white/30 bg-white/20 rounded px-3 py-2 text-white text-sm font-mono overflow-x-auto">
                            <Clipboard.Input readOnly className="bg-transparent outline-none flex-1" />
                            <Clipboard.Trigger>
                                <Clipboard.Indicator copied={<CheckIcon className="text-green-400" />}>
                                    <ClipboardCopyIcon className="w-4 h-4 cursor-pointer" />
                                </Clipboard.Indicator>
                            </Clipboard.Trigger>
                        </Clipboard.Control>
                    </Clipboard.Root>
                </div>

                <Button
                    variant="ghost"
                    className="w-full text-white mt-2 hover:bg-white/20 transition"
                    onClick={() => window.open(`/join-mess?code=${inviteCode}`, "_blank")}
                    disabled={!inviteCode}
                >
                    Preview Join Page
                </Button>
            </div>
        </div>
    );
};
