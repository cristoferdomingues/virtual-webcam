'use strict';
const scripts = [
  { url: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs' },
  {
    url: 'https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet',
  },
  { url: chrome.extension.getURL('js/main.js'), module: true },
];

document.addEventListener('DOMContentLoaded', function (event) {
  let scriptTags = [];
  console.log('add to head', document.head);

  for (let script of scripts) {
    const scriptEl = document.createElement('script');
    if (script.module) {
      scriptEl.setAttribute('type', 'module');
    }
    scriptEl.setAttribute('src', script.url);
    scriptTags.push(scriptEl);
  }
  document.head.append(...scriptTags);
});
