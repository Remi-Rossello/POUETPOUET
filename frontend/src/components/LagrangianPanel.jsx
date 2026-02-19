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
        className: "category-pink",
        next: "gauge",
      },
      {
        id: "fermion",
        operator: "+",
        math: String.raw`i\bar{\psi}\gamma^\mu D_\mu\psi`,
        className: "category-blue",
        next: "fermion",
      },
      {
        id: "yukawa",
        operator: "−",
        math: String.raw`\left(y\bar{\psi}_L H\psi_R+h.c.\right)`,
        className: "category-purple",
        next: "yukawa",
      },
      {
        id: "higgs",
        operator: "+",
        math: String.raw`|D_\mu H|^2-V(H)`,
        className: "category-orange",
        next: "higgs",
      },
    ],
  },
  gauge: {
    id: "gauge",
    title: "Gauge sector",
    className: "category-pink",
    prefix: String.raw`-\frac{1}{4}F_{\mu\nu}F^{\mu\nu} =`,
    terms: [
      { id: "su3", operator: "−", math: String.raw`\frac{1}{4}G^a_{\mu\nu}G^{a\mu\nu}`, className: "category-pink", next: "gauge-su3" },
      { id: "su2", operator: "−", math: String.raw`\frac{1}{4}W^i_{\mu\nu}W^{i\mu\nu}`, className: "category-pink", next: "gauge-su2" },
      { id: "u1", operator: "−", math: String.raw`\frac{1}{4}B_{\mu\nu}B^{\mu\nu}`, className: "category-pink", next: "gauge-u1" },
    ],
    braceMath: String.raw`\mathcal{L}_{gauge}=-\frac{1}{4}F_{\mu\nu}F^{\mu\nu},\quad F_{\mu\nu}F^{\mu\nu}=G^a_{\mu\nu}G^{a\mu\nu}+W^i_{\mu\nu}W^{i\mu\nu}+B_{\mu\nu}B^{\mu\nu}`,
    explanation: "These are the gauge-boson kinetic terms, one for each interaction field.",
  },
  "gauge-su3": {
    id: "gauge-su3",
    title: "Gluon field tensor",
    className: "category-pink",
    prefix: String.raw`G^a_{\mu\nu}=`,
    terms: [
      {
        id: "su3-gmu",
        operator: "",
        math: String.raw`\partial_\mu G^a_\nu-\partial_\nu G^a_\mu`,
        className: "category-pink",
        next: "gauge-su3-gmu",
      },
      {
        id: "su3-fabc",
        operator: "+",
        math: String.raw`g_sf^{abc}G^b_\mu G^c_\nu`,
        className: "category-pink",
        next: "gauge-su3-fabc",
      },
    ],
    explanation: "Click the term with Gμ to view the gluon field column, or click the f^{abc} term to expand the non-abelian structure.",
    braceMath: String.raw`G^a_{\mu\nu}=\partial_\mu G^a_\nu-\partial_\nu G^a_\mu+g_sf^{abc}G^b_\mu G^c_\nu`,
  },
  "gauge-su3-gmu": {
    id: "gauge-su3-gmu",
    title: "Gluon 4-vector field for a given color charge a",
    className: "category-pink",
    fullMath: String.raw`G_\mu^a(x)=\left(\phi^a(x),\,\vec{G}^{\,a}(x)\right)=\left(\phi^a(x),\,G_x^a(x),\,G_y^a(x),\,G_z^a(x)\right)`,
    explanation: "For fixed a, this has the same 4-potential structure as electromagnetism, but carries a color index.",
    braceMath: String.raw`A_\mu(x)=\left(\phi(x),\,\vec{A}(x)\right)\quad\leftrightarrow\quad G_\mu^a(x)=\left(\phi^a(x),\,\vec{G}^{\,a}(x)\right)`,
  },
  "gauge-su3-fabc": {
    id: "gauge-su3-fabc",
    title: "Structure constants expansion",
    className: "category-pink",
    fullMath: String.raw`[T^a,T^b]=if^{abc}T^c\quad\Rightarrow\quad g_sf^{abc}G_\mu^bG_\nu^c`,
    explanation: "This term encodes gluon self-interactions coming from the non-commuting SU(3)c generators.",
    braceMath: String.raw`f^{123}=1,\;f^{147}=f^{246}=f^{257}=f^{345}=\tfrac{1}{2},\;\dots`,
  },
  "gauge-su2": {
    id: "gauge-su2",
    title: "Weak field tensor",
    className: "category-pink",
    fullMath: String.raw`W^i_{\mu\nu} = \partial_\mu W^i_\nu - \partial_\nu W^i_\mu + g\,\epsilon^{ijk}W^j_\mu W^k_\nu`,
    braceMath: String.raw`\underbrace{\epsilon^{ijk}W^j_\mu W^k_\nu}_{\text{non-abelian structure of }SU(2)_L}`,
  },
  "gauge-u1": {
    id: "gauge-u1",
    title: "Hypercharge field tensor",
    className: "category-pink",
    prefix: String.raw`B_{\mu\nu}=`,
    terms: [
      {
        id: "u1-derivative",
        operator: "",
        math: String.raw`\partial_\mu B_\nu-\partial_\nu B_\mu`,
        className: "category-pink",
        next: "gauge-u1-potential",
      },
    ],
    explanation: "Click the derivative term to see the underlying hypercharge 4-potential field.",
    braceMath: String.raw`\underbrace{B_{\mu\nu}}_{\text{abelian sector }U(1)_Y}`,
  },
  "gauge-u1-potential": {
    id: "gauge-u1-potential",
    title: "Hypercharge 4-vector potential",
    className: "category-pink",
    fullMath: String.raw`B_\mu(x)=\left(B_0(x),\,B_x(x),\,B_y(x),\,B_z(x)\right)`,
    explanation: "This is the U(1)Y gauge potential, analogous to the electromagnetic 4-potential.",
    braceMath: String.raw`B_{\mu\nu}=\partial_\mu B_\nu-\partial_\nu B_\mu`,
  },
  fermion: {
    id: "fermion",
    title: "Fermion sector",
    className: "category-blue",
    prefix: String.raw`i\bar{\psi}\gamma^\mu D_\mu\psi =`,
    terms: [
      {
        id: "f-sum",
        operator: "",
        math: String.raw`\sum_f i\bar{\psi}_f\gamma^\mu D_\mu\psi_f`,
        className: "category-blue",
        next: "fermion-single-field",
      },
    ],
    braceMath: String.raw`\mathcal{L}_{fermions}=\sum_f i\bar{\psi}_f\gamma^\mu D_\mu\psi_f`,
    explanation: "The fermion contribution is written as a compact sum over all fermion flavors f.",
  },
  "fermion-single-field": {
    id: "fermion-single-field",
    title: "Lagrangian density of a single fermion field",
    className: "category-blue",
    fullMath: String.raw`\mathcal{L}_f=i\bar{\psi}_f\gamma^\mu\left(\partial_\mu+\color{#ff8ac8}{\left(-ig_sT^aG^a_\mu-ig\frac{\tau^i}{2}W^i_\mu-ig'YB_\mu\right)}\right)\psi_f`,
    explanation: "Here the covariant derivative is expanded into strong, weak, and hypercharge gauge interactions.",
    braceMath: String.raw`D_\mu=\partial_\mu-ig_sT^aG^a_\mu-ig\frac{\tau^i}{2}W^i_\mu-ig'YB_\mu`,
  },
  "fermion-nue": {
    id: "fermion-nue",
    title: "Electron neutrino",
    className: "category-blue-gen1",
    fullMath: String.raw`\mathcal{L}_{\nu_e}= i\bar{\nu}_e\gamma^\mu D_\mu\nu_e`,
    braceMath: String.raw`Q=0,\quad L=1`,
  },
  "fermion-e": {
    id: "fermion-e",
    title: "Electron",
    className: "category-blue-gen1",
    fullMath: String.raw`\mathcal{L}_{e}= i\bar{e}\gamma^\mu D_\mu e`,
    braceMath: String.raw`Q=-1,\quad L=1`,
  },
  "fermion-numu": {
    id: "fermion-numu",
    title: "Muon neutrino",
    className: "category-blue-gen2",
    fullMath: String.raw`\mathcal{L}_{\nu_\mu}= i\bar{\nu}_{\mu}\gamma^\mu D_\mu\nu_{\mu}`,
    braceMath: String.raw`Q=0,\quad L=1`,
  },
  "fermion-mu": {
    id: "fermion-mu",
    title: "Muon",
    className: "category-blue-gen2",
    fullMath: String.raw`\mathcal{L}_{\mu}= i\bar{\mu}\gamma^\mu D_\mu\mu`,
    braceMath: String.raw`Q=-1,\quad L=1`,
  },
  "fermion-nutau": {
    id: "fermion-nutau",
    title: "Tau neutrino",
    className: "category-blue-gen3",
    fullMath: String.raw`\mathcal{L}_{\nu_\tau}= i\bar{\nu}_{\tau}\gamma^\mu D_\mu\nu_{\tau}`,
    braceMath: String.raw`Q=0,\quad L=1`,
  },
  "fermion-tau": {
    id: "fermion-tau",
    title: "Tau",
    className: "category-blue-gen3",
    fullMath: String.raw`\mathcal{L}_{\tau}= i\bar{\tau}\gamma^\mu D_\mu\tau`,
    braceMath: String.raw`Q=-1,\quad L=1`,
  },
  "fermion-u": {
    id: "fermion-u",
    title: "Quark up",
    className: "category-blue-gen1",
    fullMath: String.raw`\mathcal{L}_{u}= i\bar{u}\gamma^\mu D_\mu u`,
    braceMath: String.raw`Q=+\tfrac{2}{3},\quad B=\tfrac{1}{3}`,
  },
  "fermion-d": {
    id: "fermion-d",
    title: "Quark down",
    className: "category-blue-gen1",
    fullMath: String.raw`\mathcal{L}_{d}= i\bar{d}\gamma^\mu D_\mu d`,
    braceMath: String.raw`Q=-\tfrac{1}{3},\quad B=\tfrac{1}{3}`,
  },
  "fermion-c": {
    id: "fermion-c",
    title: "Quark charm",
    className: "category-blue-gen2",
    fullMath: String.raw`\mathcal{L}_{c}= i\bar{c}\gamma^\mu D_\mu c`,
    braceMath: String.raw`Q=+\tfrac{2}{3},\quad B=\tfrac{1}{3}`,
  },
  "fermion-s": {
    id: "fermion-s",
    title: "Quark strange",
    className: "category-blue-gen2",
    fullMath: String.raw`\mathcal{L}_{s}= i\bar{s}\gamma^\mu D_\mu s`,
    braceMath: String.raw`Q=-\tfrac{1}{3},\quad B=\tfrac{1}{3}`,
  },
  "fermion-t": {
    id: "fermion-t",
    title: "Quark top",
    className: "category-blue-gen3",
    fullMath: String.raw`\mathcal{L}_{t}= i\bar{t}\gamma^\mu D_\mu t`,
    braceMath: String.raw`Q=+\tfrac{2}{3},\quad B=\tfrac{1}{3}`,
  },
  "fermion-b": {
    id: "fermion-b",
    title: "Quark bottom",
    className: "category-blue-gen3",
    fullMath: String.raw`\mathcal{L}_{b}= i\bar{b}\gamma^\mu D_\mu b`,
    braceMath: String.raw`Q=-\tfrac{1}{3},\quad B=\tfrac{1}{3}`,
  },
  higgs: {
    id: "higgs",
    title: "Higgs sector",
    className: "category-orange",
    prefix: String.raw`|D_\mu H|^2-V(H) =`,
    terms: [
      { id: "hk", operator: "+", math: String.raw`(D_\mu H)^\dagger(D^\mu H)`, className: "category-orange", next: "higgs-kinetic" },
      { id: "hp", operator: "−", math: String.raw`V(H)`, className: "category-orange", next: "higgs-potential" },
    ],
    braceMath: String.raw`V(H)= -\mu^2H^\dagger H + \lambda(H^\dagger H)^2`,
    explanation: "This part combines Higgs dynamics with its potential responsible for symmetry breaking.",
  },
  "higgs-kinetic": {
    id: "higgs-kinetic",
    title: "Higgs kinetic term",
    className: "category-orange",
    fullMath: String.raw`(D_\mu H)^\dagger(D^\mu H)`,
    braceMath: String.raw`\underbrace{D_\mu}_{\text{coupling to gauge bosons}}H`,
  },
  "higgs-potential": {
    id: "higgs-potential",
    title: "Higgs potential",
    className: "category-orange",
    fullMath: String.raw`V(H)= -\mu^2H^\dagger H + \lambda(H^\dagger H)^2`,
    braceMath: String.raw`\underbrace{-\mu^2}_{\text{spontaneous symmetry breaking}}\quad\underbrace{\lambda}_{\text{self-coupling}}`,
  },
  yukawa: {
    id: "yukawa",
    title: "Yukawa sector",
    className: "category-purple",
    prefix: String.raw`-\left(y\bar{\psi}_L H\psi_R+h.c.\right) =`,
    terms: [
      { id: "yu", operator: "−", math: String.raw`y_u\bar{Q}_L\tilde{H}u_R`, className: "category-purple", next: "yukawa-u" },
      { id: "yd", operator: "−", math: String.raw`y_d\bar{Q}_L H d_R`, className: "category-purple", next: "yukawa-d" },
      { id: "ye", operator: "−", math: String.raw`y_e\bar{L}_L H e_R`, className: "category-purple", next: "yukawa-e" },
    ],
    braceMath: String.raw`\mathcal{L}_{Yukawa}= -y_u\bar{Q}_L\tilde{H}u_R - y_d\bar{Q}_L H d_R - y_e\bar{L}_L H e_R + h.c.`,
    explanation: "These couplings connect fermions to the Higgs field and generate masses after symmetry breaking.",
  },
  "yukawa-u": {
    id: "yukawa-u",
    title: "Yukawa up-type",
    className: "category-purple",
    fullMath: String.raw`\mathcal{L}_{Y,u} = -y_u\bar{Q}_L\tilde{H}u_R + h.c.`,
    braceMath: String.raw`m_u = y_u\frac{v}{\sqrt{2}}`,
  },
  "yukawa-d": {
    id: "yukawa-d",
    title: "Yukawa down-type",
    className: "category-purple",
    fullMath: String.raw`\mathcal{L}_{Y,d} = -y_d\bar{Q}_L H d_R + h.c.`,
    braceMath: String.raw`m_d = y_d\frac{v}{\sqrt{2}}`,
  },
  "yukawa-e": {
    id: "yukawa-e",
    title: "Yukawa charged leptons",
    className: "category-purple",
    fullMath: String.raw`\mathcal{L}_{Y,e} = -y_e\bar{L}_L H e_R + h.c.`,
    braceMath: String.raw`m_e = y_e\frac{v}{\sqrt{2}}`,
  },
};

const termColors = {
  "category-pink": "#ff8ac8",
  "category-blue": "#7fb7ff",
  "category-blue-gen1": "#7fb7ff",
  "category-blue-gen2": "#7fb7ff",
  "category-blue-gen3": "#7fb7ff",
  "category-orange": "#ffbd83",
  "category-purple": "#d8acff",
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

/**
 * Displays an interactive explorer for the Standard Model Lagrangian density.
 * @returns {JSX.Element} Interactive Lagrangian panel.
 */
function LagrangianPanel() {
  // Navigation stack tracks the current node path in the equation tree.
  const [navigationStack, setNavigationStack] = useState(["root"]);
  const [isEquationFullscreen, setIsEquationFullscreen] = useState(false);
  const [isLagrangianMoreOpen, setIsLagrangianMoreOpen] = useState(false);
  const equationBoxRef = useRef(null);
  const currentNodeId = navigationStack[navigationStack.length - 1];
  const currentNode = equationTree[currentNodeId];
  const canGoBack = navigationStack.length > 1;

  const treePaths = useMemo(() => {
    const paths = { root: ["root"] };

    /**
      * Recursively walks the tree to build navigation paths.
      * @param {string} nodeId Current node identifier.
      * @param {string[]} path Current path from the root.
      * @param {Set<string>} [visited=new Set()] Set of already visited nodes.
     * @returns {void}
     */
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

  /**
    * Replaces navigation state with the full path to a target node.
    * @param {string} targetNodeId Destination node identifier.
   * @returns {void}
   */
  const jumpToNode = (targetNodeId) => {
    const targetPath = treePaths[targetNodeId];
    if (!targetPath) {
      return;
    }
    setNavigationStack(targetPath);
  };

  /**
    * Produces a short label for compact node display.
    * @param {{ treeLabel?: string, title?: string }} node Equation tree node.
    * @returns {string} Compact label.
   */
  const getCompactNodeLabel = (node) => {
    const sourceLabel = node.treeLabel || node.title || "";
    const tokens = sourceLabel.trim().split(/\s+/).filter(Boolean);
    if (tokens.length <= 2) {
      return sourceLabel;
    }
    return `${tokens[0]} ${tokens[1]}`;
  };

  /**
    * Recursively renders the visual equation tree.
    * @param {string} nodeId Node identifier to render.
    * @param {Set<string>} [visited=new Set()] Set of already visited nodes.
    * @returns {JSX.Element | null} Tree element or null.
   */
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
        className={`project-tree-node ${node.className || ""} ${nodeId === currentNodeId ? "is-current" : ""} ${
          childNodeIds.length > 0 ? "has-children" : ""
        }`}
      >
        <button
          className="project-tree-node-label"
          type="button"
          onClick={() => jumpToNode(nodeId)}
          title={node.title}
        >
          {getCompactNodeLabel(node)}
        </button>
        {childNodeIds.length > 0 && (
          <ul className="project-tree-children">
            {childNodeIds.map((childNodeId) => renderTreeNode(childNodeId, nextVisited))}
          </ul>
        )}
      </li>
    );
  };

  /**
    * Moves to a child node while preserving navigation history.
    * @param {string} nextNodeId Next node identifier.
   * @returns {void}
   */
  const enterNode = (nextNodeId) => {
    if (!nextNodeId || !equationTree[nextNodeId]) {
      return;
    }

    setNavigationStack((stack) => [...stack, nextNodeId]);
  };

  /**
    * Returns to the parent node when available.
   * @returns {void}
   */
  const goBack = () => {
    setNavigationStack((stack) => (stack.length > 1 ? stack.slice(0, -1) : stack));
  };

  /**
    * Toggles fullscreen mode for the equation container.
    * @returns {Promise<void>} Promise resolved after fullscreen transition.
   */
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
    /**
      * Syncs local state with the document fullscreen state.
     * @returns {void}
     */
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
      className="project-panel"
      aria-label="Simplified Standard Model Lagrangian"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="content-title">Standard model lagrangian explorer</h1>

      <motion.div className="project-intro" variants={itemVariants}>
        <p className="project-body-text">
          Welcome to the Lagrangian explorer Demo ! Interact with the most fundamental quantity of all current particle
          physics: the complete Standard Model Lagrangian density. Click the terms to expand them and understand how
          quantum fields for matter and force particles interact and evolve.
        </p>
        <button
          className="button button-secondary project-show-more-toggle"
          type="button"
          onClick={() => setIsLagrangianMoreOpen((open) => !open)}
          aria-expanded={isLagrangianMoreOpen}
          aria-controls="project-show-more-content"
        >
          {isLagrangianMoreOpen ? "Show less" : "Show more"}
        </button>
        {isLagrangianMoreOpen && (
          <div className="project-show-more-text" id="project-show-more-content">
            <h3 className="project-show-more-title">Optimizing the Action</h3>
            <p className="project-show-more-paragraph">
              The classical Lagrangian of a system is defined as the kinetic energy, minus the potential energy.
              Integrating this Lagrangian over the path of an object, with fixed initial and final conditions, gives
              the action S. The actual path that the object will take is the one that makes the action "stationnary",
              meaning a small change of path almost doesn't change the resulting action. In practice, this often means
              minimizing the action.
            </p>
            <p className="project-show-more-paragraph">
              Ignore the potential energy for a moment. Minimizing the integral of the kinetic energy is a way of
              saying "The real path taken from point A to point B is the one that goes in the straightest line, with
              the least changes in speed". This makes sense intuitively: why would an object randomly take a crazy
              trajectory, going very far, very fast, just to get back to point B in time ? It often just takes a straight line, the one with the least
              possible action that is still needed to get from A to B.
            </p>
            <p className="project-show-more-paragraph">
              The negative potential energy term can be viewed as having the opposite effect: where there is more
              potential energy, the action decreases. This means that trajectories will tend to "bend" towards high
              potentials on the journey from A to B in order to minimize the action. Think of launching a ball in the
              air to your friend: to get to your friend, the trajectory can't be a straight line, it has to bend towards
              the sky, with higher potential energy. This is a way of saying that trajectories have to "fight" against the potential to get to the intended target.
            </p>
            <p className="project-show-more-paragraph">
              Finally, it can be shown that getting a stationnary action is the same as satisfying the Euler-Lagrange
              equation, which in turn is the same as satisfying the usual Newtonian equations of motion.
            </p>
            <h3 className="project-show-more-title">What about quantum fields ?</h3>
            <p className="project-show-more-paragraph">
              In quantum field theory, at each point in space, you can think of the field strength as tiny springs,
              with their own speed, recall forces, and interactions with the other fields. From that, a "Lagrangian
              density" can be defined as the "tiny quantum version of the Lagrangian at each point in space", with units
              of Energy units per Volume units.
            </p>
            <p className="project-show-more-paragraph">
              Thus, all motion, behavior, and interactions of all particles in flat spacetime can ultimately be described by
              adding up and integrating over all space-time the individual Lagrangians densities of each field !
              This is what the Standard Model Lagrangian density is all about !
            </p>
          </div>
        )}
      </motion.div>

      <motion.div className="project-tree-box" variants={itemVariants}>
        <p className="project-tree-title">Equation tree</p>
        <div className="project-tree-scroll">
          <ul className="project-tree-root">{renderTreeNode("root")}</ul>
        </div>
      </motion.div>

      <motion.div className="project-content" variants={itemVariants} ref={equationBoxRef}>
        <button
          className="project-fullscreen-button"
          type="button"
          onClick={toggleEquationFullscreen}
          aria-label={isEquationFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isEquationFullscreen ? "⤡" : "⤢"}
        </button>

        <div className="project-nav-row">
          {canGoBack && (
            <button
              className="project-back-button"
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
          <span className="project-node-title">{currentNode.title}</span>
          <span className="project-level-badge">Level {navigationStack.length}</span>
        </div>

        <motion.div
          key={`draw-${currentNode.id}`}
          className="project-draw-line"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 2.0, ease: "linear", delay: 0 }}
        />

        <motion.div
          className="project-expression-stage"
          key={currentNode.id}
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)", y: 8 }}
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)", y: 0 }}
          transition={{ duration: 2.0, ease: "linear", delay: 0 }}
        >
          {currentNode.prefix && currentNode.terms ? (
            <div className="project-expression-row">
              <span className="project-expression-piece project-expression-static" style={{ "--eq-color": "#ffffff" }}>
                <InlineMath math={currentNode.prefix} />
              </span>

              {currentNode.terms.map((term) => (
                <button
                  className="project-expression-piece project-expression-button"
                  key={term.id}
                  type="button"
                  onClick={() => enterNode(term.next)}
                  style={{ "--eq-color": termColors[term.className] || "#ffffff" }}
                >
                  <span className="project-expression-term">
                    <InlineMath math={term.operator ? `${term.operator === "−" ? "-" : "+"}${term.math}` : term.math} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className={`project-expression-full ${currentNode.className || ""}`}>
              <BlockMath math={currentNode.fullMath} />
            </div>
          )}

          {currentNode.braceMath && (
            <motion.div
              className="project-expanded-math"
              initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 2.0, ease: "linear", delay: 0 }}
            >
              <p className="project-explanation-text">
                {currentNode.explanation || "This box gives a short explanation of the selected term."}
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default LagrangianPanel;