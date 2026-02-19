import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, X } from "lucide-react";

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "farmer" | "customer";
  content: string;
  timestamp: string;
}

interface ChatPanelProps {
  orderId: string;
  orderTitle: string;
  currentUserType: "farmer" | "customer";
  currentUserId: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onClose?: () => void;
}

export default function ChatPanel({
  orderId,
  orderTitle,
  currentUserType,
  currentUserId,
  messages,
  onSendMessage,
  onClose,
}: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const otherUserType = currentUserType === "farmer" ? "customer" : "farmer";

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base" data-testid="text-chat-title">
              Chat: {orderTitle}
            </CardTitle>
            <p className="text-xs text-muted-foreground">Order #{orderId}</p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-chat"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No messages yet</p>
                <p className="text-xs mt-1">Start a conversation about this order</p>
              </div>
            ) : (
              messages.map((message) => {
                const isCurrentUser = message.senderId === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}
                    data-testid={`message-${message.id}`}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className={isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
                        {message.senderType === "farmer" ? "F" : "C"}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col gap-1 max-w-[70%] ${isCurrentUser ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{message.senderName}</span>
                        <span>•</span>
                        <span>{message.timestamp}</span>
                      </div>
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm" data-testid={`message-content-${message.id}`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSend} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder={`Message ${otherUserType}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              data-testid="input-chat-message"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()} data-testid="button-send-message">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
