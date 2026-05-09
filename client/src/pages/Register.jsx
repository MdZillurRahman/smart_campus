import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register as registerUser } from '../api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCircle2,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react'

const schema = z
  .object({
    fullname: z.string().min(2, 'Full name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    password_confirmation: z.string(),
    role: z.enum(['student', 'staff', 'admin'], {
      errorMap: () => ({ message: 'Please select a role' }),
    }),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation'],
  })

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'staff', label: 'Staff' },
  { value: 'admin', label: 'Admin' },
]

export default function Register() {
  const { loginUser } = useAuth()
  const [pending, setPending] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setServerError('')
    try {
      const res = await registerUser(data)

      if (res.token) {
        loginUser(res.token, res.user)
      } else {
        setPending(true)
      }
    } catch (err) {
      const data = err.response?.data
      const msg = data?.errors?.join(', ') || data?.error || 'Registration failed. Please try again.'
      setServerError(msg)
    }
  }

  // Pending approval screen
  if (pending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-10">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardContent className="p-8 text-center space-y-5">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Registration Submitted
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Your account is pending approval. You will be notified once an
                administrator approves your request.
              </p>
            </div>
            <Link to="/login" className="block">
              <Button variant="outline" className="w-full h-11">
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-slate-50">
      {/* Left brand panel */}
      <div className="hidden lg:flex relative flex-col justify-between p-10 bg-gradient-to-br from-indigo-600 via-blue-700 to-slate-900 text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">SmartCampus</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Join the campus community
          </div>
          <h1 className="text-4xl font-bold leading-tight !text-white">
            Create your account and get things done.
          </h1>
          <p className="text-white/70 leading-relaxed">
            Submit complaints, track resolutions, and stay connected with your
            campus — all in one place.
          </p>
          <ul className="space-y-3 text-sm text-white/80 my-4">
            {[
              'Role-based access for students, staff & admins',
              'Real-time complaint tracking',
              'Secure & private by design',
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/50">
          © {new Date().getFullYear()} SmartCampus. All rights reserved.
        </p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-slate-900">
              SmartCampus
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              It only takes a minute to get started.
            </p>
          </div>

          <Card className="border-0 shadow-xl shadow-slate-200/60">
            <CardContent className="p-6 sm:p-7">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullname" className="text-slate-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="fullname"
                      placeholder="Your full name"
                      className="pl-9 h-11"
                      {...register('fullname')}
                    />
                  </div>
                  {errors.fullname && (
                    <p className="text-xs text-red-500">
                      {errors.fullname.message}
                    </p>
                  )}
                </div>

                {/* Username + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="username" className="text-slate-700">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="username"
                        placeholder="Username"
                        className="pl-9 h-11"
                        {...register('username')}
                      />
                    </div>
                    {errors.username && (
                      <p className="text-xs text-red-500">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-9 h-11"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <Label className="text-slate-700">Role</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                    <Select
                      onValueChange={(v) =>
                        setValue('role', v, { shouldValidate: true })
                      }
                    >
                      <SelectTrigger className="pl-9 h-11">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.role && (
                    <p className="text-xs text-red-500">{errors.role.message}</p>
                  )}
                </div>

                {/* Passwords */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-slate-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 6 characters"
                        className="pl-9 pr-9 h-11"
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password_confirmation"
                      className="text-slate-700"
                    >
                      Confirm
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="password_confirmation"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repeat password"
                        className="pl-9 pr-9 h-11"
                        {...register('password_confirmation')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showConfirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.password_confirmation && (
                      <p className="text-xs text-red-500">
                        {errors.password_confirmation.message}
                      </p>
                    )}
                  </div>
                </div>

                {serverError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
                    {serverError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white font-medium shadow-lg shadow-indigo-600/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>

          <p className="!mt-6 text-center text-xs text-slate-400">
            By creating an account you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
