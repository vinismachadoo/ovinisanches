import * as React from 'react';
import { SudokuGame } from './components/sudoku-game';

export default function DailySudokuPage() {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  console.log(today);

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen flex items-center justify-center">
      <SudokuGame date={today} />
    </div>
  );
}
