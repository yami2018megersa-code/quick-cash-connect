import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useApplications, type Application } from "@/hooks/use-applications";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Lock, LogOut, FileText, ExternalLink, User, Phone, Mail, Briefcase, Download } from "lucide-react";
import { Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Command Center | NuDawn" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-dawn grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-navy" /></div>;
  }

  if (!session) return <LoginScreen />;
  return <AdminDashboard session={session} />;
}

// ==========================================
// 1. THE LOGIN SCREEN
// ==========================================
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) toast.error(error.message);
    else toast.success("Authentication successful");
    
    setIsLoggingIn(false);
  };

  return (
    <div className="min-h-screen bg-dawn flex flex-col items-center justify-center p-4">
      <div className="mb-8"><Logo /></div>
      <Card className="w-full max-w-md shadow-elegant border-border/50 bg-secondary/20 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-navy/10 mb-4 mx-auto">
            <Lock className="h-6 w-6 text-navy" />
          </div>
          <CardTitle className="text-2xl text-center text-navy font-bold tracking-tight">Admin Portal</CardTitle>
          <p className="text-center text-sm text-muted-foreground">Enter your credentials to access the secure vault</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@nudawn.co.za" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-background/50" />
            </div>
            <Button type="submit" className="w-full bg-navy text-white hover:bg-navy/90 mt-2" disabled={isLoggingIn}>
              {isLoggingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authenticate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ==========================================
// 2. THE COMMAND CENTER (With Inspector Sheet)
// ==========================================
function AdminDashboard({ session }: { session: Session }) {
  const { applications, loading: appsLoading } = useApplications();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  
  // Document State
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  // Tracks which document and which action is currently loading
  const [actionDocId, setActionDocId] = useState<{id: string, action: 'view' | 'download'} | null>(null);

  const fmt = (n: number) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);

  // Fetch documents when an application is selected
  useEffect(() => {
    if (selectedApp) {
      const fetchDocs = async () => {
        setLoadingDocs(true);
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("application_id", selectedApp.id);
        
        if (error) toast.error("Failed to load documents");
        else setDocuments(data || []);
        
        setLoadingDocs(false);
      };
      fetchDocs();
    } else {
      setDocuments([]);
    }
  }, [selectedApp]);

  // Request the VIP Pass from the Edge Function
  const handleDocumentAction = async (filePath: string, docId: string, action: 'view' | 'download') => {
    try {
      setActionDocId({ id: docId, action });
      const { data, error } = await supabase.functions.invoke("get-document-url", {
        body: { file_path: filePath, download: action === 'download' }
      });

      if (error) throw error;
      
      // Open the URL. If it's a view, it opens a tab. If it's a download, it saves the file.
      if (data?.url) window.open(data.url, "_blank");
      
    } catch (error) {
      console.error(error);
      toast.error("Security block: Could not authorize document request");
    } finally {
      setActionDocId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'approved': return <Badge className="bg-emerald-100 text-emerald-800">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy border-b border-navy/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-white/40 font-mono text-sm ml-4 border-l border-white/20 pl-4">v2.0.1_SECURE</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/80">
          <span>{session.user.email}</span>
          <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()} className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 mt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy">Incoming Applications</h1>
            <p className="text-muted-foreground mt-1">Manage and review loan requests.</p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1 bg-white">{applications.length} Total Records</Badge>
        </div>
        
        <Card className="shadow-sm border-border/50">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appsLoading ? (
                <TableRow><TableCell colSpan={6} className="h-48 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
              ) : applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{new Date(app.created_at).toLocaleDateString('en-ZA')}</TableCell>
                  <TableCell className="font-medium text-navy">{app.full_name}</TableCell>
                  <TableCell className="font-mono text-xs">{app.id_number}</TableCell>
                  <TableCell className="font-semibold">{fmt(app.amount)}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                      <FileText className="h-4 w-4 mr-2" /> Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>

      {/* The Inspector Sheet (Slide-out Panel) */}
      <Sheet open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l-border/50 shadow-elegant">
          {selectedApp && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-2xl text-navy">{selectedApp.full_name}</SheetTitle>
                    <SheetDescription>Application Details & Documents</SheetDescription>
                  </div>
                  {getStatusBadge(selectedApp.status)}
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Details Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Applicant Info</h4>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-3"><User className="h-4 w-4 text-primary" /> <span className="font-mono">{selectedApp.id_number}</span></div>
                    <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /> <span>{selectedApp.phone}</span></div>
                    <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /> <span>{selectedApp.email}</span></div>
                    <div className="flex items-center gap-3"><Briefcase className="h-4 w-4 text-primary" /> <span className="capitalize">{selectedApp.employment_status.replace('_', ' ')}</span></div>
                  </div>
                </div>

                <Separator />

                {/* Loan Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Loan Request</h4>
                  <div className="bg-secondary/20 p-4 rounded-lg border border-border/50">
                    <p className="text-3xl font-bold text-navy">{fmt(selectedApp.amount)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Requested on {new Date(selectedApp.created_at).toLocaleString('en-ZA')}</p>
                  </div>
                </div>

                <Separator />

                {/* Documents Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Vault Documents</h4>
                  {loadingDocs ? (
                    <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin mr-2" /> Decrypting records...</div>
                  ) : documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No documents found.</p>
                  ) : (
                    <div className="grid gap-2">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-border rounded-lg shadow-sm">
                          
                          {/* Left side: The Icon and File Name */}
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-primary/10 p-2 rounded">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium truncate">
                              {/* Using a fallback here just in case your DB uses 'name' instead of 'file_name' */}
                              {doc.file_name || doc.name || 'Application Document'}
                            </span>
                          </div>

                          {/* Right side: The Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              title="View Document"
                              // Note: We are correctly using doc.path here!
                              onClick={() => handleDocumentAction(doc.storage_path, doc.id, 'view')}
                              disabled={actionDocId !== null}
                            >
                              {actionDocId?.id === doc.id && actionDocId?.action === 'view' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <ExternalLink className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              title="Download Document"
                              // Note: We are correctly using doc.path here!
                              onClick={() => handleDocumentAction(doc.storage_path, doc.id, 'download')}
                              disabled={actionDocId !== null}
                            >
                              {actionDocId?.id === doc.id && actionDocId?.action === 'download' ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}