// import nodemailer from 'nodemailer';
// import allowCors from './allowCors';

// const handler = async (req, res) => {
//   if (req.method === 'POST') {
//     const { email, orderSummary } = req.body;

//     const orderDetails = orderSummary
//       .map(item => `
//         <div style="margin-bottom: 10px;">
//           <strong>${item.name}</strong><br>
//           Quantity: ${item.quantity}<br>
//           Price: $${item.price.toFixed(2)}<br>
//           <img src="${item.image}" alt="${item.name}" style="max-width: 100px; height: auto;"/>
//         </div>`)
//       .join('');

//     const htmlContent = `
//       <h1>Thank you for your order!</h1>
//       <p>Here are your order details:</p>
//       ${orderDetails}
//       <br>
//       <p>If you have any questions, feel free to contact us on 08156703395</p>
//       <p>Best regards,<br>IKYSLE</p>
//     `;

//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'Your Order Summary',
//       html: htmlContent,
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       res.status(200).json({ message: 'Email sent successfully!' });
//     } catch (err) {
//       res.status(500).json({ error: 'Error sending email' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// };

// export default allowCors(handler);


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
          <div style="margin-bottom: 10px;">
            <strong>${item.name}</strong><br>
            Quantity: ${item.quantity}<br>
            Price: $${item.price.toFixed(2)}<br>
            <img src="${item.image}" alt="${item.name}" style="max-width: 100px; height: auto;" />
          </div>`)
        .join('');

      const htmlContent = `
        <h1>Thank you for your order!</h1>
        <p>Here are your order details:</p>
        ${orderDetails}
        <p>Best regards,<br>IKYSLE</p>
      `;

      // Use correct Gmail transport config
      const transporter = nodemailer.createTransport({
        service: 'gmail',
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

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email sent successfully!' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[Email API Error]', error);
    res.status(500).json({ error: 'Internal server error while processing email.' });
  }
}