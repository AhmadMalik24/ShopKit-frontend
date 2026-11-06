"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ImagePlus, Mail, Palette, Phone, Save, Store, Upload, X } from "lucide-react";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";

type Settings = { name: string; description: string; email: string; phone: string; currency: string; timezone: string; language: string; primary: string; accent: string; highlight: string; accounts: boolean; outOfStock: boolean; password: boolean };
const initialSettings: Settings = { name: "Northstar Goods", description: "Premium products for modern living.", email: "hello@northstargoods.com", phone: "+1 (555) 014-8720", currency: "USD ($)", timezone: "(GMT-05:00) Eastern Time", language: "English", primary: "#B184FF", accent: "#55DBE1", highlight: "#FFDC65", accounts: true, outOfStock: true, password: false };

function SettingSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close);
  }, []);
  return <div className="settings-select-wrap" ref={ref}><span>{label}</span><button type="button" className={`settings-select ${open ? "open" : ""}`} onClick={() => setOpen((current) => !current)} aria-expanded={open}>{value}<ChevronDown size={14} /></button>{open && <div className="settings-select-options" role="menu">{options.map((option) => <button key={option} type="button" className={option === value ? "selected" : ""} onClick={() => { onChange(option); setOpen(false); }}>{option}{option === value && <Check size={13} />}</button>)}</div>}</div>;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchRef.current?.focus(); }
    };
    document.addEventListener("keydown", handleKey); return () => document.removeEventListener("keydown", handleKey);
  }, []);
  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => { setSettings((current) => ({ ...current, [key]: value })); setSaved(false); };
  const save = () => { setSaved(true); window.setTimeout(() => setSaved(false), 2400); };
  return <main className="dashboard-content settings-page">
    <header className="dashboard-header"><div className="dashboard-heading"><span className="dashboard-eyebrow"><i /> Store configuration</span><h1>Store Settings <span>✦</span></h1></div><DashboardHeaderActions /></header>
    <div className="settings-page-intro"><p>Manage your store identity, contact information, and regional preferences.</p><label className="settings-search"><Store size={15} /><input ref={searchRef} placeholder="Search settings..." /><kbd>⌘K</kbd></label></div>
    <section className="settings-layout">
      <div className="settings-form-column">
        <article className="settings-panel settings-general-panel"><div className="settings-panel-heading"><div><span className="settings-section-icon"><Store size={17} /></span><div><h2>General information</h2><p>Tell customers who you are.</p></div></div><span className="settings-complete"><Check size={13} /> 100% complete</span></div><div className="settings-logo-row"><div className="settings-logo-preview" style={{ background: `linear-gradient(135deg, ${settings.primary}, ${settings.accent})` }}>N</div><div><strong>Store logo</strong><small>PNG or SVG · 1:1 recommended</small></div><button type="button" className="settings-outline-button"><Upload size={14} /> Upload logo</button></div><div className="settings-field-grid"><label>Store name<input value={settings.name} onChange={(event) => update("name", event.target.value)} /></label><label>Store email<div className="settings-input-icon"><Mail size={14} /><input type="email" value={settings.email} onChange={(event) => update("email", event.target.value)} /></div></label><label className="settings-field-full">Store description<textarea value={settings.description} onChange={(event) => update("description", event.target.value)} rows={3} /></label><label>Phone number<div className="settings-input-icon"><Phone size={14} /><input value={settings.phone} onChange={(event) => update("phone", event.target.value)} /></div></label><SettingSelect label="Currency" value={settings.currency} options={["USD ($)", "EUR (€)", "GBP (£)"]} onChange={(value) => update("currency", value)} /><SettingSelect label="Timezone" value={settings.timezone} options={["(GMT-05:00) Eastern Time", "(GMT-08:00) Pacific Time", "(GMT+00:00) UTC"]} onChange={(value) => update("timezone", value)} /><SettingSelect label="Store language" value={settings.language} options={["English", "French", "Spanish"]} onChange={(value) => update("language", value)} /></div></article>
        <article className="settings-panel settings-brand-panel"><div className="settings-panel-heading"><div><span className="settings-section-icon"><Palette size={17} /></span><div><h2>Brand colors</h2><p>Shape the personality of your storefront.</p></div></div></div><div className="settings-color-grid">{(["primary", "accent", "highlight"] as const).map((key) => <label key={key} className="settings-color-field"><span>{key[0].toUpperCase() + key.slice(1)}</span><div><input type="color" value={settings[key]} onChange={(event) => update(key, event.target.value)} /><input value={settings[key]} onChange={(event) => update(key, event.target.value)} aria-label={`${key} hex value`} /></div></label>)}</div><div className="settings-brand-preview"><div className="settings-preview-copy"><span>LIVE PREVIEW</span><h3>{settings.name}</h3><p>Designed for your next chapter.</p></div><div className="settings-preview-orb" style={{ background: `linear-gradient(135deg, ${settings.primary}, ${settings.accent})` }} /></div></article>
        <article className="settings-panel"><div className="settings-panel-heading"><div><span className="settings-section-icon"><Store size={17} /></span><div><h2>Store preferences</h2><p>Choose how customers experience your store.</p></div></div></div><div className="settings-toggles">{[["accounts", "Enable customer accounts", "Let shoppers save details and view their orders."], ["outOfStock", "Show out-of-stock products", "Keep unavailable products visible in your catalog."], ["password", "Password-protect storefront", "Only invited customers can access the storefront."]].map(([key, title, detail]) => <button type="button" className="settings-toggle-row" key={key} onClick={() => update(key as keyof Settings, !settings[key as keyof Settings])}><span><strong>{title}</strong><small>{detail}</small></span><i className={settings[key as keyof Settings] ? "active" : ""}><b /></i></button>)}</div><button type="button" className={`settings-save-button ${saved ? "saved" : ""}`} onClick={save}>{saved ? <><Check size={15} /> Changes saved</> : <><Save size={15} /> Save changes</>}</button></article>
      </div>
      <aside className="settings-side-preview"><div className="settings-side-orbit"><div /><div /><strong>{settings.name.slice(0, 1).toUpperCase()}</strong></div><span className="settings-side-label">YOUR STOREFRONT</span><h2>{settings.name}</h2><p>{settings.description}</p><div className="settings-side-stats"><span><strong>216</strong><small>Products</small></span><span><strong>4.9</strong><small>Rating</small></span></div><div className="settings-side-note"><ImagePlus size={14} /> Your storefront is looking good.</div></aside>
    </section>
  </main>;
}
