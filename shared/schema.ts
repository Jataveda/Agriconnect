import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User types enum
export const userTypeEnum = pgEnum("user_type", ["farmer", "customer"]);

// Order status enum
export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "in_transit", "delivered", "cancelled"]);

// Vehicle types enum
export const vehicleTypeEnum = pgEnum("vehicle_type", ["tractor", "harvester", "planter", "sprayer", "other"]);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  userType: userTypeEnum("user_type").notNull(),
  farmerId: varchar("farmer_id"), // Only for farmers
  farmName: text("farm_name"), // Only for farmers
  farmSize: integer("farm_size"), // Only for farmers (in acres)
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Vehicles table
export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // Vehicle type (e.g., "Heavy Duty Tractor")
  vehicleType: vehicleTypeEnum("vehicle_type").notNull().default("other"),
  capacity: text("capacity").notNull(), // Capacity description (e.g., "55 HP", "Large")
  location: text("location").notNull(),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
  available: boolean("available").notNull().default(true),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  ownerName: text("owner_name").notNull(),
  dynamicPricing: boolean("dynamic_pricing").notNull().default(false),
  imageUrl: text("image_url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Produce table
export const produce = pgTable("produce", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 2 }).notNull(),
  quantityAvailable: integer("quantity_available").notNull(),
  unit: text("unit").notNull().default("kg"),
  farmerId: varchar("farmer_id").references(() => users.id).notNull(),
  farmerName: text("farmer_name").notNull(),
  organic: boolean("organic").notNull().default(false),
  imageUrl: text("image_url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Pesticides table
export const pesticides = pgTable("pesticides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  size: text("size").notNull(), // Size/volume (e.g., "1 Liter", "500ml")
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  category: text("category").notNull(), // e.g., "Insecticide", "Herbicide", "Fungicide"
  supplierId: varchar("supplier_id").references(() => users.id).notNull(),
  supplierName: text("supplier_name").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: text("order_number").notNull().unique(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  userName: text("user_name").notNull(),
  type: text("type").notNull(), // "vehicle", "produce", "pesticide"
  itemId: varchar("item_id").notNull(), // Reference to vehicle/produce/pesticide ID
  itemName: text("item_name").notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  startDate: timestamp("start_date"), // For vehicle rentals
  endDate: timestamp("end_date"), // For vehicle rentals
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Messages table for order chat
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  senderName: text("sender_name").notNull(),
  senderType: userTypeEnum("sender_type").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// User schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  userType: true,
  name: true,
});

export const updateUserSchema = createInsertSchema(users).pick({
  name: true,
  phone: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  farmName: true,
  farmSize: true,
});

// Vehicle schemas
export const insertVehicleSchema = createInsertSchema(vehicles).pick({
  name: true,
  type: true,
  vehicleType: true,
  capacity: true,
  location: true,
  pricePerDay: true,
  dynamicPricing: true,
  description: true,
});

// Produce schemas
export const insertProduceSchema = createInsertSchema(produce).pick({
  name: true,
  category: true,
  pricePerKg: true,
  quantityAvailable: true,
  unit: true,
  organic: true,
  description: true,
});

// Pesticide schemas
export const insertPesticideSchema = createInsertSchema(pesticides).pick({
  name: true,
  brand: true,
  size: true,
  price: true,
  category: true,
  description: true,
});

// Order schemas
export const insertOrderSchema = createInsertSchema(orders).pick({
  type: true,
  itemId: true,
  itemName: true,
  total: true,
  quantity: true,
  startDate: true,
  endDate: true,
});

// Message schemas
export const insertMessageSchema = createInsertSchema(messages).pick({
  orderId: true,
  content: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export type InsertProduce = z.infer<typeof insertProduceSchema>;
export type Produce = typeof produce.$inferSelect;

export type InsertPesticide = z.infer<typeof insertPesticideSchema>;
export type Pesticide = typeof pesticides.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
