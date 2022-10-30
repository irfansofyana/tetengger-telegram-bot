var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var import_telegraf = __toModule(require("telegraf"));
var import_scraper = __toModule(require("./scraper"));
var import_github = __toModule(require("./github"));
const botToken = process.env.BOT_TOKEN;
if (botToken === void 0) {
  console.error("missing bot token");
  process.exit();
}
const bot = new import_telegraf.Telegraf(botToken);
const irfanTelegramID = Number(process.env.IRFAN_TELEGRAM_ID);
bot.command("whoami", (ctx) => {
  ctx.reply("I am a telegram bot that is used by @irfansppp to bookmark any content from the web to his second brain.");
});
bot.on("message", async (ctx) => {
  var _a, _b, _c;
  if (ctx.from.id != irfanTelegramID) {
    ctx.reply("I don't allow to proceed your request!");
    return;
  }
  if (!ctx.message) {
    ctx.reply("I don't get any message!");
    return;
  }
  const messageEntities = (_a = ctx.message) == null ? void 0 : _a.entities;
  const text = (_c = (_b = ctx.message) == null ? void 0 : _b.text) == null ? void 0 : _c.toLowerCase();
  if (!Array.isArray(messageEntities)) {
    ctx.reply("Sorry boss, I don't understand your message!");
    return;
  }
  const urls = [];
  const tags = [];
  for (let i = 0; i < messageEntities.length; i++) {
    const entity = messageEntities[i];
    const idxFrom = entity.offset;
    const idxTo = idxFrom + entity.length;
    const entityText = text.substring(idxFrom, idxTo);
    const entityType = entity.type;
    if (entityType === "hashtag") {
      tags.push(entityText.substring(1));
    }
    if (entityType === "url") {
      urls.push(entityText);
    }
  }
  const results = { "failed": [], "succeed": [] };
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    try {
      const urlContent = await (0, import_scraper.scrapContent)(url);
      await (0, import_github.saveContent)(urlContent, tags);
      results.succeed.push(url);
    } catch (err) {
      console.error(err);
      results.failed.push(url);
    }
  }
  const resultsAsText = () => {
    let succeedText = results.succeed.join("\n");
    let failedText = results.failed.join("\n");
    if (succeedText === "") {
      return `FAILED TO BOOKMARK: ${failedText}`;
    }
    if (failedText === "") {
      return `SUCCEED TO BOOKMARK: ${succeedText}`;
    }
    return `SUCCEED TO BOOKMARKt: ${succeedText}

            FAILED TO BOOKMARK:${failedText}`;
  };
  ctx.reply(resultsAsText());
});
bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
//# sourceMappingURL=index.js.map
