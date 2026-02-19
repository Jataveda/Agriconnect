import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ItemType = "vehicle" | "produce" | "pesticide";

interface PaymentItem {
  type: ItemType;
  itemId: string;
  itemName: string;
  unitPrice: number;
  unitLabel: string; // e.g. "per day", "per kg", "per unit"
}

interface PaymentPageProps {
  item: PaymentItem;
  currentUser: { id: string; name: string };
  onCancel?: () => void;
  onSuccess?: (orderId: string) => void;
}

export default function PaymentPage({ item, currentUser, onCancel, onSuccess }: PaymentPageProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string>("");

  const isVehicle = item.type === "vehicle";
  const computedTotal = useMemo(() => {
    const base = item.unitPrice * (quantity || 1);
    return Math.max(0, Number(base.toFixed(2)));
  }, [item.unitPrice, quantity]);

  const displayName = useMemo(() => {
    if (isVehicle) {
      const days = quantity || 1;
      return `${item.itemName} - ${days} ${days > 1 ? "days" : "day"}`;
    }
    return `${item.itemName} - ${quantity || 1}`;
  }, [item.itemName, isVehicle, quantity]);

  const handlePay = async () => {
    setError("");
    setIsPaying(true);
    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Create order on successful payment
      const body: any = {
        type: item.type,
        itemId: item.itemId,
        itemName: displayName,
        total: computedTotal,
        quantity,
        userId: currentUser.id,
        userName: currentUser.name,
      };
      if (isVehicle) {
        body.startDate = startDate || null;
        body.endDate = endDate || null;
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create order");
      }

      const order = await response.json();
      onSuccess?.(order.id);
    } catch (e: any) {
      setError(e?.message || "Payment failed");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Checkout</h2>
        <p className="text-muted-foreground">Complete your payment to place the order</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold" data-testid="text-item-name">{displayName}</div>
              <div className="text-sm text-muted-foreground">
                {item.unitLabel}: ${item.unitPrice}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-xl font-bold text-primary" data-testid="text-total">${computedTotal}</div>
            </div>
          </div>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">{isVehicle ? "Days" : "Quantity"}</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              />
              <div className="text-xs text-muted-foreground">{isVehicle ? "Price per day" : "Unit price"} applies</div>
            </div>

            {isVehicle && (
              <div className="space-y-2">
                <Label>Rental Dates (optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="text-xs text-muted-foreground">Dates are optional; total uses days above.</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="pm-card" />
              <Label htmlFor="pm-card">Card (Credit/Debit)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upi" id="pm-upi" />
              <Label htmlFor="pm-upi">UPI</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="netbanking" id="pm-net" />
              <Label htmlFor="pm-net">Net Banking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wallet" id="pm-wallet" />
              <Label htmlFor="pm-wallet">Wallets</Label>
            </div>
          </RadioGroup>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} disabled={isPaying}>
              Cancel
            </Button>
            <Button className="" onClick={handlePay} disabled={isPaying} data-testid="button-pay">
              {isPaying ? "Processing..." : "Pay & Place Order"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}