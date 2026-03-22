import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      setError('Invalid email or password.')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-base font-semibold text-ink mb-1">Welcome back</h1>
      <p className="text-sm text-ink-muted mb-6">Sign in to your Cachex account.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end mt-1.5">
            <a href="#" className="text-xs text-ink-faint hover:text-ink-muted transition-colors">
              Forgot password?
            </a>
          </div>
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}

        <Button type="submit" loading={loading} className="w-full mt-1">
          Sign in
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-ink-faint">
        Don't have an account?{' '}
        <Link to="/signup" className="text-teal hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
