import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

import subscribers from "./subscribers.json" with {type: "json"};
import {getScheduledPowerOutages} from "./src/getOutageStatus.mjs";
dotenv.config();

const url = process.env.EPE_URL;
const telegramToken = process.env.TELEGRAM_TOKEN;

if (!url) throw new Error("Hey, the URL isn't defined");
if (!telegramToken) throw new Error("Hey, the Telegram Token isn't defined");

const citiesToSearch = new Set(subscribers.map((subscriber) => subscriber.city));
const citiesWithScheduledOutages = [];

for (const city of citiesToSearch) {
  const scheduledOutages = await getScheduledPowerOutages(url, city);

  if (scheduledOutages) {
    citiesWithScheduledOutages.push(city);
  }
}

const telegramBot = new TelegramBot(telegramToken, {
  polling: false,
});

for (const subscriber of subscribers) {
  if (citiesWithScheduledOutages.includes(subscriber.city)) {
    telegramBot.sendMessage(subscriber.chatId, `Cuidado! Hay cortes de luz en ${subscriber.city}`);
  } else {
    telegramBot.sendMessage(
      subscriber.chatId,
      `Tranqui, no hay cortes programados en ${subscriber.city}`,
    );
  }
}
