// Sudoku generator using date-based seed for daily puzzles

export type SudokuGrid = number[][];
export type SudokuPuzzle = {
  grid: SudokuGrid;
  solution: SudokuGrid;
  difficulty: number; // number of removed cells
};

// Simple seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    // Convert date string to numeric seed
    this.seed = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }
}

// Check if a number can be placed in a cell
function isValid(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

// Solve Sudoku using backtracking
function solveSudoku(grid: SudokuGrid, rng: SeededRandom): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        // Create shuffled array of numbers 1-9
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        // Shuffle using seeded random
        for (let i = numbers.length - 1; i > 0; i--) {
          const j = rng.nextInt(i + 1);
          [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        for (const num of numbers) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid, rng)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Check if puzzle has unique solution
function hasUniqueSolution(grid: SudokuGrid): boolean {
  let solutionCount = 0;

  function countSolutions(puzzle: SudokuGrid): void {
    if (solutionCount > 1) return;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(puzzle, row, col, num)) {
              puzzle[row][col] = num;
              countSolutions(puzzle);
              puzzle[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    solutionCount++;
  }

  countSolutions(grid.map((row) => [...row]));
  return solutionCount === 1;
}

// Generate a complete Sudoku solution
function generateSolution(seed: string): SudokuGrid {
  const rng = new SeededRandom(seed);
  const grid: SudokuGrid = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));

  // Fill diagonal 3x3 boxes first (they are independent)
  for (let box = 0; box < 9; box += 3) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = rng.nextInt(i + 1);
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    let idx = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        grid[box + i][box + j] = numbers[idx++];
      }
    }
  }

  solveSudoku(grid, rng);
  return grid;
}

// Remove cells to create puzzle
function createPuzzle(solution: SudokuGrid, seed: string, difficulty: number = 40): SudokuGrid {
  const rng = new SeededRandom(seed + '-puzzle');
  const puzzle = solution.map((row) => [...row]);

  const cells: Array<[number, number]> = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push([i, j]);
    }
  }

  // Shuffle cells
  for (let i = cells.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  let removed = 0;
  for (const [row, col] of cells) {
    if (removed >= difficulty) break;

    const temp = puzzle[row][col];
    puzzle[row][col] = 0;

    if (hasUniqueSolution(puzzle.map((r) => [...r]))) {
      removed++;
    } else {
      puzzle[row][col] = temp;
    }
  }

  return puzzle;
}

// Generate daily Sudoku puzzle
export function generateDailySudoku(date: string = new Date().toISOString().split('T')[0]): SudokuPuzzle {
  const solution = generateSolution(date);
  const grid = createPuzzle(solution, date, 40);

  return {
    grid,
    solution,
    difficulty: grid.flat().filter((cell) => cell === 0).length,
  };
}

// Validate if the current grid matches the solution
export function isSolved(currentGrid: SudokuGrid, solution: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (currentGrid[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }
  return true;
}

// Check if current grid is valid (no conflicts)
export function isValidGrid(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (num === 0) continue;

      // Check row (excluding current cell)
      for (let x = 0; x < 9; x++) {
        if (x !== col && grid[row][x] === num) return false;
      }

      // Check column (excluding current cell)
      for (let x = 0; x < 9; x++) {
        if (x !== row && grid[x][col] === num) return false;
      }

      // Check 3x3 box (excluding current cell)
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const checkRow = startRow + i;
          const checkCol = startCol + j;
          if (checkRow !== row && checkCol !== col && grid[checkRow][checkCol] === num) {
            return false;
          }
        }
      }
    }
  }
  return true;
}
