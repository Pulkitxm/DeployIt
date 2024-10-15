import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Terminal } from "lucide-react";
import { homepage } from "./lib/config";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col">
      <header className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Terminal className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500" />
          <span className="text-xl sm:text-2xl font-bold tracking-tight">DeployIt</span>
        </div>
        <nav>
          <a
            href={homepage}
            className="text-sm sm:text-base font-medium hover:text-emerald-400 transition-colors"
          >
            Home
          </a>
        </nav>
      </header>
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-2xl p-6 sm:p-8 text-center">
          <h1 className="text-6xl sm:text-7xl font-bold text-emerald-500 mb-2">404</h1>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8 text-sm sm:text-base">
            We're sorry, but the page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col space-y-4">
            <a href={homepage} className="w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-200 py-2 rounded-md shadow-lg text-sm sm:text-base">
                <Home className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Return to Homepage
              </Button>
            </a>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full border-emerald-600 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300 transition-colors duration-200 py-2 rounded-md shadow-lg text-sm sm:text-base"
            >
              <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Go Back
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}