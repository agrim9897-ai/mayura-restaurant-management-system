import { z } from "zod";

/**
 * Validation schema for creating a new reservation.
 * All required fields are validated for type, format, and length.
 */
export const createReservationSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Invalid email address"),

  phone: z
    .string({ required_error: "Phone is required" })
    .trim()
    .min(7, "Phone must be at least 7 characters"),

  reservationDate: z
    .string({ required_error: "Reservation date is required" })
    .trim()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format (use YYYY-MM-DD)",
    }),

  reservationTime: z
    .string({ required_error: "Reservation time is required" })
    .trim()
    .min(1, "Reservation time is required"),

  guests: z
    .number({ required_error: "Number of guests is required" })
    .int("Guests must be a whole number")
    .min(1, "At least 1 guest is required")
    .max(20, "Maximum 20 guests allowed"),

  occasion: z.string().trim().optional(),

  seatingPreference: z.string().trim().optional(),
});

/**
 * Validation schema for updating a reservation's status.
 * Only the status field is accepted.
 */
export const updateReservationSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"], {
    required_error: "Status is required",
    invalid_type_error:
      "Status must be one of: PENDING, CONFIRMED, CANCELLED, COMPLETED",
  }),
});
