import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useMessStore } from "@/store/useMessStore";
import { User, Lock, Eye, EyeOff, Mail, Phone, Upload, Crown, Users } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Profile = () => {
  const {
    authUser,
    isFetchingProfile,
    isUpdatingProfile,
    getProfile,
    updateProfile,
  } = useAuthStore();

  const { mess } = useMessStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageBase64Ref = useRef<string | null>(null);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!authUser) getProfile();
  }, [authUser, getProfile]);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setPhone(authUser.phone || "");
      setImagePreview(authUser.image || null);
    }
  }, [authUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please upload an image smaller than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      imageBase64Ref.current = base64Image;
      setImagePreview(base64Image);
    };
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (name.trim().length > 50) {
      toast.error("Name must be less than 50 characters");
      return;
    }

    try {
      await updateProfile({
        name: name.trim(),
        phone,
        image: imageBase64Ref.current || undefined,
      });
    } catch {
      toast.error("Profile update failed.");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      await axiosInstance.put("/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setOpenPasswordDialog(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isFetchingProfile || !authUser) {
    return (
      <div className="min-h-screen bg-[#0F1729] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7E22CE]"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1729] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-sm text-gray-400">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <Card className="border-[#7E22CE]/30 shadow-2xl bg-[#1A2332]">
          <CardContent className="p-4 sm:p-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="relative">
                <Avatar className="w-20 h-20 ring-2 ring-[#7E22CE]/30 shadow-xl">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} alt="User" className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-[#7E22CE] to-[#9D47DE]">
                      <User className="w-10 h-10 text-white" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1.5 bg-[#7E22CE] rounded-full cursor-pointer hover:bg-[#6B1AB5] transition-colors shadow-lg border-2 border-[#1A2332]">
                  <Upload className="w-3 h-3 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUpdatingProfile}
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold text-white">{authUser.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isUpdatingProfile ? "Uploading..." : "Click icon to change picture"}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              {/* Name Field */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-white text-sm flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#9D47DE]" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-[#0F1729] text-white border-[#7E22CE]/30 focus:border-[#7E22CE] h-9"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-white text-sm flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#9D47DE]" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={authUser.email}
                  disabled
                  className="bg-[#0F1729] text-gray-400 border-[#7E22CE]/30 cursor-not-allowed h-9"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-white text-sm flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#9D47DE]" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="bg-[#0F1729] text-white border-[#7E22CE]/30 focus:border-[#7E22CE] h-9"
                />
              </div>
            </div>

            {/* Mess Info Card */}
            {mess?.name && (
              <Card className="mt-3 bg-[#0F1729] border-[#7E22CE]/30">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 bg-[#7E22CE]/20 rounded">
                        <Users className="w-3 h-3 text-[#9D47DE]" />
                      </div>
                      <div className="leading-tight">
                        <p className="text-[10px] text-gray-400">Current Mess</p>
                        <p className="text-xs text-white font-semibold">{mess.name}</p>
                      </div>
                    </div>
                    <Badge className={authUser.role === "admin" ? "bg-amber-500 hover:bg-amber-600 text-xs py-0 h-5" : "bg-[#7E22CE] hover:bg-[#6B1AB5] text-xs py-0 h-5"}>
                      {authUser.role === "admin" && <Crown className="w-2.5 h-2.5 mr-1" />}
                      {authUser.role.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 mt-4">
              <Button
                onClick={handleUpdate}
                disabled={isUpdatingProfile}
                className="w-full bg-[#7E22CE] hover:bg-[#6B1AB5] text-white h-10 font-semibold shadow-lg hover:shadow-[#7E22CE]/50 transition-all"
              >
                {isUpdatingProfile ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>

              <Dialog open={openPasswordDialog} onOpenChange={setOpenPasswordDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-[#7E22CE] text-[#9D47DE] hover:bg-[#7E22CE]/20 h-10 font-medium"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A2332] border-[#7E22CE]/30 [&>button]:text-white [&>button]:hover:text-gray-300">
                  <DialogHeader>
                    <DialogTitle className="text-white text-lg">Change Password</DialogTitle>
                    <DialogDescription className="text-gray-400 text-sm">
                      Enter your current password and choose a new one.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 mt-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="currentPassword" className="text-white text-sm">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                          }
                          className="bg-[#0F1729] text-white border-[#7E22CE]/30 pr-10 h-9"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword" className="text-white text-sm">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                          className="bg-[#0F1729] text-white border-[#7E22CE]/30 pr-10 h-9"
                          placeholder="Enter new password (min 6 chars)"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-white text-sm">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                          className="bg-[#0F1729] text-white border-[#7E22CE]/30 pr-10 h-9"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className="w-full bg-[#7E22CE] hover:bg-[#6B1AB5] text-white h-9 mt-4"
                    >
                      {isChangingPassword ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Changing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
