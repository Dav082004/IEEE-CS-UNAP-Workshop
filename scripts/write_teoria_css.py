import sys

NEW_CSS = r"""/* =====================================================
   IEEE CS UNAP — TEORIA PAGE STYLES (v2)
   ===================================================== */

:root {
  --theory-primary: var(--primary);
  --theory-secondary: var(--secondary);
  --theory-accent: var(--tertiary);
}

/* ── Scroll progress bar ── */
.scroll-progress {
  position: fixed; top: 0; left: 0;
  width: 0%; height: 3px;
  background: var(--gradient-primary);
  z-index: 9999;
  transition: width 0.1s linear;
}

/* ── HERO ── */
.theory-hero {
  background: var(--gradient-hero);
  color: var(--on-surface);
  padding: 5rem 0 3.5rem;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--outline-variant);
}
.theory-hero::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Ccircle cx='20' cy='20' r='1' fill='rgba(56,189,248,0.1)'/%3E%3C/svg%3E");
  opacity: 0.6; pointer-events: none;
}
.theory-hero-container {
  max-width: var(--container-max-width); margin: 0 auto;
  padding: 0 var(--container-padding); position: relative; z-index: 1;
}
.theory-hero .hero-content { text-align: center; max-width: 740px; margin: 0 auto; }
.theory-hero .hero-title {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 700; margin-bottom: 1.2rem;
  line-height: 1.15; letter-spacing: -0.02em; color: var(--on-surface);
}
.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.theory-hero .hero-subtitle {
  font-size: 1.05rem; color: var(--on-surface-variant);
  margin-bottom: 2.2rem; max-width: 540px; margin-left: auto; margin-right: auto;
  line-height: 1.6;
}
.hero-navigation { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
.hero-nav-link {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px; border-radius: var(--border-radius-full);
  font-size: var(--text-sm); font-weight: 600; font-family: var(--font-mono);
  border: 1px solid var(--outline-variant); color: var(--on-surface-variant);
  background: rgba(255,255,255,0.04); backdrop-filter: blur(8px);
  transition: var(--transition); text-decoration: none;
}
.hero-nav-link:hover, .hero-nav-link.active {
  background: rgba(56,189,248,0.12); border-color: var(--primary);
  color: var(--primary); text-decoration: none;
}

/* ── SECTIONS ── */
.theory-section { padding: var(--spacing-3xl) 0; border-bottom: 1px solid var(--outline-variant); }
.theory-section:last-of-type { border-bottom: none; }
.theory-container { max-width: var(--container-max-width); margin: 0 auto; padding: 0 var(--container-padding); }

.section-header { text-align: center; margin-bottom: var(--spacing-3xl); }
.section-icon {
  width: 58px; height: 58px; margin: 0 auto var(--spacing-lg);
  background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25);
  border-radius: var(--border-radius-large);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; color: var(--primary);
}
.section-title { font-size: var(--text-3xl); font-weight: 700; color: var(--on-surface); margin-bottom: var(--spacing-md); }
.section-description { font-size: var(--text-lg); color: var(--on-surface-variant); max-width: 580px; margin: 0 auto; line-height: 1.7; }

/* ── CONCEPT CARDS ── */
.concept-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: var(--spacing-xl); }
.concept-card {
  background: var(--surface-container); border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large); padding: var(--spacing-2xl);
  transition: var(--transition-slow); position: relative; overflow: hidden;
}
.concept-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--gradient-primary); opacity: 0.4; transition: var(--transition);
}
.concept-card:hover { border-color: var(--glass-border-hover); box-shadow: var(--shadow-medium), 0 0 28px rgba(56,189,248,0.08); transform: translateY(-3px); }
.concept-card:hover::before { opacity: 1; }
.concept-header { display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); }
.concept-icon { font-size: 1.4rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; flex-shrink: 0; }
.concept-header h3 { font-size: var(--text-xl); color: var(--on-surface); margin: 0; }
.concept-content p { color: var(--on-surface-variant); line-height: 1.7; margin-bottom: var(--spacing-md); }

/* ── ANALOGY BOXES ── */
.analogy-box {
  background: rgba(56,189,248,0.05); border: 1px solid rgba(56,189,248,0.15);
  border-left: 3px solid var(--primary); border-radius: var(--border-radius);
  padding: var(--spacing-md) var(--spacing-lg); margin-bottom: var(--spacing-lg);
}
.analogy-text { color: var(--on-surface-variant); margin: 0; font-style: italic; }
.analogy-text strong { color: var(--on-surface); font-style: normal; }
.analogy-mini {
  background: rgba(68,226,205,0.05); border-left: 3px solid var(--secondary);
  border-radius: var(--border-radius); padding: 10px var(--spacing-md);
  margin-bottom: var(--spacing-md); font-size: var(--text-sm); color: var(--on-surface-variant); line-height: 1.5;
}
.analogy-mini strong { color: var(--on-surface); }

/* ── BENEFIT LIST ── */
.benefit-list { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.benefit-item {
  display: flex; align-items: flex-start; gap: var(--spacing-sm);
  padding: 9px var(--spacing-md); background: var(--surface-container-high); border-radius: var(--border-radius);
}
.benefit-item i { color: var(--secondary); font-size: var(--text-base); margin-top: 2px; flex-shrink: 0; }
.benefit-item span { color: var(--on-surface-variant); font-size: var(--text-sm); line-height: 1.5; }
.benefit-item span strong { color: var(--on-surface); }

/* ── GIT STATES ── */
.states-workflow { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.state-item {
  display: flex; align-items: center; gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--surface-container-high); border-radius: var(--border-radius);
  border: 1px solid var(--outline-variant); transition: var(--transition);
}
.state-item:hover { border-color: rgba(56,189,248,0.3); background: rgba(56,189,248,0.04); }
.state-number {
  width: 32px; height: 32px; background: var(--gradient-primary);
  border-radius: var(--border-radius-full);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: var(--text-sm); color: var(--on-primary);
  flex-shrink: 0; font-family: var(--font-mono);
}
.state-info h4 { color: var(--on-surface); font-size: var(--text-base); margin: 0 0 2px 0; }
.state-info p { color: var(--on-surface-variant); font-size: var(--text-sm); margin: 0; }
.state-connector {
  width: 2px; height: 16px; background: var(--gradient-primary);
  margin-left: 15px; opacity: 0.4; border-radius: 2px;
}

/* ── COMMANDS ── */
.commands-section { margin-top: var(--spacing-3xl); }
.commands-title {
  display: flex; align-items: center; gap: var(--spacing-sm);
  font-size: var(--text-2xl); color: var(--on-surface); margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-md); border-bottom: 1px solid var(--outline-variant);
}
.commands-title i { color: var(--primary); }
.commands-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: var(--spacing-md); }
.command-card {
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  border-radius: var(--border-radius-large); padding: var(--spacing-xl); transition: var(--transition);
}
.command-card:hover { border-color: rgba(56,189,248,0.3); box-shadow: var(--shadow-light); transform: translateY(-2px); }
.command-header {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--spacing-sm); margin-bottom: var(--spacing-md);
}
.command-header code {
  font-family: var(--font-mono); font-size: var(--text-base);
  color: var(--secondary); background: transparent; border: none; padding: 0;
}
.command-type {
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em;
  padding: 3px 10px; border-radius: var(--border-radius-full); text-transform: uppercase; flex-shrink: 0;
}
.command-type.setup   { background: rgba(68,226,205,0.15); color: var(--secondary); border: 1px solid rgba(68,226,205,0.3); }
.command-type.info    { background: rgba(197,201,255,0.15); color: var(--tertiary); border: 1px solid rgba(197,201,255,0.3); }
.command-type.basic   { background: rgba(56,189,248,0.15); color: var(--primary); border: 1px solid rgba(56,189,248,0.3); }
.command-type.sync    { background: rgba(142,213,255,0.15); color: #8ed5ff; border: 1px solid rgba(142,213,255,0.3); }
.command-type.branch  { background: rgba(163,171,255,0.15); color: #a3abff; border: 1px solid rgba(163,171,255,0.3); }
.command-type.advanced { background: rgba(255,180,171,0.12); color: #ffb4ab; border: 1px solid rgba(255,180,171,0.25); }
.command-card p { color: var(--on-surface-variant); font-size: var(--text-sm); margin-bottom: var(--spacing-sm); line-height: 1.5; }
.command-example { background: var(--surface-container-lowest); border-radius: var(--border-radius-small); padding: 10px 12px; margin-top: var(--spacing-sm); }
.example-label { display: block; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--outline); margin-bottom: 4px; }
.command-example code { display: block; font-size: var(--text-sm); color: var(--secondary); background: transparent; border: none; padding: 0; line-height: 1.6; }

/* ── GITFLOW DIAGRAM ── */
.gitflow-section { margin-top: var(--spacing-3xl); }
.gitflow-title {
  display: flex; align-items: center; gap: var(--spacing-sm);
  font-size: var(--text-2xl); color: var(--on-surface);
  margin-bottom: var(--spacing-xl); padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--outline-variant);
}
.gitflow-title i { color: var(--primary); }
.gitflow-diagram {
  display: flex; align-items: flex-start; gap: 0;
  overflow-x: auto; padding-bottom: var(--spacing-md);
}
.gitflow-diagram .flow-step {
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  border-radius: var(--border-radius-large); padding: var(--spacing-lg);
  min-width: 150px; flex: 1; text-align: center; transition: var(--transition);
}
.gitflow-diagram .flow-step:hover { border-color: rgba(56,189,248,0.4); transform: translateY(-3px); }
.gitflow-diagram .step-number {
  width: 36px; height: 36px; background: var(--gradient-primary);
  border-radius: var(--border-radius-full);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: var(--on-primary); margin: 0 auto var(--spacing-sm);
  font-family: var(--font-mono); font-size: var(--text-sm);
}
.gitflow-diagram .step-content h4 { color: var(--on-surface); font-size: var(--text-sm); margin-bottom: 4px; }
.gitflow-diagram .step-content p { color: var(--on-surface-variant); font-size: 0.76rem; margin: 0; line-height: 1.4; }
.flow-arrow { color: var(--outline); font-size: 1.4rem; align-self: center; flex-shrink: 0; padding: 0 4px; }
.branch-visual { height: 4px; border-radius: 2px; margin-top: var(--spacing-sm); }
.main-branch    { background: var(--gradient-primary); }
.feature-branch { background: linear-gradient(90deg, #a3abff, #c5c9ff); }
.pr-branch      { background: linear-gradient(90deg, #44e2cd, #03c6b2); }
.merged-branch  { background: var(--gradient-primary); opacity: 0.7; }

/* ── ECOSYSTEM ── */
.github-section { background: var(--surface-container-low); }
.ecosystem-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: var(--spacing-xl); }
.ecosystem-card {
  background: var(--surface-container); border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large); padding: var(--spacing-2xl);
  transition: var(--transition); display: flex; flex-direction: column;
}
.ecosystem-card:hover { border-color: var(--glass-border-hover); box-shadow: var(--shadow-medium); }
.ecosystem-icon {
  font-size: 2rem; margin-bottom: var(--spacing-md);
  background: var(--gradient-primary); -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; background-clip: text; width: fit-content;
}
.ecosystem-card h3 { color: var(--on-surface); font-size: var(--text-xl); margin-bottom: var(--spacing-sm); }
.ecosystem-card p { color: var(--on-surface-variant); font-size: var(--text-sm); line-height: 1.65; flex: 1; }
.ecosystem-features { display: flex; flex-wrap: wrap; gap: 6px; margin-top: var(--spacing-md); }
.feature-tag {
  font-size: 0.72rem; font-weight: 600; padding: 3px 10px;
  background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2);
  border-radius: var(--border-radius-full); color: var(--primary); letter-spacing: 0.03em;
}

/* ── COPILOT ── */
.copilot-section { margin-top: var(--spacing-3xl); }
.copilot-card {
  background: linear-gradient(135deg, rgba(56,189,248,0.05) 0%, rgba(68,226,205,0.05) 100%);
  border: 1px solid rgba(56,189,248,0.2); border-radius: var(--border-radius-large);
  padding: var(--spacing-2xl); position: relative; overflow: hidden;
}
.copilot-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--gradient-primary);
}
.copilot-header { display: flex; align-items: center; gap: var(--spacing-lg); margin-bottom: var(--spacing-xl); }
.copilot-icon {
  width: 56px; height: 56px; background: rgba(56,189,248,0.15);
  border: 1px solid rgba(56,189,248,0.3); border-radius: var(--border-radius-large);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; color: var(--primary); flex-shrink: 0;
}
.copilot-info h3 { color: var(--on-surface); font-size: var(--text-xl); margin: 0 0 4px 0; }
.copilot-tagline { color: var(--primary); font-size: var(--text-sm); margin: 0; font-family: var(--font-mono); }
.copilot-content p { color: var(--on-surface-variant); margin-bottom: var(--spacing-lg); line-height: 1.7; }
.copilot-features { display: flex; gap: var(--spacing-lg); flex-wrap: wrap; }
.copilot-feature { display: flex; align-items: center; gap: 8px; color: var(--on-surface-variant); font-size: var(--text-sm); font-weight: 500; }
.copilot-feature i { color: var(--secondary); }

/* ── WORKFLOWS ── */
.workflows-section { background: var(--surface-container-low); }
.workflow-card {
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  border-radius: var(--border-radius-large); padding: var(--spacing-2xl); margin-bottom: var(--spacing-xl);
}
.workflow-card h3 { display: flex; align-items: center; gap: var(--spacing-sm); font-size: var(--text-2xl); color: var(--on-surface); margin-bottom: var(--spacing-sm); }
.workflow-card h3 i { color: var(--primary); }
.workflow-description { color: var(--on-surface-variant); margin-bottom: var(--spacing-xl); font-size: var(--text-base); }
.github-flow { display: flex; align-items: center; overflow-x: auto; padding-bottom: var(--spacing-sm); }
.flow-step-horizontal { display: flex; flex-direction: column; align-items: center; text-align: center; min-width: 110px; flex: 1; }
.step-circle {
  width: 38px; height: 38px; background: var(--gradient-primary);
  border-radius: var(--border-radius-full); display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: var(--on-primary); font-family: var(--font-mono); font-size: var(--text-sm);
  margin-bottom: var(--spacing-sm); flex-shrink: 0;
}
.flow-step-horizontal .step-content h4 { font-size: var(--text-sm); color: var(--on-surface); margin-bottom: 2px; }
.flow-step-horizontal .step-content p { font-size: 0.72rem; color: var(--on-surface-variant); margin: 0; line-height: 1.4; }
.step-connector {
  height: 2px; flex: 1; min-width: 20px; max-width: 40px;
  background: var(--gradient-primary); opacity: 0.4;
  align-self: flex-start; margin-top: 19px;
}

/* ── CONFLICTS ── */
.conflicts-section {
  background: rgba(255,180,171,0.04); border: 1px solid rgba(255,180,171,0.15);
  border-radius: var(--border-radius-large); padding: var(--spacing-2xl); margin-top: var(--spacing-3xl);
}
.conflicts-section h3 { display: flex; align-items: center; gap: var(--spacing-sm); font-size: var(--text-2xl); color: var(--on-surface); margin-bottom: var(--spacing-xl); }
.conflicts-section h3 i { color: #ffb4ab; }
.conflicts-explanation { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl); margin-bottom: var(--spacing-xl); }
.conflict-scenario h4, .conflict-resolution h4 { color: var(--on-surface); font-size: var(--text-base); margin-bottom: var(--spacing-md); }
.conflict-scenario p { color: var(--on-surface-variant); font-size: var(--text-sm); line-height: 1.6; }
.resolution-steps { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.resolution-step {
  display: flex; align-items: center; gap: var(--spacing-sm);
  padding: 8px 12px; background: var(--surface-container-high); border-radius: var(--border-radius);
  color: var(--on-surface-variant); font-size: var(--text-sm);
}
.resolution-step .step-number {
  width: 24px; height: 24px; background: rgba(255,180,171,0.2);
  border-radius: var(--border-radius-full); display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.7rem; color: #ffb4ab; flex-shrink: 0;
}
.conflict-example h4 { color: var(--on-surface); font-size: var(--text-base); margin-bottom: var(--spacing-md); }
.code-block {
  background: var(--surface-container-lowest); border: 1px solid var(--outline-variant);
  border-radius: var(--border-radius); padding: var(--spacing-lg); margin-bottom: var(--spacing-md); overflow-x: auto;
}
.code-block pre { margin: 0; }
.code-block code { background: transparent; border: none; padding: 0; color: var(--on-surface); font-family: var(--font-mono); font-size: var(--text-sm); }
.conflict-tip { display: flex; align-items: flex-start; gap: var(--spacing-sm); color: var(--on-surface-variant); font-size: var(--text-sm); line-height: 1.5; }
.conflict-tip i { color: var(--secondary); margin-top: 2px; flex-shrink: 0; }
.conflict-tip strong { color: var(--on-surface); }

/* ── INSIGHTS ── */
.insights-section { margin-top: var(--spacing-3xl); }
.insights-section h3 { display: flex; align-items: center; gap: var(--spacing-sm); font-size: var(--text-2xl); color: var(--on-surface); margin-bottom: var(--spacing-xl); }
.insights-section h3 i { color: var(--primary); }
.insights-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--spacing-lg); }
.insight-card {
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  border-radius: var(--border-radius-large); padding: var(--spacing-xl); transition: var(--transition); text-align: center;
}
.insight-card:hover { border-color: rgba(56,189,248,0.3); transform: translateY(-3px); box-shadow: var(--shadow-medium); }
.insight-card i { font-size: 1.8rem; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; display: block; margin-bottom: var(--spacing-md); }
.insight-card h4 { color: var(--on-surface); font-size: var(--text-base); font-weight: 600; margin-bottom: var(--spacing-sm); }
.insight-card p { color: var(--on-surface-variant); font-size: var(--text-sm); margin: 0; line-height: 1.5; }

/* ── SECURITY ── */
.security-section { margin-top: var(--spacing-3xl); }
.security-section h3 { display: flex; align-items: center; gap: var(--spacing-sm); font-size: var(--text-2xl); color: var(--on-surface); margin-bottom: var(--spacing-xl); }
.security-section h3 i { color: var(--secondary); }
.security-features { display: flex; flex-direction: column; gap: var(--spacing-md); }
.security-feature {
  display: flex; align-items: flex-start; gap: var(--spacing-lg);
  background: var(--surface-container); border: 1px solid var(--outline-variant);
  border-radius: var(--border-radius-large); padding: var(--spacing-xl); transition: var(--transition);
}
.security-feature:hover { border-color: rgba(68,226,205,0.3); }
.security-icon {
  width: 44px; height: 44px; background: rgba(68,226,205,0.1);
  border: 1px solid rgba(68,226,205,0.2); border-radius: var(--border-radius);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; color: var(--secondary); flex-shrink: 0;
}
.security-content h4 { color: var(--on-surface); font-size: var(--text-base); margin-bottom: 4px; }
.security-content p { color: var(--on-surface-variant); font-size: var(--text-sm); margin: 0; line-height: 1.5; }

/* ── WIKI ── */
.wiki-section { margin-top: var(--spacing-3xl); }
.wiki-card {
  background: linear-gradient(135deg, rgba(197,201,255,0.05) 0%, rgba(68,226,205,0.04) 100%);
  border: 1px solid rgba(197,201,255,0.2); border-radius: var(--border-radius-large); padding: var(--spacing-2xl);
}
.wiki-header { display: flex; align-items: center; gap: var(--spacing-md); margin-bottom: var(--spacing-lg); }
.wiki-header i { font-size: 1.6rem; color: var(--tertiary); }
.wiki-header h3 { color: var(--on-surface); font-size: var(--text-xl); margin: 0; }
.wiki-card p { color: var(--on-surface-variant); margin-bottom: var(--spacing-lg); line-height: 1.7; }
.wiki-benefits { display: flex; gap: var(--spacing-lg); flex-wrap: wrap; }
.wiki-benefit { display: flex; align-items: center; gap: 8px; color: var(--on-surface-variant); font-size: var(--text-sm); font-weight: 500; }
.wiki-benefit i { color: var(--tertiary); }

/* ── INFO / WARNING / TIP BOXES ── */
.info-box {
  background: rgba(56,189,248,0.05); border: 1px solid rgba(56,189,248,0.2);
  border-left: 3px solid var(--primary); border-radius: var(--border-radius); padding: var(--spacing-xl); margin-top: var(--spacing-lg);
}
.info-box h4 { margin-bottom: var(--spacing-md); color: var(--on-surface); font-size: var(--text-base); display: flex; align-items: center; gap: var(--spacing-sm); font-weight: 600; }
.info-box h4 i { color: var(--primary); }
.info-box ul { list-style: none; margin: 0; padding: 0; }
.info-box li { margin-bottom: var(--spacing-sm); color: var(--on-surface-variant); font-size: var(--text-sm); display: flex; align-items: flex-start; gap: var(--spacing-sm); }
.info-box li::before { content: "›"; color: var(--secondary); font-weight: bold; font-size: var(--text-lg); line-height: 1.2; }
.info-box strong { color: var(--on-surface); font-weight: 600; }
.warning-box { background: rgba(197,201,255,0.06); border: 1px solid rgba(197,201,255,0.2); border-left: 3px solid var(--tertiary); border-radius: var(--border-radius); padding: var(--spacing-xl); margin-top: var(--spacing-lg); }
.warning-box h4 { color: var(--tertiary); display: flex; align-items: center; gap: var(--spacing-sm); font-size: var(--text-base); margin-bottom: var(--spacing-md); }
.tip-box { background: rgba(68,226,205,0.05); border: 1px solid rgba(68,226,205,0.2); border-left: 3px solid var(--secondary); border-radius: var(--border-radius); padding: var(--spacing-xl); margin-top: var(--spacing-lg); }
.tip-box h4 { color: var(--secondary); display: flex; align-items: center; gap: var(--spacing-sm); font-size: var(--text-base); margin-bottom: var(--spacing-md); }

/* ── RESOURCES ── */
.resources-section { background: var(--surface-container-low); padding: var(--spacing-3xl) 0; }
.resources-title { display: flex; align-items: center; gap: var(--spacing-sm); font-size: var(--text-3xl); color: var(--on-surface); margin-bottom: var(--spacing-md); text-align: center; justify-content: center; }
.resources-title i { color: var(--primary); }
.resources-description { text-align: center; color: var(--on-surface-variant); font-size: var(--text-lg); margin-bottom: var(--spacing-3xl); }
.resources-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--spacing-xl); margin-bottom: var(--spacing-3xl); }
.resource-category { background: var(--surface-container); border: 1px solid var(--outline-variant); border-radius: var(--border-radius-large); padding: var(--spacing-2xl); }
.resource-category h3 { display: flex; align-items: center; gap: var(--spacing-sm); color: var(--on-surface); font-size: var(--text-xl); margin-bottom: var(--spacing-lg); }
.resource-category h3 i { color: var(--primary); }
.resource-links { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.resource-link {
  display: flex; align-items: center; gap: var(--spacing-sm);
  padding: 10px var(--spacing-md); border-radius: var(--border-radius);
  background: var(--surface-container-high); border: 1px solid var(--outline-variant);
  color: var(--on-surface-variant); font-size: var(--text-sm); font-weight: 500;
  text-decoration: none; transition: var(--transition);
}
.resource-link:hover { border-color: var(--primary); color: var(--primary); background: rgba(56,189,248,0.06); text-decoration: none; }
.resource-link i { color: var(--primary); flex-shrink: 0; width: 16px; text-align: center; }
.resources-actions { display: flex; gap: var(--spacing-lg); justify-content: center; flex-wrap: wrap; }
.resource-btn {
  display: inline-flex; align-items: center; gap: var(--spacing-sm);
  padding: 13px 28px; border-radius: var(--border-radius); font-weight: 600;
  font-size: var(--text-base); text-decoration: none; transition: var(--transition);
  cursor: pointer; border: none; font-family: inherit;
}
.resource-btn.primary { background: var(--gradient-primary); color: var(--on-primary); box-shadow: var(--glow-primary); }
.resource-btn.primary:hover { transform: translateY(-2px); filter: brightness(1.08); text-decoration: none; color: var(--on-primary); }
.resource-btn.secondary { background: transparent; color: var(--on-surface); border: 1px solid var(--outline-variant); }
.resource-btn.secondary:hover { border-color: var(--primary); color: var(--primary); background: rgba(56,189,248,0.08); text-decoration: none; transform: translateY(-2px); }

/* ── FOOTER ── */
.footer { background: var(--surface-container-lowest); border-top: 1px solid var(--outline-variant); padding: var(--spacing-2xl) 0; }
.footer-container { max-width: var(--container-max-width); margin: 0 auto; padding: 0 var(--container-padding); }
.footer-content { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--spacing-2xl); flex-wrap: wrap; }
.footer-ieee-badge { display: inline-flex; align-items: center; gap: 8px; color: var(--primary); font-family: var(--font-mono); font-weight: 600; font-size: var(--text-sm); margin-bottom: var(--spacing-md); }
.footer-description { color: var(--on-surface-variant); font-size: var(--text-sm); max-width: 420px; line-height: 1.6; margin-bottom: var(--spacing-md); }
.partner-logos { display: flex; gap: var(--spacing-md); align-items: center; }
.partner-link { display: block; opacity: 0.7; transition: var(--transition); }
.partner-link:hover { opacity: 1; }
.partner-logo { height: 28px; width: auto; filter: brightness(0) invert(1); }
.footer-links { display: flex; flex-direction: column; gap: var(--spacing-sm); margin-bottom: var(--spacing-lg); }
.footer-links a { color: var(--on-surface-variant); font-size: var(--text-sm); display: flex; align-items: center; gap: 8px; }
.footer-links a:hover { color: var(--primary); }
.footer-credit { color: var(--on-surface-variant); font-size: var(--text-sm); display: flex; align-items: center; gap: 6px; }

/* ── ANIMACIONES ── */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.7; } }
.animate-in { animation: fadeInUp 0.5s ease forwards; }
.section-highlight { box-shadow: 0 0 0 3px rgba(56,189,248,0.3); }

/* Focus */
.command-card:focus-visible, .ecosystem-card:focus-visible,
.hero-nav-link:focus-visible, .insight-card:focus-visible {
  outline: 2px solid var(--primary); outline-offset: 2px;
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .theory-hero { padding: 3rem 0 2.5rem; }
  .concept-grid, .commands-grid, .ecosystem-grid { grid-template-columns: 1fr; }
  .insights-grid { grid-template-columns: 1fr 1fr; }
  .github-flow { flex-direction: column; align-items: flex-start; }
  .step-connector { width: 2px; height: 20px; min-width: unset; max-width: unset; margin-top: 0; margin-left: 19px; }
  .gitflow-diagram { flex-direction: column; }
  .flow-arrow { transform: rotate(90deg); }
  .conflicts-explanation { grid-template-columns: 1fr; }
  .hero-navigation { gap: 0.5rem; }
  .hero-nav-link { padding: 7px 14px; font-size: 0.78rem; }
}
@media (max-width: 480px) {
  .insights-grid { grid-template-columns: 1fr; }
  .resources-actions { flex-direction: column; align-items: center; }
  .copilot-features { flex-direction: column; gap: var(--spacing-sm); }
}
"""

with open('C:/Users/User/Desktop/IEEE/styles/teoria.css', 'w', encoding='utf-8') as f:
    f.write(NEW_CSS)
print("teoria.css written:", len(NEW_CSS), "chars")
