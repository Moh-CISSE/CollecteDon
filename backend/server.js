import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { db } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

try {
  const connection = await db.getConnection();
  console.log("Connected to MySQL");
  connection.release();
} catch (err) {
  console.error("Erreur de connexion MySQL :", err);
}

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Serveur lancé sur le port " + PORT);
});

