// hrshnk-56/gen-ai-h2s/Gen-AI-H2S-e4b2d161f93b4d62888c5bbaa8763f3ebd19ebc2/jurify-frontend/src/utils/downloadUtils.js
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Downloads the given text content as a PDF file.
 * @param {string} content The text to include in the PDF.
 * @param {string} filename The name of the file to save.
 */
export const downloadAsPdf = (content, filename = 'simplified-document.pdf') => {
  const doc = new jsPDF();
  
  // Set properties
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(12);
  
  // Add content, handling page breaks
  const lines = doc.splitTextToSize(content, 180); // 180 is the max width in mm
  doc.text(lines, 15, 15);
  
  doc.save(filename);
};

/**
 * Downloads the given text content as a DOCX file.
 * @param {string} content The text to include in the DOCX.
 * @param {string} filename The name of the file to save.
 */
export const downloadAsDocx = (content, filename = 'simplified-document.docx') => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: content,
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, filename);
  });
};