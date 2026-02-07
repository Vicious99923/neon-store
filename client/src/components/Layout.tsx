import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Heart, User, LogOut, Menu, X, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { itemCount } = useCart();

  const isAdmin = true; // For demo purposes, we treat everyone as admin if logged in, or check specific ID

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-display font-bold tracking-tighter text-gradient hover:opacity-80 transition-opacity">
              NEON DROP
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/products" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/products' ? 'text-primary' : 'text-muted-foreground'}`}>
                Shop
              </Link>
              <Link href="/about" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/about' ? 'text-primary' : 'text-muted-foreground'}`}>
                About
              </Link>
              <Link href="/contact" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/contact' ? 'text-primary' : 'text-muted-foreground'}`}>
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:text-primary hover:bg-primary/10 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full animate-in zoom-in">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-white/10 hover:border-primary/50 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {user?.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-white/10">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.firstName && <p className="font-medium">{user.firstName} {user.lastName}</p>}
                      <p className="w-[200px] truncate text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" /> Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" /> Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                     <DropdownMenuItem asChild>
                     <Link href="/admin" className="cursor-pointer">
                       <Shield className="mr-2 h-4 w-4" /> Admin Dashboard
                     </Link>
                   </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex gap-2">
                <a href="/api/login">
                  <Button variant="outline" className="border-white/20 hover:border-primary hover:text-primary">
                    Login
                  </Button>
                </a>
                <a href="/api/login">
                   <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Sign Up</Button>
                </a>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-card border-l border-white/10">
                <div className="flex flex-col gap-6 mt-6">
                  <Link href="/" className="text-2xl font-display font-bold text-gradient">NEON DROP</Link>
                  <div className="flex flex-col gap-4">
                    <Link href="/products" className="text-lg font-medium">Shop</Link>
                    <Link href="/wishlist" className="text-lg font-medium">Wishlist</Link>
                    <Link href="/about" className="text-lg font-medium">About</Link>
                    <Link href="/contact" className="text-lg font-medium">Contact</Link>
                    {!isAuthenticated && (
                       <a href="/api/login" className="text-lg font-medium text-primary">Login / Sign Up</a>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-display font-bold mb-4 text-white">NEON DROP</h3>
              <p className="text-muted-foreground text-sm">
                Premium dropshipping experience with high-quality products and fast shipping.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products?category=electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
                <li><Link href="/products?category=fashion" className="hover:text-primary transition-colors">Fashion</Link></li>
                <li><Link href="/products?category=home" className="hover:text-primary transition-colors">Home & Living</Link></li>
                <li><Link href="/products" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
                <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-primary transition-colors">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Stay in the loop</h4>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-black/20 border border-white/10 rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-primary/50"
                />
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Neon Drop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
