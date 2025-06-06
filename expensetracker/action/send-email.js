import { Resend } from "resend";

export async function sendEmail({to, subject, react}) {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set in environment variables");
        return { success: false, error: "Email service not configured" };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    try {
        console.log(`Attempting to send email to: ${to}`);
        const data = await resend.emails.send({
            from: "Finance App <onboarding@resend.dev>",
            to,
            subject,
            react
        });
        console.log("Email sent successfully:", data);
        return { success: true, data };
    } catch(error) {
        console.error("Failed to send email:", error);
        return { 
            success: false, 
            error: error.message,
            details: error
        };
    }
}