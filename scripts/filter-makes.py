#!/usr/bin/env python3
"""
Filters makes.json down to consumer vehicle makes only.
Removes commercial trucks, fire engines, sweepers, bus manufacturers, etc.
"""

import json
import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "data", "vehicles")
MODELS_DIR = os.path.join(OUTPUT_DIR, "models")

# Consumer vehicle makes that people actually drive and would book a detail for
CONSUMER_MAKES = sorted([
    "Acura", "Alfa Romeo", "Aston Martin", "Audi",
    "Bentley", "BMW", "Bugatti", "Buick",
    "Cadillac", "Chevrolet", "Chrysler",
    "Daewoo", "Daihatsu", "Datsun", "Delorean", "Dodge",
    "Eagle",
    "Ferrari", "Fiat", "Fisker", "Ford",
    "Genesis", "Geo", "GMC",
    "Honda", "Hummer", "Hyundai",
    "Ineos", "Infiniti", "Isuzu",
    "Jaguar", "Jeep",
    "Karma", "Kia", "Koenigsegg",
    "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Lotus", "Lucid",
    "Maserati", "Maybach", "Mazda", "Mclaren", "Mercedes-Benz", "Mercury",
    "Merkur", "MINI", "Mitsubishi",
    "Nissan",
    "Oldsmobile", "Opel",
    "Pagani", "Plymouth", "Polestar", "Pontiac", "Porsche",
    "RAM", "Renault", "Rimac", "Rivian", "Rolls-Royce",
    "Saab", "Saturn", "Scout", "Shelby", "Smart", "Subaru", "Suzuki",
    "Tesla", "Toyota", "Triumph",
    "Vinfast", "Volkswagen", "Volvo",
    "Yugo",
    "Zeekr",
])

def main():
    # Overwrite makes.json with filtered list
    with open(os.path.join(OUTPUT_DIR, "makes.json"), "w") as f:
        json.dump(CONSUMER_MAKES, f, separators=(",", ":"))

    print(f"Filtered to {len(CONSUMER_MAKES)} consumer makes (from 400)")

    # Remove model files for non-consumer makes
    import re
    def slugify(name):
        s = name.lower().strip()
        s = re.sub(r'[^a-z0-9]+', '-', s)
        return s.strip('-')

    keep_slugs = set(slugify(m) for m in CONSUMER_MAKES)
    removed = 0
    for f in os.listdir(MODELS_DIR):
        if f.endswith(".json"):
            slug = f[:-5]
            if slug not in keep_slugs:
                os.remove(os.path.join(MODELS_DIR, f))
                removed += 1

    print(f"Removed {removed} non-consumer model files")
    print(f"Kept {len(keep_slugs)} model files")

if __name__ == "__main__":
    main()
