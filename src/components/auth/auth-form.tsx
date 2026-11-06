"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, Store, User } from "lucide-react";
import { FormEvent, useState } from "react";

type AuthMode = "login" | "signup";
const demoEmail = "demo@shopkit.com";
const demoPassword = "shopkit123";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Your password must be at least 6 characters.");
      return;
    }

    if (isSignup && password !== String(formData.get("confirmPassword") ?? "")) {
      setError("Your passwords do not match.");
      return;
    }

    window.localStorage.setItem("shopkit-session", JSON.stringify({ email, signedInAt: new Date().toISOString() }));
    router.push("/dashboard");
  }

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="ShopKit product preview">
        <Link href="/login" className="auth-brand" aria-label="ShopKit home">
          shop<strong>kit</strong>
        </Link>
        <div className="auth-visual-copy">
          <span className="auth-kicker"><i /> Commerce, made clearer</span>
          <h1>Run your store with confidence.</h1>
          <p>One calm workspace for your orders, products, customers, and growth.</p>
        </div>
        <div className="auth-preview-card">
          <div className="auth-preview-top"><span>Store performance</span><strong>Last 30 days</strong></div>
          <div className="auth-preview-metric"><strong>$12,480</strong><span>↗ 18.6%</span></div>
          <div className="auth-preview-bars" aria-hidden="true">
            {[42, 64, 51, 76, 58, 88, 70, 96, 78, 100].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
          </div>
          <div className="auth-preview-footer"><span><i className="teal-dot" /> Revenue</span><span><i className="amber-dot" /> Orders</span></div>
        </div>
        <div className="auth-trust-row"><span><Check size={14} /> Built for busy teams</span><span><Check size={14} /> Clear by design</span></div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><Store size={18} /> shop<strong>kit</strong></div>
          <div className="auth-heading">
            <span className="auth-form-label">{isSignup ? "Create your workspace" : "Welcome back"}</span>
            <h2>{isSignup ? "Start selling smarter." : "Good to see you again."}</h2>
            <p>{isSignup ? "Set up your ShopKit workspace in less than a minute." : "Sign in to pick up where you left off."}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label>
                Full name
                <span className="auth-input"><User size={16} /><input name="name" autoComplete="name" placeholder="Ahmad Malik" required /></span>
              </label>
            )}
            <label>
              Work email
              <span className="auth-input"><Mail size={16} /><input name="email" type="email" autoComplete="email" defaultValue={isSignup ? undefined : demoEmail} placeholder="you@company.com" required /></span>
            </label>
            <label>
              Password
              <span className="auth-input"><LockKeyhole size={16} /><input name="password" type={showPassword ? "text" : "password"} autoComplete={isSignup ? "new-password" : "current-password"} defaultValue={isSignup ? undefined : demoPassword} placeholder="••••••••" required minLength={6} /><button type="button" className="auth-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>
            </label>
            {isSignup && (
              <label>
                Confirm password
                <span className="auth-input"><LockKeyhole size={16} /><input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" placeholder="••••••••" required minLength={6} /><button type="button" className="auth-password-toggle" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}>{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></span>
              </label>
            )}
            {!isSignup && <div className="auth-form-options"><label className="auth-checkbox"><input type="checkbox" /> <span>Remember me</span></label><button type="button" className="auth-text-button">Forgot password?</button></div>}
            {!isSignup && <p className="auth-demo-note">Demo access is prefilled for testing: <strong>{demoEmail}</strong> · <strong>{demoPassword}</strong></p>}
            {error && <p className="auth-error" role="alert">{error}</p>}
            <button type="submit" className="auth-submit">{isSignup ? "Create workspace" : "Sign in to ShopKit"} <ArrowRight size={16} /></button>
          </form>

          <p className="auth-switch">{isSignup ? "Already have an account?" : "New to ShopKit?"} <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create an account"}</Link></p>
          <p className="auth-legal">By continuing, you agree to ShopKit&apos;s Terms of Service and Privacy Policy.</p>
        </div>
      </section>
    </main>
  );
}
