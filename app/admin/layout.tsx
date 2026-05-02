import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      {/* Offset for desktop sidebar and mobile header */}
      <div className="md:pl-60 pt-14 md:pt-0">
        {children}
      </div>
    </div>
  );
}
