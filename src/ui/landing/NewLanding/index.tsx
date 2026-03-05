import React from "react";
import Image from "next/image";
import { ChevronDown, ArrowRight, Code, Building2, Users } from "lucide-react";

export default function NewLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ============================================
          FLOATING NAV
          ============================================ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="text-xl font-bold text-white drop-shadow-lg">
            Andamio
          </a>
          <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/30 px-2 py-1 backdrop-blur-md">
            <a href="#developers" className="rounded-full px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              Developers
            </a>
            <a href="#organizations" className="rounded-full px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              Organizations
            </a>
            <a href="#contributors" className="rounded-full px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              Contributors
            </a>
            <a href="#" className="rounded-full px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              Docs
            </a>
            <a href="#" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
              App
            </a>
          </div>
        </div>
      </nav>

      {/* ============================================
          HERO - Full Screen Landing
          ============================================ */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ filter: "brightness(1.5) saturate(0.6)" }}>
          <Image
            src="/images/hero-bg.png"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl">
            Credentials That
            <br />
            <span className="text-primary">Belong to You</span>
          </h1>
          <p className="mx-auto mb-12 max-w-xl text-lg text-white/70 sm:text-xl">
            An open protocol for verifiable credentials.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#developers"
              className="group flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Code className="h-5 w-5 opacity-60" />
              Build
            </a>
            <a
              href="#organizations"
              className="group flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Building2 className="h-5 w-5 opacity-60" />
              Run Projects
            </a>
            <a
              href="#contributors"
              className="group flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              <Users className="h-5 w-5 opacity-60" />
              Contribute
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button
            onClick={() =>
              document
                .getElementById("developers")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-white/40 transition-colors hover:text-white/60"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>
      </section>

      {/* ============================================
          STORY 1: DEVELOPERS
          ============================================ */}
      <section id="developers" className="min-h-screen bg-zinc-950 py-24 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-20 flex items-center gap-3 text-zinc-500">
            <Code className="h-5 w-5" />
            <span className="text-sm uppercase tracking-widest">Build</span>
          </div>

          <h2 className="mb-16 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            One API call.
            <br />
            <span className="text-zinc-500">Credential on-chain.</span>
          </h2>

          {/* Code Example */}
          <div className="mb-16 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-800/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-zinc-600" />
              <div className="h-3 w-3 rounded-full bg-zinc-600" />
              <div className="h-3 w-3 rounded-full bg-zinc-600" />
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed">
              <code>
                <span className="text-green-400">curl</span>
                {" -X POST api.andamio.io/v2/credentials \\\n  -d "}
                <span className="text-yellow-400">{`'{ "recipient": "dev@example.com", "skill": "rust" }'`}</span>
                {"\n\n"}
                <span className="text-zinc-500"># → on_chain: true</span>
              </code>
            </pre>
          </div>

          <div className="mb-16 grid gap-12 lg:grid-cols-2">
            <div className="space-y-6 text-zinc-400">
              <p>No wallet setup for your users. No gas estimation. No blockchain expertise required.</p>
              <p>Recipients sign up with email. You sponsor the transactions. ~$0.17 per credential.</p>
            </div>
            <div className="space-y-6 text-zinc-400">
              <p>Credentials live on Cardano. Portable. Verifiable. Permanent.</p>
              <p>Open source protocol. Your users own their identity.</p>
            </div>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Read the docs <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ============================================
          STORY 2: ORGANIZATIONS
          ============================================ */}
      <section id="organizations" className="min-h-screen bg-background py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-20 flex items-center gap-3 text-muted-foreground">
            <Building2 className="h-5 w-5" />
            <span className="text-sm uppercase tracking-widest">Run Projects</span>
          </div>

          <h2 className="mb-16 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            You define the credentials.
            <br />
            <span className="text-muted-foreground">You decide who earns them.</span>
          </h2>

          <div className="mb-16 grid gap-12 lg:grid-cols-2">
            <div className="space-y-6 text-muted-foreground">
              <p>Design credentials that mean something. Set the requirements. Control who can issue them.</p>
              <p>Your credentials. Your standards. Your reputation on the line.</p>
            </div>
            <div className="space-y-6 text-muted-foreground">
              <p>Contributors earn credentials through real work. They own them forever — but you defined what they mean.</p>
              <p>Portable credentials backed by your authority as an issuer.</p>
            </div>
          </div>

          <div className="mb-16 grid gap-8 sm:grid-cols-3">
            <div className="space-y-4">
              <div className="text-4xl">📋</div>
              <h4 className="font-semibold text-foreground">Define</h4>
              <p className="text-muted-foreground">
                Create credentials. Set requirements. Control issuance.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl">✅</div>
              <h4 className="font-semibold text-foreground">Issue</h4>
              <p className="text-muted-foreground">
                Award credentials for completed work. On-chain. Permanent.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl">🌐</div>
              <h4 className="font-semibold text-foreground">Extend</h4>
              <p className="text-muted-foreground">
                Your credentials travel with earners. Your reputation grows.
              </p>
            </div>
          </div>

          <div className="mb-16 space-y-4">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Building on Andamio
            </p>
            {[
              { name: "Intersect", desc: "Cardano ecosystem governance" },
              { name: "FC Barcelona", desc: "150K+ fan community" },
              { name: "Syngenta", desc: "Agricultural supply chain" },
              { name: "Toha Network", desc: "Nature regeneration financing" },
            ].map((partner, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border py-4"
              >
                <span className="font-medium text-foreground">{partner.name}</span>
                <span className="text-muted-foreground">{partner.desc}</span>
              </div>
            ))}
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 text-secondary hover:underline"
          >
            See use cases <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ============================================
          STORY 3: CONTRIBUTORS
          ============================================ */}
      <section id="contributors" className="min-h-screen bg-muted/30 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-20 flex items-center gap-3 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span className="text-sm uppercase tracking-widest">Contribute</span>
          </div>

          <h2 className="mb-16 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Your work. Your credentials.
            <br />
            <span className="text-muted-foreground">Portable forever.</span>
          </h2>

          <div className="mb-16 grid gap-12 lg:grid-cols-2">
            <div className="space-y-6 text-muted-foreground">
              <p>Sign up with email. No wallet. No blockchain knowledge.</p>
              <p>Complete courses. Ship projects. Prove skills through real work.</p>
            </div>
            <div className="space-y-6 text-muted-foreground">
              <p>Credentials issued on-chain. Take them anywhere.</p>
              <p>No platform can revoke what you earned.</p>
            </div>
          </div>

          <div className="mb-16 rounded-2xl border border-border bg-card p-8 lg:p-12">
            <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:text-left">
              <div className="text-6xl">🎓</div>
              <div className="flex-grow">
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  Andamio 101
                </h3>
                <p className="text-muted-foreground">
                  15 minutes. Free. Credential on completion.
                </p>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Start <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Explore all courses <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* ============================================
          STATUS - Honest, minimal
          ============================================ */}
      <section className="bg-zinc-950 py-20 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-8 text-sm uppercase tracking-widest text-zinc-500">
            Still Building
          </p>

          <div className="inline-flex flex-wrap justify-center gap-3 text-sm">
            {[
              { done: true, label: "V2 Protocol" },
              { done: true, label: "Platform" },
              { done: true, label: "API" },
              { done: true, label: "Audit" },
              { done: false, label: "Explorer" },
              { done: false, label: "SDK V2" },
            ].map((item, i) => (
              <span
                key={i}
                className={`rounded-full px-4 py-2 ${
                  item.done
                    ? "bg-zinc-800 text-zinc-300"
                    : "border border-zinc-700 text-zinc-500"
                }`}
              >
                {item.done ? "✓ " : "○ "}
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FAQ - Questions, not objections
          ============================================ */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-2xl px-6">
          <div className="divide-y divide-border">
            {[
              {
                q: "Why Cardano?",
                a: "~$0.17 per credential. Native multi-asset. Formal verification. At scale, that's $17K vs $2.5M on Ethereum.",
              },
              {
                q: "Do users need wallets?",
                a: "No. Email signup. Organizations sponsor transactions. Blockchain is invisible.",
              },
              {
                q: "What about GDPR?",
                a: "Personal data stays off-chain. Only hashes go on-chain. 18 months of R&D on this.",
              },
              {
                q: "What if Andamio disappears?",
                a: "Credentials live on Cardano. Open source protocol. Your credentials outlive any company.",
              },
            ].map((item, i) => (
              <div key={i} className="py-6">
                <h3 className="font-medium text-foreground">{item.q}</h3>
                <p className="mt-2 text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
