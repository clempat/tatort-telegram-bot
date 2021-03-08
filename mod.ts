import { getNextSundayTatort, Show } from "./scrap.ts";
import { isToday } from "./utils.ts";
import { cron, Telegram } from "./deps.ts";

const token = Deno.env.get("BOT_TOKEN") as string;
if (!token) throw new Error("Missing BOT_TOKEN");

// const bot = new Bot(token);
const telegram = new Telegram(token);

async function sendTodayNotification(tatort: Show) {
  await telegram.sendMessage({
    chat_id: Deno.env.get("CHAT_ID") as string,
    parse_mode: "Markdown",
    text: `
📺 Heute um ${tatort.time.getHours()}:${tatort.time.getMinutes()}: *${
      tatort.title
    }*

${tatort.url}
    `,
  });
}

cron("0 0 11 * * *", async function () {
  const tatort = await getNextSundayTatort();

  // We assume prime is around 20
  if (tatort && tatort.time.getHours() === 20) {
    await sendTodayNotification(tatort);
  }

  // If no tatort but we are sunday we notify
  if (!tatort && new Date().getDay() === 0) {
    await telegram.sendMessage({
      chat_id: Deno.env.get("CHAT_ID") as string,
      parse_mode: "Markdown",
      text: "🚫 Keine Tatort heute.",
    });
  }
});
