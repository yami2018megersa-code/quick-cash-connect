import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import logoAsset from "@/assets/nudawn-logo.png.asset.json";
import {
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Upload,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for a Loan | NuDawn Financial Services" },
      {
        name: "description",
        content:
          "Secure loan application portal. Apply for a payday loan up to R3,000 with NuDawn Financial Services. New Tomorrow, Together.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ApplyPage,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

const fileSchema = z
  .instanceof(File, { message: "File is required" })
  .refine((f) => f.size <= MAX_FILE_SIZE, "File must be 5MB or smaller")
  .refine(
    (f) => ACCEPTED_TYPES.includes(f.type),
    "Only PDF, JPG, or PNG files are allowed",
  );

const step1Schema = z.object({
  full_name: z.string().trim().min(2, "Full name is required").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?27|0)[6-8][0-9]{8}$/, "Enter a valid SA mobile number"),
  employment_status: z.enum(["employed", "self_employed", "unemployed", "other"], {
    errorMap: () => ({ message: "Select an employment status" }),
  }),
});

const step2Schema = z.object({
  amount: z
    .number({ invalid_type_error: "Enter an amount" })
    .int("Whole rands only")
    .min(500, "Minimum R500")
    .max(3000, "Maximum R3,000"),
});

const step3Schema = z.object({
  id_copy: fileSchema,
  payslip: fileSchema,
  bank_statement: fileSchema,
  popia_consent: z
    .boolean()
    .refine((v) => v === true, "You must accept the POPIA notice"),
});

type Step1 = z.infer<typeof step1Schema>;
type Step2 = z.infer<typeof step2Schema>;
type Step3 = z.infer<typeof step3Schema>;

function ApplyPage() {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1 | null>(null);
  const [step2Data, setStep2Data] = useState<Step2 | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setStep(1);
    setStep1Data(null);
    setStep2Data(null);
    setSubmitError(null);
    setSuccess(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoAsset.url}
              alt="NuDawn Financial Services logo"
              className="h-11 w-auto"
            />
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-white">NuDawn</div>
              <div className="text-xs text-amber-300/80">New Tomorrow, Together.</div>
            </div>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="mb-8 text-center">
          <img
            src={logoAsset.url}
            alt="NuDawn logo"
            className="mx-auto h-20 w-auto"
          />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Loan Application Portal
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Secure application — takes about 3 minutes. "New Tomorrow, Together."
          </p>
        </div>

        {success ? (
          <SuccessCard onReset={reset} />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-black/40 sm:p-8">
            <Stepper current={step} />

            {step === 1 && (
              <StepOne
                defaultValues={step1Data ?? undefined}
                onNext={(data) => {
                  setStep1Data(data);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && step1Data && (
              <StepTwo
                defaultValues={step2Data ?? undefined}
                onBack={() => setStep(1)}
                onNext={(data) => {
                  setStep2Data(data);
                  setStep(3);
                }}
              />
            )}
            {step === 3 && step1Data && step2Data && (
              <StepThree
                submitting={submitting}
                error={submitError}
                onBack={() => setStep(2)}
                onSubmit={async (data) => {
                  setSubmitError(null);
                  setSubmitting(true);
                  try {
                    await submitApplication(step1Data, step2Data, data);
                    setSuccess(true);
                  } catch (err) {
                    console.error(err);
                    setSubmitError(
                      err instanceof Error
                        ? err.message
                        : "Something went wrong. Please try again.",
                    );
                  } finally {
                    setSubmitting(false);
                  }
                }}
              />
            )}
          </div>
        )}

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-amber-400/80" />
          Encrypted submission. NCR & FSCA authorised provider.
        </p>
      </section>
    </main>
  );
}

async function submitApplication(s1: Step1, s2: Step2, s3: Step3) {
  const { data: application, error: insertErr } = await supabase
    .from("applications")
    .insert({
      full_name: s1.full_name,
      phone: s1.phone,
      employment_status: s1.employment_status,
      amount: s2.amount,
      popia_consent: s3.popia_consent,
    })
    .select("id")
    .single();

  if (insertErr || !application) {
    throw new Error(insertErr?.message ?? "Failed to create application");
  }

  const applicationId = application.id as string;
  const uploads: Array<{ file: File; document_type: string }> = [
    { file: s3.id_copy, document_type: "id_copy" },
    { file: s3.payslip, document_type: "payslip" },
    { file: s3.bank_statement, document_type: "bank_statement" },
  ];

  for (const { file, document_type } of uploads) {
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${applicationId}/${document_type}-${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("loan-documents")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadErr) throw new Error(`Upload failed (${document_type}): ${uploadErr.message}`);

    const { error: docErr } = await supabase.from("documents").insert({
      application_id: applicationId,
      document_type,
      storage_path: path,
    });
    if (docErr) throw new Error(`Failed to record ${document_type}: ${docErr.message}`);
  }
}

function Stepper({ current }: { current: number }) {
  const steps = ["Personal", "Loan", "Documents"];
  return (
    <ol className="mb-8 flex items-center gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                done
                  ? "bg-amber-400 text-slate-950"
                  : active
                    ? "bg-amber-400 text-slate-950"
                    : "bg-white/10 text-slate-400"
              }`}
            >
              {done ? <CheckCircle2 className="h-5 w-5" /> : n}
            </div>
            <span
              className={`hidden text-xs font-medium sm:inline ${
                active || done ? "text-white" : "text-slate-500"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className="ml-1 h-px flex-1 bg-white/10" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepOne({
  defaultValues,
  onNext,
}: {
  defaultValues?: Step1;
  onNext: (data: Step1) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <h2 className="text-lg font-semibold text-white">Personal Information</h2>
      <Field label="Full name" error={errors.full_name?.message}>
        <input
          {...register("full_name")}
          className={inputCls}
          placeholder="e.g. Thandiwe Mokoena"
          autoComplete="name"
        />
      </Field>
      <Field label="Mobile number" error={errors.phone?.message}>
        <input
          {...register("phone")}
          className={inputCls}
          placeholder="e.g. 0821234567"
          inputMode="tel"
          autoComplete="tel"
        />
      </Field>
      <Field label="Employment status" error={errors.employment_status?.message}>
        <select {...register("employment_status")} className={inputCls} defaultValue="">
          <option value="" disabled>
            Select one…
          </option>
          <option value="employed">Employed (full-time)</option>
          <option value="self_employed">Self-employed</option>
          <option value="unemployed">Unemployed</option>
          <option value="other">Other</option>
        </select>
      </Field>
      <div className="flex justify-end pt-2">
        <PrimaryButton type="submit">
          Continue <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </form>
  );
}

function StepTwo({
  defaultValues,
  onBack,
  onNext,
}: {
  defaultValues?: Step2;
  onBack: () => void;
  onNext: (data: Step2) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step2>({
    resolver: zodResolver(step2Schema),
    defaultValues: defaultValues ?? { amount: 1500 },
  });

  const amount = watch("amount") ?? 0;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <h2 className="text-lg font-semibold text-white">Loan Details</h2>

      <Field
        label="Requested amount (ZAR)"
        error={errors.amount?.message}
        hint="Maximum R3,000. Repayable within 30 days."
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            R
          </span>
          <input
            type="number"
            step={100}
            min={500}
            max={3000}
            {...register("amount", { valueAsNumber: true })}
            className={`${inputCls} pl-7`}
            placeholder="1500"
          />
        </div>
      </Field>

      <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm">
        <div className="flex items-center justify-between text-slate-300">
          <span>You're requesting</span>
          <span className="text-lg font-bold text-amber-300">
            R{Number.isFinite(amount) ? amount.toLocaleString("en-ZA") : 0}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Final terms subject to NCA affordability assessment.
        </p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <SecondaryButton type="button" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </SecondaryButton>
        <PrimaryButton type="submit">
          Continue <ArrowRight className="h-4 w-4" />
        </PrimaryButton>
      </div>
    </form>
  );
}

function StepThree({
  submitting,
  error,
  onBack,
  onSubmit,
}: {
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: (data: Step3) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3>({
    resolver: zodResolver(step3Schema),
    defaultValues: { popia_consent: false },
  });

  const fileReg = (name: keyof Step3) =>
    register(name, {
      setValueAs: (v) => (v instanceof FileList ? v.item(0) : v),
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <h2 className="text-lg font-semibold text-white">Document Upload</h2>
      <p className="-mt-2 text-xs text-slate-400">
        PDF, JPG, or PNG. Max 5MB per file.
      </p>

      <FileField
        label="ID copy"
        error={errors.id_copy?.message as string | undefined}
        {...fileReg("id_copy")}
      />
      <FileField
        label="Latest payslip"
        error={errors.payslip?.message as string | undefined}
        {...fileReg("payslip")}
      />
      <FileField
        label="3-month bank statement"
        error={errors.bank_statement?.message as string | undefined}
        {...fileReg("bank_statement")}
      />

      <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
        <input
          type="checkbox"
          {...register("popia_consent")}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-slate-900 text-amber-400 focus:ring-amber-400"
        />
        <span>
          I consent to NuDawn Financial Services collecting and processing my personal
          information for this loan inquiry in accordance with POPIA.
        </span>
      </label>
      {errors.popia_consent?.message && (
        <p className="-mt-3 text-xs text-red-400">{errors.popia_consent.message}</p>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <SecondaryButton type="button" onClick={onBack} disabled={submitting}>
          <ArrowLeft className="h-4 w-4" /> Back
        </SecondaryButton>
        <PrimaryButton type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>Submit application</>
          )}
        </PrimaryButton>
      </div>
    </form>
  );
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-b from-amber-400/10 to-transparent p-8 text-center shadow-2xl shadow-black/40">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-slate-950">
        <CheckCircle2 className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-white">Application received</h2>
      <p className="mt-2 text-sm text-slate-300">
        Thank you. A NuDawn consultant will be in touch on WhatsApp shortly to verify your
        details and finalise your application.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
        >
          Start another application
        </button>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

/* ---------- shared UI ---------- */

const inputCls =
  "w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-200">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const FileField = (() => {
  const Component = (
    {
      label,
      error,
      ...rest
    }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>,
    ref: React.Ref<HTMLInputElement>,
  ) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-200">{label}</label>
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-white/15 bg-slate-900/60 px-3 py-3 text-sm text-slate-300 hover:border-amber-400/50 hover:bg-slate-900">
        <Upload className="h-4 w-4 text-amber-400" />
        <input
          ref={ref}
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          className="block w-full text-xs text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-white/20"
          {...rest}
        />
      </label>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
  // eslint-disable-next-line react/display-name
  return require("react").forwardRef(Component) as (
    props: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement> & {
        ref?: React.Ref<HTMLInputElement>;
      },
  ) => JSX.Element;
})();

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", children, ...rest } = props;
  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", children, ...rest } = props;
  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
