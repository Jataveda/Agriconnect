import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { User, MapPin, Phone, Mail, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  farmerId?: string;
  farmName?: string;
  farmSize?: string;
}

interface ProfileManagementProps {
  userType: "farmer" | "customer";
  initialData?: ProfileData;
  onSave?: (data: ProfileData) => void;
}

export default function ProfileManagement({ userType, initialData, onSave }: ProfileManagementProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProfileData>(
    initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      farmerId: userType === "farmer" ? "" : undefined,
      farmName: userType === "farmer" ? "" : undefined,
      farmSize: userType === "farmer" ? "" : undefined,
    }
  );

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving profile:", formData);
    onSave?.(formData);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  return (
    <div className="max-w-4xl">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal" data-testid="tab-personal">
            <User className="w-4 h-4 mr-2" />
            Personal Info
          </TabsTrigger>
          {userType === "farmer" && (
            <TabsTrigger value="business" data-testid="tab-business">
              <MapPin className="w-4 h-4 mr-2" />
              Farm Details
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="personal">
          <form onSubmit={handleSave}>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      data-testid="input-name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      data-testid="input-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      data-testid="input-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  {userType === "farmer" && (
                    <div className="space-y-2">
                      <Label htmlFor="farmerId">Farmer ID</Label>
                      <Input
                        id="farmerId"
                        data-testid="input-farmer-id"
                        value={formData.farmerId || ""}
                        disabled
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    data-testid="input-address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      data-testid="input-city"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      data-testid="input-state"
                      value={formData.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip Code *</Label>
                    <Input
                      id="zipCode"
                      data-testid="input-zipcode"
                      value={formData.zipCode}
                      onChange={(e) => handleChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" data-testid="button-save-profile">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {userType === "farmer" && (
          <TabsContent value="business">
            <form onSubmit={handleSave}>
              <Card>
                <CardHeader>
                  <CardTitle>Farm Details</CardTitle>
                  <CardDescription>Manage your farm information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Farm Name *</Label>
                    <Input
                      id="farmName"
                      data-testid="input-farm-name"
                      value={formData.farmName || ""}
                      onChange={(e) => handleChange("farmName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (acres) *</Label>
                    <Input
                      id="farmSize"
                      data-testid="input-farm-size"
                      value={formData.farmSize || ""}
                      onChange={(e) => handleChange("farmSize", e.target.value)}
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" data-testid="button-save-farm">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
