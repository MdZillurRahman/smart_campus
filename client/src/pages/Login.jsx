import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Lock, User, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export default function Login() {
  const { loginUser } = useAuth()
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const res = await login(data)
      loginUser(res.token, res.user)
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.'
      setServerError(msg)
    }
  }

  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get('expired') === 'true';

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-12 text-white">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">SmartCampus</p>
            <p className="text-xs text-white/60">Complaint & Issue Tracking</p>
          </div>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Report it. Track it.<br />
            <span className="text-blue-300">Get it resolved.</span>
          </h1>
          <p className="max-w-md text-white/70">
            A unified platform for students, staff, and administrators to manage campus
            issues from submission to resolution.
          </p>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <ShieldCheck className="h-4 w-4 text-blue-300" />
            <span>Secure role-based access</span>
          </div>
        </div>

        <div className="relative text-xs text-white/40">
          © {new Date().getFullYear()} SmartCampus · v1.0
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <p className="text-lg font-semibold tracking-tight text-slate-900">SmartCampus</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-500">Sign in to continue to your dashboard.</p>
          </div>

          {sessionExpired && (
            <div className="mb-4 my-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
              Your session has expired. Please sign in again.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-700">Username</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="username"
                  placeholder="e.g. student1"
                  className="h-11 pl-9"
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="h-11 pl-9 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <Button
              type="submit"
              className="h-11 w-full bg-slate-900 font-medium hover:bg-slate-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Demo credentials
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="font-medium text-slate-700">Student</p>
                <p className="text-slate-500">student1</p>
                <p className="text-slate-500">student123</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="font-medium text-slate-700">Admin</p>
                <p className="text-slate-500">admin1</p>
                <p className="text-slate-500">admin123</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="font-medium text-slate-700">Staff</p>
                <p className="text-slate-500">staff1</p>
                <p className="text-slate-500">staff123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
