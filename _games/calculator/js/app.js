(function () {
    "use strict";

    const calculator = document.querySelector("[data-calculator]");
    const display = calculator.querySelector("[data-display]");
    const mode = calculator.querySelector("[data-mode]");
    let expression = "";

    function render() {
        display.value = expression || "0";
    }

    function calculate() {
        if (!/^[0-9+*/().%\s-]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }
        const result = Function(`"use strict"; return (${expression})`)();
        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }
        expression = String(result);
    }

    function applyAction(action) {
        if (action === "clear") expression = "";
        if (action === "backspace") expression = expression.slice(0, -1);
        if (action === "equals") {
            try { calculate(); } catch (error) { expression = "Error"; }
        }
        if (action === "negate") expression = expression ? `-(${expression})` : "-";
        if (action === "sqrt") expression = String(Math.sqrt(Number(expression)));
        if (["sin", "cos", "tan"].includes(action)) expression = String(Math[action](Number(expression)));
        render();
    }

    calculator.querySelector("[data-keys]").addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        if (button.dataset.value) expression += button.dataset.value;
        if (button.dataset.action) applyAction(button.dataset.action);
        render();
    });

    mode.addEventListener("change", () => calculator.classList.toggle("scientific", mode.value === "scientific"));
    render();
}());