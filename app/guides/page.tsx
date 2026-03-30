import Link from 'next/link'
import type { Metadata } from 'next'
import { articles, categoryLabels, type Article } from '@/lib/articles'
import { NavServer } from '../components/nav-server'
import { Footer } from '../components/footer'

export const metadata: Metadata = {
  title: 'Car Detailing Guides & Tips',
  description:
    'Expert guides on ceramic coating, paint protection, and car care for Canadian drivers. Learn how to protect your vehicle from road salt, harsh winters, and UV damage.',
  alternates: { canonical: 'https://otopro.ca/guides' },
}

const categoryOrder: Article['category'][] = ['canada', 'ceramic', 'general']

const categoryDescriptions: Record<Article['category'], string> = {
  canada: 'Protecting your vehicle in Canada\'s harsh climate. Salt, UV, and freeze-thaw cycles.',
  ceramic: 'Everything you need to know about ceramic coatings, from how they work to long-term care.',
  general: 'Detailing fundamentals: paint correction, clay bar, interior care, and more.',
}

export default function GuidesPage() {
  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    description: categoryDescriptions[cat],
    articles: articles.filter((a) => a.category === cat),
  }))

  return (
    <>
    <main className="relative z-10 min-h-screen bg-surface-primary text-foreground rounded-b-[32px] shadow-[0_4px_40px_rgba(0,0,0,0.15)]">
      <NavServer />

      <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-accent-blue-500/10 border border-accent-blue-500/30 text-accent-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            {articles.length} guides
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Car Detailing Guides
          </h1>
          <p className="text-dark-silver text-lg max-w-2xl mx-auto">
            In-depth guides on protecting your car in Canada, from ceramic coating
            science to seasonal detailing schedules.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {grouped.map(({ category, label, description, articles: catArticles }) => (
            <section key={category}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1">{label}</h2>
                <p className="text-grey text-sm">{description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/guides/${article.slug}`}
                    className="group bg-surface-widget border border-dark-grey rounded-2xl p-6 hover:border-accent-blue-500/40 hover:bg-surface-widget/80 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          category === 'canada'
                            ? 'bg-blue-400/10 text-blue-400'
                            : category === 'ceramic'
                            ? 'bg-accent-blue-500/10 text-accent-blue-500'
                            : 'bg-green-400/10 text-green-400'
                        }`}
                      >
                        {label}
                      </span>
                      <span className="text-dark-grey text-xs">{article.readTime} min read</span>
                    </div>

                    <h3 className="font-semibold text-base leading-snug mb-2 group-hover:text-accent-blue-300 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-grey text-sm leading-relaxed line-clamp-2">
                      {article.description}
                    </p>

                    <div className="mt-4 text-accent-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Read guide &rarr;
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
    <Footer />
    </>
  )
}
