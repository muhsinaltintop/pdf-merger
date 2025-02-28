"use client";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function BulkUpload() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    processFiles(files);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = async (files) => {
    const pdfData = await Promise.all(
      files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = () => resolve({ name: file.name, data: reader.result });
        });
      })
    );
    setPdfFiles((prev) => [...prev, ...pdfData]);
  };

  const removeFile = (index) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      alert("Please upload at least two PDF files.");
      return;
    }

    const mergedPdf = await PDFDocument.create();
    for (let file of pdfFiles) {
      const pdfDoc = await PDFDocument.load(file.data, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    saveAs(blob, "merged.pdf");
  };

  return (
    <div className="flex flex-col items-center p-6 gap-4">
      <h1 className="text-2xl font-bold">PDF Merger Tool</h1>
      <div
        className={`w-80 h-32 flex items-center justify-center border-2 border-dashed p-4 ${dragging ? 'bg-gray-200' : 'bg-white'}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {dragging ? "Drop PDFs here" : "Drag & Drop PDFs here or Click to Upload"}
      </div>
      <input type="file" accept="application/pdf" multiple onChange={handleFileChange} className="hidden" id="fileInput" />
      <label htmlFor="fileInput" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
        Select PDFs
      </label>
      {pdfFiles.length > 0 && (
        <>
          {pdfFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-2">
              <p>{file.name} uploaded.</p>
              <button onClick={() => removeFile(index)} className="text-red-500">✖</button>
            </div>
          ))}
          <button onClick={mergePDFs} className="bg-green-500 text-white px-4 py-2 rounded">
            Merge and Save PDFs
          </button>
        </>
      )}
    </div>
  );
}
