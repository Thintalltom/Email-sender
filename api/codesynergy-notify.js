import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    if (req.method === "POST") {
      const { fullName, Email, Number, Course } = req.body;
      
      
      if (!Email || !fullName || !Number || !Course) {
        return res.status(400).json({ error: 'Invalid request payload' });
      }

      const orderDetails = `
        <div style="
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          background-color: #f9f9f9;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        ">
          
               style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; margin-right: 15px;" />
          <div style="flex: 1;">
            <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333;">Full Name:</p>
            <p style="margin: 5px 0 0; font-size: 14px; color: #555;">
             Email Address:<span style="color:#000;">${Email}</span><br>
             Number:<span style="color:#000;">${Number}</span><br>
             Course of Interest:<span style="color:#000;">${Course}</span>
            </p>
          </div>
        </div>
      `;

      const htmlContent = `
        <h1> New Class Subscriber Codesynergy!</h1>
        <p>Here is the Subscriber's details:</p>
        ${orderDetails}
        <p>Best regards,<br>CodeSynergy</p>
      `;

      // Use correct Gmail transport config
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'New Client Request!',
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Email sent successfully!' });
    }


  } catch (error) {
    console.error('[Email API Error]', error);
    res.status(500).json({ error: error });
  }
}