export interface ArticleSection {
  heading: string
  paragraphs: string[]
}

export interface Article {
  slug: string
  title: string
  description: string
  category: 'ceramic' | 'canada' | 'general'
  readTime: number
  intro: string
  sections: ArticleSection[]
  keyTakeaways: string[]
}

export const articles: Article[] = [
  // ── CERAMIC COATING ────────────────────────────────────────────────────────
  {
    slug: 'ceramic-coating-vs-ceramic-spray',
    title: 'Ceramic Coating vs Ceramic Spray: What\'s the Difference?',
    description: 'Not all "ceramic" products are the same. Learn the real difference between professional ceramic coating and ceramic spray wax — and which one your car actually needs.',
    category: 'ceramic',
    readTime: 6,
    intro: 'Walk into any auto shop and you\'ll see shelves full of products with the word "ceramic" on the label. But professional ceramic coating and ceramic spray wax are fundamentally different products — one bonds chemically to your paint, the other washes off in a few weeks. Here\'s everything you need to know.',
    sections: [
      {
        heading: 'What Is Professional Ceramic Coating?',
        paragraphs: [
          'Professional ceramic coating is a liquid polymer — typically silicon dioxide (SiO₂) or titanium dioxide (TiO₂) — that chemically bonds with your vehicle\'s clear coat when applied correctly. Unlike wax or sealant that sits on top of the paint, ceramic coating becomes part of the surface itself.',
          'Because of this chemical bond, a professional coating is permanent in the sense that it can only be removed by abrasion (wet sanding, compounding) — not by washing, UV exposure, or rain. A quality professional application typically lasts 3–7 years depending on the product, environment, and maintenance.',
          'Application requires paint decontamination, paint correction, and a climate-controlled environment. That\'s why it\'s a professional service, not a weekend DIY project.',
        ],
      },
      {
        heading: 'What Is Ceramic Spray Wax?',
        paragraphs: [
          'Ceramic spray waxes and "SiO₂ boost sprays" are consumer-grade products that contain a very small concentration of ceramic particles suspended in a carrier solution. They\'re designed to be quick and easy — spray on, wipe off. Some are applied after a car wash, others are "spray-and-rinse" products.',
          'The key distinction: they do not chemically bond to your paint. They sit on top of the clear coat just like traditional carnauba wax, providing a thin sacrificial layer. The result looks great right after application, but durability is measured in weeks to months, not years.',
          'They are genuinely useful as a maintenance product on top of a professional coating, or for someone who wants a temporary boost in water beading and gloss on a budget.',
        ],
      },
      {
        heading: 'How Do They Compare Head to Head?',
        paragraphs: [
          'Durability: Professional coating lasts 3–7 years. Ceramic spray lasts 1–3 months. Hardness: Professional coatings achieve 9H hardness on the pencil scale, providing real scratch resistance. Spray products offer minimal hardness improvement over the clear coat. Chemical resistance: Professional coatings are highly resistant to acidic bird droppings, bug splatter, and road salt — spray products are not.',
          'Cost: Professional coating runs $800–$2,500+ depending on vehicle size and prep work needed. Ceramic spray costs $20–$60 a bottle. Protection depth: Coating provides measurable protection against UV oxidation, light scratches, and chemical etching. Sprays mainly provide water beading and a temporary shine.',
        ],
      },
      {
        heading: 'Which One Does Your Car Actually Need?',
        paragraphs: [
          'If your car is newer, in good condition, or you plan to keep it for several years — especially in a harsh Canadian climate with road salt, freeze-thaw cycles, and UV — a professional ceramic coating is one of the best investments you can make in protecting your paint.',
          'If you already have a professional coating, a ceramic spray applied every few months is an excellent maintenance product that keeps the coating performing at its best. They\'re designed to work together, not compete.',
          'If your car is older, heavily swirled, or you\'re not ready to invest in a full coating, a ceramic spray gives you some protection and a great-looking finish while you decide on a longer-term plan.',
        ],
      },
    ],
    keyTakeaways: [
      'Professional ceramic coating chemically bonds to paint and lasts 3–7 years',
      'Ceramic spray wax sits on top of the paint and lasts 1–3 months',
      'Only professional coatings provide real scratch resistance and chemical protection',
      'Ceramic sprays work great as a maintenance layer on top of an existing coating',
      'In Canada\'s harsh climate, a professional coating is the superior long-term investment',
    ],
  },
  {
    slug: 'does-ceramic-coating-protect-against-road-salt',
    title: 'Does Ceramic Coating Protect Against Road Salt in Canada?',
    description: 'Canadian roads are saturated with salt every winter. Here\'s exactly what ceramic coating does — and doesn\'t — protect your car from when it comes to road salt damage.',
    category: 'ceramic',
    readTime: 7,
    intro: 'Canada applies over 5 million tonnes of road salt annually. If you drive in Ontario, Quebec, or any other province with a real winter, your car is being attacked by salt from November through April. Ceramic coating is one of the best defences available — but it\'s not magic. Here\'s the honest breakdown.',
    sections: [
      {
        heading: 'How Road Salt Damages Your Car',
        paragraphs: [
          'Road salt (sodium chloride or calcium chloride) attacks your vehicle in multiple ways. On the paint surface, it creates a corrosive environment that accelerates oxidation — especially once it mixes with moisture and UV exposure. You\'ll see this as cloudiness, chalking, or a dull finish on unprotected paint.',
          'Salt also works its way into every gap, seam, and crevice. The undercarriage is the most vulnerable: salt collects on the subframe, wheel wells, brake lines, and exhaust, causing rust that can be structurally serious and extremely expensive to repair.',
          'Even on the exterior, constant freeze-thaw cycles cause micro-contraction and expansion in your clear coat. Salt particles embedded in the paint surface create tiny stress fractures over time, accelerating paint failure.',
        ],
      },
      {
        heading: 'What Ceramic Coating Actually Protects Against',
        paragraphs: [
          'Ceramic coating creates a hydrophobic (water-repelling) barrier over your clear coat with a hardness rating of up to 9H. For road salt specifically, this means salt water beads up and rolls off the surface rather than sitting on the paint and being absorbed into micro-pores in the clear coat.',
          'The coating is also chemically resistant to the acidic and alkaline compounds in road salt mixtures. Where bare clear coat would be slowly etched by prolonged salt contact, a ceramic-coated surface maintains its integrity through the chemical resistance of the SiO₂ layer.',
          'UV protection is another relevant benefit: UV damage weakens clear coat, making it more susceptible to salt penetration. By blocking UV, ceramic coating keeps the clear coat in better condition throughout the salt season.',
        ],
      },
      {
        heading: 'What Ceramic Coating Cannot Do',
        paragraphs: [
          'Ceramic coating does not protect your undercarriage. The coating is applied to painted exterior surfaces — not to bare metal, frame rails, brake lines, or wheel wells. For undercarriage protection, you need a separate rust-proofing or undercoating treatment (annual oil spray or rubberized undercoating).',
          'It also cannot reverse existing rust or salt damage. If your paint is already oxidized or there\'s existing corrosion, coating over it seals the damage in rather than repairing it. This is why paint correction before coating is so important.',
          'A ceramic coating doesn\'t make your car impervious to rock chips either — for that, you need paint protection film (PPF). Deep rock chips expose bare metal which can still rust regardless of what\'s on the painted panels.',
        ],
      },
      {
        heading: 'Maximizing Salt Protection in Canada',
        paragraphs: [
          'The best protection strategy for Canadian winters combines ceramic coating on painted surfaces with annual undercoating or rust-proofing for the undercarriage. Many detailers offer both services. Think of it as two separate systems protecting different parts of the vehicle.',
          'Washing your car regularly through the winter — ideally after every major snowfall or salt event — is also critical. No coating, however good, performs well if salt is allowed to build up on the surface for weeks. A touchless automatic wash or a hand wash at a professional detail shop between major details keeps the coating performing optimally.',
          'Finally, consider a pre-winter detail in October or November before the salt season starts. This gets your coating inspected, decontaminated, and topped up with a maintenance spray so it enters the harsh season in peak condition.',
        ],
      },
    ],
    keyTakeaways: [
      'Ceramic coating creates a hydrophobic barrier that repels salt water and resists chemical etching',
      'It protects exterior painted surfaces — not the undercarriage, which needs separate rust-proofing',
      'Canada\'s salt season makes ceramic coating one of the best investments for paint preservation',
      'Combine coating with annual undercoating for complete winter protection',
      'Regular winter washes maintain coating performance even in salt-heavy conditions',
    ],
  },
  {
    slug: 'how-long-does-ceramic-coating-last',
    title: 'How Long Does Ceramic Coating Last? (Honest Answer)',
    description: 'Marketing claims range from 2 years to "lifetime." Here\'s what ceramic coating actually lasts — broken down by product tier, environment, and maintenance habits.',
    category: 'ceramic',
    readTime: 5,
    intro: 'You\'ll see ceramic coatings marketed as lasting "5 years," "10 years," or even "lifetime." The truth is more nuanced — and more honest than most marketing copy will tell you. Here\'s a real breakdown of what affects how long your coating will last.',
    sections: [
      {
        heading: 'The Honest Durability Ranges by Product Tier',
        paragraphs: [
          'Consumer-grade DIY ceramic coatings (the $50–$150 kits) realistically last 1–2 years under normal conditions. They use lower SiO₂ concentrations and are formulated to be more forgiving of imperfect application conditions, which also means less durability.',
          'Professional-grade coatings applied by a certified installer (Ceramic Pro, Gyeon, IGL, XPEL Fusion+) typically last 3–5 years for standard packages and 5–7+ years for multi-layer "lifetime" packages when properly maintained.',
          '"Lifetime" warranties are real — but they come with maintenance requirements (annual inspections, specific wash procedures) and are tied to a specific installer. Ignore those requirements and the warranty is void.',
        ],
      },
      {
        heading: 'How Canadian Climate Affects Longevity',
        paragraphs: [
          'Canada\'s climate is harder on coatings than many others. The combination of UV exposure in summer, freeze-thaw cycles in shoulder seasons, road salt from November to April, and temperature extremes (-30°C to +35°C) all stress the coating more than a mild coastal climate would.',
          'In Canadian conditions, a coating that might last 5 years in Arizona might realistically deliver 3–4 years before it needs to be removed and reapplied. This isn\'t a flaw — it\'s physics. Budget for re-coating every 3–5 years in a harsh Canadian climate rather than expecting a 7-year claim to hold.',
          'That said, even 3 years of protection from a quality coating far outperforms the 3–6 months you\'d get from a quality wax or sealant — and the paint underneath will be in dramatically better condition when the coating eventually needs to be redone.',
        ],
      },
      {
        heading: 'What Makes Coatings Fail Early',
        paragraphs: [
          'Improper prep is the #1 reason coatings fail prematurely. If the paint isn\'t properly decontaminated, paint-corrected, and IPA-wiped before application, the coating bonds to contamination instead of the clear coat — and the contamination releases first.',
          'Harsh wash methods are the second leading cause. Automatic car washes with abrasive brushes, using dish soap (which strips protective layers), and not following a two-bucket wash method all degrade ceramic coatings faster than normal weathering.',
          'Neglecting maintenance is the third factor. Most professional coatings benefit from a "top up" spray or a yearly maintenance detail. Skipping this means the coating thins over time without being replenished.',
        ],
      },
    ],
    keyTakeaways: [
      'Consumer DIY coatings: 1–2 years. Professional coatings: 3–7 years',
      'Canadian climate (salt, freeze-thaw, UV) will reduce longevity compared to milder climates',
      'Proper prep before application is the biggest factor in coating longevity',
      'Avoid automatic brush car washes — they are the fastest way to degrade a coating',
      'Annual maintenance details extend coating life significantly',
    ],
  },
  {
    slug: 'is-ceramic-coating-worth-it-canada',
    title: 'Is Ceramic Coating Worth It in Canada?',
    description: 'With Canadian winters, road salt, and harsh UV summers — is ceramic coating actually worth the investment? Here\'s an honest cost-benefit analysis for Canadian drivers.',
    category: 'canada',
    readTime: 6,
    intro: 'Ceramic coating isn\'t cheap. A quality professional application on a mid-size vehicle in Canada typically runs $1,000–$2,000. Is it worth it? For most Canadian car owners who plan to keep their vehicle for more than 2–3 years, the answer is yes — but the math depends on your specific situation.',
    sections: [
      {
        heading: 'The True Cost of NOT Protecting Your Paint',
        paragraphs: [
          'Unprotected paint in a Canadian climate deteriorates measurably faster than paint in milder climates. Road salt etches unprotected clear coat. UV in summer oxidizes it. Freeze-thaw cycles create micro-cracks. After 5–7 years of Canadian winters without protection, many vehicles show significant paint fade, oxidation, and corrosion that requires professional paint correction or partial repainting.',
          'A full paint correction costs $500–$1,500. A partial respray of hood and fenders can run $1,500–$3,000. A full repaint is $3,000–$8,000+. These aren\'t rare outcomes for vehicles driven year-round in Ontario, Quebec, or the Prairies without paint protection.',
          'By contrast, a ceramic coating that costs $1,500 today and preserves your paint for 5+ years replaces the need for major paint correction work and dramatically improves resale value.',
        ],
      },
      {
        heading: 'The Resale Value Argument',
        paragraphs: [
          'Paint condition is one of the top three factors used in used car appraisals (alongside mileage and mechanical condition). A vehicle with excellent, glossy, defect-free paint can command $500–$2,000 more than the same vehicle with oxidized or swirled paint, depending on the model and market.',
          'A ceramic-coated car that\'s been properly maintained will have paint that looks significantly better at 5–7 years old than an equivalent uncoated vehicle. The gloss and depth that ceramic coating adds also makes the car look newer, which affects buyer perception even before the appraisal.',
          'For a vehicle you plan to sell after 5 years, a $1,500 coating investment that recovers $1,000–$1,500 in resale value essentially pays for itself — with years of wash ease and a beautiful finish as the "free" bonus.',
        ],
      },
      {
        heading: 'The Lifestyle Argument: Easier Maintenance',
        paragraphs: [
          'A ceramic-coated car is dramatically easier to keep clean. The hydrophobic surface means road grime, bird droppings, mud, and salt don\'t bond to the paint the way they do on uncoated surfaces. A quick rinse removes most contamination. Washes take half the time and effort.',
          'You also eliminate the need for regular waxing — which on an uncoated car should be done every 3–4 months to maintain protection. Over 5 years, that\'s 15–20 waxing sessions at $30–$80 each in product and labour, totalling $450–$1,600 in maintenance costs that a coating replaces.',
          'The time savings compound too. If you spend 2 hours waxing your car four times a year, that\'s 40 hours over 5 years. With a coating, your maintenance time drops to occasional maintenance sprays after washes.',
        ],
      },
      {
        heading: 'Who It\'s NOT Worth It For',
        paragraphs: [
          'If you plan to sell or trade in your vehicle within 1–2 years, a ceramic coating probably won\'t deliver enough long-term benefit to justify the upfront cost. In that timeframe, a quality paint sealant ($100–$200 applied) is a more appropriate investment.',
          'If your paint is heavily damaged (deep scratches, rust, significant oxidation), those issues need to be addressed first — coating over damaged paint is never recommended. The cost of paint correction plus coating together may exceed what makes financial sense for an older vehicle.',
        ],
      },
    ],
    keyTakeaways: [
      'For vehicles kept 3+ years in Canada, ceramic coating typically pays for itself through preserved resale value',
      'The harsh Canadian climate (salt, UV, freeze-thaw) makes paint protection more important than in milder climates',
      'Coating eliminates years of waxing costs and dramatically reduces wash time',
      'Not worth it if you\'re selling within 2 years, or if paint needs major repair first',
      'A $1,000–$2,000 investment is reasonable for a vehicle worth $25,000–$80,000',
    ],
  },
  {
    slug: 'ceramic-coating-vs-paint-protection-film',
    title: 'Ceramic Coating vs Paint Protection Film (PPF): Which Do You Need?',
    description: 'Ceramic coating and PPF are both premium paint protection options — but they protect against completely different threats. Here\'s how to choose, or combine both.',
    category: 'ceramic',
    readTime: 7,
    intro: 'Ceramic coating and paint protection film (PPF) are often discussed as competing products, but they\'re really complementary. One excels where the other has limitations. Understanding the difference helps you make the right investment for your vehicle and driving habits.',
    sections: [
      {
        heading: 'What Paint Protection Film Actually Does',
        paragraphs: [
          'Paint protection film is a thick (6–10 mil) urethane film applied directly to painted surfaces, most commonly the front bumper, hood, fenders, and mirrors — the areas hit by road debris at highway speed. Its primary purpose is to absorb physical impacts: stone chips, gravel, bug impacts, and light abrasions that would otherwise chip or scratch the paint.',
          'High-quality PPF (XPEL Ultimate, 3M Scotchgard Pro) is also self-healing — heat from the sun or a heat gun causes the film to "remember" its original shape, causing light surface scratches to disappear. It\'s also optically clear and virtually invisible when installed professionally.',
          'PPF is the only product that truly prevents rock chips. Nothing else — no ceramic coating, wax, or sealant — stops a piece of gravel from chipping your paint. If rock chips are your primary concern, PPF is the answer.',
        ],
      },
      {
        heading: 'Where Ceramic Coating Outperforms PPF',
        paragraphs: [
          'Ceramic coating wins on chemical protection, UV resistance, and hydrophobicity. Its 9H hardness and chemical resistance make it superior to PPF for protecting against bird droppings, road salt, acid rain, and UV oxidation. PPF on its own, without a coating on top, is actually somewhat porous and can stain from prolonged bird dropping contact.',
          'Ceramic coating also covers the entire vehicle easily — every panel, the glass, the wheels, even trim. A full-vehicle PPF wrap is extremely expensive ($3,000–$8,000+) whereas ceramic coating the entire car is a fraction of that cost. For comprehensive chemical and UV protection, coating makes more economic sense.',
          'Maintenance ease is also a ceramic advantage. A coated surface is dramatically easier to clean than uncoated PPF. This is why professional installers almost always recommend ceramic coating over PPF as a finishing layer.',
        ],
      },
      {
        heading: 'The Best of Both: Combining PPF and Ceramic Coating',
        paragraphs: [
          'The highest level of paint protection — chosen by supercar owners, enthusiasts, and anyone with a new expensive vehicle — combines both: PPF on the high-impact zones (full front end, rocker panels, door edges) with ceramic coating over the PPF and on the rest of the vehicle.',
          'This gives you physical impact protection where you need it most, plus chemical and hydrophobic protection everywhere. The ceramic coating on top of the PPF also makes the film easier to maintain, prevents staining, and adds gloss.',
          'This combination typically runs $3,000–$6,000+ depending on how much PPF coverage you choose, but for a $60,000+ vehicle, many owners consider it the most sensible way to protect their investment.',
        ],
      },
      {
        heading: 'What Makes Sense for Canadian Drivers?',
        paragraphs: [
          'For most Canadian drivers with a newer vehicle, ceramic coating alone is the right starting point. It handles the biggest threats specific to Canada: road salt, UV oxidation, and the general grime that accumulates faster in a climate with distinct wet and muddy seasons.',
          'If you regularly drive on highways with significant gravel or construction debris — common on rural Ontario and Quebec roads — adding a PPF front-end package ($800–$1,500) on top of a full ceramic coating is money well spent. The front bumper and hood are the most expensive panels to repaint after stone chip damage.',
        ],
      },
    ],
    keyTakeaways: [
      'PPF protects against physical impacts (rock chips, gravel) — ceramic coating does not',
      'Ceramic coating is superior for chemical resistance, UV protection, and hydrophobicity',
      'Combining both (PPF on high-impact zones + coating over everything) is the gold standard',
      'For most Canadian drivers, ceramic coating alone addresses the primary threats',
      'PPF makes sense if you frequently drive highways with loose gravel or construction zones',
    ],
  },
  {
    slug: 'how-ceramic-coating-works',
    title: 'How Does Ceramic Coating Work? The Science Explained Simply',
    description: 'What actually happens when ceramic coating bonds to your paint? Here\'s the chemistry behind why it\'s so durable, hydrophobic, and scratch-resistant — explained without a chemistry degree.',
    category: 'ceramic',
    readTime: 5,
    intro: 'The word "ceramic" gets thrown around in detailing marketing constantly, but few people understand what actually happens at the molecular level when a coating is applied. Understanding the chemistry helps you appreciate why preparation, application conditions, and curing time matter so much.',
    sections: [
      {
        heading: 'The Active Ingredient: Silicon Dioxide (SiO₂)',
        paragraphs: [
          'Most professional ceramic coatings are built around silicon dioxide — the same compound found in quartz and glass. In liquid coating form, it\'s in a nano-particle state suspended in a solvent carrier. When applied to paint, the solvent evaporates and the SiO₂ particles begin bonding to the surface.',
          'The clear coat on your car has microscopic pores and peaks. The SiO₂ nano-particles fill these pores and form covalent bonds with the silica in the clear coat itself. This isn\'t an adhesive bond — it\'s a chemical bond, similar to how two materials fuse rather than one sticking to the other.',
          'The result is a new layer that is, for practical purposes, part of the paint surface. That\'s why it can only be removed by abrasion — it can\'t be peeled, washed, or chemically stripped in normal conditions.',
        ],
      },
      {
        heading: 'Why It\'s Hydrophobic',
        paragraphs: [
          'The SiO₂ surface that forms after curing has a very specific molecular orientation: the silicon-oxygen bonds point inward toward the paint, while the outer face presents silanol groups (Si-OH) that have low surface energy. Low surface energy means liquids can\'t spread easily on the surface — they bead up and roll off instead.',
          'This is hydrophobicity. Water contact angles on a freshly coated surface typically measure 100–115 degrees, meaning water droplets are almost perfectly spherical. On bare paint, the contact angle is 50–70 degrees — water spreads out and sits rather than beading.',
          'The practical benefit: water carries dirt. When water beads and rolls off a ceramic-coated surface, it takes most of the contamination with it. This is called the "self-cleaning effect" — and it\'s why ceramic-coated cars stay cleaner longer between washes.',
        ],
      },
      {
        heading: 'Where the Hardness Comes From',
        paragraphs: [
          'The "9H hardness" claim refers to the pencil hardness scale — a coating rated 9H means a 9H pencil won\'t scratch it. This sounds impressive (and is), but it\'s important to understand what it means in practice.',
          'The ceramic layer adds genuine hardness that helps resist light abrasions, minor swirl marks from improper washing, and surface scratches from branches or debris. However, it is not impervious to all scratches — a key or a sharp stone will still scratch through a ceramic coating.',
          'The hardness also contributes to chemical resistance. The dense, cross-linked molecular structure resists penetration by acidic and alkaline chemicals, which is why bird droppings (pH 3.5–4.5) and road salt don\'t etch through a coating the way they would an unprotected clear coat.',
        ],
      },
      {
        heading: 'Why Prep and Curing Conditions Matter',
        paragraphs: [
          'Because the coating bonds to whatever is on the paint surface, any contamination — iron particles, tar, water spots, fingerprints — will be bonded in permanently. This is why professional application involves a multi-stage decontamination process (iron remover, clay bar, IPA wipe) before a single drop of coating is applied.',
          'Curing requires specific temperature and humidity conditions — typically 15–25°C and below 70% relative humidity. Too cold and the solvent doesn\'t evaporate properly. Too humid and moisture interferes with the bonding process. This is why professional detailers work in climate-controlled bays, and why "applying ceramic coating on a hot summer day in your driveway" is a recipe for failure.',
        ],
      },
    ],
    keyTakeaways: [
      'Ceramic coatings use SiO₂ nano-particles that form covalent bonds with your clear coat',
      'The result is a layer that is chemically part of the paint — not sitting on top of it',
      'Hydrophobicity comes from low surface energy, causing water to bead and roll off',
      '9H hardness helps resist light scratches but won\'t stop all physical damage',
      'Proper prep and controlled application conditions are critical to a lasting bond',
    ],
  },
  {
    slug: 'how-to-maintain-ceramic-coating',
    title: 'How to Maintain a Ceramic Coating: The Complete Guide',
    description: 'A ceramic coating is only as good as the maintenance behind it. Learn exactly how to wash, protect, and extend the life of your ceramic coating.',
    category: 'ceramic',
    readTime: 6,
    intro: 'Getting a ceramic coating applied is the beginning, not the end. Proper maintenance is what separates a coating that lasts 2 years from one that lasts 6. The good news: maintaining a ceramic-coated car is actually easier than maintaining an uncoated one — you just need to follow a few specific rules.',
    sections: [
      {
        heading: 'The Two-Week Rule After Application',
        paragraphs: [
          'After a professional ceramic coating is applied, it needs time to fully cure. Most professional coatings require a minimum 2–4 weeks of curing time before the coating reaches full hardness and chemical resistance.',
          'During this period, don\'t wash the car, don\'t park it in direct rain for prolonged periods, and don\'t let bird droppings or tree sap sit on the surface. Any water spots or contamination that embeds during the curing window will be locked in permanently. Your detailer will tell you the specific curing time for your product.',
          'After the curing period, you\'re free to wash normally — in fact, washing is encouraged to keep the coating clean and performing well.',
        ],
      },
      {
        heading: 'The Right Way to Wash a Coated Car',
        paragraphs: [
          'Avoid automatic brush car washes entirely. The abrasive brushes in traditional automatic washes will degrade your coating faster than anything else — including road salt. If you need a hands-free wash in winter, a touchless automatic (high-pressure water only, no brushes) is acceptable.',
          'The proper method is the two-bucket wash: one bucket of pH-neutral car shampoo, one bucket of clean rinse water. Use a microfibre wash mitt, not a sponge. Rinse the mitt in the clean water bucket before re-loading with soapy water. This prevents grit from the first pass being dragged across the paint on the second pass.',
          'Dry with a clean, plush microfibre drying towel or a leaf blower to avoid water spots. Never let the car air dry in sun — this bakes minerals onto the coating surface and creates water spots that require professional attention to fully remove.',
        ],
      },
      {
        heading: 'Annual Maintenance and Top-Up Sprays',
        paragraphs: [
          'Most professional coating systems include — or recommend — a maintenance detail every 12 months. This typically involves a decontamination wash, iron remover, light polish if needed, and a "top-up" layer of a compatible maintenance spray. This refreshes the hydrophobic properties and adds back any thickness that\'s been lost to weathering.',
          'Between annual details, a ceramic maintenance spray (an SiO₂ spray applied after every few washes) keeps the surface performing at its best. Products like Gtechniq W6, CarPro HydrO2, or similar are designed to be applied on wet paint right after rinsing — spray on, rinse off. Two minutes of work that maintains peak hydrophobicity.',
        ],
      },
      {
        heading: 'What to Do When Bird Droppings or Sap Land on the Coating',
        paragraphs: [
          'Despite the coating\'s chemical resistance, bird droppings and tree sap should still be removed promptly. Highly acidic droppings can etch through a coating given enough time — especially in hot weather when they dry and concentrate quickly.',
          'Keep a detail spray and a microfibre cloth in your car. Mist the dropping, let it soak for 30 seconds, then gently wipe. Never rub dry contamination — the solid particles will scratch the coating just as they would scratch bare paint.',
        ],
      },
    ],
    keyTakeaways: [
      'Allow 2–4 weeks curing time before washing after application',
      'Use pH-neutral shampoo and a two-bucket method — never abrasive brush car washes',
      'Annual maintenance details significantly extend coating life',
      'SiO₂ maintenance sprays between washes maintain peak hydrophobic performance',
      'Remove bird droppings and tree sap promptly — they can still damage a coating over time',
    ],
  },
  {
    slug: 'can-you-apply-ceramic-coating-in-winter',
    title: 'Can You Apply Ceramic Coating in Winter? (Canadian Answer)',
    description: 'Winter is when you feel like your car needs the most protection — but can ceramic coating actually be applied in cold Canadian weather? Here\'s what you need to know.',
    category: 'canada',
    readTime: 5,
    intro: 'It\'s February, your paint has taken a beating from salt and sand, and you\'re thinking about finally getting ceramic coating done. Can it be applied in winter? The short answer is yes — but only in a climate-controlled environment. Here\'s what that means and what to look for.',
    sections: [
      {
        heading: 'Why Temperature and Humidity Matter for Coating',
        paragraphs: [
          'Ceramic coatings cure through a chemical reaction that requires specific environmental conditions. Most professional coatings specify application temperatures between 10°C and 30°C, with humidity below 70%. Outside these ranges, the solvent carrier in the coating doesn\'t evaporate correctly, the SiO₂ particles don\'t bond properly, and the final coating can be cloudy, uneven, or dramatically reduced in durability.',
          'A professional detailer applies your coating in a climate-controlled garage bay — typically heated to 18–22°C year-round. Temperature outside is irrelevant once the car is inside. This is why a reputable shop can apply ceramic coating any day of the year, including in a Canadian January.',
          'The outdoor temperature becomes relevant after the coating is applied, during the initial curing period. Most shops will advise you to keep the car garaged or at least out of precipitation for the first 24–48 hours after pickup.',
        ],
      },
      {
        heading: 'Is Winter a Good Time for Ceramic Coating?',
        paragraphs: [
          'Winter is actually a strategically smart time to book a ceramic coating — and many detailers are less busy than in spring and summer. The benefits: lower wait times, often better pricing in shoulder season, and you exit winter with fresh, fully cured protection ready for spring UV and summer heat.',
          'There\'s also a logic to doing it during the worst season: if your car is going through a Canadian winter with road salt, that\'s exactly when you want the protection most. A coating applied in December and cured by January means 3–4 months of salt season with maximum protection.',
          'The only thing a winter appointment requires is that you arrive with a reasonably clean car — salt and grime need to be washed off before any paint prep work can begin. A quality shop will handle this as part of the service.',
        ],
      },
      {
        heading: 'What to Avoid: DIY in the Cold',
        paragraphs: [
          'Never attempt to apply ceramic coating in an unheated garage, driveway, or outdoors in Canadian winter conditions. Even "quick cure" consumer coatings require proper temperature ranges. Applying coating to cold paint in a garage at 5°C will result in a poor bond, high-spot streaking, and a coating that fails within months.',
          'If your budget is limited and you want DIY application, wait for a stretch of warm spring weather (15°C+), work in a shaded garage, and ensure humidity is low before applying. Patience in timing pays off dramatically in coating quality.',
        ],
      },
    ],
    keyTakeaways: [
      'Professional ceramic coating CAN be applied in winter — inside a heated, climate-controlled shop',
      'Outdoor temperature is irrelevant when the car is in a properly conditioned bay',
      'Winter is a great time to book — shorter wait times, often better pricing',
      'Never attempt DIY coating application in cold or humid conditions',
      'Allow 24–48 hours of sheltered parking after pickup during the initial cure',
    ],
  },
  {
    slug: 'how-to-wash-ceramic-coated-car',
    title: 'How to Properly Wash a Ceramic Coated Car',
    description: 'Washing a ceramic coated car wrong can degrade your coating in months. Here\'s the exact process to clean it safely and keep the hydrophobic layer performing at its best.',
    category: 'ceramic',
    readTime: 5,
    intro: 'One of the top ways people accidentally destroy their ceramic coating is with improper washing — specifically, automatic brush car washes. Here\'s the correct process to keep your coating looking perfect and lasting as long as possible.',
    sections: [
      {
        heading: 'What You\'ll Need',
        paragraphs: [
          'Two buckets (one for shampoo solution, one for clean rinse water), a pH-neutral car shampoo (NOT dish soap or all-purpose cleaner), a microfibre wash mitt, a plush microfibre drying towel or leaf blower, and optionally a ceramic maintenance spray for after the wash.',
          'pH-neutral shampoo is critical. Dish soap and household cleaners are highly alkaline and strip the hydrophobic layer from the coating quickly. Always look for "pH neutral" or "pH balanced" on the label of any car care product you use on a coated surface.',
        ],
      },
      {
        heading: 'The Correct Wash Process',
        paragraphs: [
          'Start with a pre-rinse — flood the car with water from a hose or pressure washer to knock off loose dirt and salt before touching the paint with anything. If you have a pressure washer, a foam cannon pre-soak loosens contamination without contact, further reducing scratch risk.',
          'Load your wash mitt in the shampoo bucket. Wash one panel at a time, starting from the roof and working down. After each panel, rinse your mitt in the clean water bucket, then reload with shampoo. This is the two-bucket method — it prevents you from dragging grit picked up from one panel across the next panel.',
          'After washing, rinse thoroughly and dry immediately. Air drying causes water spots as minerals in the water evaporate and concentrate on the surface. Use a large, soft microfibre drying towel with blotting motions (not dragging) or blow water off with a leaf blower or dedicated car dryer.',
        ],
      },
      {
        heading: 'After the Wash: Maintenance Spray',
        paragraphs: [
          'After drying (or while the car is still slightly damp, depending on the product), apply a ceramic maintenance spray. These are designed to be used every few washes — spray on each panel while wet, rinse off, and dry. They restore the water beading behaviour and add a micro-layer of SiO₂ back to the surface.',
          'You\'ll immediately notice the water beading when you rinse — the droplets will sheet off dramatically. This is the coating working as intended and the maintenance spray keeping it at peak performance.',
        ],
      },
      {
        heading: 'What to Absolutely Avoid',
        paragraphs: [
          'Never use a standard automatic car wash with spinning brushes. These are the #1 enemy of ceramic coatings — the brushes create swirl marks and physically abrade the coating off the surface, dramatically shortening its life.',
          'Never use dish soap, all-purpose cleaners, or any cleaning product not specifically designed for automotive finishes. Never rub dry contamination — always mist with a detail spray first to lubricate the surface before wiping. And never allow water to sit and air-dry on a coated surface in direct sun.',
        ],
      },
    ],
    keyTakeaways: [
      'Use the two-bucket method with pH-neutral car shampoo',
      'Automatic brush car washes are the fastest way to ruin a ceramic coating',
      'Dry immediately after washing — never let water air-dry in sun',
      'Apply a ceramic maintenance spray every few washes to restore hydrophobicity',
      'Touchless automatic washes are acceptable in a pinch, but hand washing is always better',
    ],
  },

  // ── CANADA / CLIMATE ───────────────────────────────────────────────────────
  {
    slug: 'car-detailing-in-canadian-winter',
    title: 'Car Detailing in Canadian Winters: The Complete Guide',
    description: 'Road salt, -30°C temperatures, mud, and sand make Canadian winters brutal on vehicles. Here\'s your complete guide to protecting and detailing your car through the Canadian winter season.',
    category: 'canada',
    readTime: 8,
    intro: 'Canadian winters are unambiguously the harshest environment a daily driver encounters. Salt brine is sprayed on roads before storms, sand and gravel are scattered by sand trucks, temperatures swing from -35°C to +5°C in the same week, and cars sit in frozen slush for months. This guide covers everything you need to know to protect your vehicle through it.',
    sections: [
      {
        heading: 'The Pre-Winter Detail: Your Most Important of the Year',
        paragraphs: [
          'The most important detailing appointment of the year happens in October or November — before the salt season begins. A thorough fall detail decontaminates the paint from summer\'s iron deposits, tar, and UV exposure, then applies a fresh layer of protection before the car faces months of corrosive road salt.',
          'A proper pre-winter detail includes: iron decontamination spray to dissolve embedded iron particles from brake dust, clay bar treatment to remove bonded surface contamination, paint protection (wax, sealant, or ceramic top-up), interior treatment to condition leather and protect fabric, and a check of any existing paint chips that should be touched up before salt gets into bare metal.',
          'If your car has a ceramic coating, the pre-winter detail should include an inspection and maintenance spray top-up so the coating enters salt season in optimal condition.',
        ],
      },
      {
        heading: 'Washing Through the Winter: How Often and How',
        paragraphs: [
          'Many Canadians stop washing their car through the winter months, reasoning that it\'ll just get dirty again. This is one of the most damaging things you can do for your paint and undercarriage. Road salt needs to be rinsed off regularly — ideally every 7–10 days of driving in salt conditions, or within 48 hours of a major salt event.',
          'You don\'t need a full detail in winter — a basic touchless wash ($10–$15) is sufficient for regular cleaning. The goal is to remove salt before it has time to sit on paint, work into seams, and accelerate corrosion.',
          'The best time to wash in winter is on a day above 0°C, ideally in the afternoon when temperatures are at their peak. Washing in freezing temperatures risks water freezing in door seals, locks, and around wipers — which creates its own set of problems.',
        ],
      },
      {
        heading: 'Protecting the Undercarriage',
        paragraphs: [
          'No paint protection product touches your undercarriage. The undercarriage is where salt truly does its worst damage: corroding brake lines, fuel lines, subframe members, exhaust, and rocker panels. This rust is structural and expensive — and it\'s preventable.',
          'Annual rust-proofing or undercoating is strongly recommended for Canadian vehicles. There are two main approaches: oil-spray rust inhibitor (like Krown or Barry\'s), which penetrates seams and self-heals, applied annually in the fall; and rubberized undercoating, which provides a thicker physical barrier but doesn\'t penetrate as deeply into seams.',
          'Many detailers offer undercarriage wash and rust-proofing as a combined service. This is particularly valuable in the pre-winter appointment — a high-pressure undercarriage wash removes accumulated summer grime, and the rust inhibitor is then sprayed into clean surfaces for maximum penetration.',
        ],
      },
      {
        heading: 'Interior Winter Protection',
        paragraphs: [
          'Winter is brutal on car interiors too. The combination of wet boots, rock salt tracked in on floor mats, and road slush creates conditions that permanently stain upholstery and degrade carpeting.',
          'All-weather rubber floor mats (Weathertech, 3D Maxpider, OEM winter mats) are the single best interior investment for Canadian winters. They contain tracked-in salt and slush so it never reaches the carpet underneath. Remove and rinse them every few weeks when salt builds up.',
          'Leather seats in cold climates become brittle and crack faster without regular conditioning. Apply a quality leather conditioner in the fall and again in spring — the freeze-thaw exposure accelerates the drying that leads to cracking.',
        ],
      },
      {
        heading: 'The Post-Winter Detail: The Spring Cleaning Your Car Needs',
        paragraphs: [
          'When winter finally ends, your car will be coated in a season\'s worth of salt residue, sand, and grime. The spring detail is about undoing that damage before it compounds further into the warm, wet spring months when rust accelerates.',
          'Spring detailing priority #1 is a thorough undercarriage wash with high pressure water to blast out accumulated salt from every crevice. Priority #2 is iron decontamination on the paint surface — a full season of brake dust and road grime embeds into unprotected paint. Priority #3 is paint inspection: check for new rock chips that should be touched up, any areas where the protective coating has thinned, and address any light scratches before they worsen.',
        ],
      },
    ],
    keyTakeaways: [
      'The pre-winter detail in October/November is your most important of the year',
      'Wash your car every 7–10 days through the salt season — don\'t let salt sit',
      'Undercarriage rust-proofing annually is essential for Canadian vehicles',
      'Rubber all-weather floor mats prevent salt and slush from permanently staining interior carpet',
      'The spring post-winter detail undoes the season\'s damage before it compounds',
    ],
  },
  {
    slug: 'how-often-should-you-detail-your-car',
    title: 'How Often Should You Detail Your Car in Canada?',
    description: 'There\'s no universal answer — it depends on how you drive, where you park, and the Canadian season. Here\'s a practical seasonal schedule for Canadian car owners.',
    category: 'canada',
    readTime: 5,
    intro: 'How often you detail depends on how you drive and where you live. A daily commuter in Toronto encounters far more salt, road grime, and contamination than a weekend driver in a small town. Here\'s a practical Canadian schedule broken down by season.',
    sections: [
      {
        heading: 'The Minimum: Twice a Year',
        paragraphs: [
          'If you can only commit to two details a year, make them the pre-winter detail (October/November) and the post-winter detail (April/May). These two appointments address the biggest seasonal threats and keep your car\'s paint and surfaces in fundamentally good condition.',
          'The pre-winter detail applies fresh protection before salt season. The spring detail removes the accumulated damage of winter and refreshes protection for the UV and heat of summer.',
        ],
      },
      {
        heading: 'The Recommended: Four Times a Year (Seasonal)',
        paragraphs: [
          'Fall (October): Full exterior detail, paint protection top-up, interior deep clean and conditioning, undercarriage inspection. Winter (January/February): Light interior clean, rubber mat rinse, touch-up any areas where protection has thinned. Spring (April/May): Full post-winter detail — undercarriage wash, iron decontamination, full exterior and interior. Summer (July): Mid-season refresh — wash, clay bar if needed, gloss enhancer, interior clean.',
          'This seasonal approach keeps your car in excellent condition year-round with a manageable investment — typically $200–$600 per appointment depending on vehicle size and services selected.',
        ],
      },
      {
        heading: 'Adjusting for Your Situation',
        paragraphs: [
          'Daily highway commuters accumulate road contamination, tar, and bug splatter much faster than city drivers. If you drive 20,000+ km per year on highways, consider adding an additional exterior decontamination in midsummer to address tar and bug etching before it has time to work into the paint.',
          'Light-coloured vehicles (white, silver, pearl) show water spots, salt stains, and swirl marks less visibly than dark vehicles. Dark vehicles (black, dark grey, navy) show every swirl and water spot — more frequent washing and an occasional light polish will keep them looking sharp. Ungaraged vehicles in urban areas accumulate more industrial fallout and should be iron decontaminated more frequently.',
        ],
      },
    ],
    keyTakeaways: [
      'Minimum: twice yearly — pre-winter and post-winter details',
      'Recommended: four seasonal details aligned with Canada\'s distinct seasons',
      'High-mileage highway drivers should detail more frequently',
      'Dark-coloured vehicles require more frequent washing to maintain their appearance',
      'Ungaraged vehicles accumulate contamination faster and benefit from more frequent decontamination',
    ],
  },
  {
    slug: 'spring-car-detail-after-canadian-winter',
    title: 'Spring Car Detailing After a Canadian Winter: What Your Car Actually Needs',
    description: 'Your car has just survived 5+ months of road salt, sand, and subzero temperatures. Here\'s exactly what a proper spring detail addresses — and why it matters for long-term paint health.',
    category: 'canada',
    readTime: 6,
    intro: 'Every spring in Canada, millions of vehicles emerge from winter looking like they\'ve been dragged through a salt mine. Because they basically have been. Here\'s what a thorough spring detail actually addresses — and the damage you prevent by doing it promptly.',
    sections: [
      {
        heading: 'Step 1: Undercarriage Salt Removal',
        paragraphs: [
          'The most urgent post-winter job is the undercarriage. Salt that accumulates under the vehicle through the winter continues to corrode metal even after the roads dry up. The warm, wet conditions of spring actually accelerate rust formation as temperature and moisture combine with residual salt.',
          'A professional high-pressure undercarriage wash blasts salt deposits from the subframe, wheel wells, exhaust, and rocker panels. This should happen as soon as possible in spring — the longer salt sits on bare metal, the more damage is done. Many car washes offer undercarriage rinse add-ons, but a professional detail will be more thorough.',
        ],
      },
      {
        heading: 'Step 2: Iron Decontamination',
        paragraphs: [
          'Five months of driving through brake dust, industrial fallout, and road debris leaves embedded iron particles across the entire exterior — visible as tiny orange or brown specks if you look closely, and felt as roughness if you run a clean hand across the paint.',
          'Iron remover spray (a chemical that dissolves iron oxide, turning purple as it reacts) is applied to the paint, allowed to dwell, then rinsed off. This removes contamination that no amount of regular washing can touch. Follow with a clay bar to remove any remaining bonded contamination for a glass-smooth surface.',
        ],
      },
      {
        heading: 'Step 3: Paint Inspection and Chip Touch-Up',
        paragraphs: [
          'Spring is the time to inspect every panel for new rock chips, scratches, and areas where clear coat has thinned or failed. Chips that happened in winter — when roads are covered in gravel and debris — should be touched up before spring rain and humidity accelerate rust in the exposed metal.',
          'Even very small chips matter. A chip the size of a pinhead exposes bare metal that begins rusting within weeks in Ontario\'s spring humidity. Touch-up paint applied promptly seals the metal and stops the damage. A detail shop can handle this at the same appointment as the spring detail.',
        ],
      },
      {
        heading: 'Step 4: Refreshing Exterior Protection',
        paragraphs: [
          'After decontamination, your paint is clean and ready for fresh protection. If your car has a ceramic coating, now is the time for a maintenance spray or annual inspection by your installer. If your car uses wax or sealant, a fresh application after the thorough spring decontamination will last much better than one applied without proper prep.',
          'Don\'t skip the wheels and wheel wells. Brake dust and road grime embed heavily in wheels through the winter. A proper wheel decontamination (iron remover, wheel cleaner, brush cleaning of the barrels) and a wheel sealant protects against the summer buildup ahead.',
        ],
      },
      {
        heading: 'Step 5: Interior Winter Recovery',
        paragraphs: [
          'If you\'ve been running rubber mats all winter, the carpets underneath may still have tracked-in salt and moisture. Lift the mats and inspect — salt crystals on carpet should be vacuumed then treated with a fabric cleaner to prevent long-term staining.',
          'Leather seats that survived winter without conditioning are likely to be drier than ideal. Spring conditioning after a winter with dry, heated interior air and cold exterior temperatures restores flexibility and prevents cracking. A UV protectant on the dashboard, door panels, and any plastic trim prepares the interior for the sun exposure of the warmer months ahead.',
        ],
      },
    ],
    keyTakeaways: [
      'Undercarriage salt removal is the most urgent post-winter priority',
      'Iron decontamination removes five months of embedded brake dust and road fallout',
      'Touch up rock chips immediately to prevent them from rusting through spring',
      'A fresh layer of protection applied after decontamination lasts dramatically longer',
      'Lift rubber mats and clean the carpet underneath — salt hides under them all winter',
    ],
  },
  {
    slug: 'protect-car-paint-from-canadian-winter',
    title: 'How to Protect Your Car\'s Paint from Canadian Winter Damage',
    description: 'Road salt, sand, stone chips, UV, and freeze-thaw cycles: here\'s a practical guide to protecting your car\'s paint through the Canadian winter season.',
    category: 'canada',
    readTime: 6,
    intro: 'The Canadian winter is one of the most paint-hostile environments on the planet for daily drivers. Road salt alone causes billions in vehicle damage annually across the country. But with the right preparation, the damage is largely preventable — here\'s how.',
    sections: [
      {
        heading: 'Understanding What Actually Damages Paint in Winter',
        paragraphs: [
          'Road salt (sodium chloride and calcium chloride) doesn\'t just make surfaces slippery to clean. It\'s hygroscopic — it attracts and holds moisture — and when dissolved in water it forms an electrolyte solution that accelerates electrochemical corrosion on metal surfaces and breaks down clear coat over time.',
          'Sand and grit thrown up by other vehicles at highway speed acts like sandpaper on your paint, creating micro-scratches that accumulate across a winter season into the dulling and haze visible on unprotected vehicles by April.',
          'Freeze-thaw cycling stresses clear coat mechanically. Paint expands and contracts with temperature — minor swings of 40–50°C in a single day during shoulder-season thaws put stress on both the paint and any chips that expose bare metal.',
        ],
      },
      {
        heading: 'Pre-Season Prep: The Most Important Step',
        paragraphs: [
          'Before the first snowfall, address any existing rock chips in the paint. These are the most vulnerable points during winter — exposed metal rusts quickly under salt exposure, and what starts as a pinhead-sized chip can become a rusted bubble within a single winter season.',
          'Apply a quality paint protection product in October before salt appears on roads. Ceramic coating provides the best protection, but a high-quality synthetic paint sealant is significantly better than nothing and costs a fraction of the price. Apply to clean, decontaminated paint for maximum bonding.',
          'Consider parking indoors when possible. A garage doesn\'t eliminate salt exposure (you bring it in on the vehicle) but dramatically reduces the duration of salt contact and eliminates overnight freeze-thaw cycling on the paint surface.',
        ],
      },
      {
        heading: 'Through-Season Maintenance',
        paragraphs: [
          'Wash regularly — every 1–2 weeks during heavy salt periods, or within 48 hours of a significant salt event. The goal is to interrupt the contact time salt has with your paint and undercarriage. A quick touchless wash in this context is vastly better than nothing.',
          'Keep a detail spray and clean microfibre cloths in your car for bird droppings and tree sap. These are chemically aggressive and etch faster on paint that\'s already stressed by cold. Remove them as soon as practical rather than waiting for the next wash.',
        ],
      },
    ],
    keyTakeaways: [
      'Address all rock chips before salt season — bare metal corrodes rapidly in salt conditions',
      'Apply paint protection in October, before the first salt application',
      'Wash every 1–2 weeks during salt season to minimize contact time with the paint',
      'Indoor parking reduces salt exposure duration and freeze-thaw stress on the finish',
      'A ceramic coating or quality sealant is the most effective single investment for winter paint protection',
    ],
  },

  // ── GENERAL DETAILING ──────────────────────────────────────────────────────
  {
    slug: 'what-is-paint-correction',
    title: 'What Is Paint Correction — and Does Your Car Need It?',
    description: 'Paint correction removes swirl marks, light scratches, oxidation, and water spots from your clear coat. Here\'s what the process involves, what it fixes, and when it\'s worth it.',
    category: 'general',
    readTime: 6,
    intro: 'If you\'ve ever stood in front of your car in sunlight and seen a web of fine circular scratches across the paint, you\'ve seen paint defects that require correction. Paint correction is the process of removing these defects from the clear coat using abrasive compounds and a machine polisher — not covering them up, but actually removing them.',
    sections: [
      {
        heading: 'What Paint Correction Fixes',
        paragraphs: [
          'Swirl marks are the most common defect — fine circular scratches from improper washing (automatic car washes, wrong wash mitts, circular wiping motions). In direct sunlight or under a light source, they create a spider web pattern that makes dark cars look grey and dull.',
          'Light scratches — from branches, parking lot brushes, or fingernails — can often be fully removed if they haven\'t penetrated through the clear coat into the base coat. A simple test: run a fingernail over the scratch. If your nail catches in it, the scratch may be too deep. If it glides over, it\'s likely surface-level and correctable.',
          'Oxidation (chalky, hazy paint) on older or unprotected vehicles, water spot etching, bird dropping etching, and hologram marks from previous incorrect polishing can all be addressed through paint correction.',
        ],
      },
      {
        heading: 'What Paint Correction Cannot Fix',
        paragraphs: [
          'Deep scratches that penetrate through the clear coat and base coat to the primer or bare metal cannot be corrected through polishing. These require touch-up paint, respraying, or paintless dent repair (for dents). A detailer can tell you on inspection whether your scratches fall in the correctable category.',
          'Rust is also beyond correction — rust indicates metal failure beneath the paint and requires bodywork repair before any paint treatment. Attempting to polish over rust accomplishes nothing except removing clear coat in that area.',
        ],
      },
      {
        heading: 'The Process: What Actually Happens',
        paragraphs: [
          'Paint correction uses a machine polisher (dual action or rotary) with abrasive compounds to very slightly level the clear coat surface. Clear coat is typically 50–100 microns thick. A single-stage correction removes about 1–3 microns. A heavy correction might remove 5 microns. Each correction session is a controlled removal of a tiny amount of material to expose a smoother, defect-free layer below.',
          'The process starts with the least aggressive approach and escalates only as needed. A test spot on a hidden panel confirms which compound/pad combination achieves the desired result before the entire vehicle is processed. After compounding, a finishing polish refines the surface to maximum gloss.',
          'Paint thickness gauges are used by professional detailers to measure how much clear coat remains before and after. This ensures the vehicle isn\'t over-polished — you only have so many corrections before the clear coat is too thin to safely correct again.',
        ],
      },
      {
        heading: 'One-Stage vs Two-Stage Paint Correction',
        paragraphs: [
          'A one-stage correction uses a single compound that cuts and finishes in one step. It\'s faster and less expensive, removes moderate defects, and is appropriate for vehicles in decent condition that just need refreshing. A two-stage correction uses a heavier cutting compound followed by a finishing polish — significantly more effective on heavily swirled or oxidized paint, but more labour-intensive.',
          'After any paint correction, the paint is in perfect condition to receive a ceramic coating or paint protection film. In fact, correction before coating is mandatory — you don\'t want to permanently seal in defects under a coating that\'ll last 5 years.',
        ],
      },
    ],
    keyTakeaways: [
      'Paint correction removes swirl marks, light scratches, water spots, and oxidation from the clear coat',
      'Deep scratches into the base coat or primer cannot be corrected through polishing',
      'The process uses abrasive compounds to micro-level the clear coat surface',
      'Always do paint correction before applying ceramic coating',
      'A two-stage correction is more effective for heavily defected paint than a single-stage',
    ],
  },
  {
    slug: 'mobile-detailing-vs-car-wash',
    title: 'Mobile Detailing vs Car Wash: What\'s the Difference?',
    description: 'An automatic car wash and a professional mobile detail are not the same thing. Here\'s a clear breakdown of what each actually does — and when you need which.',
    category: 'general',
    readTime: 5,
    intro: 'Both a car wash and a mobile detail involve cleaning your vehicle — but beyond that, they have almost nothing in common. Understanding the difference helps you choose the right service for your needs and avoid paying detail prices for car-wash quality results (or vice versa).',
    sections: [
      {
        heading: 'What an Automatic Car Wash Does',
        paragraphs: [
          'An automatic car wash removes surface dirt with high-pressure water, cleaning solutions, and (in brush-based washes) mechanical scrubbing. The whole process takes 3–5 minutes. It\'s designed for speed and volume — the same equipment processes 100+ cars per day.',
          'The result: a car that\'s visibly cleaner than it was. The limitation: brush-type automatic washes introduce swirl marks and light scratches into your paint. Touchless automatic washes avoid this but may not remove all bonded contamination. Neither type does anything for the interior, undercarriage (beyond a basic rinse), paint protection, or surface decontamination.',
        ],
      },
      {
        heading: 'What a Professional Mobile Detail Does',
        paragraphs: [
          'A professional detail is a comprehensive cleaning, correction, and protection service performed by hand. Depending on the package, it can include: exterior hand wash and dry, clay bar decontamination, machine polish to remove swirl marks, paint protection application, interior full vacuum and shampoo, leather cleaning and conditioning, glass cleaning inside and out, and wheel and tire detailing.',
          'A full detail on a mid-size vehicle takes 4–8 hours. A detailer might spend 30 minutes on the wheels alone. This level of attention is what separates a detail from a wash — it\'s not just clean, the vehicle looks significantly better and is protected.',
          'Mobile detailing brings this to your home, office, or wherever your car is parked — eliminating the need to drop off and pick up the vehicle.',
        ],
      },
      {
        heading: 'When to Use Each',
        paragraphs: [
          'Use a car wash for routine maintenance cleaning between details. A weekly or bi-weekly wash keeps contamination from building up and maintains the appearance of your vehicle. In winter, regular washes are important for removing road salt.',
          'Book a professional detail 2–4 times per year for deep cleaning, paint correction, and protection. Before and after winter are the most impactful times for Canadian vehicles. When buying or selling a vehicle, when returning a lease, or before any major event (road trip, wedding, special occasion), a professional detail delivers results a car wash simply cannot.',
        ],
      },
    ],
    keyTakeaways: [
      'Car washes clean surface dirt quickly; professional details clean, correct, and protect comprehensively',
      'Brush automatic car washes introduce swirl marks that a detail can correct',
      'Mobile detailing comes to your location — no drop-off or pickup required',
      'Use car washes for routine maintenance between 2–4 annual professional detail appointments',
      'The results of a professional detail are visible immediately — gloss, correction, and protection that a wash cannot replicate',
    ],
  },
  {
    slug: 'what-is-clay-bar-treatment',
    title: 'What Is a Clay Bar Treatment and Does Your Car Need One?',
    description: 'Clay bar treatment removes bonded contamination that washing alone can\'t touch. Here\'s what it is, how it works, and how to know if your car needs one.',
    category: 'general',
    readTime: 5,
    intro: 'Run a clean hand over your car\'s paint after washing it. If it feels rough or gritty — like slightly textured plastic rather than smooth glass — you have bonded surface contamination that requires a clay bar treatment to remove. Here\'s what that means and how the process works.',
    sections: [
      {
        heading: 'What Is Surface Contamination?',
        paragraphs: [
          'Your paint collects contamination that physically embeds into or bonds to the clear coat over time. The main types are: iron particles (brake dust and industrial fallout — tiny metallic fragments that oxidize orange and bond to the paint surface), tar spots (from road asphalt, especially common in summer), tree sap, industrial fallout (pollution, manufacturing emissions), and mineral deposits.',
          'None of these can be removed by regular washing, no matter how thorough or frequent. A clay bar physically shears these particles off the surface without damaging the clear coat — if used correctly with a proper lubricant.',
        ],
      },
      {
        heading: 'How Clay Bar Treatment Works',
        paragraphs: [
          'Detailing clay is a synthetic bar of resin material that, when glided over a lubricated paint surface with gentle pressure, catches and shears off surface contamination. The clay picks up the particle and the particle stays in the clay rather than scratching the paint.',
          'Lubrication is critical — the clay must glide freely. Detailers use either a dedicated clay lubricant or a diluted quick detailer spray. If clay is used without sufficient lubrication or dropped on the ground (contaminating the clay itself with grit), it will scratch the paint. A clean, lubricated clay pass should feel like it\'s gliding over glass.',
          'The before/after difference is tactile and immediate. Run your bare hand over the paint before clay and after — the "after" surface should feel noticeably smoother, like dragging your hand across cold glass rather than lightly textured plastic.',
        ],
      },
      {
        heading: 'When Does Your Car Need a Clay Bar?',
        paragraphs: [
          'At minimum, once per year — most commonly as part of a spring decontamination after winter. A car that drives primarily in urban or industrial areas, near construction, or in heavy traffic will benefit from clay bar treatment twice a year.',
          'Always clay before applying any protection (wax, sealant, ceramic coating). Applying protection over contaminated paint encapsulates the contamination rather than removing it. Clay treatment creates the clean surface necessary for any protective product to bond correctly.',
          'The iron decontamination step (using a chemical iron remover spray) is often done before clay — the chemical dissolves iron oxide particles, and the clay then removes any remaining physical contamination. Together they thoroughly prepare the surface.',
        ],
      },
    ],
    keyTakeaways: [
      'Clay bar removes bonded contamination (iron, tar, industrial fallout) that washing cannot remove',
      'If your paint feels rough or gritty after washing, it needs clay bar treatment',
      'Always clay before applying any paint protection product',
      'Lubrication is essential — dry claying will scratch the paint',
      'Annual clay treatment (or twice yearly in heavy contamination environments) is recommended',
    ],
  },
  {
    slug: 'car-detailing-before-selling',
    title: 'Should You Detail Your Car Before Selling It? (The Numbers)',
    description: 'A professional detail before selling can add hundreds to thousands to your asking price. Here\'s an honest breakdown of what detailing does for resale value — and what it doesn\'t.',
    category: 'general',
    readTime: 5,
    intro: 'You\'re selling your car. Should you spend $200–$500 on a professional detail first? In most cases, yes — and the return is almost always more than the cost. But the specifics matter. Here\'s what actually happens to resale value when you detail before selling.',
    sections: [
      {
        heading: 'First Impressions Drive Used Car Buying Decisions',
        paragraphs: [
          'Research in the automotive resale market consistently shows that a buyer\'s first 30 seconds with a vehicle heavily influence whether they make an offer — and at what price. A clean, fresh-smelling, visually appealing vehicle creates confidence. A dirty, smelly, or obviously neglected one creates doubt that extends to mechanical concerns, even if the car is mechanically perfect.',
          'Buyers who hesitate over appearance will negotiate more aggressively, use appearance defects as leverage for price reduction, or simply walk away. A $300 detail that eliminates that hesitation can easily preserve $1,000+ in your asking price.',
        ],
      },
      {
        heading: 'What Detailing Does for Photos (and Online Listings)',
        paragraphs: [
          'Most used car purchases now begin online — Autotrader, Kijiji Autos, Facebook Marketplace, dealer listings. The photos are your first impression, often before the buyer reads a single word of the description.',
          'A detailed car photographs dramatically better than an undetailed one. Clean paint reflects light cleanly and shows the true colour and depth. Dirty paint diffuses light and makes the car look older and more worn in photos. Clean wheels and tires make the car look maintained. A vacuumed, clean interior in photos vs a cluttered, dirty one can be the difference between a click and a scroll-past.',
          'Detail before the photos, not after the listing is already up. The photos are your primary marketing material.',
        ],
      },
      {
        heading: 'What to Prioritize: Interior vs Exterior',
        paragraphs: [
          'If budget is limited, prioritize interior cleaning over exterior for most buyers. Studies of car purchase psychology consistently show that interior cleanliness and smell affect buyers more strongly than exterior paint condition. A car that smells clean and fresh with clean upholstery and no visible stains creates immediate positive feeling that\'s hard to overcome with logic.',
          'Odour is particularly important. Pet smell, smoke smell, or persistent food odour are deal-killers for a significant percentage of buyers — and these are fixable with professional interior detailing that includes an ozone treatment or thorough fabric cleaning. A car that smells bad will either not sell or sell at a significant discount.',
          'Exterior paint correction makes sense if the paint is heavily swirled or oxidized — the improvement is dramatic and visible. But a light machine polish and paint sealant on paint that\'s already in decent condition is sufficient for a sale prep detail.',
        ],
      },
    ],
    keyTakeaways: [
      'A $200–$500 detail typically returns $500–$2,000+ in preserved asking price',
      'Buyers make emotional decisions based on first impressions — clean cars sell faster and for more',
      'Detail before taking listing photos — photos are your primary marketing material',
      'Interior cleanliness and odour affect buyers more than exterior paint in most market segments',
      'Cigarette smoke and pet odour are deal-killers — professional odour treatment is worth the cost',
    ],
  },
  {
    slug: 'how-to-remove-water-spots-from-car',
    title: 'How to Remove Water Spots from Your Car\'s Paint',
    description: 'Water spots are one of the most common and frustrating paint problems. Here\'s what causes them, how to remove them correctly, and how to prevent them on a ceramic coated car.',
    category: 'general',
    readTime: 5,
    intro: 'Water spots look simple — just a bit of water that dried on the paint. But they\'re actually mineral deposits left behind when water evaporates, and depending on how long they\'ve been there, removing them ranges from easy to requiring professional attention.',
    sections: [
      {
        heading: 'Why Water Spots Form and Why They\'re Damaging',
        paragraphs: [
          'Tap water, rain water, and sprinkler water all contain dissolved minerals — primarily calcium and magnesium carbonates. When water evaporates from a hot paint surface, it leaves these minerals behind as solid deposits. In the sun, the water acts as a lens that concentrates heat, and the minerals etch into the clear coat surface as they dry and bond.',
          'Light water spots (just mineral deposits sitting on the surface) can be removed relatively easily. Etched water spots (where the minerals have chemically bonded to or slightly etched the clear coat) require more aggressive treatment. Severe etching that has physically removed clear coat may require professional compound and polish to level the surface.',
        ],
      },
      {
        heading: 'Removing Light to Moderate Water Spots',
        paragraphs: [
          'For fresh or light water spots, a dedicated water spot remover (a mildly acidic solution that dissolves mineral deposits) is the first approach. Apply to a clean panel, allow it to dwell for the directed time, wipe with a clean microfibre, and rinse. This works well on recent spots or those on protected paint.',
          'White vinegar diluted 1:1 with distilled water is an accessible home remedy for mild spots — it\'s mildly acidic and dissolves calcium deposits. Apply, dwell 2–3 minutes, wipe, and rinse. Never use undiluted vinegar or allow it to sit long on bare paint or coating.',
          'If chemical treatment doesn\'t fully resolve the spots, a light machine polish with a finishing compound will physically level the clear coat surface around the deposits, removing them. This is the same principle as paint correction and effectively removes moderate etching.',
        ],
      },
      {
        heading: 'Preventing Water Spots on a Ceramic Coated Car',
        paragraphs: [
          'A ceramic coating dramatically reduces water spot formation because the hydrophobic surface causes water to bead and roll off rather than sitting and evaporating. Water spots can still occur on ceramic-coated cars — but they\'re much easier to remove because the minerals haven\'t bonded to the coating the way they would to bare clear coat.',
          'The practical prevention: dry your car after every wash, don\'t wash in direct sunlight or on a hot surface, and avoid parking under sprinklers. If you notice water spots on your coating, a quick application of a ceramic maintenance spray after removal will restore the hydrophobic properties in that area.',
        ],
      },
    ],
    keyTakeaways: [
      'Water spots are mineral deposits left when water evaporates — they can etch clear coat if left long enough',
      'Dedicated water spot remover or diluted white vinegar resolves fresh, light spots',
      'Moderate etching requires machine polishing to level the clear coat surface',
      'Ceramic coating significantly reduces water spot formation and makes removal easier',
      'Dry your car after washing and avoid parking under sprinklers to prevent spots',
    ],
  },
  {
    slug: 'leather-seat-cleaning-and-care',
    title: 'Leather Seat Cleaning and Care: The Complete Guide',
    description: 'Leather is one of the most rewarding — and punishing — interior surfaces to maintain. Here\'s how to clean, condition, and protect leather seats so they last the life of the vehicle.',
    category: 'general',
    readTime: 6,
    intro: 'Leather seats look incredible when maintained and terrible when neglected. The good news is that leather is highly durable when properly cared for — a set of leather seats maintained from new can last 20+ years without cracking. The bad news: neglected leather deteriorates rapidly, especially in Canada\'s climate extremes.',
    sections: [
      {
        heading: 'Understanding Automotive Leather',
        paragraphs: [
          'Most modern automotive "leather" is actually a combination of genuine leather on the seating surfaces and vinyl or leatherette on the sides, backs, and bolsters. Full-grain genuine leather is the most premium and most sensitive to improper care. Corrected grain leather (the most common type) has a uniform surface coating that\'s more forgiving. Perforated leather (common in performance vehicles) is beautiful but challenging to clean because liquids can enter the perforations and cause mould under the surface.',
          'The finish on automotive leather is almost always a clear coat of polyurethane over the leather substrate. When you condition leather, you\'re primarily nourishing this coating and the leather fibers beneath it — keeping the coating supple so it doesn\'t crack.',
        ],
      },
      {
        heading: 'Cleaning Leather Correctly',
        paragraphs: [
          'Use a pH-neutral leather cleaner — not household cleaners, baby wipes (which contain alcohol), or saddle soap (which is too alkaline for automotive leather finishes). Apply cleaner to a microfibre applicator or soft brush, not directly to the leather. Work in small sections with gentle circular motions, then wipe clean.',
          'For deeper cleaning of stained or heavily soiled leather, a soft-bristled brush (an old soft toothbrush works) helps work the cleaner into the grain and perforations without damaging the surface. Rinse with a damp (not wet) microfibre and allow to dry fully before conditioning.',
          'Never use steam cleaners directly on leather at high pressure — the heat can shrink leather and damage the coating. Professional detailers may use steam at controlled temperature and distance, but this requires experience.',
        ],
      },
      {
        heading: 'Conditioning: The Most Important Step',
        paragraphs: [
          'Conditioning replaces the oils in leather that dry out over time from UV exposure, body heat, and climate. Without conditioning, leather becomes stiff, develops fine surface cracks (which worsen into large cracks), and loses its suppleness.',
          'Apply a quality leather conditioner every 3–4 months minimum — more frequently in Canadian winters when dry, heated interior air is particularly drying. Apply sparingly with a microfibre applicator, work into the grain, allow to absorb for a few minutes, and buff off any excess. Good leather conditioners (Leather Honey, Chemical Guys Leather Conditioner, Gtechniq L1) should not leave the surface greasy or slippery.',
          'The result of proper conditioning is visible and tactile — the leather looks richer, feels supple, and the surface colour deepens slightly as dry, dull leather is nourished.',
        ],
      },
      {
        heading: 'Canadian Climate Considerations',
        paragraphs: [
          'Canada\'s climate is particularly hard on leather. In winter, heated interiors drop to very low relative humidity — similar to a desert in terms of moisture content. This accelerates the drying that leads to cracking. Condition in the fall before winter and again in spring.',
          'UV in Canadian summers (especially through glass, which blocks UVB but transmits UVA) fades and dries leather faster than most owners expect. A leather conditioner with UV protection, or a separate UV protectant applied after conditioning, is highly recommended for vehicles that sit in sun during the day.',
        ],
      },
    ],
    keyTakeaways: [
      'Use pH-neutral leather cleaner — not household cleaners, baby wipes, or saddle soap',
      'Condition every 3–4 months minimum; more frequently in Canadian winters',
      'Never let leather go dry — cracking is progressive and largely irreversible',
      'UV protection on leather is important for vehicles that see significant sun exposure',
      'Most automotive leather is corrected grain with a polyurethane coating — very durable if maintained',
    ],
  },
  {
    slug: 'headlight-restoration-guide',
    title: 'Headlight Restoration: When You Need It and What It Does',
    description: 'Yellowed, foggy headlights reduce your visibility by up to 80% — and cost a fraction of replacement to restore. Here\'s what causes headlight oxidation and how restoration works.',
    category: 'general',
    readTime: 5,
    intro: 'Most modern headlights are polycarbonate plastic covered in a UV-protective clear coat. When that coating degrades — usually after 5–10 years of UV exposure — the underlying plastic yellows and becomes hazy. The result is reduced visibility and an older-looking car. Restoration reverses this damage quickly and affordably.',
    sections: [
      {
        heading: 'Why Headlights Yellow and Fog',
        paragraphs: [
          'The polycarbonate plastic in modern headlight lenses is transparent initially because the UV-protective coating keeps the plastic from oxidizing. As the coating degrades from UV exposure, the bare polycarbonate begins to absorb UV radiation, which chemically changes the plastic — causing the familiar yellow, opaque appearance.',
          'The practical impact is significant: a Transport Canada study found that severely oxidized headlights can reduce the light output reaching the road by 80% or more. You\'re effectively driving at night with 20% of your intended headlight brightness — a serious safety issue, not just an aesthetic one.',
          'In Canada, the intense UV of summer combined with harsh winters that crack and stress the remaining protective layer accelerate headlight degradation. Headlights typically need restoration between 5–8 years on most vehicles.',
        ],
      },
      {
        heading: 'What Restoration Involves',
        paragraphs: [
          'Professional headlight restoration uses wet sanding followed by machine polishing to remove the degraded clear coat and oxidized plastic layer, exposing the clear plastic beneath. The headlight is then sealed with a fresh UV-protective coating to prevent immediate re-oxidation.',
          'The sanding starts with relatively coarse grit (800–1000 grit) and progressively refines to 1500, 2000, and 3000 grit before polishing. The result is a headlight that looks new — clear, bright, and glossy. The process takes 30–60 minutes per headlight in a professional shop.',
          'Without the sealant step at the end, the lens will re-yellow within months. This is the most common failure point in DIY kit applications — the sealant that comes with consumer kits is thin and short-lived. A professional application uses a quality UV-cured or two-component sealant that lasts 1–3 years.',
        ],
      },
      {
        heading: 'Restoration vs Replacement',
        paragraphs: [
          'Professional headlight restoration costs $80–$200 for both headlights, depending on severity and vehicle. Replacement headlight assemblies for most vehicles cost $300–$800 each (some luxury vehicles are significantly more), plus installation labour.',
          'Restoration makes sense when the damage is oxidation on the exterior of the lens. It does not address internal fogging, moisture inside the assembly, physical cracks, or damage to the internal optics or LED arrays. A detailer or shop can tell you on inspection whether your headlights are candidates for restoration or whether replacement is the better call.',
        ],
      },
    ],
    keyTakeaways: [
      'Yellowed headlights can reduce light output by up to 80% — a real safety issue, not just cosmetic',
      'Restoration uses wet sanding and polishing to remove oxidized plastic, plus a UV sealant to prevent re-yellowing',
      'Professional restoration costs $80–$200 vs $600–$1,600+ for replacement',
      'Without UV sealant after restoration, headlights will re-yellow within months',
      'Restoration works for exterior oxidation — not for internal moisture, cracks, or internal damage',
    ],
  },
  {
    slug: 'interior-vs-exterior-detailing',
    title: 'Interior vs Exterior Detailing: What\'s Included in Each?',
    description: 'Not sure what a "full detail" actually includes? Here\'s a clear breakdown of what interior and exterior detailing covers — so you know exactly what you\'re booking.',
    category: 'general',
    readTime: 5,
    intro: 'Detailing packages vary between shops, but there\'s a general standard for what interior and exterior detailing covers. Understanding what\'s included helps you communicate your needs, compare quotes accurately, and avoid surprises.',
    sections: [
      {
        heading: 'Exterior Detailing: What\'s Typically Included',
        paragraphs: [
          'A basic exterior detail includes: hand wash (two-bucket method or foam pre-soak), wheel and tire cleaning (wheels scrubbed with brushes and wheel cleaner, tire dressing applied), door jamb cleaning, exterior glass cleaning, and a paint protection application (wax, sealant, or spray coating).',
          'A full exterior detail adds: iron decontamination spray, clay bar treatment, machine polish (single or two-stage depending on paint condition), headlight restoration if needed, trim restoration, and exhaust tip polishing. This is the service you want before applying ceramic coating or when the paint has visible defects.',
        ],
      },
      {
        heading: 'Interior Detailing: What\'s Typically Included',
        paragraphs: [
          'A basic interior detail includes: thorough vacuum of all surfaces (seats, carpets, mats, trunk), dashboard and trim wipe-down, window cleaning inside, and door panel cleaning.',
          'A full interior detail adds: steam cleaning of hard-to-reach areas and vents, carpet and upholstery shampooing (extraction cleaning for embedded stains), leather cleaning and conditioning, odour treatment, fabric/leather protection spray application, and detailing of smaller areas (cup holders, centre console, seat rails). A full interior on a heavily soiled vehicle can take 4–6 hours alone.',
        ],
      },
      {
        heading: 'Full Detail: Both Together',
        paragraphs: [
          'A full detail combines comprehensive interior and exterior work into one appointment. On a mid-size vehicle in good condition, this typically takes 5–8 hours. On a heavily neglected vehicle requiring significant interior work and paint correction, a full day or even two days is not unusual for a premium detail.',
          'Ask your detailer specifically what\'s included in each package when getting quotes. Terms like "full detail" vary between shops — some include machine polish, some do not. Clarify whether machine polishing, clay bar, and steam cleaning are included or add-ons.',
        ],
      },
    ],
    keyTakeaways: [
      'Basic exterior: hand wash, wheels, glass, wax. Full exterior adds clay, machine polish, and correction',
      'Basic interior: vacuum, wipe-down, glass. Full interior adds shampoo, steam, leather conditioning, odour treatment',
      'Ask specifically what\'s included — "full detail" definitions vary between shops',
      'Paint correction (machine polish) is often an add-on, not standard in base packages',
      'A full detail on a larger vehicle or one with significant correction needs can take a full day',
    ],
  },
  {
    slug: 'engine-bay-detailing',
    title: 'Engine Bay Detailing: Is It Safe, and Is It Worth It?',
    description: 'Engine bay detailing is one of the most misunderstood services in auto care. Here\'s what it involves, whether it\'s safe for modern vehicles, and when it makes sense to do it.',
    category: 'general',
    readTime: 5,
    intro: 'Most car owners never look under the hood except when the warning light comes on. But a clean engine bay has real practical benefits — and modern professional engine bay detailing is far safer than the "take a hose to the whole engine" approach of the past.',
    sections: [
      {
        heading: 'Is Engine Bay Cleaning Safe?',
        paragraphs: [
          'For modern vehicles (roughly 2000 and newer), professional engine bay cleaning is safe when done correctly. Modern engines use sealed electrical connectors, waterproof fuse boxes, and protected wiring that can handle controlled moisture exposure.',
          'The key word is "controlled." A professional detailer does not blast the engine with a pressure washer. The approach is careful: cover or bag sensitive components (alternator, fuse box, air intake), use a purpose-made engine degreaser, agitate gently with brushes, and rinse with low-pressure water. The engine is then allowed to idle to dry out any residual moisture before the hood is closed.',
          'Older vehicles (pre-2000, or older carbureted engines) require more caution and may not be ideal candidates for wet cleaning. When in doubt, discuss your specific vehicle with the detailer beforehand.',
        ],
      },
      {
        heading: 'What Engine Detailing Actually Includes',
        paragraphs: [
          'A professional engine detail involves: rinsing loose dirt and debris, applying engine degreaser to dissolve oil, grease, and road grime accumulation, agitating with detailing brushes to reach all surfaces, rinsing carefully, and applying a dressing to rubber hoses and plastic components to restore their appearance and provide UV protection.',
          'The result is an engine compartment that looks significantly cleaner and newer. Rubber components that were dried and grey become supple and black again. Accumulated oil residue and road grime on the block and accessories are removed. The whole compartment looks maintained rather than neglected.',
        ],
      },
      {
        heading: 'The Practical Benefit Beyond Appearance',
        paragraphs: [
          'A clean engine bay makes it easier to spot actual problems: oil leaks show up immediately against clean surfaces where they\'d be hidden in a grimy engine, coolant leaks become visible, and loose components are easier to identify. Mechanics also appreciate a clean engine — labour time is often reduced when they\'re not working through 10 years of grime.',
          'When selling a vehicle, a detailed engine bay signals maintenance and care to buyers who open the hood. It\'s a relatively inexpensive addition to a pre-sale detail that can meaningfully impact buyer confidence.',
        ],
      },
    ],
    keyTakeaways: [
      'Modern engines (2000+) can be safely cleaned by a professional using the correct technique',
      'Professionals cover sensitive components — they do not pressure wash the engine directly',
      'Engine detail makes leaks and issues easier to spot, benefiting maintenance',
      'The engine bay is a strong signal of care when selling a vehicle',
      'Older or carbureted engines require more caution — discuss with your detailer first',
    ],
  },
]

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function getArticlesByCategory(category: Article['category']): Article[] {
  return articles.filter((a) => a.category === category)
}

export const categoryLabels: Record<Article['category'], string> = {
  ceramic: 'Ceramic Coating',
  canada: 'Canadian Climate',
  general: 'Detailing Guides',
}
