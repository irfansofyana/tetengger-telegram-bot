import { Telegraf } from 'telegraf';
import { scrapContent, Content } from './scraper';
import { saveContent } from './github';

const botToken: string | undefined = process.env.BOT_TOKEN

if (botToken === undefined) {
  console.error('missing bot token');
  process.exit();
}

const bot = new Telegraf(botToken);
const irfanTelegramID: number = Number(process.env.IRFAN_TELEGRAM_ID)

bot.command('whoami', ctx => {
  ctx.reply('I am a telegram bot that is used by @irfansppp to bookmark any content from the web to his second brain.');
});

bot.on('message', async ctx => {
  if (ctx.from.id != irfanTelegramID) {
    ctx.reply("I don't allow to proceed your request!");
    return;
  }

  if (!ctx.message) {
    ctx.reply("I don't get any message!");
    return;
  }

  const messageEntities = ctx.message?.entities;
  const text = ctx.message?.text?.toLowerCase();

  if (!Array.isArray(messageEntities)) {
    ctx.reply("Sorry boss, I don't understand your message!")
    return;
  }

  const urls: Array<string> = [];
  const tags: Array<string> = [];

  for (let i = 0; i < messageEntities.length; i++) {
    const entity = messageEntities[i];
    const idxFrom: number = entity.offset;
    const idxTo: number = idxFrom + entity.length;
    const entityText: string = text.substring(idxFrom, idxTo);
    const entityType: string = entity.type;

    if (entityType === 'hashtag') {
      tags.push(entityText.substring(1));
    }
    if (entityType === 'url') {
      urls.push(entityText);
    }
  }

  const results = { 'failed': [], 'succeed': [] }
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const urlContent: Content = await scrapContent(url);
      await saveContent(urlContent, tags);
      results.succeed.push(url as never);
    } catch (err) {
      console.error(err);
      results.failed.push(url as never);
    }
  }

  const resultsAsText = (): string => {
    let succeedText = results.succeed.join('\n');
    let failedText = results.failed.join('\n');
    if (succeedText === "") {
      return `FAILED TO BOOKMARK: ${failedText}`
    }
    if (failedText === "") {
      return `SUCCEED TO BOOKMARK: ${succeedText}`
    }
    return `SUCCEED TO BOOKMARKt: ${succeedText}\n
            FAILED TO BOOKMARK:${failedText}`
  }
  ctx.reply(resultsAsText());
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))