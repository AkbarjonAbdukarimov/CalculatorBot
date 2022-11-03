if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;
const pass = process.env.PASS;
const fs = require("fs");
const axios = require("axios");
const bot = new TelegramBot(token, { polling: true });
const getDate = () => {
  const date = new Date();
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  return `${day}/${month}/${year}`;
};
bot.setMyCommands([
  { command: "/start", description: "Kirish" },
  { command: "/ayirboshlash", description: "Ayirboshlash 💱" },
  { command: "/kurs", description: "Ayirboshlash qiymati" },
]);
const calculate = (input, exchange) => {
  let ex = exchange.low;
  if (input >= exchange.border) {
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
    let exchange = JSON.parse(fs.readFileSync("exchange.json"));
    bot.sendMessage(chat.id, "Yuan qiymatini kiriting");
    bot.on("message", async (msg) => {
      if (message_id + 2 === msg.message_id) {
        if (Number(msg.text)) {
          const res = await calculate(Number(msg.text), exchange);
          await bot.sendMessage(chat.id, res.toLocaleString() + "$");
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
    let exchange = JSON.parse(fs.readFileSync("exchange.json"));
    bot.sendMessage(
      chat.id,
      `30 000dan kop bolgan tranzaksiya uchun narx ${exchange.up}\n` +
        "Yangi almashtirish narxini kiriting:"
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
          `Kurs  ${exchange.up}dan ${msg.text}ga ozgardi`
        );
        exchange.up = Number(msg.text);
        exchange.date = getDate();
        fs.writeFileSync("exchange.json", JSON.stringify(exchange));
        return;
      }

      return;
    });
    return;
  }
  if (text === `${pass}low`) {
    let exchange = JSON.parse(fs.readFileSync("exchange.json"));
    bot.sendMessage(
      chat.id,
      `30 000dan kam bolgan tranzaksiya uchun narx ${exchange.low}\n` +
        "Yangi almashtirish narxini kiriting:"
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
        exchange.date = getDate();
        fs.writeFileSync("exchange.json", JSON.stringify(exchange));
        return;
      }

      return;
    });
    return;
  }
  if (text === "/kurs") {
    let exchange = JSON.parse(fs.readFileSync("exchange.json"));
    bot.sendMessage(
      chat.id,
      `Kurs yangilangan sana ${exchange.date}\n` +
        `${exchange.border}dan kam bolgan tranzaksiya uchun narx ${exchange.low}\n` +
        `${exchange.border}dan kop bolgan tranzaksiya uchun narx ${exchange.up}`
    );
  }
  if (text === `${pass}exchange`) {
    let exchange = JSON.parse(fs.readFileSync("exchange.json"));
    bot.sendMessage(
      chat.id,
      `Hozirgi kurs ozgarish qiymati ${exchange.border}\n` +
        "Yangi qiymatni kiriting:"
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
          `Kurs ozgarish qiymati ${exchange.border}dan ${msg.text}ga ozgardi`
        );
        exchange.border = Number(msg.text);

        fs.writeFileSync("exchange.json", JSON.stringify(exchange));

        return;
      }

      return;
    });
    return;
  }
});
