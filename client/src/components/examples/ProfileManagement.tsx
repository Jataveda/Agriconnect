import ProfileManagement from "../ProfileManagement";

export default function ProfileManagementExample() {
  const mockData = {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    address: "1234 Farm Road",
    city: "Springfield",
    state: "Illinois",
    zipCode: "62701",
    farmerId: "F-2024-00123",
    farmName: "Green Valley Farms",
    farmSize: "150",
  };

  return (
    <div className="p-4">
      <ProfileManagement
        userType="farmer"
        initialData={mockData}
        onSave={(data) => console.log("Profile saved:", data)}
      />
    </div>
  );
}
