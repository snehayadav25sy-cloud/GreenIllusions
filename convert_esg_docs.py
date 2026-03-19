import os
import fitz  # PyMuPDF
from bs4 import BeautifulSoup

input_folder = "data/esg_pdf"     # <-- updated path
output_folder = "data/esg_docs"   # <-- updated path

os.makedirs(output_folder, exist_ok=True)

def pdf_to_text(pdf_path, txt_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)

def html_to_text(html_path, txt_path):
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
    text = soup.get_text(separator="\n")
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)

# Loop through files in esg_pdf
for file in os.listdir(input_folder):
    file_path = os.path.join(input_folder, file)
    base_name, ext = os.path.splitext(file)

    if ext.lower() == ".pdf":
        txt_path = os.path.join(output_folder, base_name + ".txt")
        pdf_to_text(file_path, txt_path)
        print(f"Converted PDF: {file} -> {txt_path}")

    elif ext.lower() in [".html", ".htm"]:
        txt_path = os.path.join(output_folder, base_name + ".txt")
        html_to_text(file_path, txt_path)
        print(f"Converted HTML: {file} -> {txt_path}")
