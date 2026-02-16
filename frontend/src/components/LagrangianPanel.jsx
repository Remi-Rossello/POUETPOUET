import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const equationTree = {
  root: {
    id: "root",
    title: "Standard Model Lagrangian",
    prefix: String.raw`\mathcal{L}_{SM} =`,
    terms: [
      {
        id: "gauge",
        operator: "",
        math: String.raw`-\frac{1}{4}F_{\mu\nu}F^{\mu\nu}`,
        className: "term-gauge",
        next: "gauge",
      },
      {
        id: "fermion",
        operator: "+",
        math: String.raw`i\bar{\psi}\gamma^\mu D_\mu\psi`,
        className: "term-fermion",
        next: "fermion",
      },
      {
        id: "yukawa",
        operator: "−",
        math: String.raw`\left(y\bar{\psi}_L H\psi_R+h.c.\right)`,
        className: "term-yukawa",
        next: "yukawa",
      },
      {
        id: "higgs",
        operator: "+",
        math: String.raw`|D_\mu H|^2-V(H)`,
        className: "term-higgs",
        next: "higgs",
      },
    ],
  },
  gauge: {
    id: "gauge",
    title: "Gauge sector",
    className: "term-gauge",
    prefix: String.raw`-\frac{1}{4}F_{\mu\nu}F^{\mu\nu} =`,
    terms: [
      { id: "su3", operator: "−", math: String.raw`\frac{1}{4}G^a_{\mu\nu}G^{a\mu\nu}`, className: "term-gauge", next: "gauge-su3" },
      { id: "su2", operator: "−", math: String.raw`\frac{1}{4}W^i_{\mu\nu}W^{i\mu\nu}`, className: "term-gauge", next: "gauge-su2" },
      { id: "u1", operator: "−", math: String.raw`\frac{1}{4}B_{\mu\nu}B^{\mu\nu}`, className: "term-gauge", next: "gauge-u1" },
    ],
    braceMath: String.raw`\mathcal{L}_{gauge}=-\frac{1}{4}F_{\mu\nu}F^{\mu\nu},\quad F_{\mu\nu}F^{\mu\nu}=G^a_{\mu\nu}G^{a\mu\nu}+W^i_{\mu\nu}W^{i\mu\nu}+B_{\mu\nu}B^{\mu\nu}`,
    explanation: "These are the gauge-boson kinetic terms, one for each interaction field.",
  },
  "gauge-su3": {
    id: "gauge-su3",
    title: "Gluon field tensor",
    className: "term-gauge",
    prefix: String.raw`G^a_{\mu\nu}=`,
    terms: [
      {
        id: "su3-gmu",
        operator: "",
        math: String.raw`\partial_\mu G^a_\nu-\partial_\nu G^a_\mu`,
        className: "term-gauge",
        next: "gauge-su3-gmu",
      },
      {
        id: "su3-fabc",
        operator: "+",
        math: String.raw`g_sf^{abc}G^b_\mu G^c_\nu`,
        className: "term-gauge",
        next: "gauge-su3-fabc",
      },
    ],
    explanation: "Click the term with Gμ to view the gluon field column, or click the f^{abc} term to expand the non-abelian structure.",
    braceMath: String.raw`G^a_{\mu\nu}=\partial_\mu G^a_\nu-\partial_\nu G^a_\mu+g_sf^{abc}G^b_\mu G^c_\nu`,
  },
  "gauge-su3-gmu": {
    id: "gauge-su3-gmu",
    title: "Gluon 4-vector field for a given color charge a",
    className: "term-gauge",
    fullMath: String.raw`G_\mu^a(x)=\left(\phi^a(x),\,\vec{G}^{\,a}(x)\right)=\left(\phi^a(x),\,G_x^a(x),\,G_y^a(x),\,G_z^a(x)\right)`,
    explanation: "For fixed a, this has the same 4-potential structure as electromagnetism, but carries a color index.",
    braceMath: String.raw`A_\mu(x)=\left(\phi(x),\,\vec{A}(x)\right)\quad\leftrightarrow\quad G_\mu^a(x)=\left(\phi^a(x),\,\vec{G}^{\,a}(x)\right)`,
  },
  "gauge-su3-fabc": {
    id: "gauge-su3-fabc",
    title: "Structure constants expansion",
    className: "term-gauge",
    fullMath: String.raw`[T^a,T^b]=if^{abc}T^c\quad\Rightarrow\quad g_sf^{abc}G_\mu^bG_\nu^c`,
    explanation: "This term encodes gluon self-interactions coming from the non-commuting SU(3)c generators.",
    braceMath: String.raw`f^{123}=1,\;f^{147}=f^{246}=f^{257}=f^{345}=\tfrac{1}{2},\;\dots`,
  },
  "gauge-su2": {
    id: "gauge-su2",
    title: "Weak field tensor",
    className: "term-gauge",
    fullMath: String.raw`W^i_{\mu\nu} = \partial_\mu W^i_\nu - \partial_\nu W^i_\mu + g\,\epsilon^{ijk}W^j_\mu W^k_\nu`,
    braceMath: String.raw`\underbrace{\epsilon^{ijk}W^j_\mu W^k_\nu}_{\text{non-abelian structure of }SU(2)_L}`,
  },
  "gauge-u1": {
    id: "gauge-u1",
    title: "Hypercharge field tensor",
    className: "term-gauge",
    prefix: String.raw`B_{\mu\nu}=`,
    terms: [
      {
        id: "u1-derivative",
        operator: "",
        math: String.raw`\partial_\mu B_\nu-\partial_\nu B_\mu`,
        className: "term-gauge",
        next: "gauge-u1-potential",
      },
    ],
    explanation: "Click the derivative term to see the underlying hypercharge 4-potential field.",
    braceMath: String.raw`\underbrace{B_{\mu\nu}}_{\text{abelian sector }U(1)_Y}`,
  },
  "gauge-u1-potential": {
    id: "gauge-u1-potential",
    title: "Hypercharge 4-vector potential",
    className: "term-gauge",
    fullMath: String.raw`B_\mu(x)=\left(B_0(x),\,B_x(x),\,B_y(x),\,B_z(x)\right)`,
    explanation: "This is the U(1)Y gauge potential, analogous to the electromagnetic 4-potential.",
    braceMath: String.raw`B_{\mu\nu}=\partial_\mu B_\nu-\partial_\nu B_\mu`,
  },
  fermion: {
    id: "fermion",
    title: "Fermion sector",
    className: "term-fermion",
    prefix: String.raw`i\bar{\psi}\gamma^\mu D_\mu\psi =`,
    terms: [
      {
        id: "f-sum",
        operator: "",
        math: String.raw`\sum_f i\bar{\psi}_f\gamma^\mu D_\mu\psi_f`,
        className: "term-fermion",
        next: "fermion-single-field",
      },
    ],
    braceMath: String.raw`\mathcal{L}_{fermions}=\sum_f i\bar{\psi}_f\gamma^\mu D_\mu\psi_f`,
    explanation: "The fermion contribution is written as a compact sum over all fermion flavors f.",
  },
  "fermion-single-field": {
    id: "fermion-single-field",
    title: "Lagrangian density of a single fermion field",
    className: "term-fermion",
    fullMath: String.raw`\mathcal{L}_f=i\bar{\psi}_f\gamma^\mu\left(\partial_\mu+\color{#ff8ac8}{\left(-ig_sT^aG^a_\mu-ig\frac{\tau^i}{2}W^i_\mu-ig'YB_\mu\right)}\right)\psi_f`,
    explanation: "Here the covariant derivative is expanded into strong, weak, and hypercharge gauge interactions.",
    braceMath: String.raw`D_\mu=\partial_\mu-ig_sT^aG^a_\mu-ig\frac{\tau^i}{2}W^i_\mu-ig'YB_\mu`,
  },
  "fermion-nue": {
    id: "fermion-nue",
    title: "Electron neutrino",
    className: "term-fermion-gen1",
    fullMath: String.raw`\mathcal{L}_{\nu_e}= i\bar{\nu}_e\gamma^\mu D_\mu\nu_e`,
    braceMath: String.raw`Q=0,\quad L=1`,
  },
  "fermion-e": {
    id: "fermion-e",
    title: "Electron",
    className: "term-fermion-gen1",
    fullMath: String.raw`\mathcal{L}_{e}= i\bar{e}\gamma^\mu D_\mu e`,
    braceMath: String.raw`Q=-1,\quad L=1`,
  },
  "fermion-numu": {
    id: "fermion-numu",
    title: "Muon neutrino",
    className: "term-fermion-gen2",
    fullMath: String.raw`\mathcal{L}_{\nu_\mu}= i\bar{\nu}_{\mu}\gamma^\mu D_\mu\nu_{\mu}`,
    braceMath: String.raw`Q=0,\quad L=1`,
  },
  "fermion-mu": {
    id: "fermion-mu",
    title: "Muon",
    className: "term-fermion-gen2",
    fullMath: String.raw`\mathcal{L}_{\mu}= i\bar{\mu}\gamma^\mu D_\mu\mu`,
    braceMath: String.raw`Q=-1,\quad L=1`,
  },
  "fermion-nutau": {
    id: "fermion-nutau",
    title: "Tau neutrino",
    className: "term-fermion-gen3",
    fullMath: String.raw`\mathcal{L}_{\nu_\tau}= i\bar{\nu}_{\tau}\gamma^\mu D_\mu\nu_{\tau}`,
    braceMath: String.raw`Q=0,\quad L=1`,
  },
  "fermion-tau": {
    id: "fermion-tau",
    title: "Tau",
    className: "term-fermion-gen3",
    fullMath: String.raw`\mathcal{L}_{\tau}= i\bar{\tau}\gamma^\mu D_\mu\tau`,
    braceMath: String.raw`Q=-1,\quad L=1`,
  },
  "fermion-u": {
    id: "fermion-u",
    title: "Quark up",
    className: "term-fermion-gen1",
    fullMath: String.raw`\mathcal{L}_{u}= i\bar{u}\gamma^\mu D_\mu u`,
    braceMath: String.raw`Q=+\tfrac{2}{3},\quad B=\tfrac{1}{3}`,
  },
  "fermion-d": {
    id: "fermion-d",
    title: "Quark down",
    className: "term-fermion-gen1",
    fullMath: String.raw`\mathcal{L}_{d}= i\bar{d}\gamma^\mu D_\mu d`,
    braceMath: String.raw`Q=-\tfrac{1}{3},\quad B=\tfrac{1}{3}`,
  },
  "fermion-c": {
    id: "fermion-c",
    title: "Quark charm",
    className: "term-fermion-gen2",
    fullMath: String.raw`\mathcal{L}_{c}= i\bar{c}\gamma^\mu D_\mu c`,
    braceMath: String.raw`Q=+\tfrac{2}{3},\quad B=\tfrac{1}{3}`,
  },
  "fermion-s": {
    id: "fermion-s",
    title: "Quark strange",
    className: "term-fermion-gen2",
    fullMath: String.raw`\mathcal{L}_{s}= i\bar{s}\gamma^\mu D_\mu s`,
    braceMath: String.raw`Q=-\tfrac{1}{3},\quad B=\tfrac{1}{3}`,
  },
  "fermion-t": {
    id: "fermion-t",
    title: "Quark top",
    className: "term-fermion-gen3",
    fullMath: String.raw`\mathcal{L}_{t}= i\bar{t}\gamma^\mu D_\mu t`,
    braceMath: String.raw`Q=+\tfrac{2}{3},\quad B=\tfrac{1}{3}`,
  },
  "fermion-b": {
    id: "fermion-b",
    title: "Quark bottom",
    className: "term-fermion-gen3",
    fullMath: String.raw`\mathcal{L}_{b}= i\bar{b}\gamma^\mu D_\mu b`,
    braceMath: String.raw`Q=-\tfrac{1}{3},\quad B=\tfrac{1}{3}`,
  },
  higgs: {
    id: "higgs",
    title: "Higgs sector",
    className: "term-higgs",
    prefix: String.raw`|D_\mu H|^2-V(H) =`,
    terms: [
      { id: "hk", operator: "+", math: String.raw`(D_\mu H)^\dagger(D^\mu H)`, className: "term-higgs", next: "higgs-kinetic" },
      { id: "hp", operator: "−", math: String.raw`V(H)`, className: "term-higgs", next: "higgs-potential" },
    ],
    braceMath: String.raw`V(H)= -\mu^2H^\dagger H + \lambda(H^\dagger H)^2`,
    explanation: "This part combines Higgs dynamics with its potential responsible for symmetry breaking.",
  },
  "higgs-kinetic": {
    id: "higgs-kinetic",
    title: "Higgs kinetic term",
    className: "term-higgs",
    fullMath: String.raw`(D_\mu H)^\dagger(D^\mu H)`,
    braceMath: String.raw`\underbrace{D_\mu}_{\text{coupling to gauge bosons}}H`,
  },
  "higgs-potential": {
    id: "higgs-potential",
    title: "Higgs potential",
    className: "term-higgs",
    fullMath: String.raw`V(H)= -\mu^2H^\dagger H + \lambda(H^\dagger H)^2`,
    braceMath: String.raw`\underbrace{-\mu^2}_{\text{spontaneous symmetry breaking}}\quad\underbrace{\lambda}_{\text{self-coupling}}`,
  },
  yukawa: {
    id: "yukawa",
    title: "Yukawa sector",
    className: "term-yukawa",
    prefix: String.raw`-\left(y\bar{\psi}_L H\psi_R+h.c.\right) =`,
    terms: [
      { id: "yu", operator: "−", math: String.raw`y_u\bar{Q}_L\tilde{H}u_R`, className: "term-yukawa", next: "yukawa-u" },
      { id: "yd", operator: "−", math: String.raw`y_d\bar{Q}_L H d_R`, className: "term-yukawa", next: "yukawa-d" },
      { id: "ye", operator: "−", math: String.raw`y_e\bar{L}_L H e_R`, className: "term-yukawa", next: "yukawa-e" },
    ],
    braceMath: String.raw`\mathcal{L}_{Yukawa}= -y_u\bar{Q}_L\tilde{H}u_R - y_d\bar{Q}_L H d_R - y_e\bar{L}_L H e_R + h.c.`,
    explanation: "These couplings connect fermions to the Higgs field and generate masses after symmetry breaking.",
  },
  "yukawa-u": {
    id: "yukawa-u",
    title: "Yukawa up-type",
    className: "term-yukawa",
    fullMath: String.raw`\mathcal{L}_{Y,u} = -y_u\bar{Q}_L\tilde{H}u_R + h.c.`,
    braceMath: String.raw`m_u = y_u\frac{v}{\sqrt{2}}`,
  },
  "yukawa-d": {
    id: "yukawa-d",
    title: "Yukawa down-type",
    className: "term-yukawa",
    fullMath: String.raw`\mathcal{L}_{Y,d} = -y_d\bar{Q}_L H d_R + h.c.`,
    braceMath: String.raw`m_d = y_d\frac{v}{\sqrt{2}}`,
  },
  "yukawa-e": {
    id: "yukawa-e",
    title: "Yukawa charged leptons",
    className: "term-yukawa",
    fullMath: String.raw`\mathcal{L}_{Y,e} = -y_e\bar{L}_L H e_R + h.c.`,
    braceMath: String.raw`m_e = y_e\frac{v}{\sqrt{2}}`,
  },
};

const termColors = {
  "term-gauge": "#ff8ac8",
  "term-fermion": "#7fb7ff",
  "term-fermion-gen1": "#7fb7ff",
  "term-fermion-gen2": "#7fb7ff",
  "term-fermion-gen3": "#7fb7ff",
  "term-higgs": "#ffbd83",
  "term-yukawa": "#d8acff",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const drawVariants = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)", y: 8 },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0% 0 0)",
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function LagrangianPanel() {
  const [navigationStack, setNavigationStack] = useState(["root"]);
  const [isEquationFullscreen, setIsEquationFullscreen] = useState(false);
  const equationBoxRef = useRef(null);
  const currentNodeId = navigationStack[navigationStack.length - 1];
  const currentNode = equationTree[currentNodeId];
  const canGoBack = navigationStack.length > 1;

  const treePaths = useMemo(() => {
    const paths = { root: ["root"] };

    const walk = (nodeId, path, visited = new Set()) => {
      if (visited.has(nodeId) || !equationTree[nodeId]) {
        return;
      }

      const nextVisited = new Set(visited);
      nextVisited.add(nodeId);

      const node = equationTree[nodeId];
      const childNodeIds = [
        ...new Set((node.terms || []).map((term) => term.next).filter((nextId) => nextId && equationTree[nextId])),
      ];

      childNodeIds.forEach((childNodeId) => {
        if (!paths[childNodeId]) {
          paths[childNodeId] = [...path, childNodeId];
        }
        walk(childNodeId, paths[childNodeId], nextVisited);
      });
    };

    walk("root", ["root"]);
    return paths;
  }, []);

  const jumpToNode = (targetNodeId) => {
    const targetPath = treePaths[targetNodeId];
    if (!targetPath) {
      return;
    }
    setNavigationStack(targetPath);
  };

  const getCompactNodeLabel = (node) => {
    const sourceLabel = node.treeLabel || node.title || "";
    const tokens = sourceLabel.trim().split(/\s+/).filter(Boolean);
    if (tokens.length <= 2) {
      return sourceLabel;
    }
    return `${tokens[0]} ${tokens[1]}`;
  };

  const renderTreeNode = (nodeId, visited = new Set()) => {
    if (visited.has(nodeId) || !equationTree[nodeId]) {
      return null;
    }

    const nextVisited = new Set(visited);
    nextVisited.add(nodeId);

    const node = equationTree[nodeId];
    const childNodeIds = [
      ...new Set((node.terms || []).map((term) => term.next).filter((nextId) => nextId && equationTree[nextId])),
    ];

    return (
      <li
        key={nodeId}
        className={`equation-tree-node ${node.className || ""} ${nodeId === currentNodeId ? "is-current" : ""} ${
          childNodeIds.length > 0 ? "has-children" : ""
        }`}
      >
        <button
          className="equation-tree-node-label"
          type="button"
          onClick={() => jumpToNode(nodeId)}
          title={node.title}
        >
          {getCompactNodeLabel(node)}
        </button>
        {childNodeIds.length > 0 && (
          <ul className="equation-tree-children">
            {childNodeIds.map((childNodeId) => renderTreeNode(childNodeId, nextVisited))}
          </ul>
        )}
      </li>
    );
  };

  const enterNode = (nextNodeId) => {
    if (!nextNodeId || !equationTree[nextNodeId]) {
      return;
    }

    setNavigationStack((stack) => [...stack, nextNodeId]);
  };

  const goBack = () => {
    setNavigationStack((stack) => (stack.length > 1 ? stack.slice(0, -1) : stack));
  };

  const toggleEquationFullscreen = async () => {
    if (!equationBoxRef.current) {
      return;
    }

    if (document.fullscreenElement === equationBoxRef.current) {
      await document.exitFullscreen();
      return;
    }

    await equationBoxRef.current.requestFullscreen();
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsEquationFullscreen(document.fullscreenElement === equationBoxRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  return (
    <motion.section
      className="lagrangian-panel"
      aria-label="Simplified Standard Model Lagrangian"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <p className="eyebrow">Demo</p>
      <h1 className="content-title">Standard model lagrangian explorer</h1>

      <motion.div className="lagrangian-intro" variants={itemVariants}>
        <p className="lagrangian-blogpost">
          At every point in spacetime, the Universe selects dynamics by extremizing a local quantity: the Lagrangian
          density, <InlineMath math={String.raw`\mathcal{L}`} />. In practice, no single force acts alone; the gauge,
          matter, Higgs, and Yukawa contributions evolve together. The action
          <InlineMath math={String.raw`S=\int \mathcal{L}\,d^4x`} /> follows a stationary principle, which yields the
          equations of motion observed in physics.
        </p>
      </motion.div>

      <motion.div className="lagrangian-equation" variants={itemVariants} ref={equationBoxRef}>
        <button
          className="equation-fullscreen-button"
          type="button"
          onClick={toggleEquationFullscreen}
          aria-label={isEquationFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isEquationFullscreen ? "⤡" : "⤢"}
        </button>

        <div className="equation-nav-row">
          {canGoBack && (
            <button
              className="equation-back-button"
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                goBack();
              }}
            >
              ← Back
            </button>
          )}
          <span className="equation-node-title">{currentNode.title}</span>
          <span className="equation-level-badge">Level {navigationStack.length}</span>
        </div>

        <motion.div
          key={`draw-${currentNode.id}`}
          className="equation-draw-line"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 2.0, ease: "linear", delay: 0 }}
        />

        <motion.div
          className="equation-stage"
          key={currentNode.id}
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)", y: 8 }}
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)", y: 0 }}
          transition={{ duration: 2.0, ease: "linear", delay: 0 }}
        >
          {currentNode.prefix && currentNode.terms ? (
            <div className="equation-row">
              <span className="equation-piece equation-static-term" style={{ "--eq-color": "#ffffff" }}>
                <InlineMath math={currentNode.prefix} />
              </span>

              {currentNode.terms.map((term) => (
                <button
                  className="equation-piece equation-term-button"
                  key={term.id}
                  type="button"
                  onClick={() => enterNode(term.next)}
                  style={{ "--eq-color": termColors[term.className] || "#ffffff" }}
                >
                  <span className="equation-term">
                    <InlineMath math={term.operator ? `${term.operator === "−" ? "-" : "+"}${term.math}` : term.math} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className={`equation-fullmath ${currentNode.className || ""}`}>
              <BlockMath math={currentNode.fullMath} />
            </div>
          )}

          {currentNode.braceMath && (
            <motion.div
              className="term-expanded-math"
              initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 2.0, ease: "linear", delay: 0 }}
            >
              <p className="equation-explanation-text">
                {currentNode.explanation || "This box gives a short explanation of the selected term."}
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.div className="equation-tree-box" variants={itemVariants}>
        <p className="equation-tree-title">Equation tree</p>
        <div className="equation-tree-scroll">
          <ul className="equation-tree-root">{renderTreeNode("root")}</ul>
        </div>
      </motion.div>
    </motion.section>
  );
}

export default LagrangianPanel;