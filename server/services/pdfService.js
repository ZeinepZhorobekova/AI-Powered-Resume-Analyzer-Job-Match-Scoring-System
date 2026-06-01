const pdfParse = require('pdf-parse');

const extractText = async (buffer) => {
  let data;
  try {
    data = await pdfParse(buffer);
  } catch {
    throw new Error('Could not read the PDF. Make sure it is a text-based PDF, not a scanned image.');
  }
  const text = data.text.trim();
  if (!text) throw new Error('No readable text found in the PDF. Make sure it is not a scanned/image-only file.');
  return text;
};

module.exports = { extractText };
