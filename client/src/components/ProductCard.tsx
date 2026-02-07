import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useAddToWishlist, useWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { data: wishlist } = useWishlist();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { isAuthenticated } = useAuth();

  const isWishlisted = wishlist?.some((item) => item.id === product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/products/${product.id}`}>
        <Card className="group h-full overflow-hidden border-white/10 bg-black/40 hover:border-primary/50 transition-colors duration-300">
          <div className="relative aspect-square overflow-hidden bg-muted">
             {/* Unsplash placeholder image based on category or random tech */}
            <img
              src={product.images[0] || `https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=500&fit=crop`}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {Number(product.stock) === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm font-bold uppercase tracking-widest">Out of Stock</Badge>
              </div>
            )}

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                className={`rounded-full h-8 w-8 shadow-lg ${isWishlisted ? 'text-accent bg-accent/20' : ''}`}
                onClick={toggleWishlist}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-normal border-white/20 text-muted-foreground">
                {product.category}
              </Badge>
              {Number(product.stock) < 5 && Number(product.stock) > 0 && (
                 <span className="text-xs text-orange-400">Low Stock</span>
              )}
            </div>
            <h3 className="font-display text-lg font-bold leading-tight line-clamp-1 mb-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gradient">
                ${Number(product.price).toFixed(2)}
              </span>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button 
              className="w-full bg-white/5 hover:bg-primary hover:text-primary-foreground border border-white/10 hover:border-primary transition-all duration-300"
              onClick={handleAddToCart}
              disabled={Number(product.stock) === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
