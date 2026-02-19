import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddProduceForm from "./AddProduceForm";

interface ProduceFormDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (data: any) => void;
  currentUser?: {
    id: string;
    username: string;
    email: string;
    userType: string;
    name: string;
  };
}

export default function ProduceFormDialog({ 
  open = false, 
  onOpenChange, 
  onSave,
  currentUser 
}: ProduceFormDialogProps) {
  const handleSave = (data: any) => {
    onSave?.(data);
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Produce</DialogTitle>
          <DialogDescription>
            List your fresh produce for sale on the marketplace
          </DialogDescription>
        </DialogHeader>
        <AddProduceForm
          onSave={handleSave}
          onCancel={handleCancel}
          currentUser={currentUser}
        />
      </DialogContent>
    </Dialog>
  );
}