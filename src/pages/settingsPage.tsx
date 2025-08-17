import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const SettingsPage = () => {
    // Static demo data
    const staticMess = {
        name: "Demo Mess",
        logo: null
    };

    const [name, setName] = useState(staticMess.name);
    const [logo, setLogo] = useState<File | null>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogo(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        // Client-side only for now
        toast.success("Mess settings updated (mock client-side)");
        console.log({
            name,
            logo,
        });
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Mess Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Mess Name</label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter new mess name"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Mess Logo</label>
                        <Input type="file" accept="image/*" onChange={handleLogoChange} />
                        {logo && (
                            <p className="text-sm mt-1 text-gray-600">
                                Selected: {logo.name}
                            </p>
                        )}
                    </div>

                    <Button onClick={handleSave} className="w-full">
                        Save Changes
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPage;
