import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, Package, DollarSign, MapPin, Save, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddProduceFormProps {
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

export default function AddProduceForm({ onSave, onCancel, currentUser }: AddProduceFormProps) {
  const { toast } = useToast();
  const [isOrganic, setIsOrganic] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    pricePerKg: "",
    quantityAvailable: "",
    unit: "kg",
    location: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Fruits",
    "Vegetables",
    "Grains",
    "Dairy",
    "Meat & Poultry",
    "Herbs & Spices",
    "Nuts & Seeds",
    "Other"
  ];

  const locations = [
    "Springfield, IL",
    "Chicago, IL",
    "Oak Park, IL",
    "Naperville, IL",
    "Peoria, IL"
  ];

  const units = [
    "kg",
    "lbs",
    "pieces",
    "dozen",
    "bushels",
    "tons"
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError("You must be logged in to add produce");
      return;
    }

    // Validation
    if (!formData.name || !formData.category || !formData.pricePerKg || !formData.quantityAvailable || !formData.location) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/produce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          pricePerKg: parseFloat(formData.pricePerKg),
          quantityAvailable: parseFloat(formData.quantityAvailable),
          unit: formData.unit,
          location: formData.location,
          description: formData.description,
          organic: isOrganic,
          farmerId: currentUser.id,
          farmerName: currentUser.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add produce");
      }

      const newProduce = await response.json();
      
      toast({
        title: "Success!",
        description: "Your produce has been listed successfully.",
      });

      onSave?.(newProduce);
    } catch (error) {
      console.error("Error adding produce:", error);
      setError("Failed to add produce. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Produce</CardTitle>
              <CardDescription>List your fresh produce for sale</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Produce Name *</Label>
                <Input
                  id="name"
                  data-testid="input-produce-name"
                  placeholder="e.g., Fresh Tomatoes, Organic Apples"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger id="category" data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleChange("unit", value)}>
                    <SelectTrigger id="unit" data-testid="select-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerKg">Price per Unit *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="pricePerKg"
                      data-testid="input-price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.pricePerKg}
                      onChange={(e) => handleChange("pricePerKg", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantityAvailable">Quantity Available *</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="quantityAvailable"
                      data-testid="input-quantity"
                      type="number"
                      placeholder="0"
                      value={formData.quantityAvailable}
                      onChange={(e) => handleChange("quantityAvailable", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Select value={formData.location} onValueChange={(value) => handleChange("location", value)}>
                    <SelectTrigger id="location" className="pl-10" data-testid="select-location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="organic" className="text-base font-semibold">
                      Organic Certification
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Mark if your produce is certified organic
                    </p>
                  </div>
                  <Switch
                    id="organic"
                    data-testid="switch-organic"
                    checked={isOrganic}
                    onCheckedChange={setIsOrganic}
                  />
                </div>
                {isOrganic && (
                  <Badge className="bg-primary" data-testid="badge-organic">
                    <Leaf className="w-3 h-3 mr-1" />
                    Certified Organic
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  data-testid="textarea-description"
                  placeholder="Describe your produce - growing methods, freshness, special characteristics..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How your produce will appear to buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Leaf className="w-16 h-16 text-primary" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">
                      {formData.name || "Produce Name"}
                    </h3>
                    {isOrganic && (
                      <Badge className="bg-primary">
                        <Leaf className="w-3 h-3 mr-1" />
                        Organic
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formData.category || "Category"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>
                      {formData.quantityAvailable || "0"} {formData.unit} available
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{formData.location || "Location"}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-primary">
                      ${formData.pricePerKg || "0.00"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      per {formData.unit}
                    </span>
                  </div>
                  {formData.description && (
                    <div className="text-sm text-muted-foreground pt-2 border-t">
                      {formData.description}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          type="submit" 
          data-testid="button-add-produce"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding Produce...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Add Produce
            </>
          )}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}