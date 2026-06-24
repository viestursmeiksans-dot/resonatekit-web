// Eleventy config — input src/, output _site/ (what Cloudflare Pages serves).
// Tailwind is via CDN (no CSS build step). Assets are passthrough-copied verbatim.
module.exports = function (eleventyConfig) {
  // Copy static assets straight through (images, favicon, robots, sitemap).
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" }); // favicon.svg, robots.txt, sitemap.xml at root

  // Newest-first posts collection (drives homepage carousel + blog listing).
  eleventyConfig.addCollection("posts", (collectionApi) => {
    const posts = require("./src/_data/posts.json");
    return posts;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
