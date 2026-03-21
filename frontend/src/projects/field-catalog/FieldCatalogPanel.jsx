import { useEffect, useMemo, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./field-catalog.css";

// ── Highlight helpers ────────────────────────────────────────────────────────
// Each family gets a vivid color for field-symbol highlighting in equations.
// We write the \color{} markup directly into every LaTeX string so there is
// zero runtime regex / token-matching — what you see in the source IS what
// KaTeX renders.
const C = {
  L: (s) => `{\\color{#5ef0ff}{${s}}}`,   // Lepton  (cyan)
  N: (s) => `{\\color{#3dffb8}{${s}}}`,   // Neutrino (green)
  Q: (s) => `{\\color{#ffaa33}{${s}}}`,   // Quark   (orange)
  G: (s) => `{\\color{#ff5ec4}{${s}}}`,   // Gauge   (pink)
  S: (s) => `{\\color{#d07fff}{${s}}}`,   // Scalar  (purple)
};

// ── Lepton shared LaTeX (electron, muon, tau) ────────────────────────────────
const leptonFieldStructure = String.raw`${C.L("\\psi")}=\begin{pmatrix}\psi_{L}\\ \psi_{R}\end{pmatrix}`;
const leptonFieldStructureExpanded = String.raw`${C.L("\\psi")}=\begin{pmatrix}|\psi_{L,1}|\,e^{i\theta_{L,1}}\\ |\psi_{L,2}|\,e^{i\theta_{L,2}}\\ |\psi_{R,1}|\,e^{i\theta_{R,1}}\\ |\psi_{R,2}|\,e^{i\theta_{R,2}}\end{pmatrix}`;
const leptonFreeLagrangian = String.raw`\mathcal{L}_0=\bar{${C.L("\\psi")}}\left(i\gamma^\mu\partial_\mu-m\right)${C.L("\\psi")}`;
const leptonNonRel = String.raw`i\partial_t${C.L("\\varphi")}=\left(-\frac{\nabla^2}{2m}+V\right)${C.L("\\varphi")}`;
const leptonRel = String.raw`\left(i\gamma^\mu\partial_\mu-m\right)${C.L("\\psi")}=0`;

// ── Neutrino shared LaTeX ────────────────────────────────────────────────────
const neutrinoFieldStructureExpanded = String.raw`${C.N("\\nu")}=\begin{pmatrix}|\nu_{L,1}|\,e^{i\theta_{L,1}}\\ |\nu_{L,2}|\,e^{i\theta_{L,2}}\end{pmatrix}`;
const neutrinoFreeLagrangian = String.raw`\mathcal{L}_0=\bar{${C.N("\\nu")}}\,i\gamma^\mu\partial_\mu${C.N("\\nu")}-\frac{m}{2}\left(\bar{${C.N("\\nu")}}^c${C.N("\\nu")}+\text{h.c.}\right)`;
const neutrinoNonRel = String.raw`i\partial_t${C.N("\\chi")}\approx\left(-\frac{\nabla^2}{2m}+V_{\text{matter}}\right)${C.N("\\chi")}`;
const neutrinoRel = String.raw`\left(i\gamma^\mu\partial_\mu-m\right)${C.N("\\nu")}=0`;

// ── Quark shared LaTeX ───────────────────────────────────────────────────────
const quarkFieldStructure = String.raw`${C.Q("q^a")}=\begin{pmatrix}q_L^a\\ q_R^a\end{pmatrix},\quad a=1,2,3`;
const quarkFieldStructureShort = String.raw`${C.Q("q^a")}=\begin{pmatrix}q_L^a\\ q_R^a\end{pmatrix}`;
const quarkFieldStructureExpanded = String.raw`${C.Q("q^{\\color{red}{r}}")}=\begin{pmatrix}R_1^r\,e^{i\phi_1^r}\\ R_2^r\,e^{i\phi_2^r}\\ R_3^r\,e^{i\phi_3^r}\\ R_4^r\,e^{i\phi_4^r}\end{pmatrix},\;${C.Q("q^{\\color{green}{g}}")}=\begin{pmatrix}R_1^g\,e^{i\phi_1^g}\\ R_2^g\,e^{i\phi_2^g}\\ R_3^g\,e^{i\phi_3^g}\\ R_4^g\,e^{i\phi_4^g}\end{pmatrix},\;${C.Q("q^{\\color{#4488ff}{b}}")}=\begin{pmatrix}R_1^b\,e^{i\phi_1^b}\\ R_2^b\,e^{i\phi_2^b}\\ R_3^b\,e^{i\phi_3^b}\\ R_4^b\,e^{i\phi_4^b}\end{pmatrix}`;
const quarkFieldStructureExpandedShort = quarkFieldStructureExpanded;
const quarkFreeLagrangian = String.raw`\mathcal{L}_0=\bar{${C.Q("q}_a")}\left(i\gamma^\mu\partial_\mu-m\right)${C.Q("q^a")}`;
const quarkNonRel = String.raw`i\partial_t${C.Q("\\phi")}=\left[\frac{(\mathbf{p}-g_s\mathbf{G}^bT^b)^2}{2m}+V\right]${C.Q("\\phi")}`;
const quarkRel = String.raw`\left(i\gamma^\mu D_\mu-m\right)${C.Q("q")}=0`;

const weakYangMillsFieldStrength = String.raw`W^i_{\mu\nu}=\partial_\mu W^i_\nu-\partial_\nu W^i_\mu+g\,\epsilon^{ijk}W^j_\mu W^k_\nu`;
const weakYangMillsEquation = (index) => String.raw`\left(D_\mu W^{\mu\nu}\right)^${index}=J^{${index}\nu}`;
const weakPlasmaEquation = (index) => String.raw`\left(D_jE_j\right)^${index}=\rho^${index},\quad ${weakYangMillsEquation(index)}`;
const weakFieldStructure = (index) => String.raw`${C.G(`W^${index}_\\mu`)}=\left(W^${index}_0,\,W^${index}_1,\,W^${index}_2,\,W^${index}_3\right)`;
const weakFreeLagrangian = (index) => String.raw`\mathcal{L}_{0,W^${index}}=-\frac{1}{4}W^${index}_{\mu\nu}W^{${index}\mu\nu},\quad ${weakYangMillsFieldStrength}`;
const hyperchargeFieldStrength = String.raw`B_{\mu\nu}=\partial_\mu B_\nu-\partial_\nu B_\mu`;
const symmetricHiggsField = String.raw`${C.S("\\Phi")}=\begin{pmatrix}\phi^+\\ \phi^0\end{pmatrix},\quad \langle${C.S("\\Phi")}\rangle=0`;
const symmetricHiggsPotential = String.raw`V_T(${C.S("\\Phi")})=m_{\mathrm{eff}}^2(T)${C.S("\\Phi")}^\dagger${C.S("\\Phi")}+\lambda\left(${C.S("\\Phi")}^\dagger${C.S("\\Phi")}\right)^2`;

const fermionCatalog = [
  // ── Leptons ──────────────────────────────────────────────────────────────
  {
    id: "electron",
    name: "Electron",
    symbol: String.raw`e`,
    family: "Lepton",
    accent: "var(--field-accent-lepton)",
    description: "First-generation charged lepton and a core constituent of ordinary atoms.",
    fieldStructure: leptonFieldStructure + String.raw`,\quad ${C.L("\\psi")}\in(\mathbf{1},\mathbf{2})_{-1/2}\oplus(\mathbf{1},\mathbf{1})_{-1}`,
    fieldStructureExpanded: leptonFieldStructureExpanded + String.raw`,\quad ${C.L("\\psi")}\in(\mathbf{1},\mathbf{2})_{-1/2}\oplus(\mathbf{1},\mathbf{1})_{-1}`,
    freeLagrangian: leptonFreeLagrangian,
    nonRelEquation: leptonNonRel,
    nonRelName: "Schrödinger equation",
    relEquation: leptonRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`U(1)_{\mathrm{em}}\ \text{(local)}`,
      localRule: String.raw`\psi(x)\to e^{iq\alpha(x)}\psi(x),\quad A_\mu\to A_\mu-\partial_\mu\alpha(x)`,
      interpretation: "Local phase rotations enforce electromagnetic gauge invariance and minimal coupling to ",
      interpretationMath: String.raw`A_\mu`,
    },
  },
  {
    id: "muon",
    name: "Muon",
    symbol: String.raw`\mu`,
    family: "Lepton",
    accent: "var(--field-accent-lepton)",
    description: "Heavier charged-lepton partner of the electron, unstable outside collision environments.",
    fieldStructure: leptonFieldStructure,
    fieldStructureExpanded: leptonFieldStructureExpanded,
    freeLagrangian: leptonFreeLagrangian,
    nonRelEquation: leptonNonRel,
    nonRelName: "Schrödinger equation",
    relEquation: leptonRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\times U(1)_Y\to U(1)_{\mathrm{em}}`,
      localRule: String.raw`\psi_{L}\to U_L(x)\psi_{L},\quad \psi_{R}\to e^{iy\beta(x)}\psi_{R}`,
      interpretation: "Same electric representation as the electron, with chiral electroweak couplings.",
    },
  },
  {
    id: "tau",
    name: "Tau",
    symbol: String.raw`\tau`,
    family: "Lepton",
    accent: "var(--field-accent-lepton)",
    description: "The heaviest charged lepton, with a very short lifetime.",
    fieldStructure: leptonFieldStructure,
    fieldStructureExpanded: leptonFieldStructureExpanded,
    freeLagrangian: leptonFreeLagrangian,
    nonRelEquation: leptonNonRel,
    nonRelName: "Schrödinger equation",
    relEquation: leptonRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\times U(1)_Y\to U(1)_{\mathrm{em}}`,
      localRule: String.raw`\psi_{\tau,L}\to U_L(x)\psi_{\tau,L},\quad \psi_{\tau,R}\to e^{iy_\tau\beta(x)}\psi_{\tau,R}`,
      interpretation: "Carries the same electromagnetic charge and chiral electroweak pattern as other charged leptons.",
    },
  },

  // ── Neutrinos ────────────────────────────────────────────────────────────
  {
    id: "nu-e",
    name: "Electron neutrino",
    symbol: String.raw`\nu_e`,
    family: "Neutrino",
    accent: "var(--field-accent-neutrino)",
    description: "Electron-flavor neutrino with no direct electromagnetic charge.",
    fieldStructure: String.raw`${C.N("\\nu")}=\nu_{L},\quad ${C.N("\\psi_{\\nu}")}=P_L${C.N("\\psi_{\\nu}")}`,
    fieldStructureExpanded: neutrinoFieldStructureExpanded,
    freeLagrangian: neutrinoFreeLagrangian,
    nonRelEquation: neutrinoNonRel,
    nonRelName: "MSW evolution equation",
    relEquation: neutrinoRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\times U(1)_Y\ \text{(local)}`,
      localRule: String.raw`\nu_{e,L}\to U_L(x)\nu_{e,L},\quad Y=-\tfrac{1}{2}`,
      interpretation: "Belongs to a left-handed electroweak doublet and has no direct U(1)_em coupling.",
      interpretationMath: String.raw`U(1)_{\mathrm{em}}`,
    },
  },
  {
    id: "nu-mu",
    name: "Muon neutrino",
    symbol: String.raw`\nu_\mu`,
    family: "Neutrino",
    accent: "var(--field-accent-neutrino)",
    description: "Second-generation neutrino participating in flavor oscillations.",
    fieldStructure: String.raw`${C.N("\\nu")}=\nu_{L}`,
    fieldStructureExpanded: neutrinoFieldStructureExpanded,
    freeLagrangian: neutrinoFreeLagrangian,
    nonRelEquation: neutrinoNonRel,
    nonRelName: "MSW evolution equation",
    relEquation: neutrinoRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\times U(1)_Y\ \text{(local)}`,
      localRule: String.raw`\nu_{\mu,L}\to U_L(x)\nu_{\mu,L}`,
      interpretation: "Shares electroweak gauge structure with other neutrinos; flavor mixing is encoded by PMNS.",
    },
  },
  {
    id: "nu-tau",
    name: "Tau neutrino",
    symbol: String.raw`\nu_\tau`,
    family: "Neutrino",
    accent: "var(--field-accent-neutrino)",
    description: "Tau-flavor neutrino with the same left-chiral structure as other neutrinos.",
    fieldStructure: String.raw`${C.N("\\nu")}=\nu_{L}`,
    fieldStructureExpanded: neutrinoFieldStructureExpanded,
    freeLagrangian: neutrinoFreeLagrangian,
    nonRelEquation: neutrinoNonRel,
    nonRelName: "MSW evolution equation",
    relEquation: neutrinoRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\times U(1)_Y\ \text{(local)}`,
      localRule: String.raw`\nu_{\tau,L}\to U_L(x)\nu_{\tau,L}`,
      interpretation: "Transforms as a component of an electroweak doublet under local gauge symmetry.",
    },
  },

  // ── Quarks ───────────────────────────────────────────────────────────────
  {
    id: "up",
    name: "Up quark",
    symbol: String.raw`u`,
    family: "Quark",
    accent: "var(--field-accent-quark)",
    description: "Charge +2/3 quark contributing to proton and neutron structure.",
    fieldStructure: quarkFieldStructure,
    fieldStructureExpanded: quarkFieldStructureExpanded,
    freeLagrangian: quarkFreeLagrangian,
    nonRelEquation: quarkNonRel,
    nonRelName: "Pauli equation",
    relEquation: quarkRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`SU(3)_c\times SU(2)_L\times U(1)_Y\ \text{(local)}`,
      localRule: String.raw`u^a\to U_c^{ab}(x)u^b,\quad q_L\to U_L(x)q_L`,
      interpretation: "Carries color charge and electroweak quantum numbers; covariant derivatives encode local gauge transport.",
      interpretationMath: String.raw`D_\mu`,
    },
  },
  {
    id: "down",
    name: "Down quark",
    symbol: String.raw`d`,
    family: "Quark",
    accent: "var(--field-accent-quark)",
    description: "Charge -1/3 quark paired with up quarks in light hadrons.",
    fieldStructure: quarkFieldStructure,
    fieldStructureExpanded: quarkFieldStructureExpanded,
    freeLagrangian: quarkFreeLagrangian,
    nonRelEquation: quarkNonRel,
    nonRelName: "Pauli equation",
    relEquation: quarkRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`SU(3)_c\times SU(2)_L\times U(1)_Y\to U(1)_{\mathrm{em}}`,
      localRule: String.raw`d^a\to U_c^{ab}(x)d^b`,
      interpretation: "Color gauge invariance plus electroweak charges; electromagnetic coupling appears after symmetry breaking.",
      interpretationMath: String.raw`U(1)_{\mathrm{em}}`,
    },
  },
  {
    id: "charm",
    name: "Charm quark",
    symbol: String.raw`c`,
    family: "Quark",
    accent: "var(--field-accent-quark)",
    description: "Heavy second-generation quark.",
    fieldStructure: quarkFieldStructureShort,
    fieldStructureExpanded: quarkFieldStructureExpandedShort,
    freeLagrangian: quarkFreeLagrangian,
    nonRelEquation: quarkNonRel,
    nonRelName: "Pauli equation",
    relEquation: quarkRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`SU(3)_c\times SU(2)_L\times U(1)_Y\ \text{(local)}`,
      localRule: String.raw`c^a\to U_c^{ab}(x)c^b`,
      interpretation: "Transforms in the same color representation as all quarks and couples to electroweak fields.",
    },
  },
  {
    id: "strange",
    name: "Strange quark",
    symbol: String.raw`s`,
    family: "Quark",
    accent: "var(--field-accent-quark)",
    description: "Second-generation quark associated with strange hadron states.",
    fieldStructure: quarkFieldStructureShort,
    fieldStructureExpanded: quarkFieldStructureExpandedShort,
    freeLagrangian: quarkFreeLagrangian,
    nonRelEquation: quarkNonRel,
    nonRelName: "Pauli equation",
    relEquation: quarkRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`SU(3)_c\times SU(2)_L\times U(1)_Y\to U(1)_{\mathrm{em}}`,
      localRule: String.raw`s^a\to U_c^{ab}(x)s^b`,
      interpretation: "Color triplet with electroweak charges, ending in electromagnetic interactions after breaking.",
      interpretationMath: String.raw`U(1)_{\mathrm{em}}`,
    },
  },
  {
    id: "top",
    name: "Top quark",
    symbol: String.raw`t`,
    family: "Quark",
    accent: "var(--field-accent-quark)",
    description: "Most massive quark, decaying before full hadronization.",
    fieldStructure: quarkFieldStructureShort,
    fieldStructureExpanded: quarkFieldStructureExpandedShort,
    freeLagrangian: quarkFreeLagrangian,
    nonRelEquation: quarkNonRel,
    nonRelName: "Pauli equation",
    relEquation: quarkRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`SU(3)_c\times SU(2)_L\times U(1)_Y\ \text{(local)}`,
      localRule: String.raw`t^a\to U_c^{ab}(x)t^b`,
      interpretation: "Local color invariance with strong Yukawa coupling to the Higgs sector.",
    },
  },
  {
    id: "bottom",
    name: "Bottom quark",
    symbol: String.raw`b`,
    family: "Quark",
    accent: "var(--field-accent-quark)",
    description: "Third-generation down-type quark appearing in B mesons.",
    fieldStructure: quarkFieldStructureShort,
    fieldStructureExpanded: quarkFieldStructureExpandedShort,
    freeLagrangian: quarkFreeLagrangian,
    nonRelEquation: quarkNonRel,
    nonRelName: "Pauli equation",
    relEquation: quarkRel,
    relName: "Dirac equation",
    symmetry: {
      gaugeGroup: String.raw`SU(3)_c\times SU(2)_L\times U(1)_Y\ \text{(local)}`,
      localRule: String.raw`b^a\to U_c^{ab}(x)b^b`,
      interpretation: "Same local gauge structure as other down-type quarks.",
    },
  },

];

const brokenBosonCatalog = [
  {
    id: "photon",
    name: "Photon",
    symbol: String.raw`\gamma`,
    family: "Gauge boson",
    accent: "var(--field-accent-gauge)",
    description: "Massless gauge boson of electromagnetism.",
    fieldStructure: String.raw`${C.G("A_\\mu")}=\left(\phi,\,A_x,\,A_y,\,A_z\right)`,
    freeLagrangian: String.raw`\mathcal{L}_{0,\gamma}=-\frac{1}{4}F_{\mu\nu}F^{\mu\nu},\quad F_{\mu\nu}=\partial_\mu ${C.G("A_\\nu")}-\partial_\nu ${C.G("A_\\mu")}`,
    nonRelEquation: String.raw`\nabla\cdot\mathbf{E}=\rho,\quad \nabla\times\mathbf{B}-\partial_t\mathbf{E}=\mathbf{J}`,
    nonRelName: "Maxwell equations",
    relEquation: String.raw`\partial_\mu F^{\mu\nu}=J^\nu`,
    relName: "Maxwell equation (covariant)",
    symmetry: {
      gaugeGroup: String.raw`\text{Emergent }U(1)_{\mathrm{em}}\text{ from local }U(1)`,
      localRule: String.raw`A_\mu\to A_\mu-\partial_\mu\alpha(x),\quad \psi\to e^{iq\alpha(x)}\psi`,
      interpretation: "The photon field emerges as the gauge connection required by local U(1) phase symmetry.",
    },
  },
  {
    id: "w-boson",
    name: "W boson",
    symbol: String.raw`W^{\pm}`,
    family: "Gauge boson",
    accent: "var(--field-accent-gauge)",
    description: "Charged weak-interaction gauge bosons.",
    fieldStructure: String.raw`${C.G("W_\\mu")}^\pm=\frac{1}{\sqrt{2}}\left(W_\mu^1\mp iW_\mu^2\right)`,
    freeLagrangian: String.raw`\mathcal{L}_{0,W}=-\frac{1}{2}W^+_{\mu\nu}W^{-\mu\nu}+m_W^2${C.G("W")}^+_\mu ${C.G("W")}^{-\mu}`,
    nonRelEquation: String.raw`i\partial_t${C.G("\\mathbf{W}")}\approx\left(-\frac{\nabla^2}{2m_W}+V\right)${C.G("\\mathbf{W}")}`,
    nonRelName: "Proca-like equation",
    relEquation: String.raw`\partial_\mu W^{\mu\nu}+m_W^2${C.G("W")}^\nu=J_W^\nu`,
    relName: "Proca equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\ \text{(local)}`,
      localRule: String.raw`W_\mu^i\to U_L(x)W_\mu^iU_L^{-1}(x)-\frac{i}{g}(\partial_\mu U_L)U_L^{-1}`,
      interpretation: "They originate as local SU(2)_L gauge fields and become massive after electroweak breaking.",
    },
  },
  {
    id: "z-boson",
    name: "Z boson",
    symbol: String.raw`Z`,
    family: "Gauge boson",
    accent: "var(--field-accent-gauge)",
    description: "Neutral weak-interaction gauge boson.",
    fieldStructure: String.raw`${C.G("Z_\\mu")}=\cos\theta_W\,W_\mu^3-\sin\theta_W\,B_\mu`,
    freeLagrangian: String.raw`\mathcal{L}_{0,Z}=-\frac{1}{4}Z_{\mu\nu}Z^{\mu\nu}+\frac{m_Z^2}{2}${C.G("Z_\\mu")} ${C.G("Z")}^\mu`,
    nonRelEquation: String.raw`i\partial_t${C.G("\\mathbf{Z}")}\approx\left(-\frac{\nabla^2}{2m_Z}+V\right)${C.G("\\mathbf{Z}")}`,
    nonRelName: "Proca-like equation",
    relEquation: String.raw`\partial_\mu Z^{\mu\nu}+m_Z^2${C.G("Z")}^\nu=J_Z^\nu`,
    relName: "Proca equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\times U(1)_Y\to U(1)_{\mathrm{em}}`,
      localRule: String.raw`Z_\mu=\cos\theta_W W_\mu^3-\sin\theta_W B_\mu`,
      interpretation: "Arises from electroweak mixing of local SU(2)_L and U(1)_Y gauge fields.",
      interpretationMath: String.raw`\theta_W`,
    },
  },
  {
    id: "higgs",
    name: "Higgs boson",
    symbol: String.raw`H`,
    family: "Scalar",
    accent: "var(--field-accent-scalar)",
    description: "Scalar excitation of the Higgs doublet responsible for effective particle masses.",
    fieldStructure: String.raw`${C.S("\\Phi")}=\frac{1}{\sqrt{2}}\begin{pmatrix}\phi_1+i\phi_2\\ v+h+i\phi_3\end{pmatrix}`,
    freeLagrangian: String.raw`\mathcal{L}_0=\left(D_\mu${C.S("\\Phi")}\right)^\dagger\left(D^\mu${C.S("\\Phi")}\right)-\mu^2${C.S("\\Phi")}^\dagger${C.S("\\Phi")}-\lambda\left(${C.S("\\Phi")}^\dagger${C.S("\\Phi")}\right)^2`,
    nonRelEquation: String.raw`i\partial_t${C.S("\\varphi")}=\left(-\frac{\nabla^2}{2m}+V_{\text{eff}}\right)${C.S("\\varphi")}`,
    nonRelName: "Schrödinger equation",
    relEquation: String.raw`\left(\Box+m^2\right)${C.S("h")}=0\quad(\text{to leading order around the vacuum})`,
    relName: "Klein–Gordon equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\times U(1)_Y\to U(1)_{\mathrm{em}}`,
      localRule: String.raw`\Phi\to e^{i\beta(x)Y}U_L(x)\Phi,\quad \langle\Phi\rangle\neq 0`,
      interpretation: "The vacuum expectation value breaks electroweak symmetry to electromagnetic U(1)_em.",
      interpretationMath: String.raw`\langle\Phi\rangle,\ U(1)_{\mathrm{em}}`,
    },
  },
];

const restoredBosonCatalog = [
  {
    id: "w1-boson",
    name: "W1 boson",
    symbol: String.raw`W^1`,
    family: "Gauge boson",
    accent: "var(--field-accent-gauge)",
    description: "First weak-isospin gauge field in the unbroken electroweak phase.",
    fieldStructure: weakFieldStructure(1),
    freeLagrangian: weakFreeLagrangian(1),
    nonRelEquation: weakPlasmaEquation(1),
    nonRelName: "Yang-Mills plasma equation",
    relEquation: weakYangMillsEquation(1),
    relName: "Yang-Mills equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\ \text{(local)}`,
      localRule: String.raw`W_\mu^i\to U_L(x)W_\mu^iU_L^{-1}(x)-\frac{i}{g}(\partial_\mu U_L)U_L^{-1}`,
      interpretation: "Before symmetry breaking, W1 is one component of the massless SU(2)_L gauge triplet in the thermal plasma.",
    },
  },
  {
    id: "w2-boson",
    name: "W2 boson",
    symbol: String.raw`W^2`,
    family: "Gauge boson",
    accent: "var(--field-accent-gauge)",
    description: "Second weak-isospin gauge field in the unbroken electroweak phase.",
    fieldStructure: weakFieldStructure(2),
    freeLagrangian: weakFreeLagrangian(2),
    nonRelEquation: weakPlasmaEquation(2),
    nonRelName: "Yang-Mills plasma equation",
    relEquation: weakYangMillsEquation(2),
    relName: "Yang-Mills equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\ \text{(local)}`,
      localRule: String.raw`W_\mu^i\to U_L(x)W_\mu^iU_L^{-1}(x)-\frac{i}{g}(\partial_\mu U_L)U_L^{-1}`,
      interpretation: "Before symmetry breaking, W2 is another massless component of the SU(2)_L gauge connection.",
    },
  },
  {
    id: "w3-boson",
    name: "W3 boson",
    symbol: String.raw`W^3`,
    family: "Gauge boson",
    accent: "var(--field-accent-gauge)",
    description: "Neutral weak-isospin gauge field before mixing with hypercharge.",
    fieldStructure: weakFieldStructure(3),
    freeLagrangian: weakFreeLagrangian(3),
    nonRelEquation: weakPlasmaEquation(3),
    nonRelName: "Yang-Mills plasma equation",
    relEquation: weakYangMillsEquation(3),
    relName: "Yang-Mills equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\ \text{(local)}`,
      localRule: String.raw`W_\mu^i\to U_L(x)W_\mu^iU_L^{-1}(x)-\frac{i}{g}(\partial_\mu U_L)U_L^{-1}`,
      interpretation: "In the restored phase, W3 is still a weak-isospin gauge boson; it has not yet mixed into the photon and Z.",
      interpretationMath: String.raw`A_\mu,\ Z_\mu`,
    },
  },
  {
    id: "b-boson",
    name: "B boson",
    symbol: String.raw`B`,
    family: "Gauge boson",
    accent: "var(--field-accent-gauge)",
    description: "Massless hypercharge gauge boson before electroweak mixing.",
    fieldStructure: String.raw`${C.G("B_\\mu")}=\left(B_0,\,B_1,\,B_2,\,B_3\right),\quad D_\mu=\partial_\mu-ig'YB_\mu`,
    freeLagrangian: String.raw`\mathcal{L}_{0,B}=-\frac{1}{4}B_{\mu\nu}B^{\mu\nu},\quad ${hyperchargeFieldStrength}`,
    nonRelEquation: String.raw`\nabla\cdot\mathbf{E}_Y=g'\rho_Y,\quad\nabla\times\mathbf{B}_Y-\partial_t\mathbf{E}_Y=g'\mathbf{J}_Y`,
    nonRelName: "Hypercharge Maxwell equations",
    relEquation: String.raw`\partial_\mu B^{\mu\nu}=g'J_Y^\nu`,
    relName: "Maxwell equation (covariant)",
    symmetry: {
      gaugeGroup: String.raw`U(1)_Y\ \text{(local)}`,
      localRule: String.raw`B_\mu\to B_\mu-\partial_\mu\beta(x),\quad\psi\to e^{ig'Y\beta(x)}\psi`,
      interpretation: "In the restored phase, B carries hypercharge only; the photon and Z have not formed yet.",
      interpretationMath: String.raw`W_\mu^3`,
    },
  },
  {
    id: "higgs",
    name: "Higgs boson",
    symbol: String.raw`H`,
    family: "Scalar",
    accent: "var(--field-accent-scalar)",
    description: "Thermal Higgs doublet before a vacuum expectation value forms.",
    fieldStructure: symmetricHiggsField,
    freeLagrangian: String.raw`\mathcal{L}_{0,\Phi}=\left(D_\mu${C.S("\\Phi")}\right)^\dagger\left(D^\mu${C.S("\\Phi")}\right)-${symmetricHiggsPotential}`,
    nonRelEquation: String.raw`i\partial_t${C.S("\\Phi")}\approx\left(-\frac{\nabla^2}{2m_{\mathrm{eff}}(T)}+\frac{\partial V_T}{\partial ${C.S("\\Phi")}^\dagger}\right)${C.S("\\Phi")}`,
    nonRelName: "Thermal Higgs mode equation",
    relEquation: String.raw`D_\mu D^\mu${C.S("\\Phi")}+\frac{\partial V_T}{\partial ${C.S("\\Phi")}^\dagger}=0`,
    relName: "Finite-temperature field equation",
    symmetry: {
      gaugeGroup: String.raw`SU(2)_L\times U(1)_Y\ \text{(local)}`,
      localRule: String.raw`\Phi\to e^{i\beta(x)Y}U_L(x)\Phi,\quad \langle\Phi\rangle=0`,
      interpretation: "At sufficiently high temperature the Higgs vacuum expectation value vanishes, restoring the full electroweak gauge symmetry.",
      interpretationMath: String.raw`\langle\Phi\rangle`,
    },
  },
];

const brokenBosonRows = [["photon", "z-boson"], ["w-boson", "higgs"]];
const restoredBosonRows = [["w1-boson", "w2-boson"], ["w3-boson", "b-boson"], ["higgs"]];

function FieldCatalogPanel() {
  const [selectedParticleId, setSelectedParticleId] = useState(fermionCatalog[0].id);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFieldExpanded, setIsFieldExpanded] = useState(false);
  const [isRelativistic, setIsRelativistic] = useState(false);
  const [isElectroweakRestored, setIsElectroweakRestored] = useState(false);
  const activeBosonCatalog = isElectroweakRestored ? restoredBosonCatalog : brokenBosonCatalog;
  const activeBosonRows = isElectroweakRestored ? restoredBosonRows : brokenBosonRows;
  const activeCatalog = useMemo(
    () => [...fermionCatalog, ...activeBosonCatalog],
    [activeBosonCatalog]
  );
  const selectedParticle = useMemo(
    () => activeCatalog.find((particle) => particle.id === selectedParticleId) || activeCatalog[0],
    [activeCatalog, selectedParticleId]
  );

  useEffect(() => {
    if (activeCatalog.some((particle) => particle.id === selectedParticleId)) {
      return;
    }

    setSelectedParticleId(activeCatalog[0].id);
  }, [activeCatalog, selectedParticleId]);

  useEffect(() => {
    if (!isProfileOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isProfileOpen]);

  const openProfile = (particleId) => {
    setSelectedParticleId(particleId);
    setIsProfileOpen(true);
  };

  const renderCard = (id) => {
    const p = activeCatalog.find((x) => x.id === id);
    if (!p) return null;
    return (
      <button
        key={id}
        type="button"
        className={`field-card ${selectedParticle.id === p.id ? "is-active" : ""}`}
        style={{ "--field-accent": p.accent }}
        onClick={() => openProfile(p.id)}
        aria-label={`${p.name} (${p.family})`}
      >
        <span className="field-card-name">{p.name}</span>
        <span className="field-card-symbol">
          <InlineMath math={p.symbol} />
        </span>
      </button>
    );
  };

  const generations = [
    { lepton: "electron", neutrino: "nu-e",  quarks: ["up", "down"] },
    { lepton: "muon",     neutrino: "nu-mu",  quarks: ["charm", "strange"] },
    { lepton: "tau",      neutrino: "nu-tau",  quarks: ["top", "bottom"] },
  ];

  const isFermion = ["Lepton", "Neutrino", "Quark"].includes(selectedParticle.family);

  return (
    <section className="field-catalog-panel" aria-label="Field catalog">
      <h1 className="content-title">Field catalog</h1>
      <p className="field-catalog-intro">
        Explore the Standard Model particles as interactive field cards. Click one card to open its field profile,
        from field structure to free dynamics and gauge symmetry.
      </p>

      <div className="field-catalog-toolbar">
        <label className="field-phase-toggle" style={{ "--field-accent": "var(--field-accent-gauge)" }}>
          <span className="field-phase-badge">Experimental</span>
          <span className="field-phase-copy">
            <span className="field-phase-title">
              {isElectroweakRestored ? "Electroweak symmetry restored !" : "Restore electroweak symmetry"}
            </span>
            <span className="field-phase-subtitle">
              {isElectroweakRestored
                ? "Showing unbroken SU(2)L x U(1)Y bosons from the early electroweak plasma."
                : "Showing post-breaking photon, W±, Z, and Higgs bosons."}
            </span>
          </span>
          <input
            type="checkbox"
            checked={isElectroweakRestored}
            onChange={() => setIsElectroweakRestored((value) => !value)}
            aria-label={isElectroweakRestored ? "Electroweak symmetry restored !" : "Restore electroweak symmetry"}
          />
        </label>
      </div>

      <div className="field-catalog-table">
        {/* ── Fermion generation grid ─────────────────────────── */}
        <section className="field-catalog-fermions" aria-label="Fermion generations">
          <h2 className="field-catalog-group-title">Fermions</h2>

          <div className="fermion-grid">
            {/* Row 1 – charged leptons */}
            {generations.map((g) => (
              <div key={g.lepton} className="fermion-cell">{renderCard(g.lepton)}</div>
            ))}

            {/* Row 2 – neutrinos */}
            {generations.map((g) => (
              <div key={g.neutrino} className="fermion-cell">{renderCard(g.neutrino)}</div>
            ))}

            {/* Row 3+4 – quarks stacked vertically */}
            {generations.map((g) => (
              <div key={`quarks-${g.lepton}`} className="fermion-cell quark-stack">
                {g.quarks.map((q) => renderCard(q))}
              </div>
            ))}
          </div>
        </section>

        {/* ── Boson column ────────────────────────────────────── */}
        <aside className="field-catalog-bosons" aria-label="Bosons">
          <h2 className="field-catalog-group-title">Bosons</h2>

          <div className="boson-stack">
            {activeBosonRows.map((row) => (
              <div key={row.join("-")} className={`boson-row ${row.length === 1 ? "is-single" : ""}`}>
                {row.map((bosonId) => renderCard(bosonId))}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {isProfileOpen ? (
        <div
          className="field-profile-modal-backdrop"
          role="presentation"
          onClick={() => setIsProfileOpen(false)}
        >
          <article
            className="field-profile field-profile-modal"
            style={{ "--field-accent": selectedParticle.accent }}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedParticle.name} profile`}
            aria-live="polite"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="field-profile-close"
              onClick={() => setIsProfileOpen(false)}
              aria-label="Close profile"
            >
              x
            </button>

            <header className="field-profile-head" style={{ "--field-accent": selectedParticle.accent }}>
              <p className="field-profile-family">{selectedParticle.family}</p>
              <h2 className="field-profile-title">{selectedParticle.name}</h2>
            </header>

            <div className="field-profile-section" style={{ "--field-accent": selectedParticle.accent }}>
              <div className="field-section-header">
                <h3>Field Structure</h3>
                {isFermion && selectedParticle.fieldStructureExpanded && (
                  <label className="field-toggle">
                    <input
                      type="checkbox"
                      checked={isFieldExpanded}
                      onChange={() => setIsFieldExpanded((v) => !v)}
                    />
                    <span>{isFieldExpanded ? "Collapse" : "Expand"}</span>
                  </label>
                )}
              </div>
              <BlockMath
                math={
                  isFieldExpanded && selectedParticle.fieldStructureExpanded
                    ? selectedParticle.fieldStructureExpanded
                    : selectedParticle.fieldStructure
                }
              />
            </div>

            <div className="field-profile-section" style={{ "--field-accent": selectedParticle.accent }}>
              <h3>Free Lagrangian</h3>
              <BlockMath math={selectedParticle.freeLagrangian} />
            </div>

            <div className="field-profile-section" style={{ "--field-accent": selectedParticle.accent }}>
              <div className="field-section-header">
                <h3>{isRelativistic ? selectedParticle.relName : selectedParticle.nonRelName}</h3>
                <label className="field-toggle">
                  <input
                    type="checkbox"
                    checked={isRelativistic}
                    onChange={() => setIsRelativistic((v) => !v)}
                  />
                  <span>{isRelativistic ? "Relativistic" : "Non-relativistic"}</span>
                </label>
              </div>
              <BlockMath
                math={isRelativistic ? selectedParticle.relEquation : selectedParticle.nonRelEquation}
              />
            </div>

            <div className="field-profile-section" style={{ "--field-accent": selectedParticle.accent }}>
              <h3>Gauge Symmetry</h3>
              <dl className="field-profile-symmetry-grid">
                <dt>Group</dt>
                <dd>
                  <InlineMath math={selectedParticle.symmetry.gaugeGroup} />
                </dd>
                <dt>Local Transformation</dt>
                <dd>
                  <BlockMath math={selectedParticle.symmetry.localRule} />
                </dd>
                <dt>Physical Meaning</dt>
                <dd>
                  {selectedParticle.symmetry.interpretation}
                  {selectedParticle.symmetry.interpretationMath ? (
                    <>
                      {" "}
                      <InlineMath math={selectedParticle.symmetry.interpretationMath} />
                    </>
                  ) : null}
                </dd>
              </dl>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}

export default FieldCatalogPanel;
