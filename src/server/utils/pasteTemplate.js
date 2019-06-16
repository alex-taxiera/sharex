export function pasteTemplate (title, text) {
  return `
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <meta name="theme-color" content="maroon">
        <meta property="og:title" content="${title}">
        <meta property="og:description" content="${text.match(/.{1,297}/g)[0]}...">
        <link rel="stylesheet" href="atom-one-dark.css">
        <link rel="stylesheet" href="paste.css">
        <script src="highlight.pack.js"></script>
        <script src="highlightjs-line-numbers.min.js"></script>
      </head>
      <body>
        <pre>
          <code id="code">${text}</code>
        </pre>
        <script>hljs.initHighlightingOnLoad();</script>
        <script>hljs.initLineNumbersOnLoad();</script>
      </body>
    </html>
  `
}
