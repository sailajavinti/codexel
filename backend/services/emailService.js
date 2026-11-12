
const sendEmail = async ({ action, to, name, link }) => {
  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.GOOGLE_SCRIPT_SECRET;

    if (!scriptUrl || !secret) {
      throw new Error("Google Apps Script environment variables are missing");
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret,
        action,
        to,
        name,
        link,
      }),
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script HTTP error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Email sending failed");
    }

    console.log(`Email sent successfully to ${to}`);

    return result;
  } catch (error) {
    console.error("Google Apps Script email error:", error.message);
    throw error;
  }
};

export default sendEmail;
