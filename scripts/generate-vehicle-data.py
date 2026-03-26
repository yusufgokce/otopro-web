#!/usr/bin/env python3
"""
Fetches vehicle makes and year-specific models from NHTSA vPIC API.

Output:
  public/data/vehicles/makes.json          - sorted list of curated car makes
  public/data/vehicles/models/{make}.json   - year-indexed models: { "2025": ["Camry", ...], ... }
  public/data/vehicles/meta.json           - years, body styles, colors

Usage:
  python3 scripts/generate-vehicle-data.py
  python3 scripts/generate-vehicle-data.py --years 2025 2024 2023   # specific years only
  python3 scripts/generate-vehicle-data.py --makes Toyota BMW        # specific makes only
"""

import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
import argparse

BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "data", "vehicles")
MODELS_DIR = os.path.join(OUTPUT_DIR, "models")

DELAY = 0.25  # seconds between requests

# Only fetch consumer vehicle types — filters out semis, trailers, buses, incomplete vehicles
VEHICLE_TYPES = ["car", "truck", "multipurpose passenger vehicle (mpv)"]

# Curated list of makes people actually book detailing for.
# This filters out obscure manufacturers (trailers, custom shops, etc.)
CURATED_MAKES = [
    "Acura", "Alfa Romeo", "Aston Martin", "Audi",
    "Bentley", "BMW", "Bugatti", "Buick",
    "Cadillac", "Chevrolet", "Chrysler",
    "Dodge",
    "Ferrari", "Fiat", "Ford",
    "Genesis", "GMC",
    "Honda", "Hyundai",
    "Infiniti",
    "Jaguar", "Jeep",
    "Kia",
    "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Lotus", "Lucid",
    "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "MINI", "Mitsubishi",
    "Nissan",
    "Pagani", "Polestar", "Porsche",
    "RAM", "Rivian", "Rolls-Royce",
    "Saab", "Saturn", "Scion", "Smart", "Subaru", "Suzuki",
    "Tesla", "Toyota",
    "Vinfast", "Volkswagen", "Volvo",
]

YEARS = list(range(2026, 1989, -1))  # 2026 down to 1990


def fetch_json(url, retries=3):
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                return json.loads(resp.read().decode())
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            if attempt < retries - 1:
                print(f"  Retry {attempt + 1}: {e}")
                time.sleep(2)
            else:
                print(f"  FAILED: {url}")
                return None


def slugify(name):
    s = name.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')


def main():
    parser = argparse.ArgumentParser(description="Generate vehicle data from NHTSA")
    parser.add_argument('--years', nargs='+', type=int, help='Specific years to fetch')
    parser.add_argument('--makes', nargs='+', help='Specific makes to fetch')
    args = parser.parse_args()

    os.makedirs(MODELS_DIR, exist_ok=True)

    makes_to_fetch = args.makes if args.makes else CURATED_MAKES
    years_to_fetch = args.years if args.years else YEARS

    total_calls = len(makes_to_fetch) * len(years_to_fetch) * len(VEHICLE_TYPES)
    est_minutes = (total_calls * DELAY) / 60

    print(f"Fetching {len(makes_to_fetch)} makes × {len(years_to_fetch)} years × {len(VEHICLE_TYPES)} vehicle types = {total_calls} API calls")
    print(f"Estimated time: {est_minutes:.1f} minutes")
    print()

    # --- 1. Save makes.json ---
    makes_path = os.path.join(OUTPUT_DIR, "makes.json")
    with open(makes_path, "w") as f:
        json.dump(sorted(CURATED_MAKES), f, separators=(",", ":"))
    print(f"Saved makes.json ({len(CURATED_MAKES)} makes)")

    # --- 2. Fetch year-specific models for each make ---
    failed = []
    for i, make in enumerate(makes_to_fetch):
        slug = slugify(make)
        print(f"\n[{i+1}/{len(makes_to_fetch)}] {make} ({slug})")

        # Load existing data if doing a partial update
        existing_path = os.path.join(MODELS_DIR, f"{slug}.json")
        existing_data = {}
        if os.path.exists(existing_path):
            try:
                with open(existing_path) as f:
                    loaded = json.load(f)
                    if isinstance(loaded, dict):
                        existing_data = loaded
            except Exception:
                pass

        year_models = dict(existing_data)  # preserve existing years not being fetched
        make_failed_years = []

        for year in years_to_fetch:
            encoded = urllib.request.quote(make)
            # Fetch consumer vehicle types only (car, truck, MPV) — excludes semis, trailers, buses
            all_models_for_year = set()
            failed_year = True
            for vtype in VEHICLE_TYPES:
                vtype_encoded = urllib.request.quote(vtype)
                url = f"{BASE_URL}/GetModelsForMakeYear/make/{encoded}/modelyear/{year}/vehicletype/{vtype_encoded}?format=json"
                data = fetch_json(url)
                if data and "Results" in data:
                    failed_year = False
                    for r in data["Results"]:
                        all_models_for_year.add(r["Model_Name"])
                time.sleep(DELAY)

            if not failed_year:
                models = sorted(all_models_for_year)
                if models:
                    year_models[str(year)] = models
                    print(f"  {year}: {len(models)}", end="")
                else:
                    print(f"  {year}: 0", end="")
            else:
                make_failed_years.append(year)
                print(f"  {year}: FAIL", end="")

            sys.stdout.flush()

        print()

        if year_models:
            # Sort by year descending
            sorted_data = dict(sorted(year_models.items(), key=lambda x: int(x[0]), reverse=True))
            with open(existing_path, "w") as f:
                json.dump(sorted_data, f, separators=(",", ":"))
            total_models = len(set(m for models in sorted_data.values() for m in models))
            print(f"  → Saved {slug}.json ({len(sorted_data)} years, {total_models} unique models)")
        else:
            failed.append(make)
            print(f"  → No data for {make}")

        if make_failed_years:
            print(f"  ⚠ Failed years: {make_failed_years}")

    # --- 3. Save meta.json ---
    meta = {
        "years": list(range(2026, 1989, -1)),
        "bodyStyles": [
            "Sedan", "SUV", "Truck", "Coupe", "Hatchback",
            "Convertible", "Van/Minivan", "Wagon", "Crossover",
        ],
        "colors": [
            "Black", "White", "Silver", "Grey", "Red", "Blue",
            "Navy", "Green", "Brown", "Beige/Tan", "Gold",
            "Orange", "Yellow", "Purple", "Burgundy/Maroon", "Other",
        ],
    }
    with open(os.path.join(OUTPUT_DIR, "meta.json"), "w") as f:
        json.dump(meta, f, separators=(",", ":"))

    # --- Summary ---
    print(f"\n{'='*50}")
    print(f"Done! {len(makes_to_fetch)} makes processed.")
    if failed:
        print(f"No data: {', '.join(failed)}")
    print(f"Output: {os.path.abspath(OUTPUT_DIR)}")


if __name__ == "__main__":
    main()
