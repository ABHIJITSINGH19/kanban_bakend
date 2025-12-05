const baseEmailTemplate = (content) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
          ${content}
        </div>
      </body>
    </html>
  `;
};

const buttonStyle = (backgroundColor = "#4CAF50") => {
  return `display: inline-block; padding: 12px 24px; background-color: ${backgroundColor}; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold;`;
};

export const emailVerificationTemplate = (userName, verificationURL) => {
  const content = `
    <div style="text-align: center;">
      <h2 style="color: #333; margin-bottom: 20px;">Welcome to HRM System!</h2>
      <p style="color: #666; font-size: 16px; line-height: 1.6;">Hello ${userName},</p>
      <p style="color: #666; font-size: 16px; line-height: 1.6;">
        Thank you for signing up. Please verify your email address by clicking the button below:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationURL}" style="${buttonStyle("#4CAF50")}">
          Verify Email
        </a>
      </div>
      <p style="color: #666; font-size: 14px; line-height: 1.6;">
        Or copy and paste this link into your browser:
      </p>
      <p style="color: #4CAF50; font-size: 12px; word-break: break-all; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
        ${verificationURL}
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        This link will expire in 24 hours.
      </p>
      <p style="color: #999; font-size: 12px;">
        If you didn't create an account, please ignore this email.
      </p>
    </div>
  `;
  return baseEmailTemplate(content);
};

export const passwordResetTemplate = (userName, resetURL) => {
  const content = `
    <div style="text-align: center;">
      <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
      <p style="color: #666; font-size: 16px; line-height: 1.6;">Hello ${userName},</p>
      <p style="color: #666; font-size: 16px; line-height: 1.6;">
        You requested to reset your password. Click the button below to reset it:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" style="${buttonStyle("#f44336")}">
          Reset Password
        </a>
      </div>
      <p style="color: #666; font-size: 14px; line-height: 1.6;">
        Or copy and paste this link into your browser:
      </p>
      <p style="color: #f44336; font-size: 12px; word-break: break-all; background-color: #f9f9f9; padding: 10px; border-radius: 4px;">
        ${resetURL}
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        This link will expire in 10 minutes.
      </p>
      <p style="color: #999; font-size: 12px;">
        If you didn't request a password reset, please ignore this email.
      </p>
    </div>
  `;
  return baseEmailTemplate(content);
};

export const emailVerificationMessage = (verificationURL) => {
  return `Please verify your email by clicking on this link: ${verificationURL}\n\nIf you didn't create an account, please ignore this email.`;
};

export const passwordResetMessage = (resetURL) => {
  return `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}\n\nIf you didn't forget your password, please ignore this email.`;
};
