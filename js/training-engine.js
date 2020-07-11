const labsAPIURL = "https://api.github.com/repos/ceduliocezar/shortcutlab/contents/labs/";

var keysPressed = [];

var selectedLab;
var currentShortcutIndex;
var loadedLabs;
var totalCorrectAnswers = 0;

redirectToHTTPSIfNecessary();
clearKeysPressedWhenEnterOnBackgroundState();

function redirectToHTTPSIfNecessary() {
  var host = "shortcutlab.space";
  if (window.location.host.includes(host) && window.location.protocol != "https:") {
    window.location.protocol = "https";
  }
}

function displayNextShortcut() {
  console.log(`displayNextShortcut: current index ${currentShortcutIndex}`);
  currentShortcutIndex = currentShortcutIndex + 1;

  if (currentShortcutIndex < selectedLab.shortcuts.length) {
    displayShortcut(selectedLab.shortcuts[currentShortcutIndex]);
  } else {
    endLabSession();
  }
}

function displayShortcut(shortcut) {
  console.log(`displayShortcut: shortcut ${JSON.stringify(shortcut)}`);
  var description = shortcut.description;
  var category = shortcut.category === undefined ? "General" : shortcut.category;

  document.getElementsByClassName("shortcut-description")[0].innerHTML = description;
  document.getElementsByClassName("shortcut-category")[0].innerHTML = category;

  var elements = document.getElementsByClassName("lab-info");
  for (var i = 0; i < elements.length; i++) {
    elements[i].innerHTML = selectedLab.software;
  }

  var labVersion = `${selectedLab.version} ${selectedLab.platform}`;

  elements = document.getElementsByClassName("lab-info-version")
  for (var i = 0; i < elements.length; i++) {
    elements[i].innerHTML = labVersion;
  }
}

function printKeysPressedState() {
  console.log("printKeysPressedState: " + keysPressed);
  document.getElementsByClassName("shortcut-input")[0].value = keysPressed.join(" + ").toUpperCase();
}

function matchCombination() {
  var currentShortcut = selectedLab.shortcuts[currentShortcutIndex];
  var userCombinationToDisplay = keysPressed.join(" + ").toUpperCase()

  if (keysPressed.join(", ").toLowerCase() === currentShortcut.keys.join(", ").toLowerCase()) {
    displayAsCorrect(userCombinationToDisplay);
    totalCorrectAnswers++;
  } else {
    displayAsIncorrect(userCombinationToDisplay);
  }
}

function endLabSession() {
  console.log('endLabSession');
  unregisterKeyListeners();
  displayEndSessionView();
  document.getElementsByClassName("retry-button")[0].style.display = "inline-block"
  document.getElementsByClassName("correct-score")[0].innerHTML = totalCorrectAnswers;
  document.getElementsByClassName("total-shortcuts")[0].innerHTML = selectedLab.shortcuts.length;
}

function displayEndSessionView() {
  console.log('displayEndSessionView');
  document.getElementsByClassName("shortcut-challenge-input")[0].style.display = "none";
  document.getElementsByClassName("end-session-container")[0].style.display = "block";
}

function displayAsCorrect(userCombination) {
  let li = document.createElement("li");
  li.classList.add("correct");
  li.classList.add("shortcut-item");
  li.appendChild(createHistoryDescriptionItem(false));
  li.appendChild(createHistoryCombinationItem(userCombination));
  document.getElementsByClassName("shortcut-list")[0].prepend(li);
}

function displayAsIncorrect(userCombination) {
  let li = document.createElement("li");
  li.classList.add("incorrect");
  li.classList.add("shortcut-item");
  li.appendChild(createHistoryDescriptionItem(true));
  li.appendChild(createHistoryCombinationItem(userCombination));
  document.getElementsByClassName("shortcut-list")[0].prepend(li);
}

function createHistoryDescriptionItem(incorrect) {
  var currentShortcut = selectedLab.shortcuts[currentShortcutIndex];

  let descriptionElement = document.createElement("p");
  descriptionElement.innerHTML = currentShortcut.description;

  if (incorrect) {
    descriptionElement.innerHTML = descriptionElement.innerHTML + " (" + currentShortcut.keys.join(" + ") + ")";
  }
  descriptionElement.classList.add("history-item-description");

  return descriptionElement;
}

function createHistoryCombinationItem(userCombination) {
  var currentShortcut = selectedLab.shortcuts[currentShortcutIndex];
  let combinationElement = document.createElement("p");
  combinationElement.innerHTML = userCombination
  combinationElement.classList.add("history-item-combination");

  return combinationElement;
}

function displaySelectionView() {
  console.log("displaySelectionView: ");
  hideEndSessionView();
  document.getElementsByClassName("intro-container")[0].style.display = "none";
  document.getElementsByClassName("content")[0].style.display = "block";
  document.getElementsByClassName("lab-selection-container")[0].style.display = "block";
  document.getElementsByClassName("lab-session-container")[0].style.display = "none";
  document.getElementsByClassName("footer-content")[0].style.display = "none";
  document.getElementById("labs-loader").style.display = "block";

  loadLabsFromAPI(labsAPIURL);
}

function removeAllLabsFromList() {
  var labList = document.getElementById("lab-list-container");

  while (labList.hasChildNodes()) {
    labList.removeChild(labList.lastChild);
  }
}

function displayLabSessionView() {
  console.log("displayLabSessionView: ");
  document.getElementsByClassName("lab-session-container")[0].style.display = "block";
  document.getElementsByClassName("content")[0].style.display = "block";
  hideLoadingContainer();
  hideEndSessionView();
  document.getElementsByClassName("intro-container")[0].style.display = "none";
  document.getElementsByClassName("lab-selection-container")[0].style.display = "none";
  document.getElementsByClassName("retry-button")[0].style.display = "none"
}

function displayLoadingContainer() {
  console.log("displayLoadingContainer: ");
  document.getElementsByClassName("lab-loading-container")[0].style.display = "block";
}

function hideLoadingContainer() {
  console.log("hideLoadingContainer: ");
  document.getElementsByClassName("lab-loading-container")[0].style.display = "none";
}

function hideSelectionView() {
  console.log("hideSelectionView");
  document.getElementsByClassName("lab-loading-container")[0].style.display = "none";
}

function displayLabsForSelection(data) {
  removeAllLabsFromList();
  console.log("displayLabsForSelection: " + JSON.stringify(data));

  var labList = document.getElementById("lab-list-container");

  for (const labKey in data) {
    if (data.hasOwnProperty(labKey)) {
      const lab = data[labKey];

      let liElement = document.createElement("li");
      liElement.classList.add("list-description-container");

      let aElement = document.createElement("a");
      aElement.classList.add("list-description-link");
      aElement.setAttribute("href", "#");
      aElement.setAttribute(
        "onclick",
        "loadLab('" + lab.url + "');return false;"
      );

      let pElement = document.createElement("p");
      pElement.classList.add("list-description");
      pElement.innerText = lab.name;
      aElement.appendChild(pElement);
      liElement.appendChild(aElement);
      labList.appendChild(liElement);
    }
  }

  document.getElementById("labs-loader").style.display = "none";
}

function hideElement(className) {
  document.getElementById(className).style.display = "none";
}

function showElement(className) {
  document.getElementById(className).style.display = "block";
}

function openFileSelector() {
  console.log("openFileSelector");
  var input = document.createElement("input");

  input.type = "file";
  input.accept = ".lab";
  input.addEventListener("change", function (event) {
    readFile(event.target.files[0]);
  });

  input.click();
}

function readFile(file) {
  console.log("readFile");
  var reader = new FileReader();
  reader.onload = function (event) {
    var fileLab = JSON.parse(event.target.result);
    onLoadLab(fileLab);
  };

  reader.readAsText(file);
}

function startLabSession(lab) {
  clearLabSessionState();
  registerKeyListeners();

  displayLabSessionView();
  document.getElementsByClassName("shortcut-challenge-input")[0].style.display = "block";

  selectedLab = lab;
  currentShortcutIndex = 0;
  displayShortcut(selectedLab.shortcuts[currentShortcutIndex]);
}

function hideEndSessionView() {
  console.log("hideEndSessionView");
  document.getElementsByClassName("end-session-container")[0].style.display = "none";
}

function registerKeyListeners() {
  registerKeyDownListener();
  registerKeyUpListener();
}

function unregisterKeyListeners() {
  window.removeEventListener("keyup", onKeyUp);
  window.removeEventListener("keydown", onKeyDown);
}

function registerKeyUpListener() {
  window.addEventListener("keyup", onKeyUp);
}

function onKeyUp(event) {

  if (hasKeysPressed()) {
    matchCombination();
    resetKeysPressed();
    displayNextShortcut();
  }

  event.preventDefault();
}

function resetKeysPressed() {
  keysPressed = [];
  printKeysPressedState();
}

function hasKeysPressed() {
  return keysPressed.length > 0;
}

function registerKeyDownListener() {
  window.addEventListener("keydown", onKeyDown);
}

function onKeyDown(event) {
  const key = event.key;

  if (!keysPressed.includes(key)) {
    console.log("New key down identified:");
    keysPressed.push(key);
    printKeysPressedState();
  }
  event.preventDefault();
}

function retryLab() {
  startLabSession(selectedLab);
}

function finishSession() {
  displaySelectionView();
}

function clearShortcutHistory() {
  const historyElement = document.getElementsByClassName("shortcut-list")[0];

  while (historyElement.firstChild) {
    historyElement.removeChild(historyElement.firstChild);
  }
}

function clearLabSessionState() {
  totalCorrectAnswers = 0;
  clearShortcutHistory();
}

function clearKeysPressedWhenEnterOnBackgroundState() {

  window.addEventListener('blur', function () {
    clearKeysPressed();
  }, false);

  window.addEventListener('focus', function () {
    clearKeysPressed();
  }, false);
}

function clearKeysPressed() {
  keysPressed = [];
  printKeysPressedState();
}

