import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useMessStore } from "@/store/useMessStore";
import { User, Lock, Eye, EyeOff } from "lucide-react";
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
    // Validate name
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
      toast.success("Profile updated successfully!");
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
      <div className="p-6 space-y-4 max-w-md mx-auto">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-64" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1729] text-white px-4 py-10">
      <div className="max-w-xl mx-auto bg-[#1A2332] rounded-2xl p-8 shadow-lg space-y-8 border border-[#7E22CE]/30">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24 ring-4 ring-[#7E22CE]/30">
            {imagePreview ? (
              <AvatarImage src={imagePreview} alt="User" />
            ) : (
              <AvatarFallback className="bg-muted text-muted-foreground flex items-center justify-center w-full h-full">
                <User className="w-10 h-10 text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUpdatingProfile}
            className="max-w-xs text-sm text-gray-200 file:bg-gray-500 file:px-1 file:text-white"
          />
          <p className="text-sm text-muted-foreground">
            {isUpdatingProfile ? "Uploading..." : "Click to upload image"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-[#0F1729] text-gray-100 border border-[#7E22CE]/30 focus:border-[#7E22CE]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <Input
            id="email"
            type="email"
            value={authUser.email}
            disabled
            className="bg-[#0F1729] text-gray-100 border border-[#7E22CE]/30"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
          <Input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-[#0F1729] text-gray-100 border border-[#7E22CE]/30"
          />
        </div>

        <div className="text-sm text-gray-400 italic">
          {mess?.name ? (
            <>
              You are <span className="font-semibold text-[#9D47DE]">{authUser.role}</span> at{" "}
              <span className="font-semibold text-[#7E22CE]">{mess.name}</span>
            </>
          ) : (
            <>You're not joined in any mess.</>
          )}
        </div>

        <Button
          onClick={handleUpdate}
          disabled={isUpdatingProfile}
          className="w-full bg-[#7E22CE] hover:bg-[#6B1AB5] text-white transition-all"
        >
          {isUpdatingProfile ? "Updating..." : "Update Profile"}
        </Button>

        <Dialog open={openPasswordDialog} onOpenChange={setOpenPasswordDialog}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full bg-transparent border-[#7E22CE] text-[#9D47DE] hover:bg-[#7E22CE]/20"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A2332] border-[#7E22CE]/30">
            <DialogHeader>
              <DialogTitle className="text-white">Change Password</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter your current password and choose a new one.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-300">
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
                    className="bg-[#0F1729] text-gray-100 border-[#7E22CE]/30 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-300">
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
                    className="bg-[#0F1729] text-gray-100 border-[#7E22CE]/30 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
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
                    className="bg-[#0F1729] text-gray-100 border-[#7E22CE]/30 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="w-full bg-[#7E22CE] hover:bg-[#6B1AB5] text-white"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
