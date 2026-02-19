import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Leaf, User, Package } from "lucide-react";

interface ProduceCardProps {
  id: string;
  name: string;
  category: string;
  pricePerKg: number;
  quantityAvailable: number;
  unit: string;
  farmerName: string;
  imageUrl?: string;
  organic?: boolean;
  onBuy?: (id: string) => void;
}

export default function ProduceCard({
  id,
  name,
  category,
  pricePerKg,
  quantityAvailable,
  unit,
  farmerName,
  imageUrl,
  organic = false,
  onBuy,
}: ProduceCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate">
      <div className="aspect-square bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="w-16 h-16 text-primary" />
          </div>
        )}
        {organic && (
          <Badge className="absolute top-2 right-2 bg-primary" data-testid={`badge-organic-${id}`}>
            Organic
          </Badge>
        )}
      </div>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg" data-testid={`text-produce-name-${id}`}>{name}</CardTitle>
        <div className="text-sm text-muted-foreground">{category}</div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="w-4 h-4" />
          <span>By {farmerName}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="w-4 h-4" />
          <span>{quantityAvailable} {unit} available</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-primary" data-testid={`text-price-${id}`}>
            ${pricePerKg}
          </span>
          <span className="text-sm text-muted-foreground">per {unit}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onBuy?.(id)}
          data-testid={`button-buy-${id}`}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
