import DashboardHome from "../DashboardHome";

export default function DashboardHomeExample() {
  const mockOrders = [
    {
      id: "ORD-001",
      type: "vehicle" as const,
      itemName: "Tractor Rental - 3 Days",
      date: "Nov 5, 2025",
      status: "in-transit" as const,
      total: 450,
    },
    {
      id: "ORD-002",
      type: "produce" as const,
      itemName: "Fresh Tomatoes - 50kg",
      date: "Nov 7, 2025",
      status: "confirmed" as const,
      total: 175,
    },
  ];

  const stats = {
    totalRevenue: 12450,
    activeListings: 8,
    totalOrders: 24,
  };

  return (
    <div className="p-6">
      <DashboardHome userType="farmer" stats={stats} recentOrders={mockOrders} />
    </div>
  );
}
