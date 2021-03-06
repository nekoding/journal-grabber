const axios = require("axios");
const $ = require("cheerio");
const fs = require("fs");
const logger = fs.createWriteStream("jsi-stikom.txt", {
  flags: "a+",
});

const getAllIssues = async () => {
  const base_url = "https://jsi.stikom-bali.ac.id/index.php/jsi/issue/archive";

  try {
    const response = await axios.get(base_url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getIssue = async (url) => {
  try {
    const response = await axios(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const parserHtml = async (selector, data) => {
  const result = $(selector, data);
  return result;
};

const getJournal = async (journal) => {
  const journalTitle = $("h3 > a", journal)
    .children()[0]
    .next.data.replaceAll("\t", "");

  const journalLink = $("div.btn-group > a", journal)[0]?.attribs.href;

  return [journalTitle, journalLink];
};

getAllIssues().then(async (response) => {
  const issues = await parserHtml(".issues.media-list > * a.cover", response);

  for (const issue of issues) {
    const issueLink = await getIssue(issue.attribs.href);
    const journals = $("div.media-list > div.article-summary", issueLink);

    for (const journal of journals) {
      const result = await getJournal(journal);
      logger.write(
        `\nTitle : ${result[0].replaceAll("\n", "")}\nLink : ${result[1]}`
      );
    }
  }

  logger.end();

  console.info("done");
});
