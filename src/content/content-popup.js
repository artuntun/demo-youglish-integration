// Event listeners for requested words
window.addEventListener("message", async function (event) {
  if (event.source === window.parent && event.data.action === "wordRequest") {
    const { word, sentence } = event.data;
    document.getElementById("header-title").textContent = word;
    // TODO: here we update youglish widget
  }
});
