// utils/pdfGenerator.ts
import puppeteer from "puppeteer";

export async function generatePDF(htmlContent: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  // Set content and wait for network idle
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  // Generate PDF
  const pdfUint8Array = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20px",
      right: "20px",
      bottom: "20px",
      left: "20px",
    },
  });

  await browser.close();
  return Buffer.from(pdfUint8Array);
}
