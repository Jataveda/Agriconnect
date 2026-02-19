import PesticidesPage from "../PesticidesPage";

export default function PesticidesPageExample() {
  const mockPesticides = [
    {
      id: "ps1",
      name: "Crop Shield Pro",
      brand: "AgriChem",
      size: "1 Liter",
      price: 45.99,
      inStock: true,
      category: "Insecticide",
    },
    {
      id: "ps2",
      name: "Weed Destroyer Max",
      brand: "FarmGuard",
      size: "500ml",
      price: 32.50,
      inStock: true,
      category: "Herbicide",
    },
    {
      id: "ps3",
      name: "Fungus Fighter",
      brand: "AgriChem",
      size: "750ml",
      price: 38.99,
      inStock: false,
      category: "Fungicide",
    },
    {
      id: "ps4",
      name: "Plant Growth Plus",
      brand: "GreenCrop",
      size: "2 Liter",
      price: 55.00,
      inStock: true,
      category: "Growth Regulator",
    },
  ];

  return (
    <div className="p-6">
      <PesticidesPage
        pesticides={mockPesticides}
        onBuy={(id) => console.log("Buy pesticide:", id)}
      />
    </div>
  );
}
