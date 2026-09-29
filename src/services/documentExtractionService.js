/**
 * SolveX — Document Extraction Service
 * Extracts structured requirements, technical parameters, materials, and safety clauses.
 * Complies with Section 26 Requirement Extraction rules.
 */

export class DocumentExtractionService {
  /**
   * Process raw specification text and extract structured requirements
   */
  static extractRequirements(text) {
    if (!text || typeof text !== 'string') return [];

    const lines = text.split('\n');
    const requirements = [];
    let reqCounter = 1;

    // Pattern recognizers for procurement parameters
    const patterns = [
      {
        type: "Material & Polymer Grade",
        regex: /(PE\s*100|PE\s*80|HDPE|virgin\s+high\s+density|polyethylene|OPC|PPC|ductile\s+iron|cast\s+iron|copper\s+wound|Fe\s*500D|Fe\s*550D|E250|E350)/i,
        importance: "Critical"
      },
      {
        type: "Pressure & Structural Rating",
        regex: /(PN\s*10|PN\s*16|PN\s*6|1\.0\s*MPa|1\.6\s*MPa|yield\s+stress|proof\s+stress|500\s*N\/mm|250\s*MPa|Ics\s*=\s*\d+kA|breaking\s+capacity)/i,
        importance: "Critical"
      },
      {
        type: "Equipment Rating & Capacity",
        regex: /(\d+\s*kVA|33kV\/11kV|415\s*V|3-phase|1000\s*kVA|4\s*Megapixel|4MP|DN\s*\d+|nominal\s+diameter)/i,
        importance: "Critical"
      },
      {
        type: "Potability & Safety Norms",
        regex: /(potab|toxic|drinking\s+water|IS\s*10500|safety|dielectric|breakdown\s+voltage|insulation\s+resistance|electric\s+shock|RCD|shock\s+protection)/i,
        importance: "Mandatory"
      },
      {
        type: "Testing & Quality Verification",
        regex: /(hydrostatic|OIT|carbon\s+black|melt\s+flow|slump\s+test|cube\s+strength|charpy|impact\s+test|NABL|CPRI|ERDA|temperature\s+rise)/i,
        importance: "High"
      },
      {
        type: "Environmental & Ingress Protection",
        regex: /(IP65|IP66|IP67|IP54|IK10|weather\s+resistance|vandal|operating\s+temperature|relative\s+humidity)/i,
        importance: "High"
      },
      {
        type: "Statutory Certification & Marking",
        regex: /(BIS|ISI\s+mark|CRS|R-number|QCO|Quality\s+Control\s+Order|MeitY|BEE\s+5-star|rolling\s+mark)/i,
        importance: "Mandatory"
      }
    ];

    // Scan lines for structured clauses and requirements
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 15) return;

      // Extract clause identifier if available (e.g. 3.2, 4.1(a), etc.)
      const clauseMatch = trimmed.match(/^(\d+(\.\d+)*(\([a-z0-9]+\))?|[a-z]\))\s*/i);
      const clauseLocation = clauseMatch ? `Clause ${clauseMatch[1]}` : `Line ${index + 1}`;

      patterns.forEach(p => {
        if (p.regex.test(trimmed)) {
          // Avoid duplicate lines
          if (!requirements.some(r => r.text === trimmed)) {
            requirements.push({
              id: `req-${reqCounter++}`,
              type: p.type,
              text: trimmed,
              source: clauseLocation,
              importance: p.importance,
              editable: true
            });
          }
        }
      });
    });

    // Fallback if no specific regex matched but text was provided
    if (requirements.length === 0 && text.trim().length > 10) {
      requirements.push({
        id: `req-${reqCounter++}`,
        type: "General Technical Parameter",
        text: text.slice(0, 180) + (text.length > 180 ? "..." : ""),
        source: "Input Text",
        importance: "Standard",
        editable: true
      });
    }

    return requirements;
  }

  /**
   * Detect high-level product entity and application domain
   */
  static detectProductEntity(text) {
    const lower = (text || "").toLowerCase();

    if (lower.includes("hdpe") || lower.includes("water supply") || lower.includes("pipe") || lower.includes("polyethylene")) {
      return {
        product: "High Density Polyethylene (HDPE) Piping System",
        category: "Pipes & Fittings",
        domain: "Civil Engineering",
        primaryApplication: "Rural/Urban Potable Water Supply & Distribution"
      };
    }

    if (lower.includes("transformer") || lower.includes("switchgear") || lower.includes("substation") || lower.includes("acb") || lower.includes("mccb")) {
      return {
        product: "Substation Transformer & Low-Voltage Switchgear",
        category: "Electrical Infrastructure",
        domain: "Electrical Engineering",
        primaryApplication: "Power Distribution Substation & Industrial Protection"
      };
    }

    if (lower.includes("cctv") || lower.includes("camera") || lower.includes("surveillance") || lower.includes("nvr")) {
      return {
        product: "IP Surveillance Cameras & Video System",
        category: "Information Technology",
        domain: "Electronics & IT",
        primaryApplication: "Smart City Public Safety & Government Surveillance"
      };
    }

    if (lower.includes("tmt") || lower.includes("rebar") || lower.includes("reinforcement") || lower.includes("fe 500") || lower.includes("structural steel")) {
      return {
        product: "Structural Steel & Concrete Reinforcement Rebars",
        category: "Structural Materials",
        domain: "Civil Engineering",
        primaryApplication: "Bridge, Flyover & Seismic Resilient Highway Structures"
      };
    }

    if (lower.includes("valve") || lower.includes("sluice") || lower.includes("water works")) {
      return {
        product: "Industrial Flow Control Sluice Valves",
        category: "Pipes & Fittings",
        domain: "Mechanical Engineering",
        primaryApplication: "Water Transmission & Municipal Isolation Works"
      };
    }

    return {
      product: "Generic Technical Procurement Specification",
      category: "General Procurement",
      domain: "Interdisciplinary",
      primaryApplication: "Institutional Technical Acquisition"
    };
  }
}
