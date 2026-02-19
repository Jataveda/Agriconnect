import { useState } from "react";
import ChatDialog from "../ChatDialog";
import { Button } from "@/components/ui/button";
import { Message } from "../ChatPanel";

export default function ChatDialogExample() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      senderId: "farmer-1",
      senderName: "Michael Chen",
      senderType: "farmer",
      content: "Hello! Your tractor rental is confirmed.",
      timestamp: "10:30 AM",
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      senderId: "customer-1",
      senderName: "John Doe",
      senderType: "customer",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Chat</Button>
      <ChatDialog
        open={open}
        onOpenChange={setOpen}
        orderId="ORD-001"
        orderTitle="Tractor Rental - 3 Days"
        currentUserType="customer"
        currentUserId="customer-1"
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
