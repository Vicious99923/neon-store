import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { Loader2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Account() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  if (authLoading) {
    return <Layout><div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div></Layout>;
  }

  if (!isAuthenticated) {
     window.location.href = "/api/login";
     return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/4">
             <div className="glass-card p-6 rounded-xl text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/50">
                  {user?.firstName?.charAt(0)}
                </div>
                <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-muted-foreground text-sm mb-6">{user?.email}</p>
                <Button variant="outline" className="w-full border-white/10" onClick={() => window.location.href = "/api/logout"}>
                  Log Out
                </Button>
             </div>
          </div>

          {/* Orders Content */}
          <div className="w-full md:w-3/4">
            <h2 className="text-2xl font-bold mb-6">Order History</h2>
            
            {ordersLoading ? (
               <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
            ) : orders && orders.length > 0 ? (
               <div className="space-y-4">
                 {orders.map((order) => (
                   <div key={order.id} className="glass-card p-6 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">Order #{order.id}</h3>
                          <Badge className={
                            order.status === 'delivered' ? 'bg-green-500/20 text-green-500' : 
                            order.status === 'processing' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-yellow-500/20 text-yellow-500'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {order.createdAt ? format(new Date(order.createdAt), "PPP") : "Date N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-bold text-gradient">${Number(order.totalAmount).toFixed(2)}</p>
                         <p className="text-sm text-muted-foreground">{order.paymentMethod.replace('_', ' ')}</p>
                      </div>
                   </div>
                 ))}
               </div>
            ) : (
              <div className="text-center py-12 glass-card rounded-xl">
                 <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                 <h3 className="text-lg font-bold mb-2">No orders yet</h3>
                 <p className="text-muted-foreground">Once you place an order, it will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
