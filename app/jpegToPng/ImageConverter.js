'use client';

import { useState } from 'react';

export default function ImageConverter() {
  const [files, setFiles] = useState([]);
  const [converted, setConverted] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type === 'image/jpeg' || file.type === 'image/jpg');
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(file => file.type === 'image/jpeg' || file.type === 'image/jpg');
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertImages = async () => {
    const convertedList = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      convertedList.push({ name: file.name.replace(/\.[^/.]+$/, '.png'), url });
    }

    setConverted(convertedList);
  };

  return (
    <div className="p-6 space-y-4">
      <div
        className="border-2 border-dashed border-gray-400 p-8 text-center rounded-lg"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <p className="mb-2">Drag and drop JPEG files here</p>
        <input type="file" multiple accept=".jpg,.jpeg" onChange={handleChange} />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Selected Files</h2>
          <ul>
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
                <span>{file.name}</span>
                <button onClick={() => removeFile(index)} className="text-red-600 hover:underline">Remove</button>
              </li>
            ))}
          </ul>
          <button
            onClick={convertImages}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Convert All to PNG
          </button>
        </div>
      )}

      {converted.length > 0 && (
        <div className="mt-6 space-y-2">
          <h2 className="text-lg font-semibold">Converted Images</h2>
          {converted.map((img, idx) => (
            <div key={idx}>
              <img src={img.url} alt={img.name} className="max-w-xs border rounded" />
              <a href={img.url} download={img.name} className="text-blue-600 hover:underline block mt-1">
                Download {img.name}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
