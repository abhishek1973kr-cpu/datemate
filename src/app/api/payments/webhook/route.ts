import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      // In development if webhook secret is not set yet
      console.warn("RAZORPAY_WEBHOOK_SECRET is not set in environment.");
      return NextResponse.json({ received: true, note: "Webhook secret missing in dev" });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle payment events
    switch (event) {
      case "payment.captured": {
        const payment = payload.payload.payment.entity;
        console.log(`Payment captured successfully: ${payment.id} for amount ${payment.amount}`);
        // Here we update booking payment_status to 'paid' in PostgreSQL/Supabase
        break;
      }
      case "payment.failed": {
        const payment = payload.payload.payment.entity;
        console.warn(`Payment failed: ${payment.id}, reason: ${payment.error_description}`);
        break;
      }
      case "refund.processed": {
        const refund = payload.payload.refund.entity;
        console.log(`Refund processed: ${refund.id}`);
        break;
      }
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    return NextResponse.json({ status: "success", event });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

