export const generateHTMLReport = (scanData: any) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            color: #1C1C1E;
            padding: 40px;
            background: white;
          }
          
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #0066CC;
            padding-bottom: 20px;
          }
          
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #0066CC;
            margin-bottom: 8px;
          }
          
          .subtitle {
            font-size: 14px;
            color: #8E8E93;
          }
          
          .report-title {
            font-size: 24px;
            font-weight: bold;
            margin: 30px 0 20px 0;
            color: #0066CC;
          }
          
          .info-section {
            background: #F5F5F7;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 24px;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #E5E5EA;
          }
          
          .info-row:last-child {
            border-bottom: none;
          }
          
          .info-label {
            font-weight: 600;
            color: #636366;
            font-size: 14px;
          }
          
          .info-value {
            font-weight: bold;
            color: #1C1C1E;
            font-size: 14px;
          }
          
          .prediction-box {
            background: ${scanData.prediction.includes("Pneumonia") ? "#FFEBEE" : "#E8F5E9"};
            border: 2px solid ${scanData.prediction.includes("Pneumonia") ? "#D32F2F" : "#4CAF50"};
            padding: 24px;
            border-radius: 12px;
            text-align: center;
            margin: 24px 0;
          }
          
          .prediction-label {
            font-size: 18px;
            font-weight: bold;
            color: ${scanData.prediction.includes("Pneumonia") ? "#D32F2F" : "#4CAF50"};
            margin-bottom: 12px;
          }
          
          .confidence-text {
            font-size: 32px;
            font-weight: bold;
            color: #1C1C1E;
          }
          
          .confidence-label {
            font-size: 14px;
            color: #636366;
            margin-top: 8px;
          }
          
          .images-section {
            margin: 32px 0;
          }
          
          .image-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 16px;
          }
          
          .image-container {
            text-align: center;
          }
          
          .image-title {
            font-size: 14px;
            font-weight: 600;
            color: #636366;
            margin-bottom: 12px;
          }
          
          .xray-image {
            width: 100%;
            height: auto;
            border-radius: 8px;
            border: 2px solid #E5E5EA;
          }
          
          .disclaimer {
            background: #FFF3CD;
            border: 2px solid #FFE69C;
            padding: 20px;
            border-radius: 8px;
            margin: 32px 0;
          }
          
          .disclaimer-title {
            font-weight: bold;
            color: #856404;
            margin-bottom: 12px;
            font-size: 16px;
          }
          
          .disclaimer-text {
            color: #856404;
            font-size: 13px;
            line-height: 1.6;
          }
          
          .notes-section {
            margin: 24px 0;
          }
          
          .notes-title {
            font-size: 16px;
            font-weight: bold;
            color: #1C1C1E;
            margin-bottom: 12px;
          }
          
          .notes-content {
            background: #F9FAFB;
            padding: 16px;
            border-radius: 10px;
            color: #111827;
            line-height: 1.6;
            font-size: 14px;
            border: 1px solid #E5E7EB;
          }
          
          .footer {
            margin-top: 48px;
            text-align: center;
            padding-top: 24px;
            border-top: 2px solid #E5E7EB;
            color: #6B7280;
            font-size: 12px;
          }
          
          .signature-section {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #E5E7EB;
          }
          
          .signature-line {
            margin-top: 40px;
            border-top: 2px solid #111827;
            width: 300px;
            padding-top: 8px;
            text-align: center;
          }
          
          @media print {
            body {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🫁 PneumoScan AI</div>
          <div class="subtitle">AI-Powered Pneumonia Detection System</div>
        </div>

        <h1 class="report-title">Medical Diagnostic Report</h1>

        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Scan ID:</span>
            <span class="info-value">${scanData.id}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Patient ID:</span>
            <span class="info-value">${scanData.patientId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Patient Name:</span>
            <span class="info-value">${scanData.patientName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Age:</span>
            <span class="info-value">${scanData.age} years</span>
          </div>
          <div class="info-row">
            <span class="info-label">Sex:</span>
            <span class="info-value">${scanData.sex}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Scan Date:</span>
            <span class="info-value">${scanData.scanDate}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Analyzed By:</span>
            <span class="info-value">${scanData.technician}</span>
          </div>
        </div>

        <div class="prediction-box">
          <div class="prediction-label">${scanData.prediction}</div>
          <div class="confidence-text">${scanData.confidence}%</div>
          <div class="confidence-label">Confidence Score</div>
        </div>

        <div class="images-section">
          <h2 class="report-title">Medical Images</h2>
          <div class="image-grid">
            <div class="image-container">
              <div class="image-title">Original Chest X-Ray</div>
              <img src="${scanData.imageUri}" alt="Chest X-Ray" class="xray-image" />
            </div>
            <div class="image-container">
              <div class="image-title">AI Heatmap Analysis</div>
              <img src="${scanData.heatmapUri}" alt="Heatmap" class="xray-image" />
            </div>
          </div>
        </div>

        <div class="notes-section">
          <div class="notes-title">Clinical Notes</div>
          <div class="notes-content">${scanData.notes}</div>
        </div>

        <div class="disclaimer">
          <div class="disclaimer-title">⚠️ Important Medical Disclaimer</div>
          <div class="disclaimer-text">
            This report is generated by an AI-powered diagnostic assistance tool and should NOT be used as the sole basis for medical diagnosis or treatment decisions. 
            The results must be reviewed and validated by a qualified healthcare professional. 
            This system is intended to assist medical professionals and should not replace clinical judgment. 
            Always consult with a licensed physician for proper medical evaluation and treatment.
          </div>
        </div>

        <div class="signature-section">
          <div class="info-row">
            <span class="info-label">Report Generated:</span>
            <span class="info-value">${new Date().toLocaleString()}</span>
          </div>
          <div class="signature-line">
            <div style="font-size: 12px; color: #636366;">Authorized Medical Professional Signature</div>
          </div>
        </div>

        <div class="footer">
          <p>PneumoScan AI - Advanced Medical Imaging Analysis System</p>
          <p>© 2024 All Rights Reserved | For Medical Professional Use Only</p>
        </div>
      </body>
    </html>
  `;
};
