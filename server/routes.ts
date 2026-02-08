import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertProductSchema, insertReviewSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === Products ===
  app.get(api.products.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

    const products = await storage.getProducts({
      category,
      search,
      minPrice,
      maxPrice,
    });

    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.put(api.products.update.path, async (req, res) => {
    try {
      const input = insertProductSchema.partial().parse(req.body);
      const updated = await storage.updateProduct(
        Number(req.params.id),
        input
      );

      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.products.delete.path, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  // === Orders ===
  app.get(api.orders.list.path, async (req, res) => {
    const userId = "demo-user";
    const orders = await storage.getOrders(userId);
    res.json(orders);
  });

  app.post(api.orders.create.path, async (req, res) => {
    try {
      const userId = "demo-user";
      const input = api.orders.create.input.parse(req.body);
      const order = await storage.createOrder(userId, input);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.orders.get.path, async (req, res) => {
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  });

  // === Wishlist ===
  app.get(api.wishlist.list.path, async (req, res) => {
    const userId = "demo-user";
    const items = await storage.getWishlist(userId);
    res.json(items);
  });

  app.post(api.wishlist.add.path, async (req, res) => {
    const userId = "demo-user";
    await storage.addToWishlist(userId, Number(req.params.productId));
    res.json({ success: true });
  });

  app.delete(api.wishlist.remove.path, async (req, res) => {
    const userId = "demo-user";
    await storage.removeFromWishlist(userId, Number(req.params.productId));
    res.status(204).send();
  });

  // === Reviews ===
  app.get(api.reviews.list.path, async (req, res) => {
    const reviews = await storage.getReviews(
      Number(req.params.productId)
    );
    res.json(reviews);
  });

  app.post(api.reviews.create.path, async (req, res) => {
    try {
      const input = insertReviewSchema.parse({
        ...req.body,
        productId: Number(req.params.productId),
      });

      const review = await storage.createReview(
        "demo-user",
        "Anonymous",
        input
      );

      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // === Seed Data ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length > 0) return;

  const products = [
    {
      name: "Neon Cyber Headphones",
      description:
        "High-fidelity wireless headphones with active noise cancellation and customizable RGB lighting.",
      price: "129.99",
      category: "Electronics",
      stock: 50,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      ],
      tags: ["wireless", "audio", "rgb"],
      sizes: [],
      colors: ["Black", "White", "Neon Blue"],
    },
    {
      name: "Holographic Backpack",
      description:
        "Futuristic backpack with holographic finish and smart charging port.",
      price: "79.99",
      category: "Accessories",
      stock: 100,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      ],
      tags: ["fashion", "travel", "smart"],
      sizes: [],
      colors: ["Silver", "Pink"],
    },
    {
      name: "Smart Fitness Watch",
      description:
        "Track your health and workouts with this sleek, waterproof smart watch.",
      price: "199.99",
      category: "Electronics",
      stock: 30,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      ],
      tags: ["fitness", "tech", "waterproof"],
      sizes: ["S", "M", "L"],
      colors: ["Black", "Gold"],
    },
  ];

  for (const product of products) {
    await storage.createProduct(product);
  }
}
