"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CreditCard, Download, FileText, Share2, Zap, X } from "lucide-react";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";

const plans = [
  { name: "Starter", price: "$12", detail: "For new stores", accent: "cyan", features: ["100 products", "1 team member", "500 monthly orders"] },
  { name: "Pro", price: "$29", detail: "For growing brands", accent: "purple", features: ["500 products", "5 team members", "2,000 monthly orders"] },
  { name: "Scale", price: "$79", detail: "For high-volume teams", accent: "yellow", features: ["Unlimited products", "20 team members", "Unlimited orders"] },
];
const invoices = [
  ["INV-2026-07", "Jul 05, 2026", "Pro Plan subscription", "$29.00"],
  ["INV-2026-06", "Jun 05, 2026", "Pro Plan subscription", "$29.00"],
  ["INV-2026-05", "May 05, 2026", "Pro Plan subscription", "$29.00"],
  ["INV-2026-04", "Apr 05, 2026", "Pro Plan subscription", "$29.00"],
];
const usage = [["Products", 216, 500, "purple"], ["Team members", 2, 5, "cyan"], ["Monthly orders", 184, 2000, "yellow"]] as const;

function PlanModal({ onClose, onSelect }: { onClose: () => void; onSelect: (name: string) => void }) {
  return <section className="billing-plan-modal" role="dialog" aria-modal="true" aria-labelledby="billing-plan-title">
    <button type="button" className="modal-close-button" onClick={onClose} aria-label="Close plan selector"><X size={18} /></button>
    <span className="dashboard-eyebrow"><i /> Flexible growth</span><h2 id="billing-plan-title">Choose the right plan</h2><p>Upgrade when your store is ready for its next stage.</p>
    <div className="billing-plan-options">{plans.map((plan) => <button type="button" className={`billing-plan-option ${plan.accent}`} key={plan.name} onClick={() => onSelect(plan.name)}><div><strong>{plan.name}</strong><small>{plan.detail}</small></div><b>{plan.price}<em>/mo</em></b><span>{plan.features[0]} · {plan.features[1]}</span></button>)}</div>
  </section>;
}

export default function BillingPage() {
  const [plan, setPlan] = useState("Pro");
  const [modal, setModal] = useState<"plans" | "payment" | null>(null);
  const [receiptInvoice, setReceiptInvoice] = useState<string | null>(null);
  const [receiptNotice, setReceiptNotice] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModal(null);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);
  const createReceiptFile = () => {
    if (!receiptInvoice) return;
    const invoice = invoices.find(([number]) => number === receiptInvoice);
    if (!invoice) return;
    const [, date, description, amount] = invoice;
    const receipt = `SHOPKIT RECEIPT\n\nInvoice: ${receiptInvoice}\nDate: ${date}\nDescription: ${description}\nAmount: ${amount}\nStatus: Paid\nPayment method: Stripe Mastercard ending in 4242`;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([receipt], { type: "text/plain" }));
    link.download = `${receiptInvoice}-receipt.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const shareReceipt = async () => {
    if (!receiptInvoice) return;
    const shareData = { title: `Receipt ${receiptInvoice}`, text: `Receipt ${receiptInvoice} for the Pro Plan payment of $29.00.` };
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard?.writeText(shareData.text);
    setReceiptNotice("Receipt details copied to your clipboard.");
    window.setTimeout(() => setReceiptNotice(""), 2200);
  };
  return <main className="dashboard-content billing-page">
    <header className="dashboard-header"><div className="dashboard-heading"><span className="dashboard-eyebrow"><i /> Account settings</span><h1>Billing &amp; Plan <span>✦</span></h1></div><DashboardHeaderActions /></header>
    <div className="billing-page-intro"><p>Review your subscription, usage, invoices, and payment details.</p><span className="billing-secure"><CreditCard size={13} /> Secure billing</span></div>
    <section className="billing-hero-card"><div className="billing-hero-glow" /><div className="billing-hero-content"><span className="billing-label">Current plan</span><div className="billing-plan-title-row"><div className="billing-plan-icon"><Zap size={21} /></div><div><h2>{plan} Plan</h2><p>Everything you need to grow your business.</p></div></div><div className="billing-price"><strong>{plans.find((item) => item.name === plan)?.price ?? "$29"}</strong><span>/ month · billed monthly</span></div><button type="button" className="add-product-button" onClick={() => setModal("plans")}>{plan === "Scale" ? "Manage plan" : "Upgrade plan"} <ArrowRight size={15} /></button></div><div className="billing-hero-orbit"><div className="billing-orbit-ring ring-a" /><div className="billing-orbit-ring ring-b" /><div className="billing-orbit-core"><Zap size={28} /></div></div><div className="billing-hero-footer"><span><i /> Active subscription</span><strong>Next billing date: Aug 05, 2026</strong></div></section>
    <section className="billing-usage-panel"><div className="billing-section-heading"><div><h2>Usage this month</h2><p>Stay on top of your plan limits.</p></div><span className="billing-usage-cycle">Resets in 24 days</span></div><div className="billing-usage-grid">{usage.map(([label, current, max, tone]) => <div className="billing-usage-card" key={label}><div><strong>{label}</strong><span>{current.toLocaleString()} / {max.toLocaleString()}</span></div><div className="billing-progress"><i className={tone} style={{ width: `${Math.max(4, current / max * 100)}%` }} /></div><small>{Math.round(current / max * 100)}% used</small></div>)}</div></section>
    <section className="billing-bottom-grid"><article className="billing-invoices-panel"><div className="billing-section-heading"><div><h2>Invoices</h2><p>Billing history</p></div><button type="button" className="billing-outline-button"><Download size={13} /> Export</button></div><div className="billing-table-wrap"><table className="billing-table"><thead><tr><th>Invoice</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th><th /></tr></thead><tbody>{invoices.map(([invoice, date, description, amount]) => <tr key={invoice}><td><strong>{invoice}</strong></td><td>{date}</td><td>{description}</td><td><strong>{amount}</strong></td><td><span className="billing-paid"><i /> Paid</span></td><td><button type="button" className="billing-receipt-icon" onClick={() => { setReceiptInvoice(invoice); setReceiptNotice(""); }} aria-label={`Open receipt for ${invoice}`} title="Open receipt"><FileText size={15} /></button></td></tr>)}</tbody></table></div></article><article className="billing-payment-panel"><div className="billing-section-heading"><div><h2>Payment method</h2><p>Your default payment method</p></div></div><div className="billing-card-visual"><div className="billing-card-shine" /><span>STRIPE</span><strong>•••• 4242</strong><small>MASTERCARD <em>12/28</em></small></div><button type="button" className="billing-manage-button" onClick={() => setModal("payment")}>Manage payment method <ArrowRight size={14} /></button></article></section>
    {(modal || receiptInvoice) && <div className="product-modal-layer" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) { setModal(null); setReceiptInvoice(null); } }}>{modal === "plans" ? <PlanModal onClose={() => setModal(null)} onSelect={(nextPlan) => { setPlan(nextPlan); setModal(null); }} /> : modal === "payment" ? <section className="billing-plan-modal" role="dialog" aria-modal="true"><button type="button" className="modal-close-button" onClick={() => setModal(null)} aria-label="Close payment dialog"><X size={18} /></button><div className="billing-modal-icon"><CreditCard size={22} /></div><h2>Manage payment method</h2><p>Your Stripe Mastercard ending in 4242 is ready for your next billing date.</p><button type="button" className="add-product-button" onClick={() => setModal(null)}>Done <Check size={15} /></button></section> : <section className="billing-receipt-modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title"><button type="button" className="modal-close-button" onClick={() => setReceiptInvoice(null)} aria-label="Close receipt"><X size={18} /></button><div className="billing-receipt-header"><div className="billing-modal-icon"><FileText size={22} /></div><span className="billing-paid"><i /> Paid</span></div><span className="billing-label">Payment receipt</span><h2 id="receipt-title">Receipt {receiptInvoice}</h2><p>Thank you for your payment. This receipt confirms your Pro Plan subscription.</p><div className="billing-receipt-details"><span><small>Date</small><strong>{invoices.find(([number]) => number === receiptInvoice)?.[1]}</strong></span><span><small>Amount paid</small><strong>$29.00</strong></span><span><small>Payment method</small><strong>Stripe Mastercard · 4242</strong></span></div>{receiptNotice && <div className="billing-receipt-notice"><Check size={14} /> {receiptNotice}</div>}<div className="billing-receipt-actions"><button type="button" className="billing-outline-button" onClick={createReceiptFile}><Download size={14} /> Download</button><button type="button" className="add-product-button" onClick={shareReceipt}><Share2 size={14} /> Share</button></div></section>}</div>}
  </main>;
}
