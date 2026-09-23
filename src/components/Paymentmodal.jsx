import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

const UPI_ID = "9860608317-5@ybl";
const BUSINESS_NAME = "Vronix Digital";
const WHATSAPP_NUMBER = "919822452413";

const UPI_APPS = [
  {
    name: "Google Pay",
    color: "#22c55e",
    url: (upi, amt, name, note) =>
      `tez://upi/pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amt}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: "PhonePe",
    color: "#8c52ff",
    url: (upi, amt, name, note) =>
      `phonepe://pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amt}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: "Paytm",
    color: "#38bdf8",
    url: (upi, amt, name, note) =>
      `paytmmp://pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amt}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
  {
    name: "Any UPI app",
    color: "#a6a6a6",
    url: (upi, amt, name, note) =>
      `upi://pay?pa=${upi}&pn=${encodeURIComponent(name)}&am=${amt}&cu=INR&tn=${encodeURIComponent(note)}`,
  },
];

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/**
 * Props
 *  amount       number, in rupees (e.g. 8000)
 *  packageName  string shown in the header and the payment note
 *  details      { name, phone, email, guest, date } from the booking form
 *  onClose      called on Esc, backdrop click, or the close button
 *  onSent       called when the person taps "Send screenshot on WhatsApp"
 */
export default function PaymentModal({ amount, packageName, details, sessionLabel, onClose, onSent }) {
  const [copied, setCopied] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);
  const closeRef = useRef(null);
  const mobile = isMobile();

  const amt = Number(amount).toFixed(2); // UPI expects a plain decimal, no commas
  const note = `Podcast booking - ${packageName}`;
  const qrData = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${amt}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrData)}`;

  const waText = [
    `Hi! I have paid ₹${Number(amount).toLocaleString("en-IN")} for the ${packageName} podcast booking.`,
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    `Joining as: ${details.guest}`,
    `Session: ${sessionLabel || `${details.date} ${details.slot}`}`,
    "Please confirm my slot.",
  ].join("\n");

  // Esc to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock page scroll and move focus into the dialog
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const copyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard can be blocked; the UPI ID stays visible to copy by hand. */
    }
  };

  return createPortal(
    <div className="pay" role="presentation" onMouseDown={onClose}>
      <motion.div
        className="pay__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-title"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="pay__head">
          <button
            ref={closeRef}
            type="button"
            className="pay__close"
            onClick={onClose}
            aria-label="Close payment dialog"
          >
            ×
          </button>
          <p className="pay__eyebrow">Pay by UPI</p>
          <h2 id="payment-title" className="pay__amount">
            ₹{Number(amount).toLocaleString("en-IN")}
          </h2>
          <p className="pay__for">{packageName}</p>
        </header>

        <div className="pay__body">
          <section className="pay__why" aria-labelledby="payment-value-title">
            <h3 id="payment-value-title">Why ₹10,000?</h3>
            <p>
              The podcast conversation is free. This payment covers post-production: editing,
              all seven reels, and at least three reels built for viral-reach potential.
            </p>
          </section>

          {mobile ? (
            <>
              <p className="pay__text">Choose your UPI app to pay instantly.</p>
              <div className="pay__apps">
                {UPI_APPS.map((app) => (
                  <a key={app.name} className="pay__app" href={app.url(UPI_ID, amt, BUSINESS_NAME, note)}>
                    <span className="pay__dot" style={{ backgroundColor: app.color }} />
                    {app.name}
                  </a>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="pay__text">Scan this QR code with any UPI app on your phone.</p>
              <div className="pay__qr">
                {qrFailed ? (
                  <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
                    QR code couldn’t load. Use the UPI ID below instead.
                  </p>
                ) : (
                  <img
                    src={qrUrl}
                    alt="UPI payment QR code"
                    width="192"
                    height="192"
                    onError={() => setQrFailed(true)}
                  />
                )}
              </div>
            </>
          )}

          <div className="pay__upi">
            <div>
              <span className="pay__upi-label">UPI ID</span>
              <strong>{UPI_ID}</strong>
            </div>
            <button type="button" className="pay__copy" onClick={copyUPI}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="pay__note">
            After paying, send your payment screenshot on WhatsApp so we can confirm your slot.
          </p>

          <a
            className="btn pay__wa"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noreferrer"
            onClick={onSent}
          >
            Send screenshot on WhatsApp
          </a>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
