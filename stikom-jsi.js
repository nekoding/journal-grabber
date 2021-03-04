const axios = require("axios");
const $ = require("cheerio");
const fs = require("fs");

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
  const result = await $(selector, data);
  return result;
};

getAllIssues().then(async (response) => {
  const issues = await parserHtml(".issues.media-list > * a.cover", response);

  for (const issue of issues) {
    const linkIssue = await getIssue(issue.attribs.href);
    const journals = await parserHtml(
      ".article-summary.media > div.media-body",
      linkIssue
    );
  }
});
