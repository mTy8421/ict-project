import express from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    app.use("/users", userRoutes);

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
