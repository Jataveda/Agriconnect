import PesticideCard from "../PesticideCard";

export default function PesticideCardExample() {
  return (
    <div className="p-4 max-w-xs">
      <PesticideCard
        id="ps1"
        name="Crop Shield Pro"
        brand="AgriChem"
        size="1 Liter"
        price={45.99}
        inStock={true}
        category="Insecticide"
        onBuy={(id) => console.log("Buy pesticide:", id)}
      />
    </div>
  );
}
