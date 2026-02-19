import {
  type User,
  type InsertUser,
  type UpdateUser,
  type Vehicle,
  type InsertVehicle,
  type Produce,
  type InsertProduce,
  type Pesticide,
  type InsertPesticide,
  type Order,
  type InsertOrder,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { email: string; userType: string; name: string }): Promise<User>;
  updateUser(id: string, user: UpdateUser): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Vehicle operations
  getVehicle(id: string): Promise<Vehicle | undefined>;
  getAllVehicles(): Promise<Vehicle[]>;
  getVehiclesByOwner(ownerId: string): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle & { ownerId: string; ownerName: string }): Promise<Vehicle>;
  updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: string): Promise<boolean>;

  // Produce operations
  getProduce(id: string): Promise<Produce | undefined>;
  getAllProduce(): Promise<Produce[]>;
  getProduceByFarmer(farmerId: string): Promise<Produce[]>;
  createProduce(produce: InsertProduce & { farmerId: string; farmerName: string }): Promise<Produce>;
  updateProduce(id: string, produce: Partial<Produce>): Promise<Produce | undefined>;
  deleteProduce(id: string): Promise<boolean>;

  // Pesticide operations
  getPesticide(id: string): Promise<Pesticide | undefined>;
  getAllPesticides(): Promise<Pesticide[]>;
  getPesticidesBySupplier(supplierId: string): Promise<Pesticide[]>;
  createPesticide(pesticide: InsertPesticide & { supplierId: string; supplierName: string }): Promise<Pesticide>;
  updatePesticide(id: string, pesticide: Partial<Pesticide>): Promise<Pesticide | undefined>;
  deletePesticide(id: string): Promise<boolean>;

  // Order operations
  getOrder(id: string): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrdersByItem(itemId: string): Promise<Order[]>;
  createOrder(order: InsertOrder & { userId: string; userName: string; orderNumber: string }): Promise<Order>;
  updateOrder(id: string, order: Partial<Order>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;

  // Message operations
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesByOrder(orderId: string): Promise<Message[]>;
  createMessage(message: InsertMessage & { senderId: string; senderName: string; senderType: string }): Promise<Message>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private vehicles: Map<string, Vehicle>;
  private produce: Map<string, Produce>;
  private pesticides: Map<string, Pesticide>;
  private orders: Map<string, Order>;
  private messages: Map<string, Message>;

  constructor() {
    this.users = new Map();
    this.vehicles = new Map();
    this.produce = new Map();
    this.pesticides = new Map();
    this.orders = new Map();
    this.messages = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  async createUser(user: InsertUser & { email: string; userType: string; name: string }): Promise<User> {
    const id = randomUUID();
    const newUser: User = {
      ...user,
      id,
      farmerId: null,
      farmName: null,
      farmSize: null,
      phone: null,
      address: null,
      city: null,
      state: null,
      zipCode: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: string, userUpdate: UpdateUser): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser: User = { ...user, ...userUpdate, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Vehicle operations
  async getVehicle(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values());
  }

  async getVehiclesByOwner(ownerId: string): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter((v) => v.ownerId === ownerId);
  }

  async createVehicle(vehicle: InsertVehicle & { ownerId: string; ownerName: string }): Promise<Vehicle> {
    const id = randomUUID();
    const newVehicle: Vehicle = {
      ...vehicle,
      id,
      available: true,
      vehicleType: vehicle.vehicleType || 'other',
      dynamicPricing: vehicle.dynamicPricing || false,
      description: vehicle.description || null,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }

  async updateVehicle(id: string, vehicleUpdate: Partial<Vehicle>): Promise<Vehicle | undefined> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return undefined;
    const updatedVehicle: Vehicle = { ...vehicle, ...vehicleUpdate, updatedAt: new Date() };
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    return this.vehicles.delete(id);
  }

  // Produce operations
  async getProduce(id: string): Promise<Produce | undefined> {
    return this.produce.get(id);
  }

  async getAllProduce(): Promise<Produce[]> {
    return Array.from(this.produce.values());
  }

  async getProduceByFarmer(farmerId: string): Promise<Produce[]> {
    return Array.from(this.produce.values()).filter((p) => p.farmerId === farmerId);
  }

  async createProduce(produceData: InsertProduce & { farmerId: string; farmerName: string }): Promise<Produce> {
    const id = randomUUID();
    const newProduce: Produce = {
      ...produceData,
      id,
      imageUrl: null,
      description: produceData.description || null,
      unit: produceData.unit || 'kg',
      organic: produceData.organic || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.produce.set(id, newProduce);
    return newProduce;
  }

  async updateProduce(id: string, produceUpdate: Partial<Produce>): Promise<Produce | undefined> {
    const produceItem = this.produce.get(id);
    if (!produceItem) return undefined;
    const updatedProduce: Produce = { ...produceItem, ...produceUpdate, updatedAt: new Date() };
    this.produce.set(id, updatedProduce);
    return updatedProduce;
  }

  async deleteProduce(id: string): Promise<boolean> {
    return this.produce.delete(id);
  }

  // Pesticide operations
  async getPesticide(id: string): Promise<Pesticide | undefined> {
    return this.pesticides.get(id);
  }

  async getAllPesticides(): Promise<Pesticide[]> {
    return Array.from(this.pesticides.values());
  }

  async getPesticidesBySupplier(supplierId: string): Promise<Pesticide[]> {
    return Array.from(this.pesticides.values()).filter((p) => p.supplierId === supplierId);
  }

  async createPesticide(pesticide: InsertPesticide & { supplierId: string; supplierName: string }): Promise<Pesticide> {
    const id = randomUUID();
    const newPesticide: Pesticide = {
      ...pesticide,
      id,
      inStock: true,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: pesticide.description || '',
    };
    this.pesticides.set(id, newPesticide);
    return newPesticide;
  }

  async updatePesticide(id: string, pesticideUpdate: Partial<Pesticide>): Promise<Pesticide | undefined> {
    const pesticide = this.pesticides.get(id);
    if (!pesticide) return undefined;
    const updatedPesticide: Pesticide = { ...pesticide, ...pesticideUpdate, updatedAt: new Date() };
    this.pesticides.set(id, updatedPesticide);
    return updatedPesticide;
  }

  async deletePesticide(id: string): Promise<boolean> {
    return this.pesticides.delete(id);
  }

  // Order operations
  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((o) => o.userId === userId);
  }

  async getOrdersByItem(itemId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((o) => o.itemId === itemId);
  }

  async createOrder(order: InsertOrder & { userId: string; userName: string; orderNumber: string }): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      ...order,
      id,
      status: 'pending',
      quantity: order.quantity || 1,
      startDate: order.startDate || null,
      endDate: order.endDate || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrder(id: string, orderUpdate: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const updatedOrder: Order = { ...order, ...orderUpdate, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orders.delete(id);
  }

  // Message operations
  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByOrder(orderId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter((m) => m.orderId === orderId);
  }

  async createMessage(message: InsertMessage & { senderId: string; senderName: string; senderType: 'farmer' | 'customer' }): Promise<Message> {
    const id = randomUUID();
    const newMessage: Message = {
      ...message,
      id,
      timestamp: new Date(),
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
