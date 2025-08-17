import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User2Icon } from "lucide-react";
import { useMessStore } from "@/store/useMessStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import type { EntryType, MessEntryInput } from "@/lib/types&interfaces/mess";

const AddEntry = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMeal = location.pathname.includes("add-meal");
  const entryType: EntryType = isMeal ? "meal" : "deposit";

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
      <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
        <p className="text-lg text-amber-400">⚠️ No mess found.</p>
        <Button
          className="bg-indigo-700 hover:bg-indigo-900"
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
      <div className="flex justify-center items-center min-h-[250px] w-full px-2">
        <span className="text-lg md:text-xl font-semibold text-yellow-600 text-center">
          Only Mess Admin can add {entryType} entries.
        </span>
      </div>
    );
  }

  //Admin but not part of any mess
  if (!members?.length) {
    return (
      <div className="flex justify-center items-center min-h-[250px] w-full px-4">
        <span className="text-lg md:text-xl font-semibold text-red-600 text-center">
          ⚠️ Join a mess first to add {entryType} entries.
        </span>
      </div>
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
    await addMessEntry(entryType, entries);
    setEntries((prev) => prev.map((entry) => ({ ...entry, amount: 0 })));
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-white">
        {isMeal ? "Add Meal Count" : "Add Deposit"}
      </h2>

      <div className="space-y-4">
        {members.map((member) => (
          <Card
            key={member._id}
            className="w-[70%] md:w-[60%] mx-auto bg-gradient-to-tr from-purple-900/80 via-gray-900/70 to-gray-800/80 border border-purple-700 shadow-xl rounded-xl hover:scale-[1.02] hover:shadow-2xl transition-transform"
          >
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5">
              <div className="flex items-center gap-4">
                {member?.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-600 shadow"
                  />
                ) : (
                  <Avatar>
                    <AvatarFallback className="bg-purple-800 text-purple-200 w-full h-full flex justify-center items-center">
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
                className="w-full sm:w-36 bg-gray-800/80 border border-purple-700 text-white placeholder:text-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-400"
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
          className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 mb-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
