/*
 * CS Media & Production — canonical client-facing service and package catalog.
 * Pages render from this file so ownership, scope and prices have one source.
 */
(function (root) {
  'use strict';

  root.CSServiceCatalog = {
    version: 1,
    lastVerified: '2026-08-21',
    currency: 'INR',
    contactEmail: 'info@csmediaandproduction.in',
    worlds: [
      {
        id: 'ai-presenter',
        name: 'AI Presenter',
        route: '/ai-presenter',
        short: 'Avatar and presenter-led content',
        promise: 'Show up consistently with a presenter trained around your message.',
        description: 'Presenter-led video, voice, localisation and interactive avatar experiences for businesses that need a clear, repeatable on-camera presence without filming every delivery.',
        bestFit: ['Founders and consultants', 'Education and finance', 'FAQ and sales content', 'Multi-language communication'],
        services: [
          { name: 'Presenter Content Strategy', summary: 'Positioning, repeatable formats and scripts built specifically for presenter-led delivery.', deliverables: ['Message pillars', 'Hook and topic bank', 'Presenter scripts'] },
          { name: 'AI Presenter Video Production', summary: 'Short-form and campaign-ready presenter videos delivered for the channels you use.', deliverables: ['Presenter video production', 'Social formatting', 'Captions and thumbnails'] },
          { name: 'Voice and Localisation', summary: 'Approved messages adapted into additional voices or languages while protecting meaning and tone.', deliverables: ['Voice direction', 'Language adaptation', 'Localised presenter outputs'] },
          { name: 'Interactive Presenter Experience', summary: 'A scoped presenter that can explain an offer, answer from approved knowledge and guide the next step.', deliverables: ['Knowledge preparation', 'Presenter experience', 'Custom deployment plan'] }
        ],
        boundaries: [
          'CRM implementation, websites and funnels belong to Professional.',
          'Real-person shoots and location production belong to Cinematic.',
          'Custom UI/UX art direction and prototypes belong to Casual.'
        ],
        pairedWorlds: ['professional', 'casual'],
        packages: [
          {
            id: 'maya-starter', version: 1, name: 'Maya Starter Presenter', bestFor: 'Starting a professional presenter-led content stream.',
            price: { kind: 'quote-baseline', currency: 'INR', amount: 49000, display: '₹49,000 listed baseline', cadence: null },
            includes: ['Positioning and script direction', 'Brand voice setup', '12 short-form presenter scripts', '12 AI presenter videos', 'Thumbnails and captions', 'WhatsApp lead-flow CTA suggestion'],
            excludes: ['Custom avatar build', 'CRM or website implementation', 'Real-person filming', 'Paid-media spend'],
            evidence: { file: 'professional.html', lines: '434-438', label: 'current displayed AI Presenter package price' }
          },
          {
            id: 'maya-growth', version: 1, name: 'Maya Growth Presenter', bestFor: 'A higher-volume, consistent presenter presence.', featured: true,
            price: { kind: 'quote-baseline', currency: 'INR', amount: 89000, display: '₹89,000 listed baseline', cadence: null },
            includes: ['Everything in Starter', '30 AI presenter videos', 'Monthly content calendar', 'Hook bank and offer messaging', 'Reels and Shorts formatting', 'Basic CRM handoff and review'],
            excludes: ['CRM or funnel implementation', 'Real-person filming', 'Media buying and ad spend', 'Custom software integrations'],
            evidence: { file: 'professional.html', lines: '434-438', label: 'current displayed AI Presenter package price' }
          },
          {
            id: 'maya-authority', version: 1, name: 'Maya Authority System', bestFor: 'An authority-building presenter content engine.',
            price: { kind: 'quote-baseline', currency: 'INR', amount: 149000, display: '₹1,49,000 listed baseline', cadence: null },
            includes: ['45–60 AI presenter videos', 'Campaign concept and strategy', 'Full presenter script suite', 'Paid-promotion creatives', 'Landing and lead-funnel content support', 'CRM automation planning and analytics recommendations'],
            excludes: ['CRM, funnel or website build', 'Real-person production', 'Ad spend and platform fees', 'Enterprise integrations'],
            evidence: { file: 'professional.html', lines: '434-438', label: 'current displayed AI Presenter package price' }
          }
        ]
      },
      {
        id: 'professional',
        name: 'Professional',
        route: '/professional.html',
        short: 'Systems, automation and growth execution',
        promise: 'Turn attention into an organised system that captures, follows up and improves.',
        description: 'Websites, funnels, CRM, automation, marketing operations and reporting joined into one working growth system.',
        bestFit: ['High-inquiry businesses', 'Teams losing leads', 'New website or funnel launches', 'Brands ready to systemise growth'],
        services: [
          { name: 'Websites and Lead Funnels', summary: 'Conversion-focused websites and landing flows connected to a clear customer action.', deliverables: ['Website or landing flow', 'Lead capture', 'Analytics-ready structure'] },
          { name: 'CRM and Follow-Up Automation', summary: 'A visible pipeline with practical response and follow-up flows for every enquiry.', deliverables: ['CRM pipeline', 'Segmentation', 'Automated follow-up'] },
          { name: 'Growth Campaign Execution', summary: 'Offer, channel and campaign operations designed around measurable demand.', deliverables: ['Campaign plan', 'SEO or paid direction', 'Publishing operations'] },
          { name: 'Reporting and Optimisation', summary: 'A review loop that shows what is happening and what the team should improve next.', deliverables: ['Lead-tracking view', 'Performance review', 'Growth recommendations'] }
        ],
        boundaries: [
          'Presenter-led production belongs to AI Presenter.',
          'Photography, videography and shoot production belong to Cinematic.',
          'UI/UX concepting and unconventional presentation design belong to Casual.'
        ],
        pairedWorlds: ['ai-presenter', 'cinematic', 'casual'],
        packages: [
          {
            id: 'crm-launch', version: 1, name: 'CRM Launch System', bestFor: 'Organising enquiry capture and follow-up quickly.',
            price: { kind: 'quote-baseline', currency: 'INR', amount: 49000, display: '₹49,000 listed baseline', cadence: null },
            includes: ['Lead-capture form or funnel content', 'Customer inquiry flow', 'WhatsApp or call CTA structure', 'Basic CRM pipeline setup', 'Auto-response and follow-up templates', 'Admin handoff and usage guide'],
            excludes: ['Full website build', 'Ongoing CRM administration', 'Presenter or shoot production', 'Third-party platform fees'],
            evidence: { file: 'professional.html', lines: '441-445', label: 'current displayed Professional package price' }
          },
          {
            id: 'growth-automation', version: 1, name: 'Business Growth Automation', bestFor: 'High-traffic brands that need segmented, trackable follow-up.', featured: true,
            price: { kind: 'quote-baseline', currency: 'INR', amount: 99000, display: '₹99,000 listed baseline', cadence: null },
            includes: ['Everything in CRM Launch', 'Customer segmentation', 'Follow-up automation flows', 'Campaign landing content', 'Offer and promotion messaging', 'Lead-tracking dashboard and review'],
            excludes: ['Presenter videos or filmed content', 'Full custom website', 'Media spend', 'Custom enterprise software'],
            evidence: { file: 'professional.html', lines: '441-445', label: 'current displayed Professional package price' }
          },
          {
            id: 'connected-growth', version: 1, name: 'Connected Growth System', bestFor: 'A joined website, funnel, CRM and growth operating layer.',
            price: { kind: 'quote-baseline', currency: 'INR', amount: 150000, display: '₹1,50,000 listed baseline', cadence: null },
            includes: ['Website or lead-funnel build', 'CRM pipeline and automation flow', 'Campaign and offer structure', 'Social and growth operating plan', 'Lead reporting structure', 'Monthly review framework'],
            excludes: ['Presenter production', 'Photography or videography', 'Custom brand identity', 'Ad spend, subscriptions and usage fees'],
            evidence: { file: 'professional.html', lines: '441-445', label: 're-scoped from current ₹1,50,000 mixed package baseline' }
          }
        ]
      },
      {
        id: 'cinematic',
        name: 'Cinematic',
        route: '/cinematic.html',
        short: 'Custom shoots and bespoke campaigns',
        promise: 'Create real, ownable visual proof around the people, places and moments that matter.',
        description: 'Photography, film, short-form production, events and bespoke campaign assets built through real capture and custom post-production.',
        bestFit: ['Launches and campaigns', 'Hospitality and retail', 'Founders and products', 'Sports and live events'],
        services: [
          { name: 'Photography and Visual Storytelling', summary: 'Purpose-built image libraries for brands, products, venues and campaigns.', deliverables: ['Shoot planning', 'Photography', 'Edited image library'] },
          { name: 'Film and Video Production', summary: 'Story-led production for launches, explainers, testimonials and brand films.', deliverables: ['Production plan', 'Video capture', 'Edited master and cut-downs'] },
          { name: 'Real-World Reels and Short Form', summary: 'Platform-ready short-form built from real people, products and locations.', deliverables: ['Hooks and shot list', 'On-location capture', 'Vertical edits and captions'] },
          { name: 'Event and Sports Media', summary: 'Fast-moving coverage packaged for sponsors, fans, communities and sales.', deliverables: ['Coverage plan', 'Live capture', 'Highlights and sponsor assets'] }
        ],
        boundaries: [
          'Paid distribution, CRM and campaign reporting belong to Professional.',
          'Avatar-led output belongs to AI Presenter.',
          'UI/UX prototypes and interactive service design belong to Casual.'
        ],
        pairedWorlds: ['professional', 'casual'],
        packages: [
          {
            id: 'shoot-foundation', version: 1, name: 'Shoot Foundation', bestFor: 'One focused visual production requirement.',
            price: { kind: 'quote', currency: 'INR', amount: null, display: 'Custom quote', cadence: null },
            includes: ['Production brief', 'Shoot planning', 'One focused photo or video production', 'Curated edited asset set'],
            excludes: ['Location, talent or specialist-equipment costs unless quoted', 'Paid distribution', 'CRM or website work', 'Ongoing monthly production'],
            evidence: { file: 'professional.html', lines: '347-353', label: 'scope evidence; no current standalone price displayed' }
          },
          {
            id: 'campaign-production', version: 1, name: 'Campaign Production', bestFor: 'A coordinated launch or campaign asset system.', featured: true,
            price: { kind: 'quote', currency: 'INR', amount: null, display: 'Custom quote', cadence: null },
            includes: ['Campaign creative direction', 'Production plan', 'Hero film or photo library', 'Short-form cut-downs', 'Delivery-ready campaign assets'],
            excludes: ['Ad spend and media buying', 'CRM and funnel build', 'Unquoted travel, talent or locations', 'Long-term usage beyond agreed rights'],
            evidence: { file: 'professional.html', lines: '347-353', label: 'scope evidence; no current standalone price displayed' }
          },
          {
            id: 'production-partnership', version: 1, name: 'Signature Production Partnership', bestFor: 'Multiple shoots, events or an ongoing production calendar.',
            price: { kind: 'quote', currency: 'INR', amount: null, display: 'Custom quote', cadence: null },
            includes: ['Production roadmap', 'Multiple scoped production moments', 'Campaign asset system', 'Ongoing editing coordination', 'Continuity across deliverables'],
            excludes: ['Paid growth operations', 'Software systems', 'Presenter production', 'Costs outside the approved production scope'],
            evidence: { file: 'professional.html', lines: '347-353', label: 'scope evidence; no current standalone price displayed' }
          }
        ]
      },
      {
        id: 'casual',
        name: 'Casual',
        route: '/casual.html',
        short: 'UI/UX and unexpected service presentation',
        promise: 'Make a complex service feel obvious, memorable and enjoyable to explore.',
        description: 'UI/UX, visual systems, prototypes, decks and unconventional presentation concepts that help clients experience a service instead of reading another generic brochure.',
        bestFit: ['Complex or premium services', 'New digital experience concepts', 'Pitches and proposals', 'Brands that need a distinctive presentation layer'],
        services: [
          { name: 'Service Story and Information Design', summary: 'A clear hierarchy that turns a complicated offer into an understandable journey.', deliverables: ['Service architecture', 'Content hierarchy', 'Experience storyboard'] },
          { name: 'UI/UX and Interactive Prototypes', summary: 'Responsive interface concepts that demonstrate how the experience should work.', deliverables: ['User flow', 'Key-screen UI', 'Interactive prototype'] },
          { name: 'Visual Identity and Presentation Systems', summary: 'A flexible visual language for interfaces, decks, catalogues and service communication.', deliverables: ['Visual direction', 'Presentation components', 'Usage guidance'] },
          { name: 'Unconventional Digital Concepts', summary: 'Scroll stories, guided maps and experimental presentation formats shaped around the service.', deliverables: ['Creative concept', 'Interaction direction', 'Build-ready handoff'] }
        ],
        boundaries: [
          'Production website engineering, hosting and integrations belong to Professional.',
          'Real-world photo and video capture belongs to Cinematic.',
          'Avatar-led content belongs to AI Presenter.'
        ],
        pairedWorlds: ['professional', 'cinematic', 'ai-presenter'],
        packages: [
          {
            id: 'story-sprint', version: 1, name: 'Service Story Sprint', bestFor: 'Finding the clearest and most distinctive way to present one service.',
            price: { kind: 'quote', currency: 'INR', amount: null, display: 'Custom quote', cadence: null },
            includes: ['Service and audience audit', 'Information hierarchy', 'Experience direction', 'One key-screen or presentation concept'],
            excludes: ['Production website build', 'Full brand identity', 'Photo or video shoot', 'CRM and automation'],
            evidence: { file: 'index.html', lines: '1243-1257', label: 'scope evidence; no current standalone price displayed' }
          },
          {
            id: 'interactive-prototype', version: 1, name: 'Interactive Service Prototype', bestFor: 'Testing a complete service journey before production.', featured: true,
            price: { kind: 'quote', currency: 'INR', amount: null, display: 'Custom quote', cadence: null },
            includes: ['Experience flow', 'Visual direction', 'Responsive key screens', 'Interactive prototype', 'Build specification'],
            excludes: ['Production deployment', 'CRM and third-party integrations', 'Ongoing content production', 'Unquoted user research'],
            evidence: { file: 'index.html', lines: '1243-1257', label: 'scope evidence; no current standalone price displayed' }
          },
          {
            id: 'experience-system', version: 1, name: 'Signature Experience System', bestFor: 'A premium service that must stay consistent across multiple presentation formats.',
            price: { kind: 'quote', currency: 'INR', amount: null, display: 'Custom quote', cadence: null },
            includes: ['Service architecture', 'Design system', 'Full interactive prototype', 'Deck or catalogue presentation layer', 'Production handoff'],
            excludes: ['Website engineering and hosting', 'Real-world production', 'Presenter video production', 'Growth campaign operations'],
            evidence: { file: 'index.html', lines: '1243-1257', label: 'scope evidence; no current standalone price displayed' }
          }
        ]
      }
    ]
  };
}(window));
