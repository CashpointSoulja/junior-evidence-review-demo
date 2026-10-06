import type { Call, Claim, DiligenceQuestion } from "../engine/types";

// SYNTHETIC DATA. Every company, person, firm, email and figure below is fictional
// and written for this demo. Nothing comes from a real expert call or real company.

export const PROJECT = {
  code: "Project Kestrel",
  target: "Quillmoor Systems",
  competitor: "Tallyfern",
  sector: "Practice-management software for UK accounting firms",
  thesis: "Buy-side commercial diligence for a synthetic PE software deal",
  synthetic: true,
} as const;

export const COHORT_LABEL = {
  former_employee: "Former employee",
  customer: "Customer",
  competitor: "Competitor",
} as const;

export const SCOPE_LABEL = {
  all_customers: "All customers",
  mid_market: "Mid-market firms (20–100 seats)",
  small_firms: "Small firms (<20 seats)",
  single_firm: "One firm (40 seats)",
} as const;

export const METRIC_LABEL = {
  grr: "gross revenue retention",
  renewal_uplift: "renewal price increase",
  competitive_win_rate: "competitor win rate against Quillmoor",
  implementation_time: "implementation time",
  support_response: "support ticket response time",
} as const;

export const CALLS: Call[] = [
  {
    id: "CALL-A",
    expertName: "Helena Marsh",
    role: "Former VP Customer Success, Quillmoor Systems (left Mar 2026)",
    cohort: "former_employee",
    date: "2026-09-14",
    durationMin: 45,
    quotes: [
      { id: "QA-01", callId: "CALL-A", ts: "00:01:05", speaker: "Interviewer", scope: "all_customers", text: "Thanks for joining, Helena. You were at Quillmoor Systems until March 2026, is that right? You can reach me afterwards at analyst.kestrel@example.com." },
      { id: "QA-02", callId: "CALL-A", ts: "00:04:12", speaker: "Expert", scope: "all_customers", text: "Across the whole base, gross revenue retention was about 91% in FY2025. That's the full book, weighted by revenue.", metric: { key: "grr", value: 91, unit: "%", period: "FY2025", scope: "all_customers" } },
      { id: "QA-03", callId: "CALL-A", ts: "00:06:40", speaker: "Expert", scope: "mid_market", text: "Mid-market firms, so 20 to 100 seats, churned less. GRR there was closer to 95% in FY2025.", metric: { key: "grr", value: 95, unit: "%", period: "FY2025", scope: "mid_market" } },
      { id: "QA-04", callId: "CALL-A", ts: "00:09:05", speaker: "Expert", scope: "all_customers", text: "We put through a 7% list price increase at renewal in 2025, across the board, and most customers absorbed it.", metric: { key: "renewal_uplift", value: 7, unit: "%", period: "2025", scope: "all_customers" } },
      { id: "QA-05", callId: "CALL-A", ts: "00:12:30", speaker: "Expert", scope: "mid_market", text: "Implementation took roughly 6 weeks for a typical mid-market firm.", metric: { key: "implementation_time", value: 6, unit: "weeks", period: "2025", scope: "mid_market" } },
      { id: "QA-06", callId: "CALL-A", ts: "00:15:02", speaker: "Expert", scope: "all_customers", hedged: true, text: "The roadmap had a payroll module planned for 2026, but I left before launch, so I can't say whether it shipped." },
    ],
  },
  {
    id: "CALL-B",
    expertName: "Dev Okafor",
    role: "Practice Operations Director, Carrow & Lyle LLP (Quillmoor customer, 40 seats)",
    cohort: "customer",
    date: "2026-09-16",
    durationMin: 40,
    quotes: [
      { id: "QB-01", callId: "CALL-B", ts: "00:02:00", speaker: "Expert", scope: "single_firm", text: "I'm Dev Okafor, Practice Operations Director at Carrow & Lyle LLP. We're about 40 seats and have used Quillmoor for five years." },
      { id: "QB-02", callId: "CALL-B", ts: "00:05:20", speaker: "Expert", scope: "single_firm", text: "Our renewal went up 12% in 2025. Nobody negotiated it with us; it just arrived on the invoice.", metric: { key: "renewal_uplift", value: 12, unit: "%", period: "2025", scope: "single_firm" } },
      { id: "QB-03", callId: "CALL-B", ts: "00:08:45", speaker: "Expert", scope: "single_firm", text: "Implementation took us almost 16 weeks, mostly data migration from our old system.", metric: { key: "implementation_time", value: 16, unit: "weeks", period: "2021", scope: "single_firm" } },
      { id: "QB-04", callId: "CALL-B", ts: "00:11:10", speaker: "Expert", scope: "single_firm", text: "Switching would be painful. We'd need a whole tax season to move our client files and workflows." },
      { id: "QB-05", callId: "CALL-B", ts: "00:13:30", speaker: "Expert", scope: "single_firm", text: "Support is slower than last year. We wait about two days for a ticket now; it used to be same day.", metric: { key: "support_response", value: 2, unit: "days", period: "2026", scope: "single_firm" } },
    ],
  },
  {
    id: "CALL-C",
    expertName: "Rowan Pike",
    role: "Former Head of Sales, Tallyfern (competitor, left Jun 2026)",
    cohort: "competitor",
    date: "2026-09-18",
    durationMin: 50,
    quotes: [
      { id: "QC-01", callId: "CALL-C", ts: "00:01:30", speaker: "Expert", scope: "all_customers", text: "I ran sales at Tallyfern until June 2026, so I competed with Quillmoor in most of our deals. My number is +44 7700 900123 if you need to follow up." },
      { id: "QC-02", callId: "CALL-C", ts: "00:04:50", speaker: "Expert", scope: "small_firms", text: "In head-to-heads against Quillmoor in small firms, under 20 seats, we won about 60% in 2025.", metric: { key: "competitive_win_rate", value: 60, unit: "%", period: "2025", scope: "small_firms" } },
      { id: "QC-03", callId: "CALL-C", ts: "00:07:15", speaker: "Expert", scope: "all_customers", text: "Quillmoor's renewal increase in 2025 was 12% on list, across the board. We used it in every competitive pitch.", metric: { key: "renewal_uplift", value: 12, unit: "%", period: "2025", scope: "all_customers" } },
      { id: "QC-04", callId: "CALL-C", ts: "00:10:20", speaker: "Expert", scope: "small_firms", hedged: true, text: "Their retention in small firms is weak. I'd guess GRR in the low 80s, around 82% in FY2025, because we took a lot of those logos.", metric: { key: "grr", value: 82, unit: "%", period: "FY2025", scope: "small_firms", estimate: true } },
      { id: "QC-05", callId: "CALL-C", ts: "00:12:00", speaker: "Expert", scope: "mid_market", text: "In the mid-market we rarely displaced them. Those firms stay put." },
    ],
  },
];

export const QUESTIONS: DiligenceQuestion[] = [
  { id: "retention", question: "How durable is revenue retention, and does it differ by segment?", subject: "revenue retention by segment", metricKey: "grr", period: "FY2025", requiredCohorts: ["former_employee", "customer"] },
  { id: "pricing", question: "Is there pricing power at renewal without raising churn?", subject: "renewal pricing in 2025", metricKey: "renewal_uplift", period: "2025", requiredCohorts: ["former_employee", "customer"] },
  { id: "competition", question: "Where does Quillmoor win or lose against competitors?", subject: "competitive win and loss by segment", metricKey: "competitive_win_rate", period: "2025", requiredCohorts: ["competitor", "customer"] },
  { id: "implementation", question: "How long does implementation take, and what drives the time?", subject: "implementation time and its drivers", metricKey: "implementation_time", requiredCohorts: ["former_employee", "customer"] },
  { id: "switching", question: "How costly is it for a firm to switch away?", subject: "the cost and effort of switching providers", requiredCohorts: ["customer", "competitor"] },
  { id: "roadmap", question: "What has the product team actually shipped recently?", subject: "recent product releases", requiredCohorts: ["former_employee"] },
  { id: "support", question: "Is service quality holding up as the base grows?", subject: "support responsiveness", metricKey: "support_response", requiredCohorts: ["customer"] },
];

const SEED_AT = "2026-09-18T17:00:00.000Z";

function seed(c: Omit<Claim, "included" | "review" | "history">): Claim {
  return {
    ...c,
    included: true,
    review: { status: "unreviewed", note: "" },
    history: [{ v: 1, at: SEED_AT, change: "created", detail: "Draft synthesis (synthetic, written for the demo)", text: c.text, citations: [...c.citations], priorReview: "unreviewed" }],
  };
}

export function seedClaims(): Claim[] {
  return [
    seed({ id: "CL-1", topic: "retention", keyThesis: true, scope: "all_customers", generality: "single", text: "Gross revenue retention was about 91% in FY2025 across the full customer base.", citations: ["QA-02"], claimedMetric: { key: "grr", value: 91, unit: "%", period: "FY2025" } }),
    seed({ id: "CL-2", topic: "retention", keyThesis: true, scope: "all_customers", generality: "consensus", text: "Experts agree retention is strong across all segments.", citations: ["QA-03", "QC-05"] }),
    seed({ id: "CL-3", topic: "pricing", keyThesis: true, scope: "all_customers", generality: "single", text: "Quillmoor raised renewal prices 7% in 2025 with little pushback.", citations: ["QA-04"], claimedMetric: { key: "renewal_uplift", value: 7, unit: "%", period: "2025" } }),
    seed({ id: "CL-4", topic: "pricing", keyThesis: false, scope: "all_customers", generality: "single", text: "Customers saw renewal increases of 15% in 2025.", citations: ["QB-02"], claimedMetric: { key: "renewal_uplift", value: 15, unit: "%", period: "2025" } }),
    seed({ id: "CL-5", topic: "implementation", keyThesis: false, scope: "mid_market", generality: "single", text: "A typical mid-market implementation takes about 6 weeks.", citations: ["QA-05"], claimedMetric: { key: "implementation_time", value: 6, unit: "weeks", period: "2025" } }),
    seed({ id: "CL-6", topic: "competition", keyThesis: true, scope: "all_customers", generality: "single", text: "Quillmoor loses about 60% of competitive deals to Tallyfern.", citations: ["QC-02"], claimedMetric: { key: "competitive_win_rate", value: 60, unit: "%", period: "2025" } }),
    seed({ id: "CL-7", topic: "switching", keyThesis: true, scope: "single_firm", generality: "single", text: "Switching costs are high: one customer says moving would take a full tax season.", citations: [] }),
    seed({ id: "CL-8", topic: "roadmap", keyThesis: false, scope: "all_customers", generality: "single", text: "Quillmoor launched a payroll module in 2026.", citations: ["QA-06"] }),
    seed({ id: "CL-9", topic: "support", keyThesis: false, scope: "single_firm", generality: "single", text: "One customer reports support tickets now take about 2 days, previously same day.", citations: ["QB-05"], claimedMetric: { key: "support_response", value: 2, unit: "days", period: "2026" } }),
  ];
}

export const ALL_QUOTES = CALLS.flatMap((c) => c.quotes);
export const QUOTE_BY_ID = new Map(ALL_QUOTES.map((q) => [q.id, q]));
export const CALL_BY_ID = new Map(CALLS.map((c) => [c.id, c]));

export const IDENTIFIERS: { term: string; kind: string; replacement: string }[] = [
  { term: "Helena Marsh", kind: "Expert name", replacement: "[EXPERT-A]" },
  { term: "Helena", kind: "Expert first name", replacement: "[EXPERT-A]" },
  { term: "Dev Okafor", kind: "Expert name", replacement: "[EXPERT-B]" },
  { term: "Dev", kind: "Expert first name", replacement: "[EXPERT-B]" },
  { term: "Rowan Pike", kind: "Expert name", replacement: "[EXPERT-C]" },
  { term: "Carrow & Lyle LLP", kind: "Customer firm", replacement: "[CUSTOMER-FIRM]" },
  { term: "analyst.kestrel@example.com", kind: "Email address", replacement: "[EMAIL]" },
  { term: "+44 7700 900123", kind: "Phone number", replacement: "[PHONE]" },
  { term: "Quillmoor Systems", kind: "Target company", replacement: "[TARGET]" },
  { term: "Quillmoor", kind: "Target company", replacement: "[TARGET]" },
  { term: "Tallyfern", kind: "Competitor", replacement: "[COMPETITOR]" },
];
