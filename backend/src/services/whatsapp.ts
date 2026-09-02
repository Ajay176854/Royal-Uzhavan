import twilio from 'twilio';

// Initialize the Twilio client using environment variables
// Note: If these are not set, the integration will fail gracefully in development
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. 'whatsapp:+14155238886' (Twilio Sandbox number)

let client: twilio.Twilio | null = null;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

/**
 * Sends a WhatsApp order confirmation message to the customer.
 * 
 * @param customerPhone The phone number of the customer (e.g., '919876543210' or '+919876543210')
 * @param orderId The internal order ID or a shortened version for the user
 * @param customerName The customer's full name
 */
export async function sendOrderConfirmationWhatsApp(
  customerPhone: string,
  orderId: string,
  customerName: string
) {
  if (!client || !twilioWhatsAppNumber) {
    console.warn('⚠️  WhatsApp automation skipped: Twilio credentials not configured in .env');
    return;
  }

  try {
    // Format the phone number (Twilio expects E.164 format, e.g., +919876543210)
    // Here we ensure it has a '+' sign. If it's just a 10 digit Indian number, we prefix it with +91.
    let formattedPhone = customerPhone.replace(/\s+/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = `+91${formattedPhone}`;
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }

    const messageBody = `Hello ${customerName}, thank you for your order with Royal Uzhavan! 🌾\n\nYour order #${orderId.split('-')[0].toUpperCase()} has been confirmed and is being processed. We will notify you once it ships.\n\nThank you for choosing us!`;

    const message = await client.messages.create({
      body: messageBody,
      from: twilioWhatsAppNumber, // Ensure this starts with 'whatsapp:' e.g., 'whatsapp:+14155238886'
      to: `whatsapp:${formattedPhone}`,
    });

    console.log(`✅ WhatsApp confirmation sent to ${formattedPhone} (SID: ${message.sid})`);
  } catch (error) {
    console.error('❌ Failed to send WhatsApp confirmation:', error);
  }
}
