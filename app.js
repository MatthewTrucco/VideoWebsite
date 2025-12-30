// ===== Pricing (edit these anytime) =====
const PRICING = {
  vhs: 25,
  vhsc: 25,
  minidv: 25,
  slides: 0.80,
  photos: 1.00,
  usbFlat: 10,
  rushMultiplier: 1.20,     // +20%
  rangeLowMultiplier: 0.90, // low-end of estimate range
  rangeHighMultiplier: 1.35 // high-end of estimate range
};

function money(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function num(id) {
  const el = document.getElementById(id);
  const n = Number(el?.value ?? 0);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

function checked(id) {
  return !!document.getElementById(id)?.checked;
}

function calc() {
  const vhs = num("vhs");
  const vhsc = num("vhsc");
  const minidv = num("minidv");
  const slides = num("slides");
  const photos = num("photos");

  const usb = checked("usb");
  const rush = checked("rush");

  const base =
    vhs * PRICING.vhs +
    vhsc * PRICING.vhsc +
    minidv * PRICING.minidv +
    slides * PRICING.slides +
    photos * PRICING.photos;

  const addOns = (usb ? PRICING.usbFlat : 0);
  const rushMult = rush ? PRICING.rushMultiplier : 1.0;

  const subtotal = (base + addOns) * rushMult;

  const low = subtotal * PRICING.rangeLowMultiplier;
  const high = subtotal * PRICING.rangeHighMultiplier;

  const rangeOut = document.getElementById("rangeOut");
  const totalOut = document.getElementById("totalOut");
  const summaryOut = document.getElementById("summaryOut");
  const disclaimerOut = document.getElementById("disclaimerOut");

  if (rangeOut) rangeOut.textContent = `${money(Math.round(low))} – ${money(Math.round(high))}`;
  if (totalOut) totalOut.textContent = money(Math.round(subtotal));

  const items = [];
  if (vhs) items.push(`VHS: ${vhs}`);
  if (vhsc) items.push(`VHS-C: ${vhsc}`);
  if (minidv) items.push(`MiniDV: ${minidv}`);
  if (slides) items.push(`Slides: ${slides}`);
  if (photos) items.push(`Photos: ${photos}`);

  const addOnText = [];
  if (usb) addOnText.push("USB delivery (+$10)");
  if (rush) addOnText.push("Rush service (+20%)");

  const summary = [
    `Estimate – Matt's Video Restoration (Basking Ridge)`,
    `Items: ${items.length ? items.join(", ") : "None"}`,
    `Add-ons: ${addOnText.length ? addOnText.join(", ") : "None"}`,
    `Estimate range: ${money(Math.round(low))} – ${money(Math.round(high))}`,
    `Phone: (908) 875-7199`
  ].join("\n");

  if (summaryOut) summaryOut.textContent = summary;

  if (disclaimerOut) {
    disclaimerOut.textContent =
      "This is a quick estimate range. Final price can change if tapes are extra-long, heavily damaged, or require special handling.";
  }
}

function setupEstimator() {
  const calcBtn = document.getElementById("calcBtn");
  const copyBtn = document.getElementById("copyBtn");
  const resetBtn = document.getElementById("resetBtn");

  // Calculate on button click
  calcBtn?.addEventListener("click", calc);

  // Auto-calc when inputs change (feels modern)
  ["vhs","vhsc","minidv","slides","photos","usb","rush"].forEach((id) => {
    const el = document.getElementById(id);
    el?.addEventListener("input", calc);
    el?.addEventListener("change", calc);
  });

  // Copy summary
  copyBtn?.addEventListener("click", async () => {
    const text = document.getElementById("summaryOut")?.textContent || "";
    if (!text.trim()) calc();

    try {
      await navigator.clipboard.writeText(document.getElementById("summaryOut").textContent);
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy Summary"), 1200);
    } catch (e) {
      alert("Copy failed (browser blocked clipboard). You can manually select and copy the summary box.");
      console.warn(e);
    }
  });

  // Reset
  resetBtn?.addEventListener("click", () => {
    ["vhs","vhsc","minidv","slides","photos"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = 0;
    });
    const usb = document.getElementById("usb");
    const rush = document.getElementById("rush");
    if (usb) usb.checked = false;
    if (rush) rush.checked = false;
    calc();
  });

  // Initial calc
  calc();
}

document.addEventListener("DOMContentLoaded", () => {
  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Estimator
  setupEstimator();
});
// Show review success message after Netlify redirect
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("review") === "success") {
    const msg = document.getElementById("reviewSuccess");
    if (msg) msg.style.display = "block";
  }
});
