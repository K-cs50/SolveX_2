/**
 * SolveX — Curated Demonstration Tender & Specification Presets
 * Clearly labeled as Sample / Demonstration Data.
 */

export const MOCK_TENDERS = [
  {
    id: "tender-jjm-hdpe-01",
    title: "Rural Drinking Water Supply Pipeline Network (Jal Jeevan Mission Package 04)",
    department: "Public Health Engineering Department (PHED), State Water Mission",
    tender_number: "PHED/JJM/2026/PKG-04/WSS-118",
    category: "Water Supply Infrastructure",
    description: "Procurement and laying of High Density Polyethylene (HDPE) pressure pipes, sluice valves, and allied fittings for rural piped water distribution network.",
    raw_text: `SECTION 3: TECHNICAL SPECIFICATIONS & STANDARDS OF MATERIALS

3.1 SCOPE OF PROCUREMENT
The scope covers manufacture, testing at factory, transport to site, trench excavation, lowering, butt-fusion jointing, testing, and commissioning of High Density Polyethylene (HDPE) pipes and flanged sluice valves.

3.2 TECHNICAL PARAMETERS FOR HDPE PIPES
a) Material & Polymer Grade: Virgin High Density Polyethylene conforming to PE 100 grade, minimum required strength MRS 10.0 MPa.
b) Pressure Class: PN 10 (nominal operating pressure 1.0 MPa at 20°C).
c) Pipe Sizes: Nominal outer diameter DN 90mm, DN 110mm, DN 160mm, and DN 200mm per schedule of quantities.
d) Carbon Black Content: Uniformly distributed between 2.0% to 2.5% by weight.
e) Oxidation Induction Time (OIT): Minimum 20 minutes at 200°C.
f) Potability & Toxicology: The pipes must be toxicologically safe for conveying drinking water and must not impart any taste or odour (migration limits per drinking water standards).
g) Certification: Mandatory BIS ISI certification mark embossed legibly at 1-metre intervals along with manufacturer name, PE grade, PN rating, and lot number.

3.3 ISOLATION & SCOUR SLUICE VALVES
a) Nominal Sizes: DN 100mm to DN 200mm flanged sluice valves PN 1.0 rating, cast iron body with bronze/gunmetal seat trim, non-rising spindle.
b) Testing: Body test pressure 1.5 MPa and seat leakage test pressure 1.1 MPa held for minimum 3 minutes without drop.
c) Gaskets: Synthetic EPDM rubber gaskets conforming to water mains sealing requirements.

3.4 INSTALLATION & COMMISSIONING
Pipes shall be laid in trenches with minimum cover of 1.0 metre. Butt fusion welding parameters must adhere to standard welding pressure-temperature cycles. Trench backfilling per code of practice.`,
    preset_requirements: [
      { id: "req-1", type: "Material & Grade", text: "Virgin High Density Polyethylene (HDPE) conforming to PE 100 grade with MRS >= 10.0 MPa", source: "Section 3.2 (a)", importance: "Critical" },
      { id: "req-2", type: "Performance & Pressure", text: "PN 10 pressure rating (operating pressure 1.0 MPa at 20°C)", source: "Section 3.2 (b)", importance: "Critical" },
      { id: "req-3", type: "Safety & Potability", text: "Toxicologically safe for drinking water; non-leaching of toxic constituents per IS 10500", source: "Section 3.2 (f)", importance: "Mandatory" },
      { id: "req-4", type: "Testing & Durability", text: "Internal hydrostatic pressure withstand, carbon black 2.0-2.5%, and OIT >= 20 mins", source: "Section 3.2 (d, e)", importance: "High" },
      { id: "req-5", type: "Valves & Flow Control", text: "Flanged sluice valves PN 1.0, non-rising spindle, body test 1.5 MPa", source: "Section 3.3 (a, b)", importance: "High" },
      { id: "req-6", type: "Installation & Jointing", text: "Butt-fusion jointing and trench laying guidelines with EPDM gaskets", source: "Section 3.4", importance: "Standard" }
    ],
    expected_standards: ["IS 4984 : 2016", "IS 14846 : 2000", "IS 10500 : 2012", "IS 7634 (Part 2) : 2012", "IS 5382 : 2018"]
  },
  {
    id: "tender-substation-trans-02",
    title: "Supply & Commissioning of 33kV/11kV Power Transformer & LV Switchgear",
    department: "State Electricity Transmission & Distribution Corporation",
    tender_number: "DISCOM/TRANS/33KV/2026/T-402",
    category: "Electrical & Substation Infrastructure",
    description: "Design, engineering, manufacturing, factory acceptance testing and delivery of 1000 kVA 33/11 kV distribution transformers and low voltage air circuit breaker (ACB) panels.",
    raw_text: `SECTION 4: TECHNICAL SPECIFICATION FOR 33/11 kV TRANSFORMERS AND SWITCHGEAR

4.1 TRANSFORMER SPECIFICATION
a) Type: Outdoor, oil-immersed, 3-phase, 50 Hz, step-down power distribution transformer.
b) Rated Output: 1000 kVA, continuous duty.
c) Voltage Ratio: 33000 V / 11000 V (HV/LV), with off-circuit tap changer (+5% to -10% in steps of 2.5%).
d) Cooling & Winding: ONAN cooling with electrolytic copper winding.
e) Losses & Energy Efficiency: Maximum allowable no-load and load losses shall conform to BEE 5-Star efficiency and latest Indian Standard limits.
f) Dielectric Insulation: Mineral insulating oil conforming to standard specification, breakdown voltage minimum 60 kV.
g) Testing: Routine and temperature rise tests per relevant Indian Standard. Short-circuit withstand capability certification required from CPRI/ERDA.

4.2 LOW VOLTAGE SWITCHGEAR & CIRCUIT BREAKERS
a) Main Incoming Breakers: 415 V, 3-pole Air Circuit Breaker (ACB) with microprocessor-based protection unit (Overload, Short-circuit, Earth fault).
b) Rated Service Breaking Capacity (Ics): 50 kA at 415 V AC, with Ics = 100% Icu.
c) Isolation Capability: Breaker must provide positive break indication suitable for isolation.
d) Switchboard Assembly: Factory-built enclosure with IP54 ingress protection rating.

4.3 EARTHING & SUBSTATION SAFETY
Earth grid resistance shall not exceed 1.0 Ohm. Copper/GI strip earthing designed in accordance with standard earthing code of practice.`,
    preset_requirements: [
      { id: "req-1", type: "Equipment Rating", text: "1000 kVA, 33kV/11kV, 3-phase 50Hz oil-immersed copper wound transformer", source: "Section 4.1 (a, b, c)", importance: "Critical" },
      { id: "req-2", type: "Thermal & Losses", text: "ONAN cooling, maximum losses conforming to BEE energy efficiency levels and IS 2026", source: "Section 4.1 (d, e)", importance: "Critical" },
      { id: "req-3", type: "Dielectric Safety", text: "Insulating mineral oil with minimum 60 kV dielectric withstand", source: "Section 4.1 (f)", importance: "Mandatory" },
      { id: "req-4", type: "Circuit Protection", text: "415V Low-voltage circuit breaker with Ics = 50 kA (100% Icu) and positive isolation", source: "Section 4.2 (a, b, c)", importance: "Critical" },
      { id: "req-5", type: "Enclosure Protection", text: "Switchboard assembly with ingress protection degree IP54", source: "Section 4.2 (d)", importance: "High" },
      { id: "req-6", type: "Earthing Safety", text: "Substation earthing installation with earth grid resistance <= 1.0 Ohm", source: "Section 4.3", importance: "Mandatory" }
    ],
    expected_standards: ["IS 2026 (Part 1) : 2011", "IS/IEC 60947 (Part 2) : 2016", "IS 3043 : 2018", "IS 335 : 2018", "IS/IEC 61439 (Part 1) : 2011"]
  },
  {
    id: "tender-smartcity-cctv-03",
    title: "Integrated Video Surveillance CCTV & Network Equipment for Smart City",
    department: "Smart City Development Corporation Limited",
    tender_number: "SCDCL/IT-SURV/2026/089",
    category: "Information Technology & Surveillance",
    description: "Procurement, installation and integration of high-resolution IP bullet/dome surveillance cameras, edge recording, vandal-proof enclosures and cybersecurity compliance.",
    raw_text: `SECTION 2: TECHNICAL REQUIREMENTS FOR VIDEO SURVEILLANCE

2.1 CAMERA HARDWARE REQUIREMENTS
a) Type: Outdoor Network IP Bullet and Fixed Dome Cameras.
b) Sensor & Resolution: Minimum 1/2.8" progressive scan CMOS sensor, 4 Megapixel resolution (2560 x 1440) at 30 fps.
c) Video Compression: H.265 / H.264 / MJPEG with triple streaming capability.
d) Low Light Performance: Minimum illumination 0.005 Lux in color mode, built-in smart IR with minimum 50-metre night visibility.
e) Wide Dynamic Range: True WDR minimum 120 dB.
f) Interoperability: Native support for ONVIF Profile S, G, and T.

2.2 ENVIRONMENTAL & MECHANICAL PROTECTION
a) Weather Resistance: IP67 ingress protection against dust and water immersion.
b) Impact Resistance: IK10 vandal-resistant casing for all public junction mounted dome cameras.
c) Operating Temperature: -10°C to +55°C, relative humidity up to 95%.
d) Surge Protection: Integrated 4 kV surge protector on power and RJ45 ethernet ports.

2.3 COMPLIANCE & CYBERSECURITY
a) Statutory BIS Registration: Must possess valid Compulsory Registration Scheme (CRS) R-number under MeitY electronics order.
b) Indian Standards Compliance: Tested and certified for surveillance cameras under IS 16844 and electrical safety under IS 13252 (Part 1).
c) Cybersecurity: TLS 1.3 encryption, secure firmware signing, disabled default telnet/SSH, and no hardcoded backdoors.`,
    preset_requirements: [
      { id: "req-1", type: "Optical & Resolution", text: "4MP CMOS sensor, minimum 0.005 lux low light, true WDR 120 dB, H.265 compression", source: "Section 2.1 (b, c, d, e)", importance: "Critical" },
      { id: "req-2", type: "Environmental Enclosure", text: "IP67 weather resistance and IK10 vandal impact resistance", source: "Section 2.2 (a, b)", importance: "Mandatory" },
      { id: "req-3", type: "Electrical Safety & Surge", text: "4 kV surge protection and general electrical safety for IT equipment", source: "Section 2.2 (d) & 2.3 (b)", importance: "Mandatory" },
      { id: "req-4", type: "Statutory Compliance", text: "Compulsory Registration Scheme (CRS) with valid BIS R-number", source: "Section 2.3 (a)", importance: "Mandatory" },
      { id: "req-5", type: "Cybersecurity & Firmware", text: "TLS 1.3 protocol, trusted supply chain, and encrypted data streams", source: "Section 2.3 (c)", importance: "High" }
    ],
    expected_standards: ["IS 16844 : 2018", "IS 13252 (Part 1) : 2010", "IS/IEC 60529 : 2001", "IS/IEC 62262 : 2002"]
  },
  {
    id: "tender-flyover-steel-04",
    title: "High-Tensile TMT Steel Rebars & Structural Steel for Elevated Corridor",
    department: "National Highway & Infrastructure Development Authority",
    tender_number: "NHIDA/CIVIL/ROB-FL/2026/033",
    category: "Civil Works & Structural Steel",
    description: "Supply of earthquake-resistant Fe 500D grade thermo-mechanically treated reinforcement bars and hot rolled structural steel plates for composite girder bridges.",
    raw_text: `SECTION 5: SPECIFICATION FOR REINFORCING STEEL AND STRUCTURAL STEEL

5.1 THERMO-MECHANICALLY TREATED (TMT) REBARS
a) Steel Grade: High yield strength deformed steel bars of grade Fe 500D (Ductile grade) for seismic zones IV & V.
b) Size Range: Nominal diameters 10 mm, 12 mm, 16 mm, 20 mm, 25 mm, and 32 mm.
c) Mechanical Properties:
   - 0.2% Proof Stress / Yield Stress: Minimum 500.0 N/mm².
   - Tensile Strength (TS): Minimum 565.0 N/mm² (TS/YS ratio >= 1.10).
   - Elongation: Minimum 16.0% at fracture on gauge length 5.65√A.
d) Chemical Composition: Carbon max 0.25%, Sulfur max 0.040%, Phosphorus max 0.040%, (S+P) max 0.075%.
e) Rolling Mark: Each bar shall have manufacturer brand name, grade (Fe 500D) and size clearly rolled onto the bar at intervals not exceeding 1.5 metres.
f) BIS Certification: Mandatory ISI mark from primary steel producers (integrated steel plants).

5.2 STRUCTURAL STEEL FOR COMPOSITE GIRDERS
a) Material: Hot rolled medium and high tensile structural steel plates and sections of Grade E250 Quality BR / BO.
b) Charpy V-Notch Impact: Minimum 27 Joules impact energy verified at sub-zero temperatures (0°C for BR, -20°C for BO).
c) Weldability: Carbon Equivalent (CE) based on ladle analysis shall not exceed 0.39%.`,
    preset_requirements: [
      { id: "req-1", type: "Steel Grade & Strength", text: "Fe 500D grade high strength deformed bars with yield stress >= 500 N/mm²", source: "Section 5.1 (a, c)", importance: "Critical" },
      { id: "req-2", type: "Seismic Ductility", text: "Minimum 16.0% elongation and TS/YS ratio >= 1.10 for seismic zone suitability", source: "Section 5.1 (c)", importance: "Mandatory" },
      { id: "req-3", type: "Chemical Purity", text: "Sulfur + Phosphorus combined limit <= 0.075%, Carbon <= 0.25%", source: "Section 5.1 (d)", importance: "High" },
      { id: "req-4", type: "Structural Steel Plates", text: "Hot rolled structural steel Grade E250 Quality BR/BO with Charpy impact test", source: "Section 5.2 (a, b)", importance: "Critical" },
      { id: "req-5", type: "Weldability & CE", text: "Carbon equivalent <= 0.39% for crack-free welded composite girder joints", source: "Section 5.2 (c)", importance: "High" },
      { id: "req-6", type: "Marking & Certification", text: "Mandatory BIS ISI mark with legible rolled mark every 1.5m", source: "Section 5.1 (e, f)", importance: "Mandatory" }
    ],
    expected_standards: ["IS 1786 : 2008", "IS 2062 : 2011", "IS 456 : 2000", "IS 800 : 2007", "IS 1608 (Part 1) : 2018", "IS 13920 : 2016"]
  }
];
