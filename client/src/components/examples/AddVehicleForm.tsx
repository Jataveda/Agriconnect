import AddVehicleForm from "../AddVehicleForm";

export default function AddVehicleFormExample() {
  return (
    <div className="p-4 max-w-3xl">
      <AddVehicleForm
        onSave={(data) => console.log("Vehicle saved:", data)}
        onCancel={() => console.log("Cancelled")}
      />
    </div>
  );
}
