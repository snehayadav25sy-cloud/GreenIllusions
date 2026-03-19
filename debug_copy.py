import shutil
import os
import sys

src = r"C:\Users\sneha_nqarngz\.gemini\antigravity\brain\a069edca-60d4-4a9d-b38c-c606594a933b\glowing_green_globe_logo_1769631762529.png"
dst = r"c:\Users\sneha_nqarngz\OneDrive\Desktop\GreenIllusions\frontend\dashboard\public\logo_globe.png"

print(f"--- DEBUG COPY ---")
print(f"Source: {src}")
print(f"Dest: {dst}")

if not os.path.exists(src):
    print("ERROR: Source file does not exist!")
    # Check what IS there
    folder = os.path.dirname(src)
    print(f"Listing source folder {folder}:")
    try:
        print(os.listdir(folder)[:5])
    except Exception as e:
        print(f"Cannot list src folder: {e}")
    sys.exit(1)

try:
    shutil.copy2(src, dst)
    print("shutil.copy2 completed.")
    if os.path.exists(dst):
        print(f"SUCCESS: File exists at dest. Size: {os.path.getsize(dst)} bytes")
    else:
        print("ERROR: File NOT found at dest after copy call (unknown reason).")
except Exception as e:
    print(f"EXCEPTION during copy: {e}")
