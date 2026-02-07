import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useWishlist() {
  return useQuery({
    queryKey: [api.wishlist.list.path],
    queryFn: async () => {
      const res = await fetch(api.wishlist.list.path, { credentials: "include" });
      if (res.status === 401) return []; // Gracefully handle not logged in
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return api.wishlist.list.responses[200].parse(await res.json());
    },
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: number) => {
      const url = buildUrl(api.wishlist.add.path, { productId });
      const res = await fetch(url, {
        method: api.wishlist.add.method,
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Please log in to use wishlist");
        throw new Error("Failed to add to wishlist");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.wishlist.list.path] });
      toast({ title: "Success", description: "Added to wishlist" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (productId: number) => {
      const url = buildUrl(api.wishlist.remove.path, { productId });
      const res = await fetch(url, {
        method: api.wishlist.remove.method,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to remove from wishlist");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.wishlist.list.path] });
      toast({ title: "Removed", description: "Removed from wishlist" });
    },
  });
}
