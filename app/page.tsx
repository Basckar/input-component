import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          تسک ۲: کامپوننت Input
        </h1>
        <p className="text-gray-600 mb-6">
          کامپوننت ورودی با اعتبارسنجی real-time
        </p>
        <Link 
          href="/form" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ورود به فرم
        </Link>
      </div>
    </div>
  );
}