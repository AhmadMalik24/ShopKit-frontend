"use client";

import { useState } from "react";
import ExpandableCardDemo from "@/components/expandable-card-demo-standard";
import type { ExpandableCardItem } from "@/components/expandable-card-demo-standard";
import { DemographicsPieChart } from "@/components/dashboard/demographics-pie-chart";
import { RevenueAreaChart } from "@/components/dashboard/revenue-area-chart";
import { OrdersBarChart } from "@/components/dashboard/orders-bar-chart";
import { Calendar } from "@/components/ui/calendar";
import { DashboardHeaderActions } from "@/components/dashboard/dashboard-header-actions";
import { ArrowUpRight, CreditCard, PackageCheck, ShoppingBag, Users } from "lucide-react";

const topCustomers: readonly ExpandableCardItem[] = [
  {
    icon: "👩",
    tone: "purple",
    title: "Olivia Carter",
    description: "24 orders · Returning customer",
    price: "$4,820",
    content: "A loyal customer with frequent purchases across the home and lifestyle collections.",
  },
  {
    icon: "👨",
    tone: "cyan",
    title: "Noah Williams",
    description: "18 orders · Returning customer",
    price: "$3,640",
    content: "A high-value customer who regularly shops new product launches and seasonal collections.",
  },
  {
    icon: "👩",
    tone: "yellow",
    title: "Emma Johnson",
    description: "15 orders · Returning customer",
    price: "$2,980",
    content: "An engaged customer with consistent repeat orders and strong average basket value.",
  },
  {
    icon: "👨",
    tone: "green",
    title: "Liam Brown",
    description: "12 orders · Returning customer",
    price: "$2,410",
    content: "A dependable repeat customer with steady activity across the core catalog.",
  },
];

export default function DashboardPage() {
  const [range, setRange] = useState("Month");
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 11));

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-heading">
          <span className="dashboard-eyebrow"><i /> Live workspace</span>
          <h1>Dashboard Overview <span>✦</span></h1>
        </div>
        <DashboardHeaderActions />
      </header>

      <section className="overview-stats" aria-label="Store performance">
        <article className="overview-stat">
          <span className="overview-stat-icon blue"><CreditCard size={17} /></span>
          <span><small>Net revenue</small><strong>$12,480</strong><em><ArrowUpRight size={12} /> 18.6%</em></span>
        </article>
        <article className="overview-stat">
          <span className="overview-stat-icon teal"><ShoppingBag size={17} /></span>
          <span><small>Total orders</small><strong>184</strong><em><ArrowUpRight size={12} /> 12.4%</em></span>
        </article>
        <article className="overview-stat">
          <span className="overview-stat-icon amber"><PackageCheck size={17} /></span>
          <span><small>Fulfillment rate</small><strong>96.8%</strong><em className="stat-neutral">On track</em></span>
        </article>
        <article className="overview-stat">
          <span className="overview-stat-icon rose"><Users size={17} /></span>
          <span><small>Active customers</small><strong>2,840</strong><em><ArrowUpRight size={12} /> 8.2%</em></span>
        </article>
      </section>

      <div className="dashboard-grid">
        <section className="panel revenue-panel">
          <div className="panel-title-row">
            <div>
              <p className="muted-title">Total Revenue</p>
              <strong className="metric">$12,480.00</strong>
              <span className="growth-badge">↑ 18.6%</span>
              <p className="subtle-copy">vs. previous 30 days period</p>
            </div>
            <div className="range-toggle" role="group" aria-label="Revenue range">
              {["Week", "Month", "Year"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={range === item ? "selected" : ""}
                  onClick={() => setRange(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <RevenueAreaChart range={range} />
        </section>

        <section className="panel calendar-panel">
          <Calendar
            mode="single"
            defaultMonth={date}
            selected={date}
            onSelect={setDate}
            disabled={{ before: new Date(2025, 5, 11) }}
            className="dashboard-calendar"
          />
          <div className="calendar-summary">
            <span>Orders</span><strong>184</strong>
            <span>Revenue</span><strong>$6,240</strong>
          </div>
        </section>

        <section className="panel orders-panel">
          <h2>Orders Breakdown</h2>
          <strong className="orders-number">184</strong>
          <p className="growth-copy">↑ +12.4% vs last week</p>
          <OrdersBarChart />
        </section>

        <section className="panel products-panel">
          <div className="section-heading">
            <h2>Top Selling Products</h2>
            <button type="button">View all <span>→</span></button>
          </div>
          <ExpandableCardDemo presentation="stack" />
        </section>

        <section className="panel demographics-panel">
          <h2>Demographics</h2>
          <DemographicsPieChart />
        </section>

        <section className="panel customers-panel">
          <div className="section-heading">
            <h2>Top Customers</h2>
            <button type="button">View all <span>→</span></button>
          </div>
          <ExpandableCardDemo cards={topCustomers} />
        </section>

      </div>
    </main>
  );
}
