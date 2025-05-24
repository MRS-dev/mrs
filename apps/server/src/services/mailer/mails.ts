import { sendMail } from "./sendMail";

export const sendWelcomeEmail = async ({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}) => {
  try {
    const subject = "Bienvenue sur notre plateforme!";
    const html = `
      <h1>Bienvenue, ${firstName}!</h1>
      <p>Nous sommes ravis de vous compter parmi nous. Profitez de nos services dès maintenant.</p>
    `;
    return await sendMail({ to: email, subject, html });
  } catch (error: any) {
    console.error("Error sending welcome email:", error.message);
    throw error;
  }
};

export const sendInvitationEmail = async ({
  email,
  link,
}: {
  email: string;
  link: string;
}) => {
  try {
    const subject = "Bienvenue sur notre plateforme!";
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #333;
        }
        .content {
          text-align: left;
          color: #333;
          font-size: 16px;
        }
        .button {
          display: inline-block;
          margin: 20px auto;
          padding: 10px 20px;
          background-color: #007BFF;
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #888;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Our Service!</h1>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p>We're excited to have you join us! Please click the button below to create your account and start exploring.</p>
          <p>If you did not request this email, please ignore it.</p>
          <a href=${link} class="button" target="_blank" style="display: inline-block; text-align: center; margin: 20px auto; padding: 10px 20px; background-color: #007BFF; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 5px;">Create Account</a>
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to contact us.</p>
        </div>
      </div>
    </body>
    </html>`;

    return await sendMail({ to: email, subject, html });
  } catch (error: any) {
    console.error("Error sending invitation email:", error.message);
    throw error;
  }
};

export const sendMfaCodeEmail = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  try {
    const subject = "Bienvenue sur notre plateforme!";
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #333;
        }
        .content {
          text-align: left;
          color: #333;
          font-size: 16px;
        }
        .code {
          display: block;
          margin: 20px auto;
          padding: 10px;
          font-size: 20px;
          text-align: center;
          background-color: #f4f4f4;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-weight: bold;
          color: #007BFF;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #888;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Two-Factor Authentication Code</h1>
        </div>
        <div class="content">
          <p>Hi there,</p>
          <p>To complete your sign-in or verification process, use the following code:</p>
          <div class="code">${code}</div>
          <p>This code will expire in 10 minutes. If you did not request this email, please ignore it.</p>
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to contact us.</p>
        </div>
      </div>
    </body>
    </html>`;

    return await sendMail({ to: email, subject, html });
  } catch (error: any) {
    console.error("Error sending MFA code email:", error.message);
    throw error;
  }
};

export const sendAccountRequestConfirmationEmail = async ({
  email,
}: {
  email: string;
}) => {
  try {
    const subject = "Demande de création de compte reçue !";
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #333;
        }
        .content {
          text-align: left;
          color: #333;
          font-size: 16px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #888;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bienvenue et merci pour votre demande !</h1>
        </div>
        <div class="content">
          <p>Bonjour,</p>
          <p>Nous avons bien reçu votre demande de création de compte sur notre plateforme. Merci de votre intérêt et de votre confiance.</p>
          <p>Notre équipe va examiner attentivement les informations transmises dans votre formulaire de création. Une fois la vérification terminée, nous reviendrons vers vous avec les prochaines étapes.</p>
          <p>Si vous avez des questions en attendant, n'hésitez pas à nous contacter. Nous sommes là pour vous aider.</p>
          <p>Merci encore et à très bientôt !</p>
        </div>
        <div class="footer">
          <p>— L'équipe Support</p>
        </div>
      </div>
    </body>
    </html>`;

    return await sendMail({ to: email, subject, html });
  } catch (error: any) {
    console.error(
      "Error sending account request confirmation email:",
      error.message
    );
    throw error;
  }
};

export const sendResetPasswordEmail = async ({
  email,
  resetToken,
}: {
  email: string;
  resetToken: string;
}) => {
  try {
    const subject = "Demande de création de compte reçue !";
    const html = `<!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #333;
          }
          .content {
            text-align: left;
            color: #333;
            font-size: 16px;
          }
          .button-container {
            text-align: center;
            margin: 20px 0;
          }
          .button {
            background-color: #007BFF;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #888;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Réinitialisation de votre mot de passe</h1>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe. Pour procéder, veuillez cliquer sur le bouton ci-dessous :</p>
            <div class="button-container">
              <a
                href="${process.env.PRO_FRONTEND_URL}/reset-password?token=${resetToken}"
                class="button"
              >
                Réinitialiser mon mot de passe
              </a>
            </div>
            <p>
              Ce lien est valable pendant une durée limitée. Si vous n'avez pas initié cette demande, veuillez ignorer cet email.
            </p>
          </div>
          <div class="footer">
            <p>— L'équipe Support</p>
          </div>
        </div>
      </body>
    </html>`;

    return await sendMail({ to: email, subject, html });
  } catch (error: any) {
    console.error("Error sending reset password email:", error.message);
    throw error;
  }
};
