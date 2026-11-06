"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Download, Edit3, Plus, Search, X } from "lucide-react";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";

type Customer = { name: string; email: string; location: string; spent: string; orders: number; lastOrder: string; initials: string; tone: "purple" | "cyan" | "yellow" | "green" };
const initialCustomers: Customer[] = [
  { name: "Sarah Johnson", email: "sarah.j@email.com", location: "United States", spent: "$1,240.00", orders: 12, lastOrder: "Jul 15, 2026", initials: "SJ", tone: "purple" },
  { name: "Omar Khan", email: "omar.k@email.com", location: "Pakistan", spent: "$845.50", orders: 8, lastOrder: "Jul 14, 2026", initials: "OK", tone: "cyan" },
  { name: "Ayesha Malik", email: "ayesha.m@email.com", location: "Pakistan", spent: "$620.00", orders: 6, lastOrder: "Jul 14, 2026", initials: "AM", tone: "yellow" },
  { name: "Daniel Brown", email: "daniel.b@email.com", location: "United Kingdom", spent: "$512.20", orders: 5, lastOrder: "Jul 13, 2026", initials: "DB", tone: "green" },
  { name: "Fatima Ali", email: "fatima.a@email.com", location: "United Arab Emirates", spent: "$408.00", orders: 4, lastOrder: "Jul 12, 2026", initials: "FA", tone: "purple" },
  { name: "Mia Wilson", email: "mia.w@email.com", location: "Canada", spent: "$291.75", orders: 3, lastOrder: "Jul 10, 2026", initials: "MW", tone: "cyan" },
];
const segments = ["All customers", "Returning customers", "VIP customers", "New customers"];

function SegmentFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <div className="customer-filter-menu" ref={ref}><button type="button" className={`customer-filter-button ${open ? "open" : ""}`} onClick={() => setOpen((current) => !current)} aria-expanded={open}><span>Segment</span><strong>{value}</strong><ChevronDown size={14} /></button>{open && <div className="customer-filter-options" role="menu">{segments.map((segment) => <button key={segment} type="button" role="menuitem" className={segment === value ? "selected" : ""} onClick={() => { onChange(segment); setOpen(false); }}>{segment}{segment === value && <Check size={13} />}</button>)}</div>}</div>;
}

function CustomerForm({ customer, title, onClose, onSave }: { customer: Customer; title: string; onClose: () => void; onSave: (customer: Customer) => void }) {
  const [draft, setDraft] = useState(customer);
  const update = (key: "name" | "email" | "location", value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const save = () => {
    const nameParts = draft.name.trim().split(/\s+/).filter(Boolean);
    const initials = nameParts.slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "CU";
    onSave({ ...draft, name: draft.name.trim() || "Unnamed customer", email: draft.email.trim(), location: draft.location.trim() || "Unknown", initials });
  };
  return <section className="customer-details-modal new-customer-modal" role="dialog" aria-modal="true" aria-labelledby="customer-form-title">
    <button type="button" className="modal-close-button" onClick={onClose} aria-label={`Close ${title.toLowerCase()}`}><X size={18} /></button>
    <div className="customer-detail-content"><span className="dashboard-eyebrow"><i /> Customer workspace</span><h2 id="customer-form-title">{title}</h2><p>{title === "Edit customer" ? "Update this customer profile and keep your directory current." : "Create a customer profile for your store."}</p>
      <label className="customer-form-label">Full name<input value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Jamie Lee" /></label>
      <label className="customer-form-label">Email address<input type="email" value={draft.email} onChange={(event) => update("email", event.target.value)} placeholder="customer@example.com" /></label>
      <label className="customer-form-label">Location<input value={draft.location} onChange={(event) => update("location", event.target.value)} placeholder="City, country" /></label>
      <button type="button" className="add-product-button" onClick={save}><Check size={15} /> Save customer</button>
    </div>
  </section>;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState(segments[0]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelected(null); setShowAdd(false); setEditing(null); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);
  const visibleCustomers = useMemo(() => customers.filter((customer) => {
    const text = `${customer.name} ${customer.email} ${customer.location}`.toLowerCase();
    const matchesSegment = segment === segments[0] || (segment === segments[1] && customer.orders >= 5) || (segment === segments[2] && Number(customer.spent.replace(/\D/g, "")) >= 800) || (segment === segments[3] && customer.orders <= 3);
    return text.includes(query.toLowerCase()) && matchesSegment;
  }), [customers, query, segment]);
  const saveCustomer = (customer: Customer) => {
    setCustomers((current) => editing ? current.map((item) => item.email === editing.email ? customer : item) : [...current, customer]);
    setSelected(null);
    setEditing(null);
    setShowAdd(false);
  };
  return <main className="dashboard-content customers-page">
    <header className="dashboard-header"><div className="dashboard-heading"><span className="dashboard-eyebrow"><i /> Relationship workspace</span><h1>Customers <span>✦</span></h1></div><DashboardHeaderActions /></header>
    <div className="customers-page-intro"><p>Understand your audience and build stronger customer relationships.</p><button type="button" className="add-product-button" onClick={() => setShowAdd(true)}><Plus size={16} /> Add customer</button></div>
    <section className="customer-stat-grid"><button className="customer-stat-card" onClick={() => setSegment(segments[0])}><span>Total customers</span><strong>12,480</strong><small className="stat-good">↗ 8.4% this month</small></button><button className="customer-stat-card" onClick={() => setSegment("Returning customers")}><span>Returning customers</span><strong>38.6%</strong><small className="stat-good">↗ 2.1% this month</small></button><button className="customer-stat-card" onClick={() => setSegment("VIP customers")}><span>Average lifetime value</span><strong>$245.30</strong><small>Across all customers</small></button></section>
    <section className="customer-panel"><div className="customer-heading"><div><h2>Customer directory</h2><p>{visibleCustomers.length} customers shown · Select a customer for details</p></div><button type="button" className="orders-export-button"><Download size={14} /> Export CSV</button></div>
      <div className="customer-toolbar"><label className="catalog-search"><Search size={16} /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email or phone" /><kbd>⌘K</kbd>{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={13} /></button>}</label><SegmentFilter value={segment} onChange={setSegment} /></div>
      <div className="customer-table-wrap"><table className="customer-table"><thead><tr><th>Customer</th><th>Email</th><th>Location</th><th>Spent</th><th>Orders</th><th>Last order</th><th /></tr></thead><tbody>{visibleCustomers.map((customer) => <tr key={customer.email} onClick={() => setSelected(customer)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") setSelected(customer); }}><td><span className={`customer-avatar ${customer.tone}`}>{customer.initials}</span><strong>{customer.name}</strong></td><td>{customer.email}</td><td>{customer.location}</td><td><strong>{customer.spent}</strong></td><td>{customer.orders}</td><td>{customer.lastOrder}</td><td><Edit3 size={14} /></td></tr>)}</tbody></table></div>
      {visibleCustomers.length === 0 && <p className="catalog-empty">No customers match your search or segment.</p>}
    </section>
    {selected && <div className="product-modal-layer" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}><section className="customer-details-modal" role="dialog" aria-modal="true" aria-labelledby="customer-details-title"><button type="button" className="modal-close-button" onClick={() => setSelected(null)} aria-label="Close customer details"><X size={18} /></button><div className={`customer-detail-avatar ${selected.tone}`}>{selected.initials}</div><div className="customer-detail-content"><span className="dashboard-eyebrow"><i /> Customer profile</span><h2 id="customer-details-title">{selected.name}</h2><p>{selected.email} · {selected.location}</p><div className="customer-facts"><span><small>Total spent</small><b>{selected.spent}</b><em>Lifetime value</em></span><span><small>Orders</small><b>{selected.orders}</b><em>Completed purchases</em></span><span><small>Last order</small><b>{selected.lastOrder}</b><em>Most recent activity</em></span></div><button type="button" className="add-product-button" onClick={() => { setEditing(selected); setSelected(null); }}><Edit3 size={15} /> Edit customer</button></div></section></div>}
    {showAdd && <div className="product-modal-layer" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setShowAdd(false); }}><CustomerForm customer={{ name: "", email: "", location: "", spent: "$0.00", orders: 0, lastOrder: "No orders yet", initials: "CU", tone: "purple" }} title="Add customer" onClose={() => setShowAdd(false)} onSave={saveCustomer} /></div>}
    {editing && <div className="product-modal-layer" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setEditing(null); }}><CustomerForm customer={editing} title="Edit customer" onClose={() => setEditing(null)} onSave={saveCustomer} /></div>}
  </main>;
}
