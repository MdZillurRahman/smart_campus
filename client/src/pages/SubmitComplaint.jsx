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

const schema = z.object({
  title:       z.string().min(5,  'Title must be at least 5 characters'),
  description: z.string().min(20, 'Please describe the issue in more detail'),
  category:    z.string().min(1,  'Please select a category'),
  priority:    z.string().min(1,  'Please select a priority'),
})

const CATEGORIES = ['Classroom', 'Hostel', 'Lab', 'Security', 'Cafeteria', 'Library']
const PRIORITIES = ['High', 'Medium', 'Low']

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
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link to="/student/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold mt-2">Submit a Complaint</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Complaint Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-1">
              <Label>Title</Label>
              <Input placeholder="Brief summary of the issue" {...register('title')} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Category</Label>
                <Select onValueChange={v => setValue('category', v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
              </div>

              <div className="space-y-1">
                <Label>Priority</Label>
                <Select onValueChange={v => setValue('priority', v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the issue in detail..."
                rows={5}
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Submitting…' : 'Submit Complaint'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}