import jsPDF from "jspdf";

export const downloadAnalysisPDF = (analysis) => {
  const doc = new jsPDF();
  const margin = 15;
  let y = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;

  const addWrappedText = (text, fontSize = 11, gapAfter = 6) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += fontSize * 0.5;
    });
    y += gapAfter;
  };

  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.text("AI Resume Analysis Report", margin, y);
  y += 10;

  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Resume: ${analysis.resumeFileName}`, margin, y);
  y += 6;
  doc.text(`Date: ${new Date(analysis.createdAt || Date.now()).toLocaleString()}`, margin, y);
  y += 10;
  doc.setTextColor(0);

  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text(`Match Score: ${analysis.matchScore} / 100`, margin, y);
  y += 10;
  doc.setFont(undefined, "normal");

  if (analysis.summary) {
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("Summary", margin, y);
    y += 7;
    doc.setFont(undefined, "normal");
    addWrappedText(analysis.summary);
  }

  if (analysis.missingKeywords?.length) {
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("Missing Keywords", margin, y);
    y += 7;
    doc.setFont(undefined, "normal");
    addWrappedText(analysis.missingKeywords.join(", "));
  }

  if (analysis.strengths?.length) {
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("Strengths", margin, y);
    y += 7;
    doc.setFont(undefined, "normal");
    analysis.strengths.forEach((s) => addWrappedText(`• ${s}`, 11, 3));
    y += 3;
  }

  if (analysis.suggestions?.length) {
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text("Suggestions", margin, y);
    y += 7;
    doc.setFont(undefined, "normal");
    analysis.suggestions.forEach((s) => addWrappedText(`• ${s}`, 11, 3));
  }

  const safeName = (analysis.resumeFileName || "resume").replace(/\.[^/.]+$/, "");
  doc.save(`${safeName}-analysis.pdf`);
};
