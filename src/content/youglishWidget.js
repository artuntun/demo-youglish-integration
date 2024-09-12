function loadYouGlishAPI() {
  return new Promise((resolve, reject) => {
    var tag = document.createElement("script");
    tag.src = "https://youglish.com/public/emb/widget.js";
    tag.onload = resolve;
    tag.onerror = reject;
    document.head.appendChild(tag);
  });
}

function initializeWidget() {
  console.log("Initializing YouGlish widget");
  if (typeof YG === "undefined") {
    console.error(
      "YG is not defined. YouGlish API might not be loaded correctly."
    );
    return;
  }

  var widget = new YG.Widget("widget-1", {
    width: 640,
    components: 72,
    autoStart: 0,
    events: {
      onFetchDone: onFetchDone,
      onVideoChange: onVideoChange,
      onCaptionConsumed: onCaptionConsumed,
    },
  });

  // process the query with the provided word
  widget.fetch("courage", "english");
}

function onFetchDone(event) {
  console.log("Fetch done", event);
  if (event.totalResult === 0) alert("No result found");
  else totalTracks = event.totalResult;
}

function onVideoChange(event) {
  console.log("Video changed", event);
  curTrack = event.trackNumber;
  views = 0;
}

function onCaptionConsumed(event) {
  console.log("Caption consumed", event);
  if (++views < 3) widget.replay();
  else if (curTrack < totalTracks) widget.next();
}

// Load API and initialize widget
loadYouGlishAPI()
  .then(() => {
    console.log("YouGlish API loaded successfully");
    // Initialize the widget when the user hits the pronunciation tab
    // and pass the specific word
    initializeWidget();
  })
  .catch((error) => {
    console.error("Failed to load YouGlish API", error);
  });
