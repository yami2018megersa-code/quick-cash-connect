import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { LoanCalculator } from "@/components/LoanCalculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  HeartHandshake,
  CheckCircle2,
  Users,
  Wallet,
  BadgeCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NuDawn Financial Services | Payday Loans & Funeral Cover" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <PaydaySection />
        <FuneralSection />
        <HowItWorks />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/"><Logo /></Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#loans" className="hover:text-navy transition">Payday Loans</a>
          <a href="#funeral" className="hover:text-navy transition">Funeral Cover</a>
          <a href="#how" className="hover:text-navy transition">How it Works</a>
          <a href="#calculator" className="hover:text-navy transition">Calculator</a>
        </nav>
        <Button asChild className="bg-gold-gradient text-navy hover:opacity-90 shadow-gold font-semibold">
          <Link to="/apply">Apply Now</Link>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-sunrise text-white">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(1200px circle at 20% -10%, rgba(255,255,255,.35), transparent 40%)" }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-medium border border-white/20">
            <BadgeCheck className="h-3.5 w-3.5" /> NCR &amp; FSCA authorised
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            Accessible Payday Loans &amp; Affordable Funeral Cover
          </h1>
          <p className="mt-5 text-lg text-white/80 max-w-xl">
            <span className="font-semibold text-white">New Tomorrow, Together.</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gold-gradient text-navy font-semibold shadow-gold hover:opacity-90">
              <Link to="/apply">Apply for a Loan <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <a href="#funeral">Explore Funeral Cover</a>
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ServiceCard
            icon={<Wallet className="h-6 w-6" />}
            title="Payday Loan"
            copy="R500 – R3,000 · 30-day term · NCA-regulated fees."
            cta="Get a quote"
            href="#calculator"
          />
          <ServiceCard
            icon={<HeartHandshake className="h-6 w-6" />}
            title="Funeral Cover"
            copy="From R42/month · Up to R30,000 · Up to 16 family members."
            cta="See plans"
            href="#funeral"
          />
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon, title, copy, cta, href }: { icon: React.ReactNode; title: string; copy: string; cta: string; href: string }) {
  return (
    <a href={href} className="group rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6 hover:bg-white/15 transition shadow-elegant">
      <div className="h-11 w-11 rounded-xl bg-gold-gradient text-navy grid place-items-center">{icon}</div>
      <h3 className="mt-4 text-xl font-bold">{title}</h3>
      <p className="mt-1 text-sm text-white/75">{copy}</p>
      <div className="mt-4 inline-flex items-center text-sm font-semibold text-white group-hover:translate-x-0.5 transition">
        {cta} <ArrowRight className="ml-1.5 h-4 w-4" />
      </div>
    </a>
  );
}

function TrustBar() {
  const items = [
    { icon: <ShieldCheck className="h-5 w-5" />, label: "NCR Registered Credit Provider" },
    { icon: <BadgeCheck className="h-5 w-5" />, label: "FSCA Authorised FSP" },
    { icon: <Clock className="h-5 w-5" />, label: "Same-day decisions" },
    { icon: <Users className="h-5 w-5" />, label: "Trusted by families" },
  ];
  return (
    <section className="border-y bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-3 text-sm font-medium text-navy">
            <span className="text-accent-foreground bg-accent/80 rounded-md p-1.5">{i.icon}</span>
            {i.label}
          </div>
        ))}
      </div>
    </section>
  );
}

function PaydaySection() {
  return (
    <section id="loans" className="py-20 bg-dawn">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">Payday loans that respect your budget</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Bridge the gap to payday with a transparent, NCA-compliant short-term loan. No hidden costs, no surprises — just a
            clear quote and quick decisions.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Borrow R500 to R3,000",
              "Fixed 30-day repayment term",
              "5% monthly interest — capped by NCA",
              "Initiation & service fees fully disclosed (incl. VAT)",
              "Instant online application",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-navy mt-0.5 shrink-0" />
                <span className="text-navy">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div id="calculator">
          <LoanCalculator />
        </div>
      </div>
    </section>
  );
}

function FuneralSection() {
  const plans = [
    { name: "Individual", price: "R42", cover: "R10,000", desc: "For a single member." },
    { name: "Family", price: "R89", cover: "R20,000", desc: "You, your spouse and up to 5 children." },
    { name: "Extended", price: "R149", cover: "R30,000", desc: "Up to 16 family members incl. extended family." },
  ];
  return (
    <section id="funeral" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">Funeral cover that honours your family</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Dignified, affordable cover so your loved ones are never left burdened. Premiums start from <span className="font-semibold text-navy">R42/month</span>,
            with cover up to <span className="font-semibold text-navy">R30,000</span> for up to <span className="font-semibold text-navy">16 family members</span>.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <Card key={p.name} className={i === 1 ? "border-2 border-accent shadow-elegant" : ""}>
              <CardContent className="p-6">
                {i === 1 && <div className="inline-block text-xs font-semibold px-2 py-1 rounded bg-gold-gradient text-navy mb-3">Most popular</div>}
                <h3 className="text-xl font-bold text-navy">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-navy">{p.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <div className="mt-2 text-sm text-navy">Cover up to <span className="font-semibold">{p.cover}</span></div>
                <ul className="mt-5 space-y-2 text-sm">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-navy mt-0.5" /> 24/7 claims support</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-navy mt-0.5" /> Fast payout within 48 hours</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-navy mt-0.5" /> No medical tests</li>
                </ul>
                <Button asChild className="w-full mt-6 bg-navy text-white hover:bg-navy/90">
  <a 
    href="https://wa.me/27872651832?text=Hi%20NuDawn,%20I%20would%20like%20to%20apply%20for%20Funeral%20Cover."
    target="_blank" 
    rel="noopener noreferrer"
  >
    Get covered
  </a>
</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Apply online", d: "Complete our secure 4-step application in minutes." },
    { n: "02", t: "Upload documents", d: "ID, latest payslip and 3 months' bank statements." },
    { n: "03", t: "Get a decision", d: "Same-day affordability check and quote." },
    { n: "04", t: "Funds paid out", d: "Approved loans paid directly to your bank." },
  ];
  return (
    <section id="how" className="py-20 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight text-center">How it works</h2>
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="rounded-2xl bg-card p-6 border">
              <div className="text-4xl font-extrabold text-accent">{s.n}</div>
              <h3 className="mt-3 font-bold text-navy">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-sunrise text-white p-10 md:p-14 shadow-elegant flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Ready for a new tomorrow?</h3>
            <p className="text-white/80 mt-2">Apply now and get a decision the same day.</p>
          </div>
          <Button asChild size="lg" className="bg-gold-gradient text-navy font-semibold shadow-gold hover:opacity-90">
            <Link to="/apply">Start your application <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <Link 
            to="/admin" 
            className="inline-block cursor-default select-none"
            aria-hidden="true"
            tabIndex={-1}
          >
            <Logo variant="light" />
          </Link>
          <p className="mt-4 text-sm text-white/70 max-w-xs">New Tomorrow, Together.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Products</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#loans" className="hover:text-white">Payday Loans</a></li>
            <li><a href="#funeral" className="hover:text-white">Funeral Cover</a></li>
            <li><a href="#calculator" className="hover:text-white">Loan Calculator</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><LegalModal title="Privacy Policy" body={<PrivacyPolicy />} /></li>
            <li><LegalModal title="POPIA Notice" body={<PopiaNotice />} /></li>
            <li><LegalModal title="Terms & Conditions" body={<Terms />} /></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Compliance</h4>
          <ul className="space-y-2 text-sm">
            <li>NCR Registered Credit Provider: <span className="text-white">NCRCP20672</span></li>
            <li>FSCA Authorised FSP: <span className="text-white">FSP51669</span></li>
            <li>Info@nudawngroup.co.za</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 text-xs text-white/60 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} NuDawn Financial Services. All rights reserved.</p>
          <p>Credit is subject to affordability assessment (NCA §81).</p>
        </div>
      </div>
    </footer>
  );
}

function LegalModal({ title, body }: { title: string; body: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-left hover:text-white">{title}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">{body}</div>
      </DialogContent>
    </Dialog>
  );
}

function PrivacyPolicy() {
  return (
    <>
      <p>NuDawn Financial Services respects your privacy. We collect personal information solely to assess and provide the financial products you apply for.</p>
      <p>Information is stored securely and only shared with credit bureaus, regulators, and service providers where lawfully required.</p>
      <p>You may request access, correction, or deletion of your data at any time by emailing Info@nudawngroup.co.za.</p>
    </>
  );
}
function PopiaNotice() {
  return (
    <>
      <p>In terms of the Protection of Personal Information Act (POPIA), NuDawn is the responsible party for the processing of your personal information.</p>
      <p>Purpose: affordability assessment, credit reporting, KYC/FICA compliance, and provision of insurance and credit products.</p>
      <p>You have the right to object to processing and to lodge complaints with the Information Regulator (South Africa).</p>
    </>
  );
}
function Terms() {
  return (
    <>
      <p>Loans are provided by NuDawn Financial Services, a registered credit provider (NCRCP20672) under the National Credit Act 34 of 2005.</p>
      <p>All quotations are pre-agreement disclosures. Final agreements are subject to affordability, credit assessment, and NCR-compliant documentation.</p>
      <p>Insurance products are underwritten by our licensed partners and administered by NuDawn as an FSCA Authorised Financial Services Provider (FSP51669).</p>
    </>
  );
}
