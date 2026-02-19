import StatsCard from "./StatsCard";
import { DollarSign, Truck, Package, ShoppingCart } from "lucide-react";
import OrderTracking, { Order } from "./OrderTracking";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DashboardHomeProps {
  userType: "farmer" | "customer";
  stats: {
    totalRevenue?: number;
    activeListings?: number;
    totalOrders?: number;
    totalSpent?: number;
  };
  recentOrders: Order[];
  onOpenChat?: (orderId: string, orderTitle: string) => void;
}

export default function DashboardHome({ userType, stats, recentOrders, onOpenChat }: DashboardHomeProps) {
  return (
    <div className="space-y-6">
      <div className="relative rounded-lg overflow-hidden">
        <img
          src="attached_assets/generated_images/Agricultural_landscape_hero_image_709de068.png"
          alt="Agricultural landscape"
          className="w-full h-40 sm:h-56 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold">
              {userType === "farmer" ? "Farmer Dashboard" : "Customer Dashboard"}
            </h2>
            <p className="text-lg">Welcome back! Here's your overview.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userType === "farmer" ? (
          <>
            <StatsCard
              title="Total Revenue"
              value={`$${stats.totalRevenue?.toLocaleString() || "0"}`}
              icon={DollarSign}
              trend="+12% from last month"
              trendUp={true}
            />
            <StatsCard
              title="Active Vehicles"
              value={stats.activeListings || 0}
              icon={Truck}
              trend="Available for rent"
            />
            <StatsCard
              title="Produce Listings"
              value={stats.activeListings || 0}
              icon={Package}
              trend="Currently listed"
            />
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders || 0}
              icon={ShoppingCart}
              trend="This month"
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Spent"
              value={`$${stats.totalSpent?.toLocaleString() || "0"}`}
              icon={DollarSign}
              trend="This month"
            />
            <StatsCard
              title="Active Rentals"
              value={stats.activeListings || 0}
              icon={Truck}
              trend="Currently renting"
            />
            <StatsCard
              title="Purchases"
              value={stats.totalOrders || 0}
              icon={Package}
              trend="This month"
            />
            <StatsCard
              title="Orders Pending"
              value={2}
              icon={ShoppingCart}
              trend="Awaiting delivery"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Track your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTracking orders={recentOrders} onOpenChat={onOpenChat} />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks at your fingertips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {userType === "farmer" ? (
                <>
                  <Button className="w-full justify-start" variant="outline">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add New Vehicle
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add New Produce
                  </Button>
                </>
              ) : (
                <Button className="w-full justify-start" variant="outline">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Browse Marketplace
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
