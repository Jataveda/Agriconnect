import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, DollarSign, MapPin, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddVehicleFormProps {
  onSave?: (data: any) => void;
  onCancel?: () => void;
  currentUser?: {
    id: string;
    username: string;
    email: string;
    userType: string;
    name: string;
  };
}

export default function AddVehicleForm({ onSave, onCancel, currentUser }: AddVehicleFormProps) {
  const { toast } = useToast();
  const [useDynamicPricing, setUseDynamicPricing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    pricePerDay: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  //todo: remove mock functionality - these would come from an API based on location
  const locationPricingSuggestions: Record<string, number> = {
    "Springfield, IL": 145,
    "Chicago, IL": 185,
    "Oak Park, IL": 165,
    "Naperville, IL": 170,
    "Peoria, IL": 140,
  };

  const suggestedPrice = formData.location && locationPricingSuggestions[formData.location]
    ? locationPricingSuggestions[formData.location]
    : null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Auto-update price if dynamic pricing is enabled and location changes
    if (field === "location" && useDynamicPricing && locationPricingSuggestions[value]) {
      setFormData((prev) => ({ 
        ...prev, 
        pricePerDay: locationPricingSuggestions[value].toString() 
      }));
    }
  };

  const handleDynamicPricingToggle = (enabled: boolean) => {
    setUseDynamicPricing(enabled);
    if (enabled && formData.location && locationPricingSuggestions[formData.location]) {
      setFormData((prev) => ({ 
        ...prev, 
        pricePerDay: locationPricingSuggestions[formData.location].toString() 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          capacity: formData.capacity,
          location: formData.location,
          pricePerDay: parseFloat(formData.pricePerDay),
          available: true,
          ownerId: currentUser?.id || "",
          ownerName: currentUser?.name || "",
          dynamicPricing: useDynamicPricing,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add vehicle");
      }

      const vehicle = await response.json();
      console.log("Vehicle added successfully:", vehicle);
      
      toast({
        title: "Vehicle Listed Successfully",
        description: `${formData.name} has been added to your listings.`,
      });
      
      onSave?.(vehicle);
    } catch (error) {
      console.error("Error adding vehicle:", error);
      setError(error instanceof Error ? error.message : "Failed to add vehicle");
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Add New Vehicle</CardTitle>
          <CardDescription>List your vehicle for rent on the marketplace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name *</Label>
              <Input
                id="name"
                data-testid="input-vehicle-name"
                placeholder="e.g., John Deere Tractor 5055E"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type" data-testid="select-vehicle-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tractor">Tractor</SelectItem>
                  <SelectItem value="Harvester">Harvester</SelectItem>
                  <SelectItem value="Planter">Planter</SelectItem>
                  <SelectItem value="Sprayer">Sprayer</SelectItem>
                  <SelectItem value="Trailer">Trailer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity/Specifications *</Label>
            <Input
              id="capacity"
              data-testid="input-vehicle-capacity"
              placeholder="e.g., 55 HP, Large, 20ft"
              value={formData.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
              <SelectTrigger id="location" data-testid="select-location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Springfield, IL">Springfield, IL</SelectItem>
                <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                <SelectItem value="Oak Park, IL">Oak Park, IL</SelectItem>
                <SelectItem value="Naperville, IL">Naperville, IL</SelectItem>
                <SelectItem value="Peoria, IL">Peoria, IL</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dynamic-pricing" className="text-base font-semibold">
                  Dynamic Pricing
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use location-based pricing recommendations
                </p>
              </div>
              <Switch
                id="dynamic-pricing"
                data-testid="switch-dynamic-pricing"
                checked={useDynamicPricing}
                onCheckedChange={handleDynamicPricingToggle}
              />
            </div>

            {suggestedPrice && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-md border border-primary/20">
                <TrendingUp className="w-4 h-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Suggested price for {formData.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Based on market rates in your area
                  </p>
                </div>
                <Badge variant="default" className="text-base">
                  ${suggestedPrice}/day
                </Badge>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="price">
                {useDynamicPricing ? "Daily Rate (Auto-adjusted)" : "Set Your Daily Rate *"}
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="price"
                  data-testid="input-price-per-day"
                  type="number"
                  step="0.01"
                  placeholder="Enter price per day"
                  value={formData.pricePerDay}
                  onChange={(e) => handleChange("pricePerDay", e.target.value)}
                  className="pl-10"
                  disabled={useDynamicPricing && !formData.location}
                  required
                />
              </div>
              {useDynamicPricing && formData.location && (
                <p className="text-xs text-muted-foreground">
                  Price automatically adjusted based on location. You can still modify it manually.
                </p>
              )}
              {!useDynamicPricing && (
                <p className="text-xs text-muted-foreground">
                  Set your own custom price for this vehicle.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" data-testid="button-save-vehicle" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Listing Vehicle...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  List Vehicle
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel" disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
