import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <main className="flex-grow flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
            Facilitez vos transactions d'entreprises
          </h2>
          <p className="text-xl mb-8">
            Xlinks met en relation les cédants et les acquéreurs d'entreprises
            pour simplifier le processus de rachat.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/cedant"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
            >
              Je suis cédant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/acquereur"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 transition-colors"
            >
              Je suis acquéreur
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Xlinks. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
