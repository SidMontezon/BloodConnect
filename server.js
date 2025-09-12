const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

const codes = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sid.montezon18@gmail.com',
    pass: 'akbi oltw qzst ydra'
  }
});

exports.send2faCode = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { email } = req.body;
    if (!email) return res.json({ success: false, message: "No email provided" });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codes[email] = code;

    const mailOptions = {
      from: 'sid.montezon18@gmail.com',
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
});

exports.verify2faCode = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { email, code } = req.body;
    if (codes[email] && codes[email] === code) {
      delete codes[email];
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});