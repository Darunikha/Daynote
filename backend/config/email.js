const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = process.env;

// Sending reset emails is entirely optional, same as Cloudinary uploads. If
// the SMTP keys are missing, the forgot-password flow still works - it just
// hands the reset link back in the API response instead of emailing it, so
// the app is fully usable without any mail provider configured.
const isEmailConfigured = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);

const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

/**
 * Sends the "reset your password" email. Only called when isEmailConfigured
 * is true - callers should fall back to returning the link directly when it
 * is not.
 */
const sendPasswordResetEmail = (to, resetUrl) =>
  transporter.sendMail({
    from: EMAIL_FROM || SMTP_USER,
    to,
    subject: 'Reset your Daynote password',
    text: `We received a request to reset your Daynote password.\n\nReset it here (this link expires in 1 hour):\n${resetUrl}\n\nIf you did not ask for this, you can safely ignore this email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #3E302C;">
        <h2 style="color: #6B4B5A;">Reset your password</h2>
        <p>We received a request to reset your Daynote password. This link expires in 1 hour.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block; background:#E8B4B8; color:#4A3038; padding:10px 20px; border-radius:999px; text-decoration:none;">
            Reset password
          </a>
        </p>
        <p style="color: #8A766A; font-size: 13px;">If you did not ask for this, you can safely ignore this email.</p>
      </div>
    `,
  });

module.exports = { isEmailConfigured, sendPasswordResetEmail };
