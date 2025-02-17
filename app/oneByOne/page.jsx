"use client"
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function OneByOne() {
  const [pdfFiles, setPdfFiles] = useState([]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        setPdfFiles([...pdfFiles, reader.result]);
      };
    }
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) {
      alert("Please upload at least two PDF files.");
      return;
    }

    const mergedPdf = await PDFDocument.create();
    for (let file of pdfFiles) {
      const pdfDoc = await PDFDocument.load(file);
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
      {pdfFiles.length === 0 ? (
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      ) : (
        <>
          {pdfFiles.map((_, index) => (
            <p key={index}>PDF {index + 1} uploaded.</p>
          ))}
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button onClick={mergePDFs} className="bg-blue-500 text-white px-4 py-2 rounded">
            Merge and Save PDFs
          </button>
        </>
      )}
    </div>
  );
}
