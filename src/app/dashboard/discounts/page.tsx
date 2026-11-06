"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Edit3, Plus, Search, X } from "lucide-react";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";

type DiscountStatus = "Active" | "Scheduled" | "Expired";
type Discount = { name: string; type: "Percentage" | "Fixed amount"; value: string; usage: number; status: DiscountStatus; ends: string };
const initialDiscounts: Discount[] = [
  { name: "Summer Sale", type: "Percentage", value: "20%", usage: 1248, status: "Active", ends: "Ends Jul 31, 2026" },
  { name: "WELCOME10", type: "Fixed amount", value: "$10", usage: 840, status: "Active", ends: "No end date" },
  { name: "Flash Deal", type: "Percentage", value: "15%", usage: 642, status: "Active", ends: "Ends Jul 30, 2026" },
  { name: "First Order", type: "Percentage", value: "10%", usage: 410, status: "Scheduled", ends: "Starts Aug 1, 2026" },
  { name: "VIP Reward", type: "Fixed amount", value: "$20", usage: 280, status: "Expired", ends: "Ended Jun 30, 2026" },
];
const statuses = ["All discounts", "Active", "Scheduled", "Expired"];

function DiscountFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <div className="discount-filter-menu" ref={ref}><button type="button" className={`discount-filter-button ${open ? "open" : ""}`} onClick={() => setOpen((current) => !current)} aria-expanded={open}><span>Status</span><strong>{value}</strong><ChevronDown size={14} /></button>{open && <div className="discount-filter-options" role="menu">{statuses.map((item) => <button key={item} type="button" role="menuitem" className={item === value ? "selected" : ""} onClick={() => { onChange(item); setOpen(false); }}>{item}{item === value && <Check size={13} />}</button>)}</div>}</div>;
}

function DiscountForm({ discount, onClose, onSave }: { discount: Discount; onClose: () => void; onSave: (discount: Discount) => void }) {
  const [draft, setDraft] = useState(discount);
  const update = (key: keyof Discount, value: string | number) => setDraft((current) => ({ ...current, [key]: value }));
  return <section className="discount-modal" role="dialog" aria-modal="true" aria-labelledby="discount-form-title"><button type="button" className="modal-close-button" onClick={onClose} aria-label="Close discount editor"><X size={18} /></button><div className="discount-form-content"><span className="dashboard-eyebrow"><i /> Promotion workspace</span><h2 id="discount-form-title">{discount.name ? "Edit discount" : "Create discount"}</h2><p>Set an offer that rewards customers and grows your store.</p><label>Discount name<input value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Summer Sale" /></label><div className="discount-two-col"><label>Type<select value={draft.type} onChange={(event) => update("type", event.target.value)}><option>Percentage</option><option>Fixed amount</option></select></label><label>Value<input value={draft.value} onChange={(event) => update("value", event.target.value)} placeholder="20%" /></label></div><label>Status<select value={draft.status} onChange={(event) => update("status", event.target.value)}><option>Active</option><option>Scheduled</option><option>Expired</option></select></label><button type="button" className="add-product-button" onClick={() => onSave(draft)}><Check size={15} /> Save discount</button></div></section>;
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(statuses[0]);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setEditing(null); setShowCreate(false); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);
  const visible = useMemo(() => discounts.filter((discount) => `${discount.name} ${discount.type}`.toLowerCase().includes(query.toLowerCase()) && (status === statuses[0] || discount.status === status)), [discounts, query, status]);
  const save = (discount: Discount) => {
    setDiscounts((current) => discount.name && current.some((item) => item === editing) ? current.map((item) => item === editing ? discount : item) : [...current, discount]);
    setEditing(null); setShowCreate(false);
  };
  const blank: Discount = { name: "", type: "Percentage", value: "10%", usage: 0, status: "Active", ends: "No end date" };
  return <main className="dashboard-content discounts-page">
    <header className="dashboard-header"><div className="dashboard-heading"><span className="dashboard-eyebrow"><i /> Growth workspace</span><h1>Discounts <span>✦</span></h1></div><DashboardHeaderActions /></header>
    <div className="discounts-page-intro"><p>Create promotions, reward loyal customers, and track campaign performance.</p><button type="button" className="add-product-button" onClick={() => setShowCreate(true)}><Plus size={16} /> Create discount</button></div>
    <section className="discount-stat-grid"><button className="discount-stat-card" onClick={() => setStatus("Active")}><span>Active discounts</span><strong>8</strong><small className="stat-good">Currently running</small></button><button className="discount-stat-card"><span>Total redemptions</span><strong>3,420</strong><small className="stat-good">↗ 18% this month</small></button><button className="discount-stat-card"><span>Revenue from offers</span><strong>$12,840</strong><small>Attributed sales</small></button></section>
    <section className="discount-panel"><div className="discount-heading"><div><h2>Your promotions</h2><p>{visible.length} promotions shown · Select one to edit</p></div><button type="button" className="orders-export-button">Export CSV</button></div>
      <div className="discount-toolbar"><label className="catalog-search"><Search size={16} /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search discount codes or campaigns" /><kbd>⌘K</kbd>{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={13} /></button>}</label><DiscountFilter value={status} onChange={setStatus} /></div>
      <div className="discount-table-wrap"><table className="discount-table"><thead><tr><th>Name</th><th>Type</th><th>Value</th><th>Usage</th><th>Status</th><th /></tr></thead><tbody>{visible.map((discount) => <tr key={discount.name} onClick={() => setEditing(discount)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") setEditing(discount); }}><td><strong>{discount.name}</strong><small>{discount.ends}</small></td><td>{discount.type}</td><td><strong>{discount.value}</strong></td><td>{discount.usage.toLocaleString()}</td><td><span className={`discount-status ${discount.status.toLowerCase()}`}><i />{discount.status}</span></td><td><Edit3 size={14} /></td></tr>)}</tbody></table></div>
      {visible.length === 0 && <p className="catalog-empty">No discounts match your search or status.</p>}
    </section>
    {(editing || showCreate) && <div className="product-modal-layer" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) { setEditing(null); setShowCreate(false); } }}><DiscountForm discount={editing ?? blank} onClose={() => { setEditing(null); setShowCreate(false); }} onSave={save} /></div>}
  </main>;
}
