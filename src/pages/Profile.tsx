import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useMessStore } from "@/store/useMessStore";
import { User } from "lucide-react";

const Profile = () => {
  const {
    authUser,
    isFetchingProfile,
    isUpdatingProfile,
    getProfile,
    updateProfile,
  } = useAuthStore();

  const { mess } = useMessStore();

  const [phone, setPhone] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageBase64Ref = useRef<string | null>(null);

  useEffect(() => {
    if (!authUser) getProfile();
  }, [authUser, getProfile]);

  useEffect(() => {
    if (authUser) {
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
    try {
      await updateProfile({
        phone,
        image: imageBase64Ref.current || undefined,
      });
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
          <Avatar className="w-24 h-24 ring-1 ring-purple-600">
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
          {mess?.name ? (
            <>
              You are <span className="font-semibold text-purple-400">{authUser.role}</span> at{" "}
              <span className="font-semibold text-purple-500">{mess.name}</span>
            </>
          ) : (
            <>You're not joined in any mess.</>
          )}
        </div>

        <Button
          onClick={handleUpdate}
          disabled={isUpdatingProfile}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white transition-all"
        >
          {isUpdatingProfile ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
