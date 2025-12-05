import express from "express";
import cors from "cors";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./Controllers/errorController.js";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import timerRoutes from "./Routes/timerRoutes.js";

const app = express();


const envClientUrls = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map((s) => s.trim())
  : [];
const whitelist = [
  process.env.CLIENT_URL,
  ...envClientUrls,
  "https://kanbanfrontend.vercel.app",
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", timerRoutes);

// app.get("/", (req, res) => {
//   res.send(`
//     <html>
//       <head><title>Task Management</title></head>
//       <body>
//         <h1>Welcome to Task Management</h1>
//       </body>
//     </html>
//   `);
// });

app.use(/.*/, (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

export default app;
