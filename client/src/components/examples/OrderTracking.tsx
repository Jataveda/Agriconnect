import OrderTracking from "../OrderTracking";

export default function OrderTrackingExample() {
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
    {
      id: "ORD-003",
      type: "pesticide" as const,
      itemName: "Crop Shield Pro - 2L",
      date: "Nov 3, 2025",
      status: "delivered" as const,
      total: 91.98,
    },
  ];

  return (
    <div className="p-4 max-w-3xl">
      <OrderTracking orders={mockOrders} />
    </div>
  );
}
