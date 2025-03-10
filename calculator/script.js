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
        display.innerText = eval(expression);
    } catch (error) {
        display.innerText = "Error";
    }
}
