// Directory data for every .md article in src/blog/posts/.
// Each post is rendered with post.njk → base.njk and lives at /blog/<slug>/.
// We look the post up in src/_data/posts.json by slug (= the file name) here in
// JS — Nunjucks `selectattr(...,'equalto',...)` does not filter in this build,
// and `{% set %}` inside a `{% for %}` loop does not leak out, so a JS lookup is
// the robust path. The resolved `post` object + SEO fields are exposed to the
// templates via computed data.
const posts = require("../../_data/posts.json");

const DEFAULT_OG = "https://cdn.shopify.com/s/files/1/0303/7134/8525/files/hero-2.png?width=1200";

function findPost(data) {
  return posts.find((p) => p.slug === data.page.fileSlug) || {};
}

module.exports = {
  layout: "post.njk",
  permalink: "/blog/{{ page.fileSlug }}/",
  eleventyComputed: {
    // Full post record, so post.njk can read category/thumbnail/readTime/alt/title.
    post: (data) => findPost(data),
    // SEO: front-matter wins, else fall back to the posts.json record.
    title: (data) => data.title || findPost(data).title || "",
    description: (data) => data.description || findPost(data).description || "",
    ogImage: (data) => data.ogImage || findPost(data).thumbnail || DEFAULT_OG,
    // JSON-LD injected verbatim into <head> via base.njk's {{ extrahead | safe }}.
    extrahead: (data) => {
      const p = findPost(data);
      const url = (data.site && data.site.url) || "";
      const canonical = url + data.page.url;
      const blogPosting = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.title || "",
        description: p.description || data.description || "",
        image: p.thumbnail || DEFAULT_OG,
        author: { "@type": "Person", name: "Viesturs Meikšāns", url: url + "/#lektors" },
        publisher: { "@type": "Organization", name: (data.site && data.site.name) || "ResonateKit", url: url + "/" },
        mainEntityOfPage: canonical,
        datePublished: p.date || "",
      };
      const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: url + "/" },
          { "@type": "ListItem", position: 2, name: "Blog", item: url + "/blog/" },
          { "@type": "ListItem", position: 3, name: p.title || "" },
        ],
      };
      return (
        '<script type="application/ld+json">' + JSON.stringify(blogPosting) + "</script>\n" +
        '<script type="application/ld+json">' + JSON.stringify(breadcrumb) + "</script>"
      );
    },
  },
};
