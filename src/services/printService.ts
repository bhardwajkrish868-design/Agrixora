/**
 * AgriXora Targeted Document Print & PDF Service
 * Prints ONLY the specific targeted element (e.g. LOI Certificate or DPR Dossier)
 * without background webpage, navbars, sidebars, or modal overlays.
 */

export const printTargetElement = (elementId: string, documentTitle: string = 'AgriXora_Official_Document') => {
  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    window.print();
    return;
  }

  // Create an isolated, hidden iframe for clean printing
  let printIframe = document.getElementById('agrixora-print-frame') as HTMLIFrameElement | null;
  if (printIframe) {
    document.body.removeChild(printIframe);
  }

  printIframe = document.createElement('iframe');
  printIframe.id = 'agrixora-print-frame';
  printIframe.style.position = 'fixed';
  printIframe.style.right = '0';
  printIframe.style.bottom = '0';
  printIframe.style.width = '0';
  printIframe.style.height = '0';
  printIframe.style.border = '0';
  document.body.appendChild(printIframe);

  const doc = printIframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Build high-fidelity standalone A4 document with sharp styles
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${documentTitle}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 15mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 10.5pt;
            line-height: 1.5;
          }
          .no-print, button, .modal-close-btn {
            display: none !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 6px 10px;
            text-align: left;
            font-size: 10pt;
          }
          th {
            background-color: #f1f5f9;
            font-weight: 700;
          }
          .border-b-2 { border-bottom: 2px solid #0f172a; }
          .border-b { border-bottom: 1px solid #e2e8f0; }
          .border-t { border-top: 1px solid #e2e8f0; }
          .border { border: 1px solid #cbd5e1; }
          .rounded-xl { border-radius: 12px; }
          .rounded-2xl { border-radius: 16px; }
          .rounded-3xl { border-radius: 20px; }
          .p-2 { padding: 8px; }
          .p-3 { padding: 12px; }
          .p-4 { padding: 16px; }
          .p-5 { padding: 20px; }
          .p-6 { padding: 24px; }
          .pb-2 { padding-bottom: 8px; }
          .pb-4 { padding-bottom: 16px; }
          .pb-6 { padding-bottom: 24px; }
          .pt-2 { padding-top: 8px; }
          .pt-3 { padding-top: 12px; }
          .pt-4 { padding-top: 16px; }
          .pt-6 { padding-top: 24px; }
          .mt-1 { margin-top: 4px; }
          .mt-2 { margin-top: 8px; }
          .mt-4 { margin-top: 16px; }
          .mb-1 { margin-bottom: 4px; }
          .mb-2 { margin-bottom: 8px; }
          .mb-4 { margin-bottom: 16px; }
          .bg-emerald-50 { background-color: #ecfdf5 !important; }
          .bg-emerald-100 { background-color: #d1fae5 !important; }
          .bg-amber-50 { background-color: #fffbeb !important; }
          .bg-amber-100 { background-color: #fef3c7 !important; }
          .bg-slate-50 { background-color: #f8fafc !important; }
          .bg-slate-100 { background-color: #f1f5f9 !important; }
          .bg-slate-900, .bg-slate-950 { background-color: #ffffff !important; color: #0f172a !important; }
          .text-emerald-700, .text-emerald-800, .text-emerald-900 { color: #065f46 !important; font-weight: 700; }
          .text-amber-800, .text-amber-900 { color: #78350f !important; }
          .text-slate-500 { color: #64748b !important; }
          .text-slate-600 { color: #475569 !important; }
          .text-slate-700 { color: #334155 !important; }
          .text-slate-800, .text-slate-900, .text-slate-950 { color: #0f172a !important; font-weight: 700; }
          .text-teal-800 { color: #115e59 !important; }
          .font-bold { font-weight: 700; }
          .font-extrabold { font-weight: 800; }
          .font-black { font-weight: 900; }
          .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-[10px] { font-size: 8.5pt; }
          .text-[11px] { font-size: 9.5pt; }
          .text-xs { font-size: 9.5pt; }
          .text-sm { font-size: 10.5pt; }
          .text-base { font-size: 12pt; }
          .text-lg { font-size: 13.5pt; }
          .text-xl { font-size: 15pt; }
          .text-2xl { font-size: 18pt; }
          .text-3xl { font-size: 22pt; }
          .uppercase { text-transform: uppercase; }
          .tracking-wider { letter-spacing: 0.05em; }
          .tracking-widest { letter-spacing: 0.1em; }
          .leading-snug { line-height: 1.35; }
          .leading-relaxed { line-height: 1.6; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
          .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
          .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .justify-between { justify-content: space-between; }
          .justify-center { justify-content: center; }
          .items-center { align-items: center; }
          .items-start { align-items: flex-start; }
          .items-end { align-items: flex-end; }
          .gap-1 { gap: 4px; }
          .gap-2 { gap: 8px; }
          .gap-3 { gap: 12px; }
          .gap-4 { gap: 16px; }
          .space-y-1 > * + * { margin-top: 4px; }
          .space-y-2 > * + * { margin-top: 8px; }
          .space-y-3 > * + * { margin-top: 12px; }
          .space-y-4 > * + * { margin-top: 16px; }
          .space-y-6 > * + * { margin-top: 24px; }
          .space-y-8 > * + * { margin-top: 32px; }
          .break-inside-avoid, section, table, tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        </style>
      </head>
      <body>
        ${targetElement.innerHTML}
      </body>
    </html>
  `);
  doc.close();

  // Trigger print cleanly
  setTimeout(() => {
    printIframe?.contentWindow?.focus();
    printIframe?.contentWindow?.print();
  }, 250);
};
