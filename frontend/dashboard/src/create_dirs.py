import os

dirs = [
    "components/layout",
    "components/claim",
    "components/evidence",
    "components/trust",
    "components/system",
    "components/audit",
    "pages"
]

base_path = r"c:\Users\sneha_nqarngz\OneDrive\Desktop\GreenIllusions\frontend\dashboard\src"

for d in dirs:
    path = os.path.join(base_path, d)
    try:
        os.makedirs(path, exist_ok=True)
        print(f"Created: {path}")
    except Exception as e:
        print(f"Error creating {path}: {e}")
