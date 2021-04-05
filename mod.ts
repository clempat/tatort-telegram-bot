import { getTodayTatort, Show } from "./scrap.ts";
import { isToday } from "./utils.ts";
import { cron, Telegram } from "./deps.ts";

const token = Deno.env.get("BOT_TOKEN") as string;
if (!token) throw new Error("Missing BOT_TOKEN");

// const bot = new Bot(token);
const telegram = new Telegram(token);
console.debug("Bot started");
async function sendTodayNotification(tatort: Show) {
  console.debug("Send Tatort Notification for today");
  console.debug("tatort:");
  console.debug(JSON.stringify(tatort));
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

async function run() {
  const tatort = await getTodayTatort();
  console.debug("run the daily check.");
  // We assume prime is around 20
  if (tatort && isToday(tatort.time) && tatort.time.getHours() === 20) {
    await sendTodayNotification(tatort);
  }

  // If no tatort but we are sunday we notify
  if (!tatort && new Date().getDay() === 0) {
    console.debug("Send Tatort Notification no tatort today");
    await telegram.sendMessage({
      chat_id: Deno.env.get("CHAT_ID") as string,
      parse_mode: "Markdown",
      text: "🚫 Keine Tatort heute.",
    });
  }
}

cron("0 0 11 * * *", run);
