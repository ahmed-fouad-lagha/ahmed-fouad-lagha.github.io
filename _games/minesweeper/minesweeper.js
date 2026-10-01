(function () {
    "use strict";

    const root = document.querySelector("[data-minesweeper]");
    const board = root.querySelector("[data-board]");
    const minesOutput = root.querySelector("[data-mines]");
    const timeOutput = root.querySelector("[data-time]");
    const flagMode = root.querySelector("[data-flag-mode]");
    const levels = {
        beginner: [9, 9, 10],
        intermediate: [16, 16, 40],
        expert: [16, 30, 99]
    };
    let state;
    let timer;

    function neighbors(cell) {
        const result = [];
        for (let row = cell.row - 1; row <= cell.row + 1; row += 1) {
            for (let column = cell.column - 1; column <= cell.column + 1; column += 1) {
                if ((row !== cell.row || column !== cell.column) && state.cells[row]?.[column]) result.push(state.cells[row][column]);
            }
        }
        return result;
    }

    function createState(rows, columns, mines) {
        state = { rows, columns, mines, started: false, ended: false, elapsed: 0, cells: [] };
        for (let row = 0; row < rows; row += 1) {
            state.cells[row] = [];
            for (let column = 0; column < columns; column += 1) state.cells[row][column] = { row, column, mine: false, count: 0, revealed: false, flagged: false, element: null };
        }
        let remaining = mines;
        while (remaining > 0) {
            const cell = state.cells[Math.floor(Math.random() * rows)][Math.floor(Math.random() * columns)];
            if (!cell.mine) { cell.mine = true; remaining -= 1; }
        }
        state.cells.flat().forEach((cell) => { if (!cell.mine) cell.count = neighbors(cell).filter((neighbor) => neighbor.mine).length; });
    }

    function reveal(cell) {
        if (state.ended || cell.revealed || cell.flagged) return;
        cell.revealed = true;
        cell.element.classList.add("revealed");
        if (cell.mine) { cell.element.classList.add("mine"); cell.element.textContent = "*"; end(false); return; }
        if (cell.count) cell.element.textContent = cell.count;
        if (!cell.count) neighbors(cell).forEach(reveal);
        if (state.cells.flat().filter((item) => !item.mine && !item.revealed).length === 0) end(true);
    }

    function toggleFlag(cell) {
        if (state.ended || cell.revealed) return;
        cell.flagged = !cell.flagged;
        cell.element.classList.toggle("flagged", cell.flagged);
        minesOutput.textContent = state.mines - state.cells.flat().filter((item) => item.flagged).length;
    }

    function end(won) {
        state.ended = true;
        clearInterval(timer);
        state.cells.flat().filter((cell) => cell.mine).forEach((cell) => { cell.element.classList.add("mine"); cell.element.textContent = "*"; });
        root.querySelector("[data-reset]").textContent = won ? "You win - play again" : "Game over - try again";
    }

    function start(level) {
        clearInterval(timer);
        const [rows, columns, mines] = levels[level];
        createState(rows, columns, mines);
        board.style.gridTemplateColumns = `repeat(${columns}, 26px)`;
        board.replaceChildren();
        state.cells.flat().forEach((cell) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "minesweeper_cell";
            button.setAttribute("role", "gridcell");
            button.addEventListener("click", () => flagMode.checked ? toggleFlag(cell) : reveal(cell));
            button.addEventListener("contextmenu", (event) => { event.preventDefault(); toggleFlag(cell); });
            cell.element = button;
            board.appendChild(button);
        });
        minesOutput.textContent = mines;
        timeOutput.textContent = "0";
        timer = setInterval(() => { if (!state.ended) { state.elapsed += 1; timeOutput.textContent = state.elapsed; } }, 1000);
    }

    root.querySelectorAll("[data-level]").forEach((button) => button.addEventListener("click", () => start(button.dataset.level)));
    root.querySelector("[data-reset]").addEventListener("click", () => start("beginner"));
    start("beginner");
}());