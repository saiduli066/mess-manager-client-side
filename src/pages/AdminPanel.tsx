/* eslint-disable @typescript-eslint/no-unused-vars */
// components/AdminPanel.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Shield,
  ShieldOff,
  UserX,
  Users,
  Crown,
  Search,
  UserCheck
} from "lucide-react";
import { useMessStore } from "@/store/useMessStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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

export default function AdminPanel() {
  const { authUser } = useAuthStore();
  const { mess, members, getMessMembers, promoteToAdmin, demoteToMember, removeMember, isLoading } = useMessStore();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "member">("all");
  const [removeDialog, setRemoveDialog] = useState<{ open: boolean; member: any }>({ open: false, member: null });

  useEffect(() => {
    if (mess?._id) {
      getMessMembers();
    }
  }, [mess?._id, getMessMembers]);

  // Show ALL members (including current admin) but filter by search and role
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Count stats - include ALL members
  const stats = {
    total: members.length,
    admins: members.filter(m => m.role === "admin").length,
    members: members.filter(m => m.role === "member").length,
  };

  const handlePromote = async (memberId: string, memberName: string) => {
    if (!mess?._id) return;

    setProcessingId(memberId);
    try {
      await promoteToAdmin(mess._id, memberId);
      toast.success(`${memberName} promoted to Admin!`, {
        description: "They now have full administrative privileges."
      });
    } catch (error) {
      // Error handled in store
    } finally {
      setProcessingId(null);
    }
  };

  const handleDemote = async (memberId: string, memberName: string) => {
    if (!mess?._id) return;

    // Prevent self-demotion
    if (memberId === authUser?._id) {
      toast.error("You cannot demote yourself");
      return;
    }

    setProcessingId(memberId);
    try {
      await demoteToMember(mess._id, memberId);
      toast.success(`${memberName} demoted to Member!`, {
        description: "Their admin privileges have been removed."
      });
    } catch (error) {
      // Error handled in store
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (memberId: string, memberName: string) => {
    if (!mess?._id) return;

    // Prevent self-removal
    if (memberId === authUser?._id) {
      toast.error("You cannot remove yourself from the mess");
      return;
    }

    setProcessingId(memberId);
    try {
      await removeMember(mess._id, memberId);
      toast.success(`${memberName} removed from mess!`, {
        description: "Their historical data has been preserved."
      });
      setRemoveDialog({ open: false, member: null });
    } catch (error) {
      // Error handled in store
    } finally {
      setProcessingId(null);
    }
  };

  const openRemoveDialog = (member: any) => {
    // Prevent opening dialog for current user
    if (member._id === authUser?._id) {
      toast.error("You cannot remove yourself from the mess");
      return;
    }
    setRemoveDialog({ open: true, member });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isCurrentUser = (memberId: string) => {
    return memberId === authUser?._id;
  };

  if (!authUser || authUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(to bottom, #0F1729, #1A2332)",
        }}
      >
        <Card className="w-full max-w-md mx-auto shadow-2xl border-[#7E22CE]/30 rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "#1A2332",
            borderColor: "rgba(126, 34, 206, 0.3)",
          }}
        >
          <div className="p-6 border-b border-[#7E22CE]/20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-500/10 backdrop-blur-sm border-2 border-red-500/30">
              <Shield className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-center text-red-400">
              Access Restricted
            </h3>
          </div>
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-gray-300 text-lg leading-relaxed">
              This panel requires <span className="text-[#9D47DE] font-semibold">Admin privileges</span> to access.
            </p>
            <p className="text-gray-400 text-sm">
              Contact your mess admin if you need elevated permissions.
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

  return (
    <div className="min-h-screen p-4 m-2 rounded-md"
      style={{
        background: "linear-gradient(to bottom, #0F1729, #1A2332)",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Manage your mess members, assign admin roles, and maintain your community.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-[#7E22CE]/30 shadow-lg"
            style={{
              backgroundColor: "#1A2332",
              borderColor: "rgba(126, 34, 206, 0.3)",
            }}
          >
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(126, 34, 206, 0.2)" }}
              >
                <Users className="w-6 h-6 text-[#7E22CE]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-400">Total Members</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#7E22CE]/30 shadow-lg"
            style={{
              backgroundColor: "#1A2332",
              borderColor: "rgba(126, 34, 206, 0.3)",
            }}
          >
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(157, 71, 222, 0.2)" }}
              >
                <Crown className="w-6 h-6 text-[#9D47DE]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.admins}</p>
                <p className="text-sm text-gray-400">Admins</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#7E22CE]/30 shadow-lg"
            style={{
              backgroundColor: "#1A2332",
              borderColor: "rgba(126, 34, 206, 0.3)",
            }}
          >
            <CardContent className="p-4 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(34, 197, 94, 0.2)" }}
              >
                <UserCheck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.members}</p>
                <p className="text-sm text-gray-400">Regular Members</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-[#7E22CE]/30 shadow-2xl rounded-2xl"
          style={{
            backgroundColor: "#1A2332",
            borderColor: "rgba(126, 34, 206, 0.3)",
          }}
        >
          <CardHeader className="pb-4 border-b border-[#7E22CE]/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-white">
                  Member Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {/* Manage roles and permissions for all mess members */}
                </CardDescription>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64 bg-[#0F1729] border-[#7E22CE]/30 text-white placeholder:text-gray-500"
                    style={{
                      backgroundColor: "#0F1729",
                      borderColor: "rgba(126, 34, 206, 0.3)",
                    }}
                  />
                </div>

                <div className="flex border border-[#7E22CE]/30 rounded-lg overflow-hidden"
                  style={{ backgroundColor: "#0F1729" }}
                >
                  <button
                    onClick={() => setRoleFilter("all")}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${roleFilter === "all"
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                      }`}
                    style={{
                      backgroundColor: roleFilter === "all" ? "#7E22CE" : "transparent",
                    }}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setRoleFilter("admin")}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${roleFilter === "admin"
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                      }`}
                    style={{
                      backgroundColor: roleFilter === "admin" ? "#9D47DE" : "transparent",
                    }}
                  >
                    Admins
                  </button>
                  <button
                    onClick={() => setRoleFilter("member")}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${roleFilter === "member"
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                      }`}
                    style={{
                      backgroundColor: roleFilter === "member" ? "#7E22CE" : "transparent",
                    }}
                  >
                    Members
                  </button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading && members.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7E22CE]"></div>
                <p className="mt-4 text-gray-400 text-sm">Loading members...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(126, 34, 206, 0.1)" }}
                >
                  <Users className="w-8 h-8 text-[#7E22CE]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    No members found
                  </h3>
                  <p className="text-gray-400 max-w-sm mx-auto">
                    {searchTerm || roleFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "No members found in your mess"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3">
                  {filteredMembers.map((member) => (
                    <Card key={member._id} className="border-[#7E22CE]/30 shadow-md"
                      style={{
                        backgroundColor: "#0F1729",
                        borderColor: "rgba(126, 34, 206, 0.3)",
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 border-2 border-[#7E22CE]/30">
                              <AvatarImage src={member.image} />
                              <AvatarFallback className="bg-[#1A2332] text-white">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-semibold text-white">{member.name}</p>
                                {isCurrentUser(member._id) && (
                                  <Badge variant="outline" className="text-xs border-[#7E22CE] text-[#7E22CE]">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-400">{member.email}</p>
                            </div>
                          </div>
                          <Badge
                            variant={member.role === "admin" ? "default" : "secondary"}
                            className={member.role === "admin" ? "bg-[#850fdf] text-white hover:bg-[#9D47DE]" : "bg-[#7E22CE]/20 text-[#7E22CE] hover:bg-[#7E22CE]/20"}
                          >
                            {member.role}
                          </Badge>
                        </div>

                        <div className="flex space-x-2">
                          {member.role === "member" ? (
                            <Button
                              size="sm"
                              onClick={() => handlePromote(member._id, member.name)}
                              disabled={processingId === member._id}
                              className="flex-1 bg-[#9D47DE] hover:bg-[#7E22CE] text-white border-0 disabled:opacity-50 disabled:bg-[#9D47DE] disabled:cursor-not-allowed"
                            >
                              {processingId === member._id ? (
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <Shield className="w-4 h-4 mr-1" />
                                  Promote
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDemote(member._id, member.name)}
                              disabled={processingId === member._id || isCurrentUser(member._id)}
                              className="flex-1 border-[#7E22CE] text-[#7E22CE] hover:bg-[#7E22CE] hover:text-white disabled:opacity-40 disabled:border-[#7E22CE]/30 disabled:text-[#7E22CE]/50 disabled:cursor-not-allowed"
                            >
                              {processingId === member._id ? (
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#7E22CE]"></div>
                              ) : (
                                <>
                                  <ShieldOff className="w-4 h-4 mr-1 " />
                                  Demote
                                </>
                              )}
                            </Button>
                          )}

                          <Button
                            size="sm"
                            onClick={() => openRemoveDialog(member)}
                            disabled={processingId === member._id || isCurrentUser(member._id)}
                            className="bg-red-500 text-white border-0 hover:bg-red-600 disabled:opacity-50 disabled:bg-red-500 disabled:cursor-not-allowed"
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-hidden rounded-lg border border-[#7E22CE]/30"
                  style={{ backgroundColor: "#0F1729" }}
                >
                  <table className="w-full">
                    <thead className="border-b border-[#7E22CE]/20"
                      style={{ backgroundColor: "#1A2332" }}
                    >
                      <tr>
                        <th className="text-left p-4 font-semibold text-white">Member</th>
                        <th className="text-left p-4 font-semibold text-white">Email</th>
                        <th className="text-left p-4 font-semibold text-white">Role</th>
                        <th className="text-right p-4 font-semibold text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#7E22CE]/20">
                      {filteredMembers.map((member) => (
                        <tr key={member._id} className="hover:bg-[#1A2332]/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-9 w-9 border border-[#7E22CE]/30">
                                <AvatarImage src={member.image} />
                                <AvatarFallback className="bg-[#1A2332] text-white text-sm">
                                  {getInitials(member.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-white">{member.name}</span>
                                {isCurrentUser(member._id) && (
                                  <Badge variant="outline" className="text-xs border-[#7E22CE] text-[#7E22CE]">
                                    You
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-400">{member.email}</td>
                          <td className="p-4">
                            <Badge
                              variant={member.role === "admin" ? "default" : "secondary"}
                              className={member.role === "admin"
                                ? "bg-[#9D47DE] text-white hover:bg-[#9D47DE]"
                                : "bg-[#7E22CE]/20 text-[#7E22CE] hover:bg-[#7E22CE]/20"
                              }
                            >
                              {member.role === "admin" && <Crown className="w-3 h-3 mr-1" />}
                              {member.role}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end space-x-2">
                              {member.role === "member" ? (
                                <Button
                                  size="sm"
                                  onClick={() => handlePromote(member._id, member.name)}
                                  disabled={processingId === member._id}
                                  className="bg-[#9D47DE] hover:bg-[#7E22CE] text-white border-0 disabled:opacity-50 disabled:bg-[#9D47DE] disabled:cursor-not-allowed"
                                >
                                  {processingId === member._id ? (
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                  ) : (
                                    <>
                                      <Shield className="w-4 h-4 mr-1" />
                                      Promote
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDemote(member._id, member.name)}
                                  disabled={processingId === member._id || isCurrentUser(member._id)}
                                  className="border-[#7E22CE] text-[#7E22CE] hover:bg-[#7E22CE] hover:text-white disabled:opacity-40 disabled:border-[#7E22CE]/30 disabled:text-[#7E22CE]/50 disabled:cursor-not-allowed"
                                >
                                  {processingId === member._id ? (
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#7E22CE]"></div>
                                  ) : (
                                    <>
                                      <ShieldOff className="w-4 h-4 mr-1" />
                                      Demote
                                    </>
                                  )}
                                </Button>
                              )}

                              <Button
                                size="sm"
                                onClick={() => openRemoveDialog(member)}
                                disabled={processingId === member._id || isCurrentUser(member._id)}
                                className="bg-red-500 text-white border-0 hover:bg-red-600 disabled:opacity-50 disabled:bg-red-500 disabled:cursor-not-allowed"
                              >
                                <UserX className="w-4 h-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={removeDialog.open} onOpenChange={(open) => setRemoveDialog({ open, member: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <UserX className="w-5 h-5 text-red-600" />
              <span>Remove Member</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{removeDialog.member?.name}</strong> from the mess?
              Their historical data will be preserved in past records, but they will no longer be able to
              participate in the mess activities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleRemove(removeDialog.member?._id, removeDialog.member?.name)}
              disabled={processingId === removeDialog.member?._id}
              className="bg-red-600 hover:bg-red-700"
            >
              {processingId === removeDialog.member?._id ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Removing...
                </>
              ) : (
                "Remove Member"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}