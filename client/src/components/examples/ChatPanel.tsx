import { useState } from "react";
import ChatPanel, { Message } from "../ChatPanel";

export default function ChatPanelExample() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      senderId: "farmer-1",
      senderName: "Michael Chen",
      senderType: "farmer",
      content: "Hello! Your tractor rental is confirmed for next week.",
      timestamp: "10:30 AM",
    },
    {
      id: "m2",
      senderId: "customer-1",
      senderName: "John Doe",
      senderType: "customer",
      content: "Great! What time can I pick it up?",
      timestamp: "10:32 AM",
    },
    {
      id: "m3",
      senderId: "farmer-1",
      senderName: "Michael Chen",
      senderType: "farmer",
      content: "Anytime after 8 AM. The tractor will be ready and fueled.",
      timestamp: "10:35 AM",
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
    <div className="p-4 h-[600px]">
      <ChatPanel
        orderId="ORD-001"
        orderTitle="Tractor Rental - 3 Days"
        currentUserType="customer"
        currentUserId="customer-1"
        messages={messages}
        onSendMessage={handleSendMessage}
        onClose={() => console.log("Close chat")}
      />
    </div>
  );
}
