import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { EntryType, MessEntryInput } from "@/lib/types&interfaces/mess";
import { Loader2 } from "lucide-react";
import { useMessStore } from "@/store/useMessStore";

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

  const [entries, setEntries] = useState<MessEntryInput[]>([]);

  useEffect(() => {
    getMessMembers();
  }, []);

  useEffect(() => {
    setEntries(
      members.map((member) => ({
        userId: member._id,
        amount: 0,
      }))
    );
  }, [members]);

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
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
        {isMeal ? "Add Meal Count" : "Add Deposit"}
      </h2>

      <div className="space-y-4">
        {members.map((member) => (
          <Card key={member._id} className="w-full">
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-sm sm:text-base">{member.name}</span>
              </div>
              <Input
                type="number"
                min="0"
                value={
                  entries.find((entry) => entry.userId === member._id)?.amount || 0
                }
                onChange={(e) =>
                  handleAmountChange(member._id, Number(e.target.value))
                }
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
          className="w-full sm:w-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
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
