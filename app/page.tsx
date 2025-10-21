// ABOUTME: Homepage for Access Realty marketing site
// ABOUTME: Serves as the main landing page with CTAs to the app

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-[#2C5282]">Access Realty</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <a
              href="https://app.access.realty"
              className="bg-[#2C5282] text-white px-4 py-2 rounded-md hover:bg-[#1e3a5f] transition-colors"
            >
              Sign In
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Sell Your House Fast
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get a fair cash offer for your home in minutes. No fees, no repairs, no hassle.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="https://app.access.realty/signup?source=home"
              className="bg-[#2C5282] text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-[#1e3a5f] transition-colors"
            >
              Get Started
            </a>
            <a
              href="https://app.access.realty/signin"
              className="bg-white text-[#2C5282] px-8 py-4 rounded-md text-lg font-semibold border-2 border-[#2C5282] hover:bg-gray-50 transition-colors"
            >
              Sign In
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Access Realty?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Fast Offers</h3>
                <p className="text-gray-600">
                  Get a cash offer in as little as 24 hours
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">No Fees</h3>
                <p className="text-gray-600">
                  No commissions, no closing costs, no hidden fees
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold mb-2">Sell As-Is</h3>
                <p className="text-gray-600">
                  No repairs needed, we buy houses in any condition
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Access Realty. All rights reserved.</p>
          <div className="mt-4 flex gap-6 justify-center">
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
