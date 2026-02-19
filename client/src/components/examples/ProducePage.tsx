import ProducePage from "../ProducePage";

export default function ProducePageExample() {
  const mockProduce = [
    {
      id: "p1",
      name: "Fresh Tomatoes",
      category: "Vegetables",
      pricePerKg: 3.5,
      quantityAvailable: 250,
      unit: "kg",
      farmerName: "Sarah Johnson",
      organic: true,
    },
    {
      id: "p2",
      name: "Sweet Corn",
      category: "Vegetables",
      pricePerKg: 2.8,
      quantityAvailable: 180,
      unit: "kg",
      farmerName: "Michael Chen",
      organic: false,
    },
    {
      id: "p3",
      name: "Fresh Apples",
      category: "Fruits",
      pricePerKg: 4.2,
      quantityAvailable: 120,
      unit: "kg",
      farmerName: "David Lee",
      organic: true,
    },
    {
      id: "p4",
      name: "Strawberries",
      category: "Fruits",
      pricePerKg: 6.5,
      quantityAvailable: 80,
      unit: "kg",
      farmerName: "Sarah Johnson",
      organic: true,
    },
  ];

  return (
    <div className="p-6">
      <ProducePage
        produce={mockProduce}
        onBuy={(id) => console.log("Buy produce:", id)}
      />
    </div>
  );
}
