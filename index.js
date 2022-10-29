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
const calculate = async (input) => {
  const usd = await getUsdPrice();

  return ((input * usd) / exchange.price).toFixed(2);
};
bot.on("message", (msg) => {
  const { message_id, text, chat } = msg;
  if (text === "/start") {
    bot.sendMessage(chat.id, "Welcome to Calculator bot");
    return;
  }
  if (text === "/calculate") {
    bot.sendMessage(chat.id, "Введите значение:");
    bot.on("message", async (msg) => {
      if (message_id + 2 === msg.message_id) {
        if (Number(msg.text)) {
          const res = await calculate(Number(msg.text));
          await bot.sendMessage(chat.id, res.toLocaleString());
          return;
        }
      }

      // bot.sendMessage(chat.id, `Команда Не Найдена!`);
      // return;
      return;
    });
    return;
  }
  if (text === token) {
    bot.sendMessage(
      chat.id,
      ` Курс равен ${exchange.price}
    Введите Курс Юани:`
    );
    bot.on("message", (msg) => {
      if (message_id + 2 === msg.message_id) {
        if (!Number(msg.text)) {
          bot.sendMessage(chat.id, `Input must be a Number!!! Pleae Try Again`);
          return;
        }
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
    return;
  }
});
