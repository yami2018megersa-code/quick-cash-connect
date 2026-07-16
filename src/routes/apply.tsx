import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useCallback } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { calculateLoan } from "@/components/LoanCalculator";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, UploadCloud, X, FileText } from "lucide-react";

const searchSchema = z.object({ amount: z.number().min(500).max(3000).optional() });

export const Route = createFileRoute("/apply")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Apply | NuDawn Financial Services" },
      { name: "description", content: "Secure online application for NuDawn payday loans and funeral cover." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ApplyPage,
});

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE = 5 * 1024 * 1024;

const step1Schema = z.object({
  full_name: z.string().trim().min(2, "Full name required").max(120),
  id_number: z.string().trim().regex(/^\d{13}$/, "Enter a valid 13-digit SA ID number"),
  phone: z.string().trim().regex(/^(\+?27|0)[6-8][0-9]{8}$/, "Enter a valid SA phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  employment_status: z.enum(["employed_full_time", "employed_part_time", "self_employed", "contract", "pensioner"]),
});
const step2Schema = z.object({
  amount: z.number().min(500).max(3000),
});
const step4Schema = z.object({ consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }) });

type Step1 = z.infer<typeof step1Schema>;
type DocKey = "id_copy" | "payslip" | "bank_statement";




function ApplyPage() {
  const { amount: initialAmount } = Route.useSearch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState<Step1 | null>(null);
  const [amount, setAmount] = useState<number>(initialAmount ?? 1500);
  const [files, setFiles] = useState<Record<DocKey, File | null>>({ id_copy: null, payslip: null, bank_statement: null });
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const progress = (step / 4) * 100;
  const breakdown = useMemo(() => calculateLoan(amount), [amount]);

  const submit = useCallback(async () => {
    if (!step1) return;
    const missing = (Object.keys(files) as DocKey[]).filter((k) => !files[k]);
    if (missing.length) return toast.error("Please upload all required documents");
    if (!consent) return toast.error("POPIA consent is required");
    if (!isSupabaseConfigured) {
      return toast.error("Application backend not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    }

    setSubmitting(true);
    try {
      // 1. Generate the secure ID in the browser (Fixes the RLS read-blocker)
      const appId = crypto.randomUUID();

      // 2. Insert application (Notice we pass the ID in, and we DO NOT use .select())
      const { error: appErr } = await supabase
        .from("applications")
        .insert({
          id: appId,
          full_name: step1.full_name,
          id_number: step1.id_number,
          phone: step1.phone,
          email: step1.email,
          employment_status: step1.employment_status,
          amount,
          total_repayment: breakdown.total,
          popia_consent: true,
          status: "pending",
        });

      if (appErr) throw appErr;

      // 3. Upload each file using the secure Edge Function
      for (const key of Object.keys(files) as DocKey[]) {
        const file = files[key]!;
        const path = `${appId}/${key}-${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;

        // Ask Supabase for a temporary, secure upload URL
        const { data: edgeData, error: edgeErr } = await supabase.functions.invoke('get-upload-url', {
          body: { fileName: path, fileType: file.type }
        });

        if (edgeErr || !edgeData?.url) throw new Error("Failed to get secure upload link");

        // Upload directly to AWS Cape Town using the temporary pass
        const uploadRes = await fetch(edgeData.url, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type }
        });

        if (!uploadRes.ok) throw new Error(`Failed to upload ${file.name} to secure vault`);

        // Link the document path in the Supabase database
        const { error: docErr } = await supabase.from("documents").insert({
          application_id: appId,
          document_type: key,
          storage_path: edgeData.path,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
        });

        if (docErr) throw docErr;
      }

      setDone(true);
      toast.success("Application received");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [step1, files, consent, amount, breakdown.total]);

  if (done) return <SuccessView />;

  return (
    <div className="min-h-screen bg-dawn">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/"><Logo /></Link>
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to site
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>Step {step} of 4</span>
            <span>{["Personal", "Loan", "Documents", "Consent"][step - 1]}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-navy">
              {step === 1 && "Your details"}
              {step === 2 && "Loan amount"}
              {step === 3 && "Upload documents"}
              {step === 4 && "Review & consent"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && <Step1Form defaults={step1 ?? undefined} onNext={(v) => { setStep1(v); setStep(2); }} />}
            {step === 2 && (
              <Step2 amount={amount} setAmount={setAmount} onBack={() => setStep(1)} onNext={() => setStep(3)} />
            )}
            {step === 3 && (
              <Step3Docs files={files} setFiles={setFiles} onBack={() => setStep(2)} onNext={() => setStep(4)} />
            )}
            {step === 4 && (
              <Step4Review
                step1={step1!}
                amount={amount}
                breakdown={breakdown}
                consent={consent}
                setConsent={setConsent}
                onBack={() => setStep(3)}
                onSubmit={submit}
                submitting={submitting}
              />
            )}
          </CardContent>
        </Card>
        <p className="text-xs text-center text-muted-foreground mt-6">
          Secured application · Data processed under POPIA · NCR &amp; FSCA regulated
        </p>
      </div>
    </div>
  );
}

function Step1Form({ defaults, onNext }: { defaults?: Step1; onNext: (v: Step1) => void }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues: defaults,
  });
  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <Field label="Full name" error={errors.full_name?.message}>
        <Input {...register("full_name")} placeholder="Thandi Mokoena" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="SA ID number" error={errors.id_number?.message}>
          <Input {...register("id_number")} placeholder="13 digits" inputMode="numeric" maxLength={13} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input {...register("phone")} placeholder="0821234567" inputMode="tel" />
        </Field>
      </div>
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} placeholder="you@example.com" />
      </Field>
      <Field label="Employment status" error={errors.employment_status?.message}>
        <Controller
          control={control}
          name="employment_status"
          render={({ field }) => (
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="employed_full_time">Employed — full time</SelectItem>
                <SelectItem value="employed_part_time">Employed — part time</SelectItem>
                <SelectItem value="self_employed">Self-employed</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="pensioner">Pensioner</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </Field>
      <div className="flex justify-end pt-2">
        <Button type="submit" className="bg-navy text-white hover:bg-navy/90">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

function Step2({ amount, setAmount, onBack, onNext }: { amount: number; setAmount: (n: number) => void; onBack: () => void; onNext: () => void }) {
  const b = calculateLoan(amount);
  const parsed = step2Schema.safeParse({ amount });
  const fmt = (n: number) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <Label>Requested amount</Label>
          <span className="text-2xl font-bold text-navy">{fmt(amount)}</span>
        </div>
        <Slider min={500} max={3000} step={100} value={[amount]} onValueChange={(v) => setAmount(v[0])} />
        <div className="flex justify-between text-xs text-muted-foreground mt-2"><span>R500</span><span>R3,000</span></div>
      </div>
      <div className="rounded-lg border bg-secondary/40 p-4 text-sm space-y-1.5">
        <Row l="Principal" v={fmt(b.principal)} />
        <Row l="Interest (5%)" v={fmt(b.interest)} />
        <Row l="Initiation fee (incl. VAT)" v={fmt(b.initiationFee)} />
        <Row l="Service fee (incl. VAT)" v={fmt(b.serviceFee)} />
        <div className="h-px bg-border my-2" />
        <Row l="Total repayment (30 days)" v={fmt(b.total)} bold />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <Button onClick={onNext} disabled={!parsed.success} className="bg-navy text-white hover:bg-navy/90">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Row({ l, v, bold }: { l: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold text-navy" : "text-muted-foreground"}>{l}</span>
      <span className={bold ? "font-bold text-navy text-base" : "font-medium"}>{v}</span>
    </div>
  );
}

function Step3Docs({
  files, setFiles, onBack, onNext,
}: {
  files: Record<DocKey, File | null>;
  setFiles: (f: Record<DocKey, File | null>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const set = (k: DocKey, f: File | null) => setFiles({ ...files, [k]: f });
  const allSet = files.id_copy && files.payslip && files.bank_statement;
  return (
    <div className="space-y-4">
      <Dropzone label="Certified copy of ID" k="id_copy" file={files.id_copy} onFile={(f) => set("id_copy", f)} />
      <Dropzone label="Most recent payslip" k="payslip" file={files.payslip} onFile={(f) => set("payslip", f)} />
      <Dropzone label="Latest 3 months' bank statements" k="bank_statement" file={files.bank_statement} onFile={(f) => set("bank_statement", f)} />
      <p className="text-xs text-muted-foreground">PDF, JPG, or PNG · max 5MB per file.</p>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <Button onClick={onNext} disabled={!allSet} className="bg-navy text-white hover:bg-navy/90">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Dropzone({ label, file, onFile }: { label: string; k: DocKey; file: File | null; onFile: (f: File | null) => void }) {
  const [drag, setDrag] = useState(false);
  const validate = (f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type)) { toast.error(`${f.name}: only PDF, JPG or PNG allowed`); return false; }
    if (f.size > MAX_SIZE) { toast.error(`${f.name}: exceeds 5MB`); return false; }
    return true;
  };
  const handleFiles = (list: FileList | null) => {
    const f = list?.[0]; if (!f) return;
    if (validate(f)) onFile(f);
  };
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      {file ? (
        <div className="flex items-center justify-between rounded-lg border bg-secondary/40 p-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-5 w-5 text-navy shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => onFile(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
          className={`block cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition ${drag ? "border-accent bg-accent/5" : "border-border hover:border-accent/60 hover:bg-secondary/30"}`}
        >
          <UploadCloud className="h-6 w-6 mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm font-medium text-navy">Click or drag file to upload</p>
          <p className="text-xs text-muted-foreground">PDF, JPG, PNG · up to 5MB</p>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>
      )}
    </div>
  );
}

function Step4Review({
  step1, amount, breakdown, consent, setConsent, onBack, onSubmit, submitting,
}: {
  step1: Step1; amount: number; breakdown: ReturnType<typeof calculateLoan>;
  consent: boolean; setConsent: (b: boolean) => void; onBack: () => void; onSubmit: () => void; submitting: boolean;
}) {
  const fmt = (n: number) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);
  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4 space-y-1 text-sm">
        <h4 className="font-semibold text-navy mb-2">Applicant</h4>
        <Row l="Full name" v={step1.full_name} />
        <Row l="ID number" v={step1.id_number} />
        <Row l="Phone" v={step1.phone} />
        <Row l="Email" v={step1.email} />
        <Row l="Employment" v={step1.employment_status.replace(/_/g, " ")} />
      </div>
      <div className="rounded-lg border p-4 space-y-1 text-sm">
        <h4 className="font-semibold text-navy mb-2">Loan quote</h4>
        <Row l="Requested amount" v={fmt(amount)} />
        <Row l="Total repayment" v={fmt(breakdown.total)} bold />
      </div>
      <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer bg-secondary/30">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(Boolean(v))} className="mt-0.5" />
        <span className="text-sm">
          I consent to NuDawn processing my personal information and conducting credit assessments in accordance with POPIA and the NCA.
        </span>
      </label>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={submitting}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <Button
          onClick={onSubmit}
          disabled={!consent || submitting || !step4Schema.safeParse({ consent }).success}
          className="bg-gold-gradient text-navy font-semibold shadow-gold hover:opacity-90 min-w-[180px]"
        >
          {submitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…</>) : "Submit application"}
        </Button>
      </div>
    </div>
  );
}

function SuccessView() {
  return (
    <div className="min-h-screen bg-dawn grid place-items-center px-4">
      <Card className="max-w-lg w-full shadow-elegant text-center">
        <CardContent className="p-10">
          <div className="mx-auto h-16 w-16 rounded-full bg-gold-gradient grid place-items-center shadow-gold">
            <CheckCircle2 className="h-8 w-8 text-navy" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-navy">Application received</h1>
          <p className="mt-3 text-muted-foreground">
            Thank you. Our team will review your application and be in touch with a decision, typically within one business day.
          </p>
          <Button asChild className="mt-8 bg-navy text-white hover:bg-navy/90">
            <Link to="/">Return to home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
