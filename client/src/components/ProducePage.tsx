import { useState } from "react";
import ProduceCard from "./ProduceCard";
import EmptyState from "./EmptyState";
import ProduceFormDialog from "./ProduceFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Leaf } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Produce {
  id: string;
  name: string;
  category: string;
  pricePerKg: number;
  quantityAvailable: number;
  unit: string;
  farmerName: string;
  organic?: boolean;
}

interface ProducePageProps {
  produce: Produce[];
  isMyProduce?: boolean;
  onBuy?: (id: string) => void;
  onAddProduce?: () => void;
  currentUser?: {
    id: string;
    username: string;
    email: string;
    userType: string;
    name: string;
  };
}

export default function ProducePage({ produce, isMyProduce = false, onBuy, onAddProduce, currentUser }: ProducePageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const categories = ["all", ...Array.from(new Set(produce.map((p) => p.category)))];

  const filteredProduce = produce.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduce = () => {
    setIsFormOpen(true);
  };

  const handleFormSave = (data: any) => {
    onAddProduce?.();
    setIsFormOpen(false);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold">
            {isMyProduce ? "My Produce" : "Buy Produce"}
          </h2>
          <p className="text-muted-foreground">
            {isMyProduce
              ? "Manage your produce listings"
              : "Browse fresh produce from local farmers"}
          </p>
        </div>
        {isMyProduce && (
          <Button onClick={handleAddProduce} data-testid="button-add-produce">
            <Plus className="w-4 h-4 mr-2" />
            Add Produce
          </Button>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search produce..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-produce"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-category">
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

      {filteredProduce.length === 0 ? (
        <EmptyState
          icon={Leaf}
          title={isMyProduce ? "No produce listed" : "No produce available"}
          description={
            isMyProduce
              ? "You haven't listed any produce yet. Add your first produce to start selling."
              : "There is no produce matching your search criteria."
          }
          actionLabel={isMyProduce ? "Add Produce" : undefined}
          onAction={isMyProduce ? handleAddProduce : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProduce.map((item) => (
            <ProduceCard key={item.id} {...item} onBuy={onBuy} />
          ))}
        </div>
      )}
      <ProduceFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleFormSave}
        currentUser={currentUser}
      />
    </div>
  );
}
