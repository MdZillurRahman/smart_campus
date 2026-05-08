import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { useCreateComplaint } from '../hooks/useComplaints'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2, Send, AlertCircle } from 'lucide-react'

const schema = z.object({
  title:       z.string().min(5,  'Title must be at least 5 characters'),
  description: z.string().min(20, 'Please describe the issue in more detail'),
  category:    z.string().min(1,  'Please select a category'),
  priority:    z.string().min(1,  'Please select a priority'),
})

const CATEGORIES = ['Classroom', 'Hostel', 'Lab', 'Security', 'Cafeteria', 'Library']
const PRIORITIES = ['High', 'Medium', 'Low']

function FieldError({ message }) {
  if (!message) return null
  return (
    <p className="text-xs text-red-500 inline-flex items-center gap-1 mt-1">
      <AlertCircle className="h-3 w-3" /> {message}
    </p>
  )
}

export default function SubmitComplaint() {
  const navigate = useNavigate()
  const { mutateAsync, isPending } = useCreateComplaint()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    try {
      await mutateAsync(data)
      navigate('/student/complaints')
    } catch {
      alert('Failed to submit complaint. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">

        <div className="mb-6">
          <Link
            to="/student/dashboard"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">Submit a Complaint</h1>
          <p className="text-slate-500 text-sm mt-1">
            Provide as much detail as possible so we can resolve it quickly
          </p>
        </div>

        <Card className="border-slate-200/70 shadow-sm">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-base">Complaint Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of the issue"
                  {...register('title')}
                />
                <FieldError message={errors.title?.message} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select onValueChange={v => setValue('category', v, { shouldValidate: true })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.category?.message} />
                </div>

                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Select onValueChange={v => setValue('priority', v, { shouldValidate: true })}>
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.priority?.message} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  rows={6}
                  {...register('description')}
                />
                <FieldError message={errors.description?.message} />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2">
                <Link to="/student/dashboard" className="sm:w-auto">
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto shadow-sm">
                  {isPending ? (
                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Submitting…</>
                  ) : (
                    <><Send className="h-4 w-4 mr-1" /> Submit Complaint</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
