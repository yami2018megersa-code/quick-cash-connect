import { useMemo, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const VAT = 0.15;

function money(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", minimumFractionDigits: 2 }).format(n);
}

export function calculateLoan(principal: number) {
  const interest = principal * 0.05; // 5% per month
  const initiationBase = Math.min(165 + Math.max(0, principal - 1000) * 0.1, 1050);
  const initiationFee = initiationBase * (1 + VAT);
  const serviceFee = 60 * (1 + VAT); // R69
  const total = principal + interest + initiationFee + serviceFee;
  return { principal, interest, initiationFee, serviceFee, total };
}

export function LoanCalculator({ compact = false }: { compact?: boolean }) {
  const [amount, setAmount] = useState(1500);
  const b = useMemo(() => calculateLoan(amount), [amount]);

  return (
    <Card className={compact ? "" : "shadow-elegant"}>
      <CardHeader>
        <CardTitle className="text-navy">Payday Loan Calculator</CardTitle>
        <p className="text-sm text-muted-foreground">
          NCA-compliant · Fixed 30-day term · R500 – R3,000
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm font-medium">Loan amount</span>
            <span className="text-2xl font-bold text-navy">{money(amount)}</span>
          </div>
          <Slider
            min={500}
            max={3000}
            step={100}
            value={[amount]}
            onValueChange={(v) => setAmount(v[0])}
            aria-label="Loan amount"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>R500</span>
            <span>R3,000</span>
          </div>
        </div>

        <div className="rounded-lg border bg-secondary/40 p-4 space-y-2 text-sm">
          <Row label="Principal" value={money(b.principal)} />
          <Row label="Interest (5%)" value={money(b.interest)} />
          <Row label="Initiation fee (incl. VAT)" value={money(b.initiationFee)} />
          <Row label="Service fee (incl. VAT)" value={money(b.serviceFee)} />
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-navy">Total repayment (30 days)</span>
            <span className="text-xl font-bold text-navy">{money(b.total)}</span>
          </div>
        </div>

        <Button asChild size="lg" className="w-full bg-gold-gradient text-navy hover:opacity-90 shadow-gold font-semibold">
          <Link to="/apply" search={{ amount }}>
            Apply for {money(amount)} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Illustrative quote in terms of the National Credit Act 34 of 2005. Fees include 15% VAT. Final approval subject to
          affordability assessment and credit check.
        </p>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
