import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import connectDB from "./utils/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});