import { useState } from "react";
import { Clipboard } from "@ark-ui/react/clipboard";
import { Building, CheckIcon, ClipboardCopyIcon, SettingsIcon, UtensilsCrossedIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMessStore } from "@/store/useMessStore";

export const CreateMess = () => {
    const { createMess, mess, isLoading } = useMessStore();
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        await createMess(name.trim());
        setName("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f0036] to-[#3c006f] px-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl w-full max-w-md p-8 space-y-6 text-white">
                <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-3 rounded-full">
                        <Building className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold mt-2">Create a Mess</h2>
                    <p className="text-sm text-white/70">Start managing your meals together</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="mess-name" className="text-white my-2">Mess Name</Label>
                        <Input
                            id="mess-name"
                            placeholder="e.g. Sunrise Hostel"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                            className="bg-white/60 text-white  focus:ring-purple-400 border border-white/30"
                            />
                    </div>
                    <Button
                        type="submit"
                        className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create Mess"}
                    </Button>
                </form>

                {mess && (
                    <div className="pt-4 border-t border-white/20">
                        <h3 className="text-sm mb-1 text-white/80 font-semibold">Invite Code</h3>
                        <Clipboard.Root value={mess.code}>
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
                )}
            </div>
        </div>
    );
};
