import ReactMarkdown from 'react-markdown'
import LegalLayout from '../components/layout/LegalLayout'

// Magnus: drop your Markdown content here.
const CONTENT = `
## Who We Are

Cachex AS ("Cachex", "we", "us") is a Norwegian company registered at Thorry Kiærs Veg 9, 7055 Trondheim, Norway. We operate a prompt caching proxy that sits between your application and large language model (LLM) APIs.

For privacy questions or data subject requests, contact us at: **privacy@cachex.dev**

---

## What Data We Collect

### Account data
When you sign up, we collect your email address and a hashed password. This is used solely to authenticate you and identify your account.

### API key data
We generate API keys on your behalf. Keys are stored as SHA-256 hashes — we never store the raw key after it is shown to you once.

### Request metadata
When your application sends requests through the Cachex proxy, we log:
- Timestamp
- LLM provider and model
- Token count
- Whether the response was served from cache or forwarded to the LLM
- A hash of the prompt (not the prompt itself)

**We never store prompt content, LLM responses, or any data contained within your requests.** Only the metadata listed above is retained.

### Billing data
Billing is calculated on request and cache hit counts only. Prompt content is never used for billing purposes.

---

## How We Use Your Data

We use the data above to:
- Authenticate your account
- Operate the caching proxy on your behalf
- Display usage statistics in your dashboard
- Calculate and enforce plan limits
- Respond to support requests

We do not sell your data. We do not use your data for advertising.

---

## Legal Basis for Processing

We process your data under the following legal bases (GDPR Article 6):

- **Contract performance** — account data and request metadata are necessary to provide the service you have signed up for
- **Legitimate interests** — operational logging to maintain service reliability and security

---

## Data Retention

| Data type | Retention period |
|---|---|
| Account data | Until account deletion + 30 days |
| Request metadata (logs) | 90 days |
| Hashed API keys | Until revoked or account deleted |
| Billing records | 5 years (Norwegian accounting law) |

When you delete your account, all request metadata and API keys are deleted within 30 days. Billing records are retained for the period required by law.

---

## Sub-processors

We use the following third-party processors to operate the service:

| Processor | Purpose | Location |
|---|---|---|
| Supabase | Database and authentication | EU (AWS eu-west-1) |
| Railway | Backend hosting | EU region |
| Vercel | Frontend hosting | Global CDN |
| Stripe | Payment processing | USA (SCCs in place) |
| Upstash / Redis | Prompt cache | EU region |

We require all sub-processors to maintain appropriate data protection safeguards.

---

## Your Rights

Under GDPR, you have the right to:

- **Access** — request a copy of the personal data we hold about you
- **Rectification** — ask us to correct inaccurate data
- **Erasure** — ask us to delete your personal data ("right to be forgotten")
- **Restriction** — ask us to limit how we process your data
- **Portability** — receive your data in a machine-readable format
- **Object** — object to processing based on legitimate interests

To exercise any of these rights, email **privacy@cachex.dev**. We will respond within 30 days.

You also have the right to lodge a complaint with the Norwegian Data Protection Authority (Datatilsynet) at [datatilsynet.no](https://www.datatilsynet.no).

---

## Data Transfers Outside the EEA

Stripe is based in the United States. Transfers are covered by Standard Contractual Clauses (SCCs) under GDPR Article 46. All other sub-processors operate within the EEA.

---

## Security

We use industry-standard practices to protect your data: TLS in transit, hashed credentials at rest, API keys never stored in plaintext. Access to production systems is restricted to authorised personnel.

---

## Changes to This Policy

We will update this policy as the service evolves. The "Last updated" date at the top of this page reflects the most recent revision. For material changes, we will notify you by email.

---

## Contact

Cachex AS
Thorry Kiærs Veg 9
7055 Trondheim
Norway

Email: privacy@cachex.dev
`

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="2026-03-22">
      <ReactMarkdown>{CONTENT}</ReactMarkdown>
    </LegalLayout>
  )
}
