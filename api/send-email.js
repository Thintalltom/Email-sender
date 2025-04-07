// /api/send-email.js

import nodemailer from 'nodemailer';
import allowCors from './allowCors';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, orderSummary } = req.body;

    const orderDetails = orderSummary
      .map(item => `
        <div style="margin-bottom: 10px;">
          <strong>${item.name}</strong><br>
          Quantity: ${item.quantity}<br>
          Price: $${item.price.toFixed(2)}<br>
          <img src="${item.image}" alt="${item.name}" style="max-width: 100px; height: auto;"/>
        </div>`)
      .join('');

    const htmlContent = `
      <h1>Thank you for your order!</h1>
      <p>Here are your order details:</p>
      ${orderDetails}
      <br>
      <p>If you have any questions, feel free to contact us on 08156703395</p>
      <p>Best regards,<br>IKYSLE</p>
    `;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your Order Summary',
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (err) {
      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default allowCors(handler);