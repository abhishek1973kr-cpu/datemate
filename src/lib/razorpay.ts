// Razorpay client integration utility

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async ({
  amount,
  bookingId,
  clientName,
  clientEmail,
  clientPhone,
  orderId,
  onSuccess,
  onFailure,
  onDismiss,
}: {
  amount: number; // in INR
  bookingId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  orderId?: string;
  onSuccess: (paymentId: string, orderId?: string, signature?: string) => void;
  onFailure?: (err: string) => void;
  onDismiss?: () => void;
}) => {
  const loaded = await loadRazorpayScript();
  const razorpayKey =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_Tvn1jy9LtuAo1p";

  if (!loaded) {
    if (onFailure) {
      onFailure("Razorpay checkout SDK could not be loaded. Please check your internet connection.");
    }
    return;
  }

  // Generate live Razorpay Order on server if orderId is not already provided
  let activeOrderId = orderId;
  if (!activeOrderId) {
    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: bookingId,
        }),
      });

      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (orderData.orderId) {
          activeOrderId = orderData.orderId;
        }
      }
    } catch (err) {
      console.warn("Could not pre-create server-side Razorpay order:", err);
    }
  }

  try {
    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      name: "DateMate India",
      description: `Payment for ${bookingId}`,
      order_id: activeOrderId,
      prefill: {
        name: clientName || "DateMate User",
        email: clientEmail || "support@datemate.in",
        contact: clientPhone || "9999999999",
      },
      theme: {
        color: "#EC4899",
      },
      handler: function (response) {
        onSuccess(
          response.razorpay_payment_id,
          response.razorpay_order_id || activeOrderId,
          response.razorpay_signature
        );
      },
      modal: {
        ondismiss: function () {
          if (onDismiss) onDismiss();
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    if (onFailure) {
      onFailure(error instanceof Error ? error.message : "Payment initialization failed");
    }
  }
};
