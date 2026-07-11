import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import {
  Calculator,
  MessageCircle,
  ShieldCheck,
  Zap,
  Wallet,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  HeartHandshake,
  Users,
  Sunrise,
  FileCheck2,
} from "lucide-react";

const BUSINESS_NAME = "NuDawn Financial Services";
const SLOGAN = "New Tomorrow, Together.";
const NCRCP = "NCRCPXXXXX";
const FSP = "FSPXXXXX";
const WHATSAPP_NUMBER = "27821234567"; // international format, no +
const CONTACT_EMAIL = "hello@nudawn.co.za";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BUSINESS_NAME} | Payday Loans & Funeral Cover in South Africa` },
      {
        name: "description",
        content:
          "Fast payday loans up to R3,000 and affordable funeral cover from R42/month. Authorised Credit & Financial Services Provider. Apply via WhatsApp.",
      },
      { property: "og:title", content: `${BUSINESS_NAME} — ${SLOGAN}` },
      {
        property: "og:description",
        content:
          "Fast payday loans up to R3,000 and affordable funeral cover from R42/month. Authorised Credit & Financial Services Provider. Apply via WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${BUSINESS_NAME} — ${SLOGAN}` },
      {
        name: "twitter:description",
        content: "Fast payday loans up to R3,000 and affordable funeral cover from R42/month. Authorised Credit & Financial Services Provider. Apply via WhatsApp.",
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
              slogan: SLOGAN,
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
            },
            {
              "@type": "FinancialProduct",
              name: "NuDawn Payday Loan",
              provider: { "@type": "Organization", name: BUSINESS_NAME },
              description:
                "Short-term payday loans from R500 to R3,000, repayable within 30 days.",
              feesAndCommissionsSpecification:
                "Interest, initiation and service fees per National Credit Act (NCA) regulations.",
            },
            {
              "@type": "InsuranceAgency",
              name: `${BUSINESS_NAME} — Funeral Cover`,
              description:
                "Affordable funeral cover from R42/month, covering up to 16 family members with benefits up to R30,000.",
              areaServed: "ZA",
            },
          ],
        }),
      },
    ],
  }),
  component: Landing,
});

function estimatePayday(amount: number, days: number) {
  // Indicative NCA-style short-term costs
  const initiationFee = Math.min(1207.5, 165 + Math.max(0, amount - 1000) * 0.1);
  const serviceFee = 69;
  const interest = amount * 0.05 * (days / 30);
  const total = amount + interest + initiationFee + serviceFee;
  return { total, interest, initiationFee, serviceFee };
}

const ZAR = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);

function Landing() {
  const [amount, setAmount] = useState(1500);
  const [days, setDays] = useState(30);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<"Payday Loan" | "Funeral Cover">("Payday Loan");
  const [detail, setDetail] = useState("");
  const [consent, setConsent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [legal, setLegal] = useState<null | "privacy" | "terms" | "popia">(null);

  const est = useMemo(() => estimatePayday(amount, days), [amount, days]);

  const buildWa = (message: string) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const applyLoanMsg = `Hi ${BUSINESS_NAME}, I'd like to apply for a payday loan of ${ZAR(amount)} over ${days} days. Estimated repayment: ${ZAR(est.total)}.`;
  const funeralMsg = `Hi ${BUSINESS_NAME}, I'd like a quote for funeral cover. Please share the plan options.`;

  const submitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !name || !phone) return;
    const msg =
      `New enquiry via nudawn.co.za%0A%0A` +
      `Name: ${name}%0APhone: ${phone}%0AService: ${service}%0A` +
      (service === "Payday Loan"
        ? `Amount needed: ${detail || ZAR(amount)}`
        : `Dependents: ${detail || "not specified"}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="fixed top-0 z-50 w-full glass">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#home" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg gradient-dawn text-primary-foreground">
              <Sunrise className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-bold tracking-tight sm:text-lg">NuDawn</div>
              <div className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
                Financial Services
              </div>
            </div>
          </a>
          <nav aria-label="Primary" className="hidden gap-7 md:flex">
            {[
              ["Home", "#home"],
              ["Payday Loans", "#payday"],
              ["Funeral Cover", "#funeral"],
              ["About Us", "#about"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="text-sm text-muted-foreground transition hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#apply"
            className="rounded-full gradient-dawn px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
          >
            Apply now
          </a>
        </div>
      </header>

      <main>
        {/* HERO — dual action */}
        <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
          <img
            src={heroBg}
            alt="Warm sunrise light representing a new financial tomorrow"
            width={1920}
            height={1080}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="pointer-events-none absolute inset-0 gradient-horizon opacity-90" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                NCR Credit Provider · FSCA Authorised FSP
              </div>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Accessible <span className="text-gradient-dawn">Payday Loans</span> & Affordable{" "}
                <span className="text-gradient-dawn">Funeral Cover</span> in South Africa
              </h1>
              <p className="mt-5 text-base text-muted-foreground sm:text-lg">
                {SLOGAN} Bridge the gap to your next payday, or protect your family — apply in minutes via WhatsApp.
              </p>
            </div>

            {/* Dual CTA cards */}
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <a
                href="#payday"
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition hover:border-primary/50 sm:p-8"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full gradient-dawn opacity-20 blur-2xl transition group-hover:opacity-40" />
                <div className="relative">
                  <div className="inline-grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold">Apply for a Payday Loan</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    R500–R3,000 up to 30 days. Fast, simple, transparent.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full gradient-dawn px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
                    <Calculator className="h-4 w-4" /> Get your estimate
                  </span>
                </div>
              </a>
              <a
                href="#funeral"
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/50 sm:p-8"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent opacity-20 blur-2xl transition group-hover:opacity-40" />
                <div className="relative">
                  <div className="inline-grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold">Get a Funeral Cover Quote</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Premiums from R42/month. Cover up to R30,000 for the whole family.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent">
                    <MessageCircle className="h-4 w-4" /> Request a quote
                  </span>
                </div>
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              {[
                ["R3,000", "Max payday loan"],
                ["R42", "Funeral cover from /mo"],
                ["100%", "POPIA compliant"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-border bg-surface/60 p-3">
                  <div className="font-display text-xl font-bold text-primary">{v}</div>
                  <div className="text-xs text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PAYDAY LOANS */}
        <section id="payday" className="border-t border-border bg-surface/30 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Service 1</span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                Payday loans to bridge the gap
              </h2>
              <p className="mt-4 text-muted-foreground">
                Life doesn't wait for month-end. NuDawn payday loans give you fast access to short-term cash so you
                can handle what matters — and settle up on your next payday.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Borrow between R500 and R3,000",
                  "Repay within 30 days on your payday",
                  "Simple WhatsApp application — no branch visits",
                  "Transparent NCA-regulated fees",
                ].map((c) => (
                  <li key={c} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payday calculator */}
            <div className="glass rounded-2xl p-6 shadow-2xl shadow-black/40 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-xl font-bold">Payday loan estimator</h3>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  Indicative
                </span>
              </div>

              <div className="space-y-6">
                <SliderField
                  label="Loan amount"
                  value={ZAR(amount)}
                  min={500}
                  max={3000}
                  step={100}
                  val={amount}
                  onChange={setAmount}
                  minLabel={ZAR(500)}
                  maxLabel={ZAR(3000)}
                />
                <SliderField
                  label="Repayment period"
                  value={`${days} days`}
                  min={7}
                  max={30}
                  step={1}
                  val={days}
                  onChange={setDays}
                  minLabel="7 days"
                  maxLabel="30 days"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Stat label="Total to repay" value={ZAR(est.total)} highlight />
                <Stat label="Cost of credit" value={ZAR(est.total - amount)} />
              </div>

              <a
                href={buildWa(applyLoanMsg)}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl gradient-dawn px-5 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5" /> Apply on WhatsApp
              </a>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
                Estimates are indicative. Final terms subject to NCA assessment.
              </p>
            </div>
          </div>
        </section>

        {/* FUNERAL COVER */}
        <section id="funeral" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">Service 2</span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                Funeral cover that carries your family
              </h2>
              <p className="mt-4 text-muted-foreground">
                Prepare for life's unexpected moments with dignity. Affordable premiums, generous cover, and a
                claims process built to pay out fast when your family needs it most.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                { icon: Wallet, k: "From R42", l: "per month" },
                { icon: Users, k: "Up to 16", l: "family members on one policy" },
                { icon: ShieldCheck, k: "Up to R30,000", l: "cover benefit per member" },
              ].map((m) => (
                <div key={m.l} className="rounded-2xl border border-accent/25 bg-accent/5 p-6">
                  <m.icon className="h-7 w-7 text-accent" />
                  <div className="mt-4 font-display text-3xl font-bold text-accent">{m.k}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{m.l}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-6 rounded-2xl border border-border bg-surface p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="font-display text-xl font-bold">Get your personal quote in minutes</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share how many dependents you'd like to cover and our team will send tailored plan options
                  directly on WhatsApp.
                </p>
              </div>
              <a
                href={buildWa(funeralMsg)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5" /> Request funeral quote
              </a>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="border-t border-border bg-surface/30 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">About Us</span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">A new tomorrow, together.</h2>
              <p className="mt-4 text-muted-foreground">
                NuDawn Financial Services is a South African provider of short-term credit and funeral cover
                solutions. We're authorised by the National Credit Regulator and the Financial Sector Conduct
                Authority, and we operate with transparency, respect and speed.
              </p>
              <p className="mt-4 text-muted-foreground">
                Every product is built for real households — clear terms, mobile-first applications, and a team
                that answers on WhatsApp when you need us.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                {[
                  ["NCR", "Registered credit provider"],
                  ["FSCA", "Authorised FSP"],
                  ["POPIA", "Data privacy compliant"],
                ].map(([k, l]) => (
                  <div key={k} className="rounded-xl border border-border bg-surface p-3">
                    <div className="font-display text-lg font-bold text-primary">{k}</div>
                    <div className="mt-1 text-[11px] text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <h3 className="font-display text-lg font-bold">How it works</h3>
              <ol className="mt-6 space-y-5">
                {[
                  { icon: Calculator, t: "Estimate or enquire", d: "Use the calculator or send a short enquiry." },
                  { icon: FileCheck2, t: "Chat on WhatsApp", d: "Our team verifies your details securely off-site." },
                  { icon: Zap, t: "Fast outcome", d: "Loan payout same-day or funeral policy activated quickly." },
                ].map((s, i) => (
                  <li key={s.t} className="flex items-start gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg gradient-dawn text-primary-foreground">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Step {i + 1}</div>
                      <div className="font-semibold">{s.t}</div>
                      <div className="text-sm text-muted-foreground">{s.d}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* CONTACT / LEAD FORM */}
        <section id="contact" className="py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Talk to a NuDawn consultant</h2>
              <p className="mt-3 text-muted-foreground">
                Send us your details and we'll continue on WhatsApp — no document uploads on the website.
              </p>
              <div className="mt-8 space-y-3">
                <ContactRow icon={MessageCircle} label="WhatsApp" value="+27 82 123 4567" href={`https://wa.me/${WHATSAPP_NUMBER}`} />
                <ContactRow icon={Phone} label="Call us" value="+27 82 123 4567" href="tel:+27821234567" />
                <ContactRow icon={Mail} label="Email" value={CONTACT_EMAIL} href={`mailto:${CONTACT_EMAIL}`} />
                <ContactRow icon={MapPin} label="Office" value="1 Sandton Drive, Johannesburg, 2196" />
              </div>
            </div>

            <div id="apply" className="glass rounded-2xl p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold">Start your enquiry</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Four quick fields. We'll message you on WhatsApp.
              </p>
              <form onSubmit={submitLead} className="mt-6 space-y-4">
                <Field label="Full name">
                  <input
                    required
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
                    placeholder="082 123 4567"
                  />
                </Field>
                <Field label="Service required">
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value as typeof service)}
                    className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    <option>Payday Loan</option>
                    <option>Funeral Cover</option>
                  </select>
                </Field>
                <Field
                  label={service === "Payday Loan" ? "Amount needed (R)" : "Number of dependents"}
                >
                  <input
                    required
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    inputMode="numeric"
                    className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
                    placeholder={service === "Payday Loan" ? "e.g. 1500" : "e.g. 4"}
                  />
                </Field>

                <label className="flex items-start gap-3 rounded-lg border border-border bg-surface/50 p-3 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 accent-[oklch(0.75_0.18_55)]"
                  />
                  <span>
                    I consent to {BUSINESS_NAME} processing my personal information for this inquiry in accordance
                    with POPIA.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!consent}
                  className="flex w-full items-center justify-center gap-2 rounded-xl gradient-dawn px-5 py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MessageCircle className="h-5 w-5" /> Continue on WhatsApp
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border bg-surface/30 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
              <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Questions, answered</h2>
            </div>
            <div className="mt-10 space-y-3">
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
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-surface/50 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg gradient-dawn text-primary-foreground">
                <Sunrise className="h-4 w-4" />
              </div>
              <span className="font-display font-bold">NuDawn</span>
            </div>
            <p className="mt-3 text-sm italic text-muted-foreground">{SLOGAN}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              1 Sandton Drive, Johannesburg, 2196, South Africa.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => setLegal("privacy")} className="hover:text-foreground">Privacy Policy</button></li>
              <li><button onClick={() => setLegal("popia")} className="hover:text-foreground">POPIA Notice</button></li>
              <li><button onClick={() => setLegal("terms")} className="hover:text-foreground">Terms &amp; Conditions</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Regulatory</h4>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {BUSINESS_NAME} is an Authorised Credit Provider ({NCRCP}).
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {BUSINESS_NAME} is an Authorised Financial Services Provider ({FSP}).
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Credit granted subject to affordability assessment (NCA 34 of 2005). Borrow only what you can afford to repay.
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
                {legal === "privacy" && "Privacy Policy"}
                {legal === "popia" && "POPIA Notice"}
                {legal === "terms" && "Terms & Conditions"}
              </h3>
              <button onClick={() => setLegal(null)} className="rounded-full border border-border px-3 py-1 text-sm">
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {legal === "privacy" && (
                <p>
                  {BUSINESS_NAME} collects your personal information solely to assess and provide the financial
                  services you request. We do not sell your data. Contact {CONTACT_EMAIL} for access or deletion.
                </p>
              )}
              {legal === "popia" && (
                <p>
                  In line with the Protection of Personal Information Act, you consent to the processing of your
                  information for enquiry, credit assessment and insurance underwriting purposes. You may withdraw
                  consent at any time.
                </p>
              )}
              {legal === "terms" && (
                <p>
                  All loan offers are subject to affordability assessment under the National Credit Act. Funeral
                  cover is underwritten by an authorised insurer. Calculator estimates are indicative and do not
                  constitute an offer.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const FAQS = [
  { q: "How much can I borrow?", a: "Payday loans range from R500 to R3,000, repayable within 30 days on your next payday." },
  { q: "How much does funeral cover cost?", a: "Premiums start from R42/month, with cover benefits up to R30,000 per member and up to 16 family members on a single policy." },
  { q: "How fast is approval?", a: "Most WhatsApp enquiries receive an initial response within minutes during business hours." },
  { q: "Are you authorised?", a: `Yes. ${BUSINESS_NAME} is a registered NCR credit provider (${NCRCP}) and an FSCA authorised FSP (${FSP}).` },
  { q: "Do I upload documents on the site?", a: "No. All sensitive documents are handled off-site on WhatsApp with a consultant." },
];

function SliderField({
  label,
  value,
  val,
  min,
  max,
  step,
  onChange,
  minLabel,
  maxLabel,
}: {
  label: string;
  value: string;
  val: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  minLabel: string;
  maxLabel: string;
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
        className="w-full accent-[oklch(0.75_0.18_55)]"
      />
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
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
