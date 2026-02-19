import type { Express } from "express";
import { createServer, type Server } from "http";
import { Router } from "express";
import { storage, IStorage } from "./storage";
import { randomUUID } from "crypto";

export function createRoutes(storage: IStorage): Router {
  const router = Router();

  // User routes
  router.get("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });

  router.post("/api/users", async (req, res) => {
    try {
      const { username, password, email, userType, name, phone, address, city, state, zipCode, farmName, farmSize } = req.body;
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const user = await storage.createUser({
        username,
        password,
        email,
        userType,
        name,
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Failed to create user" });
    }
  });

  router.put("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedUser = await storage.updateUser(id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: "Failed to update user" });
    }
  });

  router.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Vehicle routes
  router.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  router.get("/api/vehicles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const vehicle = await storage.getVehicle(id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  });

  router.get("/api/users/:userId/vehicles", async (req, res) => {
    try {
      const { userId } = req.params;
      const vehicles = await storage.getVehiclesByOwner(userId);
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user vehicles" });
    }
  });

  router.post("/api/vehicles", async (req, res) => {
    try {
      const { name, type, vehicleType, capacity, location, pricePerDay, dynamicPricing, description, ownerId, ownerName } = req.body;
      
      const vehicle = await storage.createVehicle({
        name,
        type,
        vehicleType,
        capacity,
        location,
        pricePerDay,
        dynamicPricing,
        description,
        ownerId,
        ownerName,
      });

      res.status(201).json(vehicle);
    } catch (error) {
      res.status(400).json({ error: "Failed to create vehicle" });
    }
  });

  router.put("/api/vehicles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedVehicle = await storage.updateVehicle(id, updateData);
      if (!updatedVehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      
      res.json(updatedVehicle);
    } catch (error) {
      res.status(400).json({ error: "Failed to update vehicle" });
    }
  });

  router.delete("/api/vehicles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteVehicle(id);
      if (!deleted) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete vehicle" });
    }
  });

  // Produce routes
  router.get("/api/produce", async (req, res) => {
    try {
      const produce = await storage.getAllProduce();
      res.json(produce);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch produce" });
    }
  });

  router.get("/api/produce/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const produceItem = await storage.getProduce(id);
      if (!produceItem) {
        return res.status(404).json({ error: "Produce not found" });
      }
      res.json(produceItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch produce" });
    }
  });

  router.get("/api/users/:userId/produce", async (req, res) => {
    try {
      const { userId } = req.params;
      const produce = await storage.getProduceByFarmer(userId);
      res.json(produce);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user produce" });
    }
  });

  router.post("/api/produce", async (req, res) => {
    try {
      const { name, category, pricePerKg, quantityAvailable, unit, organic, description, farmerId, farmerName } = req.body;
      
      const produce = await storage.createProduce({
        name,
        category,
        pricePerKg,
        quantityAvailable,
        unit,
        organic,
        description,
        farmerId,
        farmerName,
      });

      res.status(201).json(produce);
    } catch (error) {
      res.status(400).json({ error: "Failed to create produce" });
    }
  });

  router.put("/api/produce/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedProduce = await storage.updateProduce(id, updateData);
      if (!updatedProduce) {
        return res.status(404).json({ error: "Produce not found" });
      }
      
      res.json(updatedProduce);
    } catch (error) {
      res.status(400).json({ error: "Failed to update produce" });
    }
  });

  router.delete("/api/produce/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduce(id);
      if (!deleted) {
        return res.status(404).json({ error: "Produce not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete produce" });
    }
  });

  // Pesticide routes
  router.get("/api/pesticides", async (req, res) => {
    try {
      const pesticides = await storage.getAllPesticides();
      res.json(pesticides);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pesticides" });
    }
  });

  router.get("/api/pesticides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const pesticide = await storage.getPesticide(id);
      if (!pesticide) {
        return res.status(404).json({ error: "Pesticide not found" });
      }
      res.json(pesticide);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pesticide" });
    }
  });

  router.get("/api/users/:userId/pesticides", async (req, res) => {
    try {
      const { userId } = req.params;
      const pesticides = await storage.getPesticidesBySupplier(userId);
      res.json(pesticides);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user pesticides" });
    }
  });

  router.post("/api/pesticides", async (req, res) => {
    try {
      const { name, brand, size, price, category, description, supplierId, supplierName } = req.body;
      
      const pesticide = await storage.createPesticide({
        name,
        brand,
        size,
        price,
        category,
        description,
        supplierId,
        supplierName,
      });

      res.status(201).json(pesticide);
    } catch (error) {
      res.status(400).json({ error: "Failed to create pesticide" });
    }
  });

  router.put("/api/pesticides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedPesticide = await storage.updatePesticide(id, updateData);
      if (!updatedPesticide) {
        return res.status(404).json({ error: "Pesticide not found" });
      }
      
      res.json(updatedPesticide);
    } catch (error) {
      res.status(400).json({ error: "Failed to update pesticide" });
    }
  });

  router.delete("/api/pesticides/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePesticide(id);
      if (!deleted) {
        return res.status(404).json({ error: "Pesticide not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete pesticide" });
    }
  });

  // Order routes
  router.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  router.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  router.get("/api/users/:userId/orders", async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user orders" });
    }
  });

  router.post("/api/orders", async (req, res) => {
    try {
      const { type, itemId, itemName, total, quantity, startDate, endDate, userId, userName } = req.body;
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const order = await storage.createOrder({
        type,
        itemId,
        itemName,
        total,
        quantity,
        startDate,
        endDate,
        userId,
        userName,
        orderNumber,
      });

      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: "Failed to create order" });
    }
  });

  router.put("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedOrder = await storage.updateOrder(id, updateData);
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(400).json({ error: "Failed to update order" });
    }
  });

  router.delete("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteOrder(id);
      if (!deleted) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: "Failed to delete order" });
    }
  });

  // Message routes
  router.get("/api/orders/:orderId/messages", async (req, res) => {
    try {
      const { orderId } = req.params;
      const messages = await storage.getMessagesByOrder(orderId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  router.post("/api/messages", async (req, res) => {
    try {
      const { orderId, content, senderId, senderName, senderType } = req.body;
      
      const message = await storage.createMessage({
        orderId,
        content,
        senderId,
        senderName,
        senderType,
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Failed to create message" });
    }
  });

  // Authentication routes
  router.post("/api/auth/login", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // accept either username or email
      const identifier = username || email;
      if (!identifier || !password) {
        return res.status(400).json({ error: "Missing credentials" });
      }

      let user = await storage.getUserByUsername(identifier);
      if (!user && identifier.includes("@")) {
        // fallback: look up by email
        user = await storage.getUserByEmail(identifier);
      }
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // In a real app, you'd create a JWT token here
      res.json({ 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          userType: user.userType,
          name: user.name,
        },
        token: "mock-jwt-token" // Replace with real JWT in production
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  return router;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const router = createRoutes(storage);
  app.use(router);

  const httpServer = createServer(app);

  return httpServer;
}
