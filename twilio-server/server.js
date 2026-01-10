const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NO } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

app.get("/test",(req,res)=>
{
  res.json({message:"Server is reachable"});
})


app.post("/send-sms", async (req, res) => {
  try {
    const { to, amount, name } = req.body;

    if (!to || !amount || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const body = `Hi ${name}, ₹${amount} has been credited to your account successfully. - PaymentApp`;

    const message = await client.messages.create({
      body,
      from: TWILIO_NO,
      to,
    });

    res.json({ success: true, sid: message.sid });
  } catch (error) {
    console.error("Error sending sms:", error);
    res.status(500).json({ error: "Failed to send sms" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
