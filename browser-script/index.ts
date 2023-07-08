globalThis.scrap = function () {
  return {
    html: document.documentElement.outerHTML,
  };
};
