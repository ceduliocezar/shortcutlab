displayNextShortcut();

        var keysPressed = [];
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
                displayNextShortCut();
            }
            event.preventDefault();
        });

        function displayNextShortcut(){
            let randomNum = getRandomInt()

            document.getElementsByClassName("shortcut-description")[0].innerHTML = randomNum + " Show Command Line Pallete";
            document.getElementsByClassName("shortcut-category")[0].innerHTML = randomNum + " General";
        }

        function getRandomInt() {
            min = Math.ceil(0);
            max = Math.floor(100);
            return Math.floor(Math.random() * (max - min)) + min;
        }

        function printKeysPressedState() {
            let el = document.createElement("span");
            el.innerHTML = keysPressed + "<br/>";
            console.log("printKeysPressedState: " + keysPressed)

            document.getElementsByClassName("shortcut-input")[0].value = keysPressed;
        }

        function matchCombination(keyCombination) {
            if (keyCombination === 'Control') {
                displayAsCorrect();
            } else {
                displayAsIncorrect();
            }
        }

        function displayAsCorrect() {
            let li = document.createElement("li");
            li.classList.add('correct');
            li.classList.add('shortcut-item');
            li.innerHTML = keysPressed;
            document.getElementsByClassName("shortcut-list")[0].prepend(li);
        }

        function displayAsIncorrect() {
            let li = document.createElement("li");
            li.classList.add('incorrect');
            li.classList.add('shortcut-item');
            li.innerHTML = keysPressed;
            document.getElementsByClassName("shortcut-list")[0].prepend(li);
        }