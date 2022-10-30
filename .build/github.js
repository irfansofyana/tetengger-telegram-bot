var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
__export(exports, {
  saveContent: () => saveContent
});
var import_rest = __toModule(require("@octokit/rest"));
const octokit = new import_rest.Octokit({
  auth: process.env.GITHUB_TOKEN
});
async function saveContent(content, tags) {
  const addAdditionalInfoToContent = () => {
    let metadata = `---
title: "${content.title}"
source: "${content.url}"
tags:`;
    for (let i = 0; i < tags.length; i++) {
      metadata += `
- ${tags[i]}`;
    }
    metadata += "\n---\n";
    return `${metadata}
${content.data}`;
  };
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: "irfansofyana",
    repo: "MySecondBrain",
    branch: "hugo",
    path: `content/bookmark/${content.domain}/${content.title}.md`,
    message: `Bookmarked: ${content.title}.md`,
    content: Buffer.from(addAdditionalInfoToContent()).toString("base64")
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  saveContent
});
//# sourceMappingURL=github.js.map
