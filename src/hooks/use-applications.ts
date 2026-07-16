import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type Application = {
  id: string;
  full_name: string;
  id_number: string;
  phone: string;
  email: string;
  employment_status: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchApplications() {
    setLoading(true);
    
    // Fetch all applications, newest first
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
    } else if (data) {
      setApplications(data);
    }
    
    setLoading(false);
  }

  // Automatically fetch when the hook is first used
  useEffect(() => {
    fetchApplications();
  }, []);

  return { applications, loading, refetch: fetchApplications };
}