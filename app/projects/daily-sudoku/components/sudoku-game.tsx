'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateDailySudoku, isSolved, type SudokuGrid } from '../utils/sudoku-generator';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SudokuGameProps {
  date: string;
}

export function SudokuGame({ date }: SudokuGameProps) {
  const puzzle = React.useMemo(() => generateDailySudoku(date), [date]);
  const [grid, setGrid] = React.useState<SudokuGrid>(puzzle.grid);
  const [selectedCell, setSelectedCell] = React.useState<[number, number] | null>(null);
  const [isComplete, setIsComplete] = React.useState(false);
  const [showErrors, setShowErrors] = React.useState(true);
  const initialGrid = React.useRef<SudokuGrid>(puzzle.grid.map((row) => [...row]));

  // Check if puzzle is solved
  React.useEffect(() => {
    if (isSolved(grid, puzzle.solution)) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [grid, puzzle.solution]);

  // Reset grid
  const handleReset = () => {
    setGrid(initialGrid.current.map((row) => [...row]));
    setSelectedCell(null);
    setIsComplete(false);
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    // Only allow editing empty cells or user-filled cells
    if (initialGrid.current[row][col] === 0) {
      setSelectedCell([row, col]);
    }
  };

  // Handle number input
  const handleNumberInput = React.useCallback(
    (num: number) => {
      if (!selectedCell) return;
      const [row, col] = selectedCell;
      if (initialGrid.current[row][col] === 0) {
        let shouldAdvance = false;
        setGrid((currentGrid) => {
          const newGrid = currentGrid.map((r) => [...r]);
          const wasSameNumber = num === currentGrid[row][col];
          newGrid[row][col] = wasSameNumber ? 0 : num; // Toggle if same number
          shouldAdvance = !wasSameNumber;
          return newGrid;
        });

        // Auto-advance to next cell if we added a number (not toggled off)
        if (shouldAdvance) {
          // Move to next empty cell
          let nextRow = row;
          let nextCol = col + 1;
          if (nextCol >= 9) {
            nextCol = 0;
            nextRow = (nextRow + 1) % 9;
          }

          // Find next editable cell
          let found = false;
          for (let i = 0; i < 81; i++) {
            if (initialGrid.current[nextRow][nextCol] === 0) {
              setSelectedCell([nextRow, nextCol]);
              found = true;
              break;
            }
            nextCol++;
            if (nextCol >= 9) {
              nextCol = 0;
              nextRow = (nextRow + 1) % 9;
            }
          }
          if (!found) {
            setSelectedCell(null);
          }
        }
      }
    },
    [selectedCell]
  );

  // Handle keyboard input
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      } else if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') {
        handleNumberInput(0);
      } else if (e.key === 'ArrowUp' && selectedCell[0] > 0) {
        setSelectedCell([selectedCell[0] - 1, selectedCell[1]]);
      } else if (e.key === 'ArrowDown' && selectedCell[0] < 8) {
        setSelectedCell([selectedCell[0] + 1, selectedCell[1]]);
      } else if (e.key === 'ArrowLeft' && selectedCell[1] > 0) {
        setSelectedCell([selectedCell[0], selectedCell[1] - 1]);
      } else if (e.key === 'ArrowRight' && selectedCell[1] < 8) {
        setSelectedCell([selectedCell[0], selectedCell[1] + 1]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, handleNumberInput]);

  // Check if a cell has an error
  const hasError = (row: number, col: number): boolean => {
    if (!showErrors) return false;
    if (grid[row][col] === 0) return false;
    return grid[row][col] !== puzzle.solution[row][col];
  };

  // Check if a cell is in the same region as selected cell (for highlighting)
  const isSameRegion = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    const [selRow, selCol] = selectedCell;
    return (
      row === selRow ||
      col === selCol ||
      (Math.floor(row / 3) === Math.floor(selRow / 3) && Math.floor(col / 3) === Math.floor(selCol / 3))
    );
  };

  const Cell = ({ row, col }: { row: number; col: number }) => {
    const value = grid[row][col];
    const isInitial = initialGrid.current[row][col] !== 0;
    const isSelected = selectedCell?.[0] === row && selectedCell?.[1] === col;
    const isError = hasError(row, col);
    const isInRegion = isSameRegion(row, col);

    return (
      <button
        type="button"
        onClick={() => handleCellClick(row, col)}
        className={cn(
          'relative flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14',
          'border border-border text-center text-lg font-medium',
          'transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          isInitial ? 'bg-muted font-semibold' : 'bg-background hover:bg-accent',
          isSelected && 'ring-2 ring-primary ring-offset-1 z-10',
          isInRegion && selectedCell && !isSelected && 'bg-accent/50',
          isError && 'bg-destructive/20 text-destructive',
          (col + 1) % 3 === 0 && col < 8 && 'border-r-2',
          (row + 1) % 3 === 0 && row < 8 && 'border-b-2'
        )}
      >
        {value !== 0 ? value : ''}
      </button>
    );
  };

  console.log(
    new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sudoku do dia</CardTitle>
            <CardDescription>
              {new Intl.DateTimeFormat('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(new Date(date))}
            </CardDescription>
          </div>
          {isComplete && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Solved!</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sudoku Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-9 gap-0 border-2 border-border p-1 bg-background">
            {Array.from({ length: 81 }).map((_, index) => {
              const row = Math.floor(index / 9);
              const col = index % 9;
              return <Cell key={`${row}-${col}`} row={row} col={col} />;
            })}
          </div>
        </div>

        {/* Number Pad */}
        <div className="flex justify-center gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              size="lg"
              className="h-12 w-12 text-lg font-semibold"
              onClick={() => handleNumberInput(num)}
              disabled={!selectedCell || isComplete}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            size="lg"
            className="h-12 w-12 text-lg font-semibold"
            onClick={() => handleNumberInput(0)}
            disabled={!selectedCell || isComplete}
          >
            ⌫
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset} disabled={isComplete}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowErrors(!showErrors)}>
              {showErrors ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Hide Errors
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Show Errors
                </>
              )}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Use keyboard 1-9 or click numbers • Arrow keys to navigate
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
