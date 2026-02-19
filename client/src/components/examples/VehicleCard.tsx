import VehicleCard from "../VehicleCard";

export default function VehicleCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <VehicleCard
        id="v1"
        name="John Deere Tractor 5055E"
        type="Heavy Duty Tractor"
        capacity="55 HP"
        location="Springfield Farm, IL"
        pricePerDay={150}
        available={true}
        ownerName="Michael Chen"
        onRent={(id) => console.log("Rent vehicle:", id)}
      />
    </div>
  );
}
