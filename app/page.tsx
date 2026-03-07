export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white">
      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="text-xl font-bold tracking-tight">
          Oto<span className="text-[#6B4EFF]">Pro</span>
        </span>
        <a
          href="#"
          className="bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Download App
        </a>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-28 text-center">
        <div className="inline-block bg-[#6B4EFF]/10 border border-[#6B4EFF]/30 text-[#A48FFF] text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          Mobile Detailing · At Your Door
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
          Your car, detailed{" "}
          <span className="text-[#6B4EFF]">perfectly.</span>
          <br />
          At your location.
        </h1>

        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Skip the car wash. OtoPro brings professional-grade detailing,
          ceramic coating, and interior restoration straight to your driveway —
          book in under a minute.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors"
          >
            Book a Detail
          </a>
          <a
            href="#services"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-colors"
          >
            View Services
          </a>
        </div>
      </section>

      {/* ── Services ── */}
      <section
        id="services"
        className="max-w-6xl mx-auto px-6 pb-28"
      >
        <h2 className="text-3xl font-bold text-center mb-3">What we offer</h2>
        <p className="text-white/50 text-center mb-12">
          Every service performed by certified professionals with premium products.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: "✨",
              title: "Interior Detail",
              desc: "Full vacuum, shampoo, leather conditioning, and odour elimination.",
            },
            {
              icon: "🚿",
              title: "Exterior Wash & Polish",
              desc: "Hand wash, clay bar, machine polish, and protective wax.",
            },
            {
              icon: "🛡️",
              title: "Ceramic Coating",
              desc: "Long-lasting nano-ceramic protection — hydrophobic, scratch-resistant.",
            },
            {
              icon: "🪟",
              title: "Paint Correction",
              desc: "Remove swirl marks, oxidation, and light scratches for a showroom finish.",
            },
            {
              icon: "🚗",
              title: "Full Detail Package",
              desc: "Interior + exterior combined for a complete head-to-toe transformation.",
            },
            {
              icon: "📱",
              title: "Instant Booking",
              desc: "Pick your service, date, and location — confirmed in seconds via the app.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:border-[#6B4EFF]/40 transition-colors"
            >
              <div className="text-3xl mb-4">{s.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white/[0.02] border-y border-white/[0.06] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-3">How it works</h2>
          <p className="text-white/50 text-center mb-14">Three steps. Zero hassle.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Book online or in-app", desc: "Choose your service, pick a time, and enter your address. Takes under a minute." },
              { step: "02", title: "We come to you", desc: "A certified detailer arrives at your home, office, or wherever your car is parked." },
              { step: "03", title: "Drive away spotless", desc: "Inspect the results, pay securely in-app, and enjoy a professionally detailed vehicle." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-black text-[#6B4EFF]/20 mb-4">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-28 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-5">
          Ready for a cleaner ride?
        </h2>
        <p className="text-white/50 mb-10 text-lg">
          Download the OtoPro app and book your first detail today.
        </p>
        <a
          href="#"
          className="inline-block bg-[#6B4EFF] hover:bg-[#5A3EEE] text-white font-semibold px-10 py-4 rounded-2xl text-lg transition-colors"
        >
          Get the App
        </a>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-white/30 text-sm">
        © {new Date().getFullYear()} OtoPro. All rights reserved.
      </footer>
    </main>
  );
}
