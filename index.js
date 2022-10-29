if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;
const pass = process.env.PASS;
const fs = require("fs");
const axios = require("axios");
const bot = new TelegramBot(token, { polling: true });

let exchange = JSON.parse(fs.readFileSync("exchange.json"));

bot.setMyCommands([
  { command: "/start", description: "Kirish" },
  { command: "/ayirboshlash", description: "Ayirboshlash 💱" },
]);
const calculate = (input) => {
  let ex = exchange.low;
  if (input >= 30000) {
    ex = exchange.up;
  }
  return (input / ex).toFixed(2);
};
bot.on("message", (msg) => {
  const { message_id, text, chat } = msg;
  if (text === "/start") {
    bot.sendMessage(chat.id, "Assalomu Alaykum!");
    return;
  }
  if (text === "/ayirboshlash") {
    bot.sendMessage(chat.id, "Qiymatni Kiriting");
    bot.on("message", async (msg) => {
      if (message_id + 2 === msg.message_id) {
        if (Number(msg.text)) {
          const res = await calculate(Number(msg.text));
          await bot.sendMessage(chat.id, res.toLocaleString());
          return;
        }
        bot.sendMessage(
          chat.id,
          "Iltimos Boshqatan urinib koring va Raqam Yozing!!!"
        );
        return;
      }

      return;
    });
    return;
  }
  if (text === `${pass}up`) {
    bot.sendMessage(
      chat.id,
      `30 000dan kop bolgan tranzaksiya uchun narx ${exchange.up}\n` +
        "Yangi Narxni Kiriting:"
    );
    bot.on("message", (msg) => {
      if (message_id + 2 === msg.message_id) {
        if (!Number(msg.text)) {
          bot.sendMessage(
            chat.id,
            `Iltimos Raqam Kiriting Va Boshqatan Urinib Koring`
          );
          return;
        }
        bot.sendMessage(
          chat.id,
          `Kuts  ${exchange.up}dan ${msg.text}ga ozgardi`
        );
        exchange.up = Number(msg.text);
        fs.writeFileSync("exchange.json", JSON.stringify(exchange));
        return;
      }

      return;
    });
    return;
  }
  if (text === `${pass}low`) {
    bot.sendMessage(
      chat.id,
      `30 000dan kam bolgan tranzaksiya uchun narx ${exchange.low}\n` +
        "Yange Narxni Kiriting:"
    );
    bot.on("message", (msg) => {
      if (message_id + 2 === msg.message_id) {
        if (!Number(msg.text)) {
          bot.sendMessage(
            chat.id,
            `Iltimos Raqam Kiriting Va Boshqatan Urinib Koring`
          );
          return;
        }
        bot.sendMessage(
          chat.id,
          `Kurs ${exchange.low}dan ${msg.text}ga ozgardi`
        );
        exchange.low = Number(msg.text);
        fs.writeFileSync("exchange.json", JSON.stringify(exchange));
        return;
      }

      return;
    });
    return;
  }
});
