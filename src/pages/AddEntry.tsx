import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { EntryType, MessEntryInput } from "@/lib/types&interfaces/mess";
import { Loader2,  User2Icon } from "lucide-react";
import { useMessStore } from "@/store/useMessStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";

const AddEntry = () => {
  const location = useLocation();
  const isMeal = location.pathname.includes("add-meal");
  const entryType: EntryType = isMeal ? "meal" : "deposit";

  const {
    members,
    isLoading,
    getMessMembers,
    addMessEntry,
  } = useMessStore();

  const { authUser } = useAuthStore();

 

  const [entries, setEntries] = useState<MessEntryInput[]>([]);

  useEffect(() => {
    getMessMembers();
  }, [getMessMembers]);
  

  useEffect(() => {
    setEntries(
      members.map((member) => ({
        userId: member._id,
        amount: 0,
      }))
    );
  }, [members]);


  if (authUser?.role === "member") {
    return (
    <div className="flex justify-center items-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px] w-full px-2">
        <span className="text-base sm:text-lg md:text-xl font-semibold text-yellow-600 text-center">
          Only Mess Admin can add deposit/meal entries.
        </span>
      </div>
    )
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
    <div className="w-full  px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
        {isMeal ? "Add Meal Count" : "Add Deposit"}
      </h2>

      <div className="space-y-4 ">
        {members.map((member) => (
          <Card
            key={member._id}
            className="text-white bg-gray-900 bg-opacity-30 backdrop-blur-sm rounded-md border border-gray-600 shadow-lg"
            >
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3">
              <div className="flex items-center gap-3">
            {member?.image?    <img
                  src={member.image}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />:<Avatar>
                  <AvatarFallback className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
                    <User2Icon className="w-10 h-10 text-gray-400" />
                  </AvatarFallback></Avatar>}
                <span className=" text-sm sm:text-base font-medium">
                  {member.name}
                </span>
              </div>
              <Input
                type="number"
                min={0}
                value={
                  entries.find((entry) => entry.userId === member._id)?.amount || 0
                }
                onChange={(e) => handleAmountChange(member._id, Number(e.target.value))}
                className="w-full sm:w-32"
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
              Loading...            </>
          ) : (
            `Add ${isMeal ? "Meal" : "Deposit"}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddEntry;
