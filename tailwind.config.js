/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,html,js,json,md}"],
  theme: { extend: { fontFamily: { serif: ["DM Serif Display","Georgia","serif"], sans: ["Inter","ui-sans-serif","system-ui"] } } },
};
