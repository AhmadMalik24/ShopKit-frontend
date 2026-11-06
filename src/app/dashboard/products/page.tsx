"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check, ChevronDown, Edit3, Grid2X2, ImagePlus, List, Plus, Search,
  SlidersHorizontal, Table2, X,
} from "lucide-react";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";

type ProductStatus = "Active" | "Low stock" | "Out of stock";
type Product = {
  sku: string; name: string; category: string; stock: number; price: string;
  status: ProductStatus; tone: "yellow" | "cyan" | "purple" | "green"; icon: string;
};
type ViewMode = "grid" | "list" | "table";

const initialProducts: Product[] = [
  { sku: "SKU-101", name: "Ceramic Mug", category: "Home", stock: 42, price: "$24.00", status: "Active", tone: "yellow", icon: "☕" },
  { sku: "SKU-102", name: "Leather Backpack", category: "Accessories", stock: 18, price: "$89.00", status: "Low stock", tone: "cyan", icon: "▣" },
  { sku: "SKU-103", name: "Wireless Earbuds", category: "Electronics", stock: 6, price: "$59.00", status: "Low stock", tone: "purple", icon: "◉" },
  { sku: "SKU-104", name: "Desk Lamp", category: "Home", stock: 24, price: "$49.00", status: "Active", tone: "green", icon: "◐" },
  { sku: "SKU-105", name: "Linen Market Tote", category: "Accessories", stock: 0, price: "$38.00", status: "Out of stock", tone: "cyan", icon: "♧" },
  { sku: "SKU-106", name: "Studio Desk Planter", category: "Home", stock: 6, price: "$32.00", status: "Low stock", tone: "purple", icon: "🪴" },
];
const categories = ["All categories", "Home", "Accessories", "Electronics"];
const statuses = ["All statuses", "Active", "Low stock", "Out of stock"];

function FilterMenu({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <div className="catalog-filter-menu" ref={menuRef}>
    <button type="button" className={`catalog-filter-button ${open ? "open" : ""}`} onClick={() => setOpen((current) => !current)} aria-expanded={open}>
      <span className="catalog-filter-label">{label}</span><strong>{value}</strong><ChevronDown size={14} />
    </button>
    {open && <div className="catalog-filter-options" role="menu">{options.map((option) => <button type="button" role="menuitem" className={option === value ? "selected" : ""} key={option} onClick={() => { onChange(option); setOpen(false); }}>{option}{option === value && <Check size={13} />}</button>)}</div>}
  </div>;
}

function ProductVisual({ product, compact = false, showStatus = true }: { product: Product; compact?: boolean; showStatus?: boolean }) {
  return <div className={`catalog-product-image ${product.tone} ${compact ? "compact" : ""}`}>
    <span>{product.icon}</span>
    {showStatus && <span className={`catalog-status ${product.status.toLowerCase().replace(" ", "-")}`}><i />{product.status}</span>}
  </div>;
}

function ProductDetails({ product, onOpen, onEdit }: { product: Product; onOpen: () => void; onEdit: () => void }) {
  return <article className="catalog-product-card" tabIndex={0} onClick={onOpen} onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(); }
  }}>
    <ProductVisual product={product} />
    <div className="catalog-product-details">
      <div><h3>{product.name}</h3><p>{product.sku} · {product.category}</p></div>
      <strong>{product.price}</strong>
      <div className="catalog-product-meta">
        <span className={`stock-copy ${product.stock <= 18 ? "stock-warning" : "stock-good"}`}>{product.stock} in stock</span>
        <button type="button" className="product-edit-link" onClick={(event) => { event.stopPropagation(); onEdit(); }}><Edit3 size={12} /> Edit</button>
      </div>
      <div className="stock-meter" aria-label={`${product.stock} units in stock`}><span style={{ width: `${Math.min(product.stock / 50 * 100, 100)}%` }} /></div>
    </div>
  </article>;
}

function ProductEditor({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (product: Product, isNew: boolean) => void }) {
  const [draft, setDraft] = useState<Product>(product ?? initialProducts[0]);
  useEffect(() => setDraft(product ?? initialProducts[0]), [product]);
  if (!product) return null;
  const update = (key: keyof Product, value: string | number) => setDraft((current) => ({ ...current, [key]: value }));
  return <div className="product-modal-layer" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
    <section className="product-editor-modal" role="dialog" aria-modal="true" aria-labelledby="product-editor-title">
      <div className="product-editor-header"><div><span className="dashboard-eyebrow"><i /> Product workspace</span><h2 id="product-editor-title">{product.sku === "NEW" ? "Add product" : "Edit product"}</h2><p>Create and update product information shown in your storefront.</p></div><button className="modal-close-button" type="button" onClick={onClose} aria-label="Close editor"><X size={18} /></button></div>
      <div className="product-editor-body">
        <div className="product-editor-main">
          <label>Product title<input value={draft.name} onChange={(event) => update("name", event.target.value)} /></label>
          <label>Description<textarea placeholder="Tell customers what makes this product special..." /></label>
          <div className="editor-two-col"><label>Price<input value={draft.price} onChange={(event) => update("price", event.target.value)} /></label><label>SKU<input value={draft.sku} onChange={(event) => update("sku", event.target.value)} /></label></div>
          <div className="editor-two-col"><label>Category<select value={draft.category} onChange={(event) => update("category", event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label>Stock quantity<input type="number" value={draft.stock} onChange={(event) => update("stock", Number(event.target.value))} /></label></div>
        </div>
        <aside className="product-editor-side"><div className={`editor-preview ${draft.tone}`}><span>{draft.icon}</span></div><button type="button" className="upload-image-button"><ImagePlus size={15} /> Upload image</button><div className="editor-status-card"><span>Visibility</span><strong><i /> {draft.status}</strong><small>Visible in your online store</small></div></aside>
      </div>
      <div className="product-editor-footer"><button type="button" className="editor-cancel-button" onClick={onClose}>Cancel</button><button type="button" className="add-product-button" onClick={() => onSave(draft, product.sku === "NEW")}><Check size={15} /> Save product</button></div>
    </section>
  </div>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [status, setStatus] = useState(statuses[0]);
  const [sort, setSort] = useState("Recent");
  const [view, setView] = useState<ViewMode>("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editorProduct, setEditorProduct] = useState<Product | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelectedProduct(null); setEditorProduct(null); }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const text = `${product.name} ${product.sku} ${product.category}`.toLowerCase();
      return text.includes(query.toLowerCase()) && (category === categories[0] || product.category === category) && (status === statuses[0] || product.status === status);
    });
    if (sort === "Price: high") return [...result].sort((a, b) => Number(b.price.replace(/\D/g, "")) - Number(a.price.replace(/\D/g, "")));
    if (sort === "Price: low") return [...result].sort((a, b) => Number(a.price.replace(/\D/g, "")) - Number(b.price.replace(/\D/g, "")));
    return result;
  }, [category, products, query, sort, status]);

  const saveProduct = (product: Product, isNew: boolean) => {
    setProducts((current) => isNew ? [...current, { ...product, sku: `SKU-${101 + current.length}` }] : current.map((item) => item.sku === product.sku ? product : item));
    setEditorProduct(null);
    setSelectedProduct(null);
  };
  const openNewProduct = () => setEditorProduct({ sku: "NEW", name: "New product", category: "Home", stock: 0, price: "$0.00", status: "Active", tone: "purple", icon: "✦" });

  return <main className="dashboard-content products-page">
    <header className="dashboard-header"><div className="dashboard-heading"><span className="dashboard-eyebrow"><i /> Catalog workspace</span><h1>Products <span>✦</span></h1></div><div className="products-page-actions"><button type="button" className="products-filter-button"><SlidersHorizontal size={15} /> Manage view</button><DashboardHeaderActions /></div></header>
    <div className="products-page-intro"><p>Manage your catalog, inventory, variants, and product visibility.</p><button type="button" className="add-product-button" onClick={openNewProduct}><Plus size={16} /> Add product</button></div>
    <section className="product-stat-grid" aria-label="Product summary"><div className="product-stat-card" onClick={() => setStatus("All statuses")}><span>Total products</span><strong>248</strong><small>↗ 12% this month</small></div><div className="product-stat-card" onClick={() => setStatus("Active")}><span>Active products</span><strong>216</strong><small className="stat-good">87% of catalog</small></div><div className="product-stat-card" onClick={() => setStatus("Low stock")}><span>Low stock</span><strong>12</strong><small className="stat-warning">Restock soon</small></div><div className="product-stat-card" onClick={() => setStatus("Out of stock")}><span>Out of stock</span><strong>4</strong><small className="stat-warning">Action required</small></div></section>
    <section className="catalog-panel">
      <div className="catalog-heading"><div><h2>Product catalog</h2><p>{filteredProducts.length} products shown · Click any item for details</p></div><div className="catalog-views"><button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Grid view"><Grid2X2 size={14} /></button><button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="List view"><List size={15} /></button><button className={view === "table" ? "active" : ""} onClick={() => setView("table")} aria-label="Table view"><Table2 size={14} /></button></div></div>
      <div className="catalog-toolbar"><label className="catalog-search"><Search size={16} /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, SKU, category..." /><kbd>⌘K</kbd>{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={13} /></button>}</label><FilterMenu label="Category" value={category} options={categories} onChange={setCategory} /><FilterMenu label="Status" value={status} options={statuses} onChange={setStatus} /><FilterMenu label="Sort" value={sort} options={["Recent", "Price: high", "Price: low"]} onChange={setSort} /></div>
      {view === "grid" && <div className="catalog-grid">{filteredProducts.map((product) => <ProductDetails key={product.sku} product={product} onOpen={() => setSelectedProduct(product)} onEdit={() => setEditorProduct(product)} />)}</div>}
      {view === "list" && <div className="catalog-list">{filteredProducts.map((product) => <button className="catalog-list-row" key={product.sku} onClick={() => setSelectedProduct(product)}><ProductVisual product={product} compact /><span><strong>{product.name}</strong><small>{product.sku} · {product.category}</small></span><b>{product.price}</b><em>{product.stock} in stock</em><Edit3 size={14} /></button>)}</div>}
      {view === "table" && <div className="catalog-table-wrap"><table className="catalog-table"><thead><tr><th>Product</th><th>Category</th><th>Status</th><th>Stock</th><th>Price</th><th /></tr></thead><tbody>{filteredProducts.map((product) => <tr key={product.sku} onClick={() => setSelectedProduct(product)}><td><strong>{product.name}</strong><small>{product.sku}</small></td><td>{product.category}</td><td><span className={`table-status ${product.status.toLowerCase().replace(" ", "-")}`}>{product.status}</span></td><td>{product.stock}</td><td>{product.price}</td><td><Edit3 size={14} /></td></tr>)}</tbody></table></div>}
      {filteredProducts.length === 0 && <p className="catalog-empty">No products match your filters.</p>}
    </section>
    {selectedProduct && <div className="product-modal-layer" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelectedProduct(null); }}><section className="product-details-modal" role="dialog" aria-modal="true" aria-labelledby="product-details-title"><button type="button" className="modal-close-button" onClick={() => setSelectedProduct(null)} aria-label="Close details"><X size={18} /></button><ProductVisual product={selectedProduct} showStatus={false} /><span className={`details-status-pill ${selectedProduct.status.toLowerCase().replace(" ", "-")}`}><i />{selectedProduct.status}</span><div className="details-modal-content"><div><span className="dashboard-eyebrow"><i /> Product details</span><h2 id="product-details-title">{selectedProduct.name}</h2><p>{selectedProduct.sku} · {selectedProduct.category}</p></div><strong>{selectedProduct.price}</strong><div className="details-facts"><span><small>Inventory</small><b>{selectedProduct.stock} units</b><em>{selectedProduct.stock === 0 ? "Needs restock" : selectedProduct.stock <= 18 ? "Running low" : "Healthy level"}</em></span><span><small>Status</small><b>{selectedProduct.status}</b><em>Store visibility</em></span><span><small>Channel</small><b>Online store</b><em>Published now</em></span></div><button type="button" className="add-product-button" onClick={() => { setEditorProduct(selectedProduct); setSelectedProduct(null); }}><Edit3 size={15} /> Edit product</button></div></section></div>}
    <ProductEditor product={editorProduct} onClose={() => setEditorProduct(null)} onSave={saveProduct} />
  </main>;
}
