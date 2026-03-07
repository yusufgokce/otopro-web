import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getArticle, articles, categoryLabels } from '@/lib/articles'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  return {
    title: `${article.title} | OtoPro Guides`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const categoryColour = {
    canada: 'bg-blue-500/10 text-blue-400',
    ceramic: 'bg-purple-500/10 text-purple-400',
    general: 'bg-emerald-500/10 text-emerald-400',
  }[article.category]

  // Related articles: same category, excluding self
  const related = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Oto<span className="text-[#6B4EFF]">Pro</span>
        </Link>
        <Link
          href="/guides"
          className="text-sm text-white/50 hover:text-white transition-colors"
        >
          ← All Guides
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 pt-10 pb-24">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColour}`}>
            {categoryLabels[article.category]}
          </span>
          <span className="text-white/30 text-sm">{article.readTime} min read</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
          {article.title}
        </h1>

        {/* Intro */}
        <p className="text-lg text-white/60 leading-relaxed mb-10 pb-10 border-b border-white/[0.08]">
          {article.intro}
        </p>

        {/* Sections */}
        <div className="space-y-10">
          {article.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold mb-4">{section.heading}</h2>
              <div className="space-y-4">
                {section.paragraphs.map((para, j) => (
                  <p key={j} className="text-white/60 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Key Takeaways */}
        <div className="mt-12 bg-[#6B4EFF]/10 border border-[#6B4EFF]/20 rounded-2xl p-6">
          <h2 className="font-semibold text-[#A48FFF] mb-4">Key Takeaways</h2>
          <ul className="space-y-2">
            {article.keyTakeaways.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                <span className="text-[#6B4EFF] mt-0.5 shrink-0">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-10 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 text-center">
          <h3 className="font-semibold text-lg mb-2">Ready to protect your car?</h3>
          <p className="text-white/50 text-sm mb-6">
            Book a professional detail or ceramic coating with OtoPro — at your location.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Book a Detail
          </Link>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-semibold text-lg mb-6">Related Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/guides/${rel.slug}`}
                  className="group bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 hover:border-[#6B4EFF]/40 transition-all"
                >
                  <p className="text-sm font-medium leading-snug group-hover:text-[#A48FFF] transition-colors">
                    {rel.title}
                  </p>
                  <p className="text-xs text-white/30 mt-1">{rel.readTime} min read</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  )
}
