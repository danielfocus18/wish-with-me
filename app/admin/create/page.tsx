import AdminGuard from "@/components/admin/AdminGuard";
import GreetingEditor from "@/components/admin/GreetingEditor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreatePage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Create New Card</h1>
            <p className="text-sm text-gray-500">Design a beautiful greeting for someone special</p>
          </div>
        </div>
        <GreetingEditor />
      </div>
    </AdminGuard>
  );
}
