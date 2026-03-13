import RequestInput from "../components/RequestInput";
import RequestsDashboard from "@/components/ProcurementDashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-20 font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            AI Procurement Analyzer
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Paste a procurement request below and let the AI extract structured data like
            product, quantity, brands, budget, delivery deadline, and location.
          </p>
        </header>

        <RequestInput />
        
        <RequestsDashboard />
      </main>
    </div>
  );
}
