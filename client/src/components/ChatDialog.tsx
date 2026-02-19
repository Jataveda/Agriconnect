import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import ChatPanel, { Message } from "./ChatPanel";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderTitle: string;
  currentUserType: "farmer" | "customer";
  currentUserId: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function ChatDialog({
  open,
  onOpenChange,
  orderId,
  orderTitle,
  currentUserType,
  currentUserId,
  messages,
  onSendMessage,
}: ChatDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] p-0">
        <DialogDescription className="sr-only">
          Chat conversation for order {orderId}
        </DialogDescription>
        <ChatPanel
          orderId={orderId}
          orderTitle={orderTitle}
          currentUserType={currentUserType}
          currentUserId={currentUserId}
          messages={messages}
          onSendMessage={onSendMessage}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
