import nodemailer from 'nodemailer';

export const sendMail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW
    }
  });

  const mailOptions = {
    from: `"TechBuddy" <${process.env.NODEMAILER_EMAIL}>`,
    to: to,
    subject: subject,
    html: text
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log('Error sending email', error);
  }
};

export const sendResetPasswordMail = async (to: string, link: string) => {
  const subject = '🔐 Reset your password';
  const html = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="width: 100%;">
            <table role="presentation" width="600px" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f7f7; border-radius: 32px 32px 0 0; padding: 32px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="padding: 32px; background-color: white; border-radius: 15px;">
                  <h2 style="font-family: Arial, sans-serif; color: #007BFF; text-align: left;">🔐 Reset Your Password</h2>
                  <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555; text-align: left;">We received a request to reset your password. Click the button below to set a new password:</p>
                  <div style="text-align: left; margin: 20px 0;">
                    <a href="${link}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif; font-size: 16px;">🔑 Reset Password</a>
                  </div>
                  <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; text-align: left;">If the button doesn't work, click the link below:</p>
                  <a href="${link}" style="font-family: Arial, sans-serif; font-size: 14px; color: #007BFF; text-align: left; word-break: break-all;">${link}</a>
                  <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; text-align: left; margin-top: 20px;">Thank you for using our platform! 😊</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 32px;">
                  <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; text-align: left;">Best regards,</p>
                  <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; text-align: left;">The Team 🚀</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  await sendMail(to, subject, html);
};

export const sendVerificationMail = async (to: string, link: string) => {
  const subject = '✉️ Verify your email address';
  const html = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" style="width: 100%;">
              <table role="presentation" width="600px" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f7f7; border-radius: 32px 32px 0 0; padding: 32px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 32px; background-color: white; border-radius: 15px;">
                    <h2 style="font-family: Arial, sans-serif; color: #007BFF; text-align: left;">✉️ Verify Your Email</h2>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555; text-align: left;">Welcome! Please verify your email address by clicking the button below:</p>
                    <div style="text-align: left; margin: 20px 0;">
                      <a href="${link}" style="background-color: #28A745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif; font-size: 16px;">✅ Verify Email</a>
                    </div>
                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; text-align: left;">If the button doesn't work, click the link below:</p>
                    <a href="${link}" style="font-family: Arial, sans-serif; font-size: 14px; color: #007BFF; text-align: left; word-break: break-all;">${link}</a>
                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; text-align: left; margin-top: 20px;">Thank you for joining us! 🎉</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 32px;">
                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; text-align: left;">Best regards,</p>
                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; text-align: left;">The Team 🚀</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
  await sendMail(to, subject, html);
};

export const sendWelcomeMail = async (to: string) => {
  const subject = '🎉 Welcome to our platform!';
  const html = `
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td align="center" style="width: 100%;">
              <table role="presentation" width="600px" cellspacing="0" cellpadding="0" border="0" style="background-color: #f7f7f7; border-radius: 32px 32px 0 0; padding: 32px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td style="padding: 32px; background-color: white; border-radius: 15px;">
                    <h2 style="font-family: Arial, sans-serif; color: #333; text-align: left;">🎉 Welcome to Our Platform!</h2>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; color: #555; text-align: left;">We're thrilled to have you on board. Explore our features and enjoy the experience:</p>
                    <div style="text-align: left; margin: 20px 0;">
                      <a href=${process.env.APP_URL} style="background-color: #FFC107; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-family: Arial, sans-serif; font-size: 16px;">🎉 Get Started</a>
                    </div>
                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; text-align: left;">Thank you for choosing us! 😊</p>
                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; text-align: left;">Best regards,</p>
                    <p style="font-family: Arial, sans-serif; font-size: 14px; color: #555; text-align: left;">The Team 🚀</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
  await sendMail(to, subject, html);
};
