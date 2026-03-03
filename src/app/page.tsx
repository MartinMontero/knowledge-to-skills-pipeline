import type { Metadata } from "next";
import { ArrowRight, Zap, BookOpen, Users, Shield, Globe, Link2, CreditCard, Layers, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Knowledge-to-Skills Pipeline | homebase civic lab",
  description: "Converting published knowledge into composable AI agent skills — with IP attribution and revenue sharing via Nostr Lightning payments.",
};

const skillSuites = [
  {
    name: "Beautiful Trouble",
    author: "Andrew Boyd & Dave Oswald Mitchell",
    license: "CC-BY-SA-4.0",
    skills: 24,
    description: "A toolbox for revolution — tactics, principles, and theories for creative activism",
    status: "Reference Implementation",
  },
  {
    name: "Rules for Radicals",
    author: "Saul Alinsky",
    license: "Standard Copyright",
    skills: 15,
    description: "Pragmatic radicalism — strategies and tactics for community organizing",
    status: "Phase 1",
  },
  {
    name: "Facilitator's Guide",
    author: "Sam Kaner",
    license: "Standard Copyright",
    skills: 18,
    description: "Participatory decision-making frameworks for facilitators",
    status: "Phase 1",
  },
];

const technologies = [
  {
    name: "Onyx",
    icon: BookOpen,
    description: "Nostr-native encrypted knowledge vault. Skills are just markdown notes in your vault.",
    color: "bg-orange-500",
  },
  {
    name: "Maple AI",
    icon: Sparkles,
    description: "Privacy-first inference engine. Zero data retention, E2E encrypted, open-source models.",
    color: "bg-purple-500",
  },
  {
    name: "Nostr",
    icon: Link2,
    description: "Decentralized relay network. No platform lock-in, censorship-resistant skill distribution.",
    color: "bg-blue-500",
  },
  {
    name: "Lightning",
    icon: Zap,
    description: "Native micropayments via Zaps. Real-time revenue splits to IP owners per skill invocation.",
    color: "bg-yellow-500",
  },
];

const businessModels = [
  {
    name: "SkillStream",
    subtitle: "Subscription + Revenue Share",
    icon: Users,
    price: "$12/month",
    description: "Unlimited skill invocations. Revenue distributed to IP owners based on invocation share.",
    features: [
      "Unlimited daily invocations",
      "All public skill suites",
      "Transparent monthly payouts to IP owners",
      "Community tier (free) with 5/day",
    ],
  },
  {
    name: "SkillZap",
    subtitle: "Pay-Per-Invocation",
    icon: CreditCard,
    price: "25-500 sats/invocation",
    description: "Direct value exchange. Each skill invocation triggers real-time Lightning Zap splits.",
    features: [
      "Pay only for what you use",
      "Real-time payments to IP owners",
      "No subscription commitment",
      "Prepaid credit option available",
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-stone-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-700 via-stone-900 to-stone-950" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>
        
        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-500 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">homebase</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-stone-300">
            <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
            <a href="#suites" className="hover:text-white transition-colors">Skill Suites</a>
            <a href="#business" className="hover:text-white transition-colors">Business Models</a>
            <a href="#attribution" className="hover:text-white transition-colors">Attribution</a>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Knowledge-to-Skills Pipeline v1.0
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Turn books into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-purple-400 to-blue-400">
                AI agent skills
              </span>
            </h1>
            <p className="text-xl text-stone-300 mb-8 leading-relaxed max-w-2xl">
              A system for converting published knowledge — books, guides, toolkits — into 
              composable AI agent skills. Delivered through Onyx + Maple AI, with IP attribution 
              and revenue sharing via Nostr Lightning payments.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#suites"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
              >
                Explore Skill Suites
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#pipeline"
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white font-semibold rounded-lg transition-colors"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Pipeline Overview */}
      <section id="pipeline" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">The Conversion Pipeline</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              A repeatable, scalable process for transforming published knowledge into 
              AI-ready agent skills with full IP attribution.
            </p>
          </div>

          <div className="grid md:grid-cols-6 gap-6">
            {[
              { step: 1, title: "Source Classification", desc: "Verify license, assess modularity, map composability" },
              { step: 2, title: "Structure Extraction", desc: "LLM-assisted component inventory and dependency mapping" },
              { step: 3, title: "Skill Architecture", desc: "Design taxonomy, composability relationships, triggers" },
              { step: 4, title: "SKILL.md Generation", desc: "Write frontmatter, body templates, references, assets" },
              { step: 5, title: "Quality Validation", desc: "Human review, test activations, legal clearance" },
              { step: 6, title: "Publication", desc: "GitHub, Nostr relays, Onyx vault, skill index" },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 hover:border-orange-300 transition-colors h-full">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-stone-600">{item.desc}</p>
                </div>
                {item.step < 6 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">The Technology Stack</h2>
            <p className="text-lg text-stone-400 max-w-2xl mx-auto">
              Built on open protocols, open-source AI, and open licensing. No single company controls the ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech) => (
              <div key={tech.name} className="p-6 bg-stone-800/50 rounded-2xl border border-stone-700 hover:border-stone-600 transition-colors">
                <div className={`w-12 h-12 ${tech.color} rounded-xl flex items-center justify-center mb-4`}>
                  <tech.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{tech.name}</h3>
                <p className="text-stone-400 text-sm">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skill Suites */}
      <section id="suites" className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Skill Suites</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Published knowledge converted into composable AI agent skills. 
              Beautiful Trouble serves as the reference implementation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {skillSuites.map((suite) => (
              <div key={suite.name} className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                        suite.status === "Reference Implementation" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-orange-100 text-orange-700"
                      }`}>
                        {suite.status}
                      </span>
                      <h3 className="text-xl font-bold text-stone-900">{suite.name}</h3>
                      <p className="text-sm text-stone-500">{suite.author}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-orange-500">{suite.skills}</div>
                      <div className="text-xs text-stone-500">skills</div>
                    </div>
                  </div>
                  <p className="text-stone-600 mb-4">{suite.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">{suite.license}</span>
                    <a href="#" className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1">
                      View skills <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="#" className="inline-flex items-center gap-2 text-orange-600 font-medium hover:gap-3 transition-all">
              View all 15+ source candidates in the pipeline <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Business Models */}
      <section id="business" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-stone-900 mb-4">Business Models</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Two complementary models serving different user populations. Both share the same 
              attribution chain — IP owners get paid when their knowledge is used.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {businessModels.map((model) => (
              <div key={model.name} className="p-8 bg-stone-50 rounded-2xl border-2 border-stone-200 hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <model.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-stone-900">{model.name}</h3>
                    <p className="text-sm text-stone-500">{model.subtitle}</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-stone-900 mb-2">{model.price}</div>
                <p className="text-stone-600 mb-6">{model.description}</p>
                <ul className="space-y-3">
                  {model.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-stone-600">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attribution System */}
      <section id="attribution" className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">IP Attribution & Revenue Sharing</h2>
              <p className="text-lg text-stone-300 mb-8">
                Every skill invocation produces a complete, cryptographically verifiable attribution chain. 
                IP owners receive automatic Lightning payments — no intermediaries, no delays.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Transparent Attribution</h3>
                    <p className="text-sm text-stone-400">
                      Every AI response includes source citations. Zap receipts (NIP-57) are published 
                      to Nostr relays — publicly auditable.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Real-Time Revenue Splits</h3>
                    <p className="text-sm text-stone-400">
                      Zap splits defined in skill metadata: 70% IP owner, 20% skill author, 10% platform. 
                      Automatic distribution per invocation.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">License Compatibility</h3>
                    <p className="text-sm text-stone-400">
                      CC-BY-SA → ShareAlike derivatives. Commercial licenses negotiated for 
                      All Rights Reserved sources. CC-BY-NC requires separate agreement.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-stone-800 rounded-2xl p-6 font-mono text-sm">
              <div className="text-stone-500 mb-4">{'// Attribution chain for single invocation'}</div>
              <div className="space-y-4">
                <div className="p-3 bg-stone-700/50 rounded-lg">
                  <div className="text-orange-400 mb-1">1. SOURCE WORK</div>
                  <div className="text-stone-300">
                    Title: Beautiful Trouble<br />
                    Authors: Boyd & Mitchell<br />
                    License: CC-BY-SA-4.0
                  </div>
                </div>
                <div className="p-3 bg-stone-700/50 rounded-lg">
                  <div className="text-purple-400 mb-1">2. SKILL DERIVATIVE</div>
                  <div className="text-stone-300">
                    Skill: culture-jamming v1.0<br />
                    Author: homebase-civic-lab<br />
                    License: CC-BY-SA-4.0
                  </div>
                </div>
                <div className="p-3 bg-stone-700/50 rounded-lg">
                  <div className="text-blue-400 mb-1">3. INVOCATION</div>
                  <div className="text-stone-300">
                    Timestamp: 2026-02-23T14:30:00Z<br />
                    Payment: 300 sats<br />
                    Zap: nevent1...
                  </div>
                </div>
                <div className="p-3 bg-stone-700/50 rounded-lg">
                  <div className="text-green-400 mb-1">4. DISTRIBUTION</div>
                  <div className="text-stone-300">
                    IP Owner: 210 sats → npub1_bt...<br />
                    Author: 60 sats → npub1_homebase...<br />
                    Platform: 30 sats → npub1_platform...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Built for the civic renaissance</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Knowledge should be open, attributed, and compensated. Join us in building 
            the open skill ecosystem for civic technology.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/homebase-civic-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 font-semibold rounded-lg hover:bg-stone-100 transition-colors"
            >
              <Globe className="w-5 h-5" />
              View on GitHub
            </a>
            <a
              href="https://nostr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900/30 text-white font-semibold rounded-lg hover:bg-stone-900/50 transition-colors backdrop-blur-sm"
            >
              <Zap className="w-5 h-5" />
              Follow on Nostr
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-500 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-stone-300">homebase civic lab</span>
            </div>
            <p className="text-sm">
              A civic renaissance lab for downtown Nanaimo, BC. 
              Powered by Nostr, Maple AI, and the belief that knowledge should be open.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
