import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import * as messageService from "../services/message.service.js";
import { sendReplyEmail } from "../services/email.service.js";

export const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await messageService.getAllMessages();
  res.status(200).json(new ApiResponse(200, messages, "Messages fetched"));
});

export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email and message are required");
  }

  const msg = await messageService.createContactMessage(req.body);
  res.status(201).json(new ApiResponse(201, msg, "Message sent successfully"));
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await messageService.deleteMessage(id);
  res.status(200).json(new ApiResponse(200, null, "Message deleted"));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  res.status(200).json(new ApiResponse(200, { id, isRead: true }, "Marked as read"));
});

export const replyToMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email, subject, replyText } = req.body;

  if (!email || !replyText) {
    throw new ApiError(400, "Recipient email and reply text are required");
  }

  // Send email via Nodemailer
  const sent = await sendReplyEmail({
    to: email,
    subject: subject || "Response from Mayura Fine Cuisine",
    replyText,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      { id, email, sent },
      sent ? "Reply email sent successfully" : "Reply saved (Email dispatch pending configuration)"
    )
  );
});
