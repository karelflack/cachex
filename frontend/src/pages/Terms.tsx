import ReactMarkdown from 'react-markdown'
import LegalLayout from '../components/layout/LegalLayout'

// Magnus: drop your Markdown content here.
const CONTENT = `
## 1. Who We Are

These Terms of Service ("Terms") govern your use of Cachex, a prompt caching proxy service operated by **Cachex AS**, Thorry Kiærs Veg 9, 7055 Trondheim, Norway ("Cachex", "we", "us").

By creating an account, you agree to these Terms. If you are signing up on behalf of a company or organisation, you confirm that you have authority to bind that entity.

You must be at least 18 years of age to use this service.

---

## 2. The Service

Cachex provides a caching layer between your application and LLM APIs (such as OpenAI and Anthropic). When your application sends a prompt we have seen before, we return the cached response instead of forwarding it to the upstream provider — reducing your API costs and latency.

---

## 3. Acceptable Use

You may use Cachex only for lawful purposes. You must not:

- Use the service in violation of the terms of service of any upstream LLM provider (including OpenAI and Anthropic)
- Attempt to extract, reverse-engineer, or abuse the caching infrastructure
- Use the service to process data in violation of applicable law, including GDPR
- Resell or sublicense access to the Cachex API without our written consent
- Use the service in a way that could damage, disable, or impair our systems

We reserve the right to suspend or terminate accounts that violate these rules without notice.

---

## 4. Plans, Billing, and Limits

Cachex offers the following plans:

| Plan | Monthly price | Request limit |
|---|---|---|
| Free | $0 | 50,000 requests |
| Starter | $49 | 1,000,000 requests |
| Growth | $199 | 10,000,000 requests |
| Scale | $799 | 50,000,000 requests |
| Enterprise | Custom | Custom |

**Overage cap:** If you exceed your plan limit, the proxy will return a 402 error. You will not be charged more than 2x your tier price in a single billing period without upgrading.

Payments are processed by Stripe. Subscriptions renew monthly. You may cancel at any time; no refunds are issued for the current billing period.

We reserve the right to change pricing with 30 days' notice to existing customers.

---

## 5. Data and Privacy

Your use of the service is also governed by our [Privacy Policy](/privacy).

You are the data controller for any personal data contained in prompts sent through Cachex. Cachex acts as a data processor on your behalf. We never store prompt content — only request metadata (timestamp, model, token count, cache hit/miss, prompt hash).

For enterprise customers requiring a Data Processing Agreement (DPA), contact us at privacy@cachex.dev.

---

## 6. Intellectual Property

Cachex and its infrastructure remain the intellectual property of Cachex AS. These Terms do not grant you any rights to our trademarks, source code, or infrastructure.

You retain all rights to the prompts and outputs that pass through the service.

---

## 7. Liability

To the maximum extent permitted by applicable law:

- Cachex is provided "as is" without warranties of any kind
- We are not liable for any indirect, incidental, or consequential damages
- Our total liability to you for any claim arising from use of the service is capped at the fees you paid to us in the **12 months preceding the claim**

We are not responsible for the content, accuracy, or availability of responses from upstream LLM providers.

---

## 8. Uptime and Service Availability

We aim to provide a reliable service but do not guarantee any specific uptime. We are not liable for losses resulting from downtime, latency, or service interruption.

---

## 9. Termination

You may delete your account at any time from the dashboard. We may suspend or terminate your account if you violate these Terms. On termination, your data is handled as described in the Privacy Policy.

---

## 10. Governing Law

These Terms are governed by Norwegian law. Any disputes shall be subject to the exclusive jurisdiction of the courts of Norway.

---

## 11. Changes to These Terms

We may update these Terms from time to time. Material changes will be communicated by email at least 14 days before they take effect. Continued use of the service after that date constitutes acceptance of the revised Terms.

---

## 12. Contact

Cachex AS
Thorry Kiærs Veg 9
7055 Trondheim
Norway

Email: privacy@cachex.dev
`

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="2026-03-22">
      <ReactMarkdown>{CONTENT}</ReactMarkdown>
    </LegalLayout>
  )
}
