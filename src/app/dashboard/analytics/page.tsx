"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, Search, X } from "lucide-react";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";

const ranges = ["This year", "Last 30 days", "Last 90 days"];
const sources: Array<[string, number, "purple" | "cyan"]> = [
  ["Organic Search", 52, "purple"],
  ["Direct", 28, "purple"],
  ["Social Media", 12, "cyan"],
  ["Referral", 8, "cyan"],
];
const topProducts: Array<[string, string, number]> = [["Ceramic Mug", "$4,240", 100], ["Leather Backpack", "$3,120", 74], ["Wireless Earbuds", "$2,680", 63], ["Desk Lamp", "$2,190", 52]];

function RangeMenu({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <div className="analytics-range-menu" ref={ref}><button type="button" className={`analytics-range-button ${open ? "open" : ""}`} onClick={() => setOpen((current) => !current)} aria-expanded={open}><span>Range</span><strong>{value}</strong><ChevronDown size={14} /></button>{open && <div className="analytics-range-options" role="menu">{ranges.map((range) => <button key={range} role="menuitem" type="button" className={range === value ? "selected" : ""} onClick={() => { onChange(range); setOpen(false); }}>{range}{range === value && "✓"}</button>)}</div>}</div>;
}

export default function AnalyticsPage() {
  const [range, setRange] = useState(ranges[0]);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setQuery("");
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);
  return <main className="dashboard-content analytics-page">
    <header className="dashboard-header"><div className="dashboard-heading"><span className="dashboard-eyebrow"><i /> Intelligence workspace</span><h1>Analytics <span>✦</span></h1></div><DashboardHeaderActions /></header>
    <div className="analytics-page-intro"><p>Explore sales, traffic, conversion, and product performance.</p><div className="analytics-actions"><label className="analytics-search"><Search size={15} /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reports..." /><kbd>⌘K</kbd>{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={13} /></button>}</label><button type="button" className="analytics-export"><Download size={14} /> Export</button></div></div>
    <section className="analytics-stat-grid"><button className="analytics-stat-card"><span>Total revenue</span><strong>$24,780</strong><small className="stat-good">↑ 24.6%</small></button><button className="analytics-stat-card"><span>Total orders</span><strong>1,240</strong><small className="stat-good">↑ 12.1%</small></button><button className="analytics-stat-card"><span>Conversion rate</span><strong>3.8%</strong><small className="stat-good">↑ 0.6%</small></button><button className="analytics-stat-card"><span>Avg. order value</span><strong>$42.80</strong><small className="stat-good">↑ 4.2%</small></button></section>
    <section className="analytics-main-grid"><article className="analytics-chart-card"><div className="analytics-card-heading"><div><h2>Revenue over time</h2><p>{range} performance</p></div><RangeMenu value={range} onChange={setRange} /></div><div className="analytics-chart"><div className="analytics-grid-lines" /><svg viewBox="0 0 680 250" role="img" aria-label="Revenue over time chart"><defs><linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--purple)" stopOpacity=".4" /><stop offset="100%" stopColor="var(--purple)" stopOpacity=".02" /></linearGradient></defs><path d="M0 210 C70 155 100 180 150 145 S245 175 300 105 S395 125 450 78 S545 95 600 42 S650 62 680 28 L680 250 L0 250Z" fill="url(#analyticsFill)" /><path d="M0 210 C70 155 100 180 150 145 S245 175 300 105 S395 125 450 78 S545 95 600 42 S650 62 680 28" fill="none" stroke="var(--purple)" strokeWidth="4" strokeLinecap="round" /><path d="M0 226 C70 190 100 198 150 173 S245 195 300 155 S395 165 450 135 S545 145 600 112 S650 125 680 98" fill="none" stroke="var(--yellow)" strokeWidth="2" strokeDasharray="6 7" /></svg><div className="analytics-chart-labels"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span></div></div><div className="analytics-legend"><span><i className="purple-dot" />Current period</span><span><i className="yellow-dot" />Previous period</span></div></article>
      <article className="analytics-side-card"><div className="analytics-card-heading"><div><h2>Traffic sources</h2><p>Where visitors come from</p></div></div>{sources.map(([name, percent, tone]) => <div className="traffic-source" key={name}><div><strong>{name}</strong><b>{percent}%</b></div><div className="traffic-track"><span className={tone} style={{ width: `${percent}%` }} /></div></div>)}</article>
    </section>
    <section className="top-products-card"><div className="analytics-card-heading"><div><h2>Top products</h2><p>Revenue contribution by product</p></div><button type="button" className="analytics-link">View products →</button></div>{topProducts.filter(([name]) => !query || name.toLowerCase().includes(query.toLowerCase())).map(([name, amount, width]) => <div className="top-product-row" key={name}><div><strong>{name}</strong><b>{amount}</b></div><div className="traffic-track"><span style={{ width: `${width}%` }} /></div></div>)}</section>
  </main>;
}
