import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      name: "NuDawn Financial Services",
      slogan: "New Tomorrow, Together.",
      areaServed: "ZA",
      address: { "@type": "PostalAddress", addressCountry: "ZA" },
      telephone: "+27-00-000-0000",
      email: "hello@nudawn.co.za",
    },
    {
      "@type": "FinancialProduct",
      name: "NuDawn Payday Loan",
      provider: { "@type": "Organization", name: "NuDawn Financial Services" },
      description: "Short-term payday loans from R500 to R3,000 with a fixed 30-day term.",
      feesAndCommissionsSpecification:
        "5% monthly interest, NCA initiation fee, R60 monthly service fee (all fees +15% VAT).",
    },
    {
      "@type": "InsuranceAgency",
      name: "NuDawn Funeral Cover",
      description: "Family funeral cover from R42/month, up to R30,000 benefit, covering up to 16 family members.",
      areaServed: "ZA",
    },
  ],
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-navy">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-gold-gradient px-4 py-2 text-sm font-semibold text-navy"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-gold-gradient px-4 py-2 text-sm font-semibold text-navy"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NuDawn Financial Services | Payday Loans & Funeral Cover" },
      {
        name: "description",
        content:
          "NuDawn Financial Services — NCR-registered payday loans (R500–R3,000) and FSCA-authorised funeral cover from R42/month for up to 16 family members.",
      },
      { name: "author", content: "NuDawn Financial Services" },
      { property: "og:title", content: "NuDawn Financial Services | Payday Loans & Funeral Cover" },
      {
        property: "og:description",
        content: "Accessible payday loans and affordable funeral cover for South Africans. New Tomorrow, Together.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "NuDawn Financial Services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0F172A" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/__l5e/assets-v1/c8084304-092b-4911-a661-efccd58c739f/nudawn-logo.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(JSONLD) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
