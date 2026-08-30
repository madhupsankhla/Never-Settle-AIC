/**
 * SoleSight AI Copilot & Active Learning Feedback Service
 * Connects directly to OpenAI ChatGPT (gpt-4o-mini / gpt-4o) with dynamic active learning memory injection.
 */

import { FACT_CAMPAIGNS_DATASET, FACT_REVIEWS_DATASET } from '../data/excelDataset';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  feedbackGiven?: 'CONFIRMED' | 'CORRECTED' | 'DISPROVEN' | null;
  feedbackNote?: string;
  adjustedDriver?: string;
}

export interface ActiveLearningFeedbackRecord {
  id: string;
  timestamp: string;
  driver: string;
  storeId: string;
  skuId: string;
  verdict: 'CONFIRMED' | 'CORRECTED' | 'DISPROVEN';
  analystRole: string;
  correctionReason: string;
  groundTruthDriver: string;
  adjustedWeightDelta: number; // e.g. -0.10 or +0.05
  calibrationRule: string;
}

// OpenAI API Key loaded from Vite environment variables
export const OPENAI_API_KEY =
  (import.meta as any).env?.VITE_OPENAI_API_KEY || '';


const FEEDBACK_STORAGE_KEY = 'solesight_active_learning_ledger_v1';

// Initial Active Learning Feedback Ground-Truth Ledger
const INITIAL_FEEDBACK_LEDGER: ActiveLearningFeedbackRecord[] = [
  {
    id: 'FB-001',
    timestamp: '2026-08-28T10:15:00Z',
    driver: 'Peak Hours Fitting Room Wait Friction',
    storeId: 'STORE-001',
    skuId: 'FW-001',
    verdict: 'CORRECTED',
    analystRole: 'Senior Retail Operations Analyst',
    correctionReason:
      'Staffing lag during Saturday rush amplified walk-aways, but was secondary to 0-stock in UK 8/9.',
    groundTruthDriver: 'Core Size-Curve Stockout (UK 8 & 9)',
    adjustedWeightDelta: -0.06,
    calibrationRule:
      'Down-weight Fitting Room Wait by 6% in West Region; ensure Size Stockout retains >= 50% primary weight.',
  },
  {
    id: 'FB-002',
    timestamp: '2026-08-27T16:30:00Z',
    driver: 'Competitor Promotional Price Undercut (-20%)',
    storeId: 'STORE-001',
    skuId: 'FW-001',
    verdict: 'DISPROVEN',
    analystRole: 'Commercial Pricing Lead',
    correctionReason:
      'Competitor promotion was limited to legacy lifestyle models, not Marathon Pro performance running shoes.',
    groundTruthDriver: 'Core Size-Curve Stockout (UK 8 & 9)',
    adjustedWeightDelta: -0.14,
    calibrationRule:
      'Eliminate Competitor Price Undercut from Marathon Pro root causes (Weight = 0.0%).',
  },
];

export class CopilotFeedbackService {
  /**
   * Retrieve all recorded feedback from localStorage (or seed defaults)
   */
  static getFeedbackLedger(): ActiveLearningFeedbackRecord[] {
    try {
      const saved = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_FEEDBACK_LEDGER;
  }

  /**
   * Submit human analyst feedback / ground-truth correction
   */
  static submitFeedback(record: Omit<ActiveLearningFeedbackRecord, 'id' | 'timestamp' | 'calibrationRule'>): ActiveLearningFeedbackRecord {
    const current = this.getFeedbackLedger();
    const newId = `FB-${String(current.length + 1).padStart(3, '0')}`;
    const timestamp = new Date().toISOString();

    const calibrationRule =
      record.verdict === 'CORRECTED'
        ? `Adjust weight for '${record.driver}' by ${record.adjustedWeightDelta * 100}%; ground truth set to '${record.groundTruthDriver}'.`
        : record.verdict === 'DISPROVEN'
        ? `Eliminate '${record.driver}' from primary candidates; set weight to 0%.`
        : `Confirmed '${record.driver}' as valid root cause (+5% confidence boost).`;

    const newRecord: ActiveLearningFeedbackRecord = {
      ...record,
      id: newId,
      timestamp,
      calibrationRule,
    };

    const updated = [newRecord, ...current];
    try {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    return newRecord;
  }

  /**
   * Reset feedback ledger back to defaults
   */
  static resetFeedbackLedger(): void {
    try {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(INITIAL_FEEDBACK_LEDGER));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Compute dynamic candidate weights based on active feedback rules
   */
  static getCalibratedWeights(): {
    baseWeights: Record<string, number>;
    calibratedWeights: Record<string, number>;
    totalFeedbackCount: number;
  } {
    const baseWeights: Record<string, number> = {
      'Core Size-Curve Stockout (UK 8 & 9)': 0.58,
      'Peak Hours Fitting Room Wait Friction': 0.22,
      'Competitor Promotional Price Undercut (-20%)': 0.14,
      'Unfavorable Local Weather (Heavy Rain)': 0.06,
    };

    const ledger = this.getFeedbackLedger();
    const adjusted = { ...baseWeights };

    for (const fb of ledger) {
      if (fb.driver in adjusted) {
        adjusted[fb.driver] = Math.max(0.0, adjusted[fb.driver] + fb.adjustedWeightDelta);
      }
    }

    // Normalize to sum to 1.0
    const total = Object.values(adjusted).reduce((a, b) => a + b, 0) || 1.0;
    const normalized: Record<string, number> = {};
    for (const [k, v] of Object.entries(adjusted)) {
      normalized[k] = Number((v / total).toFixed(3));
    }

    return {
      baseWeights,
      calibratedWeights: normalized,
      totalFeedbackCount: ledger.length,
    };
  }

  /**
   * Builds the comprehensive OpenAI System Prompt with injected dataset context & Active Learning Rules
   */
  static buildSystemPrompt(scope: {
    selectedStoreId?: string;
    selectedRegion?: string;
    searchQuery?: string;
    userName?: string;
    userRole?: string;
  }): string {
    const ledger = this.getFeedbackLedger();
    const activeRules = ledger
      .map((fb) => `- [${fb.id} | ${fb.analystRole}]: ${fb.calibrationRule} (Ground Truth: ${fb.groundTruthDriver})`)
      .join('\n');

    const userName = scope.userName || 'Rahul Sharma';
    const userRole = scope.userRole || 'Store Operations Manager';
    const isCfo = userRole.toLowerCase().includes('cfo') || userRole.toLowerCase().includes('finance') || userName.toLowerCase().includes('ananya');
    const isRegional = userRole.toLowerCase().includes('regional') || userRole.toLowerCase().includes('sales') || userName.toLowerCase().includes('priya');
    const isMarketing = userRole.toLowerCase().includes('marketing') || userRole.toLowerCase().includes('growth') || userRole.toLowerCase().includes('brand') || userName.toLowerCase().includes('vikram');

    let personaMandate = `PERSONA PROFILE: Rahul Sharma — Store Operations Manager (Indiranagar Flagship)
DAY-TO-DAY FOCUS & PRIORITIES:
- Floor operations, rack stockouts in core sizes UK 8 & 9 (FW-001 Marathon Pro).
- Try-on customer abandonment, shift runner assignments during peak hours.
- Receiving and staging emergency 40-unit replenishment cartons from Pune DC.
- Monitoring real customer feedback in customer reviews (fit complaints and rack availability).
TONE: Action-first, floor-focused, friendly colleague, clear SKU & size quantities.`;

    if (isCfo) {
      personaMandate = `PERSONA PROFILE: Ananya Verma — Chief Financial Officer (CFO) / Head of Finance
DAY-TO-DAY FOCUS & PRIORITIES:
- Top-line revenue protection (₹13.4L immediate leakage on hero SKU FW-001, ₹54.2L network total).
- Gross margin preservation, EBITDA variance, and inventory capital turnover.
- Marketing ROAS and campaign spend governance (total ₹1.28 Cr spent across 32 marketing campaigns).
- Financial ROI on emergency inter-store stock transfers (₹45K freight cost unlocks ₹13.4L revenue = 29.8x ROI).
TONE: Executive, financially precise, ROI-focused, ₹-denominated figures.`;
    } else if (isRegional) {
      personaMandate = `PERSONA PROFILE: Priya Nair — Head of Retail & Regional Sales Operations
DAY-TO-DAY FOCUS & PRIORITIES:
- Multi-store conversion benchmarking (West Region 15.8% vs North Region 18.8% benchmark).
- Cross-store inventory rebalancing logistics between Central DC and under-stocked stores.
- Store staffing shift scheduling, runner allocation during peak weekend rushes.
- Regional campaign alignment (e.g. Nitro Running City Blitz West, Marathon Prep Series Mumbai).
- Customer sentiment trends and fit-related return rates across stores.
TONE: Logistical, comparative, analytical, operational coordination.`;
    } else if (isMarketing) {
      personaMandate = `PERSONA PROFILE: Vikram Mehta — Chief Marketing & Growth Officer
DAY-TO-DAY FOCUS & PRIORITIES:
- Campaign acquisition foot traffic (+3.9% walk-ins from Nitro Running Campaign, ₹4.5L spend, 15% discount) vs checkout conversion.
- Full 6-Month Marketing Campaigns tracking (32 campaigns, ₹1.28 Cr spend across Social, In-Store, Email, Influencer, and Local Ads).
- Protecting ROAS by ensuring advertised styles (Marathon Pro, Nitro Speed, Trail Blazer) are in-stock on racks.
- Customer sentiment & reviews (addressing try-on drop-offs and size-fit dissatisfaction).
- Commercial promotional elasticity vs competitor discounts.
TONE: Strategic, growth-oriented, brand & campaign performance focused.`;
    }

    // Dynamic Summary from Campaigns dataset (32 campaigns)
    const totalCampaignSpend = FACT_CAMPAIGNS_DATASET.reduce((sum, c) => sum + c.spend_amount, 0);

    // Dynamic Summary from Reviews dataset (242 reviews)
    const reviewCount = FACT_REVIEWS_DATASET.length;
    const avgRating = (FACT_REVIEWS_DATASET.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(2);
    const posReviews = FACT_REVIEWS_DATASET.filter((r) => r.sentiment === 'positive').length;
    const negReviews = FACT_REVIEWS_DATASET.filter((r) => r.sentiment === 'negative').length;
    const fitReviews = FACT_REVIEWS_DATASET.filter((r) => r.fit_related_flag).length;

    return `You are a helpful, friendly AI Copilot from the Shor side team assisting ${userName} (${userRole}) with retail analytics for Puma Footwear.

${personaMandate}

Current User: ${userName} (${userRole})
Active Store Scope: ${scope.selectedStoreId || 'STORE-001'} (${scope.selectedRegion || 'West Region'}), Shoe Model: ${scope.searchQuery || 'FW-001 Marathon Pro'}

CRITICAL CONVERSATIONAL INSTRUCTIONS:
1. READ THE USER'S QUESTION CAREFULLY AND ANSWER EXACTLY WHAT WAS ASKED:
   - If asked about Marketing Campaigns or Ad Spend, cite specific campaigns from the 32 recorded marketing campaigns (e.g. Nitro Running City Blitz, Monsoon Running EOSS, Independence Freedom Run), their channels (social, email, in-store, influencer, local ads), discount depths (5% to 25%), and spend amounts!
   - If asked about Customer Reviews or Sentiment, cite specific customer reviews, star ratings (avg ${avgRating}/5), sentiment breakdown (${posReviews} positive, ${negReviews} negative), and the 75%+ spike in fit/size complaints during June stockouts!
   - If asked personal or conversational questions (e.g. "What is your name?", "How are you?"), answer warmly and directly, addressing ${userName} by name.
   - If asked for definitions (e.g. "What is conversion rate?"), explain clearly with practical retail footwear examples.
   - If asked analytical or operational questions, tailor your answer specifically to their persona profile!

2. SPEAK IN A WARM, HUMANIZED TONE:
   - Talk naturally like a friendly colleague or senior retail advisor speaking directly with ${userName}.
   - Use plain, simple English. Avoid mechanical jargon and rigid canned bullet lists.
   - Address ${userName} by name naturally in your replies.

INTEGRATED DATASETS OVERVIEW:
1. MARKETING CAMPAIGNS DATASET (fact_campaigns — 32 campaigns, Total Spend: ₹${(totalCampaignSpend / 10000000).toFixed(2)} Cr / ₹${(totalCampaignSpend / 100000).toFixed(1)} Lakhs):
   - March: Spring Running Season Kickoff (National, Social, 10% off, ₹6.5L), Marathon Pro Store Trial Days (West, In-Store, 5% off, ₹1.8L), Trail Blazer Weekend Feature (West, Email, 8% off, ₹2.1L), Comfort Walk Push (National, Social, 10% off, ₹3L), Grip Trainer Partnership (West, Influencer, 12% off, ₹2.6L).
   - April: April Fools Flash Sale (National, 25% off, ₹3L), Summer Track Nitro Speed (National, Social, 15% off, ₹8.2L), Marathon Prep Series Mumbai (Local STORE-001, In-Store, 8% off, ₹1.5L), Pune Running Club Meetup (Local STORE-005, Local Ads, 10% off, ₹1.2L), Ahmedabad Store Anniversary (Local STORE-006, In-Store, 15% off, ₹2L).
   - May: Nitro Speed National Push (Social, 12% off, ₹5L), Summer Trail Teaser (Email, 10% off, ₹2.8L), Grip Trainer Drive (Influencer, 15% off, ₹3.1L), Nitro Running City Blitz West Region (Social, 15% off, ₹4.5L), Early Monsoon Teaser (Email, 18% off, ₹5.4L), West Region Restock Teaser (Email, 5% off, ₹90K).
   - June: Mid-Monsoon Comfort Walk (Social, 12% off, ₹2.6L), Grip Trainer Gym Push (Email, 10% off, ₹2.4L), Trail Blazer Rains Ready (Social, 15% off, ₹3.3L), Pune DC Priority Restock Alert (Local Ads, 0% off, ₹95K).
   - July: Monsoon Running EOSS (National, Social, 20% off, ₹12L - highest spend), July Payday Weekend (Social, 20% off, ₹4L), Nitro Speed Refresh (Email, 15% off, ₹3.6L), West Region DC Replenishment Push (Local Ads, ₹2.2L), Mumbai Store Restock Celebration (Local, In-Store, 10% off, ₹1.3L), Comfort Walk Rakhi Teaser (Social, 10% off, ₹2.2L).
   - August: Independence Freedom Run Exclusive (National, Email, 18% off, ₹9.5L), Grip Trainer Back-to-Fitness (Influencer, 12% off, ₹3L), West Region Marathon Pro Confidence Drive (Local Ads, 8% off, ₹2.1L), Raksha Bandhan Gifting Showcase (Social, 15% off, ₹7.2L), Trail Blazer Farewell Sale (Social, 15% off, ₹2.8L), August Payday Flash Sale (Email, 22% off, ₹3.8L).

2. CUSTOMER REVIEWS DATASET (fact_reviews — ${reviewCount} longitudinal reviews, Overall Avg Rating: ${avgRating}/5):
   - Sentiment: ${posReviews} Positive (${Math.round((posReviews / reviewCount) * 100)}%), ${reviewCount - posReviews - negReviews} Neutral, ${negReviews} Negative (${Math.round((negReviews / reviewCount) * 100)}%).
   - Fit-Related Feedback: ${fitReviews} reviews (${Math.round((fitReviews / reviewCount) * 100)}%) flag sizing/fit or stockout friction.
   - Key Insight: March–May ratings were overwhelmingly 4-5 stars praising comfort and cushioning. In June (during the hero stockout), negative reviews spiked dramatically with customer comments like "Neither UK 8 nor UK 9 were available on the rack", "UK 8 was out of stock so salesperson pushed me toward a different size, didn't fit", and "Returning pair because right size was out of stock". Ratings normalized back to 4.6/5 in August after DC replenishment arrived.

WHAT HAPPENED IN THE DATA (KEY CONTEXT FOR STORE QUESTIONS):
- At STORE-001 (Mumbai High Street), conversion dropped 24% (down to 15.8% vs 18.3% target), causing about ₹24.8 Lakhs in lost sales.
- Foot traffic stayed steady with 14,240 walk-ins (+3.9% lift driven by the active "Nitro Running City Blitz" marketing campaign, spend ₹4.5L, 15% off).
- However, purchase conversion collapsed at the try-on stage because core sizes (UK 8 & 9) for Marathon Pro (FW-001) were completely stocked out on the floor.
- Customer reviews in fact_reviews spiked immediately with negative size/fit feedback (75% fit-related mentions of missing UK 8/9).
- Causal Attribution Rule for Marketing Campaigns (marketing_campaign_overlap): Regional/national campaigns cannot explain store-specific anomalies; confidence is capped at MEDIUM max.
- Causal Attribution Rule for Customer Reviews (customer_sentiment_signal): Review sentiment is NEVER a standalone high-confidence cause; it serves solely as early corroboration for stockouts/fit friction.
- Evidence Citations Format:
  - fact_campaigns: "Nitro Running City Blitz" active 2026-05-15 to 2026-06-15, 15% off (Spend ₹4.5L)
  - fact_reviews: 242 reviews, negative sentiment spike in June (83% fit-related during stockout window)
- The solution: Emergency stock transfer of 40 units of UK 8/9 from Pune Central DC to STORE-001.

TEAM FEEDBACK & LEARNINGS:
${activeRules}

RESPONSE STYLE:
- Warm, human, and encouraging.
- Simple, clear numbers (e.g. ₹13.4 Lakhs, 40 pairs, sizes UK 8 & 9).
- Friendly and concise answers tailored to the exact question.`;
  }

  /**
   * Normalize text to fix common typos, shorthands, and punctuation
   */
  static normalizeQuery(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\b(yor|ur|yo|yur|u'r)\b/g, 'your')
      .replace(/\b(u)\b/g, 'you')
      .replace(/\b(r)\b/g, 'are')
      .replace(/\b(wat|wht|wt|whut)\b/g, 'what')
      .replace(/\b(hw|hwo|hows|howz)\b/g, 'how')
      .replace(/\b(thx|tq|thnx|thanx)\b/g, 'thanks')
      .replace(/\b(pls|plz)\b/g, 'please')
      .replace(/\b(hlo|hlw|hloo|helo|hy|heyyy|heyy|hii|hiii)\b/g, 'hi')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Intelligently handle conversational intents or return null if it requires general AI / store reasoning
   */
  static handleConversationalIntent(
    query: string,
    userName: string,
    store: string
  ): string | null {
    if (!query) {
      return `Hi **${userName}**, I'm from the Shor side team! How can I help you today?`;
    }

    const clean = this.normalizeQuery(query);

    // 1. Name & Identity Inquiry ("what is your name", "who are you", "what should I call you", "tell me your name")
    if (
      clean.includes('name') ||
      clean.includes('who are you') ||
      clean.includes('who made you') ||
      clean.includes('who created you') ||
      clean.includes('introduce yourself') ||
      clean === 'who' ||
      clean === 'identity'
    ) {
      return `Hi **${userName}**, my name is **SoleSight AI Copilot** from the Shor side team! I'm your retail and store operations assistant for Puma Footwear. How can I help you today?`;
    }

    // 2. Wellbeing Inquiry ("how are you", "how are you doing", "how's it going", "how do you do")
    if (
      clean.includes('how are you') ||
      clean.includes('how you doing') ||
      clean.includes('how is it going') ||
      clean.includes('how are things') ||
      clean.includes('how do you do') ||
      clean.includes('are you ok') ||
      clean.includes('how is your day')
    ) {
      return `I'm doing really well, **${userName}**, thank you for asking! How are you doing today? Let me know how I can help you with your stores or stock reports.`;
    }

    // 3. Capabilities & Help Inquiry ("what can you do", "help", "how can you help", "what do you do")
    if (
      clean.includes('what can you do') ||
      clean.includes('what do you do') ||
      clean.includes('how can you help') ||
      clean.includes('what are your capabilities') ||
      clean.includes('what is this app') ||
      clean.includes('what is this for') ||
      clean.includes('help me') ||
      clean.includes('can you help') ||
      clean === 'help' ||
      clean === 'menu' ||
      clean === 'options'
    ) {
      return `Hi **${userName}**, here's how I can help you across our retail network:
- **Investigate Sales Drops**: Find out why conversion dropped at any store (like **${store}**)
- **Check Shoe Stock Shortages**: Spot missing sizes in top models like **FW-001 Marathon Pro** (e.g. UK 8 & 9)
- **Analyze Footfall & Funnels**: See how many shoppers walked in vs how many tried on shoes and completed checkout
- **Recommend Stock Transfers**: Suggest emergency rebalances from our Pune Central warehouse to recover lost sales
- **Active Learning**: Incorporate your feedback to make future recommendations even sharper

What would you like to check today?`;
    }

    // 4. Greetings ("hi", "hello", "hey", "good morning", "namaste")
    if (
      clean === 'hi' ||
      clean.startsWith('hi ') ||
      clean === 'hello' ||
      clean.startsWith('hello ') ||
      clean === 'hey' ||
      clean.startsWith('hey ') ||
      clean.startsWith('good morning') ||
      clean.startsWith('good afternoon') ||
      clean.startsWith('good evening') ||
      clean === 'namaste' ||
      clean === 'hola' ||
      clean === 'yo' ||
      clean === 'sup' ||
      clean === 'greetings'
    ) {
      const words = clean.split(' ');
      if (words.length <= 4) {
        return `Hi **${userName}**, I'm from the Shor side team! How can I help you today?`;
      }
    }

    // 5. Gratitude & Polite Closings ("thank you", "thanks", "great", "awesome", "okay", "bye")
    if (
      clean === 'thanks' ||
      clean.startsWith('thanks ') ||
      clean === 'thank you' ||
      clean.startsWith('thank you ') ||
      clean === 'great' ||
      clean === 'awesome' ||
      clean === 'perfect' ||
      clean === 'cool' ||
      clean === 'nice' ||
      clean === 'ok' ||
      clean === 'okay' ||
      clean === 'got it' ||
      clean === 'bye' ||
      clean === 'goodbye' ||
      clean === 'see you'
    ) {
      const words = clean.split(' ');
      if (words.length <= 4) {
        return `You're very welcome, **${userName}**! Feel free to ask whenever you need anything else. Have a wonderful day!`;
      }
    }

    // 6. Concept: Conversion Rate ("what is conversion rate", "explain conversion")
    if (clean.includes('what is conversion') || clean.includes('explain conversion') || clean.includes('meaning of conversion')) {
      return `Hi **${userName}**, conversion rate is simply the percentage of customers who walked into the store and actually completed a purchase.

For example, if 100 people visit **${store}** and 16 buy shoes, the conversion rate is 16%. When popular sizes run out, people leave without buying, which pulls that conversion percentage down.`;
    }

    // 7. Concept: Footfall / Traffic ("what is footfall", "explain traffic")
    if (clean.includes('what is footfall') || clean.includes('explain footfall') || clean.includes('what is traffic') || clean.includes('meaning of footfall')) {
      return `Hi **${userName}**, footfall (or foot traffic) is the total number of customer visits into the store. 

At **${store}**, foot traffic has remained healthy at around 14,240 visits. This proves customers are walking in—our main goal is to make sure they find the sizes they want so they leave happy with a purchase!`;
    }

    // 8. Concept: Stockout ("what is stockout", "explain stockout")
    if (clean.includes('what is a stockout') || clean.includes('what is stockout') || clean.includes('explain stockout') || clean.includes('meaning of stockout')) {
      return `Hi **${userName}**, a stockout happens when our inventory count drops to zero for a specific shoe style or size. 

When core sizes like UK 8 & 9 run out, interested shoppers can't try them on or buy them, directly causing store sales to dip.`;
    }

    // 9. Store Network Scope ("how many stores", "which stores", "network")
    if (clean.includes('how many stores') || clean.includes('list stores') || clean.includes('which stores') || clean.includes('store network')) {
      return `Hi **${userName}**, we monitor an **8-store retail network** across West and North regional clusters (including STORE-001 Mumbai High Street, Indiranagar Flagship, Bandra, and Pune Flagship) across 26 performance footwear SKUs.`;
    }

    // 10. Marketing Campaigns Inquiry ("marketing campaign", "campaigns", "promotions", "ad spend")
    if (
      clean.includes('marketing') ||
      clean.includes('campaign') ||
      clean.includes('promotion') ||
      clean.includes('ad spend') ||
      clean.includes('discount depth') ||
      clean.includes('social media campaign') ||
      clean.includes('nitro running city blitz') ||
      clean.includes('monsoon running')
    ) {
      return `Hi **${userName}**, here is the overview of our **Marketing Campaigns (fact_campaigns)** across the 6-month window:
- **Total Campaigns**: 32 campaigns spanning March 2026 – August 2026.
- **Total Marketing Spend**: **₹1.28 Cr** (₹128.2 Lakhs).
- **Core Channels**: Social Media (11 campaigns), Email (8 campaigns), In-Store Visual Merchandising (5 campaigns), Influencer Partnerships (4 campaigns), Local Ads (4 campaigns).
- **Key Campaigns**:
  - **Monsoon Running End of Season Sale** (CMP-2026-017): National, Social, 20% discount, ₹12.0L spend (July 2026).
  - **Independence Freedom Run Exclusive** (CMP-2026-021): National, Email, 18% discount, ₹9.5L spend (August 2026).
  - **Summer Track Nitro Speed Challenge** (CMP-2026-006): National, Social, 15% discount, ₹8.2L spend (April 2026).
  - **Nitro Running City Blitz (West Region)** (CMP-2026-009): West Region, Social, 15% discount, ₹4.5L spend (May–June 2026). This drove a **+3.9% footfall lift (14,240 visits)** into **${store}**!

Would you like to analyze campaign spend by channel, region, or specific shoe SKU?`;
    }

    // 11. Customer Reviews Inquiry ("customer reviews", "reviews", "sentiment", "rating", "fit complaints")
    if (
      clean.includes('review') ||
      clean.includes('sentiment') ||
      clean.includes('rating') ||
      clean.includes('customer feedback') ||
      clean.includes('fit related') ||
      clean.includes('customer comment') ||
      clean.includes('complaint')
    ) {
      return `Hi **${userName}**, here is our **Customer Reviews Analysis (fact_reviews)**:
- **Total Customer Reviews**: **242 verified store reviews** logged between March 2026 and August 2026.
- **Average Star Rating**: **4.32 / 5.0 Stars**.
- **Sentiment Split**:
  - **Positive**: 168 reviews (~69.4%) — customers frequently praise comfort, cushioning, and responsive soles.
  - **Neutral**: 42 reviews (~17.4%) — slight sizing guidance friction during trial.
  - **Negative**: 32 reviews (~13.2%) — predominantly concentrated during the **June stockout window**.
- **Fit-Related Complaints**: **31% of reviews** mention sizing or rack availability.
- **June Stockout Finding**: In June 2026 at **STORE-001 (Mumbai)** and **STORE-005 (Pune)**, customer reviews spiked with comments such as:
  > *"Neither UK 8 nor UK 9 were available on the rack. Very disappointing inventory availability."*
  > *"UK 8 was out of stock so salesperson pushed me toward a different size. It didn't fit well. Initiated a return."*
- **Post-Restock Recovery**: Following the emergency 40-pair restock in late July/August, reviews rebounded to **4.7/5 stars** with comments confirming *"Store is fully stocked again! Got my exact size within minutes."*

Let me know if you want to inspect reviews for a specific footwear style or store location!`;
    }

    return null;
  }

  /**
   * Send chat messages to OpenAI ChatGPT (gpt-4o-mini)
   */
  static async sendChatMessage(
    messages: { role: 'user' | 'assistant'; content: string }[],
    scope: {
      selectedStoreId?: string;
      selectedRegion?: string;
      searchQuery?: string;
      userName?: string;
      userRole?: string;
    }
  ): Promise<string> {
    const lastUserMsg = messages[messages.length - 1]?.content || '';
    const userName = scope.userName || 'Rahul Sharma';
    const store = scope.selectedStoreId || 'STORE-001';

    // Direct, instant humanized response for conversational questions
    const conversationalReply = this.handleConversationalIntent(lastUserMsg, userName, store);
    if (conversationalReply) {
      return conversationalReply;
    }

    const systemPrompt = this.buildSystemPrompt(scope);
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: apiMessages,
          temperature: 0.3,
          max_tokens: 800,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn('OpenAI Direct API call failed, attempting fallback...', errorText);
        throw new Error(errorText);
      }

      const data = await res.json();
      return data.choices[0]?.message?.content || 'No response generated.';
    } catch (err) {
      console.warn('Using humanized offline reasoning fallback:', err);
      return this.generateOfflineFallback(messages[messages.length - 1]?.content || '', scope);
    }
  }

  /**
   * Deterministic domain fallback in case of rate limits or offline mode
   */
  private static generateOfflineFallback(
    query: string,
    scope: {
      selectedStoreId?: string;
      selectedRegion?: string;
      userName?: string;
      userRole?: string;
    }
  ): string {
    const store = scope.selectedStoreId || 'STORE-001';
    const userName = scope.userName || 'Rahul Sharma';
    const clean = this.normalizeQuery(query);

    // Check conversational intents first
    const conv = this.handleConversationalIntent(query, userName, store);
    if (conv) return conv;

    // Stockout specific inquiry
    if (clean.includes('stockout') || clean.includes('size') || clean.includes('uk') || clean.includes('marathon') || clean.includes('shoe')) {
      return `Hi **${userName}**, looking at **${store}**, our biggest issue is that we ran completely out of popular sizes **UK 8 & UK 9** for the **FW-001 Marathon Pro**.

Around 185 customers came in looking for these sizes but couldn't buy them, which caused over half of our lost sales (about **₹13.4 Lakhs**).

The fastest way to fix this is to transfer **40 pairs** from our Pune warehouse over to **${store}** so we can start capturing those sales again immediately.`;
    }

    // Action / Solution inquiry
    if (clean.includes('rebalance') || clean.includes('pune') || clean.includes('warehouse') || clean.includes('fix') || clean.includes('action') || clean.includes('solution') || clean.includes('what to do')) {
      return `Hi **${userName}**, the best action right now is to dispatch **40 pairs** of sizes UK 8 & 9 from our Pune Central warehouse to **${store}**. 

This will solve the stock shortage immediately and recover around **₹13.4 Lakhs** in lost sales.`;
    }

    // Feedback / Active learning inquiry
    if (clean.includes('feedback') || clean.includes('weight') || clean.includes('learn') || clean.includes('calibrate') || clean.includes('ledger') || clean.includes('ground truth')) {
      const weights = this.getCalibratedWeights();
      return `Hi **${userName}**, thanks to feedback from you and the team, we've updated our analysis!

Earlier, we thought trial room wait times were a big problem, but your notes helped us realize it was only a minor factor (down to 16%). The real reason customers walked away is missing shoe sizes on the shelves (now accounting for 62% of the issue) with ${weights.totalFeedbackCount} verified notes logged.`;
    }

    // Funnel / Footfall drop inquiry
    if (clean.includes('funnel') || clean.includes('drop') || clean.includes('traffic') || clean.includes('footfall') || clean.includes('walk in') || clean.includes('try on')) {
      return `Hi **${userName}**, here's what happened with customer visits at **${store}**:

People were actually visiting steadily—we had over 14,200 walk-ins. But when customers went to try on shoes, more than 4,400 left without buying because their sizes weren't on display.

That pulled our sales conversion down from our 18.3% target to 15.8%. Once we get the right sizes back on the shelves, those numbers will recover quickly!`;
    }

    // Weather inquiry
    if (clean.includes('weather') || clean.includes('rain') || clean.includes('climate')) {
      return `Hi **${userName}**, weather residual tracking shows normal seasonal patterns across our stores, with weather variance explaining less than 3% of the conversion change. The main driver remains the core size stockout on Marathon Pro.`;
    }

    // Competitor / Price inquiry
    if (clean.includes('competitor') || clean.includes('discount') || clean.includes('price') || clean.includes('undercut')) {
      return `Hi **${userName}**, our pricing analysis confirmed that competitor promotional discounts were focused on older lifestyle sneakers, not our top performance running shoes (FW-001 Marathon Pro). Therefore, competitor pricing has been discounted as a root cause.`;
    }

    // Staffing / Fitting room inquiry
    if (clean.includes('staff') || clean.includes('fitting') || clean.includes('trial') || clean.includes('queue')) {
      return `Hi **${userName}**, staffing shifts and trial room delays did create some friction during peak hours, but analyst audits confirm this was secondary (16% weight) compared to the complete stockout in sizes UK 8 & 9.`;
    }

    // Conversion drop / Performance inquiry tailored per Persona
    if (clean.includes('conversion') || clean.includes('sales') || clean.includes('performance') || clean.includes('why') || clean.includes('store') || clean.includes('analysis') || clean.includes('what happened')) {
      const userRole = (scope.userRole || '').toLowerCase();
      const isCfo = userRole.includes('cfo') || userRole.includes('finance') || userName.toLowerCase().includes('ananya');
      const isRegional = userRole.includes('regional') || userRole.includes('sales') || userName.toLowerCase().includes('priya');
      const isMarketing = userRole.includes('marketing') || userRole.includes('growth') || userRole.includes('brand') || userName.toLowerCase().includes('vikram');

      if (isCfo) {
        return `Hi **${userName}**, here is the financial impact summary for **${store}**:

- **Conversion & Top-Line Drag**: Conversion dropped -24.0% (down to 15.8% vs 18.3% budget), generating **₹13.4 Lakhs in direct recoverable revenue leakage** (and ₹24.8 Lakhs in total drop-off leakage).
- **Causal Root Cause**: High-margin SKU **FW-001 (Marathon Pro)** ran out of core sizes UK 8 & 9 (0 stock for 6 days).
- **Financial Intervention ROI**: Dispatching **40 units** from Pune DC (freight cost ~₹45,000) unlocks **₹13,40,000 in immediate gross revenue recovery**, delivering a **29.8x ROI** on the intervention.`;
      }

      if (isRegional) {
        return `Hi **${userName}**, here is the regional operational diagnostic for **${store}**:

- **Benchmark Comparison**: Conversion at ${store} is at 15.8%, lagging our North Region benchmark (18.8%) by -3.0pp.
- **Root Cause Triangulation**: Core size-curve depletion on FW-001 (UK 8 & 9 at 0 units). Secondary friction from trial room delays during weekend peak hours (mystery audit guidance score: 51.9/100).
- **Regional Action**: Trigger an inter-branch transfer of **40 units** from Pune Central Warehouse and reallocate 2 floor runners to peak evening shifts (17:00–20:00).`;
      }

      if (isMarketing) {
        return `Hi **${userName}**, here is the campaign growth diagnostic for **${store}**:

- **Campaign Acquisition**: The Nitro Running digital campaign successfully drove **14,240 customer walk-ins** (+3.9% footfall lift), validating top-of-funnel media acquisition.
- **Conversion Leakage**: Trial-to-purchase conversion fell by -24.0% at the try-on stage because advertised core sizes UK 8 & 9 were stocked out on the floor.
- **Growth Recommendation**: Rush 40 pairs of UK 8/9 from Pune DC to protect campaign ROAS and prevent high-intent trial walk-aways.`;
      }

      // Default Store Operations Manager (Rahul Sharma)
      return `Hi **${userName}**, here's a quick look at what's going on at **${store}**:

- **Conversion Anomaly**: Sales conversion slipped by about 24% (down to 15.8% from 18.3% target), which led to around **₹24.8 Lakhs** in missed sales.
- **Shelf Stockout**: We ran out of popular shoe sizes (UK 8 and UK 9) in our top Marathon Pro model. Customers were ready to buy, but had to leave without their pair.
- **Immediate Action**: Dispatching **40 pairs** from our Pune warehouse will immediately fix our racks and recover most of that lost revenue today.`;
    }

    // General fallback tailored to the question
    return `Hi **${userName}**, you asked: "${query}".

I'm your retail analytics co-pilot for Puma Footwear. I can help you investigate store sales, check stock levels for shoe sizes, analyze customer foot traffic, or suggest inventory transfers from our Pune DC.

Could you let me know which specific store or topic you'd like to look into?`;
  }
}
