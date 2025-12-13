import { EvolutionChart } from './components/evolution-chart';

export default function Brasileirao2025Page() {
  return (
    <div className="container mx-auto p-10 h-svh flex flex-col gap-y-4 items-center">
      <h1 className="text-3xl font-bold mb-2">Brasileirão 2025</h1>

      <EvolutionChart />
    </div>
  );
}
