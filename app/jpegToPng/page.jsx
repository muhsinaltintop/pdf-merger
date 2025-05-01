'use client';

import ImageConverter from './ImageConverter';

export default function Page() {
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-6">JPEG to PNG Converter</h1>
      <ImageConverter />
    </main>
  );
}
