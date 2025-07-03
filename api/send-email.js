import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'POST') {
      const { email, orderSummary } = req.body;

      if (!email || !Array.isArray(orderSummary)) {
        return res.status(400).json({ error: 'Invalid request payload' });
      }

     const orderDetails = orderSummary
  .map(item => `
    <div style="
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      background-color: #f9f9f9;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    ">
      <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">
        ${item.subject}
      </p>
      <p style="margin: 5px 0 0; font-size: 14px; color: #555;">
        ${item.name}
      </p>
      <p style="margin: 5px 0 0; font-size: 14px; color: #555;">
        ${item.email}
      </p>
      <p style="margin: 5px 0 0; font-size: 14px; color: #555; white-space: pre-wrap;">
        ${item.message}
      </p>
    </div>
  `)
  .join('');

      

      const htmlContent = `
        <h1>Hey Tomide, hey have an email from a client</h1>
        <p>Here are the clients details:</p>
        ${orderDetails}
        <p>Best regards</p>
      `;

      // Use correct Gmail transport config
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'You received mail from a client',
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email sent successfully!' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[Email API Error]', error);
    res.status(500).json({ error: 'Internal server error while processing email.' });
  }
}