import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy.')
      return
    }
    setLoading(true)
    setError(null)

    const { error } = await signUp(email, password)
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard/keys')
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-base font-semibold text-ink mb-1">Create your account</h1>
      <p className="text-sm text-ink-muted mb-6">Start caching LLM requests in minutes.</p>

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
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          hint="Minimum 8 characters"
        />

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-stroke bg-elevated accent-teal cursor-pointer flex-shrink-0"
          />
          <span className="text-xs text-ink-muted leading-relaxed">
            I have read and agree to the{' '}
            <a href="/terms" target="_blank" className="text-teal hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" className="text-teal hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>

        {error && <p className="text-xs text-danger">{error}</p>}

        <Button type="submit" loading={loading} className="w-full mt-1">
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-ink-faint">
        Already have an account?{' '}
        <Link to="/signin" className="text-teal hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
