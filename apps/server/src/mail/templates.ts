export const mailTemplate = {
  mfaCode: (code: string) => `<!DOCTYPE html>
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
    </html>`,
  accountRequestConfirmationEmail: (email: string) => {
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
    return { subject, html };
  },
  adminInvitationEmail: ({
    email,
    token,
  }: {
    email: string;
    token: string;
  }) => {
    const subject = "Invitation à rejoindre Ma Routine Santé";
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
          <p>Vous avez été invité à rejoindre Ma Routine Santé. Pour accéder à votre compte, veuillez cliquer sur le lien ci-dessous :</p>
          <a href="${process.env.ADMIN_FRONTEND_URL}/auth/invitation?token=${token}">Accepter l'invitation</a>
        </div>
        <div class="footer">
          <p>— L'équipe Support</p>
        </div>
      </div>
    </body>
    </html>`;
    return { subject, html };
  },
  acceptRegistrationRequestEmail: (token: string) => {
    const subject = "Votre compte a été accepté ! ";
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
          <p>Votre compte a été accepté. Pour finaliser votre inscription, veuillez cliquer sur le lien ci-dessous :</p>
          <a href="${process.env.PRO_FRONTEND_URL}/auth/invitation?token=${token}">Finaliser votre inscription</a>
        </div>
        <div class="footer">
          <p>— L'équipe Support</p>
        </div>
      </div>
    </body>
    </html>`;
    return { subject, html };
  },
  proInvitePatientEmail: ({
    email,
    token,
    proName,
  }: {
    email: string;
    token: string;
    proName: string;
  }) => {
    const subject = "Invitation à rejoindre Ma Routine Santé";
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
          <p>${proName} vous a invité à rejoindre Ma Routine Santé. Pour valider la création de votre compte, veuillez cliquer sur le lien ci-dessous :</p>
          <a href="${process.env.PRO_FRONTEND_URL}/auth/invitation?token=${token}">Finaliser votre inscription</a>
        </div>
      </div>
    </body>
    </html>`;
    return { subject, html };
  },
};
