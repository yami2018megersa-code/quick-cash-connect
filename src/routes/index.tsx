import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import {
  Calculator,
  MessageCircle,
  ShieldCheck,
  Zap,
  FileCheck2,
  Wallet,
  CheckCircle2,
  Star,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
} from "lucide-react";

const BUSINESS_NAME = "Kholwa Finance";
const NCRCP = "NCRCP12345";
const WHATSAPP_NUMBER = "27821234567"; // international format, no +
const CONTACT_EMAIL = "hello@kholwafinance.co.za";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BUSINESS_NAME} | Fast Personal Loans & Financial Services` },
      {
        name: "description",
        content:
          "Apply for quick personal loans up to R20,000. Mobile-first, transparent terms, fully POPIA compliant, and fast WhatsApp processing.",
      },
      { property: "og:title", content: `${BUSINESS_NAME} | Fast Personal Loans in South Africa` },
      {
        property: "og:description",
        content:
          "Fast, transparent personal loans up to R20,000. NCR authorised, POPIA compliant, WhatsApp-first approvals.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${BUSINESS_NAME} | Fast Personal Loans` },
      {
        name: "twitter:description",
        content: "Personal loans up to R20,000. NCR authorised. Apply via WhatsApp in minutes.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LocalBusiness",
              name: BUSINESS_NAME,
              image: "/favicon.ico",
              telephone: "+27821234567",
              email: CONTACT_EMAIL,
              address: {
                "@type": "PostalAddress",
                streetAddress: "1 Sandton Drive",
                addressLocality: "Johannesburg",
                addressRegion: "Gauteng",
                postalCode: "2196",
                addressCountry: "ZA",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "1247",
              },
            },
            {
              "@type": "FinancialProduct",
              name: "Personal Loan",
              provider: { "@type": "Organization", name: BUSINESS_NAME },
              description:
                "Short-term personal loans from R1,000 to R20,000 with terms of 1 to 6 months.",
              feesAndCommissionsSpecification:
                "Interest, initiation and service fees per National Credit Act (NCA) regulations.",
            },
          ],
        }),
      },
    ],
  }),
  component: Landing,
});

function estimateLoan(amount: number, months: number) {
  // Indicative NCA-style: monthly interest ~5%, initiation fee capped, monthly service fee
  const monthlyRate = 0.05;
  const initiationFee = Math.min(1207.5, 165 + Math.max(0, amount - 1000) * 0.1);
  const serviceFee = 69 * months;
  const interest = amount * monthlyRate * months;
  const total = amount + interest + initiationFee + serviceFee;
  const monthly = total / months;
  return { monthly, total, interest, initiationFee, serviceFee };
}

const ZAR = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);

function Landing() {
  const [amount, setAmount] = useState(5000);
  const [months, setMonths] = useState(3);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [employment, setEmployment] = useState("Employed");
  const [consent, setConsent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [legal, setLegal] = useState<null | "privacy" | "terms" | "ncr">(null);

  const est = useMemo(() => estimateLoan(amount, months), [amount, months]);

  const buildWhatsAppUrl = (message: string) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const applyMessage = `Hi ${BUSINESS_NAME}, I'd like to apply for a personal loan of ${ZAR(amount)} over ${months} month${months > 1 ? "s" : ""}. Estimated monthly repayment: ${ZAR(est.monthly)}.`;

  const submitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !name || !phone) return;
    const msg = `New loan enquiry%0A%0AName: ${name}%0APhone: ${phone}%0AEmployment: ${employment}%0AAmount: ${ZAR(amount)}%0ATerm: ${months} month${months > 1 ? "s" : ""}%0AEst. monthly: ${ZAR(est.monthly)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="fixed top-0 z-50 w-full glass">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#home" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg gradient-gold text-primary-foreground font-bold">
              K
            </div>
            <span className="font-display text-lg font-bold tracking-tight">{BUSINESS_NAME}</span>
          </a>
          <nav aria-label="Primary" className="hidden gap-8 md:flex">
            {[
              ["How it works", "#how"],
              ["Calculator", "#calculator"],
              ["Eligibility", "#eligibility"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="text-sm text-muted-foreground transition hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>
          <a
            href={buildWhatsAppUrl(applyMessage)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full gradient-gold px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
          >
            Apply now
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
          <img
            src={heroBg}
            alt="Abstract gold light streaks representing fast financial approvals"
            width={1920}
            height={1080}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                NCR Authorised Credit Provider · {NCRCP}
              </div>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Fast & transparent <span className="text-gradient-gold">personal loans</span> in South Africa
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                Borrow up to R20,000 with clear terms. Apply in minutes on WhatsApp — no branch visits, no paperwork queues.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center gap-2 rounded-full gradient-gold px-6 py-3 font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition hover:opacity-90"
                >
                  <Calculator className="h-4 w-4" /> Get your estimate
                </a>
                <a
                  href={buildWhatsAppUrl(applyMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-3 font-semibold transition hover:bg-surface-elevated"
                >
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                {[
                  ["4.8★", "1,200+ reviews"],
                  ["<10 min", "Approval chat"],
                  ["100%", "POPIA compliant"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-xl border border-border bg-surface/60 p-3">
                    <div className="font-display text-xl font-bold text-primary">{v}</div>
                    <div className="text-xs text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CALCULATOR */}
            <div id="calculator" className="relative">
              <div className="glass rounded-2xl p-6 shadow-2xl shadow-black/40 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold">Loan estimator</h2>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    Indicative
                  </span>
                </div>

                <div className="space-y-6">
                  <SliderField
                    label="Loan amount"
                    value={ZAR(amount)}
                    min={1000}
                    max={20000}
                    step={500}
                    val={amount}
                    onChange={setAmount}
                  />
                  <SliderField
                    label="Repayment period"
                    value={`${months} month${months > 1 ? "s" : ""}`}
                    min={1}
                    max={6}
                    step={1}
                    val={months}
                    onChange={setMonths}
                  />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Stat label="Monthly installment" value={ZAR(est.monthly)} highlight />
                  <Stat label="Total repayment" value={ZAR(est.total)} />
                </div>

                <a
                  href={buildWhatsAppUrl(applyMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl gradient-gold px-5 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
                >
                  <MessageCircle className="h-5 w-5" /> Apply Now via WhatsApp
                </a>
                <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
                  Estimates shown are indicative only. Final interest rates and terms are subject to formal credit
                  assessment under the National Credit Act (NCA).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="border-t border-border bg-surface/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                From estimate to payout in 3 simple steps
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { icon: Calculator, title: "Calculate & inquire", desc: "Use the loan estimator, then submit your details or open WhatsApp." },
                { icon: FileCheck2, title: "Quick chat & verify", desc: "Our team confirms your ID, income and bank details on WhatsApp." },
                { icon: Wallet, title: "Fast payout", desc: "Once approved, funds are paid into your bank account — same day possible." },
              ].map((s, i) => (
                <article key={s.title} className="relative rounded-2xl border border-border bg-surface p-6">
                  <div className="absolute -top-3 left-6 rounded-full gradient-gold px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                    Step {i + 1}
                  </div>
                  <s.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ELIGIBILITY + LEAD FORM */}
        <section id="eligibility" className="py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Qualification</span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Do you qualify?</h2>
              <p className="mt-3 text-muted-foreground">
                Meet the basic criteria below and you're ready to apply. Approval is subject to credit assessment.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Valid South African ID",
                  "18 years or older",
                  "Verifiable monthly income",
                  "Active South African bank account",
                  "Not currently under debt review",
                ].map((c) => (
                  <li key={c} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* LEAD FORM */}
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold">Start your application</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                4 quick fields — we'll continue on WhatsApp.
              </p>
              <form onSubmit={submitLead} className="mt-6 space-y-4" action="https://formspree.io/f/your-endpoint" method="POST">
                <Field label="Full name">
                  <input
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
                    placeholder="Thabo Nkosi"
                  />
                </Field>
                <Field label="Mobile / WhatsApp number">
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
                    placeholder="082 123 4567"
                  />
                </Field>
                <Field label="Employment status">
                  <select
                    name="employment"
                    value={employment}
                    onChange={(e) => setEmployment(e.target.value)}
                    className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    <option>Employed</option>
                    <option>Self-Employed</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Requested amount">
                  <input
                    readOnly
                    name="amount"
                    value={ZAR(amount)}
                    className="w-full rounded-lg border border-input bg-surface/50 px-4 py-3 text-sm text-muted-foreground"
                  />
                  <input type="hidden" name="term_months" value={months} />
                </Field>

                <label className="flex items-start gap-3 rounded-lg border border-border bg-surface/50 p-3 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 accent-[oklch(0.82_0.16_82)]"
                  />
                  <span>
                    I consent to the collection and processing of my personal information for the purpose of assessing
                    this credit inquiry in accordance with POPIA.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!consent}
                  className="flex w-full items-center justify-center gap-2 rounded-xl gradient-gold px-5 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MessageCircle className="h-5 w-5" /> Continue on WhatsApp
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="border-t border-border bg-surface/30 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Reviews</span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Trusted by thousands of South Africans</h2>
              <div className="mt-3 flex items-center justify-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">4.8 average · 1,247 reviews</span>
              </div>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { n: "Lerato M.", c: "Cape Town", q: "Applied on WhatsApp during lunch, money in my account before I got home. Really transparent about fees." },
                { n: "Sipho K.", c: "Durban", q: "No branch visits, no queues. Team explained everything clearly. Would use again." },
                { n: "Naledi P.", c: "Pretoria", q: "The calculator showed exactly what I'd pay back — no surprises. Repaid early with no drama." },
              ].map((t) => (
                <figure key={t.n} className="rounded-2xl border border-border bg-surface p-6">
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-sm text-foreground/90">"{t.q}"</blockquote>
                  <figcaption className="mt-4 text-xs text-muted-foreground">
                    {t.n} · {t.c}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ + CONTACT */}
        <section id="faq" className="py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Questions, answered</h2>
              <div className="mt-8 space-y-3">
                {FAQS.map((f, i) => (
                  <div key={f.q} className="rounded-xl border border-border bg-surface">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="flex w-full items-center justify-between gap-4 p-4 text-left"
                    >
                      <span className="font-medium">{f.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-muted-foreground transition ${openFaq === i ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openFaq === i && <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Get in touch</h2>
              <div className="mt-8 space-y-3">
                <ContactRow icon={MessageCircle} label="WhatsApp" value="+27 82 123 4567" href={`https://wa.me/${WHATSAPP_NUMBER}`} />
                <ContactRow icon={Phone} label="Call us" value="+27 82 123 4567" href="tel:+27821234567" />
                <ContactRow icon={Mail} label="Email" value={CONTACT_EMAIL} href={`mailto:${CONTACT_EMAIL}`} />
                <ContactRow icon={MapPin} label="Office" value="1 Sandton Drive, Johannesburg, 2196" />
              </div>
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <Zap className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <div className="font-semibold">Fastest response: WhatsApp</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Our team typically replies within minutes during business hours (Mon–Fri, 08:00–18:00).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-surface/50 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg gradient-gold text-primary-foreground font-bold">K</div>
              <span className="font-display font-bold">{BUSINESS_NAME}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              1 Sandton Drive, Johannesburg, 2196, South Africa.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {BUSINESS_NAME} is an Authorised Credit Provider ({NCRCP}).
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => setLegal("privacy")} className="hover:text-foreground">Privacy Policy & POPIA Notice</button></li>
              <li><button onClick={() => setLegal("terms")} className="hover:text-foreground">Terms of Use</button></li>
              <li><button onClick={() => setLegal("ncr")} className="hover:text-foreground">Responsible Lending & NCR Disclosures</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Responsible lending</h4>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Credit is granted subject to affordability assessment as per the National Credit Act 34 of 2005. Late or
              missed payments may negatively impact your credit record. Borrow only what you can afford to repay.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-border px-4 pt-6 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--whatsapp)] text-white shadow-2xl shadow-black/40 transition hover:scale-105"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* Legal modal */}
      {legal && (
        <div
          onClick={() => setLegal(null)}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-surface p-6 sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-xl font-bold">
                {legal === "privacy" && "Privacy Policy & POPIA Notice"}
                {legal === "terms" && "Terms of Use"}
                {legal === "ncr" && "Responsible Lending & NCR Disclosures"}
              </h3>
              <button onClick={() => setLegal(null)} className="rounded-full border border-border px-3 py-1 text-sm">
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {legal === "privacy" && (
                <>
                  <p>
                    {BUSINESS_NAME} collects your personal information solely for the purpose of assessing credit
                    applications and providing financial services, in accordance with the Protection of Personal
                    Information Act (POPIA).
                  </p>
                  <p>
                    We do not sell your data. You may request access, correction or deletion of your information at any
                    time by contacting {CONTACT_EMAIL}.
                  </p>
                </>
              )}
              {legal === "terms" && (
                <>
                  <p>
                    By using this website you agree to our terms. All loan offers are subject to affordability
                    assessment and final approval under the National Credit Act.
                  </p>
                  <p>Calculator estimates are indicative and do not constitute a credit offer.</p>
                </>
              )}
              {legal === "ncr" && (
                <>
                  <p>
                    {BUSINESS_NAME} is a registered Credit Provider with the National Credit Regulator (NCR):{" "}
                    <strong className="text-foreground">{NCRCP}</strong>.
                  </p>
                  <p>
                    Interest rates, initiation and service fees are charged within the limits prescribed by the NCA.
                    Complaints may be lodged with the NCR at www.ncr.org.za or the Credit Ombud at
                    www.creditombud.org.za.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const FAQS = [
  { q: "How much can I borrow?", a: "You can apply for a personal loan between R1,000 and R20,000, repayable over 1 to 6 months." },
  { q: "How fast is approval?", a: "Most WhatsApp applications receive an initial response within 10 minutes during business hours." },
  { q: "What documents do I need?", a: "A valid SA ID, latest payslip or 3 months bank statements, and proof of residence." },
  { q: "Are you registered?", a: `Yes. ${BUSINESS_NAME} is an authorised NCR credit provider (${NCRCP}).` },
  { q: "Can I settle early?", a: "Yes — early settlement is welcome with no penalty. Only accrued interest is charged." },
];

function SliderField({
  label,
  value,
  val,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: string;
  val: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm text-muted-foreground">{label}</label>
        <span className="font-display text-xl font-bold text-primary">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[oklch(0.82_0.16_82)]"
      />
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{typeof min === "number" && min >= 1000 ? ZAR(min) : `${min}${min === 1 ? " month" : " months"}`}</span>
        <span>{typeof max === "number" && max >= 1000 ? ZAR(max) : `${max} months`}</span>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-surface"}`}
    >
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-xl font-bold ${highlight ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition hover:border-primary/40">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}
