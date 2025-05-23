const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");
const crypto = require("crypto")

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
    return new SendEmailCommand({
        Destination: {
          /* required */
          CcAddresses: [
            /* more items */
          ],
          ToAddresses: [
            toAddress,
            /* more To-email addresses */
          ],
        },
        Message: {
          /* required */
          Body: {
            /* required */
            Html: {
              Charset: "UTF-8",
              Data: body
            },
            Text: {
              Charset: "UTF-8",
              Data: body,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
        Source: fromAddress,
        ReplyToAddresses: [
          /* more items */
        ],
      });
};

const run = async (subject, body) => {
    const sendEmailCommand = createSendEmailCommand(
      "nidhishrivas9938@gmail.com", // receiver
      "sv1009876@gmail.com", // sender
      subject,
      body,
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        /** @type { import('@aws-sdk/client-ses').MessageRejected} */
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };

  function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  module.exports= { run, generateOTP }

