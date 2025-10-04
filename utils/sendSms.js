
export const sendSms = async (mobile, amount) => {
  try {
    const response = await fetch("http://192.168.113.188:3000/send-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: mobile,
        message: `Payment of ₹${amount} received successfully.`,
      }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error || "Failed to send SMS");
    return data;
  } catch (error) {
    console.error("SMS sending failed:", error.message);
    throw error;
  }
};
