import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldOff } from "lucide-react";

export default function AdminPanel() {
  // Static members data
  const members = [
    {
      _id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      role: "admin",
    },
    {
      _id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      role: "member",
    },
    {
      _id: "3",
      name: "Charlie Brown",
      email: "charlie@example.com",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      role: "member",
    },
  ];

  // Local state for demo (not persisted)
  const handlePromote = () => {
    // No-op for static demo
    alert("Member promoted to Admin!");
  };

  const handleDemote = () => {
    // No-op for static demo
    alert("Member demoted to Member!");
  };

  const handleRemove = () => {
    // No-op for static demo
    alert("Member removed successfully!");
  };

  return (
    <div className="p-6">
      <Card className="w-full max-w-4xl mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Admin Panel - Manage Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-center p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id} className="border-b hover:bg-muted/50">
                    <td className="p-3 flex items-center gap-2">
                      <img
                        src={member.image || "/default-avatar.png"}
                        alt={member.name}
                        className="w-8 h-8 rounded-full"
                      />
                      {member.name}
                    </td>
                    <td className="p-3">{member.email}</td>
                    <td className="p-3 capitalize">{member.role}</td>
                    <td className="p-3 flex justify-center gap-2">
                      {member.role === "member" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePromote}
                        >
                          <>
                            <Shield className="h-4 w-4 mr-1" /> Promote
                          </>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDemote}
                        >
                          <>
                            <ShieldOff className="h-4 w-4 mr-1" /> Demote
                          </>
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemove}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
