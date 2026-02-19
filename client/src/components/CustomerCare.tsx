import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CustomerCare() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support request:", formData);
    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const faqs = [
    {
      question: "How do I rent a vehicle?",
      answer: "Browse available vehicles in the 'Rent Vehicles' section, select your desired vehicle, choose your rental dates, and complete the booking. You'll receive an email confirmation with all details.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital payment methods. Payment is processed securely during checkout.",
    },
    {
      question: "How can I list my vehicle for rent?",
      answer: "Navigate to 'My Vehicles' in your farmer dashboard, click 'Add Vehicle', fill in the details including photos, pricing, and availability, then submit for approval.",
    },
    {
      question: "What if I need to cancel an order?",
      answer: "You can cancel pending orders from the 'My Orders' section. Confirmed orders may incur cancellation fees. Please contact support for assistance.",
    },
    {
      question: "How do I track my orders?",
      answer: "Visit the 'My Orders' section to view real-time status updates for all your purchases and rentals. You'll also receive email notifications for status changes.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Customer Care</h2>
        <p className="text-muted-foreground">We're here to help with any questions or concerns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <Mail className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">Email Us</h3>
            <p className="text-sm text-muted-foreground">support@agriconnect.com</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Phone className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">Call Us</h3>
            <p className="text-sm text-muted-foreground">1-800-AGRI-HELP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-1">Business Hours</h3>
            <p className="text-sm text-muted-foreground">Mon-Fri: 8AM - 6PM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill out the form and we'll respond within 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  data-testid="input-support-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  data-testid="input-support-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  data-testid="input-support-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  data-testid="input-support-message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full" data-testid="button-send-message">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger data-testid={`faq-question-${index}`}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent data-testid={`faq-answer-${index}`}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
