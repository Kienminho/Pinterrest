const { createClient } = require("@sanity/client");

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2021-10-21",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

module.exports = sanityClient;
