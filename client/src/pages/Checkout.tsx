import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Loader2, CheckCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  phone: z.string().min(5, "Phone is required"),
  paymentMethod: z.enum(["credit_card", "vodafone_cash", "paypal"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, total } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [success, setSuccess] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      phone: "",
      paymentMethod: "credit_card",
    },
  });

  if (items.length === 0 && !success) {
    setLocation("/products");
    return null;
  }

  if (!isAuthenticated) {
     return (
       <Layout>
         <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
           <h1 className="text-2xl font-bold">Please Login to Checkout</h1>
           <a href="/api/login">
             <Button size="lg" className="bg-primary text-primary-foreground">Login / Sign Up</Button>
           </a>
         </div>
       </Layout>
     );
  }

  const onSubmit = (data: CheckoutFormValues) => {
    createOrder({
      items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
      paymentMethod: data.paymentMethod,
      shippingAddress: {
        fullName: data.fullName,
        address: data.address,
        city: data.city,
        phone: data.phone,
      },
    }, {
      onSuccess: () => {
        setSuccess(true);
      }
    });
  };

  if (success) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Thank you for your purchase. You will receive an email confirmation shortly.
          </p>
          <div className="flex gap-4">
             <Button onClick={() => setLocation("/products")} variant="outline">Continue Shopping</Button>
             <Button onClick={() => setLocation("/account")}>View Order</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-xl">
              <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-black/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Street Name" {...field} className="bg-black/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} className="bg-black/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 234 567 890" {...field} className="bg-black/20" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-white/10 p-4 hover:bg-white/5 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="credit_card" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer flex-grow">
                                  Credit Card
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-white/10 p-4 hover:bg-white/5 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="vodafone_cash" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Vodafone Cash
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border border-white/10 p-4 hover:bg-white/5 cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value="paypal" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  PayPal
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 text-lg font-bold mt-6 bg-primary text-primary-foreground hover:bg-primary/90 neon-glow" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      `Pay $${(total * 1.08).toFixed(2)}`
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="glass-card p-6 rounded-xl sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 max-h-[300px] overflow-auto mb-6 pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 bg-muted rounded overflow-hidden">
                       <img src={item.images[0] || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop"} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-mono">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 border-t border-white/10 pt-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-primary">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-gradient">${(total * 1.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
