import { createTransport } from 'nodemailer';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email, orderSummary } = req.body;

    // Create the Nodemailer transport object
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: import.meta.env.VITE_EMAIL, // Use your Gmail address
        pass: import.meta.env.VITE_PASSWORD,  // Use your Gmail app-specific password
      },
    });

    const orderDetails = orderSummary
      .map(item => `${item.item} x${item.quantity} - $${item.price}`)
      .join('\n');

    const mailOptions = {
      from: 'adeyanjutomide@gmail.com', // sender address
      to: email, // receiver's email address
      subject: 'Your Order Summary',
      text: `Thank you for your order! Here are your order details:\n\n${orderDetails}`,
    };

    try {
      // Send the email
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      return res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};
