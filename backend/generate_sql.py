import json
import os
from seed_data import RESOURCES, GUIDES

output_path = os.path.join(os.path.dirname(__file__), "supabase_seed.sql")

with open(output_path, "w", encoding="utf-8") as f:
    f.write("-- =========================================================\n")
    f.write("-- Supabase Seed Data for Digital Wellness Resource Hub\n")
    f.write("-- Paste and run this script in the Supabase SQL Editor.\n")
    f.write("-- =========================================================\n\n")
    
    f.write("DELETE FROM wellness_resources;\n")
    f.write("DELETE FROM setup_guides;\n\n")
    
    for r in RESOURCES:
        name = r["name"].replace("'", "''")
        slug = r["slug"].replace("'", "''")
        tagline = (r["tagline"] or "").replace("'", "''")
        desc = r["description"].replace("'", "''")
        cat = r["category"].replace("'", "''")
        dev = (r["developer_or_team"] or "").replace("'", "''")
        off_url = (r["official_url"] or "").replace("'", "''")
        rep_url = f"'{r['repository_url']}'" if r["repository_url"] else "NULL"
        platforms = json.dumps(r["platforms"]).replace("'", "''")
        pricing_type = r["pricing_type"].replace("'", "''")
        price_details = r["price_details"].replace("'", "''")
        purpose = r["purpose"].replace("'", "''")
        privacy_rating = r["privacy_rating"].replace("'", "''")
        privacy_details = r["privacy_details"].replace("'", "''")
        accessibility = r["accessibility_features"].replace("'", "''")
        limitations = r["limitations"].replace("'", "''")
        verified_date = r["verified_date"].replace("'", "''")
        student_rating = r["student_rating"]
        
        f.write(
            f"INSERT INTO wellness_resources (slug, name, tagline, description, category, developer_or_team, official_url, repository_url, platforms, pricing_type, price_details, purpose, privacy_rating, privacy_details, accessibility_features, limitations, verified_date, student_rating) VALUES ('{slug}', '{name}', '{tagline}', '{desc}', '{cat}', '{dev}', '{off_url}', {rep_url}, '{platforms}'::jsonb, '{pricing_type}', '{price_details}', '{purpose}', '{privacy_rating}', '{privacy_details}', '{accessibility}', '{limitations}', '{verified_date}', {student_rating});\n"
        )
        
    f.write("\n\n")
    for g in GUIDES:
        slug = g["slug"].replace("'", "''")
        title = g["title"].replace("'", "''")
        summary = g["summary"].replace("'", "''")
        category = g["category"].replace("'", "''")
        platforms = json.dumps(g["target_platforms"]).replace("'", "''")
        est_min = g["estimated_minutes"]
        diff = g["difficulty"].replace("'", "''")
        steps = json.dumps(g["steps"]).replace("'", "''")
        takeaways = json.dumps(g["key_takeaways"]).replace("'", "''")
        
        f.write(
            f"INSERT INTO setup_guides (slug, title, summary, category, target_platforms, estimated_minutes, difficulty, steps, key_takeaways) VALUES ('{slug}', '{title}', '{summary}', '{category}', '{platforms}'::jsonb, {est_min}, '{diff}', '{steps}'::jsonb, '{takeaways}'::jsonb);\n"
        )

print("Generated supabase_seed.sql successfully!")
