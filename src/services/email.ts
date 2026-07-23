/**
 * Email dispatch helper using Web3Forms public API
 */
export const sendNotificationEmail = async (
  subject: string,
  details: Record<string, string>
): Promise<boolean> => {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    console.warn("VITE_WEB3FORMS_ACCESS_KEY is not defined. Email dispatch skipped.");
    return false;
  }

  // Format details as a clean, highly readable email message body
  let message = "A new submission has been received from the IoT Club portal.\n\n";
  message += "--- DETAILS ---\n";
  for (const [key, value] of Object.entries(details)) {
    if (value) {
      // Human-readable key labeling
      const formattedKey = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      message += `${formattedKey}: ${value}\n`;
    }
  }
  message += "\n---------------\n";
  message += "This email was automatically generated and sent to iotclub@vitbhopal.ac.in.";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: subject,
        from_name: "IoT Club Portal Alerts",
        to_email: "iotclub@vitbhopal.ac.in",
        message: message
      })
    });
    
    const result = await response.json();
    return !!result.success;
  } catch (error) {
    console.error("Failed to dispatch email alert:", error);
    return false;
  }
};
