const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD
  },
  connectionTimeout: 60000
});

// Sending OTP for email verification (forgot password, password reset)
const sendVerificationCode = async (email, otp) => {
  try {
    // Define email content and options
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Request For Email Verification',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <p style="font-size: 16px;">Hi there,</p>

        <p style="font-size: 16px;">
          We received a request to reset your password. If you made this request, please enter the following verification code in the application to proceed:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <h1 style="font-size: 36px; color: #4CAF50; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>

        <p style="font-size: 16px; color: #555;">
          <strong>Note:</strong> This code will expire in 5 minutes. If you did not request a password reset, please ignore this email.
        </p>

        <p style="font-size: 16px;">
          Best regards,<br/>
          MealHub Team
        </p>

        <p style="font-size: 12px; color: #999;">
          If you have any questions or need further assistance, please contact our support team.
        </p>
      </div>
      `,
    };

    // Send the email with the OTP
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent:', info.response);
    return { success: true, message: 'Email sent successfully' };

  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Email could not be sent', error: error.message };
  }
};

module.exports = { sendVerificationCode };
