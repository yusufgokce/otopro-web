#!/usr/bin/env python3
"""
Fetches vehicle makes and models from NHTSA vPIC API and generates static JSON files.

Output:
  public/data/vehicles/makes.json        - sorted list of all car makes
  public/data/vehicles/models/{make}.json - sorted list of all models for each make
  public/data/vehicles/meta.json          - years, body styles, colors
"""

import json
import os
import re
import sys
import time
import urllib.request
import urllib.error

BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "data", "vehicles")
MODELS_DIR = os.path.join(OUTPUT_DIR, "models")

# Throttle between requests to be respectful to the API
DELAY = 0.3  # seconds


def fetch_json(url, retries=3):
    """Fetch JSON from URL with retry logic."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                return json.loads(resp.read().decode())
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            if attempt < retries - 1:
                print(f"  Retry {attempt + 1} for {url}: {e}")
                time.sleep(2)
            else:
                print(f"  FAILED after {retries} attempts: {url}")
                return None


def slugify(name):
    """Convert make name to a safe filename slug."""
    s = name.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')
    return s


def title_case_make(name):
    """Normalize make name to title case with common exceptions."""
    upper_names = {"BMW", "GMC", "RAM", "MINI"}
    if name.upper() in upper_names:
        return name.upper()
    return name.title()


def main():
    os.makedirs(MODELS_DIR, exist_ok=True)

    # --- 1. Fetch all makes for passenger cars ---
    print("Fetching all car makes...")
    data = fetch_json(f"{BASE_URL}/GetMakesForVehicleType/car?format=json")
    if not data:
        print("Failed to fetch makes. Exiting.")
        sys.exit(1)

    # Also fetch truck/SUV makes to be comprehensive
    print("Fetching truck/SUV makes...")
    truck_data = fetch_json(f"{BASE_URL}/GetMakesForVehicleType/truck?format=json")
    mpv_data = fetch_json(f"{BASE_URL}/GetMakesForVehicleType/{urllib.request.quote('multipurpose passenger vehicle (mpv)')}?format=json")

    # Combine and deduplicate
    all_makes = {}
    for source in [data, truck_data, mpv_data]:
        if source and "Results" in source:
            for r in source["Results"]:
                make_id = r["MakeId"]
                make_name = title_case_make(r["MakeName"])
                all_makes[make_id] = make_name

    # Filter to well-known makes (skip obscure ones with no models anyone would book a detail for)
    makes_list = sorted(set(all_makes.values()))
    print(f"Total unique makes: {len(makes_list)}")

    # Save makes
    with open(os.path.join(OUTPUT_DIR, "makes.json"), "w") as f:
        json.dump(makes_list, f, separators=(",", ":"))
    print(f"Saved makes.json ({len(makes_list)} makes)")

    # --- 2. Fetch models for each make ---
    print(f"\nFetching models for {len(makes_list)} makes...")
    failed = []
    for i, make in enumerate(makes_list):
        slug = slugify(make)
        print(f"  [{i+1}/{len(makes_list)}] {make} ({slug})...", end=" ", flush=True)

        url = f"{BASE_URL}/GetModelsForMake/{urllib.request.quote(make)}?format=json"
        model_data = fetch_json(url)

        if model_data and "Results" in model_data:
            models = sorted(set(r["Model_Name"] for r in model_data["Results"]))
            with open(os.path.join(MODELS_DIR, f"{slug}.json"), "w") as f:
                json.dump(models, f, separators=(",", ":"))
            print(f"{len(models)} models")
        else:
            failed.append(make)
            print("FAILED")

        time.sleep(DELAY)

    # --- 3. Generate meta.json (years, body styles, colors) ---
    meta = {
        "years": list(range(2026, 1989, -1)),  # 2026 down to 1990
        "bodyStyles": [
            "Sedan",
            "SUV",
            "Truck",
            "Coupe",
            "Hatchback",
            "Convertible",
            "Van/Minivan",
            "Wagon",
            "Crossover",
        ],
        "colors": [
            "Black",
            "White",
            "Silver",
            "Grey",
            "Red",
            "Blue",
            "Navy",
            "Green",
            "Brown",
            "Beige/Tan",
            "Gold",
            "Orange",
            "Yellow",
            "Purple",
            "Burgundy/Maroon",
            "Other",
        ],
    }

    with open(os.path.join(OUTPUT_DIR, "meta.json"), "w") as f:
        json.dump(meta, f, separators=(",", ":"))
    print(f"\nSaved meta.json")

    # --- Summary ---
    print(f"\n{'='*50}")
    print(f"Done! {len(makes_list)} makes, {len(makes_list) - len(failed)} models files generated.")
    if failed:
        print(f"Failed makes ({len(failed)}): {', '.join(failed)}")
    print(f"Output: {os.path.abspath(OUTPUT_DIR)}")


if __name__ == "__main__":
    main()
