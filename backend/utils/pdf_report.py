from reportlab.pdfgen import canvas
import os

def generate_pdf(data):
    pdf_path = "reports/stroke_report.pdf"
    os.makedirs("reports", exist_ok=True)

    c = canvas.Canvas(pdf_path)
    c.drawString(100, 800, "Stroke Prediction Report")
    
    y = 780
    for key, value in data.items():
        c.drawString(100, y, f"{key}: {value}")
        y -= 20
    
    c.save()
    return pdf_path
