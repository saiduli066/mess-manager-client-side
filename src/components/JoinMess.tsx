import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMessStore } from "@/store/useMessStore";


export const JoinMess = () => {
    const { joinMess, isLoading } = useMessStore();
    const [code, setCode] = useState("");
    const [searchParams] = useSearchParams();
    const [hasAutoJoined, setHasAutoJoined] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const inviteCode = searchParams.get("code");

        //  auto-join if code is present.
        if (inviteCode && !hasAutoJoined) {
            setCode(inviteCode);
            joinMess(inviteCode);
            setHasAutoJoined(true);
        }
    }, [searchParams, hasAutoJoined, joinMess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await joinMess(code.trim());
        navigate("/home");
        setCode("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f0036] to-[#3c006f] px-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl w-full max-w-md p-8 space-y-6 text-white">
                <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-3 rounded-full">
                        <PlusCircleIcon className="text-white w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold mt-2">Join a Mess</h2>
                    <p className="text-sm text-white/70">Paste the invite code shared with you</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="invite-code" className="text-white my-2">Invite Code</Label>
                        <Input
                            id="invite-code"
                            placeholder="e.g. 8f3a1d9c"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={isLoading}
                            className="bg-white/60 text-white focus:ring-purple-400 border border-white/30"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 text-white font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? "Joining..." : "Join Mess"}
                    </Button>
                </form>
            </div>
        </div>
    );
};
