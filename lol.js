document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 9;
    const solveButton = document.getElementById("solve-btn");
    solveButton.addEventListener('click', solveSudoku);

    const resetButton = document.getElementById("reset-btn");
    resetButton.addEventListener('click', resetSudoku);

    const sudokuGrid = document.getElementById("sudoku-grid");
    createSudokuGrid(sudokuGrid, gridSize);
});

function createSudokuGrid(sudokuGrid, gridSize) {
    // Clear the existing grid
    sudokuGrid.innerHTML = '';

    // Create the sudoku grid and input cells
    for (let row = 0; row < gridSize; row++) {
        const newRow = document.createElement("tr");
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "cell";
            input.id = `cell-${row}-${col}`;
            cell.appendChild(input);
            newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
    }
}

function resetSudoku() {
    const cellInputs = document.querySelectorAll(".cell");
    cellInputs.forEach((input) => {
        input.value = "";
        input.classList.remove("solved");
        input.classList.remove("backtrack");
    });
}

async function solveSudoku() {
    const gridSize = 9;
    const sudokuArray = [];

    // Fill the sudokuArray with input values from the grid
    for (let row = 0; row < gridSize; row++) {
        sudokuArray[row] = [];
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
        }
    }

    // Identify user-input cells and mark them
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cellId = `cell-${row}-${col}`;
            const cell = document.getElementById(cellId);

            if (sudokuArray[row][col] !== 0) {
                cell.classList.add("user-input");
            }
        }
    }

    // Solve the sudoku and display the solution
    if (await solveSudokuHelper(sudokuArray, 0, 0)) {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);

                // Fill in solved values and apply animation
                if (!cell.classList.contains("user-input")) {
                    cell.value = sudokuArray[row][col];
                    cell.classList.add("solved");
                    await sleep(1); // Adjust the delay as needed
                }
            }
        }
    } else {
        alert("No solution exists for the given Sudoku puzzle.");
    }
}

async function solveSudokuHelper(board, row, col) {
    const gridSize = 9;

    for (; row < gridSize; row++) {
        for (; col < gridSize; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;
                        const cellId = `cell-${row}-${col}`;
                        const cell = document.getElementById(cellId);
                        cell.value = num;
                        cell.classList.add("backtrack");
                        await sleep(50); // Adjust the delay as needed

                        // Recursively attempt to solve the Sudoku
                        if (await solveSudokuHelper(board, row, col + 1)) {
                            return true; // Puzzle solved
                        }

                        board[row][col] = 0; // Backtrack
                        cell.value = "";
                        cell.classList.remove("backtrack");
                        await sleep(50); // Adjust the delay as needed
                    }
                }
                return false; // No valid number found
            }
        }
        col = 0;
    }

    return true; // All cells filled
}

function isValidMove(board, row, col, num) {
    const gridSize = 9;

    // Check row and column for conflicts
    for (let i = 0; i < gridSize; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false; // Conflict found
        }
    }

    // Check the 3*3 subgrid for conflicts
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (board[i][j] === num) {
                return false; // Conflict found
            }
        }
    }

    return true; // No conflicts found
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}