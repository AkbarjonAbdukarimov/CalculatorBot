const TelegramBot = require("node-telegram-bot-api");
const token = "5324276175:AAFvKOWd4TU_B7iJbms8xGKz52A-klxmKVw";
const fs = require("fs");
const axios = require("axios");
const bot = new TelegramBot(token, { polling: true });
const getUsdPrice = async () => {
  const res = await axios.get("https://nbu.uz/exchange-rates/json/");
  const usd = res.data.find((i) => i.code === "USD");
  return usd.nbu_buy_price;
};
let exchange = JSON.parse(fs.readFileSync("exchange.json"));
bot.setMyCommands([
  { command: "/start", description: "Начальное приветствие" },
  { command: "/calculate", description: "Начать Калькуляцию" },
]);
bot.on("message", (msg) => {
  const { message_id, text, chat } = msg;
  if (text === "/start")
    switch (text) {
      case "/start":
        bot.sendMessage(chat.id, "Welcome to Calculator bot");
        break;
      case "/calculate":
        bot.sendMessage(chat.id, "Введите значение:");
        break;
      case token:
        bot.sendMessage(chat.id, "Введите Курс Юани:");
        bot.on("message", (msg) => {
          if (message_id + 2 === msg.message_id) {
            bot.sendMessage(
              chat.id,
              `Курс был изменен с ${exchange.price} на ${msg.text}`
            );
            exchange.price = Number(msg.text);
            fs.writeFileSync("exchange.json", JSON.stringify(exchange));
            return;
          }
          return;
        });
        break;
      // default:
      //   bot.sendMessage(chat.id, "Command not found");
    }
});
