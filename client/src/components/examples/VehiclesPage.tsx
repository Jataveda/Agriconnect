import VehiclesPage from "../VehiclesPage";

export default function VehiclesPageExample() {
  const mockVehicles = [
    {
      id: "v1",
      name: "John Deere Tractor 5055E",
      type: "Heavy Duty Tractor",
      capacity: "55 HP",
      location: "Springfield, IL",
      pricePerDay: 150,
      available: true,
      ownerName: "Michael Chen",
    },
    {
      id: "v2",
      name: "Kubota Harvester M7",
      type: "Combine Harvester",
      capacity: "Large",
      location: "Oak Park, IL",
      pricePerDay: 200,
      available: true,
      ownerName: "Sarah Johnson",
    },
    {
      id: "v3",
      name: "Case IH Tractor",
      type: "Multi-Purpose Tractor",
      capacity: "75 HP",
      location: "Naperville, IL",
      pricePerDay: 175,
      available: false,
      ownerName: "David Lee",
    },
  ];

  return (
    <div className="p-6">
      <VehiclesPage
        userType="customer"
        vehicles={mockVehicles}
        onRent={(id) => console.log("Rent vehicle:", id)}
      />
    </div>
  );
}
