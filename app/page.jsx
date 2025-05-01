"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center p-6 gap-4">
      <h1 className="text-2xl font-bold">Welcome to PDF Merger</h1>
      <button 
        onClick={() => router.push("/oneByOne")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to One by One Upload
      </button>
      <button 
        onClick={() => router.push("/bulkUpload")}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Go to Bulk Upload
      </button>
      <button 
        onClick={() => router.push("/jpegToPng")}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Jpeg to PNG Converter
      </button>
    </div>
  );
}
