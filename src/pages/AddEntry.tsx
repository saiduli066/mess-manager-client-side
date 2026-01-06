import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User2Icon } from "lucide-react";
import { useMessStore } from "@/store/useMessStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import type { MessEntryInput } from "@/lib/types&interfaces/mess";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import NoMessFound from "@/components/NoMessFound";
type EntryType = "deposit" | "meal";

const AddEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMeal = location.pathname.includes("add-meal");
  // const entryType: EntryType = isMeal ? "meal" : "deposit";
  const entryType: EntryType = isMeal ? "meal" : "deposit";

  const { checkOnlineAndWarn } = useOnlineStatus();

  const {
    mess,
    members,
    isLoading,
    getMessMembers,
    getMessEntries,
    addMessEntry,
  } = useMessStore();

  const { authUser } = useAuthStore();
  const [entries, setEntries] = useState<MessEntryInput[]>([]);

  useEffect(() => {
    getMessMembers();
  }, [getMessMembers]);

  useEffect(() => {
    if (mess?._id) {
      getMessEntries(mess._id);
    }
  }, [mess?._id, getMessEntries]);

  useEffect(() => {
    setEntries(
      members.map((member) => ({
        userId: member._id,
        amount: 0,
      }))
    );
  }, [members]);

  //  Show if no mess is available
  if (!mess?._id || mess._id.trim() === "") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center space-y-4 bg-[#0F1729]">
        <p className="text-lg text-amber-400">⚠️ No mess found.</p>
        <Button
          className="bg-[#7E22CE] hover:bg-[#6B1AB5]"
          onClick={() => navigate("/entry-options")}
        >
          Go to Create/Join A Mess
        </Button>
      </div>
    );
  }

  //  Restrict regular members
  if (authUser?.role === "member") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(to bottom, #0F1729, #1A2332)",
        }}
      >
        <Card className="w-full max-w-md mx-auto shadow-2xl border-[#7E22CE]/30 rounded-2xl overflow-hidden bg-[#1A2332]"
          style={{
            borderColor: "rgba(126, 34, 206, 0.3)",
          }}
        >
          <div className="p-6 border-b border-[#7E22CE]/20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-500/10 backdrop-blur-sm border-2 border-red-500/30">
              <User2Icon className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-center text-red-400">
              Access Restricted
            </h3>
          </div>
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-gray-300 text-lg leading-relaxed">
              Only <span className="text-[#9D47DE] font-semibold">Mess Admin</span> can add {entryType} entries.
            </p>
            <p className="text-gray-400 text-sm">
              Contact your mess admin if you need to make {entryType} updates.
            </p>
            <Button
              onClick={() => window.location.href = "/home"}
              className="w-full mt-6 bg-gradient-to-r from-[#7E22CE] to-[#9D47DE] hover:from-[#6B1AB5] hover:to-[#7E22CE] text-white font-medium py-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-[#7E22CE]/50"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  //Admin but not part of any mess
  if (!members?.length) {
    return (
      <NoMessFound
        message={`Join a mess first to add ${entryType} entries.`}
      />
    );
  }

  const handleAmountChange = (userId: string, value: number) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.userId === userId ? { ...entry, amount: value } : entry
      )
    );
  };

  const handleSubmit = async () => {
    if (!checkOnlineAndWarn(`add ${isMeal ? 'meal entries' : 'deposits'}`)) {
      return;
    }
    await addMessEntry(entries);
    setEntries((prev) => prev.map((entry) => ({ ...entry, amount: 0 })));
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-6 min-h-screen bg-[#0F1729]">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">
        {isMeal ? "Add Meal Count" : "Add Deposit"}
      </h2>

      <div className="space-y-4">
        {members.map((member) => (
          <Card
            key={member._id}
            className="w-[70%] md:w-[60%] mx-auto bg-[#1A2332] border border-[#7E22CE]/30 shadow-xl rounded-xl hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#7E22CE]/20 transition-transform"
          >
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5">
              <div className="flex items-center gap-4">
                {member?.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#7E22CE] shadow"
                  />
                ) : (
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-[#7E22CE] to-[#9D47DE] text-white w-full h-full flex justify-center items-center">
                      <User2Icon className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="text-lg font-semibold text-white drop-shadow">
                  {member.name}
                </span>
              </div>
              <Input
                type="number"
                min={0}
                value={
                  entries.find((entry) => entry.userId === member._id)
                    ?.amount || 0
                }
                onChange={(e) =>
                  handleAmountChange(member._id, Number(e.target.value))
                }
                className="w-full sm:w-36 bg-[#0F1729] border border-[#7E22CE]/30 text-white placeholder:text-gray-400 focus:border-[#7E22CE] focus:ring-2 focus:ring-[#7E22CE]/50"
                placeholder={`Enter ${isMeal ? "meal count" : "amount"}`}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full sm:w-auto bg-[#7E22CE] hover:bg-[#6B1AB5] mb-4"
        >
          {isLoading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Loading...
            </>
          ) : (
            `Add ${isMeal ? "Meal" : "Deposit"}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddEntry;
