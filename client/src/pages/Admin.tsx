import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Edit, 
  Search,
  Download,
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertProductSchema } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product, Order } from "@shared/schema";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  imagesString: z.string().url("Please enter a valid URL"),
  tags: z.string().optional(),
  sizes: z.string().optional(),
  colors: z.string().optional(),
});

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-700 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-700 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-700 border-red-500/30",
};

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: TrendingUp,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  
  // State management
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<"price" | "stock" | "name">("name");
  const [orderSortBy, setOrderSortBy] = useState<"date" | "total" | "status">("date");
  const [showLowStock, setShowLowStock] = useState(false);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      imagesString: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500",
      tags: "",
      sizes: "",
      colors: "",
    },
  });

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!products || !orders) return null;
    
    const totalRevenue = orders.reduce((sum, order) => 
      sum + Number(order.totalAmount), 0
    );
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const totalProducts = products.length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    
    const revenueByCategory = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 
        (orders.filter(o => o.id === product.id).length * Number(product.price));
      return acc;
    }, {} as Record<string, number>);
    
    const topSellingCategory = Object.entries(revenueByCategory)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";
    
    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      totalProducts,
      outOfStock,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      topSellingCategory,
    };
  }, [products, orders]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                           p.description.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchesLowStock = !showLowStock || p.stock < 10;
      
      return matchesSearch && matchesCategory && matchesLowStock;
    });
    
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "price") {
        comparison = Number(a.price) - Number(b.price);
      } else if (sortBy === "stock") {
        comparison = a.stock - b.stock;
      } else {
        comparison = a.name.localeCompare(b.name);
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    return filtered;
  }, [products, productSearch, categoryFilter, showLowStock, sortBy, sortOrder]);

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    let filtered = orders.filter(o => {
      const matchesSearch = o.shippingAddress.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                           o.id.toString().includes(orderSearch);
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    filtered.sort((a, b) => {
      if (orderSortBy === "total") {
        return sortOrder === "asc" 
          ? Number(a.totalAmount) - Number(b.totalAmount)
          : Number(b.totalAmount) - Number(a.totalAmount);
      } else if (orderSortBy === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else {
        const dateA = new Date(a.createdAt!).getTime();
        const dateB = new Date(b.createdAt!).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });
    
    return filtered;
  }, [orders, orderSearch, statusFilter, orderSortBy, sortOrder]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  const onSubmit = (values: z.infer<typeof productFormSchema>) => {
    createProduct({
      ...values,
      price: values.price.toString(),
      images: values.imagesString.split(',').map(s => s.trim()),
      tags: values.tags ? values.tags.split(',').map(s => s.trim()) : [],
      sizes: values.sizes ? values.sizes.split(',').map(s => s.trim()) : [],
      colors: values.colors ? values.colors.split(',').map(s => s.trim()) : [],
    }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  const handleExportProducts = () => {
    if (!products) return;
    
    const csv = [
      ["ID", "Name", "Price", "Category", "Stock", "Description"],
      ...products.map(p => [
        p.id,
        p.name,
        p.price,
        p.category,
        p.stock,
        p.description
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neon-products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportOrders = () => {
    if (!orders) return;
    
    const csv = [
      ["Order ID", "Customer", "Total", "Status", "Date"],
      ...orders.map(o => [
        o.id,
        o.shippingAddress.fullName,
        o.totalAmount,
        o.status,
        new Date(o.createdAt!).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neon-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      selectedProducts.forEach(id => deleteProduct(id));
      setSelectedProducts([]);
    }
  };

  const toggleProductSelection = (id: number) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  if (authLoading) return null;
  if (!isAuthenticated) {
     window.location.href = "/api/login";
     return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              NEON Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage your store with powerful insights</p>
          </div>
          <Badge variant="outline" className="text-sm">
            <Users className="h-3 w-3 mr-1" />
            {user?.username}
          </Badge>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${analytics.averageOrderValue.toFixed(2)} avg order
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.pendingOrders} pending
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.outOfStock} out of stock
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.lowStockProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Products below 10 units
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Low Stock Alert */}
        {analytics && analytics.lowStockProducts > 0 && (
          <Alert className="mb-6 border-orange-500/50 bg-orange-500/10">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-700">
              You have {analytics.lowStockProducts} product(s) with low stock. Consider restocking soon.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 mb-8">
            <TabsTrigger value="products" className="data-[state=active]:bg-purple-500/20">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-500/20">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-green-500/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products">
            {/* Filters and Actions */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                          Fill in the details to create a new product
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Product Name *</FormLabel>
                                <FormControl><Input {...field} placeholder="Premium Wireless Headphones" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price *</FormLabel>
                                  <FormControl><Input type="number" step="0.01" {...field} placeholder="99.99" /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="stock"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stock Quantity *</FormLabel>
                                  <FormControl><Input type="number" {...field} placeholder="100" /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category *</FormLabel>
                                <FormControl><Input {...field} placeholder="Electronics" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="imagesString"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL *</FormLabel>
                                <FormControl><Input {...field} placeholder="https://example.com/image.jpg" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name="tags"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tags</FormLabel>
                                  <FormControl><Input {...field} placeholder="wireless,premium" /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="sizes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Sizes</FormLabel>
                                  <FormControl><Input {...field} placeholder="S,M,L,XL" /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="colors"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Colors</FormLabel>
                                  <FormControl><Input {...field} placeholder="Black,White" /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description *</FormLabel>
                                <FormControl><Textarea {...field} rows={4} placeholder="Detailed product description..." /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-600" 
                            disabled={isCreating}
                          >
                            {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Product"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" onClick={handleExportProducts}>
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                  </Button>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="lowStock"
                    checked={showLowStock}
                    onCheckedChange={(checked) => setShowLowStock(checked as boolean)}
                  />
                  <label htmlFor="lowStock" className="text-sm cursor-pointer">
                    Show low stock only
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>

                {selectedProducts.length > 0 && (
                  <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete {selectedProducts.length} selected
                  </Button>
                )}
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onCheckedChange={toggleAllProducts}
                      />
                    </TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-white/5">
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => toggleProductSelection(product.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">#{product.id}</TableCell>
                      <TableCell>
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">${Number(product.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={product.stock < 10 ? "text-orange-500 font-semibold" : ""}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        {product.stock === 0 ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : product.stock < 10 ? (
                          <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/30">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="icon" className="hover:bg-blue-500/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:bg-purple-500/10">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this product?')) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders">
            {/* Order Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              <div className="flex-1 flex gap-2 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={orderSortBy} onValueChange={(v: any) => setOrderSortBy(v)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="total">Total</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>

                <Button variant="outline" onClick={handleExportOrders}>
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : filteredOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status as keyof typeof statusIcons];
                    return (
                      <TableRow key={order.id} className="hover:bg-white/5">
                        <TableCell className="font-mono text-xs">#{order.id}</TableCell>
                        <TableCell className="font-medium">{order.shippingAddress.fullName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{order.shippingAddress.phone}</TableCell>
                        <TableCell className="font-semibold">${Number(order.totalAmount).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {order.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[order.status as keyof typeof statusColors]} capitalize`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.createdAt!).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="hover:bg-blue-500/10">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Total revenue and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <span className="text-2xl font-bold">${analytics?.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Order Value</span>
                      <span className="text-lg font-semibold flex items-center gap-2">
                        ${analytics?.averageOrderValue.toFixed(2)}
                        <Badge variant="outline" className="text-green-500">
                          <ArrowUp className="h-3 w-3" />
                        </Badge>
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Top Category</span>
                      <Badge className="bg-purple-500/20 text-purple-700">
                        {analytics?.topSellingCategory}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Statistics</CardTitle>
                  <CardDescription>Order status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders && Object.entries(
                      orders.reduce((acc, order) => {
                        acc[order.status] = (acc[order.status] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([status, count]) => {
                      const StatusIcon = statusIcons[status as keyof typeof statusIcons];
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <span className="text-sm capitalize">{status}</span>
                          </div>
                          <Badge className={statusColors[status as keyof typeof statusColors]}>
                            {count}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>Stock levels and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Products</span>
                      <span className="text-2xl font-bold">{analytics?.totalProducts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Out of Stock</span>
                      <Badge variant="destructive">{analytics?.outOfStock}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Low Stock</span>
                      <Badge className="bg-orange-500/20 text-orange-700">
                        {analytics?.lowStockProducts}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Download className="h-5 w-5" />
                      <span className="text-xs">Export Data</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Filter className="h-5 w-5" />
                      <span className="text-xs">Advanced Filters</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <BarChart3 className="h-5 w-5" />
                      <span className="text-xs">View Reports</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Package className="h-5 w-5" />
                      <span className="text-xs">Bulk Update</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
