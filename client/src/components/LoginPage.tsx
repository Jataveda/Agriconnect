import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tractor, User, Lock } from "lucide-react";
import heroImage from "@assets/generated_images/Agricultural_landscape_hero_image_709de068.png";

interface LoginPageProps {
  onLogin?: (type: "farmer" | "customer", id: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [farmerID, setFarmerID] = useState("");
  const [farmerPassword, setFarmerPassword] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFarmerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: farmerID,
          password: farmerPassword,
          userType: "farmer"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as any).error || "Login failed");
      }

      const data = await response.json();
      onLogin?.("farmer", data.user.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: customerEmail,
          password: customerPassword,
          userType: "customer"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as any).error || "Login failed");
      }

      const data = await response.json();
      onLogin?.("customer", data.user.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div 
        className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 motion-safe:animate-[fadeInUp_400ms_ease-out]">Agriconnect</h1>
          <p className="text-xl md:text-2xl text-white/90 motion-safe:animate-[fadeInUp_400ms_ease-out]" style={{ animationDelay: "120ms" }}>Connecting Agricultural Communities</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-background">
        <div className="w-full max-w-md">
          <Tabs defaultValue="farmer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-2 mb-6">
              <TabsTrigger
                value="farmer"
                data-testid="tab-farmer"
                className="transition-colors data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <Tractor className="w-4 h-4 mr-2" />
                For Farmers
              </TabsTrigger>
              <TabsTrigger
                value="customer"
                data-testid="tab-customer"
                className="transition-colors data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                <User className="w-4 h-4 mr-2" />
                For Customers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="farmer">
              <Card className="motion-safe:animate-[fadeIn_300ms_ease-out]">
                <CardHeader>
                  <CardTitle>Farmer Login</CardTitle>
                  <CardDescription>Enter your unique Farmer ID to access your dashboard</CardDescription>
                </CardHeader>
                <form onSubmit={handleFarmerLogin}>
                  <CardContent className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="farmer-id">Farmer ID *</Label>
                      <div className="relative">
                        <Tractor className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="farmer-id"
                          data-testid="input-farmer-id"
                          placeholder="e.g., F-2024-00123"
                          value={farmerID}
                          onChange={(e) => setFarmerID(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmer-password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="farmer-password"
                          data-testid="input-farmer-password"
                          type="password"
                          placeholder="Enter your password"
                          value={farmerPassword}
                          onChange={(e) => setFarmerPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button
                      type="submit"
                      className="w-full btn-press"
                      variant="brand"
                      data-testid="button-farmer-login"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login as Farmer"}
                    </Button>
                    <div className="text-sm text-center">
                      <a href="#" className="text-primary hover-elevate px-2 py-1 rounded-md">Forgot Farmer ID?</a>
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="customer">
              <Card className="motion-safe:animate-[fadeIn_300ms_ease-out]">
                <CardHeader>
                  <CardTitle>Customer Login</CardTitle>
                  <CardDescription>Access your account to explore our marketplace</CardDescription>
                </CardHeader>
                <form onSubmit={handleCustomerLogin}>
                  <CardContent className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="customer-email">Email *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="customer-email"
                          data-testid="input-customer-email"
                          type="email"
                          placeholder="your@email.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-password">Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="customer-password"
                          data-testid="input-customer-password"
                          type="password"
                          placeholder="Enter your password"
                          value={customerPassword}
                          onChange={(e) => setCustomerPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button
                      type="submit"
                      className="w-full btn-press"
                      variant="brand"
                      data-testid="button-customer-login"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login as Customer"}
                    </Button>
                    <div className="text-sm text-center space-x-4">
                      <a href="#" className="text-primary hover-elevate px-2 py-1 rounded-md">Forgot Password?</a>
                      <span className="text-muted-foreground">|</span>
                      <a href="#" className="text-primary hover-elevate px-2 py-1 rounded-md">Sign Up</a>
                    </div>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
