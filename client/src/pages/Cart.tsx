import { Layout } from "@/components/Layout";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Looks like you haven't added anything to your cart yet. Explore our products to find something you love.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-primary text-primary-foreground">
              Start Shopping
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <motion.div 
                layout
                key={item.id} 
                className="flex flex-col sm:flex-row gap-6 p-6 glass-card rounded-xl border-l-4 border-l-primary/50"
              >
                <div className="h-24 w-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                   <img 
                    src={item.images[0] || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=200&fit=crop"} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                   />
                </div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/products/${item.id}`} className="hover:text-primary transition-colors">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                    </Link>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{item.category}</p>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-white/10 rounded-lg bg-black/20">
                      <button 
                        className="px-3 py-1 hover:bg-white/5 transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >-</button>
                      <span className="px-3 py-1 border-x border-white/10 w-8 text-center text-sm">{item.quantity}</span>
                      <button 
                        className="px-3 py-1 hover:bg-white/5 transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >+</button>
                    </div>
                    <p className="text-lg font-bold">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 rounded-xl sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-primary">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (Est.)</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-gradient">${(total * 1.08).toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full h-12 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
