import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Beaker, Package } from "lucide-react";

interface PesticideCardProps {
  id: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  inStock: boolean;
  imageUrl?: string;
  category?: string;
  onBuy?: (id: string) => void;
}

export default function PesticideCard({
  id,
  name,
  brand,
  size,
  price,
  inStock,
  imageUrl,
  category,
  onBuy,
}: PesticideCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate">
      <div className="aspect-square bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Beaker className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <Badge
          className="absolute top-2 right-2"
          variant={inStock ? "default" : "secondary"}
          data-testid={`badge-stock-${id}`}
        >
          {inStock ? "In Stock" : "Out of Stock"}
        </Badge>
      </div>
      <CardHeader className="pb-3">
        <div className="text-xs text-muted-foreground font-semibold uppercase">{brand}</div>
        <CardTitle className="text-base" data-testid={`text-product-name-${id}`}>{name}</CardTitle>
        {category && <div className="text-sm text-muted-foreground">{category}</div>}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package className="w-4 h-4" />
          <span>{size}</span>
        </div>
        <div className="text-2xl font-bold text-primary pt-2" data-testid={`text-price-${id}`}>
          ${price}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!inStock}
          onClick={() => onBuy?.(id)}
          data-testid={`button-buy-${id}`}
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
