import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const Profile = () => {
  const {
    authUser,
    isFetchingProfile,
    isUpdatingProfile,
    getProfile,
    updateProfile,
  } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageFileRef = useRef<File | null>(null);

  useEffect(() => {
    if (!authUser) getProfile();
  }, []);

  useEffect(() => {
    if (authUser) {
      setPhone(authUser.phone || "");
      setImagePreview(authUser.image || null);
    }
  }, [authUser]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    imageFileRef.current = file;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("phone", phone);
    if (imageFileRef.current) {
      formData.append("image", imageFileRef.current);
    }

    try {
      await updateProfile(formData);
    } catch {
      toast.error("Profile update failed.");
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
      <div className="max-w-xl mx-auto bg-[#1A253A] rounded-2xl p-8 shadow-lg space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24 ring-2 ring-cyan-500">
            <AvatarImage src={imagePreview || undefined} alt="User" />
            <AvatarFallback>{authUser.name[0]}</AvatarFallback>
          </Avatar>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="max-w-xs text-sm text-gray-200 file:bg-cyan-600 file:text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-300">Name</Label>
          <Input
            id="name"
            type="text"
            value={authUser.name}
            disabled
            className="bg-[#1F2A3D] text-gray-100 border border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <Input
            id="email"
            type="email"
            value={authUser.email}
            disabled
            className="bg-[#1F2A3D] text-gray-100 border border-gray-600"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
          <Input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-[#1F2A3D] text-gray-100 border border-gray-600"
          />
        </div>

        <div className="text-sm text-gray-400 italic">
          You are <span className="font-semibold text-cyan-400">{authUser.role}</span> at{" "}
          <span className="font-semibold text-cyan-400">{authUser.messName}</span>
        </div>

        <Button
          onClick={handleUpdate}
          disabled={isUpdatingProfile}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white transition-all"
        >
          {isUpdatingProfile ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;