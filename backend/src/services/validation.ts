/**
 * Royal Uzhavan — Validation Service
 *
 * Centralized input validation for production-grade safety.
 * Used across all routes to prevent malicious/malformed input.
 */

// ─── Types ──────────────────────────────────────────────────────
export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  variant?: number; // weight variant in grams/kg
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ─── Constants ──────────────────────────────────────────────────
const MAX_ORDER_VALUE_GUEST = 5000; // ₹5000 max for guest COD orders
const MAX_ORDER_VALUE_REGISTERED = 25000; // ₹25000 max for registered users
const MAX_ITEMS_PER_ORDER = 20;
const MAX_QUANTITY_PER_ITEM = 10;
const DUPLICATE_ORDER_WINDOW_MINUTES = 5;

export {
  MAX_ORDER_VALUE_GUEST,
  MAX_ORDER_VALUE_REGISTERED,
  MAX_ITEMS_PER_ORDER,
  MAX_QUANTITY_PER_ITEM,
  DUPLICATE_ORDER_WINDOW_MINUTES,
};

// ─── Phone Validation ───────────────────────────────────────────
/**
 * Validate Indian phone number.
 * Accepts: 9876543210, +919876543210, 919876543210, +91 98765 43210
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, "");
  return /^(91)?[6-9]\d{9}$/.test(cleaned);
}

/**
 * Normalize phone to 91XXXXXXXXXX format.
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\+\(\)]/g, "");
  if (cleaned.length === 10) return `91${cleaned}`;
  if (cleaned.startsWith("91") && cleaned.length === 12) return cleaned;
  return cleaned;
}

// ─── Email Validation ───────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 200;
}

// ─── Pincode Validation ─────────────────────────────────────────
/**
 * Validate Indian pincode (6 digits, first digit 1-9).
 */
export function isValidPincode(pincode: string): boolean {
  if (!pincode || typeof pincode !== "string") return false;
  return /^[1-9]\d{5}$/.test(pincode.trim());
}

// ─── Shipping Address Validation ────────────────────────────────
export function validateShippingAddress(address: any): ValidationResult {
  if (!address || typeof address !== "object") {
    return { valid: false, error: "Shipping address is required" };
  }

  const { street, city, state, pincode } = address;

  if (!street || typeof street !== "string" || street.trim().length < 5) {
    return {
      valid: false,
      error: "Street address must be at least 5 characters",
    };
  }
  if (street.trim().length > 500) {
    return { valid: false, error: "Street address is too long (max 500 chars)" };
  }

  if (!city || typeof city !== "string" || city.trim().length < 2) {
    return { valid: false, error: "City is required (at least 2 characters)" };
  }
  if (city.trim().length > 100) {
    return { valid: false, error: "City name is too long (max 100 chars)" };
  }

  if (!state || typeof state !== "string" || state.trim().length < 2) {
    return { valid: false, error: "State is required (at least 2 characters)" };
  }
  if (state.trim().length > 100) {
    return { valid: false, error: "State name is too long (max 100 chars)" };
  }

  if (!isValidPincode(pincode)) {
    return {
      valid: false,
      error: "Invalid pincode. Must be a valid 6-digit Indian pincode",
    };
  }

  if (address.landmark && typeof address.landmark === "string" && address.landmark.length > 200) {
    return { valid: false, error: "Landmark is too long (max 200 chars)" };
  }

  return { valid: true };
}

// ─── Order Items Validation ─────────────────────────────────────
export function validateOrderItems(items: any): ValidationResult {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, error: "Order must contain at least one item" };
  }

  if (items.length > MAX_ITEMS_PER_ORDER) {
    return {
      valid: false,
      error: `Maximum ${MAX_ITEMS_PER_ORDER} items per order`,
    };
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.productId || typeof item.productId !== "string") {
      return { valid: false, error: `Item ${i + 1}: productId is required` };
    }

    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(item.productId)) {
      return { valid: false, error: `Item ${i + 1}: invalid productId format` };
    }

    if (
      !item.quantity ||
      typeof item.quantity !== "number" ||
      item.quantity < 1 ||
      !Number.isInteger(item.quantity)
    ) {
      return {
        valid: false,
        error: `Item ${i + 1}: quantity must be a positive integer`,
      };
    }

    if (item.quantity > MAX_QUANTITY_PER_ITEM) {
      return {
        valid: false,
        error: `Item ${i + 1}: maximum ${MAX_QUANTITY_PER_ITEM} per item`,
      };
    }
  }

  return { valid: true };
}

// ─── String Sanitization ────────────────────────────────────────
/**
 * Sanitize a string: trim, collapse whitespace, limit length.
 * Strips any HTML tags to prevent XSS.
 */
export function sanitizeString(
  value: string,
  maxLength: number = 200
): string {
  if (!value || typeof value !== "string") return "";
  return value
    .trim()
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/\s+/g, " ") // collapse whitespace
    .slice(0, maxLength);
}

/**
 * Sanitize the entire shipping address object.
 */
export function sanitizeAddress(address: any): ShippingAddress {
  return {
    street: sanitizeString(address.street, 500),
    city: sanitizeString(address.city, 100),
    state: sanitizeString(address.state, 100),
    pincode: address.pincode?.toString().trim().slice(0, 6) || "",
    landmark: address.landmark
      ? sanitizeString(address.landmark, 200)
      : undefined,
  };
}
