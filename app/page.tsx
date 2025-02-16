import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ThermometerSun, Trees, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-fuchsia-50">
      {/* Hero Section */}
      <section className="px-4 pt-20 md:pt-32 pb-16 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-fuchsia-500 to-purple-600 text-transparent bg-clip-text">
            Your Voice Matters in the Climate Crisis
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Join thousands of concerned citizens in sharing your thoughts about
            global warming. Together, we can make a difference.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800"
            >
              Take Survey <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="border-2">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-purple-50 via-fuchsia-50 to-emerald-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 backdrop-blur-sm bg-white/80 border-2 hover:border-emerald-500 transition-colors">
              <div className="space-y-4">
                <ThermometerSun className="h-12 w-12 text-emerald-500" />
                <h3 className="text-2xl font-bold">1.5°C</h3>
                <p className="text-gray-600">
                  Critical global temperature rise we must prevent
                </p>
              </div>
            </Card>
            <Card className="p-6 backdrop-blur-sm bg-white/80 border-2 hover:border-fuchsia-500 transition-colors">
              <div className="space-y-4">
                <Trees className="h-12 w-12 text-fuchsia-500" />
                <h3 className="text-2xl font-bold">15 Billion</h3>
                <p className="text-gray-600">
                  Trees cut down each year globally
                </p>
              </div>
            </Card>
            <Card className="p-6 backdrop-blur-sm bg-white/80 border-2 hover:border-purple-500 transition-colors">
              <div className="space-y-4">
                <Users className="h-12 w-12 text-purple-500" />
                <h3 className="text-2xl font-bold">7.8 Billion</h3>
                <p className="text-gray-600">
                  People affected by climate change
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Survey Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Make Your Opinion Count
          </h2>
          <p className="text-lg text-gray-600">
            Our comprehensive survey helps understand public perception and
            awareness about global warming. Your responses will contribute to
            valuable research and policy recommendations.
          </p>
          <Card className="p-8 bg-gradient-to-r from-emerald-100 via-fuchsia-100 to-purple-100">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                Survey Highlights
              </h3>
              <ul className="text-left space-y-4 text-gray-600">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-emerald-500" />
                  Personal experiences with climate change
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-fuchsia-500" />
                  Views on environmental policies
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-purple-500" />
                  Ideas for sustainable solutions
                </li>
              </ul>
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 via-fuchsia-500 to-purple-500 hover:from-emerald-600 hover:via-fuchsia-600 hover:to-purple-600"
              >
                Start Survey Now
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t bg-white/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Global Warming Survey. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-600 hover:text-emerald-500">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-fuchsia-500">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-600 hover:text-purple-500">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
