import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center px-4 text-white text-center">
      <div>
        <div className="text-7xl mb-6">💔</div>
        <h1 className="text-3xl font-bold mb-3">Card Not Found</h1>
        <p className="text-white/70 mb-8 max-w-sm mx-auto">
          This greeting card doesn't exist or hasn't been published yet. Check the link and try again.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-white text-violet-700 font-semibold rounded-2xl hover:bg-gray-100 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
