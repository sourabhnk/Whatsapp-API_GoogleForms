const WHATSAPP_ACCESS_TOKEN = "";
const WHATSAPP_TEMPLATE_NAME = "";
const LANGUAGE_CODE = "en";

const sendMessage_ = ({
  recipient_number,
  Recipient,
  Tasks,
  Deadline,
}) => {
  const apiUrl = "https://graph.facebook.com/v15.0/101128809546184/messages";    
  const request = UrlFetchApp.fetch(apiUrl, {
    muteHttpExceptions: true,
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      messaging_product: "whatsapp",
      type: "template",
      to: recipient_number,
      template: {
        name: "new_item_updates",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: Recipient,
              },
              {
                type: "text",
                text: Tasks,
              },
              {
                type: "text",
                text: Deadline,
              },
            ],
          },
        ],
      },
    }),
  });

  const { error } = JSON.parse(request);
  const status = error ? `Error: ${JSON.stringify(error)}` : `Message sent to ${recipient_number}`;
  Logger.log(status);
};

const getSheetData_ = () => {
  const [header, ...rows] = SpreadsheetApp.getActiveSheet().getDataRange().getDisplayValues();
  const data = [];
  rows.forEach((row) => {
    const recipient = { };
    header.forEach((title, column) => {
      recipient[title] = row[column];
    });
    data.push(recipient);
  });
  return data;
};

const main = () => {
  const data = getSheetData_();
  data.forEach((recipient) => {
      const status = sendMessage_({
        recipient_number: recipient["Phone_number"],
        Recipient: recipient["Recipient"],
        Tasks: recipient["Tasks"],
        Deadline: recipient["Deadline"],
      });
  });
};
