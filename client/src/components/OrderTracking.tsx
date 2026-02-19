import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, Clock, Truck, Package, MessageCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type OrderStatus = "pending" | "confirmed" | "in-transit" | "delivered" | "cancelled";

export interface Order {
  id: string;
  type: "vehicle" | "produce" | "pesticide";
  itemName: string;
  date: string;
  status: OrderStatus;
  total: number;
}

interface OrderTrackingProps {
  orders: Order[];
  onOpenChat?: (orderId: string, orderTitle: string) => void;
  onTrack?: (orderId: string) => void;
  showChatButton?: boolean;
}

const statusConfig: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pending: { label: "Pending", variant: "secondary" },
  confirmed: { label: "Confirmed", variant: "default" },
  "in-transit": { label: "In Transit", variant: "default" },
  delivered: { label: "Delivered", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

const typeIcons = {
  vehicle: Truck,
  produce: Package,
  pesticide: Package,
};

export default function OrderTracking({
  orders,
  onOpenChat,
  onTrack,
  showChatButton = true,
}: OrderTrackingProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No orders yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const Icon = typeIcons[order.type];
            const statusInfo = statusConfig[order.status];
            return (
              <TableRow
                key={order.id}
                className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted animate-fadeIn"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{order.itemName}</div>
                      <div className="text-sm text-muted-foreground">#{order.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {showChatButton && order.status !== "cancelled" && onOpenChat && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenChat(order.id, order.itemName)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  )}
                  {order.status === "in-transit" && onTrack && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTrack(order.id)}
                      className="ml-2"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Track
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>
    </Card>
  );
}
