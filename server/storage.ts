import { db } from "./db";
import { users, type User as AuthUser, type UpsertUser } from "@shared/models/auth";
import {
  products, orders, orderItems, reviews, wishlist,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type Review, type InsertReview,
  type WishlistItem,
  type CreateOrderRequest,
  type OrderWithItems
} from "@shared/schema";
import { eq, desc, sql, and, like, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Auth Users
  getUser(id: string): Promise<AuthUser | undefined>;
  
  // Products
  getProducts(filters?: { category?: string; search?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  // Orders
  getOrders(userId?: string): Promise<Order[]>; // If userId provided, filter by user, else all (admin)
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  createOrder(userId: string, orderData: CreateOrderRequest): Promise<Order>;

  // Wishlist
  getWishlist(userId: string): Promise<Product[]>;
  addToWishlist(userId: string, productId: number): Promise<void>;
  removeFromWishlist(userId: string, productId: number): Promise<void>;

  // Reviews
  getReviews(productId: number): Promise<Review[]>;
  createReview(userId: string, userName: string, review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getProducts(filters?: { category?: string; search?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
    let conditions = [];
    if (filters?.category) conditions.push(eq(products.category, filters.category));
    if (filters?.search) conditions.push(like(products.name, `%${filters.search}%`)); // Simple case-sensitive like for now, ideally ilike
    if (filters?.minPrice) conditions.push(gte(products.price, filters.minPrice.toString()));
    if (filters?.maxPrice) conditions.push(lte(products.price, filters.maxPrice.toString()));

    return await db.select().from(products)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products)
      .set({ ...updates })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getOrders(userId?: string): Promise<Order[]> {
    if (userId) {
      return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    }
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db.select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      product: products
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));

    return { ...order, items };
  }

  async createOrder(userId: string, orderData: CreateOrderRequest): Promise<Order> {
    // Calculate total amount
    let total = 0;
    // We need to fetch product prices to be secure
    const itemsWithPrices = await Promise.all(orderData.items.map(async (item) => {
      const product = await this.getProduct(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      return { ...item, price: product.price };
    }));

    total = itemsWithPrices.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    const [order] = await db.insert(orders).values({
      userId,
      totalAmount: total.toString(),
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      status: "pending"
    }).returning();

    for (const item of itemsWithPrices) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price.toString()
      });
    }

    return order;
  }

  async getWishlist(userId: string): Promise<Product[]> {
    const result = await db.select({ product: products })
      .from(wishlist)
      .innerJoin(products, eq(wishlist.productId, products.id))
      .where(eq(wishlist.userId, userId));
    return result.map(r => r.product);
  }

  async addToWishlist(userId: string, productId: number): Promise<void> {
    // Check if already exists
    const existing = await db.select().from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));

    if (existing.length === 0) {
      await db.insert(wishlist).values({ userId, productId });
    }
  }

  async removeFromWishlist(userId: string, productId: number): Promise<void> {
    await db.delete(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));
  }

  async getReviews(productId: number): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(userId: string, userName: string, review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values({
      ...review,
      userId,
      userName
    }).returning();
    return newReview;
  }
}

export const storage = new DatabaseStorage();
