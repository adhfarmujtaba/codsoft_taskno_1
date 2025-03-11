let display = document.getElementById("display");

function appendCharacter(character) {
    if (display.innerText === "0") {
        display.innerText = character;
    } else {
        display.innerText += character;
    }
}

function clearDisplay() {
    display.innerText = "0";
}

function deleteLast() {
    display.innerText = display.innerText.slice(0, -1) || "0";
}

function calculateResult() {
    try {
        let expression = display.innerText.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');

        // Handle percentage calculations
        if (expression.endsWith('%')) {
            let number = parseFloat(expression.slice(0, -1));
            if (!isNaN(number)) {
                display.innerText = number / 100;
                return;
            } else {
                display.innerText = "Error";
                return;
            }
        }

        display.innerText = eval(expression);
    } catch (error) {
        display.innerText = "Error";
    }
}
