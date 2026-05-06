"""Canonical bundle definitions for The STR Ledger.

Source of truth: copy/bundle-strategy.md (decisions locked 2026-05-02).

Each bundle entry is consumed by:
- _build_bundles.py — produces ZIPs, merged howto PDF, readme PDF
- manifest_check.py extension — verifies bundle artifacts exist
- (Future) Etsy / Gumroad publish scripts — bundle SKU creation

When SKU prices change, update price_per_sku here AND the corresponding
landing/Etsy listing copy. The bundle price ($97 / $147 / $397 etc.) is
the user-facing anchor; à la carte sums in landing copy must match
this dict.
"""

# Map SKU code → (dir_name, full_name, individual_price)
# Pulled from copy/bundle-strategy.md à la carte table.
SKU_PRICES = {
    # Launch + Wave 2
    "GST-001": ("GST-001-welcome-book",                "Welcome Book",                          17),
    "OPS-001": ("OPS-001-turnover-checklist",          "Cleaner Turnover Checklist",            12),
    "TAX-001": ("TAX-001-mileage-log",                 "STR Mileage Log",                       17),
    "TAX-002": ("TAX-002-pl-single-property",          "Single-Property P&L Tracker",           47),
    "TAX-003": ("TAX-003-1099-nec-tracker",            "1099-NEC Contractor Tracker",           17),
    # Phase 2
    "ACQ-001": ("ACQ-001-str-deal-analyzer",           "STR Deal Analyzer (Full)",              47),
    "ACQ-002": ("ACQ-002-cost-to-launch",              "Cost-to-Launch Calculator",             27),
    "ACQ-003": ("ACQ-003-rental-arbitrage-analyzer",   "Rental Arbitrage Analyzer",             47),
    "FIN-001": ("FIN-001-revpar-dashboard",            "RevPAR Dashboard",                      67),
    "MKT-001": ("MKT-001-listing-seo-audit",           "Listing SEO Audit",                     47),
    "REV-001": ("REV-001-cleaning-fee-optimizer",      "Cleaning Fee Optimizer",                37),
    "STR-001": ("STR-001-escape-the-w2-planner",       "Escape the W2 Planner",                 47),
    # TAX block
    "TAX-004": ("TAX-004-schedule-e-tax-prep",         "Schedule E Tax-Prep Workbook",          47),
    "TAX-011": ("TAX-011-multi-property-master-pl",    "Multi-Property Master P&L",             97),
    # Phase 3
    "OPS-002": ("OPS-002-damage-claim-aircover-log",   "Damage Claim + AirCover Log",           37),
    "OPS-003": ("OPS-003-license-permit-tracker",      "License/Permit Tracker",                47),
    # Phase 6
    "FIN-002": ("FIN-002-break-even-occupancy",        "Break-Even Occupancy",                  17),
    # Phase 5
    "PAM-001": ("PAM-001-owner-reporting-dashboard",   "Owner Reporting Dashboard",            197),
}


BUNDLES = [
    {
        "code": "BUNDLE-01",
        "slug": "first-year-host",
        "name": "First-Year Host Bundle",
        "tagline": "Underwrite the deal. Budget the launch. Get the permit. Know your floor.",
        "price": 97,
        "skus": ["ACQ-001", "ACQ-002", "OPS-003", "FIN-002"],
        "surprise_sku": "OPS-003",
        "etsy_eligible": True,
    },
    {
        "code": "BUNDLE-02",
        "slug": "aspiring-host",
        "name": "Aspiring Host Bundle",
        "tagline": "Run the timeline. Run the deal. Run the budget. Run the no-money-down option.",
        "price": 97,
        "skus": ["STR-001", "ACQ-001", "ACQ-002", "ACQ-003"],
        "surprise_sku": "ACQ-003",
        "etsy_eligible": True,
    },
    {
        "code": "BUNDLE-03",
        "slug": "year-2-operator",
        "name": "Year-2 Operator Bundle",
        "tagline": "Stop guessing at occupancy, fees, and listing optimization.",
        "price": 147,
        "skus": ["FIN-001", "REV-001", "MKT-001", "OPS-002"],
        "surprise_sku": "OPS-002",
        "etsy_eligible": True,
    },
    {
        "code": "BUNDLE-04",
        "slug": "portfolio",
        "name": "Portfolio Bundle",
        "tagline": "Fourteen workbooks. The full operating system for a multi-property STR portfolio.",
        "price": 397,
        # 10 core + 4 prior-catalog SKUs (TAX-002, TAX-004, GST-001, OPS-001)
        "skus": [
            "TAX-011", "FIN-001", "ACQ-001", "OPS-002", "OPS-003",
            "REV-001", "MKT-001", "FIN-002", "ACQ-002", "STR-001",
            "TAX-002", "TAX-004", "GST-001", "OPS-001",
        ],
        "surprise_sku": None,
        "etsy_eligible": False,  # premium tier — own-site only
    },
    {
        "code": "BUNDLE-05",
        "slug": "pro-manager",
        "name": "Pro Manager Bundle",
        "tagline": "Seven workbooks. The owner-facing reporting layer plus the operating math underneath.",
        "price": 497,  # launch price; rises to 797 once 3 future B2B SKUs ship
        "skus": [
            "PAM-001", "TAX-011", "FIN-001", "OPS-002",
            "OPS-003", "MKT-001", "REV-001",
        ],
        "surprise_sku": None,
        "etsy_eligible": False,  # B2B premium tier — own-site only
        "future_price": 797,
        "future_skus_to_add": [
            "Cleaner CRM ($97)",
            "Co-Host Commission Splitter ($67)",
            "Maintenance Workflow ($67)",
        ],
    },
]


def alacarte_total(bundle: dict) -> int:
    """Sum of individual prices for the bundle's SKUs."""
    return sum(SKU_PRICES[sku][2] for sku in bundle["skus"])


def savings(bundle: dict) -> tuple[int, float]:
    """Return (dollar_savings, percent_savings)."""
    total = alacarte_total(bundle)
    return total - bundle["price"], (1 - bundle["price"] / total) * 100 if total else 0


if __name__ == "__main__":
    print("Bundle integrity check:")
    for b in BUNDLES:
        a = alacarte_total(b)
        d, p = savings(b)
        print(f"  {b['code']} {b['name']:30s}  "
              f"${b['price']:4} bundled  vs  ${a:4} a-la-carte  "
              f"= save ${d:3} ({p:.0f}%)  · {len(b['skus'])} SKUs")
