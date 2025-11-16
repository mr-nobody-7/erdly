"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { useStore } from "@/lib/store"
import {
  Database,
  Users,
  History,
  Share2,
  Download,
  Undo2,
  Moon,
  Save,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              E
            </div>
            <span className="text-xl font-bold">ERDly</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <Zap className="h-3 w-3" />
                <span>The complete platform to build ERD diagrams</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight animate-fade-in-up animation-delay-100">
              Design database schemas with <span className="text-primary">visual clarity</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed animate-fade-in-up animation-delay-200">
              Your team's toolkit to create, collaborate, and manage entity relationship diagrams. Build better
              databases with ERDly's intuitive visual editor.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up animation-delay-300">
              <Button size="lg" className="text-base px-8 transition-transform hover:scale-105" asChild>
                <Link href="/register">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 bg-transparent transition-transform hover:scale-105"
                asChild
              >
                <Link href="/login">View Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground animate-fade-in animation-delay-400">
              No credit card required • Free forever plan available
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border/40 bg-muted/30 animate-on-scroll opacity-0">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="transition-transform hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-2">10k+</div>
                <div className="text-sm text-muted-foreground">Diagrams Created</div>
              </div>
              <div className="transition-transform hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-2">5k+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="transition-transform hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="transition-transform hover:scale-105">
                <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Auto-Save</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-24">
          <div className="text-center mb-16 animate-on-scroll opacity-0">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
              Everything you need to build better databases
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Powerful features designed for developers, database architects, and teams who value clarity and
              collaboration.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 animate-on-scroll opacity-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Visual ERD Builder</h3>
              <p className="text-muted-foreground leading-relaxed">
                Drag-and-drop interface to create tables, define fields with types, primary keys, and foreign keys.
                Build complex schemas visually.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 animate-on-scroll opacity-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-Time Collaboration</h3>
              <p className="text-muted-foreground leading-relaxed">
                Work together with your team in real-time. See who's online with live presence indicators and
                collaborate seamlessly.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 animate-on-scroll opacity-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <History className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Version History</h3>
              <p className="text-muted-foreground leading-relaxed">
                Never lose your work. Access complete version history with timestamps and restore any previous version
                with one click.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 animate-on-scroll opacity-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Public Sharing</h3>
              <p className="text-muted-foreground leading-relaxed">
                Share your diagrams publicly with a unique URL. Perfect for documentation, presentations, or client
                reviews.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 animate-on-scroll opacity-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Export Anywhere</h3>
              <p className="text-muted-foreground leading-relaxed">
                Export your diagrams as JSON for version control or as high-quality images for documentation and
                presentations.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 animate-on-scroll opacity-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Undo2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Undo/Redo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Full undo/redo support with complete history tracking. Experiment freely knowing you can always go back.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 animate-on-scroll opacity-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Moon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Dark/Light Theme</h3>
              <p className="text-muted-foreground leading-relaxed">
                Switch between dark and light themes to match your preference. Easy on the eyes during long design
                sessions.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 animate-on-scroll opacity-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Save className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Auto-Save</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your work is automatically saved every few seconds. Focus on designing, not on remembering to save.
              </p>
            </Card>

            <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 animate-on-scroll opacity-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built with modern web technologies for instant loading and smooth interactions. No lag, just pure
                productivity.
              </p>
            </Card>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/30 py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-on-scroll opacity-0">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Start building in minutes</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                Simple workflow to get you from idea to diagram in no time
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="text-center space-y-4 animate-on-scroll opacity-0 transition-transform hover:scale-105">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold">Create a Diagram</h3>
                <p className="text-muted-foreground">
                  Start with a blank canvas or choose from templates. Add tables with a single click.
                </p>
              </div>

              <div className="text-center space-y-4 animate-on-scroll opacity-0 transition-transform hover:scale-105">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold">Design Your Schema</h3>
                <p className="text-muted-foreground">
                  Add fields, define types, mark primary and foreign keys. Connect tables with relationships.
                </p>
              </div>

              <div className="text-center space-y-4 animate-on-scroll opacity-0 transition-transform hover:scale-105">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold">Share & Export</h3>
                <p className="text-muted-foreground">
                  Collaborate with your team, share publicly, or export to your preferred format.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section id="pricing" className="container mx-auto px-4 py-24">
          <div className="text-center mb-16 animate-on-scroll opacity-0">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Simple, transparent pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Choose the plan that fits your needs. All plans include core features.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="p-8 space-y-6 border-border/50 animate-on-scroll opacity-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div>
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">Perfect for personal projects</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Up to 3 diagrams</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Basic export options</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Community support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full bg-transparent transition-transform hover:scale-105" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </Card>

            <Card className="p-8 space-y-6 border-primary shadow-lg relative animate-on-scroll opacity-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">For professional developers</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Unlimited diagrams</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Advanced export & sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Version history</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>
              <Button className="w-full transition-transform hover:scale-105" asChild>
                <Link href="/register">Start Free Trial</Link>
              </Button>
            </Card>

            <Card className="p-8 space-y-6 border-border/50 animate-on-scroll opacity-0 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div>
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">For teams and organizations</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Team collaboration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Advanced permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">Dedicated support</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 transition-transform hover:scale-105"
                asChild
              >
                <Link href="/register">Contact Sales</Link>
              </Button>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-24 animate-on-scroll opacity-0">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Ready to build better databases?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-balance opacity-90">
              Join thousands of developers and teams who trust ERDly for their database design needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="text-base px-8 transition-transform hover:scale-105"
                asChild
              >
                <Link href="/register">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 transition-transform hover:scale-105"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  E
                </div>
                <span className="text-lg font-bold">ERDly</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The modern way to design and collaborate on database schemas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 ERDly. Built with Next.js, React Flow, and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
