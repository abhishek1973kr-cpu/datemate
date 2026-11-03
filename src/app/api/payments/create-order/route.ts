import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, currency = "INR", receipt } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If keys configured, create order with Razorpay REST API
    if (keyId && keySecret) {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency,
          receipt: receipt || `rcpt_${Date.now()}`,
          notes: {
            platform: "DateMate India",
          },
        }),
      });

      const order = await res.json();
      if (!res.ok) {
        return NextResponse.json({ error: order.error?.description || "Order creation failed" }, { status: res.status });
      }

      return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
    }

    // Demo/Development mode fallback order
    const mockOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;
    return NextResponse.json({
      orderId: mockOrderId,
      amount: Math.round(amount * 100),
      currency: "INR",
      isDemo: true,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

