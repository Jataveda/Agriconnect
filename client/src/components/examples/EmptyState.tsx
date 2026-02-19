import EmptyState from "../EmptyState";
import { Package } from "lucide-react";

export default function EmptyStateExample() {
  return (
    <div className="p-4">
      <EmptyState
        icon={Package}
        title="No items found"
        description="You haven't added any items yet. Start by adding your first item to the marketplace."
        actionLabel="Add Item"
        onAction={() => console.log("Add item clicked")}
      />
    </div>
  );
}
