"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Greeting } from "@/types";
import AdminGuard from "@/components/admin/AdminGuard";
import GreetingEditor from "@/components/admin/GreetingEditor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("greetings")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!error) setGreeting(data);
        setLoading(false);
      });
  }, [id]);

  return (
    <AdminGuard>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/admin/dashboard"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Card</h1>
            <p className="text-sm text-gray-500">Update and republish this greeting</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-violet-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : greeting ? (
          <GreetingEditor existing={greeting} />
        ) : (
          <p className="text-center text-gray-500 py-20">Card not found.</p>
        )}
      </div>
    </AdminGuard>
  );
}
