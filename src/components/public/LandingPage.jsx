import React from 'react';
import {
  ArrowRight,
  Search,
  FileText,
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Scale,
  GitBranch,
  Globe,
  Sliders
} from 'lucide-react';
import { TRANSLATIONS } from '../../data/translations';
import { MOCK_TENDERS } from '../../data/mockTenders';

export default function LandingPage({
  onAnalyzeClick,
  onExploreStandardsClick,
  onOpenTenderPreset,
  language
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* ==============================================================
          1. HERO SECTION (Section 11 & 12)
          Exact positioning: "Identify the Right Indian Standards for Your Procurement Specification"
          ============================================================== */}
      <section style={{
        background: 'linear-gradient(180deg, #ffffff 0%, var(--slate-100) 100%)',
        borderBottom: '1px solid var(--slate-200)',
        padding: '56px 24px 64px'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto 40px', textAlign: 'center' }}>
            {/* Positioning Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--gov-navy-50)',
              border: '1px solid var(--gov-navy-200)',
              color: 'var(--gov-navy-900)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              <ShieldCheck size={14} color="var(--gov-navy-700)" />
              {t.positioning}
            </div>

            {/* Exact Headline - Section 11 */}
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'var(--gov-navy-950)',
              lineHeight: '1.2',
              letterSpacing: '-0.025em',
              marginBottom: '18px'
            }}>
              {t.heroTitle}
            </h1>

            {/* Exact Supporting Text - Section 11 */}
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--slate-600)',
              lineHeight: '1.6',
              marginBottom: '28px'
            }}>
              {t.heroSubtitle}
            </p>

            {/* CTAs - Section 11 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <button
                onClick={onAnalyzeClick}
                className="btn btn-primary btn-lg"
                style={{ minWidth: '220px', boxShadow: 'var(--shadow-sm)' }}
              >
                <span>{t.btnAnalyze}</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onExploreStandardsClick}
                className="btn btn-secondary btn-lg"
                style={{ minWidth: '190px' }}
              >
                <Search size={16} />
                <span>{t.btnExplore}</span>
              </button>
            </div>

            {/* Supporting Statement - Section 11 */}
            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontStyle: 'italic' }}>
              {t.heroStatement}
            </div>
          </div>

          {/* ============================================================
              HERO VISUAL (Section 12)
              Realistic product interface showing the 4 stages:
              PROCUREMENT SPECIFICATION -> REQUIREMENT ANALYSIS -> STANDARD RECOMMENDATIONS -> EVIDENCE
              ============================================================ */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--slate-300)',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}>
            {/* Visual Interface Top bar */}
            <div style={{
              background: 'var(--gov-navy-950)',
              color: '#ffffff',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f87171', display: 'inline-block' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                <span style={{ marginLeft: '8px', color: 'var(--slate-300)', fontFamily: 'var(--font-mono)' }}>
                  SolveX Standards Intelligence Console — Live Procurement Evaluation
                </span>
              </div>
              <span className="badge badge-current" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                Sample / Demonstration Data
              </span>
            </div>

            {/* 4 Connected Stages - Section 12 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              divideX: '1px solid var(--slate-200)'
            }}>
              {/* STAGE 1: PROCUREMENT SPECIFICATION */}
              <div style={{ padding: '20px', borderRight: '1px solid var(--slate-200)' }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: 'var(--gov-navy-800)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '10px'
                }}>
                  01. Specification Input
                </div>
                <div style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '0.78rem',
                  lineHeight: '1.45',
                  color: 'var(--slate-700)'
                }}>
                  <strong>Product: </strong> HDPE Pressure Pipes<br />
                  <strong>Application: </strong> Potable Water Distribution<br />
                  <strong>Parameters: </strong> PE 100 grade, PN 10, DN 110mm to 200mm, OIT &gt;= 20 min.
                </div>
              </div>

              {/* STAGE 2: REQUIREMENT ANALYSIS */}
              <div style={{ padding: '20px', borderRight: '1px solid var(--slate-200)' }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: 'var(--gov-navy-800)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '10px'
                }}>
                  02. Requirement Analysis
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: '4px', padding: '6px 8px', fontSize: '0.72rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--gov-navy-950)' }}>Material: </span>
                    <span>Virgin PE 100 resin (MRS 10.0 MPa)</span>
                  </div>
                  <div style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: '4px', padding: '6px 8px', fontSize: '0.72rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--gov-navy-950)' }}>Safety: </span>
                    <span>Potability non-leaching per IS 10500</span>
                  </div>
                  <div style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: '4px', padding: '6px 8px', fontSize: '0.72rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--gov-navy-950)' }}>Pressure: </span>
                    <span>1.0 MPa at 20°C induced hoop stress</span>
                  </div>
                </div>
              </div>

              {/* STAGE 3: STANDARD RECOMMENDATIONS */}
              <div style={{ padding: '20px', borderRight: '1px solid var(--slate-200)' }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: 'var(--gov-navy-800)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '10px'
                }}>
                  03. Recommended Standards
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ background: 'var(--gov-navy-50)', border: '1px solid var(--gov-navy-200)', borderRadius: '4px', padding: '6px 8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="mono" style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--gov-navy-950)' }}>IS 4984 : 2016</span>
                      <span className="badge badge-current" style={{ fontSize: '0.65rem' }}>Current</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                      HDPE Pipes for Water Supply (Fifth Rev)
                    </div>
                  </div>
                  <div style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: '4px', padding: '6px 8px' }}>
                    <span className="mono" style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--gov-navy-800)' }}>IS 10500 : 2012</span>
                    <div style={{ fontSize: '0.68rem', color: 'var(--slate-500)' }}>Normative: Drinking Water Spec</div>
                  </div>
                  <div style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)', borderRadius: '4px', padding: '6px 8px' }}>
                    <span className="mono" style={{ fontSize: '0.72rem', fontWeight: '600', color: 'var(--gov-navy-800)' }}>IS 7634 (Part 2)</span>
                    <div style={{ fontSize: '0.68rem', color: 'var(--slate-500)' }}>Installation: Laying & Butt Jointing</div>
                  </div>
                </div>
              </div>

              {/* STAGE 4: EVIDENCE TRACEABILITY */}
              <div style={{ padding: '20px' }}>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: 'var(--gov-navy-800)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '10px'
                }}>
                  04. Traceable Evidence
                </div>
                <div style={{
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  borderRadius: '6px',
                  padding: '10px',
                  fontSize: '0.75rem'
                }}>
                  <div style={{ fontWeight: '600', color: 'var(--gov-navy-950)' }}>
                    CED 50 / Clause 8.1
                  </div>
                  <div style={{ color: 'var(--slate-600)', marginTop: '4px', lineHeight: '1.4' }}>
                    "Internal hydrostatic pressure test: 12.4 MPa induced stress at 20°C for 100 hours with zero failure."
                  </div>
                  <div style={{
                    marginTop: '8px',
                    padding: '4px 6px',
                    background: 'var(--saffron-50)',
                    color: 'var(--saffron-700)',
                    fontSize: '0.68rem',
                    borderRadius: '3px',
                    fontWeight: '600'
                  }}>
                    Statutory QCO Mandate Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================================
          3. PROCUREMENT CHALLENGE SECTION (Section 14)
          Headline: "Finding the right standard is more than a keyword search."
          ============================================================== */}
      <section style={{ padding: '64px 24px', background: '#ffffff', borderBottom: '1px solid var(--slate-200)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ maxWidth: '780px', marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '1.85rem',
              fontWeight: '700',
              color: 'var(--gov-navy-950)',
              letterSpacing: '-0.02em',
              marginBottom: '14px'
            }}>
              {t.challengeTitle}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--slate-600)', lineHeight: '1.6' }}>
              Public-sector procurement officers and technical specification committees frequently encounter complex tender disputes, rejected supplies, and audit observations due to incomplete standards citations. Simple keyword queries fail to uncover the legal and technical reality of standards compliance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              {
                title: "Overlapping Scopes & Product Grades",
                desc: "Multiple Indian Standards govern similar items with distinct pressure tiers, environmental ratings, or alloy chemistry."
              },
              {
                title: "Frequent Amendments & Reaffirmations",
                desc: "Standards undergo mandatory 5-year reviews, reaffirmations, and critical amendments affecting test criteria."
              },
              {
                title: "Mandatory Normative References",
                desc: "A primary product standard cannot stand alone; it mandates subordinate test codes, raw material norms, and sampling sizes."
              },
              {
                title: "Statutory Quality Control Orders (QCOs)",
                desc: "Ministries issue compulsory BIS certification notifications that legally govern public tender eligibility."
              }
            ].map((ch, idx) => (
              <div key={idx} className="card" style={{ padding: '18px' }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--gov-navy-700)',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  0{idx + 1}. PROBLEM
                </div>
                <h3 style={{ fontSize: '1rem', color: 'var(--gov-navy-950)', marginBottom: '6px' }}>
                  {ch.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                  {ch.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================================================
          4. HOW SOLVEX WORKS (Section 15)
          Display five clear steps
          ============================================================== */}
      <section style={{ padding: '64px 24px', background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--gov-navy-950)', marginBottom: '10px' }}>
              {t.howItWorksTitle}
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)' }}>
              From unstructured procurement descriptions to verifiable, evidence-grounded standards schedules in five systematic phases.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {[
              {
                num: "01",
                title: t.step1Title,
                desc: t.step1Desc
              },
              {
                num: "02",
                title: t.step2Title,
                desc: t.step2Desc
              },
              {
                num: "03",
                title: t.step3Title,
                desc: t.step3Desc
              },
              {
                num: "04",
                title: t.step4Title,
                desc: t.step4Desc
              },
              {
                num: "05",
                title: t.step5Title,
                desc: t.step5Desc
              }
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--slate-200)',
                  borderRadius: '8px',
                  padding: '20px 16px',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '700',
                  color: 'var(--gov-navy-900)',
                  marginBottom: '10px',
                  borderBottom: '2px solid var(--saffron-500)',
                  display: 'inline-block',
                  width: 'fit-content',
                  paddingBottom: '2px'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '0.95rem', color: 'var(--gov-navy-950)', marginBottom: '8px', fontWeight: '600' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================================================
          5. PROCUREMENT PRESETS TEST BENCH (Interactive Demonstration)
          ============================================================== */}
      <section style={{ padding: '64px 24px', background: '#ffffff', borderBottom: '1px solid var(--slate-200)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--gov-navy-800)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Curated Test Benches
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--gov-navy-950)', marginTop: '4px' }}>
                Explore Real Procurement Scenarios
              </h2>
            </div>
            <button onClick={onAnalyzeClick} className="btn btn-primary btn-sm">
              Open Analysis Console <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {MOCK_TENDERS.map(tnd => (
              <div
                key={tnd.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: '4px solid var(--gov-navy-800)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontFamily: 'var(--font-mono)' }}>
                    {tnd.tender_number}
                  </div>
                  <h3 style={{ fontSize: '1rem', color: 'var(--gov-navy-950)', margin: '6px 0 10px', fontWeight: '600' }}>
                    {tnd.title}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
                    <strong>Agency: </strong> {tnd.department}
                  </div>
                  <div style={{
                    background: 'var(--slate-50)',
                    padding: '8px 10px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: 'var(--slate-600)',
                    lineHeight: '1.4',
                    marginBottom: '14px'
                  }}>
                    {tnd.description}
                  </div>
                </div>

                <div>
                  <div style={{ marginBottom: '12px', fontSize: '0.72rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--slate-500)' }}>Target Standards: </span>
                    <span className="mono" style={{ color: 'var(--gov-navy-900)' }}>
                      {tnd.expected_standards.slice(0, 3).join(', ')}...
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenTenderPreset(tnd)}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    <span>Analyze This Specification</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================================================
          6. INSTITUTIONAL CALL TO ACTION (Section 13)
          ============================================================== */}
      <section style={{
        background: 'var(--gov-navy-950)',
        color: '#ffffff',
        padding: '56px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Ready to Verify Your Procurement Specifications?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--slate-300)', lineHeight: '1.6', marginBottom: '28px' }}>
            Prevent tender revisions, identify mandatory Quality Control Orders, and incorporate validated Indian Standards clauses directly into your contracts.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={onAnalyzeClick}
              className="btn btn-accent btn-lg"
              style={{ minWidth: '220px' }}
            >
              Analyze Specification Now
            </button>
            <button
              onClick={onExploreStandardsClick}
              className="btn btn-secondary btn-lg"
              style={{ minWidth: '200px' }}
            >
              Search Standards Catalog
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
