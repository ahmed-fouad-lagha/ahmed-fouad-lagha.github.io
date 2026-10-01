/**
 * Minesweeper.
 *
 * Game logic adapted from ca-minesweeper (MIT License):
 * https://github.com/aviad-benhamo/ca-minesweeper
 *
 * Adapted for this site: classic Minesweeper dimensions, event delegation
 * instead of inline handlers, a Win95 styled panel, and a win/loss message
 * region instead of a cheat/"mine exterminator" button.
 */
(function () {
    "use strict";

    const ICONS = {
        reset: ":-)",
        mine: "*",
        flag: "\u2691",
        lost: "X",
        won: "B)"
    };

    const LEVELS = {
        beginner: { rows: 8, cols: 8, mines: 10 },
        intermediate: { rows: 16, cols: 16, mines: 40 },
        expert: { rows: 16, cols: 30, mines: 99 }
    };

    const root = document.querySelector("[data-minesweeper]");
    if (!root) return;

    const boardEl = root.querySelector("[data-board]");
    const resetEl = root.querySelector("[data-reset]");
    const timerEl = root.querySelector("[data-timer]");
    const messageEl = root.querySelector("[data-message]");
    const levelButtons = root.querySelectorAll("[data-level]");
    const mineCounterEl = root.querySelector(".minesweeper_counter");

    let board = [];
    let level = LEVELS.beginner;
    let isOn = false;
    let ended = false;
    let revealedCount = 0;
    let flaggedCount = 0;
    let timerInterval = null;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function zeroFill(value) {
        return String(Math.max(0, value)).padStart(3, "0");
    }

    function buildBoard() {
        const cells = [];
        for (let row = 0; row < level.rows; row += 1) {
            const cellsInRow = [];
            for (let col = 0; col < level.cols; col += 1) {
                cellsInRow.push({ row, col, minesAround: 0, isRevealed: false, isMine: false, isFlagged: false });
            }
            cells.push(cellsInRow);
        }
        return cells;
    }

    function renderBoard() {
        const fragment = document.createDocumentFragment();
        board.forEach((cellsInRow) => {
            cellsInRow.forEach((cell) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "minesweeper_cell";
                button.dataset.row = cell.row;
                button.dataset.col = cell.col;
                button.setAttribute("role", "gridcell");
                button.setAttribute("aria-label", `Row ${cell.row + 1}, column ${cell.col + 1}`);
                button.textContent = cellContent(cell);
                applyCellState(button, cell);
                fragment.appendChild(button);
            });
        });
        boardEl.replaceChildren(fragment);
        boardEl.style.gridTemplateColumns = `repeat(${level.cols}, 26px)`;
    }

    function cellContent(cell) {
        if (cell.isFlagged) return ICONS.flag;
        if (cell.isRevealed && cell.isMine) return ICONS.mine;
        if (cell.isRevealed && cell.minesAround > 0) return cell.minesAround;
        return "";
    }

    function applyCellState(button, cell) {
        button.classList.toggle("revealed", cell.isRevealed);
        if (cell.isRevealed) {
            button.classList.remove("n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "mine", "mistake");
            if (cell.isMine) {
                button.classList.add(cell.isFlagged ? "mine" : "mistake");
            } else if (cell.minesAround > 0) {
                button.classList.add(`n${cell.minesAround}`);
            }
            button.setAttribute("aria-label", cell.isMine
                ? `Row ${cell.row + 1}, column ${cell.col + 1}, mine`
                : `Row ${cell.row + 1}, column ${cell.col + 1}, ${cell.minesAround} adjacent mines`);
        } else if (cell.isFlagged) {
            button.setAttribute("aria-label", `Row ${cell.row + 1}, column ${cell.col + 1}, flagged`);
        }
    }

    function refreshCell(row, col) {
        const button = cellElement(row, col);
        if (!button) return;
        const cell = board[row][col];
        button.textContent = cellContent(cell);
        applyCellState(button, cell);
    }

    function cellElement(row, col) {
        return boardEl.querySelector(`.minesweeper_cell[data-row="${row}"][data-col="${col}"]`);
    }

    function getNeighbors(row, col) {
        const neighbors = [];
        for (let r = row - 1; r <= row + 1; r += 1) {
            for (let c = col - 1; c <= col + 1; c += 1) {
                if (r === row && c === col) continue;
                if (r < 0 || r >= level.rows || c < 0 || c >= level.cols) continue;
                neighbors.push(board[r][c]);
            }
        }
        return neighbors;
    }

    function setMinesAroundCounts() {
        board.forEach((cellsInRow) => {
            cellsInRow.forEach((cell) => {
                if (cell.isMine) return;
                cell.minesAround = getNeighbors(cell.row, cell.col).filter((n) => n.isMine).length;
            });
        });
    }

    function setMines(firstRow, firstCol) {
        let planted = 0;
        while (planted < level.mines) {
            const row = getRandomInt(0, level.rows);
            const col = getRandomInt(0, level.cols);
            // Never place a mine under the first click.
            if (row === firstRow && col === firstCol) continue;
            const cell = board[row][col];
            if (cell.isMine) continue;
            cell.isMine = true;
            planted += 1;
        }
        setMinesAroundCounts();
    }

    function startTimer() {
        const startTime = Date.now();
        stopTimer();
        timerInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            timerEl.textContent = String(Math.floor(elapsed)).padStart(3, "0");
        }, 200);
    }

    function stopTimer() {
        if (timerInterval !== null) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function updateMinesCounter() {
        mineCounterEl.textContent = zeroFill(level.mines - flaggedCount);
    }

    function setMessage(text) {
        messageEl.textContent = text;
    }

    function expandReveal(cell) {
        getNeighbors(cell.row, cell.col).forEach((neighbor) => {
            if (neighbor.isFlagged || neighbor.isRevealed) return;
            revealSingleCell(neighbor);
            if (neighbor.minesAround === 0) expandReveal(neighbor);
        });
    }

    function revealSingleCell(cell) {
        cell.isRevealed = true;
        revealedCount += 1;
        refreshCell(cell.row, cell.col);
    }

    function reveal(cell) {
        if (ended || cell.isFlagged || cell.isRevealed) return;

        if (!isOn) {
            isOn = true;
            setMines(cell.row, cell.col);
            startTimer();
        }

        revealSingleCell(cell);

        if (cell.isMine) {
            endGame(false);
            return;
        }

        if (cell.minesAround === 0) expandReveal(cell);
        checkGameOver();
    }

    function toggleFlag(cell) {
        if (ended || !isOn || cell.isRevealed) return;
        cell.isFlagged = !cell.isFlagged;
        flaggedCount += cell.isFlagged ? 1 : -1;
        refreshCell(cell.row, cell.col);
        updateMinesCounter();
        checkGameOver();
    }

    function checkGameOver() {
        const totalSafe = level.rows * level.cols - level.mines;
        if (revealedCount < totalSafe) return;
        // Reveal the remaining mines as flags when the player wins.
        board.forEach((cellsInRow) => {
            cellsInRow.forEach((cell) => {
                if (!cell.isMine || cell.isFlagged) return;
                cell.isFlagged = true;
                refreshCell(cell.row, cell.col);
            });
        });
        endGame(true);
    }

    function endGame(won) {
        ended = true;
        isOn = false;
        stopTimer();

        if (!won) {
            board.forEach((cellsInRow) => {
                cellsInRow.forEach((cell) => {
                    if (cell.isMine && !cell.isFlagged) refreshCell(cell.row, cell.col);
                });
            });
        }

        resetEl.textContent = won ? ICONS.won : ICONS.lost;
        setMessage(won ? "You cleared the field!" : "Boom. Better luck next time.");
        levelButtons.forEach((button) => { button.disabled = false; });
    }

    function init() {
        stopTimer();
        board = buildBoard();
        isOn = false;
        ended = false;
        revealedCount = 0;
        flaggedCount = 0;
        renderBoard();
        resetEl.textContent = ICONS.reset;
        timerEl.textContent = "000";
        updateMinesCounter();
        setMessage("");
        levelButtons.forEach((button) => { button.disabled = false; });
    }

    function selectLevel(name) {
        level = LEVELS[name] || LEVELS.beginner;
        init();
    }

    boardEl.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-row]");
        if (!button || !board.length) return;
        reveal(board[Number(button.dataset.row)][Number(button.dataset.col)]);
    });

    boardEl.addEventListener("contextmenu", (event) => {
        const button = event.target.closest("button[data-row]");
        if (!button || !board.length) return;
        event.preventDefault();
        toggleFlag(board[Number(button.dataset.row)][Number(button.dataset.col)]);
    });

    levelButtons.forEach((button) => {
        button.addEventListener("click", () => selectLevel(button.dataset.level));
    });

    resetEl.addEventListener("click", init);

    selectLevel("beginner");
}());
