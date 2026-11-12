"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Check,
  ChevronDown,
  Columns2,
  Copy,
  CreditCard,
  Eye,
  GripVertical,
  Heading,
  Image as ImageIcon,
  LayoutTemplate,
  Link2,
  MoreHorizontal,
  MousePointer2,
  Palette,
  PanelTop,
  Plus,
  Redo2,
  Save,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
  Type,
  Undo2,
  X,
} from "lucide-react";

type BlockType = "hero" | "text" | "image" | "products" | "payment" | "button" | "features" | "columns" | "footer";
type BlockWidth = "full" | "wide" | "half";
type BlockAnimation = "none" | "fade" | "rise" | "float";
type BlockLayout = "stack" | "grid" | "flex";

type StoreBlock = {
  id: string;
  type: BlockType;
  name: string;
  width: BlockWidth;
  title?: string;
  body?: string;
  buttonLabel?: string;
  background?: string;
  animation: BlockAnimation;
  layout: BlockLayout;
  widthPercent?: number;
};

const blockLibrary: { type: BlockType; label: string; description: string; icon: typeof Heading; tone: string }[] = [
  { type: "hero", label: "Hero section", description: "Make a first impression", icon: PanelTop, tone: "purple" },
  { type: "text", label: "Text block", description: "Tell your story", icon: Type, tone: "blue" },
  { type: "image", label: "Image", description: "Showcase your products", icon: ImageIcon, tone: "orange" },
  { type: "products", label: "Product grid", description: "Display your catalog", icon: ShoppingBag, tone: "green" },
  { type: "payment", label: "Payment methods", description: "Stripe, PayPal & more", icon: CreditCard, tone: "teal" },
  { type: "button", label: "Button", description: "Guide your customers", icon: Link2, tone: "pink" },
  { type: "features", label: "Features", description: "Highlight what matters", icon: Star, tone: "yellow" },
  { type: "columns", label: "Side-by-side", description: "Split content into columns", icon: Columns2, tone: "blue" },
  { type: "footer", label: "Footer", description: "Finish your storefront", icon: LayoutTemplate, tone: "slate" },
];

const initialBlocks: StoreBlock[] = [];

function createBlock(type: BlockType): StoreBlock {
  const defaults: Record<BlockType, Omit<StoreBlock, "id" | "type">> = {
    hero: { name: "Hero section", width: "full", title: "Your story starts here", body: "Introduce your brand with a beautiful first impression.", buttonLabel: "Shop collection", background: "lavender", animation: "fade", layout: "stack" },
    text: { name: "Text block", width: "wide", title: "A little about your brand", body: "Share what makes your products special with your customers.", animation: "none", layout: "stack" },
    image: { name: "Image", width: "wide", title: "Add an image", body: "Upload a product or lifestyle image to make this section yours.", background: "sand", animation: "none", layout: "stack" },
    products: { name: "Product grid", width: "full", title: "Featured products", body: "Your products will appear here once you add them.", animation: "rise", layout: "stack" },
    payment: { name: "Payment methods", width: "wide", title: "Secure checkout", body: "Choose the payment methods you want to accept.", animation: "none", layout: "stack" },
    button: { name: "Button", width: "half", title: "Shop now", buttonLabel: "Shop now", background: "ink", animation: "none", layout: "stack" },
    features: { name: "Features", width: "full", title: "Why customers choose you", body: "Highlight the details that make your store stand out.", animation: "rise", layout: "stack" },
    columns: { name: "Side-by-side section", width: "full", title: "Two things worth sharing", body: "Add text, images, or products in either column.", animation: "none", layout: "stack" },
    footer: { name: "Footer", width: "full", title: "Your store name", body: "Add links, social profiles, and contact details.", animation: "none", layout: "stack" },
  };
  return { id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, ...defaults[type] };
}

function blockPreview(block: StoreBlock) {
  if (block.type === "hero") return <><span className="preview-kicker">New collection</span><strong>{block.title}</strong><p>{block.body}</p><span className="preview-cta">{block.buttonLabel}</span></>;
  if (block.type === "text") return <><strong>{block.title}</strong><p>{block.body}</p></>;
  if (block.type === "image") return <><ImageIcon size={28} /><strong>{block.title}</strong><p>{block.body}</p></>;
  if (block.type === "products") return <><strong>{block.title}</strong><div className="product-placeholder-grid"><i /><i /><i /></div><p>{block.body}</p></>;
  if (block.type === "payment") return <><CreditCard size={24} /><strong>{block.title}</strong><p>{block.body}</p><div className="payment-logos"><span>stripe</span><span>PayPal</span><span>easypaisa</span><span>nayapay</span></div></>;
  if (block.type === "button") return <><span className="button-preview">{block.buttonLabel}</span></>;
  if (block.type === "features") return <><strong>{block.title}</strong><div className="feature-placeholder"><span>✦<small>Quality first</small></span><span>↗<small>Fast delivery</small></span><span>♡<small>Made for you</small></span></div></>;
  if (block.type === "columns") return <><div className="column-placeholder"><span><ImageIcon size={20} /><strong>Visual story</strong><small>Upload an image</small></span><span><Type size={20} /><strong>Tell your story</strong><small>Add a heading</small></span></div></>;
  return <><strong>{block.title}</strong><p>{block.body}</p><div className="footer-placeholder"><span>About</span><span>Contact</span><span>Instagram</span></div></>;
}

export default function StoreBuilder() {
  const [blocks, setBlocks] = useState<StoreBlock[]>(initialBlocks);
  const [pages, setPages] = useState(["Home page"]);
  const [pageBlocks, setPageBlocks] = useState<Record<string, StoreBlock[]>>({ "Home page": initialBlocks });
  const [currentPage, setCurrentPage] = useState("Home page");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"blocks" | "layers">("blocks");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [isPreview, setIsPreview] = useState(false);
  const [draggedType, setDraggedType] = useState<BlockType | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("shopkit-store-builder");
    if (stored) {
      try {
        const draft = JSON.parse(stored) as StoreBlock[] | { blocks?: StoreBlock[]; pages?: string[]; pageBlocks?: Record<string, StoreBlock[]> };
        if (Array.isArray(draft)) setBlocks(draft.map((block) => ({ ...block, layout: block.layout ?? "stack" })));
        else {
          setBlocks((draft.blocks ?? []).map((block) => ({ ...block, layout: block.layout ?? "stack" })));
          if (draft.pages?.length) setPages(draft.pages);
          if (draft.pageBlocks) setPageBlocks(Object.fromEntries(Object.entries(draft.pageBlocks).map(([page, pageBlocks]) => [page, pageBlocks.map((block) => ({ ...block, layout: block.layout ?? "stack" }))])));
          else if (draft.pages?.length) setPageBlocks(Object.fromEntries(draft.pages.map((page) => [page, page === "Home page" ? draft.blocks ?? [] : []])));
        }
      } catch { /* ignore malformed local drafts */ }
    }
  }, []);

  const selected = blocks.find((block) => block.id === selectedId) ?? null;
  const selectedIndex = selected ? blocks.findIndex((block) => block.id === selected.id) : -1;

  const addBlock = (type: BlockType) => {
    const next = createBlock(type);
    setBlocks((current) => {
      if (selected?.layout !== "stack" && selectedIndex >= 0) {
        return [...current.slice(0, selectedIndex + 1), next, ...current.slice(selectedIndex + 1)];
      }
      return [...current, next];
    });
    setSelectedId(next.id);
  };

  const updateSelected = (updates: Partial<StoreBlock>) => {
    if (!selectedId) return;
    setBlocks((current) => current.map((block) => block.id === selectedId ? { ...block, ...updates } : block));
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setBlocks((current) => current.filter((block) => block.id !== selectedId));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selected) return;
    const copyBlock = { ...selected, id: `${selected.type}-${Date.now()}`, name: `${selected.name} copy` };
    setBlocks((current) => [...current.slice(0, selectedIndex + 1), copyBlock, ...current.slice(selectedIndex + 1)]);
    setSelectedId(copyBlock.id);
  };

  const moveSelected = (direction: -1 | 1) => {
    if (selectedIndex < 0) return;
    const nextIndex = selectedIndex + direction;
    if (nextIndex < 0 || nextIndex >= blocks.length) return;
    const nextBlocks = [...blocks];
    [nextBlocks[selectedIndex], nextBlocks[nextIndex]] = [nextBlocks[nextIndex], nextBlocks[selectedIndex]];
    setBlocks(nextBlocks);
  };

  const saveDraft = () => {
    window.localStorage.setItem("shopkit-store-builder", JSON.stringify({ blocks, pages, pageBlocks: { ...pageBlocks, [currentPage]: blocks } }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const addPage = () => {
    setPageBlocks((current) => ({ ...current, [currentPage]: blocks }));
    const pageName = `Page ${pages.length}`;
    setPages((current) => [...current, pageName]);
    setPageBlocks((current) => ({ ...current, [pageName]: [] }));
    setCurrentPage(pageName);
    setBlocks([]);
    setSelectedId(null);
  };

  const switchPage = (page: string) => {
    setPageBlocks((current) => ({ ...current, [currentPage]: blocks }));
    setBlocks((pageBlocks[page] ?? []).map((block) => ({ ...block, layout: block.layout ?? "stack" })));
    setCurrentPage(page);
    setSelectedId(null);
  };

  const dropAt = (index: number) => {
    if (draggedType) {
      const next = createBlock(draggedType);
      setBlocks((current) => [...current.slice(0, index), next, ...current.slice(index)]);
      setSelectedId(next.id);
    } else if (draggedId) {
      setBlocks((current) => {
        const from = current.findIndex((block) => block.id === draggedId);
        if (from < 0) return current;
        const next = [...current];
        const [moved] = next.splice(from, 1);
        const target = from < index ? index - 1 : index;
        next.splice(target, 0, moved);
        return next;
      });
    }
    setDraggedType(null);
    setDraggedId(null);
  };

  const resizeSelected = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (!selectedId) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = selected?.widthPercent ?? (selected?.width === "full" ? 100 : selected?.width === "wide" ? 82 : 54);
    const canvas = event.currentTarget.closest(".store-canvas");
    if (!canvas) return;
    const canvasWidth = canvas.getBoundingClientRect().width;
    const move = (moveEvent: PointerEvent) => {
      const nextWidth = Math.min(100, Math.max(35, startWidth + ((moveEvent.clientX - startX) / canvasWidth) * 100));
      updateSelected({ widthPercent: Math.round(nextWidth) });
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };

  const visibleLibrary = useMemo(() => activeTab === "blocks" ? blockLibrary : blocks.map((block) => ({
    type: block.type,
    label: block.name,
    description: "Added to your page",
    icon: blockLibrary.find((item) => item.type === block.type)?.icon ?? LayoutTemplate,
    tone: blockLibrary.find((item) => item.type === block.type)?.tone ?? "slate",
  })), [activeTab, blocks]);

  const blockGroups = useMemo(() => {
    const groups: { layout: BlockLayout; blocks: StoreBlock[]; startIndex: number }[] = [];
    blocks.forEach((block, index) => {
      const layout = block.layout ?? "stack";
      const previous = groups[groups.length - 1];
      if (previous?.layout === layout) previous.blocks.push(block);
      else groups.push({ layout, blocks: [block], startIndex: index });
    });
    return groups;
  }, [blocks]);

  const handleCanvasDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dropAt(blocks.length);
  };

  useEffect(() => {
    setPageBlocks((current) => ({ ...current, [currentPage]: blocks }));
  }, [blocks, currentPage]);

  return (
    <main className="store-builder">
      <header className="builder-header">
        <div className="builder-title">
          <div className="builder-back"><ArrowLeft size={15} /></div>
          <div><span className="dashboard-eyebrow"><i /> Store editor</span><h1>Build your storefront <span>✦</span></h1></div>
        </div>
        <div className="builder-actions">
          <span className="draft-status"><i /> Draft saved</span>
          <button type="button" className="builder-icon-button" onClick={() => setIsPreview((value) => !value)}><Eye size={16} /> {isPreview ? "Edit" : "Preview"}</button>
          <button type="button" className="builder-save" onClick={saveDraft}>{saved ? <Check size={15} /> : <Save size={15} />} {saved ? "Saved" : "Save draft"}</button>
          <button type="button" className="builder-more" aria-label="More options"><MoreHorizontal size={18} /></button>
        </div>
      </header>

      <div className="builder-toolbar">
      <div className="toolbar-breadcrumb"><span>Northstar Goods</span><ChevronDown size={14} /><b>/</b><strong>{currentPage}</strong><ChevronDown size={14} /><button type="button" className="page-add-button" onClick={addPage}><Plus size={12} /> New page</button></div>
        <div className="builder-devices"><span className="layout-help">Set layout per block in the inspector</span><button className={device === "desktop" ? "active" : ""} onClick={() => setDevice("desktop")} aria-label="Desktop view"><PanelTop size={15} /></button><button className={device === "mobile" ? "active" : ""} onClick={() => setDevice("mobile")} aria-label="Mobile view"><Smartphone size={15} /></button></div>
        <div className="toolbar-history"><button aria-label="Undo"><Undo2 size={15} /></button><button aria-label="Redo"><Redo2 size={15} /></button><span /></div>
      </div>

      <div className="builder-workspace">
        <aside className="builder-library">
          <div className="library-heading"><div><p className="muted-title">Add to page</p><h2>Elements</h2></div><button aria-label="Close library"><X size={15} /></button></div>
          <div className="library-tabs"><button className={activeTab === "blocks" ? "active" : ""} onClick={() => setActiveTab("blocks")}>Blocks</button><button className={activeTab === "layers" ? "active" : ""} onClick={() => setActiveTab("layers")}>Layers {blocks.length > 0 && <em>{blocks.length}</em>}</button></div>
          {activeTab === "blocks" && <div className="library-hint"><MousePointer2 size={14} /><span>Drag an element onto the canvas or click to add it.</span></div>}
          <div className="library-list">
            {visibleLibrary.map((item, index) => {
              const Icon = item.icon;
              return <button type="button" className="library-item" key={`${item.type}-${index}`} draggable={activeTab === "blocks"} onDragStart={() => setDraggedType(item.type)} onClick={() => activeTab === "blocks" && addBlock(item.type)}><span className={`library-item-icon ${item.tone}`}><Icon size={17} /></span><span><strong>{item.label}</strong><small>{item.description}</small></span>{activeTab === "blocks" && <Plus size={14} />}</button>;
            })}
          </div>
          {activeTab === "blocks" && <div className="library-tip"><Sparkles size={15} /><span><b>Tip:</b> You can customize every element after adding it.</span></div>}
        </aside>

        <section className="builder-canvas-area">
          <div className="canvas-meta"><span><span className="canvas-live-dot" /> Editing <b>Home page</b></span><span>Autosaved just now</span></div>
          <div className={`store-canvas ${device === "mobile" ? "mobile" : ""} ${isPreview ? "preview-mode" : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={handleCanvasDrop}>
            <div className="canvas-sitebar"><strong>northstar<span>.</span></strong><div><span>Shop</span><span>Our story</span><span>Journal</span><b><ShoppingBag size={15} /> <i>0</i></b></div></div>
            {blocks.length === 0 ? <div className="canvas-empty"><div className="empty-illustration"><Plus size={22} /><div /><div /><div /></div><h2>Start with a blank canvas</h2><p>Drag any element from the left panel<br />or choose one to start designing.</p><button type="button" onClick={() => addBlock("hero")}><Plus size={15} /> Add your first section</button></div> : <div className="canvas-blocks"><div className="canvas-drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); dropAt(0); }}>Drop here to place at the top</div>{blockGroups.map((group) => <div className={`canvas-layout-group layout-${group.layout}`} key={`${group.layout}-${group.startIndex}`}>{group.blocks.map((block, groupIndex) => { const index = group.startIndex + groupIndex; return <div key={block.id} className="canvas-block-slot"><div className={`canvas-block-wrap ${block.width} ${selectedId === block.id ? "selected" : ""}`} style={block.widthPercent ? { width: `${block.widthPercent}%` } : undefined} draggable={!isPreview} onDragStart={() => setDraggedId(block.id)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); event.stopPropagation(); dropAt(index + 1); }} onClick={() => !isPreview && setSelectedId(block.id)}><div className={`canvas-block block-${block.type} ${block.background ?? ""} animation-${block.animation}`}>{blockPreview(block)}{selectedId === block.id && !isPreview && <span className="resize-handle" onPointerDown={resizeSelected} title="Drag to resize" />}</div>{selectedId === block.id && !isPreview && <div className="block-selection-label"><GripVertical size={12} /> {block.name}<span>{block.widthPercent ?? (block.width === "full" ? 100 : block.width === "wide" ? 82 : 54)}%</span></div>}</div>{group.layout === "stack" && <div className="canvas-drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); event.stopPropagation(); dropAt(index + 1); }}>Drop here to place below</div>}</div>; })}</div>)}</div>}
          </div>
          <div className="canvas-footer"><span><ArrowLeft size={13} /> Scroll to explore your page <ArrowRight size={13} /></span><span>{blocks.length} {blocks.length === 1 ? "section" : "sections"}</span></div>
        </section>

        <aside className="builder-inspector">
          <div className="pages-panel"><div><p className="muted-title">Your pages</p><strong>{pages.length} {pages.length === 1 ? "page" : "pages"}</strong></div><button type="button" onClick={addPage}><Plus size={14} /> Add page</button><div className="page-list">{pages.map((page) => <button type="button" key={page} className={page === currentPage ? "active" : ""} onClick={() => switchPage(page)}><span>{page}</span><ChevronRight size={13} /></button>)}</div></div>
          {selected && !isPreview ? <><div className="inspector-heading"><div><p className="muted-title">Selected element</p><h2>{selected.name}</h2></div><button onClick={() => setSelectedId(null)} aria-label="Close inspector"><X size={15} /></button></div><div className="inspector-actions"><button onClick={duplicateSelected}><Copy size={14} /> Duplicate</button><button onClick={deleteSelected}><Trash2 size={14} /> Delete</button></div><div className="inspector-scroll"><label className="field-label">Element name<input value={selected.name} onChange={(event) => updateSelected({ name: event.target.value })} /></label>{(selected.title !== undefined) && <label className="field-label">Heading<input value={selected.title} onChange={(event) => updateSelected({ title: event.target.value })} /></label>}{(selected.body !== undefined) && <label className="field-label">Description<textarea value={selected.body} rows={3} onChange={(event) => updateSelected({ body: event.target.value })} /></label>}{(selected.buttonLabel !== undefined) && <label className="field-label">Button label<input value={selected.buttonLabel} onChange={(event) => updateSelected({ buttonLabel: event.target.value })} /></label>}<div className="inspector-section"><div className="inspector-section-title"><span><Palette size={14} /> Appearance</span><ChevronDown size={14} /></div>          <div className="width-options"><span>Width</span><div><button className={selected.width === "full" ? "active" : ""} onClick={() => updateSelected({ width: "full" })}>Full</button><button className={selected.width === "wide" ? "active" : ""} onClick={() => updateSelected({ width: "wide" })}>Wide</button><button className={selected.width === "half" ? "active" : ""} onClick={() => updateSelected({ width: "half" })}>Half</button></div></div><div className="layout-options"><span>Layout for this block</span><div><button className={selected.layout === "stack" ? "active" : ""} onClick={() => updateSelected({ layout: "stack" })}>Stack</button><button className={selected.layout === "grid" ? "active" : ""} onClick={() => updateSelected({ layout: "grid" })}>Grid</button><button className={selected.layout === "flex" ? "active" : ""} onClick={() => updateSelected({ layout: "flex" })}>Flex</button></div></div>          <div className="color-options"><span>Background</span><div><button className="color-swatch lavender" onClick={() => updateSelected({ background: "lavender" })} aria-label="Lavender background" /><button className="color-swatch sand" onClick={() => updateSelected({ background: "sand" })} aria-label="Sand background" /><button className="color-swatch ink" onClick={() => updateSelected({ background: "ink" })} aria-label="Dark background" /><button className="color-swatch white" onClick={() => updateSelected({ background: "white" })} aria-label="White background" /></div></div><div className="animation-options"><span>Entrance animation</span><div><button className={selected.animation === "none" ? "active" : ""} onClick={() => updateSelected({ animation: "none" })}>None</button><button className={selected.animation === "fade" ? "active" : ""} onClick={() => updateSelected({ animation: "fade" })}>Fade</button><button className={selected.animation === "rise" ? "active" : ""} onClick={() => updateSelected({ animation: "rise" })}>Rise</button><button className={selected.animation === "float" ? "active" : ""} onClick={() => updateSelected({ animation: "float" })}>Float</button></div></div></div><div className="inspector-section"><div className="inspector-section-title"><span><ArrowDown size={14} /> Position</span><ChevronDown size={14} /></div><div className="position-controls"><button onClick={() => moveSelected(-1)} disabled={selectedIndex <= 0}><ArrowLeft size={14} /> Move up</button><button onClick={() => moveSelected(1)} disabled={selectedIndex >= blocks.length - 1}><ArrowRight size={14} /> Move down</button></div></div></div></> : <div className="inspector-empty"><div className="inspector-empty-icon"><MousePointer2 size={18} /></div><h2>Select an element</h2><p>Click a section on the canvas to edit its content, style, and size.</p><div className="inspector-shortcuts"><span><kbd>⌘</kbd><b>+</b><kbd>D</kbd> Duplicate</span><span><kbd>⌫</kbd> Delete element</span></div></div>}
        </aside>
      </div>
    </main>
  );
}
