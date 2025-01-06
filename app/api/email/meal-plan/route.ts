import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import { renderMealPlanToHTML } from "@/util/renderMealPlan";

// API route: POST handler for sending email
export async function POST(req: NextRequest) {
  try {
    const { mealPlanData, recipesData, clientId, toEmail, givenName } =
      await req.json();

    // Generate Static HTML
    const componentHTML = renderMealPlanToHTML(
      mealPlanData,
      recipesData,
      clientId
    );

    // Generate PDF
    const generatePDF = async (htmlContent: string): Promise<Buffer> => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent);
      const pdfUint8Array = await page.pdf({ format: "A4" }); // Uint8Array
      await browser.close();

      // Convert Uint8Array to Buffer
      return Buffer.from(pdfUint8Array);
    };

    const pdfBuffer = await generatePDF(componentHTML);

    // Configure Email Transport
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MEAL_PLANNER_SEND_EMAIL,
        pass: process.env.MEAL_PLANNER_SEND_PASSWORD, // Use environment variables for sensitive data
      },
    });

    // Email Options
    const mailOptions = {
      from: process.env.MEAL_PLANNER_SEND_EMAIL,
      to: toEmail,
      subject: `${givenName}'s - Meal Plan`,
      html: componentHTML, // HTML content in the email body
      attachments: [
        {
          filename: `MealPlan-${givenName}.pdf`,
          content: pdfBuffer, // Attach the PDF
        },
      ],
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email", error: error.message },
      { status: 500 }
    );
  }
}
