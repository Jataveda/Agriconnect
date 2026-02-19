import { Home, Truck, Leaf, Beaker, ClipboardList, User, HelpCircle, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AppSidebarProps {
  userType: "farmer" | "customer";
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function AppSidebar({ userType, currentPage, onNavigate, onLogout }: AppSidebarProps) {
  const farmerItems = [
    { title: "Dashboard", page: "dashboard", icon: Home },
    { title: "Rent Vehicles", page: "rent-vehicles", icon: Truck },
    { title: "Owner Portal", page: "owner-portal", icon: User },
    { title: "Sell Produce", page: "sell-produce", icon: Leaf },
    { title: "Buy Pesticides", page: "pesticides", icon: Beaker },
    { title: "My Orders", page: "orders", icon: ClipboardList },
  ];

  const customerItems = [
    { title: "Dashboard", page: "dashboard", icon: Home },
    { title: "Rent Vehicles", page: "rent-vehicles", icon: Truck },
    { title: "Buy Produce", page: "buy-produce", icon: Leaf },
    { title: "My Orders", page: "orders", icon: ClipboardList },
  ];

  const items = userType === "farmer" ? farmerItems : customerItems;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-primary px-4 py-4">
            Agriconnect
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.page)}
                    isActive={currentPage === item.page}
                    data-testid={`nav-${item.page}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onNavigate("profile")}
                  isActive={currentPage === "profile"}
                  data-testid="nav-profile"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onNavigate("support")}
                  isActive={currentPage === "support"}
                  data-testid="nav-support"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Customer Care</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onLogout}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
