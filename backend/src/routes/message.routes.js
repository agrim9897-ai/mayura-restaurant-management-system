import { Router } from "express";
import {
  getAllMessages,
  createMessage,
  deleteMessage,
  markAsRead,
  replyToMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.get("/", getAllMessages);
router.post("/", createMessage);
router.delete("/:id", deleteMessage);
router.patch("/:id/read", markAsRead);
router.post("/:id/reply", replyToMessage);

export default router;
