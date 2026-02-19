import { useState } from "react";
import VehicleFormDialog from "../VehicleFormDialog";
import { Button } from "@/components/ui/button";

export default function VehicleFormDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Vehicle Form</Button>
      <VehicleFormDialog
        open={open}
        onOpenChange={setOpen}
        onSave={(data) => console.log("Saved:", data)}
      />
    </div>
  );
}
