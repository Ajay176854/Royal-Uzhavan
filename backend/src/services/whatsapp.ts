/**
 * Royal Uzhavan — WhatsApp Service
 *
 * Professional Meta WhatsApp Cloud API integration for:
 *   • Order confirmations (auto-sent when customer places an order)
 *   • Order status updates (auto-sent when admin changes status)
 *   • Delivery notifications
 *   • Custom admin messages
 *
 * Also keeps the free wa.me click-to-chat link generator as a fallback.
 */

import dotenv from "dotenv";
dotenv.config({ override: true });

// ─── Configuration ──────────────────────────────────────────────
const META_CONFIG = {
  phoneNumberId: process.env.META_WHATSAPP_PHONE_NUMBER_ID || "",
  accessToken: process.env.META_WHATSAPP_ACCESS_TOKEN || "",
  apiVersion: process.env.META_WHATSAPP_API_VERSION || "v21.0",
  verifyToken: process.env.META_WHATSAPP_VERIFY_TOKEN || "",
};

const BUSINESS_WHATSAPP_NUMBER =
  process.env.WHATSAPP_BUSINESS_NUMBER || "918072864890";

// ─── Types ──────────────────────────────────────────────────────
export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderDetails {
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  shippingFee?: number;
  paymentMethod?: string;
}

interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ─── Status Display Map ─────────────────────────────────────────
const STATUS_DISPLAY: Record<string, { emoji: string; label: string; description: string }> = {
  pending: {
    emoji: "🕐",
    label: "Order Received",
    description: "We've received your order and will process it shortly.",
  },
  confirmed: {
    emoji: "✅",
    label: "Order Confirmed",
    description: "Your order has been confirmed! We're preparing it now.",
  },
  processing: {
    emoji: "📦",
    label: "Being Prepared",
    description: "Your order is being carefully packed with farm-fresh goodness.",
  },
  shipped: {
    emoji: "🚚",
    label: "Shipped",
    description: "Your order is on its way! It will reach you soon.",
  },
  out_for_delivery: {
    emoji: "🛵",
    label: "Out for Delivery",
    description: "Your order is out for delivery. Please be available to receive it.",
  },
  delivered: {
    emoji: "🎉",
    label: "Delivered",
    description: "Your order has been delivered. Enjoy your farm-fresh products!",
  },
  cancelled: {
    emoji: "❌",
    label: "Cancelled",
    description: "Your order has been cancelled. Contact us if you have questions.",
  },
};

// ─── Core API Caller ────────────────────────────────────────────
/**
 * Send a WhatsApp message via Meta Cloud API.
 * Includes retry logic with exponential backoff.
 */
async function callMetaAPI(
  to: string,
  body: Record<string, any>,
  retries = 2
): Promise<WhatsAppSendResult> {
  if (!META_CONFIG.phoneNumberId || !META_CONFIG.accessToken) {
    console.warn("⚠️  WhatsApp Meta API not configured. Skipping message.");
    return { success: false, error: "Meta WhatsApp API not configured" };
  }

  // Normalize phone: ensure country code, remove +, spaces, dashes
  const phone = to.replace(/[\s\-\+]/g, "").replace(/^0/, "91");

  const url = `https://graph.facebook.com/${META_CONFIG.apiVersion}/${META_CONFIG.phoneNumberId}/messages`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${META_CONFIG.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          ...body,
        }),
      });

      const data = await res.json();

      if (res.ok && data.messages?.[0]?.id) {
        console.log(`✅ WhatsApp sent to ${phone} | ID: ${data.messages[0].id}`);
        return { success: true, messageId: data.messages[0].id };
      }

      const errorMsg = data.error?.message || JSON.stringify(data);
      console.error(`❌ WhatsApp API error (attempt ${attempt + 1}):`, errorMsg);

      // Don't retry on auth errors or invalid recipient
      if (data.error?.code === 190 || data.error?.code === 131030) {
        return { success: false, error: errorMsg };
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    } catch (err: any) {
      console.error(`❌ WhatsApp network error (attempt ${attempt + 1}):`, err.message);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  return { success: false, error: "Max retries exceeded" };
}

// ─── Message Senders ────────────────────────────────────────────

/**
 * Send order confirmation to customer after successful order placement.
 */
export async function sendOrderConfirmation(
  order: OrderDetails
): Promise<WhatsAppSendResult> {
  const shortId = order.orderId.split("-")[0].toUpperCase();

  const itemLines = order.items
    .map((item, i) => `${i + 1}. ${item.name} × ${item.quantity} — ₹${item.price}`)
    .join("\n");

  const message =
    `🌾 *Royal Uzhavan — Order Confirmed!*\n` +
    `\n` +
    `Hi ${order.customerName}! 👋\n` +
    `Thank you for ordering from Royal Uzhavan.\n` +
    `\n` +
    `📋 *Order ID:* #${shortId}\n` +
    `\n` +
    `*Items:*\n` +
    `${itemLines}\n` +
    `\n` +
    `💰 *Total:* ₹${order.total.toLocaleString("en-IN")}\n` +
    `💳 *Payment:* ${order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod || "COD"}\n` +
    `\n` +
    `We'll notify you when your order is shipped. 🚚\n` +
    `\n` +
    `_Farm-fresh, straight to your doorstep!_ 🌿`;

  return callMetaAPI(order.customerPhone, {
    type: "text",
    text: { body: message },
  });
}

/**
 * Send order status update notification.
 */
export async function sendOrderStatusUpdate(
  customerPhone: string,
  customerName: string,
  orderId: string,
  newStatus: string
): Promise<WhatsAppSendResult> {
  const shortId = orderId.split("-")[0].toUpperCase();
  const statusInfo = STATUS_DISPLAY[newStatus] || {
    emoji: "📌",
    label: newStatus,
    description: `Your order status has been updated to: ${newStatus}`,
  };

  const message =
    `🌾 *Royal Uzhavan — Order Update*\n` +
    `\n` +
    `Hi ${customerName}! 👋\n` +
    `\n` +
    `Your order *#${shortId}* has been updated:\n` +
    `\n` +
    `${statusInfo.emoji} *Status:* ${statusInfo.label}\n` +
    `\n` +
    `${statusInfo.description}\n` +
    `\n` +
    `Track your order anytime at:\n` +
    `${process.env.FRONTEND_URL || "http://localhost:3000"}/track?id=${orderId}\n` +
    `\n` +
    `_Royal Uzhavan — Farm Fresh, Always!_ 🌿`;

  return callMetaAPI(customerPhone, {
    type: "text",
    text: { body: message },
  });
}

/**
 * Send delivery completion notification with a thank-you message.
 */
export async function sendDeliveryNotification(
  customerPhone: string,
  customerName: string,
  orderId: string
): Promise<WhatsAppSendResult> {
  const shortId = orderId.split("-")[0].toUpperCase();

  const message =
    `🎉 *Royal Uzhavan — Order Delivered!*\n` +
    `\n` +
    `Hi ${customerName}! 👋\n` +
    `\n` +
    `Great news! Your order *#${shortId}* has been delivered. 📦✨\n` +
    `\n` +
    `We hope you enjoy our farm-fresh products!\n` +
    `\n` +
    `⭐ If you loved your order, share your experience with friends and family.\n` +
    `\n` +
    `🔄 *Order again:* ${process.env.FRONTEND_URL || "http://localhost:3000"}/shop\n` +
    `📞 *Need help?* Reply to this message or visit our contact page.\n` +
    `\n` +
    `_Thank you for supporting organic farming! 🌾🙏_`;

  return callMetaAPI(customerPhone, {
    type: "text",
    text: { body: message },
  });
}

/**
 * Send a custom message from admin to any customer.
 */
export async function sendCustomMessage(
  phone: string,
  message: string
): Promise<WhatsAppSendResult> {
  const fullMessage = `🌾 *Royal Uzhavan*\n\n${message}`;

  return callMetaAPI(phone, {
    type: "text",
    text: { body: fullMessage },
  });
}

/**
 * Send a hello_world template message (useful for testing).
 */
export async function sendTestMessage(
  phone: string
): Promise<WhatsAppSendResult> {
  return callMetaAPI(phone, {
    type: "template",
    template: {
      name: "hello_world",
      language: { code: "en_US" },
    },
  });
}

/**
 * Check if Meta WhatsApp API is configured and ready.
 */
export function isWhatsAppConfigured(): boolean {
  return !!(META_CONFIG.phoneNumberId && META_CONFIG.accessToken);
}

/**
 * Get WhatsApp service status info.
 */
export function getWhatsAppStatus() {
  return {
    configured: isWhatsAppConfigured(),
    phoneNumberId: META_CONFIG.phoneNumberId ? "***" + META_CONFIG.phoneNumberId.slice(-4) : "not set",
    apiVersion: META_CONFIG.apiVersion,
    tokenLength: META_CONFIG.accessToken.length,
  };
}

// ─── Free Fallback: Click-to-Chat Links ─────────────────────────

/**
 * Generates a WhatsApp Click-to-Chat URL with a pre-filled order confirmation message.
 * 100% free — no Meta Business login, no API keys needed.
 * The customer's browser/app opens WhatsApp with the message ready to send.
 */
export function generateOrderWhatsAppLink(order: {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
}): string {
  const shortId = order.orderId.split("-")[0].toUpperCase();

  const itemLines = order.items
    .map((item, i) => `  ${i + 1}. ${item.name} x${item.quantity} — ₹${item.price}`)
    .join("\n");

  const message = `🌾 *Royal Uzhavan — Order Confirmation*

Hi, I just placed an order!

*Order ID:* #${shortId}
*Name:* ${order.customerName}

*Items:*
${itemLines}

*Total:* ₹${order.total.toLocaleString("en-IN")}

Please confirm my order. Thank you! 🙏`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encoded}`;
}

/**
 * Generates a general enquiry WhatsApp link (for Contact Us, support, etc.)
 */
export function generateEnquiryWhatsAppLink(
  customerName: string,
  subject: string
): string {
  const message = `Hi Royal Uzhavan! 🌿

My name is ${customerName}.
I have a query about: ${subject}

Could you please help me?`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encoded}`;
}
