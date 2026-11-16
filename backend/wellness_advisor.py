import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from seed_data import RESOURCES, GUIDES

env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

api_key = os.getenv("GEMINI_API_KEY", "")

# Build an index of tool slugs and descriptions for the prompt
TOOL_CATALOG_SUMMARY = "\n".join([
    f"- [{r['slug']}] {r['name']} ({r['pricing_type']} | Platforms: {', '.join(r['platforms'])} | Category: {r['category']}): {r['tagline']} Purpose: {r['purpose']}. Official Docs: {r.get('documentation_url')}. Extension/Store Link: {r.get('extension_url')}. Limitations: {r['limitations']}. Privacy: {r['privacy_rating']}."
    for r in RESOURCES
])

GUIDE_SUMMARY = "\n".join([
    f"- [{g['slug']}] {g['title']}: {g['summary']} (Platforms: {', '.join(g['target_platforms'])})"
    for g in GUIDES
])

SYSTEM_INSTRUCTION = f"""
You are the Student Digital Wellness Counselor and Technical Advisor for the Digital Wellness Resource Hub.
Your mission is to help students overcome digital distractions, phone addiction, doomscrolling, late-night sleep disruption, and study procrastination.

You have comprehensive expert knowledge of these 15 verified curated tools:
{TOOL_CATALOG_SUMMARY}

And these 3 practical setup guides:
{GUIDE_SUMMARY}

Guidelines for your responses:
1. RECOMMEND FROM THE 15 PROVIDED TOOLS: Whenever a student describes their situation (e.g. studying, ADHD, YouTube addiction, tight budget, iOS vs Android, browser extensions), analyze their constraints and recommend the best 1 to 3 tools strictly from our curated 15 resources.
2. COMPREHENSIVE TROUBLESHOOTING & HELP FOR ALL 15 TOOLS: You are also the technical support specialist for all 15 tools. If the student asks how to install, configure, troubleshoot, prevent bypassing, or manage permissions (e.g., Apple Screen Time passcodes, Android battery optimization whitelists, browser extension conflict, Cold Turkey frozen mode, f.lux circadian curves, Alarmy captive QR codes), give exact, actionable, step-by-step guidance.
3. DIRECT LINKS & EXTENSIONS: Point students to the official documentation and browser extension store links provided in your catalog so they can install extensions or follow official manuals with zero friction.
4. HONEST PRICING & PRIVACY: Always be completely honest about pricing. Never call a tool free if essential features require payment (e.g. Freedom requires a paid subscription after 7 sessions; Cold Turkey free vs Pro lifetime; One Sec free 1 app vs Pro).
5. LINK TO GUIDES: If their issue matches one of our 3 setup guides (unbreakable-apple-downtime, distraction-free-desktop-station, circadian-bedtime-wind-down), reference and link to it.
6. FORMATTING: Use clean, empathetic, markdown-formatted text with bold headings and bullet points. Keep it concise, practical, and encouragement-focused.

You MUST respond strictly in valid JSON format with this exact structure:
{{
  "reply": "Your markdown formatted advice to the student...",
  "recommended_tools": [
    {{
      "slug": "slug-of-the-tool",
      "name": "Tool Name",
      "pricing_type": "Freemium / 100% Free / Paid",
      "category": "focus_blocker / screen_time / bedtime_routine / privacy_safety / browser_extension",
      "reason": "One sentence explaining why this matches their specific need."
    }}
  ],
  "relevant_guide_slug": "slug-of-guide-or-null"
}}
"""

class WellnessAdvisor:
    def __init__(self):
        self.client = genai.Client(api_key=api_key) if api_key else None

    async def get_advice(self, user_message: str, history: list = None, preferred_platform: str = None) -> dict:
        context_query = user_message
        if preferred_platform and preferred_platform.lower() != "all":
            context_query += f" (Platform: {preferred_platform})"

        if not self.client:
            return self._fallback_rule_based_response(context_query)

        # Assemble prompt with conversation history
        prompt_parts = []
        if history:
            for msg in history[-6:]:  # Keep recent turns
                role = "User" if msg.role == "user" else "Advisor"
                prompt_parts.append(f"{role}: {msg.content}")

        prompt_parts.append(f"Student: {context_query}")
        user_prompt = "\n".join(prompt_parts)

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    temperature=0.4,
                    response_mime_type="application/json"
                )
            )

            text = response.text.strip()
            return json.loads(text)
        except Exception as e:
            # Fallback to gemini-1.5-flash
            try:
                response = self.client.models.generate_content(
                    model="gemini-1.5-flash",
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_INSTRUCTION,
                        temperature=0.4,
                        response_mime_type="application/json"
                    )
                )
                text = response.text.strip()
                return json.loads(text)
            except Exception as fallback_e:
                print(f"[WellnessAdvisor Error]: {fallback_e}")
                return self._fallback_rule_based_response(context_query)

    def _fallback_rule_based_response(self, query: str) -> dict:
        q_lower = query.lower()
        matched_tools = []
        guide_slug = None

        if "youtube" in q_lower or "shorts" in q_lower or "video" in q_lower:
            matched_tools.append({
                "slug": "unhook",
                "name": "Unhook",
                "pricing_type": "100% Free",
                "category": "browser_extension",
                "reason": "Completely hides YouTube Shorts, recommendations, and feeds while keeping video search intact."
            })
            guide_slug = "distraction-free-desktop-station"

        if "iphone" in q_lower or "ios" in q_lower or "apple" in q_lower or "mac" in q_lower or "bypass" in q_lower:
            matched_tools.append({
                "slug": "one-sec",
                "name": "One Sec",
                "pricing_type": "Freemium",
                "category": "screen_time",
                "reason": "Adds intentional breathing friction before opening dopamine apps on iOS."
            })
            matched_tools.append({
                "slug": "opal",
                "name": "Opal",
                "pricing_type": "Freemium",
                "category": "screen_time",
                "reason": "Deep Focus mode blocks apps using Apple Screen Time APIs with high bypass resistance."
            })
            guide_slug = "unbreakable-apple-downtime"

        if "sleep" in q_lower or "night" in q_lower or "bed" in q_lower or "alarm" in q_lower:
            matched_tools.append({
                "slug": "sleep-as-android-apple-sleep",
                "name": "Sleep as Android & Apple Sleep",
                "pricing_type": "Freemium",
                "category": "bedtime_routine",
                "reason": "Automates bedtime wind-down and forces captive QR-code alarms to get you out of bed."
            })
            guide_slug = "circadian-bedtime-wind-down"

        if "strict" in q_lower or "exam" in q_lower or "study" in q_lower or "pc" in q_lower or "windows" in q_lower:
            matched_tools.append({
                "slug": "cold-turkey-blocker",
                "name": "Cold Turkey Blocker",
                "pricing_type": "Freemium",
                "category": "focus_blocker",
                "reason": "Kernel-level desktop blocker that cannot be terminated or bypassed during study sprints."
            })
            guide_slug = "distraction-free-desktop-station"

        if not matched_tools:
            matched_tools.append({
                "slug": "cold-turkey-blocker",
                "name": "Cold Turkey Blocker",
                "pricing_type": "Freemium",
                "category": "focus_blocker",
                "reason": "Highest bypass resistance for deep study on computers."
            })
            matched_tools.append({
                "slug": "one-sec",
                "name": "One Sec",
                "pricing_type": "Freemium",
                "category": "screen_time",
                "reason": "Mindful pause before opening addictive apps."
            })

        reply = (
            f"Here is practical advice for your wellness inquiry regarding **'{query}'**:\n\n"
            f"- **Core Recommendation**: Focus on friction and environment design rather than willpower alone.\n"
            f"- **Next Steps**: Review the recommended tools below. Check device compatibility and review the setup guides to lock in bypass-resistant habits."
        )

        return {
            "reply": reply,
            "recommended_tools": matched_tools[:3],
            "relevant_guide_slug": guide_slug
        }

wellness_advisor = WellnessAdvisor()
