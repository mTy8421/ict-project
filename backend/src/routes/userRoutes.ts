import { Router } from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();

router.get("/", getUsers); // Get all users
router.get("/:id", getUserById); // Get a user by ID
router.post("/", createUser); // Create a new user
router.patch("/:id", updateUser); // Update a user
router.delete("/:id", deleteUser); // Delete a user

export default router;
