import json

with open('d:/SoleSight/frontend/src/data/parsed_campaigns.json', 'r') as f:
    campaigns = json.load(f)

with open('d:/SoleSight/frontend/src/data/parsed_reviews.json', 'r') as f:
    reviews = json.load(f)

# Read existing excelDataset.ts up to FACT_CAMPAIGNS_DATASET
with open('d:/SoleSight/frontend/src/data/excelDataset.ts', 'r') as f:
    content = f.read()

# Find the start of FACT_CAMPAIGNS_DATASET
idx = content.find('export const FACT_CAMPAIGNS_DATASET')
if idx != -1:
    header = content[:idx]
else:
    header = content

# Generate new datasets content
camp_ts = "export const FACT_CAMPAIGNS_DATASET: FactCampaignRecord[] = " + json.dumps(campaigns, indent=2) + ";\n\n"
rev_ts = "export const FACT_REVIEWS_DATASET: FactReviewRecord[] = " + json.dumps(reviews, indent=2) + ";\n\n"

# Helper accessor
footer = """// Helper getters for synthetic data tables
export function getFactCampaigns(): FactCampaignRecord[] {
  return FACT_CAMPAIGNS_DATASET;
}

export function getFactReviews(): FactReviewRecord[] {
  return FACT_REVIEWS_DATASET;
}
"""

new_content = header + camp_ts + rev_ts + footer

with open('d:/SoleSight/frontend/src/data/excelDataset.ts', 'w') as f:
    f.write(new_content)

print(f"Successfully updated excelDataset.ts with {len(campaigns)} campaigns and {len(reviews)} reviews.")
