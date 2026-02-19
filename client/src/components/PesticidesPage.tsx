import { useState } from "react";
import PesticideCard from "./PesticideCard";
import EmptyState from "./EmptyState";
import { Input } from "@/components/ui/input";
import { Search, Beaker } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Pesticide {
  id: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  inStock: boolean;
  category?: string;
}

interface PesticidesPageProps {
  pesticides: Pesticide[];
  onBuy?: (id: string) => void;
}

export default function PesticidesPage({ pesticides, onBuy }: PesticidesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set(pesticides.map((p) => p.category || "Other")))];

  const filteredPesticides = pesticides.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || (item.category || "Other") === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Buy Pesticides</h2>
        <p className="text-muted-foreground">
          Quality pesticides and agricultural chemicals for your crops
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search pesticides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-pesticides"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-pesticide-category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredPesticides.length === 0 ? (
        <EmptyState
          icon={Beaker}
          title="No pesticides available"
          description="There are no pesticides matching your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPesticides.map((item) => (
            <PesticideCard key={item.id} {...item} onBuy={onBuy} />
          ))}
        </div>
      )}
    </div>
  );
}
