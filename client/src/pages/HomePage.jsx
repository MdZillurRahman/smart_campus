import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  ClipboardList,
  ShieldCheck,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
  Users,
  Bell,
  BarChart3,
  Building2,
  BookOpen,
  Coffee,
  FlaskConical,
  Lock,
  Library,
} from 'lucide-react'

const ROLES = [
  {
    icon: GraduationCap,
    title: 'Students',
    desc: 'Submit complaints, track progress, and get notified the moment things change.',
    points: ['Submit issues in seconds', 'Filter by status & category', 'Real-time notifications'],
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: ShieldCheck,
    title: 'Admins',
    desc: 'See every complaint, assign to the right staff, and keep the whole pipeline moving.',
    points: ['Full visibility', 'Assign & reopen tickets', 'Resolve with notes'],
    color: 'from-slate-700 to-slate-900',
  },
  {
    icon: Wrench,
    title: 'Staff',
    desc: 'A focused task board showing only what is assigned to you. No noise.',
    points: ['Only your assignments', 'Mark resolved with notes', 'Stay on top of pending'],
    color: 'from-emerald-500 to-teal-600',
  },
]

const FEATURES = [
  { icon: Send, title: 'Quick submission', desc: 'A clean form with category, priority and description — that’s it.' },
  { icon: Bell, title: 'Smart notifications', desc: 'Each role sees only what matters: new tickets, assignments, resolutions.' },
  { icon: BarChart3, title: 'Live dashboards', desc: 'Stats and recent activity surface the most important issues first.' },
  { icon: Lock, title: 'Role-based access', desc: 'Students, staff and admins each have their own protected portal.' },
  { icon: Clock, title: 'Resolution times', desc: 'Track how long each issue takes from submission to fix.' },
  { icon: CheckCircle2, title: 'Clear lifecycle', desc: 'Submitted → In Progress → Resolved. Every status visible at a glance.' },
]

const CATEGORIES = [
  { icon: BookOpen, label: 'Classroom' },
  { icon: Building2, label: 'Hostel' },
  { icon: FlaskConical, label: 'Lab' },
  { icon: ShieldCheck, label: 'Security' },
  { icon: Coffee, label: 'Cafeteria' },
  { icon: Library, label: 'Library' },
]

const STEPS = [
  { num: '01', title: 'Submit', desc: 'A student reports the issue with category, title and priority.' },
  { num: '02', title: 'Assign', desc: 'An admin reviews and assigns the right staff member.' },
  { num: '03', title: 'Resolve', desc: 'Staff fixes it and adds a resolution note. Student is notified.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">SmartCampus</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#roles" className="hover:text-slate-900">Roles</a>
            <a href="#how" className="hover:text-slate-900">How it works</a>
            <a href="#categories" className="hover:text-slate-900">Categories</a>
          </nav>

          <Link to="/login">
            <Button className="h-9 bg-slate-900 hover:bg-slate-800">
              Sign in
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
        <div className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Built for universities
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Campus issues, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">solved faster.</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 sm:text-xl">
              SmartCampus is a role-based complaint and issue tracking platform that connects
              students with the people who keep campus running.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/login">
                <Button size="lg" className="h-12 bg-slate-900 px-6 hover:bg-slate-800">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#how">
                <Button size="lg" variant="outline" className="h-12 px-6">
                  How it works
                </Button>
              </a>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { v: '3', l: 'User roles' },
              { v: '6', l: 'Categories' },
              { v: '<1m', l: 'To submit' },
              { v: '24/7', l: 'Available' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <p className="text-3xl font-bold tracking-tight text-slate-900">{s.v}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="border-t border-slate-100 bg-slate-50/50 py-6 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Three roles, one system</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A portal tailored to each user</h2>
            <p className="mt-4 text-slate-600">
              Every role sees only what they need — no clutter, no confusion.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {ROLES.map((r) => (
              <div
                key={r.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} text-white shadow`}>
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{r.desc}</p>
                <ul className="mt-5 space-y-2">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-6 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Features</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to keep campus running.
              </h2>
              <p className="mt-4 text-slate-600">
                A focused feature set designed around the real workflow of submitting,
                assigning and resolving issues.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mx-auto">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-slate-100 bg-slate-900 py-6 text-white sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-white-700">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl !text-white">
              From submission to resolution in three steps
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-blue-300">{s.num}</span>
                  {i < STEPS.length - 1 && (
                    <ArrowRight className="ml-auto h-5 w-5 text-white/30" />
                  )}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-6 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Categories</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Every corner of campus, covered
            </h2>
            <p className="mt-4 text-slate-600">
              Six well-defined categories so issues land with the right team instantly.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((c) => (
              <div
                key={c.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <c.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-slate-800">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-6 py-6 text-center text-white sm:px-12 sm:py-12">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="relative">
            <ClipboardList className="mx-auto h-10 w-10 text-blue-300 mb-6" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl !text-white">
              Ready to bring order to campus complaints?
            </h2>
            <p className="mx-auto mt-4 text-white text-center">
              Sign in with your role and start managing issues the smart way.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/login">
                <Button size="lg" className="h-12 bg-white px-8 text-slate-900 hover:bg-slate-100 cursor-pointer">
                  Sign in to SmartCampus
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">SmartCampus</span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SmartCampus · Complaint & Issue Tracking System
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users className="h-3.5 w-3.5" />
            Built for students, staff & admins
          </div>
        </div>
      </footer>
    </div>
  )
}
