"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "@fonex/shared";
import { CheckCircle } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";

type FormValues = ContactInput;

type EnquiryProduct = { id: string; name: string };

// Placeholder test number — swap for the real Fonex WhatsApp business number before launch.
const WHATSAPP_NUMBER = "252619690705";

function buildWhatsAppMessage(data: FormValues, product: EnquiryProduct | null): string {
  const lines = [
    "Hi Fonex Supply, I just sent an enquiry from your website.",
    `Name: ${data.name}`,
    product ? `Product: ${product.name}` : `Interest: ${data.interest}`,
    `Message: ${data.message}`,
  ];
  return lines.join("\n");
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 15px",
  border: "1px solid #DFE3EE",
  borderRadius: 11,
  fontFamily: "var(--font-manrope)",
  fontSize: 15,
  color: "#0B1226",
  background: "#FBFCFE",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13.5,
  fontWeight: 600,
  color: "#27314B",
  marginBottom: 8,
};

export function ContactForm({ product = null }: { product?: EnquiryProduct | null }) {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: product
      ? {
          interest: "Buying products",
          message: `Hi, I'm interested in the ${product.name}. Please share more details on availability and pricing.`,
        }
      : undefined,
  });

  async function onSubmit(data: FormValues) {
    try {
      await apiClient.post("/api/contact", { ...data, productId: product?.id });
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(data, product))}`,
        "_blank",
      );
      setSent(true);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to send message. Please try again.");
    }
  }

  if (sent) {
    return (
      <div className="text-center py-10 px-2">
        <div
          className="inline-flex items-center justify-center rounded-full mb-6"
          style={{ width: 72, height: 72, background: "#E2F6EF", color: "#067A55" }}
        >
          <CheckCircle size={34} strokeWidth={2} />
        </div>
        <div
          className="font-extrabold text-[26px] mb-2.5"
          style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}
        >
          Message sent
        </div>
        <p className="text-[16px] leading-[1.6] max-w-[360px] mx-auto mb-6" style={{ color: "#5A6480" }}>
          Thank you for reaching out to Fonex Supply. Our team will get back to you shortly with the
          details you need.
        </p>
        <button
          onClick={() => { setSent(false); reset(); }}
          className="font-bold text-[15px] px-6 py-3 rounded-[11px]"
          style={{ background: "#EEF1FB", color: "#1A1C74", fontFamily: "var(--font-manrope)", cursor: "pointer", border: "none" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className="font-extrabold text-[24px] mb-1.5"
        style={{ fontFamily: "var(--font-sora)", color: "#0B1226" }}
      >
        Send us a message
      </div>
      <p className="text-[15px] mb-5" style={{ color: "#5A6480" }}>
        Fill in your details and we&apos;ll get back to you with availability and pricing.
      </p>
      {product && (
        <div
          className="inline-flex items-center gap-2 rounded-full mb-6 px-4 py-2"
          style={{ background: "#EEF1FB", border: "1px solid #E0E6FA" }}
        >
          <span className="text-[12.5px] font-semibold" style={{ color: "#5A6480" }}>
            Enquiring about
          </span>
          <span
            className="text-[13.5px] font-bold"
            style={{ color: "#1A1C74", fontFamily: "var(--font-sora)" }}
          >
            {product.name}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label style={labelStyle}>Full name</label>
            <input
              {...register("name")}
              placeholder="Your name"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#1A1C74";
                e.target.style.boxShadow = "0 0 0 3px rgba(26,28,116,.14)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#DFE3EE";
                e.target.style.boxShadow = "none";
              }}
            />
            {errors.name && (
              <p className="text-[12.5px] mt-1" style={{ color: "#E53935" }}>
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input
              {...register("phone")}
              placeholder="+252 ..."
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "#1A1C74";
                e.target.style.boxShadow = "0 0 0 3px rgba(26,28,116,.14)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#DFE3EE";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label style={labelStyle}>Email address</label>
          <input
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#1A1C74";
              e.target.style.boxShadow = "0 0 0 3px rgba(26,28,116,.14)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#DFE3EE";
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.email && (
            <p className="text-[12.5px] mt-1" style={{ color: "#E53935" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label style={labelStyle}>I&apos;m interested in</label>
          <select
            {...register("interest")}
            style={{ ...inputStyle, cursor: "pointer" }}
            defaultValue=""
            onFocus={(e) => {
              e.target.style.borderColor = "#1A1C74";
              e.target.style.boxShadow = "0 0 0 3px rgba(26,28,116,.14)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#DFE3EE";
              e.target.style.boxShadow = "none";
            }}
          >
            <option value="" disabled>Select an option</option>
            <option>Buying products</option>
            <option>Becoming a retail partner</option>
            <option>Wholesale / bulk supply</option>
            <option>Spare parts & support</option>
            <option>Something else</option>
          </select>
          {errors.interest && (
            <p className="text-[12.5px] mt-1" style={{ color: "#E53935" }}>
              {errors.interest.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label style={labelStyle}>Message</label>
          <textarea
            {...register("message")}
            rows={4}
            placeholder="Tell us what you're looking for..."
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => {
              e.target.style.borderColor = "#1A1C74";
              e.target.style.boxShadow = "0 0 0 3px rgba(26,28,116,.14)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#DFE3EE";
              e.target.style.boxShadow = "none";
            }}
          />
          {errors.message && (
            <p className="text-[12.5px] mt-1" style={{ color: "#E53935" }}>
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full font-bold text-[16px] text-white py-4 rounded-[13px] transition-colors hover:bg-[#12144F] disabled:opacity-60"
          style={{
            background: "#1A1C74",
            boxShadow: "0 12px 28px rgba(26,28,116,.28)",
            fontFamily: "var(--font-manrope)",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </>
  );
}
