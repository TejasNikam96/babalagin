import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import Renewal from "./Renewal";
import { PaymentDialog } from "../NavbarMenus/Registration";

// Renewal fee per period (months -> rupees), matching the form's options.
const PRICE = { "3": 599, "6": 999, "12": 1499, "24": 2499 };

/**
 * Wraps the Renewal form with the real flow: validate the Registration ID +
 * email, then collect a RENEWAL payment via the shared PaymentDialog. The
 * payment goes through the normal admin-verification flow; verifying it
 * reactivates the profile (backend: PaymentServiceImpl.updateStatus).
 */
export default function RenewalPage() {
  const [pending, setPending] = useState(null); // { registrationCode, period, amount, name }
  const [payOpen, setPayOpen] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [done, setDone] = useState(null);

  // Passed to the Renewal form's onSubmit (after its captcha check).
  const handleValidate = async ({ registrationId, email, renewalPeriod }) => {
    const res = await fetch("/api/renewal/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId: registrationId.trim(), email: email.trim() }),
    });
    if (res.status === 404) throw new Error("No profile found for this Registration ID and email.");
    if (!res.ok) throw new Error("Could not validate right now. Please try again.");
    const data = await res.json();
    setPending({
      registrationCode: data.registrationCode,
      period: renewalPeriod,
      amount: PRICE[renewalPeriod] || 999,
      name: data.name,
    });
    setPayOpen(true); // open the payment dialog
  };

  const handlePay = async (paymentData) => {
    if (!pending) return;
    setPayLoading(true);
    try {
      const fd = new FormData();
      fd.append("transactionId", paymentData.transactionId);
      fd.append("upiId", paymentData.upiId);
      fd.append("amount", String(pending.amount));
      fd.append("registrationId", pending.registrationCode);
      fd.append("paymentType", "RENEWAL");
      fd.append("renewalMonths", String(pending.period));
      if (paymentData.screenshot) fd.append("screenshot", paymentData.screenshot);

      const res = await fetch("/api/payment/verify", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setPayOpen(false);
      setDone({ ...pending });
    } catch (e) {
      alert("Renewal payment submission failed. Please try again.");
    } finally {
      setPayLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen w-full bg-[#FBF3DC] flex items-center justify-center px-4 py-16">
        <div className="bg-[#FFFDF7] rounded-2xl shadow-xl border border-[#D4A017]/25 max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#D4A017] to-[#B8860B] flex items-center justify-center shadow-lg">
            <RotateCcw className="w-8 h-8 text-white" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-[#3F0E1C]">Renewal Submitted</h1>
          <p className="mt-2 text-sm text-[#6B4A52]">
            Your renewal payment for <b>{done.registrationCode}</b> ({done.period} months · ₹{done.amount.toLocaleString("en-IN")})
            has been received and is <b>pending verification</b> by the admin.
          </p>
          <p className="mt-2 text-sm text-[#6B4A52]">
            Your profile will be <b>reactivated</b> automatically once the payment is verified.
          </p>
          <a href="/" className="inline-block mt-5 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#5C1B2E] to-[#7A2238] text-white font-semibold">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Renewal onSubmit={handleValidate} />
      <PaymentDialog
        isOpen={payOpen}
        onClose={() => setPayOpen(false)}
        onPaymentSubmit={handlePay}
        isLoading={payLoading}
        amount={pending ? pending.amount : 999}
        feeLabel={pending ? `Renewal Fee (${pending.period} months)` : "Renewal Fee"}
        title="Renew Profile — Make Payment"
      />
    </>
  );
}
