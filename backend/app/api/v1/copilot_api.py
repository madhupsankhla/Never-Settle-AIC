"""
SoleSight AI Copilot & Active Learning Feedback Integration API.
Integrates with OpenAI ChatGPT (gpt-4o-mini / gpt-4o) with dynamic active learning context injection.
"""
import os
import json
import httpx
from typing import List, Dict, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException

copilot_router = APIRouter(prefix="/copilot", tags=["AI Copilot & Feedback Engine"])

# Default OpenAI API Key provided for SoleSight
DEFAULT_OPENAI_KEY = os.getenv("OPENAI_API_KEY", "")


# In-memory structured Active Learning Feedback Store
ACTIVE_LEARNING_FEEDBACK_STORE: List[Dict[str, Any]] = [
    {
        "id": "FB-001",
        "timestamp": "2026-08-28T10:15:00Z",
        "driver": "Peak Hours Fitting Room Wait Friction",
        "storeId": "STORE-001",
        "skuId": "FW-001",
        "verdict": "CORRECTED",
        "analystRole": "Senior Retail Operations Analyst",
        "correctionReason": "Staffing lag during Saturday rush amplified walk-aways, but was secondary to 0-stock in UK 8/9.",
        "groundTruthDriver": "Core Size-Curve Stockout (UK 8 & 9)",
        "adjustedWeightDelta": -0.06,
        "calibrationRule": "Down-weight Fitting Room Wait by 6% in West Region; ensure Size Stockout retains >= 50% primary weight.",
    },
    {
        "id": "FB-002",
        "timestamp": "2026-08-27T16:30:00Z",
        "driver": "Competitor Promotional Price Undercut (-20%)",
        "storeId": "STORE-001",
        "skuId": "FW-001",
        "verdict": "DISPROVEN",
        "analystRole": "Commercial Pricing Lead",
        "correctionReason": "Competitor promotion was limited to legacy lifestyle models, not Marathon Pro performance running shoes.",
        "groundTruthDriver": "Core Size-Curve Stockout (UK 8 & 9)",
        "adjustedWeightDelta": -0.14,
        "calibrationRule": "Eliminate Competitor Price Undercut from Marathon Pro root causes (Weight = 0.0%).",
    },
]


class ChatMessage(BaseModel):
    role: str  # "user", "assistant", "system"
    content: str


class CopilotChatRequest(BaseModel):
    messages: List[ChatMessage]
    currentScope: Optional[Dict[str, Any]] = None
    userRole: Optional[str] = "Store Operations Manager"
    userName: Optional[str] = "Rahul Sharma"
    stream: Optional[bool] = False


class FeedbackSubmission(BaseModel):
    driver: str
    storeId: str
    skuId: Optional[str] = "FW-001"
    verdict: str  # "CONFIRMED", "CORRECTED", "DISPROVEN"
    analystRole: str
    correctionReason: str
    groundTruthDriver: Optional[str] = None
    suggestedWeightDelta: Optional[float] = -0.10


def normalize_query(text: str) -> str:
    if not text:
        return ""
    import re
    cleaned = text.lower()
    cleaned = re.sub(r"[^a-z0-9\s]", " ", cleaned)
    cleaned = re.sub(r"\b(yor|ur|yo|yur|u'r)\b", "your", cleaned)
    cleaned = re.sub(r"\b(u)\b", "you", cleaned)
    cleaned = re.sub(r"\b(r)\b", "are", cleaned)
    cleaned = re.sub(r"\b(wat|wht|wt|whut)\b", "what", cleaned)
    cleaned = re.sub(r"\b(hw|hwo|hows|howz)\b", "how", cleaned)
    cleaned = re.sub(r"\b(thx|tq|thnx|thanx)\b", "thanks", cleaned)
    cleaned = re.sub(r"\b(pls|plz)\b", "please", cleaned)
    cleaned = re.sub(r"\b(hlo|hlw|hloo|helo|hy|heyyy|heyy|hii|hiii)\b", "hi", cleaned)
    return re.sub(r"\s+", " ", cleaned).strip()


def handle_conversational_intent(query: str, user_name: str, store: str) -> Optional[str]:
    if not query:
        return f"Hi **{user_name}**, I'm from the Shor side team! How can I help you today?"
    
    clean = normalize_query(query)

    # 1. Name & Identity Inquiry
    if "name" in clean or "who are you" in clean or "who made you" in clean or "who created you" in clean or clean == "who":
        return f"Hi **{user_name}**, my name is **SoleSight AI Copilot** from the Shor side team! I'm your retail and store operations assistant for Puma Footwear. How can I help you today?"

    # 2. Wellbeing Inquiry
    if "how are you" in clean or "how you doing" in clean or "how is it going" in clean or "how are things" in clean or "how do you do" in clean or "how is your day" in clean:
        return f"I'm doing really well, **{user_name}**, thank you for asking! How are you doing today? Let me know how I can help you with your stores or stock reports."

    # 3. Capabilities & Help Inquiry
    if "what can you do" in clean or "what do you do" in clean or "how can you help" in clean or "what is this" in clean or "help" in clean:
        return f"""Hi **{user_name}**, here's how I can help you across our retail network:
- **Investigate Sales Drops**: Find out why conversion dropped at any store (like **{store}**)
- **Check Shoe Stock Shortages**: Spot missing sizes in top models like **FW-001 Marathon Pro** (e.g. UK 8 & 9)
- **Analyze Footfall & Funnels**: See how many shoppers walked in vs how many tried on shoes and completed checkout
- **Recommend Stock Transfers**: Suggest emergency rebalances from our Pune Central warehouse to recover lost sales
- **Active Learning**: Incorporate your feedback to make future recommendations even sharper

What would you like to check today?"""

    # 4. Greetings
    if clean in ["hi", "hello", "hey", "namaste", "hola", "yo", "sup", "greetings"] or any(clean.startswith(prefix) for prefix in ["hi ", "hello ", "hey ", "good morning", "good afternoon", "good evening"]):
        words = clean.split()
        if len(words) <= 4:
            return f"Hi **{user_name}**, I'm from the Shor side team! How can I help you today?"

    # 5. Gratitude & Closings
    if clean in ["thanks", "thank you", "great", "awesome", "perfect", "cool", "nice", "ok", "okay", "got it", "bye", "goodbye", "see you"] or any(clean.startswith(prefix) for prefix in ["thanks ", "thank you "]):
        words = clean.split()
        if len(words) <= 4:
            return f"You're very welcome, **{user_name}**! Feel free to ask whenever you need anything else. Have a wonderful day!"

    # 6. Concept: Conversion Rate
    if "what is conversion" in clean or "explain conversion" in clean or "meaning of conversion" in clean:
        return f"""Hi **{user_name}**, conversion rate is simply the percentage of customers who walked into the store and actually completed a purchase.

For example, if 100 people visit **{store}** and 16 buy shoes, the conversion rate is 16%. When popular sizes run out, people leave without buying, which pulls that conversion percentage down."""

    # 7. Concept: Footfall
    if "what is footfall" in clean or "explain footfall" in clean or "what is traffic" in clean:
        return f"""Hi **{user_name}**, footfall (or foot traffic) is the total number of customer visits into the store.

At **{store}**, foot traffic has remained healthy at around 14,240 visits. This proves customers are walking in—our main goal is to make sure they find the sizes they want so they leave happy with a purchase!"""

    # 8. Concept: Stockout
    if "what is a stockout" in clean or "what is stockout" in clean or "explain stockout" in clean:
        return f"""Hi **{user_name}**, a stockout happens when our inventory count drops to zero for a specific shoe style or size.

When core sizes like UK 8 & 9 run out, interested shoppers can't try them on or buy them, directly causing store sales to dip."""

    # 9. Store Network Scope
    if "how many stores" in clean or "list stores" in clean or "which stores" in clean or "store network" in clean:
        return f"""Hi **{user_name}**, we monitor an **8-store retail network** across West and North regional clusters (including STORE-001 Mumbai High Street, Indiranagar Flagship, Bandra, and Pune Flagship) across 26 performance footwear SKUs."""

    # 10. Marketing Campaigns Inquiry
    if any(term in clean for term in ["marketing", "campaign", "promotion", "ad spend", "discount depth", "nitro running city blitz", "monsoon running"]):
        return f"""Hi **{user_name}**, here is the overview of our **Marketing Campaigns (fact_campaigns)** across the 6-month window:
- **Total Campaigns**: 32 campaigns spanning March 2026 – August 2026.
- **Total Marketing Spend**: **₹1.28 Cr** (₹128.2 Lakhs).
- **Core Channels**: Social Media (11 campaigns), Email (8 campaigns), In-Store Visual Merchandising (5 campaigns), Influencer Partnerships (4 campaigns), Local Ads (4 campaigns).
- **Key Campaigns**:
  - **Monsoon Running End of Season Sale** (CMP-2026-017): National, Social, 20% discount, ₹12.0L spend (July 2026).
  - **Independence Freedom Run Exclusive** (CMP-2026-021): National, Email, 18% discount, ₹9.5L spend (August 2026).
  - **Summer Track Nitro Speed Challenge** (CMP-2026-006): National, Social, 15% discount, ₹8.2L spend (April 2026).
  - **Nitro Running City Blitz (West Region)** (CMP-2026-009): West Region, Social, 15% discount, ₹4.5L spend (May–June 2026). This drove a **+3.9% footfall lift (14,240 visits)** into **{store}**!

Would you like to analyze campaign spend by channel, region, or specific shoe SKU?"""

    # 11. Customer Reviews Inquiry
    if any(term in clean for term in ["review", "sentiment", "rating", "customer feedback", "fit related", "customer comment", "complaint"]):
        return f"""Hi **{user_name}**, here is our **Customer Reviews Analysis (fact_reviews)**:
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

Let me know if you want to inspect reviews for a specific footwear style or store location!"""

    return None


def build_system_prompt(current_scope: Optional[Dict[str, Any]], user_role: str, user_name: str = "Rahul Sharma") -> str:
    """Builds a rich domain system prompt injecting 6-month dataset context, active learning calibration memory, and role-specific objectives."""
    scope_str = json.dumps(current_scope or {"selectedRegion": "West", "selectedStoreId": "STORE-001"})

    # Dynamic Active Learning Rules from recorded feedback
    active_rules_str = "\n".join([
        f"- [Rule {fb['id']} | {fb['analystRole']}]: {fb['calibrationRule']} (Ground Truth: {fb['groundTruthDriver']})"
        for fb in ACTIVE_LEARNING_FEEDBACK_STORE
    ])

    # Persona-tailored mandate and priority profile
    is_cfo = "cfo" in user_role.lower() or "finance" in user_role.lower() or "ananya" in user_name.lower()
    is_regional = "regional" in user_role.lower() or "sales" in user_role.lower() or "priya" in user_name.lower()
    is_marketing = "marketing" in user_role.lower() or "growth" in user_role.lower() or "brand" in user_role.lower() or "vikram" in user_name.lower()

    if is_cfo:
        role_profile = """PERSONA: Ananya Verma — Chief Financial Officer (CFO) / Head of Finance
PRIMARY OBJECTIVES & DAY-TO-DAY FOCUS:
- Top-line revenue protection (₹13.4L immediate leakage on hero SKU FW-001, ₹54.2L network total).
- Gross margin preservation & inventory capital turnover.
- Marketing ROAS and campaign spend governance (total ₹1.28 Cr spent across 32 marketing campaigns).
- Financial ROI on emergency inter-store stock transfers (e.g. ₹45K freight cost unlocks ₹13.4L revenue = 29.8x ROI).
- EBITDA risk mitigation and quarterly conversion variance analysis.
TONE: Executive, financially precise, ROI-focused, ₹-denominated figures."""
    elif is_regional:
        role_profile = """PERSONA: Priya Nair — Head of Retail & Regional Sales Operations
PRIMARY OBJECTIVES & DAY-TO-DAY FOCUS:
- Multi-store conversion benchmarking (West Region 15.8% vs North Region 18.8% benchmark).
- Cross-store inventory rebalancing logistics between Central DC and under-stocked stores.
- Store staffing shift scheduling, runner allocation during peak 17:00-20:00 weekend rushes.
- Regional campaign alignment (e.g. Nitro Running City Blitz West, Marathon Prep Series Mumbai).
- Customer sentiment trends and fit-related return rates across stores.
TONE: Logistical, comparative, analytical, operational coordination."""
    elif is_marketing:
        role_profile = """PERSONA: Vikram Mehta — Chief Marketing & Growth Officer
PRIMARY OBJECTIVES & DAY-TO-DAY FOCUS:
- Campaign acquisition foot traffic (+3.9% walk-ins from Nitro Running Campaign, ₹4.5L spend, 15% discount) vs checkout conversion.
- Full 6-Month Marketing Campaigns tracking (32 campaigns, ₹1.28 Cr spend across Social, In-Store, Email, Influencer, and Local Ads).
- Protecting ROAS by ensuring advertised styles (Marathon Pro, Nitro Speed, Trail Blazer) are in-stock on racks.
- Customer sentiment & reviews (addressing try-on drop-offs and size-fit dissatisfaction).
- Commercial promotional elasticity vs competitor discounts.
TONE: Strategic, growth-oriented, brand & campaign performance focused."""
    else:
        role_profile = """PERSONA: Rahul Sharma — Store Operations Manager
PRIMARY OBJECTIVES & DAY-TO-DAY FOCUS:
- Store floor operations at Indiranagar Flagship (STORE-001).
- Monitoring shoe rack size availability on hero model FW-001 (UK 8 & 9 shortages).
- Managing try-on queues and assigning peak-hour shift runners to fetch sizes.
- Receiving and staging emergency 40-unit replenishment cartons from Pune DC.
- Monitoring real customer feedback in customer reviews (fit complaints and rack availability).
TONE: Action-first, floor-focused, friendly colleague, clear SKU & size quantities."""

    return f"""You are a helpful, friendly AI Copilot from the Shor side team assisting {user_name} ({user_role}) with retail analytics for Puma Footwear.

{role_profile}

Current User: {user_name} ({user_role})
Active Store Scope: {scope_str}

CRITICAL CONVERSATIONAL INSTRUCTIONS:
1. READ THE USER'S QUESTION CAREFULLY AND ANSWER EXACTLY WHAT WAS ASKED:
   - If asked about Marketing Campaigns or Ad Spend, cite specific campaigns from the 32 recorded marketing campaigns (e.g. Nitro Running City Blitz, Monsoon Running EOSS, Independence Freedom Run), their channels (social, email, in-store, influencer, local ads), discount depths (5% to 25%), and spend amounts!
   - If asked about Customer Reviews or Sentiment, cite specific customer reviews, star ratings (avg 4.32/5), sentiment breakdown (168 positive, 32 negative), and the 75%+ spike in fit/size complaints during June stockouts!
   - If {user_name} asks a conversational question (e.g. "What is your name?", "How are you?"), answer THAT question directly and warmly, addressing {user_name} by name.
   - If asked for definitions (e.g. "What is conversion rate?"), explain clearly in plain English with practical retail examples.
   - If {user_name} asks analytical or operational questions, tailor your answer specifically to their persona profile and day-to-day priorities above!
2. SPEAK IN A NATURAL, HUMANIZED TONE:
   - Talk like an expert colleague working on the same team.
   - Use clean markdown, avoid unnecessary asterisks, and keep recommendations actionable.

DATA CONTEXT:
- At STORE-001 (Mumbai Flagship), conversion dropped to 15.8% vs 18.3% target (-24.0% anomaly).
- Foot traffic was stable (14,240 walk-ins), confirming customer purchase intent was healthy (+3.9% lift driven by Nitro Running City Blitz campaign).
- Causal root cause: Core size stockout on FW-001 Marathon Pro in UK 8 & 9 (0 on-hand vs 185 deficit, driving ₹13.4L leakage).
- Customer Reviews: 242 reviews, 31% fit complaints, sharp negative spike during June stockout.
- Prescribed intervention: Dispatch 40 units of UK 8/9 from Pune Central Warehouse.

ACTIVE LEARNING & TEAM FEEDBACK MEMORY:
{active_rules_str}
"""


@copilot_router.post("/chat")
async def chat_with_copilot(req: CopilotChatRequest):
    """
    Direct proxy to OpenAI ChatGPT (gpt-4o-mini) with active learning context injection.
    """
    user_name = req.userName or "Rahul Sharma"
    store = req.currentScope.get("selectedStoreId", "STORE-001") if req.currentScope else "STORE-001"
    last_msg = req.messages[-1].content if req.messages else ""

    conv_reply = handle_conversational_intent(last_msg, user_name, store)
    if conv_reply:
        return {
            "error": False,
            "reply": conv_reply,
            "model": "gpt-4o-mini",
            "activeFeedbackRulesCount": len(ACTIVE_LEARNING_FEEDBACK_STORE),
        }

    system_prompt = build_system_prompt(req.currentScope, req.userRole or "Store Operations Manager", user_name)

    messages = [{"role": "system", "content": system_prompt}]
    for msg in req.messages:
        messages.append({"role": msg.role, "content": msg.content})

    headers = {
        "Authorization": f"Bearer {DEFAULT_OPENAI_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "gpt-4o-mini",
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 800,
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload
            )

            if response.status_code != 200:
                error_detail = response.text
                return {
                    "error": True,
                    "status_code": response.status_code,
                    "message": f"OpenAI API Error: {error_detail}",
                    "reply": f"Hi **{user_name}**, looking at {store}, our main issue is running out of popular sizes UK 8 & 9 in the Marathon Pro shoes. Sending 40 pairs from Pune warehouse will help us recover lost sales quickly."
                }

            data = response.json()
            reply_text = data["choices"][0]["message"]["content"]

            return {
                "error": False,
                "reply": reply_text,
                "model": data.get("model", "gpt-4o-mini"),
                "usage": data.get("usage", {}),
                "activeFeedbackRulesCount": len(ACTIVE_LEARNING_FEEDBACK_STORE),
            }

    except Exception as e:
        return {
            "error": True,
            "message": str(e),
            "reply": f"Hi **{user_name}**, here's what's happening at {store}: sales slipped because popular shoe sizes (UK 8 & 9) ran out on the shelves. Rebalancing 40 pairs from Pune Central will recover our revenue quickly!"
        }


@copilot_router.post("/feedback/submit")
def submit_active_learning_feedback(fb: FeedbackSubmission):
    """
    Submits user/analyst feedback, dynamically logging ground-truth corrections
    and updating the active learning calibration weights in real time.
    """
    feedback_id = f"FB-{len(ACTIVE_LEARNING_FEEDBACK_STORE) + 1:03d}"
    timestamp = datetime.utcnow().isoformat() + "Z"

    rule_text = f"Adjust weight for '{fb.driver}' by {fb.suggestedWeightDelta * 100:.1f}%; ground truth set to '{fb.groundTruthDriver or fb.driver}'."

    record = {
        "id": feedback_id,
        "timestamp": timestamp,
        "driver": fb.driver,
        "storeId": fb.storeId,
        "skuId": fb.skuId or "FW-001",
        "verdict": fb.verdict,
        "analystRole": fb.analystRole,
        "correctionReason": fb.correctionReason,
        "groundTruthDriver": fb.groundTruthDriver or fb.driver,
        "adjustedWeightDelta": fb.suggestedWeightDelta or -0.10,
        "calibrationRule": rule_text,
    }

    ACTIVE_LEARNING_FEEDBACK_STORE.append(record)

    return {
        "status": "CALIBRATED",
        "message": f"Feedback {feedback_id} logged. Active learning memory updated with {len(ACTIVE_LEARNING_FEEDBACK_STORE)} calibration rules.",
        "record": record,
        "totalRules": len(ACTIVE_LEARNING_FEEDBACK_STORE),
    }


@copilot_router.get("/feedback/ledger")
def get_feedback_ledger():
    """
    Returns the complete Active Learning Feedback Ledger & Model Calibration status.
    """
    # Compute calibrated weights
    base_weights = {
        "Core Size-Curve Stockout (UK 8 & 9)": 0.54,
        "Peak Hours Fitting Room Wait Friction": 0.22,
        "Competitor Promotional Price Undercut (-20%)": 0.14,
        "Staff Shift Sizing Guidance Lag": 0.07,
        "Secondary POS Cash Counter Latency": 0.03,
    }

    calibrated_weights = base_weights.copy()
    for fb in ACTIVE_LEARNING_FEEDBACK_STORE:
        drv = fb["driver"]
        if drv in calibrated_weights:
            calibrated_weights[drv] = max(0.0, calibrated_weights[drv] + fb["adjustedWeightDelta"])

    # Normalize weights to sum to 1.0
    total_w = sum(calibrated_weights.values()) or 1.0
    normalized_weights = {k: round(v / total_w, 3) for k, v in calibrated_weights.items()}

    return {
        "totalFeedbackRecords": len(ACTIVE_LEARNING_FEEDBACK_STORE),
        "ledger": ACTIVE_LEARNING_FEEDBACK_STORE,
        "baseWeights": base_weights,
        "calibratedWeights": normalized_weights,
        "calibrationTimestamp": datetime.utcnow().isoformat() + "Z",
    }
