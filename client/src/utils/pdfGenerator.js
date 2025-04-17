import jsPDF from 'jspdf';

export const generateQuizPDF = (quizData) => {
  const doc = new jsPDF();
  let yOffset = 20;

  // Add title with better styling
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 139); // Dark blue
  doc.text('Quiz Results', 105, yOffset, { align: 'center' });
  yOffset += 25;

  // Add quiz details with better formatting
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0); // Black
  doc.text(`Quiz Name: ${quizData.name || 'Unnamed Quiz'}`, 20, yOffset);
  yOffset += 10;
  doc.text(`Total Questions: ${quizData.questions?.length || 0}`, 20, yOffset);
  yOffset += 10;
  doc.text(`Total Marks: ${quizData.totalMarks || 0}`, 20, yOffset);
  yOffset += 10;
  doc.text(`Passing Marks: ${quizData.passingMarks || 0}`, 20, yOffset);
  yOffset += 10;
  doc.text(`Obtained Marks: ${quizData.obtainedMarks || 0}`, 20, yOffset);
  yOffset += 10;
  doc.text(`Verdict: ${quizData.verdict || 'Not Available'}`, 20, yOffset);
  yOffset += 10;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yOffset);
  yOffset += 20;

  
  return doc;
}; 