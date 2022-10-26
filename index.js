const TelegramBot = require("node-telegram-bot-api");
const token = "5324276175:AAFvKOWd4TU_B7iJbms8xGKz52A-klxmKVw";
const bot = new TelegramBot(token, { polling: true });
let nums = [];
bot.setMyCommands([
  { command: "/start", description: "Начальное приветствие" },
]);

const options = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: "Начать расчет", callback_data: "calculate" }]],
  }),
};

bot.on("message", (msg) => {
  const { text } = msg;
  const chatId = msg.chat.id;

  switch (text) {
    case "/start":
      bot.sendMessage(
        chatId,
        "Добро пожаловать! Простой бот-калькулятор комиссий! Пожалуйста, нажмите кнопку «Начать расчет», чтобы начать",
        options
      );
      break;
  }
});
bot.on("callback_query", async (cbq) => {
  await onCallbackQuery(cbq);
  bot.on("message", (msg) => {
    const { text } = msg;
    nums = text.split(",").map((i) => {
      return Number(i.trim());
    });
    const amount = nums[0];
    const exchange = nums[1];
    const commision = nums[3] / 100;
    const usd = nums[2];
    const result = (
      (amount * usd * (1 + commision)) /
      exchange
    ).toLocaleString();
    bot.sendMessage(msg.chat.id, result.toLocaleString("RU-ru"));
  });
  return;
});
async function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const chat_id = msg.chat.id;
  const opts = {
    chat_id,
    message_id: msg.message_id,
  };
  bot.sendMessage(chat_id, "Введите Сумму, Курс Юаниб Курс Доллара, Комиссия");
}
