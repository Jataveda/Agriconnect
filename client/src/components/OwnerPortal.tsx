import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import VehicleCard from "./VehicleCard";
import EmptyState from "./EmptyState";
import VehicleFormDialog from "./VehicleFormDialog";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: string;
  location: string;
  pricePerDay: number;
  available: boolean;
  imageUrl?: string;
  ownerName?: string;
}

const initialVehicles: Vehicle[] = [
  {
    id: "1",
    name: "John Deere 8R 370",
    type: "Tractor",
    capacity: "370 HP",
    location: "Springfield, IL",
    pricePerDay: 450,
    available: true,
    ownerName: "Michael Chen",
    imageUrl: "https://www.deere.africa/assets/images/region-3/products/tractors/small/5e-series/5055e/trator_5055e_studio_large_e266339d0dd5e9abeccb70412a0bee98b11716c0.jpg",
  },
  {
    id: "2",
    name: "Case IH Axial-Flow 9250",
    type: "Combine Harvester",
    capacity: "550 HP",
    location: "Oak Park, IL",
    pricePerDay: 800,
    available: false,
    ownerName: "Sarah Johnson",
    imageUrl: "https://www.allmachines.com/tractors/kubota-m7-154",
  },
];

export default function OwnerPortal() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold">Owner Portal</h2>
          <p className="text-muted-foreground">
            Manage your vehicle fleet
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredVehicles.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No vehicles found"
          description="No vehicles match your search query."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              {...vehicle}
              onToggleAvailability={(id, nextAvailable) => {
                setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, available: nextAvailable } : v)));
              }}
              onDelete={(id) => {
                const ok = window.confirm("Delete this vehicle?");
                if (!ok) return;
                setVehicles((prev) => prev.filter((v) => v.id !== id));
              }}
            />
          ))}
        </div>
      )}
      <VehicleFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={(values: Omit<Vehicle, 'id' | 'available'>) => {
          console.log("New vehicle:", values);
          // Here you would typically send the data to your backend API
          // For now, we'll just add it to our local state
          const newVehicle: Vehicle = {
            id: `v${Date.now()}`,
            ...values,
            capacity: `${values.capacity} HP`, // Assuming capacity is in HP
            available: true, // New vehicles are available by default
          };
          setVehicles((prev) => [newVehicle, ...prev]);
          setIsFormOpen(false);
        }}
      />
    </div>
  );
}