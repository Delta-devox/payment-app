require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

app.post('/send-sms',async(req,res)=>
{
    const {to,message} = req.body;

     if (!to || !message) {
    return res.status(400).json({ success: false, error: "Missing 'to' or 'message' in request body" });
    }

    try{
        const msg = await client.messages.create({
            body:message,
            from:fromNumber,
            to:to,
        });
        res.json({success:true, sid:msg.sid});
    }
    catch(error)
    {
        console.error("Error sending sms",error)
        res.status(500).json({success:false,error:error.message});
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
