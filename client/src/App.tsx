import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import LoginPage from "@/components/LoginPage";
import DashboardHome from "@/components/DashboardHome";
import VehiclesPage from "@/components/VehiclesPage";
import ProducePage from "@/components/ProducePage";
import PesticidesPage from "@/components/PesticidesPage";
import OrderTracking, { Order } from "@/components/OrderTracking";
import LocationTracker from "@/components/LocationTracker";
import ProfileManagement from "@/components/ProfileManagement";
import CustomerCare from "@/components/CustomerCare";
import ChatDialog from "@/components/ChatDialog";
import { Message } from "@/components/ChatPanel";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import PaymentPage from "@/components/PaymentPage";
import OwnerPortal from "./components/OwnerPortal";

//todo: remove mock functionality
const mockVehicles = [
  {
    id: "v1",
    name: "John Deere Tractor 5055E",
    type: "Heavy Duty Tractor",
    capacity: "55 HP",
    location: "Springfield, IL",
    pricePerDay: 145,
    available: true,
    ownerName: "Michael Chen",
    dynamicPricing: true,
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
    dynamicPricing: false,
  },
  {
    id: "v3",
    name: "Case IH Tractor",
    type: "Multi-Purpose Tractor",
    capacity: "75 HP",
    location: "Naperville, IL",
    pricePerDay: 170,
    available: false,
    ownerName: "David Lee",
    dynamicPricing: true,
  },
];

//todo: remove mock functionality
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

//todo: remove mock functionality
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

//todo: remove mock functionality
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    type: "vehicle",
    itemName: "Tractor Rental - 3 Days",
    date: "Nov 5, 2025",
    status: "in-transit",
    total: 450,
  },
  {
    id: "ORD-002",
    type: "produce",
    itemName: "Fresh Tomatoes - 50kg",
    date: "Nov 7, 2025",
    status: "confirmed",
    total: 175,
  },
  {
    id: "ORD-003",
    type: "pesticide",
    itemName: "Crop Shield Pro - 2L",
    date: "Nov 3, 2025",
    status: "delivered",
    total: 91.98,
  },
];

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"farmer" | "customer">("farmer");
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; email: string; userType: "farmer" | "customer"; name: string } | null>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedOrderTitle, setSelectedOrderTitle] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [trackingOrder, setTrackingOrder] = useState<{ id: string; title: string } | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<{
    type: "vehicle" | "produce" | "pesticide";
    itemId: string;
    itemName: string;
    unitPrice: number;
    unitLabel: string;
  } | null>(null);

  // Marketplace data fetched from API
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [produce, setProduce] = useState<any[]>([]);

  const fetchVehicles = () => {
    // Provided image URLs mapped by position for display in farmer/customer portals
    const rawImageUrls: string[] = [
      "https://www.google.com/imgres?q=John%20Deere%20Tractor%205055E&imgurl=https%3A%2F%2Fwww.deere.africa%2Fassets%2Fimages%2Fregion-3%2Fproducts%2Ftractors%2Fsmall%2F5e-series%2F5055e%2Ftrator_5055e_studio_large_e266339d0dd5e9abeccb70412a0bee98b11716c0.jpg&imgrefurl=https%3A%2F%2Fwww.deere.africa%2Fen%2Ftractors%2F5-series-tractors%2F5e-series%2F5055e-tractor%2F&docid=WX2r7c7TZA1ZTM&tbnid=k8j3m3aIzEzflM&vet=12ahUKEwjc8aOhpuqQAxWJxzgGHVvKH3IQM3oECBUQAA..i&w=1064&h=768&hcb=2&ved=2ahUKEwjc8aOhpuqQAxWJxzgGHVvKH3IQM3oECBUQAA",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.allmachines.com%2Ftractors%2Fkubota-m7-154&psig=AOvVaw1j0weevikbEB0NrJgiYiBL&ust=1762957490429000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIDk5smm6pADFQAAAAAdAAAAABAE",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.birkeys.com%2Fblog%2Fcase-ih-a-history-of-excellence--7157&psig=AOvVaw3MO3DIbJkzBnLwVnqMwKsD&ust=1762957543588000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMCnweOm6pADFQAAAAAdAAAAABAE",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwyliesprayers.com%2Fnew-equipment%2Fpower-sprayer-trailers%2F&psig=AOvVaw1JGp7FMOiP1BITwkyrq-0r&ust=1762957573210000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNDG9_Km6pADFQAAAAAdAAAAABAE",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fagriculture.newholland.com%2Fen%2Fasiapacific%2Fproducts%2Fagricultural-tractors%2Ft7-swb-stage-v&psig=AOvVaw3V43qX6NhH6kkYPQccYU_x&ust=1762957634687000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLC68I6n6pADFQAAAAAdAAAAABAE",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bobcat.com%2Fna%2Fen%2Fequipment%2Floaders%2Fskid-steer-loaders%2Fs650&psig=AOvVaw0KdlcecmTweVtp1V5ZrUu3&ust=1762957674946000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCIj3sqKn6pADFQAAAAAdAAAAABAE",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pandamech.com%2Fproduct%2F4-axle-grain-tipper-trailer-for-sale%2F&psig=AOvVaw13t4f67D7qBzbYYqxsqg-Z&ust=1762957713545000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLjK2bSn6pADFQAAAAAdAAAAABAK",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shfarmsupply.com%2FNew-Inventory-New-Holland-Baler-RB450-Utility-Plus-NT-FT-Any-Location-12038429&psig=AOvVaw1uCc_GizwmroZ27y4YQsn_&ust=1762957768974000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMD_sM6n6pADFQAAAAAdAAAAABAE",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.caseih.com%2Fen-us%2Funitedstates%2Fproducts%2Fplanting-seeding%2F2000-series-early-riser-planter%2F2110-rigid-mounted&psig=AOvVaw1COIRzd8guUZ3_9x0UCrg7&ust=1762957806025000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCKCUveCn6pADFQAAAAAdAAAAABAE",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.farms.com%2Fused-farm-equipment%2Ftillage-equipment%2Fnew-10-ft-unverferth-perfecta-model-12-field-cultivator-133865.aspx&psig=AOvVaw2Xz0hIIy939JM2bTe56tpZ&ust=1762957829767000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLDToeun6pADFQAAAAAdAAAAABAK",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.xa.com%2F&psig=AOvVaw1cf58cb1vEBk_Ii-cAMhy9&ust=1762957876339000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLjauoKo6pADFQAAAAAdAAAAABAE",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.xa.com%2F&psig=AOvVaw1cf58cb1vEBk_Ii-cAMhy9&ust=1762957876339000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCLjauoKo6pADFQAAAAAdAAAAABAE",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.suzuki.co.nz%2Ffarm-atv%2Fmodel%2Flt-a500x-kingquad-500-auto%2Ffarm-atv&psig=AOvVaw3qr4Rkf_7TMgsQQf4k4hVr&ust=1762957975327000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJDztLGo6pADFQAAAAAdAAAAABAE",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fthaisun.en.made-in-china.com%2Fproduct%2FeBNnljRMfCYr%2FChina-Warehouse-3t-3-5t-4t-Electric-Forklift-Electric-Battery-Forklift.html&psig=AOvVaw0HYt9VUJ3VDjZfUM5ewWoH&ust=1762958003519000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJishb-o6pADFQAAAAAdAAAAABAE",
    ];

    const directImageUrls = rawImageUrls.map((u) => {
      try {
        const parsed = new URL(u);
        const imgParam = parsed.searchParams.get("imgurl");
        return imgParam ? imgParam : u;
      } catch {
        return u;
      }
    });

    fetch("/api/vehicles")
      .then(async (res) => {
        if (!res.ok) return [];
        const text = await res.text();
        if (!text) return [];
        try {
          return JSON.parse(text);
        } catch {
          return [];
        }
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const withImages = list.map((v: any, i: number) => {
          const candidate = v.imageUrl ?? directImageUrls[i] ?? null;
          const isDirectImage = candidate
            ? /\.(jpg|jpeg|png|gif|webp)(?:[?#]|$)/i.test(candidate)
            : false;
          return {
            ...v,
            imageUrl: isDirectImage ? candidate : null,
          };
        });
        setVehicles(withImages);
      })
      .catch(() => setVehicles([]));
  };

  const fetchProduce = () => {
    fetch("/api/produce")
      .then(async (res) => {
        if (!res.ok) return [];
        const text = await res.text();
        if (!text) return [];
        try {
          return JSON.parse(text);
        } catch {
          return [];
        }
      })
      .then((data) => setProduce(Array.isArray(data) ? data : []))
      .catch(() => setProduce([]));
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchVehicles();
      fetchProduce();
    }
  }, [isLoggedIn]);

  //todo: remove mock functionality - chat messages would come from backend
  const [orderChats, setOrderChats] = useState<Record<string, Message[]>>({
    "ORD-001": [
      {
        id: "m1",
        senderId: "farmer-123",
        senderName: "Michael Chen",
        senderType: "farmer",
        content: "Hello! Your tractor rental is confirmed for next week. It will be ready and fueled.",
        timestamp: "10:30 AM",
      },
      {
        id: "m2",
        senderId: "customer-456",
        senderName: "John Smith",
        senderType: "customer",
        content: "Perfect! What time can I pick it up?",
        timestamp: "10:32 AM",
      },
      {
        id: "m3",
        senderId: "farmer-123",
        senderName: "Michael Chen",
        senderType: "farmer",
        content: "Anytime after 8 AM. I'll be at the farm all day.",
        timestamp: "10:35 AM",
      },
    ],
    "ORD-002": [
      {
        id: "m4",
        senderId: "farmer-789",
        senderName: "Sarah Johnson",
        senderType: "farmer",
        content: "Your tomatoes are packed and ready for delivery!",
        timestamp: "2:15 PM",
      },
    ],
  });

  const handleLogin = (type: "farmer" | "customer", id: string) => {
    console.log(`Logged in as ${type}:`, id);
    setUserType(type);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  // Fixed handleLogin function that matches LoginPage signature
  const handleUserLogin = (type: "farmer" | "customer", id: string) => {
    console.log(`Logged in as ${type}:`, id);
    // Create a mock user object for now - in a real app, you'd fetch user data
    const mockUser = {
      id: id,
      username: type === "farmer" ? "farmer-" + id : "customer-" + id,
      email: type === "farmer" ? "farmer@example.com" : "customer@example.com",
      userType: type,
      name: type === "farmer" ? "Farmer User" : "Customer User"
    };
    setCurrentUser(mockUser);
    setUserType(type);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleOpenChat = (orderId: string, orderTitle: string) => {
    setSelectedOrderId(orderId);
    setSelectedOrderTitle(orderTitle);
    setChatOpen(true);
  };

  const handleSendMessage = (content: string) => {
    const currentUserId = userType === "farmer" ? "farmer-123" : "customer-456";
    const currentUserName = userType === "farmer" ? "Michael Chen" : "John Smith";
    
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserName,
      senderType: userType,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setOrderChats((prev) => ({
      ...prev,
      [selectedOrderId]: [...(prev[selectedOrderId] || []), newMessage],
    }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <DashboardHome
            userType={userType}
            stats={{
              totalRevenue: 12450,
              activeListings: 8,
              totalOrders: 24,
              totalSpent: 3280,
            }}
            recentOrders={mockOrders}
            onOpenChat={handleOpenChat}
          />
        );
      case "my-vehicles":
        return (
          <VehiclesPage
            userType={userType}
            vehicles={currentUser ? vehicles.filter((v: any) => v.ownerId === currentUser.id) : []}
            isMyVehicles={true}
            onAddVehicle={() => fetchVehicles()}
            currentUser={currentUser || undefined}
          />
        );
      case "rent-vehicles":
        return (
          <VehiclesPage
            userType={userType}
            vehicles={vehicles}
            onRent={(vehicleId) => {
              if (!currentUser) {
                console.error("No user logged in");
                return;
              }
              const vehicle = vehicles.find((v: any) => v.id === vehicleId);
              if (!vehicle) {
                console.error("Vehicle not found");
                return;
              }
              setCheckoutItem({
                type: "vehicle",
                itemId: vehicle.id,
                itemName: vehicle.name,
                unitPrice: vehicle.pricePerDay,
                unitLabel: "per day",
              });
              setCurrentPage("payment");
            }}
            currentUser={currentUser || undefined}
          />
        );
      case "my-produce":
        return (
          <ProducePage
            produce={currentUser ? produce.filter((p: any) => p.farmerId === currentUser.id) : []}
            isMyProduce={true}
            onAddProduce={() => fetchProduce()}
            currentUser={currentUser || undefined}
          />
        );
      case "buy-produce":
        return (
          <ProducePage
            produce={produce}
            currentUser={currentUser || undefined}
            onBuy={(produceId) => {
              if (!currentUser) {
                console.error("No user logged in");
                return;
              }
              const item = produce.find((p: any) => p.id === produceId);
              if (!item) {
                console.error("Produce not found");
                return;
              }
              setCheckoutItem({
                type: "produce",
                itemId: item.id,
                itemName: item.name,
                unitPrice: item.pricePerKg,
                unitLabel: "per kg",
              });
              setCurrentPage("payment");
            }}
          />
        );
      case "sell-produce":
        return (
          <ProducePage
            produce={currentUser ? produce.filter((p: any) => p.farmerId === currentUser.id) : []}
            isMyProduce={true}
            onAddProduce={() => fetchProduce()}
            currentUser={currentUser || undefined}
          />
        );
      case "pesticides":
        return (
          <PesticidesPage
            pesticides={mockPesticides}
            onBuy={(pesticideId) => {
              if (!currentUser) {
                console.error("No user logged in");
                return;
              }
              const pesticide = mockPesticides.find((ps) => ps.id === pesticideId);
              if (!pesticide) {
                console.error("Pesticide not found");
                return;
              }
              setCheckoutItem({
                type: "pesticide",
                itemId: pesticide.id,
                itemName: pesticide.name,
                unitPrice: pesticide.price,
                unitLabel: "per unit",
              });
              setCurrentPage("payment");
            }}
          />
        );
      case "orders":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">My Orders</h2>
              <p className="text-muted-foreground">Track all your transactions and bookings</p>
            </div>
            <OrderTracking
              orders={orders}
              onOpenChat={handleOpenChat}
              onTrack={(orderId) => {
                const order = orders.find((o) => o.id === orderId);
                setTrackingOrder({ id: orderId, title: order?.itemName || "Order" });
              }}
            />
            {trackingOrder && (
              <LocationTracker
                open={Boolean(trackingOrder)}
                onOpenChange={(open) => {
                  if (!open) setTrackingOrder(null);
                }}
                orderId={trackingOrder.id}
                orderTitle={trackingOrder.title}
              />
            )}
          </div>
        );
      case "payment":
        if (!checkoutItem || !currentUser) {
          return (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold">No item selected</h2>
              <p className="text-muted-foreground">Please choose an item to proceed to payment.</p>
            </div>
          );
        }
        return (
          <PaymentPage
            item={checkoutItem}
            currentUser={{ id: currentUser.id, name: currentUser.name }}
            onCancel={() => setCurrentPage("dashboard")}
            onSuccess={(orderId) => {
              // After successful payment, mark the order as in-transit and add to tracked list
              fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "in-transit" }),
              })
                .catch(() => null)
                .then(() => fetch(`/api/orders/${orderId}`))
                .then((res) => (res.ok ? res.json() : null))
                .then((order) => {
                  if (order) {
                    const normalized: Order = {
                      id: order.id,
                      type: order.type,
                      itemName: order.itemName || checkoutItem.itemName,
                      date: new Date(order.createdAt || Date.now()).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                      status: (order.status as Order["status"]) || "in-transit",
                      total: Number(order.total) || 0,
                    };
                    setOrders((prev) => [normalized, ...prev]);
                  }
                })
                .finally(() => {
                  setCheckoutItem(null);
                  setCurrentPage("orders");
                });
            }}
          />
        );
      case "profile":
        return (
          <ProfileManagement
            userType={userType}
            initialData={{
              name: "John Smith",
              email: "john.smith@email.com",
              phone: "+1 (555) 123-4567",
              address: "1234 Farm Road",
              city: "Springfield",
              state: "Illinois",
              zipCode: "62701",
              farmerId: userType === "farmer" ? "F-2024-00123" : undefined,
              farmName: userType === "farmer" ? "Green Valley Farms" : undefined,
              farmSize: userType === "farmer" ? "150" : undefined,
            }}
            onSave={(data) => console.log("Profile saved:", data)}
          />
        );
      case "support":
        return <CustomerCare />;
      case "owner-portal":
        return <OwnerPortal />;
      default:
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold">Page not found</h2>
          </div>
        );
    }
  };

  if (!isLoggedIn) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LoginPage onLogin={handleUserLogin} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar
              userType={userType}
              currentPage={currentPage}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between p-3 md:p-4 border-b gap-4">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto p-4 md:p-6 bg-background">
                {renderPage()}
              </main>
            </div>
          </div>
        </SidebarProvider>
        <ChatDialog
          open={chatOpen}
          onOpenChange={setChatOpen}
          orderId={selectedOrderId}
          orderTitle={selectedOrderTitle}
          currentUserType={userType}
          currentUserId={userType === "farmer" ? "farmer-123" : "customer-456"}
          messages={orderChats[selectedOrderId] || []}
          onSendMessage={handleSendMessage}
        />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
