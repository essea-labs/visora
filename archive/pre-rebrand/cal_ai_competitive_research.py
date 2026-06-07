from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable
)

OUTPUT_PATH = "/Users/shellena/Documents/Essea Labs/Cal_AI_Competitive_Research.pdf"

doc = SimpleDocTemplate(
    OUTPUT_PATH,
    pagesize=letter,
    topMargin=0.7 * inch,
    bottomMargin=0.7 * inch,
    leftMargin=0.75 * inch,
    rightMargin=0.75 * inch,
)

styles = getSampleStyleSheet()

# Custom styles
styles.add(ParagraphStyle(
    'DocTitle', parent=styles['Title'],
    fontSize=24, leading=30, textColor=HexColor('#1a1a2e'),
    spaceAfter=4, alignment=TA_CENTER, fontName='Helvetica-Bold'
))
styles.add(ParagraphStyle(
    'Subtitle', parent=styles['Normal'],
    fontSize=11, leading=14, textColor=HexColor('#666666'),
    spaceAfter=20, alignment=TA_CENTER, fontName='Helvetica'
))
styles.add(ParagraphStyle(
    'SectionHead', parent=styles['Heading1'],
    fontSize=16, leading=20, textColor=HexColor('#1a1a2e'),
    spaceBefore=18, spaceAfter=8, fontName='Helvetica-Bold'
))
styles.add(ParagraphStyle(
    'SubHead', parent=styles['Heading2'],
    fontSize=12, leading=16, textColor=HexColor('#2d2d44'),
    spaceBefore=12, spaceAfter=6, fontName='Helvetica-Bold'
))
styles.add(ParagraphStyle(
    'Body', parent=styles['Normal'],
    fontSize=9.5, leading=13, textColor=HexColor('#333333'),
    spaceAfter=6, fontName='Helvetica'
))
styles.add(ParagraphStyle(
    'BulletItem', parent=styles['Normal'],
    fontSize=9.5, leading=13, textColor=HexColor('#333333'),
    spaceAfter=3, fontName='Helvetica', leftIndent=18, bulletIndent=6
))
styles.add(ParagraphStyle(
    'Citation', parent=styles['Normal'],
    fontSize=7.5, leading=10, textColor=HexColor('#888888'),
    spaceAfter=6, fontName='Helvetica-Oblique', leftIndent=4
))
styles.add(ParagraphStyle(
    'SmallNote', parent=styles['Normal'],
    fontSize=8, leading=10, textColor=HexColor('#999999'),
    spaceAfter=4, fontName='Helvetica-Oblique'
))

story = []

# ── Helpers ──
def heading(text):
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1, color=HexColor('#e0e0e0')))
    story.append(Spacer(1, 2))
    story.append(Paragraph(text, styles['SectionHead']))

def subheading(text):
    story.append(Paragraph(text, styles['SubHead']))

def body(text):
    story.append(Paragraph(text, styles['Body']))

def bullet(text):
    story.append(Paragraph(text, styles['BulletItem'], bulletText='\u2022'))

def cite(text):
    story.append(Paragraph(text, styles['Citation']))

def spacer(h=6):
    story.append(Spacer(1, h))

def make_table(headers, rows, col_widths=None):
    data = [headers] + rows
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8.5),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 8.5),
        ('LEADING', (0, 0), (-1, -1), 12),
        ('BACKGROUND', (0, 1), (-1, -1), HexColor('#f8f8fa')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [HexColor('#f8f8fa'), white]),
        ('GRID', (0, 0), (-1, -1), 0.5, HexColor('#dddddd')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t)
    spacer(8)


# ═══════════════════════════════════════════════════════════
# PAGE 1 — TITLE + OVERVIEW
# ═══════════════════════════════════════════════════════════

story.append(Spacer(1, 40))
story.append(Paragraph("Cal AI", styles['DocTitle']))
story.append(Paragraph("Competitive Research &amp; Go-to-Market Breakdown", styles['Subtitle']))
story.append(Paragraph("April 2026", styles['SmallNote']))
story.append(Spacer(1, 20))

heading("Company Snapshot")

make_table(
    ['Metric', 'Value'],
    [
        ['Founded', 'May 2024 by Zach Yadegari, Henry Langmack, Blake Anderson & Jake Castillo'],
        ['Product', 'AI photo-based calorie tracker ("snap a photo, get calories")'],
        ['Downloads', '15M+'],
        ['Revenue', '$40M trailing 12 months (Yadegari to Inc.); on track for $50M through 2026'],
        ['Time to $1M MRR', '~6 months (Nov 2024)'],
        ['Team Size', '7 employees + contractors; ~30 total including contractors at acquisition'],
        ['Monthly Ad Spend', '~$770K (Meta + TikTok) as of Sep 2025'],
        ['Funding', 'Bootstrapped ($100K+ personal capital, zero VC)'],
        ['Exit', 'Acquired by MyFitnessPal, Dec 2025 (announced March 2026)'],
        ['App Rating', '4.8 stars (iOS & Android), ~141K total reviews across both stores'],
    ],
    col_widths=[1.8 * inch, 5.0 * inch]
)

cite("Sources: Co-founders \u2014 TechCrunch Mar 2025. Downloads \u2014 TechCrunch Mar 2026. Revenue \u2014 Inc. Mar 2026 ($40M), "
     "Yadegari projection ($50M). $1M MRR \u2014 Getlatka. Team \u2014 TechCrunch Mar 2026 (7 employees), Inc. Mar 2026 (~30 people). "
     "Ad spend \u2014 CNBC Sep 2025. Funding \u2014 Getlatka ($0 funding); $100K from TotallyScience sale (TechCrunch Mar 2025). "
     "Acquisition \u2014 TechCrunch Mar 2026. Rating \u2014 TechCrunch Mar 2025 (66K iOS + 75K Android reviews). "
     "Note: TechCrunch/MFP cited $30M+ annual revenue vs. Yadegari's $40M to Inc. \u2014 discrepancy may reflect gross vs. net of app store fees.")

body("Cal AI eliminated the #1 friction point in calorie tracking: manual food logging. "
     "The core UX\u2014snap a photo, get instant calorie/macro breakdown\u2014is inherently viral because "
     "it's visual, demonstrable in 10 seconds, and perfect for short-form video.")

# ═══════════════════════════════════════════════════════════
# REVENUE TRAJECTORY
# ═══════════════════════════════════════════════════════════

heading("Revenue Trajectory")

make_table(
    ['Timeline', 'Revenue', 'Key Driver'],
    [
        ['Month 1 (May 2024)', '$28K+', 'First revenue from app launch'],
        ['Month 2 (Jun 2024)', '$115K', 'Organic TikTok growth'],
        ['Month 4 (Aug 2024)', '$1M cumulative', 'Organic TikTok at scale'],
        ['Month 6 (Nov 2024)', '$1M/month MRR', 'Influencer machine kicks in'],
        ['Month 8 (Jan 2025)', '$2M+/month', 'Influencer + early paid ads'],
        ['Month 12 (Apr 2025)', '~$2.9M/month', 'Paid ads scaling ($770K/mo spend)'],
    ],
    col_widths=[1.8 * inch, 1.5 * inch, 3.5 * inch]
)

cite("Sources: Month 1-2 revenue \u2014 CNBC Sep 2025 (\"more than $28,000\" and \"$115,000\"). "
     "Month 4 \u2014 Getlatka growth table; corroborated by Zach Yadegari on X. "
     "Month 6 $1M MRR \u2014 Getlatka (Nov 2024). Month 8 $2M+ \u2014 Getlatka (Jan 2025). "
     "Month 12 $2.9M \u2014 Getlatka (Apr 2025).")

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════
# PAGE 2 — GTM PLAYBOOK
# ═══════════════════════════════════════════════════════════

heading("Go-to-Market Playbook")

subheading("Phase 0: Validation ($2K Test Run)")
body("Before scaling anything, the founders spent $2,000 on a social media marketing test run to validate "
     "that the product resonated and that paid distribution could work. The positive response gave them confidence "
     "to fund Cal AI's operating and marketing costs for six months until app store payments caught up.")
cite("Source: CNBC Make It, Sep 2025 \u2014 cnbc.com/2025/09/06/cal-ai-how-a-teenage-ceo-built-a-fast-growing-calorie-tracking-app")
spacer(6)

# Phase 1
subheading("Phase 1: Organic TikTok (Months 1\u20134)")
body("Launched 12+ branded TikTok accounts simultaneously, posted 1,000+ videos, "
     "accumulated 10.2M total views. Hit 100K downloads and $1M cumulative revenue.")
cite("Source: TikTok account/video/view stats \u2014 Grow with Plutus analysis (growwithplutus.com/blog/cal-ai-app-tiktok-strategy). "
     "These are third-party tallies, not Cal AI's own reporting. "
     "Downloads/revenue \u2014 What A Startup Substack; corroborated by Zach Yadegari on X (Sep 2024).")
spacer(4)

bullet("<b>Multi-account strategy:</b> 12+ accounts with different personalities (founder-led, creator-led, faceless, numbered clones)")
bullet("<b>Content production:</b> Source Pinterest images, design in Figma, write captions, batch-distribute.")
bullet("<b>Top formats:</b> App scan demos (the \"magic moment\"), founder talking head, \"is Cal AI accurate?\" testing videos, \"what I eat in a day\" integrations, faceless text-overlay features")
bullet("<b>Rationale:</b> Each account = separate algorithmic entry point. A/B test formats without risking the main brand. No single point of failure.")
cite("Source: Account breakdown and content strategy \u2014 Grow with Plutus; Social Growth Engineers (socialgrowthengineers.com)")
spacer(4)

make_table(
    ['Account', 'Videos', 'Views', 'Content Type'],
    [
        ['@getcalai', '281', '2.1M', 'Founder talking head, app demos (top video: 5.2M)'],
        ['@cal_ai_', '137', '7.5M', 'Creator-led, reactions, demos (highest engagement)'],
        ['@try.cal.ai', '60', '1.1M', 'Mixed demo content'],
        ['@calai.track', '176', '54.7K', 'Reposts, mixed content'],
        ['@calai.app', '\u2014', '89.2K likes', 'Primary surviving account post-acquisition'],
        ['@cal.ai1/3/4', 'Various', 'Various', 'Numbered clone accounts for volume testing'],
        ['@calai_arleth', '\u2014', '4.6K likes', 'Creator-branded (creator name appended)'],
        ['@trycalai', '\u2014', '2.5K likes', 'Food carousels, app demos'],
    ],
    col_widths=[1.3 * inch, 0.7 * inch, 1.0 * inch, 3.8 * inch]
)

body("<i>Note: Most accounts were deleted or wiped post-acquisition by MyFitnessPal (Dec 2025). "
     "Stats are from Grow with Plutus analysis captured pre-acquisition.</i>")

spacer(6)

# Phase 2
subheading("Phase 2: Micro-Influencer Machine (Months 5\u20137)")
body("Systematized influencer outreach using 20+ virtual assistants (via Founders Arm). "
     "Scaled to 150 influencers posting regularly, hitting $1M MRR around Month 6. "
     "Influencer alone drove revenue to ~$2M/month before plateauing.")
cite("Source: 20+ VAs and 150 influencers \u2014 Founders Arm case study (foundersarm.com/success-stories/cal-ai). "
     "150 influencers by end of 2024 \u2014 Koerner newsletter. "
     "$2M/month plateau \u2014 Yuanchang blog (yuanchang.org/en/posts/zach-yadegari-cal-ai-50m-exit/).")
spacer(4)

bullet("<b>$5 CPM benchmark:</b> Every deal evaluated against ~$5/1,000 expected views. Influencer averaging 100K views = $500 flat fee per video.")
cite("Source: $5 CPM \u2014 Koerner newsletter and Shortimize analysis. Note: this is a third-party estimate, not a direct founder quote.")
bullet("<b>Targeting:</b> Micro-influencers (10K\u2013200K followers) in fitness, wellness, nutrition, self-improvement. Used profilepl.us to estimate views before committing.")
bullet("<b>Outreach cadence:</b> 4-step follow-up (Day 1, 4, 7, 10). Personalized DMs + emails via pre-approved scripts. Tracked in Airtable.")
cite("Source: 4-step cadence \u2014 Founders Arm success stories page.")
bullet("<b>Creative freedom:</b> Influencers retain full control. Only ask: show the \"magic moment\" (phone pointed at food, instant calories).")
bullet("<b>Compensation:</b> Flat fee (CPM-based) + referral codes. Commission reported at 30% recurring per PartnerStack listing (not confirmed by Cal AI directly).")
bullet("<b>Scale:</b> 250+ exclusive partnerships over time (Zach, CEO Insider interview). 20+ VAs with documented SOPs for sourcing, outreach, tracking, contracts, analytics.")
cite("Source: 250+ partnerships \u2014 CEO Insider interview (ceoinsider.io/interview/zach-yadegari). Timeline for 250+ not specified in interview.")

spacer(6)

# Phase 3
subheading("Phase 3: Paid Acquisition (Months 8\u201312)")
body("Used thousands of winning influencer videos as templates for paid ad creative. "
     "Organic content validated formats; paid scaled what already worked.")
cite("Source: Koerner newsletter (newsletter.chrisjkoerner.com/p/1m-month-by-month-7-fed4).")
spacer(4)

make_table(
    ['Timeline', 'Ad Spend', 'Source'],
    [
        ['Pre-launch', '$2,000 test run', 'CNBC Sep 2025'],
        ['Month 8 (Dec 2024)', '~$7,000/day ($210K/month)', 'Koerner newsletter'],
        ['Month 12 (Sep 2025)', '~$770K/month', 'CNBC Sep 2025 (documents reviewed)'],
        ['Month 20 (Jan 2026)', '$1M+/month', 'Yuanchang blog'],
    ],
    col_widths=[1.8 * inch, 2.5 * inch, 2.5 * inch]
)

bullet("<b>Platforms:</b> Meta (Facebook + Instagram) and TikTok")
bullet("<b>Creative:</b> UGC-style short-form video replicating winning influencer formats. Capture attention within 3 seconds, keep under 30 seconds.")
bullet("<b>Apple Search Ads:</b> Bid on competitor keywords (e.g., \"MyFitnessPal\"). Described by Koerner as a PMF validator.")
cite("Source: Apple Search Ads \u2014 Koerner newsletter. Term \"conquest bidding\" is editorial; Koerner describes the practice without that label.")
bullet("<b>MrBeast sponsorship:</b> Six-figure deal via personal connection. Zach acknowledged it would have returned more in performance ads.")
cite("Source: MrBeast deal \u2014 Yuanchang blog; confirmed by Zach on X (@zach_yadegari).")

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════
# PAGE 3 — PR + CONVERSION FUNNEL
# ═══════════════════════════════════════════════════════════

# Phase 4
subheading("Phase 4: Earned Media / PR")
body("The teen founder narrative was deliberately cultivated as a distribution channel, "
     "generating significant earned media value.")
spacer(4)

make_table(
    ['Story Angle', 'Coverage', 'Source'],
    [
        ['\"17-year-old builds $30M app\"', 'TechCrunch, CNBC, Entrepreneur', 'Multiple outlets, 2025'],
        ['\"Rejected by 15 colleges, 4.0 GPA, 34 ACT\"', 'TechCrunch (went viral)', 'TechCrunch Apr 2025'],
        ['\"CEO lifestyle\" personal content', 'Zach\'s social media', 'X/TikTok/@zach_yadegari'],
        ['MyFitnessPal acquisition', 'TechCrunch, Inc, GlobeNewsWire', 'TechCrunch/Inc Mar 2026'],
        ['Forbes 30 Under 30 (Food & Drink, 2026)', 'Forbes', 'Forbes, confirmed via LinkedIn'],
    ],
    col_widths=[2.2 * inch, 2.2 * inch, 2.4 * inch]
)

heading("The Conversion Funnel")

subheading("25-Step Onboarding \u2192 Hard Paywall")
body("Uses a \"Yes Ladder\" technique\u2014each low-friction question builds psychological "
     "investment before the payment ask. By the time users see the paywall, they've spent "
     "2\u20133 minutes building \"their\" personalized plan.")
cite("Source: 25-step count \u2014 ScreensDesign product teardown (screensdesign.com/showcase/cal-ai-calorie-tracker). "
     "Flow details also documented on Mobbin.")
spacer(4)

bullet("<b>Steps 1\u20136:</b> Demo video, then deep personalization (gender, workout frequency, weight, goals)")
bullet("<b>Step 7:</b> Goal validation: \"Your target is realistic\" \u2014 builds trust and confidence")
bullet("<b>Step 8:</b> Projected progress graph (future-self visualization)")
bullet("<b>Steps 9\u201311:</b> More personalization + social proof (testimonials)")
bullet("<b>Step 12:</b> App Store rating prompt BEFORE the paywall (captures reviews from invested, positive users)")
bullet("<b>Steps 13\u201325:</b> AI-generated personalized plan with editable metrics, additional customization")
bullet("<b>Paywall:</b> Hard paywall blocking all core features. 3-day free trial with payment upfront.")

spacer(6)

subheading("Paywall Mechanics")
bullet("<b>Hard paywall:</b> No free version of AI photo scanning. Free tier = manual logging only.")
bullet("<b>Dynamic pricing:</b> $2.99/week to $29.99/year (range may extend to $49.99/year in some regions). "
       "Varies by geography, device, and onboarding responses.")
cite("Source: Pricing \u2014 NutriScan blog, Eesel AI blog. Zach stated \"$30/year\" and \"$10/month\" (CEO Insider interview). "
     "Dynamic pricing confirmed by multiple user reports showing different prices.")
bullet("<b>Pricing hidden:</b> Only visible after completing the full 25-step onboarding.")
bullet("<b>Decline-triggered discount:</b> Some users report a lower \"special offer\" if they initially reject the paywall.")
cite("Source: User anecdotes and LinkedIn analysis by Leonid Yuriev. Not confirmed by Cal AI directly.")
bullet("<b>Day 2 cancellation reminder:</b> Displayed prominently to reduce friction/fear around the trial.")
bullet("<b>A/B testing:</b> Confirmed on Adapty (per Adapty's own paywall library). Also featured in Superwall's blog analysis, "
       "though Superwall partnership not definitively confirmed.")
cite("Source: Adapty \u2014 adapty.io/paywall-library/cal-ai-food-calorie-tracker/. "
     "Superwall \u2014 superwall.com/blog/5-paywall-patterns-used-by-million-dollar-apps/ (analysis, not confirmed partnership).")
bullet("<b>Revenue split:</b> ~$1M/month iOS MRR, ~$90K/month Android MRR.")
cite("Source: Grow with Plutus (Sensor Tower estimates). Note: earlier version of this report stated $2M iOS \u2014 "
     "corrected per Plutus source which specifies $1M iOS.")

heading("Retention &amp; Growth Loops")
bullet("<b>Multi-modal logging:</b> Photo, barcode, search, manual\u2014reduce friction everywhere")
bullet("<b>Dashboard:</b> Prioritizes remaining calories (creates urgency/engagement)")
bullet("<b>Quick re-log:</b> Recently eaten items for fast repeat logging")
bullet("<b>Progress visualization:</b> Weekly analytics, BMI tracking, motivational framing")
cite("Source: App features \u2014 ScreensDesign teardown; App Store listing.")
bullet("<b>In-app referral:</b> Referrers earn cash incentive, referred users get 20% off")
cite("Source: Referral program \u2014 ScreensDesign teardown. 20% discount \u2014 widely documented referral codes on TikTok. "
     "Exact cash amount for referrers not publicly disclosed.")
bullet("<b>30% user retention rate:</b> Described as rare in health tech category.")
cite("Source: AiBase (aibase.com/news/16317); also referenced in Threads/@strategyskool.")

story.append(PageBreak())

# ═══════════════════════════════════════════════════════════
# PAGE 4 — KEY SUCCESS FACTORS + COMPETITIVE LANDSCAPE
# ═══════════════════════════════════════════════════════════

heading("Key Success Factors")

body("<b>1. The product is the ad.</b> Photo \u2192 calories is visual, demonstrable in 10 seconds, "
     "and perfect for short-form video. The core UX loop doubles as compelling ad creative.")
body("<b>2. Volume over perfection.</b> 12 TikTok accounts, 1,000+ videos, 150+ influencers. "
     "Systematic brute-force discovery rather than waiting for a single viral hit.")
body("<b>3. Operationalized influencer outreach.</b> Not ad-hoc. A machine: VAs, Airtable tracking, "
     "follow-up cadences, ~$5 CPM benchmarks. Influencer marketing treated like a paid acquisition channel.")
body("<b>4. Organic validated, then paid scaled.</b> Organic TikTok proved formats and PMF first. "
     "Then ~$770K/month poured into what was already working.")
body("<b>5. The founder story as marketing.</b> Teen CEO, college rejections, lifestyle content\u2014"
     "every milestone generated free press worth significant earned media.")
body("<b>6. Controversy helps.</b> \"Is Cal AI a scam?\" and accuracy debate videos drove "
     "curiosity and downloads. Negative UGC = free awareness.")
body("<b>7. Small, bootstrapped, fast.</b> 7 employees + contractors, no VC, no board meetings. "
     "Moved faster than incumbents and kept margins high.")

heading("Competitive Landscape")

make_table(
    ['App', 'Method', 'Pricing', 'Differentiator'],
    [
        ['Cal AI', 'AI photo recognition', 'Dynamic ($3\u2013$30/yr)', 'Speed & simplicity (3-second logging)'],
        ['MyFitnessPal', 'Manual database (20M+ foods)', 'Freemium (~$80/yr)', '280M members, largest food database'],
        ['Noom', 'Psychology-based coaching', '~$60/mo', '67-step onboarding quiz, 940+ concurrent Meta ads'],
        ['Lose It!', 'Manual database', 'Freemium (~$40/yr)', 'Budget-friendly, simple'],
        ['MacroFactor', 'Manual (research-grade DB)', '~$72/yr', 'Adaptive algorithm, extensive micronutrient tracking'],
    ],
    col_widths=[1.2 * inch, 1.8 * inch, 1.8 * inch, 2.0 * inch]
)

cite("Sources: MFP 280M members, 20M+ food DB \u2014 MFP press release Feb 2026 (GlobeNewsWire). "
     "Noom 940 ads \u2014 Growth Models (growthmodels.co/noom-marketing/). "
     "Noom 67-step quiz \u2014 Retention Blog. "
     "MacroFactor \u2014 macrofactor.com (\"extensive micronutrient tracking\" \u2014 specific nutrient count not independently verified).")

body("Cal AI's positioning advantage: the scanning demo creates a natural \"wow moment\" that competitors "
     "cannot replicate in short-form video. Manual-entry apps cannot produce the same 10-second hook.")

heading("Full Source List")

story.append(Paragraph(
    "<b>Primary sources (founder statements / major press):</b><br/>"
    "TechCrunch, Mar 16 2025 \u2014 \"Photo calorie app Cal AI...built by two teenagers\"<br/>"
    "TechCrunch, Apr 3 2025 \u2014 \"Teen with 4.0 GPA...rejected by 15 top universities\"<br/>"
    "TechCrunch, Mar 2 2026 \u2014 \"MyFitnessPal has acquired Cal AI\"<br/>"
    "CNBC Make It, Sep 6 2025 \u2014 \"18-year-old CEO...a $1.4 million-a-month AI app\"<br/>"
    "Inc., Mar 2 2026 \u2014 \"He built an AI app in high school, made $40M\"<br/>"
    "CEO Insider \u2014 Interview with Zach Yadegari (ceoinsider.io/interview/zach-yadegari)<br/>"
    "Getlatka \u2014 Cal AI company profile (getlatka.com/companies/calai.app)<br/>"
    "Zach Yadegari on X \u2014 @zach_yadegari revenue milestones",
    styles['SmallNote']
))
spacer(4)
story.append(Paragraph(
    "<b>Third-party analyses (not founder-confirmed):</b><br/>"
    "Grow with Plutus \u2014 TikTok multi-account analysis (growwithplutus.com/blog/cal-ai-app-tiktok-strategy)<br/>"
    "Social Growth Engineers \u2014 Multi-account strategy (socialgrowthengineers.com)<br/>"
    "Koerner Newsletter \u2014 Growth breakdown (newsletter.chrisjkoerner.com/p/1m-month-by-month-7-fed4)<br/>"
    "Shortimize \u2014 Marketing strategies analysis (shortimize.com)<br/>"
    "Founders Arm \u2014 Case study and success story (foundersarm.com)<br/>"
    "Yuanchang Blog \u2014 $50M ARR and exit analysis (yuanchang.org)<br/>"
    "What A Startup \u2014 Bootstrapped growth story (whatastartup.substack.com)<br/>"
    "ScreensDesign \u2014 App UI/onboarding teardown (screensdesign.com/showcase/cal-ai-calorie-tracker)<br/>"
    "Adapty \u2014 Paywall library showcase (adapty.io/paywall-library/cal-ai-food-calorie-tracker/)<br/>"
    "NutriScan \u2014 Pricing analysis (nutriscan.app)<br/>"
    "AiBase \u2014 Retention data (aibase.com/news/16317)",
    styles['SmallNote']
))

# Build
doc.build(story)
print(f"PDF saved to: {OUTPUT_PATH}")
