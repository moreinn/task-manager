import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middleware/auth.middleware.js";
import taskRoutes from "./routes/task.route.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true,
  })
);

app.get("/api/profile", protectedRoute, (req, res) => {
  res.json({
    message: "Protected Route accessed",
    user: req.user,
  });
});
app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})


