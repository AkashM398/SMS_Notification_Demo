import twilio from "twilio";

export default function sendMessage(req, res) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  const client = twilio(accountSid, token);
  const { phone, eventMessage } = req.body;
  console.log("eventMessage", eventMessage);
  client.messages
    .create({
      body:
        (eventMessage == "" ? null : eventMessage) ||
        'Thanks for submitting the form. Now try pressing the "Click Here" button on the website',
      from: twilioPhoneNumber,
      to: phone,
    })
    .then((message) => {
      console.log(message);
      res.json({
        success: true,
        message,
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
      });
    });
}
