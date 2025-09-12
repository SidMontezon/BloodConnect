const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const codes = {}; // In-memory storage for demo

// Configure your email here
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sid.montezon18@gmail.com',
    pass: 'akbi oltw qzst ydra'
  }
});

app.post('/send-2fa-code', (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "No email provided" });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes[email] = code;

  const mailOptions = {
    from: 'sid.montezon18@gmail.com', // Use your Gmail here
    to: email,
    subject: 'Your 2FA Code',
    text: `Your 2FA code is: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

app.post('/verify-2fa-code', (req, res) => {
  const { email, code } = req.body;
  if (codes[email] && codes[email] === code) {
    delete codes[email];
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(3000, () => {
  console.log('2FA backend running on http://localhost:3000');
});