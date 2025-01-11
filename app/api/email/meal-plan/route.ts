import { NextRequest, NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";
import { generateMealPlanEmail } from "@/app/components/email-templates/meal-plan-email";
import { generatePDF } from "@/util/pdf-generator";

// Initialize SendGrid with your API key
sendgrid.setApiKey(process.env.SENDGRID_API_KEY as string);

// API route: POST handler for sending email
export async function POST(request: NextRequest) {
  try {
    const {
      mealPlanHtml,
      mealPlanData,
      recipesData,
      clientId,
      toEmail,
      givenName,
    } = await request.json();

    // Generate email HTML content
    const htmlContent = await generateMealPlanEmail({
      mealPlanData,
      recipesData,
      clientId,
      givenName,
    });

    // Generate PDF
    const pdfBuffer = await generatePDF(mealPlanHtml);

    // Convert PDF buffer to base64
    const pdfAttachment = {
      content: pdfBuffer.toString("base64"),
      filename: "meal-plan.pdf",
      type: "application/pdf",
      disposition: "attachment",
    };

    // Configure email message
    const msg = {
      to: toEmail,
      from: process.env.SENDGRID_ADMIN_SENDER_EMAIL as string, // Verified sender email
      subject: `${givenName}'s - Meal Plan`,
      html: htmlContent,
      attachments: [pdfAttachment],
    };

    // Send email
    const sent = await sendgrid.send(msg);

    return NextResponse.json({
      message: "Email sent successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email", error: error.message },
      { status: 500 }
    );
  }
}
