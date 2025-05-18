import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY || "f9f16aec6c764431b9f9666780601565",
  process.env.MAILJET_API_SECRET || "aa19e9795cfc85ba377a6045f941a3ab"
);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendMail({
  to,
  subject,
  html,
}: EmailOptions): Promise<void> {
  try {
    const recipients = Array.isArray(to)
      ? to.map((email) => ({ Email: email }))
      : [{ Email: to }];

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email:
              process.env.MAILJET_FROM_EMAIL || "support@maroutinesante.fr",
            Name: "Ma Routine Sante",
          },
          To: recipients,
          Subject: subject,
          HTMLPart: html,
        },
      ],
    });

    const response = (await request) as any;
    console.log("E-mail envoyé avec succès :", response.body.Messages);
  } catch (error: any) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    throw new Error(`Échec de l'envoi de l'e-mail : ${error.message}`);
  }
}
