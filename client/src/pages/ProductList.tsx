import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, FilterX } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Debounce search ideally, but for now direct binding
  const { data: products, isLoading } = useProducts({
    search: search || undefined,
    category: category && category !== "all" ? category : undefined,
    maxPrice: priceRange[1].toString(),
  });

  const categories = ["all", "electronics", "fashion", "home", "accessories"];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Shop</h1>
            <p className="text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-black/20 border-white/10 focus:border-primary"
              />
            </div>
            
            {/* Mobile Filter Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden border-white/20">
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-card border-r border-white/10 w-[300px]">
                <div className="py-6 space-y-6">
                   <h3 className="text-lg font-bold">Filters</h3>
                   <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full bg-black/20 border-white/10">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="capitalize">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">Max Price</label>
                      <span className="text-sm text-muted-foreground">${priceRange[1]}</span>
                    </div>
                    <Slider
                      defaultValue={[1000]}
                      max={2000}
                      step={10}
                      value={[priceRange[1]]}
                      onValueChange={(val) => setPriceRange([0, val[0]])}
                      className="py-4"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full text-muted-foreground hover:text-white"
                    onClick={() => { setCategory(""); setPriceRange([0, 1000]); setSearch(""); }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block space-y-8 sticky top-24 h-fit">
            <div className="glass-card p-6 rounded-xl space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <Button 
                      key={cat}
                      variant="ghost" 
                      className={`justify-start capitalize ${category === cat || (category === "" && cat === "all") ? "bg-white/10 text-primary" : "text-muted-foreground hover:text-white"}`}
                      onClick={() => setCategory(cat === "all" ? "" : cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                   <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Price Range</label>
                   <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded text-primary">${priceRange[1]}</span>
                </div>
                <Slider
                  defaultValue={[1000]}
                  max={2000}
                  step={10}
                  value={[priceRange[1]]}
                  onValueChange={(val) => setPriceRange([0, val[0]])}
                />
              </div>

              <Button 
                variant="outline" 
                className="w-full border-white/10 hover:bg-white/5 hover:text-destructive"
                onClick={() => { setCategory(""); setPriceRange([0, 1000]); setSearch(""); }}
              >
                <FilterX className="mr-2 h-4 w-4" /> Reset Filters
              </Button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="min-h-[500px]">
            {isLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="h-[400px] bg-white/5 animate-pulse rounded-xl" />
                 ))}
               </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 border-dashed">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
                <Button onClick={() => { setCategory(""); setPriceRange([0, 1000]); setSearch(""); }}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
