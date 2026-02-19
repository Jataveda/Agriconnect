import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Create default test users for login
  try {
    const existingFarmer = await storage.getUserByUsername("farmer-test");
    if (!existingFarmer) {
      await storage.createUser({
        username: "farmer-test",
        password: "password123",
        email: "farmer@test.com",
        userType: "farmer",
        name: "Test Farmer"
      });
      log("Created default farmer test user: farmer-test / password123");
    }

    const existingCustomer = await storage.getUserByUsername("customer-test");
    if (!existingCustomer) {
      await storage.createUser({
        username: "customer-test",
        password: "password123",
        email: "customer@test.com",
        userType: "customer",
        name: "Test Customer"
      });
      log("Created default customer test user: customer-test / password123");
    }

    // Seed example rental vehicles with images (only if none exist)
    const vehiclesExisting = await storage.getAllVehicles();
    const farmerUser = await storage.getUserByUsername("farmer-test");
    if (farmerUser) {
      const seeds = [
        {
          name: "John Deere Tractor 5055E",
          type: "Heavy Duty Tractor",
          vehicleType: "tractor",
          capacity: "55 HP",
          location: "Springfield, IL",
          pricePerDay: 145,
          dynamicPricing: true,
          description: "Reliable tractor suitable for plowing and hauling",
          imageUrl: "https://images.unsplash.com/photo-1591883621478-7e62cf6fb8e0?w=1200&auto=format&fit=crop&q=60",
        },
        {
          name: "Kubota Harvester M7",
          type: "Combine Harvester",
          vehicleType: "harvester",
          capacity: "Large",
          location: "Oak Park, IL",
          pricePerDay: 200,
          dynamicPricing: false,
          description: "High-capacity harvester ideal for corn and wheat",
          imageUrl: "https://images.unsplash.com/photo-1502156464-8c91f7360716?w=1200&auto=format&fit=crop&q=60",
        },
        {
          name: "Case IH Tractor",
          type: "Multi-Purpose Tractor",
          vehicleType: "tractor",
          capacity: "75 HP",
          location: "Naperville, IL",
          pricePerDay: 170,
          dynamicPricing: true,
          description: "Versatile tractor for a variety of farm tasks",
          imageUrl: "https://images.unsplash.com/photo-1544989164-3195231800be?w=1200&auto=format&fit=crop&q=60",
        },
        {
          name: "Sprayer Trailer",
          type: "Sprayer",
          vehicleType: "sprayer",
          capacity: "1000L",
          location: "Chicago, IL",
          pricePerDay: 120,
          dynamicPricing: false,
          description: "Efficient field sprayer with adjustable nozzles",
          imageUrl: "https://images.unsplash.com/photo-1589719584661-6d80b1db6123?w=1200&auto=format&fit=crop&q=60",
        },
        
        // Additional seeded vehicles with images
        {
          name: "New Holland T7 Tractor",
          type: "Field Tractor",
          vehicleType: "tractor",
          capacity: "140 HP",
          location: "Peoria, IL",
          pricePerDay: 185,
          dynamicPricing: true,
          description: "Powerful tractor ideal for tillage and hauling",
          imageUrl: "https://images.unsplash.com/photo-1512930562315-8096fa5b16c5?w=1200&auto=format&fit=crop&q=60",
        },
        {
          name: "Bobcat Skid-Steer Loader S650",
          type: "Loader",
          vehicleType: "loader",
          capacity: "2,690 lb",
          location: "Aurora, IL",
          pricePerDay: 160,
          dynamicPricing: false,
          description: "Compact loader for material handling and grading",
          imageUrl: "https://images.unsplash.com/photo-1593229514043-17c7f89e3f6a?w=1200&auto=format&fit=crop&q=60",
        },
        {
          name: "Grain Trailer 20ft",
          type: "Trailer",
          vehicleType: "trailer",
          capacity: "12 ton",
          location: "Decatur, IL",
          pricePerDay: 110,
          dynamicPricing: false,
          description: "Durable grain trailer suitable for harvest transport",
          imageUrl: "https://images.unsplash.com/photo-1592691541121-9f65986d62a8?w=1200&auto=format&fit=crop&q=60",
        },
        {
          name: "Round Baler RB450",
          type: "Baler",
          vehicleType: "baler",
          capacity: "4x5 ft bales",
          location: "Bloomington, IL",
          pricePerDay: 150,
          dynamicPricing: true,
          description: "Efficient baler for hay and straw",
          imageUrl: "https://images.unsplash.com/photo-1622620449341-9850aaf39bd1?w=1200&auto=format&fit=crop&q=60",
        },
        {
          name: "Planter 6-Row",
          type: "Planter",
          vehicleType: "planter",
          capacity: "6 rows",
          location: "Rockford, IL",
          pricePerDay: 175,
          dynamicPricing: true,
          description: "Precision planter suitable for corn and soy",
          imageUrl: "https://images.unsplash.com/photo-1582213782179-3f3d94be9a45?w=1200&auto=format&fit=crop&q=60",
        },
        {
          name: "Cultivator 10ft",
          type: "Cultivator",
          vehicleType: "cultivator",
          capacity: "10 ft width",
          location: "Champaign, IL",
          pricePerDay: 130,
          dynamicPricing: false,
          description: "Heavy-duty cultivator for weed control",
          imageUrl: "https://images.unsplash.com/photo-1568643957280-12de9b1b7a5f?w=1200&auto=format&fit=crop&q=60",
        },
        {
          name: "Drone Sprayer X-AG",
          type: "Drone Sprayer",
          vehicleType: "sprayer",
          capacity: "30 L",
          location: "Evanston, IL",
          pricePerDay: 220,
          dynamicPricing: true,
          description: "Aerial spraying drone for targeted application",
          imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=60",
        },
        {
          name: "ATV Farm Quad 500",
          type: "ATV",
          vehicleType: "atv",
          capacity: "500cc",
          location: "Joliet, IL",
          pricePerDay: 95,
          dynamicPricing: false,
          description: "Agile ATV for quick field transport",
          imageUrl: "https://images.unsplash.com/photo-1599487487170-8b703cfc873a?w=1200&auto=format&fit=crop&q=60",
        },
        {
          name: "Forklift Warehouse 3T",
          type: "Forklift",
          vehicleType: "forklift",
          capacity: "3 ton",
          location: "Elgin, IL",
          pricePerDay: 140,
          dynamicPricing: false,
          description: "Reliable forklift for pallet handling",
          imageUrl: "https://images.unsplash.com/photo-1581094794329-4cb2b0f5f986?w=1200&auto=format&fit=crop&q=60",
        },
      ];

      // Avoid duplicating seeds: only add missing vehicles by name
      const existingNames = new Set((vehiclesExisting || []).map(v => v.name));
      let createdCount = 0;
      for (const s of seeds) {
        if (existingNames.has(s.name)) continue;
        const allowedVehicleTypes = ["tractor", "harvester", "planter", "sprayer"] as const;
        const vt = allowedVehicleTypes.includes(s.vehicleType as any) ? (s.vehicleType as typeof allowedVehicleTypes[number]) : "other";
        const created = await storage.createVehicle({
          name: s.name,
          type: s.type,
          vehicleType: vt,
          capacity: s.capacity,
          location: s.location,
          pricePerDay: Number.isFinite(s.pricePerDay) ? s.pricePerDay.toFixed(2) : String(s.pricePerDay),
          dynamicPricing: s.dynamicPricing,
          description: s.description,
          ownerId: farmerUser.id,
          ownerName: farmerUser.name,
        });
        await storage.updateVehicle(created.id, { imageUrl: s.imageUrl });
        existingNames.add(s.name);
        createdCount++;
      }
      if (createdCount > 0) {
        log(`Seeded ${createdCount} example rental vehicles with images`);
      }
    }
  } catch (error) {
    log("Error creating default users: " + error);
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports may be firewalled. Default to 5050 if not specified to match client proxy.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5050', 10);
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
