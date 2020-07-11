
function loadLabsFromAPI(url) {
  requestRecursive(url);
}

function requestRecursive(url) {
  console.log("requestRecursive");
  const request = new Request(url);

  fetch(request).then(response => {
    console.log(response);

    if (response.redirected) {
      console.log("redirected to: " + response.url);
      requestRecursive(response.url);
      return;
    }

    console.log("converting file to json");
    response.json().then(function (data) {
      onLabsReturned(data);
    });
  });
}

function onLabsReturned(data) {
  console.log("onLabsReturned:" + JSON.stringify(data));
  var labs = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      var labName = data[key].name;
      var labDownloadURL = data[key].download_url;
      console.log(`Name:${labName}, Download URL: ${labDownloadURL}`);
      const lab = Object.assign({ name: labName, url: labDownloadURL });
      labs.push(lab);
    }
  }

  console.log("onLabsReturned: labs converted" + JSON.stringify(labs));
  loadedLabs = labs;
  displayLabsForSelection(labs);
}

function loadLab(url) {
  console.log("loadlab: url:" + url);
  hideSelectionView();
  displayLoadingContainer();
  const request = new Request(url);
  fetch(request)
    .then(response => {
      console.log("loadlab: response");
      return response.json();
    })
    .then(lab => {
      console.log("lab: " + lab.platform);
      onLoadLab(lab);
    });
}

function onLoadLab(lab) {
  console.log("onLoadLab");
  startLabSession(lab);
}
