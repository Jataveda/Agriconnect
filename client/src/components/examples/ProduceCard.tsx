import ProduceCard from "../ProduceCard";

export default function ProduceCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <ProduceCard
        id="p1"
        name="Fresh Tomatoes"
        category="Vegetables"
        pricePerKg={3.5}
        quantityAvailable={250}
        unit="kg"
        farmerName="Sarah Johnson"
        organic={true}
        onBuy={(id) => console.log("Buy produce:", id)}
      />
    </div>
  );
}
