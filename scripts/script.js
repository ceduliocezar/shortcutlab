var keysPressed = [];
var current = 0;

window.addEventListener("keydown", function (event) {
    const key = event.key;
    if (!keysPressed.includes(key)) {
        console.log("New key down identified:");
        keysPressed.push(key);
        printKeysPressedState();
    }
    event.preventDefault();

}, false);

window.addEventListener("keyup", function (event) {
    if (keysPressed.length > 0) {
        matchCombination(keysPressed);
        keysPressed = [];
        printKeysPressedState();
        displayNextShortcut();
    }
    event.preventDefault();
});

redirectToHTTPSIfNecessary();

function redirectToHTTPSIfNecessary() {
    var host = "shortcutlab.space";
    if ((window.location.host.includes(host)) && (window.location.protocol != "https:")) {
        window.location.protocol = "https";
    }
}


function displayNextShortcut() {
    console.log(`displayNextShortcut: current index ${currentShortcutIndex}`);
    currentShortcutIndex = currentShortcutIndex + 1;
    displayShortcut(selectedLab.shortcuts[currentShortcutIndex]);
}

function displayShortcut(shortcut) {
    console.log(`displayShortcut: shortcut ${JSON.stringify(shortcut)}`)
    var description = shortcut.description;
    var category = shortcut.category === undefined ? 'General' : shortcut.category;
    var labInfo = `${selectedLab.software} - ${selectedLab.version} - ${selectedLab.platform}`;

    document.getElementsByClassName("shortcut-description")[0].innerHTML = description;
    document.getElementsByClassName("shortcut-category")[0].innerHTML = category;
    document.getElementsByClassName("lab-info")[0].innerHTML = labInfo;
}

function printKeysPressedState() {
    console.log("printKeysPressedState: " + keysPressed)
    document.getElementsByClassName("shortcut-input")[0].value = keysPressed.join(' + ');
}

function matchCombination(keyCombination) {
    var currentShortcut = selectedLab.shortcuts[currentShortcutIndex]

    if (keyCombination.join(", ").toLowerCase() === currentShortcut.keys.join(", ").toLowerCase()) {
        displayAsCorrect();
    } else {
        displayAsIncorrect();
    }
}

function displayAsCorrect() {
    let li = document.createElement("li");
    li.classList.add('correct');
    li.classList.add('shortcut-item');
    li.appendChild(createHistoryDescriptionItem());
    li.appendChild(createHistoryCombinationItem());
    document.getElementsByClassName("shortcut-list")[0].prepend(li);
}

function displayAsIncorrect() {
    let li = document.createElement("li");
    li.classList.add('incorrect');
    li.classList.add('shortcut-item');
    li.appendChild(createHistoryDescriptionItem());
    li.appendChild(createHistoryCombinationItem());
    document.getElementsByClassName("shortcut-list")[0].prepend(li);
}

function createHistoryDescriptionItem() {
    var currentShortcut = selectedLab.shortcuts[currentShortcutIndex];

    let descriptionElement = document.createElement("p");
    descriptionElement.innerHTML = currentShortcut.description;
    descriptionElement.classList.add('history-item-description');

    return descriptionElement;
}
function createHistoryCombinationItem() {
    var currentShortcut = selectedLab.shortcuts[currentShortcutIndex];
    let combinationElement = document.createElement("p");
    combinationElement.innerHTML = currentShortcut.keys.join(' + ');
    combinationElement.classList.add('history-item-combination');

    return combinationElement;
}

function displaySelectionView() {
    console.log('displaySelectionView: ');
    document.getElementsByClassName("intro-container")[0].style.display = "none";
    document.getElementsByClassName("content")[0].style.display = "block";
    document.getElementsByClassName("lab-selection-container")[0].style.display = "block";
    document.getElementsByClassName("lab-session-container")[0].style.display = "none";
    document.getElementById('labs-loader').style.display = "block";



    requestRecursive('https://api.github.com/repos/ceduliocezar/shortcutlab/contents/labs/', displayLabsForSelection);
}

function removeAllLabsFromList() {
    var labList = document.getElementById("lab-list-container");

    while (labList.hasChildNodes()) {
        labList.removeChild(labList.lastChild);
    }
}

function displayLabSessionView() {
    console.log('displayLabSessionView: ');
    document.getElementsByClassName("lab-session-container")[0].style.display = "block";
    document.getElementsByClassName("intro-container")[0].style.display = "none";
    document.getElementsByClassName("content")[0].style.display = "block";
    document.getElementsByClassName("lab-selection-container")[0].style.display = "none";
}


function displayLoadingContainer() {
    console.log('displayLoadingContainer: ');
    document.getElementsByClassName("lab-loading-container")[0].style.display = "block";
}

function hideLoadingContainer() {
    console.log('hideLoadingContainer: ');
    document.getElementsByClassName("lab-loading-container")[0].style.display = "none";
}

function hideSelectionView() {
    console.log("hideSelectionView");
    document.getElementsByClassName("lab-loading-container")[0].style.display = "none";
}

function displayLabsForSelection(data) {
    removeAllLabsFromList();
    console.log('displayLabsForSelection: ' + JSON.stringify(data));

    var labList = document.getElementById("lab-list-container");

    for (const labKey in data) {
        if (data.hasOwnProperty(labKey)) {
            const lab = data[labKey];

            let liElement = document.createElement("li");
            let aElement = document.createElement("a");
            aElement.classList.add("list-description");
            aElement.innerHTML = lab.name;
            aElement.setAttribute('href', '#');
            aElement.setAttribute('onclick', "loadLab('" + lab.url + "');return false;");
            liElement.appendChild(aElement);
            labList.appendChild(liElement);
        }
    }

    document.getElementById('labs-loader').style.display = "none";
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
        // The file's text will be printed here
        var fileLab = JSON.parse(event.target.result);
        onLoadLab(fileLab);
    };

    reader.readAsText(file);
}

