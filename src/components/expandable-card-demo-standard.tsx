"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";

const defaultCards = [
  {
    icon: "☕",
    tone: "yellow",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85",
    title: "Everyday Ceramic Mug",
    description: "42 in stock · #SK-101",
    price: "$2,240",
    content: "A best-selling everyday essential with a warm ceramic finish and reliable repeat demand.",
  },
  {
    icon: "♧",
    tone: "cyan",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
    title: "Linen Market Tote",
    description: "18 in stock · #SK-102",
    price: "$1,860",
    content: "A lightweight market tote made from durable linen, popular with customers shopping the summer collection.",
  },
  {
    icon: "🪴",
    tone: "purple",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=85",
    title: "Studio Desk Planter",
    description: "6 in stock · #SK-103",
    price: "$1,420",
    content: "A compact desk planter that continues to perform well in the workspace and home office categories.",
  },
  {
    icon: "◒",
    tone: "green",
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=700&q=85",
    title: "Stoneware Bowl Set",
    description: "24 in stock · #SK-104",
    price: "$1,180",
    content: "A four-piece stoneware set with steady sales across the kitchen and dining collection.",
  },
] as const;

export type ExpandableCardItem = {
  icon: string;
  tone: "yellow" | "cyan" | "purple" | "green";
  image?: string;
  title: string;
  description: string;
  price: string;
  content: string;
};

type ExpandableCardDemoProps = {
  cards?: readonly ExpandableCardItem[];
  presentation?: "list" | "stack";
};

export default function ExpandableCardDemo({
  cards = defaultCards,
  presentation = "list",
}: ExpandableCardDemoProps) {
  const [active, setActive] = useState<ExpandableCardItem | null>(null);
  const [stack, setStack] = useState([...cards]);
  const lastWheelRef = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };

    document.body.style.overflow = active ? "hidden" : "";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const cycleStack = (direction: 1 | -1) => {
    setStack((current) => {
      const next = [...current];
      if (direction === 1) next.push(next.shift()!);
      else next.unshift(next.pop()!);
      return next;
    });
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

    if (Math.abs(delta) < 12) return;

    const now = Date.now();
    if (now - lastWheelRef.current < 450) {
      return;
    }

    lastWheelRef.current = now;
    cycleStack(delta > 0 ? 1 : -1);
  };

  return (
    <div className="expandable-products">
      <AnimatePresence>
        {active && (
          <motion.div
            className="expandable-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div className="expandable-modal-layer">
            <motion.div
              ref={ref}
              layoutId={`product-card-${active.title}-${id}`}
              className="expandable-modal"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
            >
              <button
                type="button"
                className="expandable-close"
                onClick={() => setActive(null)}
                aria-label="Close product details"
              >
                ×
              </button>
              <div className={`expandable-modal-icon product-icon ${active.tone}`}>
                {active.image ? (
                  <img src={active.image} alt="" />
                ) : (
                  active.icon
                )}
              </div>
              <div className="expandable-modal-body">
                <div>
                  <motion.h3 layoutId={`product-title-${active.title}-${id}`}>
                    {active.title}
                  </motion.h3>
                  <motion.p layoutId={`product-description-${active.title}-${id}`}>
                    {active.description}
                  </motion.p>
                </div>
                <strong>{active.price}</strong>
                <p className="expandable-copy">{active.content}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {presentation === "stack" ? (
        <div
          className="product-stack"
          onWheel={handleWheel}
          aria-label="Top selling products. Drag or scroll horizontally to browse."
        >
          <div className="product-stack-hint">Drag or scroll to browse <span>↔</span></div>
          {stack.map((card, index) => (
            <motion.button
              type="button"
              key={card.title}
              className="product-stack-card"
              style={{ zIndex: stack.length - index }}
              animate={{
                x: index * 12,
                y: index * 10,
                scale: 1 - index * 0.045,
                rotate: index === 0 ? 0 : (index % 2 ? 2 : -2),
              }}
              drag={index === 0 ? "x" : false}
              dragConstraints={{ left: -180, right: 180 }}
              dragElastic={0.65}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 45) cycleStack(info.offset.x < 0 ? 1 : -1);
              }}
              onClick={() => index === 0 && setActive(card)}
            >
              <span className="product-stack-image">
                {card.image ? <img src={card.image} alt="" draggable={false} /> : card.icon}
              </span>
              <span className="product-stack-info">
                <strong>{card.title}</strong>
                <small>{card.description}</small>
                <b>{card.price}</b>
              </span>
            </motion.button>
          ))}
        </div>
      ) : (
      <div className="expandable-card-list">
        {cards.map((card) => (
          <motion.button
            type="button"
            key={card.title}
            layoutId={`product-card-${card.title}-${id}`}
            className="expandable-card"
            onClick={() => setActive(card)}
          >
            <span className={`expandable-card-icon product-icon ${card.tone}`}>
              {card.icon}
            </span>
            <span className="expandable-card-copy">
              <motion.strong layoutId={`product-title-${card.title}-${id}`}>
                {card.title}
              </motion.strong>
              <motion.small layoutId={`product-description-${card.title}-${id}`}>
                {card.description}
              </motion.small>
            </span>
            <span className="expandable-card-price">{card.price}</span>
          </motion.button>
        ))}
      </div>
      )}
    </div>
  );
}
