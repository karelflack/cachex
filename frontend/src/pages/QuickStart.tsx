import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import Tabs from '../components/ui/Tabs'
import CodeBlock from '../components/ui/CodeBlock'

const PROXY_URL = 'https://cachex-production.up.railway.app/proxy'

function buildSnippets(cachexKey: string) {
  return {
    curl: `curl -X POST "${PROXY_URL}" \\
  -H "Content-Type: application/json" \\
  -H "X-Api-Key: ${cachexKey}" \\
  -d '{
    "provider": "openai",
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`,

    python: `import requests

response = requests.post(
    "${PROXY_URL}",
    headers={"X-Api-Key": "${cachexKey}"},
    json={
        "provider": "openai",
        "model": "gpt-4o",
        "messages": [{"role": "user", "content": "Hello"}],
    },
)
print(response.json())`,

    node: `const response = await fetch("${PROXY_URL}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": "${cachexKey}",
  },
  body: JSON.stringify({
    provider: "openai",
    model: "gpt-4o",
    messages: [{ role: "user", content: "Hello" }],
  }),
})
console.log(await response.json())`,
  }
}

export default function QuickStart() {
  const location = useLocation()
  const navigate = useNavigate()
  const cachexKey: string = location.state?.key ?? 'YOUR_CACHEX_KEY'
  const snippets = buildSnippets(cachexKey)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink">Quick-start</h1>
        <p className="text-sm text-ink-muted mt-1">
          One line change. Point your existing OpenAI client at Cachex.
        </p>
      </div>

      <div className="bg-surface border border-stroke rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-6 h-6 rounded-full bg-teal-subtle border border-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-bold text-teal">1</span>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Replace the base URL</p>
            <p className="text-xs text-ink-muted mt-0.5">
              No SDK changes needed — the Cachex proxy is fully OpenAI-compatible.
            </p>
          </div>
        </div>

        <Tabs
          tabs={[
            { id: 'curl', label: 'curl', content: <CodeBlock code={snippets.curl} language="bash" /> },
            { id: 'python', label: 'Python', content: <CodeBlock code={snippets.python} language="python" /> },
            { id: 'node', label: 'Node.js', content: <CodeBlock code={snippets.node} language="javascript" /> },
          ]}
        />
      </div>

      <div className="bg-surface border border-stroke rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-teal-subtle border border-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-bold text-teal">2</span>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Watch your cache hit rate climb</p>
            <p className="text-xs text-ink-muted mt-0.5">
              Repeated or similar prompts are served from cache. Check the dashboard after your
              first few requests to see savings accumulate.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-ink-faint">
          Your Cachex key:{' '}
          <span className="font-mono text-ink-muted">
            {cachexKey.length > 20 ? `${cachexKey.slice(0, 12)}••••` : cachexKey}
          </span>
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Go to dashboard
          <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  )
}
