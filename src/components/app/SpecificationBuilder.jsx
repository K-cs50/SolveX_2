import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  Printer,
  Trash2,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Wrench,
  AlertTriangle,
  Sparkles,
  Search,
  CheckSquare,
  Square,
  FileCheck
} from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { STANDARDS_DATABASE } from '../../services/standardsDatabase';
import { Modal } from '../common/Modal';

export default function SpecificationBuilder({
  selectedStandards = [],
  onRemoveStandard,
  activeTender,
  onShowToast,
  onAddStandard
}) {
  // Structured Specification Fields per Section 37
  const [productService, setProductService] = useState(
    activeTender ? activeTender.category : "High Density Polyethylene (HDPE) Piping Network for Potable Water Infrastructure"
  );
  const [procurementRequirement, setProcurementRequirement] = useState(
    activeTender ? activeTender.description : "Supply, factory testing, site delivery, trench laying, butt fusion jointing and commissioning of pressure pipes and sluice valves."
  );
  const [technicalParameters, setTechnicalParameters] = useState(
    "1. Material Grade: Virgin PE 100 polymer, MRS 10.0 MPa\n2. Pressure Class: PN 10 (1.0 MPa at 20°C)\n3. Nominal Diameter: DN 90mm, DN 110mm, DN 160mm, DN 200mm\n4. OIT: Minimum 20 minutes at 200°C"
  );
  const [testingRequirements, setTestingRequirements] = useState(
    "Factory testing: Hydrostatic internal pressure test for 100 hours at 20°C per relevant IS clause. Carbon black content between 2.0% and 2.5% uniformly dispersed. Melt flow rate verified per standard procedure."
  );
  const [safetyRequirements, setSafetyRequirements] = useState(
    "Potability & Toxicological Suitability: Non-leaching of toxic constituents and heavy metals into conveyed drinking water per IS 10500 baseline limits. Toxicological test certificate mandatory."
  );
  const [installationRequirements, setInstallationRequirements] = useState(
    "Trench preparation with minimum 1.0m earth cover. Butt fusion welding adhering to automated temperature-pressure cycles. Gaskets conforming to synthetic elastomer standards."
  );
  const [certificationCompliance, setCertificationCompliance] = useState(
    "Mandatory BIS ISI Mark under Quality Control Order (QCO). Test reports from NABL accredited laboratory. Legible rolling/embossed identification mark every 1 metre."
  );
  const [notes, setNotes] = useState(
    "Pre-dispatch inspection by third-party agency (TPIA) appointed by client. Test certificates must accompany each dispatch batch."
  );

  // Modal States
  const [isAddStandardModalOpen, setIsAddStandardModalOpen] = useState(false);
  const [standardSearchText, setStandardSearchText] = useState('');
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  // Compliance Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Valid BIS Standard Mark (ISI / CRS) license verified against Bureau of Indian Standards database", checked: true },
    { id: 2, text: "Manufacturer Test Certificates (MTC) for raw materials (chemical + mechanical) attached to each consignment", checked: true },
    { id: 3, text: "Third-party pre-dispatch inspection (TPIA) protocols agreed and embedded in special contract terms", checked: true },
    { id: 4, text: "Independent test reports from NABL-accredited or Central government laboratory (CPRI/ERDA/CIPET) verified", checked: false },
    { id: 5, text: "Central Ministry Quality Control Order (QCO) gazette compliance confirmed", checked: true }
  ]);

  const toggleChecklistItem = (id) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Auto-generate testing and safety clauses from currently attached standards
  const handleAutoGenerateClauses = () => {
    if (selectedStandards.length === 0) {
      if (onShowToast) onShowToast("No standards selected to generate clauses from.", "warning");
      return;
    }

    const testClauses = selectedStandards.flatMap(s => s.test_methods || []).map(tm =>
      `• ${tm.clause} (${tm.title}): ${tm.description}`
    ).join('\n');

    const safetyClauses = selectedStandards.map(s => s.safety_information).filter(Boolean).map(si =>
      `• ${si.clause} (${si.title}): ${si.description}`
    ).join('\n');

    const certClauses = selectedStandards.map(s => s.certification_information).filter(Boolean).map(ci =>
      `• ${ci.scheme}: ${ci.mandatory_status}. (${ci.verification_note})`
    ).join('\n');

    if (testClauses) setTestingRequirements(testClauses);
    if (safetyClauses) setSafetyRequirements(safetyClauses);
    if (certClauses) setCertificationCompliance(certClauses);

    if (onShowToast) onShowToast("Testing, safety, and certification clauses updated from selected standards.", "success");
  };

  // Generate complete Markdown text for export
  const generateMarkdown = () => {
    return `# TECHNICAL PROCUREMENT SPECIFICATION SCHEDULE
**Generated via SolveX — Indian Standards Intelligence Platform**
**Date:** ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}

---

### 1. PRODUCT / SERVICE CLASSIFICATION
${productService}

### 2. PROCUREMENT REQUIREMENT & SCOPE
${procurementRequirement}

### 3. TECHNICAL PARAMETERS & MATERIAL ATTRIBUTES
${technicalParameters}

### 4. APPLICABLE INDIAN STANDARDS (MANDATORY & NORMATIVE)
${selectedStandards.length > 0 ? selectedStandards.map((s, idx) => `
${idx + 1}. **${s.standard_number}** — ${s.title}
   - **Status:** ${s.status} (${s.current_version})
   - **Scope Reference:** ${s.scope}
   - **Key Test Method:** ${s.test_methods?.[0]?.clause || 'Clause 1'}: ${s.test_methods?.[0]?.title || 'Standard Procedure'}
   - **Normative References:** ${s.normative_references?.map(n => n.standard_number).join(', ') || 'None specified'}
`).join('\n') : "*(No Indian Standards selected yet. Add standards from the Analysis workspace.)*"}

### 5. TESTING & QUALITY ASSURANCE REQUIREMENTS
${testingRequirements}

### 6. SAFETY & TOXICOLOGICAL CRITERIA
${safetyRequirements}

### 7. INSTALLATION & WORKMANSHIP CODES
${installationRequirements}

### 8. STATUTORY CERTIFICATION & COMPLIANCE MANDATES
${certificationCompliance}

### 9. GENERAL NOTES & SPECIAL TENDER CONDITIONS
${notes}

---
### 10. COMPLIANCE VERIFICATION CHECKLIST
${checklist.map(c => `- [${c.checked ? 'x' : ' '}] ${c.text}`).join('\n')}

---
*Notice: Drafted for institutional tender documentation. Technical parameters must be cross-verified against official gazetted publications of the Bureau of Indian Standards (BIS).*
`;
  };

  // Copy to clipboard
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    if (onShowToast) onShowToast("Specification schedule copied to clipboard in Markdown format.", "success");
  };

  // Download Markdown file
  const handleDownloadMarkdown = () => {
    const text = generateMarkdown();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Tender_Specification_Schedule_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onShowToast) onShowToast("Tender specification downloaded successfully.", "success");
  };

  // Download HTML file for direct printing or opening in Word
  const handleDownloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tender Specification Schedule</title>
  <style>
    body { font-family: 'Times New Roman', serif; line-height: 1.5; color: #111; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    h1 { font-size: 18pt; text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; }
    h2 { font-size: 13pt; margin-top: 24px; border-bottom: 1px solid #666; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 10pt; }
    th, td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
    th { background: #eee; }
    .mono { font-family: monospace; }
  </style>
</head>
<body>
  <h1>GOVERNMENT OF INDIA / PUBLIC SECTOR ENTERPRISE<br><span style="font-size: 13pt; font-weight: normal;">Schedule of Technical Requirements and Standards Compliance</span></h1>
  <p><strong>Item:</strong> ${productService}</p>
  <p><strong>Scope:</strong> ${procurementRequirement}</p>
  
  <h2>1. Technical Parameters</h2>
  <pre style="font-family: inherit; white-space: pre-wrap;">${technicalParameters}</pre>

  <h2>2. Mandated Indian Standards</h2>
  <table>
    <thead><tr><th>Standard No.</th><th>Title</th><th>Edition / Version</th><th>Statutory Scheme</th></tr></thead>
    <tbody>
      ${selectedStandards.map(s => `<tr><td class="mono"><strong>${s.standard_number}</strong></td><td>${s.title}</td><td>${s.current_version}</td><td>${s.certification_information?.scheme || 'BIS'}</td></tr>`).join('')}
    </tbody>
  </table>

  <h2>3. Testing & Inspection Requirements</h2>
  <p>${testingRequirements.replace(/\n/g, '<br>')}</p>

  <h2>4. Safety & Compliance Mandates</h2>
  <p>${safetyRequirements.replace(/\n/g, '<br>')}</p>
  <p>${certificationCompliance.replace(/\n/g, '<br>')}</p>

  <p style="margin-top: 40px; font-size: 9pt; border-top: 1px solid #ccc; padding-top: 8px;">Generated by SolveX Standards Intelligence. Specifications subject to Gazette validation.</p>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Tender_Specification_Schedule_${Date.now()}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onShowToast) onShowToast("HTML printable tender schedule downloaded.", "success");
  };

  // Download JSON schema
  const handleDownloadJSON = () => {
    const payload = {
      generator: "SolveX Indian Standards Intelligence",
      generated_at: new Date().toISOString(),
      productService,
      procurementRequirement,
      technicalParameters,
      applicableStandards: selectedStandards,
      testingRequirements,
      safetyRequirements,
      installationRequirements,
      certificationCompliance,
      checklist,
      notes
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Specification_Schema_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onShowToast) onShowToast("JSON specification schema downloaded.", "success");
  };

  // Filter standards for Add Standard Modal
  const availableStandardsToAdd = STANDARDS_DATABASE.filter(s => {
    const query = standardSearchText.toLowerCase();
    const alreadySelected = selectedStandards.some(sel => sel.standard_id === s.standard_id);
    if (alreadySelected) return false;
    if (!query) return true;
    return s.standard_number.toLowerCase().includes(query) || s.title.toLowerCase().includes(query);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Controls Header */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--slate-200)',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--gov-navy-950)', fontWeight: '600' }}>
            Procurement Specification Builder
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Assemble validated Indian Standards, testing norms, and certification mandates into an export-ready tender specification schedule.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={handleAutoGenerateClauses} className="btn btn-outline btn-sm" title="Populate testing & safety clauses directly from selected standards">
            <Sparkles size={14} />
            Auto-Sync Clauses
          </button>
          <button onClick={() => setIsPrintPreviewOpen(true)} className="btn btn-secondary btn-sm">
            <Printer size={14} />
            Print Preview
          </button>
          <button onClick={handleCopyMarkdown} className="btn btn-secondary btn-sm">
            <Copy size={14} />
            Copy Markdown
          </button>
          <button onClick={handleDownloadHTML} className="btn btn-secondary btn-sm">
            <Download size={14} />
            Export HTML
          </button>
          <button onClick={handleDownloadJSON} className="btn btn-secondary btn-sm">
            <Download size={14} />
            Export JSON
          </button>
          <button onClick={handleDownloadMarkdown} className="btn btn-primary btn-sm">
            <Download size={14} />
            Download Schedule (.md)
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(450px, 1.2fr) minmax(380px, 1fr)', gap: '20px' }}>
        {/* LEFT COLUMN: EDITABLE SPECIFICATION SECTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section 1: Product / Service */}
          <div className="card">
            <label className="label">1. Product / Service Classification</label>
            <input
              type="text"
              className="input"
              value={productService}
              onChange={(e) => setProductService(e.target.value)}
            />
          </div>

          {/* Section 2: Procurement Requirement */}
          <div className="card">
            <label className="label">2. Procurement Requirement & Scope</label>
            <textarea
              className="textarea"
              style={{ minHeight: '80px' }}
              value={procurementRequirement}
              onChange={(e) => setProcurementRequirement(e.target.value)}
            />
          </div>

          {/* Section 3: Technical Parameters */}
          <div className="card">
            <label className="label">3. Technical Parameters & Material Attributes</label>
            <textarea
              className="textarea mono"
              style={{ minHeight: '100px', fontSize: '0.8125rem' }}
              value={technicalParameters}
              onChange={(e) => setTechnicalParameters(e.target.value)}
            />
          </div>

          {/* Section 4: Applicable Indian Standards Selected */}
          <div className="card" style={{ borderLeft: '4px solid var(--gov-navy-800)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="label" style={{ margin: 0 }}>
                4. Applicable Indian Standards ({selectedStandards.length})
              </label>
              <button
                onClick={() => setIsAddStandardModalOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                <Plus size={12} /> Add from Catalog
              </button>
            </div>

            {selectedStandards.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedStandards.map((std) => (
                  <div
                    key={std.standard_id}
                    style={{
                      background: 'var(--slate-50)',
                      border: '1px solid var(--slate-200)',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="standard-code">{std.standard_number}</span>
                        <StatusBadge status={std.status} size="sm" />
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-700)', marginTop: '4px', fontWeight: '500' }}>
                        {std.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        Version: {std.current_version}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveStandard(std.standard_id)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px', color: 'var(--slate-400)' }}
                      title="Remove from specification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '24px 16px',
                textAlign: 'center',
                background: 'var(--slate-50)',
                borderRadius: '6px',
                border: '1px dashed var(--slate-300)',
                fontSize: '0.8rem',
                color: 'var(--slate-500)'
              }}>
                No standards added yet. Click <strong>+ Add from Catalog</strong> above or select standards from the <strong>Analyze</strong> workspace.
              </div>
            )}
          </div>

          {/* Section 5: Testing Requirements */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="label" style={{ margin: 0 }}>5. Testing & Quality Assurance Requirements</label>
              <button onClick={handleAutoGenerateClauses} style={{ background: 'none', border: 'none', color: 'var(--gov-navy-700)', fontSize: '0.72rem', cursor: 'pointer', fontWeight: '600' }}>
                Auto-fill from Standards
              </button>
            </div>
            <textarea
              className="textarea"
              style={{ minHeight: '80px' }}
              value={testingRequirements}
              onChange={(e) => setTestingRequirements(e.target.value)}
            />
          </div>

          {/* Section 6: Safety Requirements */}
          <div className="card">
            <label className="label">6. Safety & Toxicological Criteria</label>
            <textarea
              className="textarea"
              style={{ minHeight: '80px' }}
              value={safetyRequirements}
              onChange={(e) => setSafetyRequirements(e.target.value)}
            />
          </div>

          {/* Section 7: Installation Requirements */}
          <div className="card">
            <label className="label">7. Installation & Workmanship Codes</label>
            <textarea
              className="textarea"
              style={{ minHeight: '80px' }}
              value={installationRequirements}
              onChange={(e) => setInstallationRequirements(e.target.value)}
            />
          </div>

          {/* Section 8: Statutory Certification */}
          <div className="card">
            <label className="label">8. Statutory Certification & Compliance Mandates</label>
            <textarea
              className="textarea"
              style={{ minHeight: '80px' }}
              value={certificationCompliance}
              onChange={(e) => setCertificationCompliance(e.target.value)}
            />
          </div>

          {/* Compliance Checklist Matrix */}
          <div className="card" style={{ background: 'var(--slate-50)' }}>
            <label className="label" style={{ marginBottom: '8px' }}>
              Institutional Compliance & Audit Checklist
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {checklist.map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.78rem' }}
                >
                  {item.checked ? <CheckSquare size={16} color="var(--success-700)" /> : <Square size={16} color="var(--slate-400)" />}
                  <span style={{ color: item.checked ? 'var(--slate-900)' : 'var(--slate-500)', textDecoration: item.checked ? 'none' : 'none' }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 9: Notes */}
          <div className="card">
            <label className="label">9. General Notes & Special Conditions</label>
            <textarea
              className="textarea"
              style={{ minHeight: '60px' }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: REALTIME DOCUMENT PREVIEW */}
        <div style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
          <div className="card" style={{ background: '#ffffff', boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-header">
              <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} color="var(--gov-navy-800)" />
                Specification Schedule Preview
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--success-700)', fontWeight: '600' }}>
                Auto-Updating
              </span>
            </div>

            <div style={{
              background: 'var(--slate-50)',
              border: '1px solid var(--slate-200)',
              borderRadius: '6px',
              padding: '16px',
              maxHeight: 'calc(100vh - 220px)',
              overflowY: 'auto',
              fontSize: '0.8125rem',
              lineHeight: '1.6',
              color: 'var(--slate-800)'
            }}>
              <div style={{ borderBottom: '2px solid var(--gov-navy-900)', paddingBottom: '8px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--slate-500)' }}>
                  Institutional Procurement Schedule
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--gov-navy-950)' }}>
                  {productService || "Untitled Specification"}
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <strong>1. Scope of Procurement:</strong>
                <p style={{ marginTop: '2px', color: 'var(--slate-600)' }}>{procurementRequirement}</p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <strong>2. Mandated Indian Standards:</strong>
                {selectedStandards.length > 0 ? (
                  <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                    {selectedStandards.map(s => (
                      <li key={s.standard_id} style={{ marginBottom: '4px' }}>
                        <span className="mono" style={{ fontWeight: '600', color: 'var(--gov-navy-900)' }}>
                          {s.standard_number}
                        </span>
                        <div style={{ color: 'var(--slate-600)', fontSize: '0.75rem' }}>
                          {s.title} ({s.current_version})
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--slate-400)', fontStyle: 'italic', marginTop: '2px' }}>
                    No standards currently attached.
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <strong>3. Testing & Inspection:</strong>
                <p style={{ marginTop: '2px', color: 'var(--slate-600)' }}>{testingRequirements}</p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <strong>4. Certification Mandates:</strong>
                <p style={{ marginTop: '2px', color: 'var(--slate-600)' }}>{certificationCompliance}</p>
              </div>

              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--slate-200)',
                fontSize: '0.72rem',
                color: 'var(--slate-500)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Format: Public Procurement General Conditions</span>
                <span>Traceability: Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Standard Modal */}
      <Modal
        isOpen={isAddStandardModalOpen}
        onClose={() => setIsAddStandardModalOpen(false)}
        title="Add Standard to Specification"
        subtitle="Search Indian Standards catalog to incorporate into this procurement schedule"
        maxWidth="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input
              type="text"
              className="input"
              style={{ paddingLeft: '34px' }}
              placeholder="Filter by code or title (e.g. IS 10500, IS 732, concrete)..."
              value={standardSearchText}
              onChange={(e) => setStandardSearchText(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {availableStandardsToAdd.map(std => (
              <div
                key={std.standard_id}
                style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="standard-code">{std.standard_number}</span>
                    <StatusBadge status={std.status} size="sm" />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gov-navy-950)', fontWeight: '500', marginTop: '4px' }}>
                    {std.title}
                  </div>
                </div>
                <button
                  onClick={() => {
                    onAddStandard(std);
                    setIsAddStandardModalOpen(false);
                    if (onShowToast) onShowToast(`Added ${std.standard_number} to Specification schedule.`, "success");
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Official Print Preview Modal */}
      <Modal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        title="Official Tender Technical Compliance Schedule"
        subtitle="Formatted for public procurement tendering documentation"
        maxWidth="820px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#ffffff',
            border: '2px solid #000',
            padding: '24px',
            fontSize: '0.85rem',
            lineHeight: '1.5',
            color: '#000'
          }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                GOVERNMENT OF INDIA / PUBLIC SECTOR ENTERPRISE
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: '700', marginTop: '4px' }}>
                TECHNICAL SPECIFICATION & STANDARDS COMPLIANCE SCHEDULE
              </div>
            </div>

            <p><strong>Item / System: </strong> {productService}</p>
            <p><strong>Scope: </strong> {procurementRequirement}</p>

            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '14px 0', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>Standard No.</th>
                  <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>Title</th>
                  <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>Version</th>
                  <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>Bidder Compliance (Yes/No)</th>
                </tr>
              </thead>
              <tbody>
                {selectedStandards.map(s => (
                  <tr key={s.standard_id}>
                    <td style={{ border: '1px solid #000', padding: '6px', fontWeight: 'bold' }}>{s.standard_number}</td>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>{s.title}</td>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>{s.current_version}</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>[ &nbsp; &nbsp; ]</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '12px' }}>
              <strong>Mandatory Quality Assurance Clauses:</strong>
              <p style={{ marginTop: '2px' }}>{testingRequirements}</p>
            </div>

            <div style={{ marginTop: '12px' }}>
              <strong>Statutory Certification / QCO Mandates:</strong>
              <p style={{ marginTop: '2px' }}>{certificationCompliance}</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button onClick={() => window.print()} className="btn btn-primary btn-sm">
              <Printer size={14} />
              Print to PDF / Paper
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
