import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { partnerId, paymentId, orderId, signature, amount } = await req.json();

    if (!paymentId || !partnerId) {
      return NextResponse.json({ error: "Missing required payment parameters" }, { status: 400 });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    // Cryptographic signature check if Razorpay Secret is set
    if (razorpaySecret && orderId && signature) {
      const generatedSignature = crypto
        .createHmac("sha256", razorpaySecret)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      if (generatedSignature !== signature) {
        return NextResponse.json({ error: "Invalid payment signature verification" }, { status: 400 });
      }
    }

    const transactionRecord = {
      partnerId,
      transactionId: paymentId,
      amount: amount || 199,
      currency: "INR",
      purpose: "DateMate Partner Registration Fee (Mandatory Background Check)",
      status: "verified",
      verifiedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      transaction: transactionRecord,
      message: "Partner registration fee verified successfully"
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

