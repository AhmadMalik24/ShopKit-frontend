"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check, ChevronDown, Download, Edit3, Plus, Search, X,
} from "lucide-react";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";

type OrderStatus = "Shipped" | "Processing" | "Delivered" | "Pending" | "Cancelled";
type Order = {
  id: string; customer: string; email: string; date: string; total: string;
  payment: string; status: OrderStatus;
};

const initialOrders: Order[] = [
  { id: "#SK-1048", customer: "Sarah Johnson", email: "sarah@example.com", date: "Jul 15, 2026", total: "$142.00", payment: "Stripe", status: "Shipped" },
  { id: "#SK-1047", customer: "Omar Khan", email: "omar@example.com", date: "Jul 14, 2026", total: "$87.50", payment: "PayPal", status: "Processing" },
  { id: "#SK-1046", customer: "Ayesha Malik", email: "ayesha@example.com", date: "Jul 14, 2026", total: "$120.00", payment: "Stripe", status: "Delivered" },
  { id: "#SK-1045", customer: "Daniel Brown", email: "daniel@example.com", date: "Jul 13, 2026", total: "$64.00", payment: "Apple Pay", status: "Pending" },
  { id: "#SK-1044", customer: "Mia Wilson", email: "mia@example.com", date: "Jul 12, 2026", total: "$218.25", payment: "Stripe", status: "Delivered" },
  { id: "#SK-1043", customer: "Noah Garcia", email: "noah@example.com", date: "Jul 11, 2026", total: "$46.00", payment: "PayPal", status: "Cancelled" },
];
const orderStatuses = ["All status", "Shipped", "Processing", "Delivered", "Pending", "Cancelled"];
const dateRanges = ["All dates", "Last 3 days", "Last 7 days", "Last 30 days"];

function OrderFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <div className="orders-filter-menu" ref={ref}>
    <button type="button" className={`orders-filter-button ${open ? "open" : ""}`} onClick={() => setOpen((current) => !current)} aria-expanded={open}>
      <span>Status</span><strong>{value}</strong><ChevronDown size={14} />
    </button>
    {open && <div className="orders-filter-options" role="menu">{orderStatuses.map((status) => <button key={status} type="button" role="menuitem" className={status === value ? "selected" : ""} onClick={() => { onChange(status); setOpen(false); }}>{status}{status === value && <Check size={13} />}</button>)}</div>}
  </div>;
}

function statusClass(status: OrderStatus) {
  return status.toLowerCase();
}

function DateRangeFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <div className="orders-date-menu" ref={ref}>
    <button type="button" className={`orders-date-button ${open ? "open" : ""}`} onClick={() => setOpen((current) => !current)} aria-expanded={open}>
      <span>Date range</span><strong>{value === "All dates" ? "Any time" : value.replace("Last ", "")}</strong><ChevronDown size={14} />
    </button>
    {open && <div className="orders-date-options" role="menu">{dateRanges.map((range) => <button key={range} type="button" role="menuitem" className={range === value ? "selected" : ""} onClick={() => { onChange(range); setOpen(false); }}>{range}{range === value && <Check size={13} />}</button>)}</div>}
  </div>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(orderStatuses[0]);
  const [dateRange, setDateRange] = useState(dateRanges[0]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelectedOrder(null); setShowNewOrder(false); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const visibleOrders = useMemo(() => orders.filter((order) => {
    const text = `${order.id} ${order.customer} ${order.email}`.toLowerCase();
    const days = dateRange === dateRanges[1] ? 3 : dateRange === dateRanges[2] ? 7 : dateRange === dateRanges[3] ? 30 : Infinity;
    const latestOrderDate = new Date("2026-07-15").getTime();
    const orderDate = new Date(order.date).getTime();
    const withinRange = days === Infinity || latestOrderDate - orderDate <= days * 24 * 60 * 60 * 1000;
    return text.includes(query.toLowerCase()) && (status === orderStatuses[0] || order.status === status) && withinRange;
  }), [dateRange, orders, query, status]);

  const updateStatus = (nextStatus: OrderStatus) => {
    if (!selectedOrder) return;
    setOrders((current) => current.map((order) => order.id === selectedOrder.id ? { ...order, status: nextStatus } : order));
    setSelectedOrder({ ...selectedOrder, status: nextStatus });
  };

  return <main className="dashboard-content orders-page">
    <header className="dashboard-header"><div className="dashboard-heading"><span className="dashboard-eyebrow"><i /> Fulfillment workspace</span><h1>Orders <span>✦</span></h1></div><DashboardHeaderActions /></header>
    <div className="orders-page-intro"><p>Manage, track, and fulfill every customer order from one place.</p><button type="button" className="add-product-button" onClick={() => setShowNewOrder(true)}><Plus size={16} /> New order</button></div>
    <section className="orders-stat-grid" aria-label="Order summary">
      <button className="orders-stat-card" onClick={() => setStatus(orderStatuses[0])}><span>Total orders</span><strong>1,284</strong><small className="stat-good">↗ 12.4% this month</small></button>
      <button className="orders-stat-card" onClick={() => setStatus("Pending")}><span>Awaiting fulfillment</span><strong>48</strong><small>Needs attention</small></button>
      <button className="orders-stat-card" onClick={() => setStatus("Shipped")}><span>In transit</span><strong>126</strong><small>Across 4 carriers</small></button>
      <button className="orders-stat-card"><span>Revenue</span><strong>$38,420</strong><small className="stat-good">↗ 8.2% this month</small></button>
    </section>
    <section className="orders-panel">
      <div className="orders-heading"><div><h2>All orders</h2><p>{visibleOrders.length} orders shown · Select an order for details</p></div><button type="button" className="orders-export-button"><Download size={14} /> Export CSV</button></div>
      <div className="orders-toolbar"><label className="catalog-search"><Search size={16} /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by order, customer or email" /><kbd>⌘K</kbd>{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={13} /></button>}</label><OrderFilter value={status} onChange={setStatus} /><DateRangeFilter value={dateRange} onChange={setDateRange} /></div>
      <div className="orders-table-wrap"><table className="orders-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Payment</th><th>Status</th><th /></tr></thead><tbody>{visibleOrders.map((order) => <tr key={order.id} onClick={() => setSelectedOrder(order)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter") setSelectedOrder(order); }}><td><strong>{order.id}</strong></td><td><strong>{order.customer}</strong><small>{order.email}</small></td><td>{order.date}</td><td><strong>{order.total}</strong></td><td>{order.payment}</td><td><span className={`order-status ${statusClass(order.status)}`}><i />{order.status}</span></td><td><Edit3 size={14} /></td></tr>)}</tbody></table></div>
      {visibleOrders.length === 0 && <p className="catalog-empty">No orders match your search or status filter.</p>}
    </section>
    {selectedOrder && <div className="product-modal-layer" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelectedOrder(null); }}><section className="order-details-modal" role="dialog" aria-modal="true" aria-labelledby="order-details-title"><button type="button" className="modal-close-button" onClick={() => setSelectedOrder(null)} aria-label="Close order details"><X size={18} /></button><span className={`order-status large ${statusClass(selectedOrder.status)}`}><i />{selectedOrder.status}</span><div className="order-details-content"><span className="dashboard-eyebrow"><i /> Order details</span><h2 id="order-details-title">{selectedOrder.id}</h2><p>{selectedOrder.customer} · {selectedOrder.email}</p><strong>{selectedOrder.total}</strong><div className="order-detail-facts"><span><small>Order date</small><b>{selectedOrder.date}</b></span><span><small>Payment</small><b>{selectedOrder.payment}</b></span><span><small>Fulfillment</small><b>{selectedOrder.status}</b></span></div><label className="order-status-editor">Update status<select value={selectedOrder.status} onChange={(event) => updateStatus(event.target.value as OrderStatus)}>{orderStatuses.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><button type="button" className="add-product-button" onClick={() => setSelectedOrder(null)}><Check size={15} /> Done</button></div></section></div>}
    {showNewOrder && <div className="product-modal-layer" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setShowNewOrder(false); }}><section className="order-details-modal new-order-modal" role="dialog" aria-modal="true" aria-labelledby="new-order-title"><button type="button" className="modal-close-button" onClick={() => setShowNewOrder(false)} aria-label="Close new order"><X size={18} /></button><div className="order-details-content"><span className="dashboard-eyebrow"><i /> Order workspace</span><h2 id="new-order-title">Create new order</h2><p>Add an order manually for a customer.</p><label className="order-form-label">Customer name<input placeholder="e.g. Jamie Lee" /></label><label className="order-form-label">Customer email<input type="email" placeholder="customer@example.com" /></label><label className="order-form-label">Order total<input placeholder="$0.00" /></label><button type="button" className="add-product-button" onClick={() => setShowNewOrder(false)}><Check size={15} /> Create order</button></div></section></div>}
  </main>;
}
