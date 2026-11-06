"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, Copy, Globe2, Plus, Search, ShieldCheck, X } from "lucide-react";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";

const registrars = [
  { name: "GoDaddy", mark: "G", color: "#f59e0b" },
  { name: "Namecheap", mark: "N", color: "#14b8a6" },
  { name: "Cloudflare", mark: "C", color: "#f97316" },
  { name: "Google Domains", mark: "G", color: "#6366f1" },
];

function DomainModal({ onClose, onConnect }: { onClose: () => void; onConnect: (domain: string) => void }) {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState("");
  const submit = () => {
    const value = domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!value || !value.includes(".")) {
      setError("Enter a valid domain, such as www.yourstore.com.");
      return;
    }
    onConnect(value);
  };
  return <section className="domains-modal" role="dialog" aria-modal="true" aria-labelledby="domain-modal-title">
    <button type="button" className="modal-close-button" onClick={onClose} aria-label="Close domain dialog"><X size={18} /></button>
    <div className="domains-modal-icon"><Globe2 size={22} /></div>
    <span className="dashboard-eyebrow"><i /> Storefront setup</span>
    <h2 id="domain-modal-title">Connect a custom domain</h2>
    <p>Use a domain you already own and make it your primary storefront address.</p>
    <label className="domains-form-label">Domain name<input autoFocus value={domain} onChange={(event) => { setDomain(event.target.value); setError(""); }} onKeyDown={(event) => { if (event.key === "Enter") submit(); }} placeholder="www.yourstore.com" /></label>
    {error && <p className="domains-form-error">{error}</p>}
    <div className="domains-modal-actions"><button type="button" className="domains-secondary-button" onClick={onClose}>Cancel</button><button type="button" className="add-product-button" onClick={submit}><Plus size={15} /> Connect domain</button></div>
  </section>;
}

export default function DomainsPage() {
  const [connectedDomain, setConnectedDomain] = useState("northstar.shopkit.co");
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowModal(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);
  const copyDomain = async () => {
    await navigator.clipboard?.writeText(connectedDomain);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return <main className="dashboard-content domains-page">
    <header className="dashboard-header"><div className="dashboard-heading"><span className="dashboard-eyebrow"><i /> Store settings</span><h1>Domains <span>✦</span></h1></div><DashboardHeaderActions /></header>
    <div className="domains-page-intro"><p>Connect a custom domain and manage DNS configuration for your storefront.</p><label className="domains-search"><Search size={15} /><input ref={searchRef} placeholder="Search domains..." /><kbd>⌘K</kbd></label></div>
    <section className="domains-connected-card"><div className="domains-connected-main"><div className="domains-globe"><Globe2 size={25} /></div><div><span className="domains-card-label">Connected domain</span><h2>{connectedDomain}</h2><p>Your storefront is live at <strong>{connectedDomain}</strong></p></div></div><div className="domains-primary-badge"><ShieldCheck size={14} /> Primary</div><div className="domains-card-footer"><span><Check size={14} /> ShopKit subdomain · SSL secured automatically</span><button type="button" className="domains-copy-button" onClick={copyDomain}>{copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy domain</>}</button></div></section>
    <section className="domains-add-card"><div><div className="domains-add-icon"><Plus size={21} /></div><div><h2>Add a custom domain</h2><p>Use your own domain name to build trust and strengthen your brand.</p></div></div><button type="button" className="add-product-button" onClick={() => setShowModal(true)}>Connect domain <ChevronRight size={15} /></button></section>
    <section className="domains-lower-grid"><article className="domains-panel"><div className="domains-panel-heading"><div><h2>Popular registrars</h2><p>Purchase a domain from a trusted provider.</p></div></div><div className="domains-registrars">{registrars.map((registrar) => <button type="button" className="domains-registrar" key={registrar.name} onClick={() => setShowModal(true)}><span style={{ backgroundColor: registrar.color }}>{registrar.mark}</span><strong>{registrar.name}</strong><ChevronRight size={15} /></button>)}</div></article><article className="domains-panel domains-dns-panel"><div className="domains-panel-heading"><div><h2>DNS setup instructions</h2><p>Watch your domain connect to ShopKit.</p></div><span className="domains-live-badge"><i /> Live flow</span></div><div className="domains-dns-visual" aria-label="Animated DNS connection flow"><div className="domains-orbit orbit-one" /><div className="domains-orbit orbit-two" /><div className="domains-flow-node domains-flow-origin"><span>www</span><strong>Your domain</strong><small>Registrar</small></div><div className="domains-flow-line line-one"><i /></div><div className="domains-flow-node domains-flow-dns"><span><Globe2 size={20} /></span><strong>DNS records</strong><small>A + CNAME</small></div><div className="domains-flow-line line-two"><i /></div><div className="domains-flow-node domains-flow-shopkit"><span>SK</span><strong>ShopKit</strong><small>Storefront</small></div><div className="domains-packet packet-one" /><div className="domains-packet packet-two" /></div><ol className="domains-steps"><li><span>1</span><div><strong>Add an A record</strong><small>Point to <code>76.76.21.21</code></small></div></li><li><span>2</span><div><strong>Add CNAME <code>www → shops.shopkit.co</code></strong><small>Connect the www subdomain</small></div></li><li><span>3</span><div><strong>Wait for DNS propagation</strong><small>Changes can take up to 48 hours</small></div></li></ol><div className="domains-note"><ShieldCheck size={15} /> DNS changes can take up to 48 hours.</div></article></section>
    {showModal && <div className="product-modal-layer" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setShowModal(false); }}><DomainModal onClose={() => setShowModal(false)} onConnect={(domain) => { setConnectedDomain(domain); setShowModal(false); }} /></div>}
  </main>;
}
