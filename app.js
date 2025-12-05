import express from "express";
import cors from "cors";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./Controllers/errorController.js";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import taskRoutes from "./Routes/taskRoutes.js";
import timerRoutes from "./Routes/timerRoutes.js";

const app = express();

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "https://my-repo-opal-three.vercel.app",
      "https://my-repo-a9lvccc3f-abhijits-projects-9e3a4963.vercel.app",
    ].filter(Boolean), 
    credentials: true, 
  })
);
app.use(express.json());

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
