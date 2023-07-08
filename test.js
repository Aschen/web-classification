const html = await fetch('https://www.etsy.com/fr/sitemaps/home.xml', {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  },
});

console.log(await html.text());
