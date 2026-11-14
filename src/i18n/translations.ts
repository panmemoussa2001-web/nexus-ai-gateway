import { ActionCategory, Language, RuleId } from '../types/nexus';

export interface TranslationPack {
  tagline: string;
  company: {
    name: string;
    product: string;
    founderName: string;
    founderRole: string;
    foundedBy: string;
    founderShort: string;
    vision: string;
    founderBioParagraph1: string;
    founderBioParagraph2: string;
  };
  prototypeBanner: string;
  nav: {
    landing: string;
    dashboard: string;
    agents: string;
    policies: string;
    simulator: string;
    approvals: string;
    audit: string;
    analytics: string;
    settings: string;
    documentation: string;
    about: string;
    account: string;
    overviewGroup: string;
    governanceGroup: string;
    systemGroup: string;
  };
  common: {
    openDashboard: string;
    openSimulator: string;
    signIn: string;
    createAccount: string;
    signOut: string;
    save: string;
    saved: string;
    cancel: string;
    reset: string;
    search: string;
    filter: string;
    all: string;
    enabled: string;
    disabled: string;
    pending: string;
    approved: string;
    rejected: string;
    allow: string;
    block: string;
    humanApprovalRequired: string;
    requestId: string;
    agent: string;
    action: string;
    category: string;
    amount: string;
    decision: string;
    rule: string;
    timestamp: string;
    status: string;
    description: string;
    noResults: string;
    demoNoticeShort: string;
    demoModeLabel: string;
    accountModeLabel: string;
  };
  categories: Record<ActionCategory, string>;
  rules: Record<RuleId, { title: string; summary: string }>;
  landing: {
    eyebrow: string;
    headline: string;
    intro: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaAccount: string;
    howTitle: string;
    howSubtitle: string;
    steps: Array<{ num: string; title: string; body: string }>;
    featuresTitle: string;
    featuresSubtitle: string;
    features: Array<{ title: string; body: string }>;
    founderSectionTitle: string;
    founderProfileBtn: string;
    prototypeTitle: string;
    prototypeBody: string;
    prototypeBullets: string[];
    footerMission: string;
  };
  dashboard: {
    title: string;
    personalTitle: string;
    subtitle: string;
    sampleNotice: string;
    accountNotice: string;
    switchToDemo: string;
    switchToAccount: string;
    emptyAccountTitle: string;
    emptyAccountBody: string;
    loadTemplatesBtn: string;
    kpiTotal: string;
    kpiApproved: string;
    kpiBlocked: string;
    kpiPending: string;
    kpiAgents: string;
    dailyChartTitle: string;
    dailyChartSub: string;
    distributionTitle: string;
    securityOverviewTitle: string;
    maxCapLabel: string;
    prohibitedCountLabel: string;
    approvalCountLabel: string;
    recentActivityTitle: string;
    viewAllLogs: string;
    reviewPending: string;
  };
  agents: {
    title: string;
    subtitle: string;
    registerTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    purposeLabel: string;
    purposePlaceholder: string;
    categoryLabel: string;
    registerBtn: string;
    registryTitle: string;
    demoId: string;
    created: string;
    toggleEnable: string;
    toggleDisable: string;
    viewActivity: string;
    activityFor: string;
    noActivityForAgent: string;
    closePanel: string;
    errName: string;
    errPurpose: string;
  };
  policies: {
    title: string;
    subtitle: string;
    orderNotice: string;
    maxAmountLabel: string;
    maxAmountHelp: string;
    categoryMatrixTitle: string;
    categoryMatrixHelp: string;
    modeAllow: string;
    modeApproval: string;
    modeBlock: string;
    modeUnmapped: string;
    agentOverridesTitle: string;
    agentOverridesHelp: string;
    overrideInherit: string;
    overrideApproval: string;
    overrideReadOnly: string;
    overrideBlocked: string;
    savePolicy: string;
    resetPolicy: string;
    evalOrderTitle: string;
    errAmount: string;
  };
  simulator: {
    title: string;
    subtitle: string;
    disclaimer: string;
    presetsTitle: string;
    agentLabel: string;
    selectAgent: string;
    actionLabel: string;
    actionPlaceholder: string;
    categoryLabel: string;
    amountLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    checkActionBtn: string;
    testIncompleteBtn: string;
    resultTitle: string;
    emptyResult: string;
    triggeredRuleLabel: string;
    explanationLabel: string;
    goToApprovals: string;
    errAgent: string;
    errAction: string;
    errAmount: string;
    errDescription: string;
  };
  approvals: {
    title: string;
    subtitle: string;
    disclaimer: string;
    reasonLabel: string;
    approveBtn: string;
    rejectBtn: string;
    reviewedAt: string;
    emptyTitle: string;
    emptyBody: string;
  };
  audit: {
    title: string;
    subtitle: string;
    disclaimer: string;
    searchPlaceholder: string;
    showingCount: string;
    detailsLabel: string;
  };
  analytics: {
    title: string;
    subtitle: string;
    sampleNotice: string;
    requestsOverTime: string;
    approvalVsBlock: string;
    pendingRatio: string;
    topRulesTitle: string;
    triggersLabel: string;
  };
  settings: {
    title: string;
    subtitle: string;
    appNameLabel: string;
    languageLabel: string;
    themeLabel: string;
    themeDark: string;
    themeLight: string;
    policyQuickLabel: string;
    saveSettings: string;
    companySectionTitle: string;
    companyNameLabel: string;
    productNameLabel: string;
    founderSectionTitle: string;
    founderNameLabel: string;
    founderPositionLabel: string;
    resetSectionTitle: string;
    resetSectionBody: string;
    resetBtn: string;
    resetConfirmBtn: string;
    resetDone: string;
  };
  docs: {
    title: string;
    subtitle: string;
    sections: Array<{ title: string; body: string; items?: string[] }>;
  };
  about: {
    title: string;
    subtitle: string;
    companyCardTitle: string;
    visionLabel: string;
    founderCardTitle: string;
    founderLabel: string;
    openDashboardBtn: string;
    openAccountBtn: string;
  };
  account: {
    title: string;
    subtitle: string;
    signInTab: string;
    registerTab: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    orgLabel: string;
    orgPlaceholder: string;
    passwordLabel: string;
    passwordHint: string;
    submitSignIn: string;
    submitRegister: string;
    continueDemoBtn: string;
    personalDashboardTitle: string;
    accountIdLabel: string;
    memberSinceLabel: string;
    organizationLabel: string;
    activeModeLabel: string;
    usePersonalBtn: string;
    useDemoBtn: string;
    openPersonalDashboard: string;
    seedTemplatesBtn: string;
    seedDone: string;
    backendTitle: string;
    backendBody: string;
    backendBullets: string[];
    errFullName: string;
    errEmail: string;
    errPassword: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationPack> = {
  en: {
    tagline: 'Trust. Control. Intelligence.',
    company: {
      name: 'NEXUS',
      product: 'NEXUS AI GATEWAY',
      founderName: 'Adama Watt',
      founderRole: 'Founder & Chief Executive Officer',
      foundedBy: 'Founded by Adama Watt',
      founderShort: 'Adama Watt — Founder & CEO',
      vision:
        'Build a global technology infrastructure for the governance, authorization and security of autonomous AI agents.',
      founderBioParagraph1:
        'Adama Watt is the founder and Chief Executive Officer of NEXUS, a technology project focused on AI agent governance, authorization and controlled execution.',
      founderBioParagraph2:
        'His vision is to contribute to a future where autonomous artificial intelligence operates with greater transparency, accountability and control.',
    },
    prototypeBanner:
      'NEXUS AI GATEWAY evaluates simulated agent actions deterministically against configured policies. No real bank accounts, payment processors, or external AI agents are connected.',
    nav: {
      landing: 'Overview',
      dashboard: 'Dashboard',
      agents: 'AI Agents',
      policies: 'Security Policies',
      simulator: 'Action Simulator',
      approvals: 'Human Approvals',
      audit: 'Audit Logs',
      analytics: 'Analytics',
      settings: 'Settings',
      documentation: 'Documentation',
      about: 'About & Founder',
      account: 'Account & Access',
      overviewGroup: 'Platform',
      governanceGroup: 'Governance & Control',
      systemGroup: 'Company & System',
    },
    common: {
      openDashboard: 'Open Dashboard',
      openSimulator: 'Launch Simulator',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      signOut: 'Sign Out',
      save: 'Save Changes',
      saved: 'Changes saved',
      cancel: 'Cancel',
      reset: 'Reset',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      enabled: 'Enabled',
      disabled: 'Disabled',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      allow: 'ALLOW',
      block: 'BLOCK',
      humanApprovalRequired: 'HUMAN APPROVAL REQUIRED',
      requestId: 'Request ID',
      agent: 'Agent',
      action: 'Requested Action',
      category: 'Category',
      amount: 'Amount',
      decision: 'Decision',
      rule: 'Triggered Policy',
      timestamp: 'Timestamp',
      status: 'Status',
      description: 'Description',
      noResults: 'No matching records found.',
      demoNoticeShort: 'Demo Mode (Local Sandbox)',
      demoModeLabel: 'Demo Mode',
      accountModeLabel: 'Personal Account',
    },
    categories: {
      read_reporting: 'Read & Reporting',
      system_monitoring: 'System Monitoring',
      external_communication: 'External Communication',
      financial_transaction: 'Financial Transaction',
      data_deletion: 'Data Deletion',
      confidential_access: 'Confidential Access',
      unclassified: 'Unclassified / Ambiguous',
    },
    rules: {
      RULE_1: {
        title: 'Rule 1 — Explicit Prohibition',
        summary: 'If an action, category, or agent state is explicitly prohibited, return BLOCK.',
      },
      RULE_2: {
        title: 'Rule 2 — Human Authorization Required',
        summary: 'If an action or agent policy requires human sign-off, return HUMAN APPROVAL REQUIRED.',
      },
      RULE_3: {
        title: 'Rule 3 — Maximum Amount Threshold',
        summary: 'If the simulated amount exceeds the configured policy ceiling, return BLOCK.',
      },
      RULE_4: {
        title: 'Rule 4 — Policy Compliant',
        summary: 'If the action is in an allowed category and passes all checks, return ALLOW.',
      },
      RULE_5: {
        title: 'Rule 5 — Incomplete or Unclassified Guard',
        summary: 'If the request is incomplete or cannot be evaluated safely, return HUMAN APPROVAL REQUIRED.',
      },
    },
    landing: {
      eyebrow: 'NEXUS AI GATEWAY · VERSION 1.1',
      headline: 'Deterministic governance between autonomous AI agents and enterprise actions.',
      intro:
        'NEXUS acts as an explicit policy control layer before any simulated agent action proceeds. Every request is inspected deterministically against organizational limits, category rules, and human approval checkpoints.',
      ctaPrimary: 'Open Dashboard',
      ctaSecondary: 'Try Action Simulator',
      ctaAccount: 'Create Account / Sign In',
      howTitle: 'How the NEXUS Control Layer Works',
      howSubtitle:
        'Every agent intent passes through a predictable, deterministic verification pipeline before an outcome is issued.',
      steps: [
        {
          num: '01.',
          title: 'Agent Intent Submission',
          body: 'An AI agent requests a specific tool execution—such as reading a report, sending an outbound message, or initiating a simulated transfer—tagged with metadata and amount.',
        },
        {
          num: '02.',
          title: 'Deterministic Policy Check',
          body: 'NEXUS evaluates the request against five ordered policy rules: explicit prohibitions, human authorization scopes, maximum monetary limits, and payload completeness.',
        },
        {
          num: '03.',
          title: 'Controlled Outcome & Audit',
          body: 'The gateway returns ALLOW, BLOCK, or HUMAN APPROVAL REQUIRED with a transparent explanation, rule reference, and isolated workspace log entry.',
        },
      ],
      featuresTitle: 'Core Governance Capabilities',
      featuresSubtitle: 'Designed for AI developers, fintech companies, and enterprise platform teams.',
      features: [
        {
          title: 'Personal Accounts & Isolated Workspaces',
          body: 'Create a personal account to manage your own agents, security policies, approvals, and audit logs—or switch to Demo Mode anytime for instant testing.',
        },
        {
          title: 'Configurable Policy Engine',
          body: 'Define maximum transaction thresholds, prohibited categories, human-in-the-loop triggers, and agent-specific restrictions.',
        },
        {
          title: 'Human Approval Queue',
          body: 'Route sensitive simulated communications or disbursements to an operator console for explicit approve or reject decisions.',
        },
        {
          title: 'Searchable Audit & Analytics',
          body: 'Inspect every evaluation decision, triggered rule, and approval action with bilingual English and French support.',
        },
      ],
      founderSectionTitle: 'Leadership & Vision',
      founderProfileBtn: 'View Founder Profile',
      prototypeTitle: 'Demonstration Scope & Architecture Notice',
      prototypeBody:
        'User accounts use local Express authentication (scrypt password hashing + signed HttpOnly session cookies) with isolated per-user server storage, while Demo Mode uses browser localStorage. It does not claim certified cybersecurity protection or production financial integrations.',
      prototypeBullets: [
        'All policy decisions are computed deterministically without relying on AI guesswork.',
        'No real bank accounts, payment processors, email gateways, or external AI agents are connected.',
        'A live enterprise production deployment would require a managed cloud database (PostgreSQL / Firestore), HTTPS TLS enforcement, and independent security audits.',
      ],
      footerMission:
        'NEXUS · NEXUS AI GATEWAY — Founded by Adama Watt, Founder & CEO.',
    },
    dashboard: {
      title: 'Governance Dashboard',
      personalTitle: 'Personal Governance Dashboard',
      subtitle: 'Operational overview of agent activity, policy outcomes, and pending reviews.',
      sampleNotice: 'Demo Mode — Sample & local sandbox data',
      accountNotice: 'Personal Account — Isolated user workspace',
      switchToDemo: 'Switch to Demo Mode',
      switchToAccount: 'Switch to Personal Account',
      emptyAccountTitle: 'Your personal governance workspace is ready',
      emptyAccountBody:
        'Register your first AI agent, run an evaluation in the Action Simulator, or load starter policy templates to populate your personal dashboard.',
      loadTemplatesBtn: 'Load Starter Agents & History',
      kpiTotal: 'Simulated Requests',
      kpiApproved: 'Approved Actions',
      kpiBlocked: 'Blocked Actions',
      kpiPending: 'Pending Approvals',
      kpiAgents: 'Registered Agents',
      dailyChartTitle: 'Daily Simulated Activity',
      dailyChartSub: 'Decisions evaluated across recent days',
      distributionTitle: 'Decision Distribution',
      securityOverviewTitle: 'Active Policy Posture',
      maxCapLabel: 'Max Simulated Amount',
      prohibitedCountLabel: 'Prohibited Categories',
      approvalCountLabel: 'Approval-Gated Categories',
      recentActivityTitle: 'Recent Simulated Activity',
      viewAllLogs: 'View Audit Logs',
      reviewPending: 'Review Queue',
    },
    agents: {
      title: 'AI Agent Management',
      subtitle: 'Register agents, manage operational status, and inspect simulated request history.',
      registerTitle: 'Register Agent',
      nameLabel: 'Agent Name',
      namePlaceholder: 'e.g., Vendor Invoice Verifier',
      purposeLabel: 'Operational Purpose',
      purposePlaceholder: 'Describe what simulated tasks this agent performs...',
      categoryLabel: 'Domain Category',
      registerBtn: 'Register Agent',
      registryTitle: 'Registered Agents',
      demoId: 'Agent ID',
      created: 'Created',
      toggleEnable: 'Enable Agent',
      toggleDisable: 'Disable Agent',
      viewActivity: 'View Activity',
      activityFor: 'Simulated Activity for',
      noActivityForAgent: 'No simulated requests recorded for this agent yet.',
      closePanel: 'Close Panel',
      errName: 'Please enter an agent name (at least 3 characters).',
      errPurpose: 'Please provide a clear purpose description (at least 10 characters).',
    },
    policies: {
      title: 'Security Policy Engine',
      subtitle: 'Configure deterministic rules evaluated in a fixed, predictable order prior to simulated execution.',
      orderNotice: 'Rules are always evaluated strictly from Rule 1 through Rule 5 without AI guesswork.',
      maxAmountLabel: 'Maximum Simulated Transaction Amount (USD)',
      maxAmountHelp: 'Requests exceeding this amount are automatically blocked by Rule 3.',
      categoryMatrixTitle: 'Action Category Policy Matrix',
      categoryMatrixHelp: 'Assign each action category to Allowed, Human Approval Required, Prohibited, or Unmapped.',
      modeAllow: 'Allow (Rule 4)',
      modeApproval: 'Require Approval (Rule 2)',
      modeBlock: 'Prohibit (Rule 1)',
      modeUnmapped: 'Unmapped (Rule 5)',
      agentOverridesTitle: 'Agent-Specific Permissions',
      agentOverridesHelp: 'Override default category policies for individual agents.',
      overrideInherit: 'Inherit Category Policy',
      overrideApproval: 'Always Require Human Approval',
      overrideReadOnly: 'Read-Only Scope (Block Writes)',
      overrideBlocked: 'Explicitly Blocked (Rule 1)',
      savePolicy: 'Save Policy Configuration',
      resetPolicy: 'Restore Default Policies',
      evalOrderTitle: 'Fixed Evaluation Order',
      errAmount: 'Maximum amount must be a valid number greater than or equal to 0.',
    },
    simulator: {
      title: 'Action Simulator',
      subtitle: 'Test how NEXUS evaluates an agent request deterministically against your active security policies.',
      disclaimer:
        'Simulation only: Checking an action never executes an actual payment, email, file deletion, or external API call.',
      presetsTitle: 'Quick Demo Scenarios',
      agentLabel: 'AI Agent',
      selectAgent: 'Select a registered agent',
      actionLabel: 'Requested Action',
      actionPlaceholder: 'e.g., Read an authorized report',
      categoryLabel: 'Action Category',
      amountLabel: 'Simulated Amount (USD)',
      descriptionLabel: 'Action Description & Context',
      descriptionPlaceholder: 'Provide context for why the agent is requesting this action...',
      checkActionBtn: 'CHECK ACTION',
      testIncompleteBtn: 'Simulate Incomplete Payload (Rule 5)',
      resultTitle: 'Evaluation Result',
      emptyResult: 'Submit a simulated request on the left to inspect the deterministic policy decision and triggered rule.',
      triggeredRuleLabel: 'Triggered Rule',
      explanationLabel: 'Policy Explanation',
      goToApprovals: 'Open Human Approvals',
      errAgent: 'Please select an AI agent (register one first if your workspace is empty).',
      errAction: 'Please specify the requested action.',
      errAmount: 'Amount must be 0 or a positive number.',
      errDescription: 'Please enter a description of at least 5 characters.',
    },
    approvals: {
      title: 'Human Approval Center',
      subtitle: 'Review simulated agent actions paused by Rule 2 or Rule 5 for explicit human authorization.',
      disclaimer:
        'Simulation notice: Approving or rejecting a request only updates its simulated status and records an entry in the audit log.',
      reasonLabel: 'Reason for Approval',
      approveBtn: 'Approve demo request',
      rejectBtn: 'Reject demo request',
      reviewedAt: 'Reviewed',
      emptyTitle: 'No approval requests',
      emptyBody: 'Simulate an email or within-limit payment in the Action Simulator to generate a pending request.',
    },
    audit: {
      title: 'Audit Logs',
      subtitle: 'Chronological history of simulated evaluations and human authorization decisions.',
      disclaimer:
        'Demonstration audit log only: Stored in local workspace storage and is NOT a tamper-proof or cryptographically verifiable security audit.',
      searchPlaceholder: 'Search by Request ID, agent, action, or rule...',
      showingCount: 'Showing',
      detailsLabel: 'Evaluation Details',
    },
    analytics: {
      title: 'Governance Analytics',
      subtitle: 'Consistent visual breakdown of simulated gateway traffic, rule triggers, and approval ratios.',
      sampleNotice: 'Metrics reflect active workspace data',
      requestsOverTime: 'Activity Over Time',
      approvalVsBlock: 'Approved vs. Blocked vs. Human Review',
      pendingRatio: 'Approval Queue Status',
      topRulesTitle: 'Most Frequently Triggered Policies',
      triggersLabel: 'triggers',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Customize application identity, interface language, visual theme, and workspace data.',
      appNameLabel: 'Application Name',
      languageLabel: 'Interface Language',
      themeLabel: 'Interface Theme',
      themeDark: 'Dark Navy (Enterprise Default)',
      themeLight: 'Light Slate',
      policyQuickLabel: 'Quick Policy Ceiling (USD)',
      saveSettings: 'Save Settings',
      companySectionTitle: 'Company Information',
      companyNameLabel: 'Company',
      productNameLabel: 'Product',
      founderSectionTitle: 'Founder Information',
      founderNameLabel: 'Founder & Creator',
      founderPositionLabel: 'Position',
      resetSectionTitle: 'Reset Demo Sandbox Data',
      resetSectionBody:
        'Restore Demo Mode agents, security policies, approval requests, audit logs, and preferences back to initial factory seed data (does not erase signed-in personal accounts).',
      resetBtn: 'Reset Demo Data',
      resetConfirmBtn: 'Confirm Reset Demo Data',
      resetDone: 'Demo data restored to initial defaults.',
    },
    docs: {
      title: 'Documentation & Setup',
      subtitle: 'Control architecture, deterministic policy model, backend setup details, and prototype boundaries.',
      sections: [
        {
          title: '1. Control Layer Architecture',
          body: 'NEXUS AI GATEWAY sits between autonomous AI agents and enterprise tools (banking APIs, email gateways, file systems, data warehouses). Rather than trusting an agent prompt or LLM judgment alone, every tool invocation must pass a deterministic policy check.',
        },
        {
          title: '2. Deterministic Rule Evaluation Order',
          body: 'Policies are evaluated sequentially in a fixed, reproducible order so identical inputs under identical configurations always yield identical decisions:',
          items: [
            'Rule 1 (BLOCK): Triggers when an agent is disabled, explicitly blocked, restricted to read-only writes, or requests a prohibited category.',
            'Rule 5 (HUMAN APPROVAL REQUIRED): Triggers early if the request payload is incomplete, unclassified, or missing a required transaction amount.',
            'Rule 3 (BLOCK): Triggers when the simulated monetary amount exceeds the configured maximum policy threshold.',
            'Rule 2 (HUMAN APPROVAL REQUIRED): Triggers when the action category or agent override mandates human review before execution.',
            'Rule 4 (ALLOW): Triggers when the action belongs to an explicitly allowed category and satisfies every prior check.',
          ],
        },
        {
          title: '3. Authentication & Database Setup',
          body: 'NEXUS AI GATEWAY supports both a separate Demo Mode (browser localStorage) and personal user accounts backed by the Express server (server.ts):',
          items: [
            'Password Hashing: Uses Node.js crypto.scryptSync with per-user 16-byte random salts and timing-safe comparison.',
            'Session Management: Issues HMAC-SHA256 signed HttpOnly cookies (configure SESSION_SECRET in production environment variables).',
            'Current Storage: Account credentials and isolated per-user workspaces are persisted locally in data/nexus-auth-db.json.',
            'Production Database Upgrade: For multi-instance cloud scale, replace LocalAuthStore with PostgreSQL (e.g., Cloud SQL with Drizzle) or Firebase Auth & Firestore, enforce HTTPS Secure cookies, and add email verification and rate limiting.',
          ],
        },
        {
          title: '4. Security & Prototype Limitations',
          body: 'This application is built strictly as a demonstration platform (Version 1.1). It does NOT claim certified cybersecurity protection, live payment protection, tamper-proof WORM audit logs, or live connections to external banks or AI agents.',
        },
      ],
    },
    about: {
      title: 'About NEXUS & Founder Profile',
      subtitle: 'Company mission, governance infrastructure vision, and official leadership profile.',
      companyCardTitle: 'About NEXUS',
      visionLabel: 'Company Vision',
      founderCardTitle: 'Official Founder Profile',
      founderLabel: 'Founder & Chief Executive Officer · NEXUS AI GATEWAY',
      openDashboardBtn: 'Open Governance Dashboard',
      openAccountBtn: 'Personal Account & Access',
    },
    account: {
      title: 'Account & Access',
      subtitle: 'Sign in or create a personal NEXUS account to isolate your own agents, policies, and audit logs, or use Demo Mode for testing.',
      signInTab: 'Sign In',
      registerTab: 'Create Account',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'e.g., Adama Watt',
      emailLabel: 'Work Email',
      emailPlaceholder: 'name@company.com',
      orgLabel: 'Company / Organization (Optional)',
      orgPlaceholder: 'e.g., NEXUS',
      passwordLabel: 'Password',
      passwordHint: 'Minimum 8 characters (hashed server-side with scrypt).',
      submitSignIn: 'Sign In to Personal Account',
      submitRegister: 'Create Personal Account',
      continueDemoBtn: 'Continue in Demo Mode (Testing Sandbox)',
      personalDashboardTitle: 'Personal Account Dashboard',
      accountIdLabel: 'Account ID',
      memberSinceLabel: 'Member Since',
      organizationLabel: 'Organization',
      activeModeLabel: 'Active Workspace Mode',
      usePersonalBtn: 'Use Personal Account Workspace',
      useDemoBtn: 'Switch to Demo Mode Sandbox',
      openPersonalDashboard: 'Open Governance Dashboard',
      seedTemplatesBtn: 'Populate Starter Agents & Sample History',
      seedDone: 'Starter agents and sample records added to your personal workspace.',
      backendTitle: 'Backend & Database Architecture Disclosure',
      backendBody:
        'User registration, login, and isolated per-user workspaces are powered by the local Express backend (server.ts) with scrypt password hashing and HMAC-signed HttpOnly session cookies.',
      backendBullets: [
        'Local Storage Backend: Account records and isolated workspaces are persisted on disk at data/nexus-auth-db.json (no external cloud DB provisioned).',
        'Demo Mode Separation: Demo Mode runs strictly in your browser localStorage so testing never alters personal account data.',
        'Production Requirements: Deploying for external enterprise customers requires migrating to a managed relational or cloud database (PostgreSQL / Cloud SQL or Firebase Auth & Firestore), configuring SESSION_SECRET in a secrets manager, enforcing HTTPS Secure cookies, and adding email verification and password recovery.',
      ],
      errFullName: 'Full name must be at least 2 characters.',
      errEmail: 'Please enter a valid email address.',
      errPassword: 'Password must be at least 8 characters.',
    },
  },
  fr: {
    tagline: 'Confiance. Contrôle. Intelligence.',
    company: {
      name: 'NEXUS',
      product: 'NEXUS AI GATEWAY',
      founderName: 'Adama Watt',
      founderRole: 'Fondateur & Président-Directeur Général',
      foundedBy: 'Fondé par Adama Watt',
      founderShort: 'Adama Watt — Fondateur & PDG',
      vision:
        'Construire une infrastructure technologique mondiale pour la gouvernance, l’autorisation et la sécurité des agents IA autonomes.',
      founderBioParagraph1:
        'Adama Watt est le fondateur et Président-Directeur Général de NEXUS, un projet technologique axé sur la gouvernance, l’autorisation et l’exécution contrôlée des agents IA.',
      founderBioParagraph2:
        'Sa vision est de contribuer à un avenir où l’intelligence artificielle autonome opère avec plus de transparence, de responsabilité et de contrôle.',
    },
    prototypeBanner:
      'NEXUS AI GATEWAY évalue de manière déterministe des actions simulées d’agents selon vos politiques. Aucun compte bancaire réel, processeur de paiement ou agent externe n’est connecté.',
    nav: {
      landing: 'Accueil',
      dashboard: 'Tableau de bord',
      agents: 'Agents IA',
      policies: 'Politiques de sécurité',
      simulator: 'Simulateur d’actions',
      approvals: 'Validations humaines',
      audit: 'Journaux d’audit',
      analytics: 'Analytique',
      settings: 'Paramètres',
      documentation: 'Documentation',
      about: 'À propos & Fondateur',
      account: 'Compte & Accès',
      overviewGroup: 'Plateforme',
      governanceGroup: 'Gouvernance & Contrôle',
      systemGroup: 'Entreprise & Système',
    },
    common: {
      openDashboard: 'Ouvrir le tableau de bord',
      openSimulator: 'Lancer le simulateur',
      signIn: 'Connexion',
      createAccount: 'Créer un compte',
      signOut: 'Déconnexion',
      save: 'Enregistrer',
      saved: 'Modifications enregistrées',
      cancel: 'Annuler',
      reset: 'Réinitialiser',
      search: 'Rechercher',
      filter: 'Filtrer',
      all: 'Tout',
      enabled: 'Activé',
      disabled: 'Désactivé',
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      allow: 'ALLOW',
      block: 'BLOCK',
      humanApprovalRequired: 'HUMAN APPROVAL REQUIRED',
      requestId: 'ID Requête',
      agent: 'Agent',
      action: 'Action demandée',
      category: 'Catégorie',
      amount: 'Montant',
      decision: 'Décision',
      rule: 'Règle déclenchée',
      timestamp: 'Horodatage',
      status: 'Statut',
      description: 'Description',
      noResults: 'Aucun enregistrement correspondant.',
      demoNoticeShort: 'Mode Démo (Bac à sable local)',
      demoModeLabel: 'Mode Démo',
      accountModeLabel: 'Compte Personnel',
    },
    categories: {
      read_reporting: 'Lecture & Rapports',
      system_monitoring: 'Surveillance système',
      external_communication: 'Communication externe',
      financial_transaction: 'Transaction financière',
      data_deletion: 'Suppression de données',
      confidential_access: 'Accès confidentiel',
      unclassified: 'Non classifiée / Ambiguë',
    },
    rules: {
      RULE_1: {
        title: 'Règle 1 — Interdiction explicite',
        summary: 'Si une action, catégorie ou un agent est interdit, retourner BLOCK.',
      },
      RULE_2: {
        title: 'Règle 2 — Autorisation humaine requise',
        summary: 'Si l’action ou l’agent exige une validation humaine, retourner HUMAN APPROVAL REQUIRED.',
      },
      RULE_3: {
        title: 'Règle 3 — Plafond de montant dépassé',
        summary: 'Si le montant simulé dépasse le plafond configuré, retourner BLOCK.',
      },
      RULE_4: {
        title: 'Règle 4 — Conforme aux politiques',
        summary: 'Si l’action est autorisée et respecte toutes les règles, retourner ALLOW.',
      },
      RULE_5: {
        title: 'Règle 5 — Requête incomplète ou incertaine',
        summary: 'Si la requête est incomplète ou ne peut être évaluée sûrement, retourner HUMAN APPROVAL REQUIRED.',
      },
    },
    landing: {
      eyebrow: 'NEXUS AI GATEWAY · VERSION 1.1',
      headline: 'Gouvernance déterministe entre les agents IA autonomes et les actions d’entreprise.',
      intro:
        'NEXUS agit comme une couche de contrôle explicite avant toute exécution d’action simulée. Chaque demande est vérifiée de manière déterministe selon des seuils financiers, des règles de catégorie et des points de validation humaine.',
      ctaPrimary: 'Ouvrir le tableau de bord',
      ctaSecondary: 'Tester le simulateur',
      ctaAccount: 'Créer un compte / Connexion',
      howTitle: 'Fonctionnement de la passerelle NEXUS',
      howSubtitle:
        'Chaque intention d’agent traverse un pipeline de vérification déterministe et prévisible avant toute décision.',
      steps: [
        {
          num: '01.',
          title: 'Soumission de l’intention',
          body: 'Un agent IA sollicite une action simulée — lecture de rapport, envoi d’e-mail ou demande de paiement — accompagnée de sa catégorie et de son montant.',
        },
        {
          num: '02.',
          title: 'Évaluation déterministe',
          body: 'NEXUS applique cinq règles ordonnées : interdictions explicites, exigences d’approbation humaine, plafonds financiers et complétude du contexte.',
        },
        {
          num: '03.',
          title: 'Décision & Journalisation',
          body: 'La passerelle renvoie ALLOW, BLOCK ou HUMAN APPROVAL REQUIRED avec une explication claire, la règle déclenchée et une trace isolée.',
        },
      ],
      featuresTitle: 'Capacités principales de gouvernance',
      featuresSubtitle: 'Conçu pour les développeurs IA, entreprises fintech et équipes plateformes.',
      features: [
        {
          title: 'Comptes personnels & espaces isolés',
          body: 'Créez un compte personnel pour gérer vos propres agents, politiques et journaux, ou utilisez le Mode Démo pour tester immédiatement.',
        },
        {
          title: 'Moteur de politiques configurable',
          body: 'Définissez les plafonds simulés, les catégories interdites, les validations humaines et les permissions par agent.',
        },
        {
          title: 'Centre d’approbation humaine',
          body: 'Acheminez les actions sensibles vers une file de révision pour approbation ou rejet explicite par un opérateur.',
        },
        {
          title: 'Audit & Analytique bilingues',
          body: 'Filtrez chaque décision et analysez la distribution des règles déclenchées en français ou en anglais.',
        },
      ],
      founderSectionTitle: 'Direction & Vision',
      founderProfileBtn: 'Voir le profil du fondateur',
      prototypeTitle: 'Périmètre de démonstration & Architecture',
      prototypeBody:
        'Les comptes utilisateurs utilisent une authentification Express locale (hachage scrypt + cookies signés HttpOnly) avec stockage isolé par utilisateur, tandis que le Mode Démo utilise localStorage.',
      prototypeBullets: [
        'Toutes les décisions sont calculées de manière déterministe sans dépendre d’opinions IA.',
        'Aucun compte bancaire réel, processeur de paiement, serveur d’e-mails ou agent externe n’est connecté.',
        'Un déploiement en production exigerait une base de données cloud managée (PostgreSQL / Firestore), HTTPS strict et des audits indépendants.',
      ],
      footerMission:
        'NEXUS · NEXUS AI GATEWAY — Fondé par Adama Watt, Fondateur & PDG.',
    },
    dashboard: {
      title: 'Tableau de bord de gouvernance',
      personalTitle: 'Tableau de bord personnel',
      subtitle: 'Vue opérationnelle de l’activité des agents, des décisions et des validations en attente.',
      sampleNotice: 'Mode Démo — Données d’exemple locales',
      accountNotice: 'Compte Personnel — Espace utilisateur isolé',
      switchToDemo: 'Passer en Mode Démo',
      switchToAccount: 'Revenir au Compte Personnel',
      emptyAccountTitle: 'Votre espace personnel de gouvernance est prêt',
      emptyAccountBody:
        'Enregistrez votre premier agent IA, lancez une simulation ou chargez des modèles de départ pour peupler votre tableau de bord.',
      loadTemplatesBtn: 'Charger des agents et exemples de départ',
      kpiTotal: 'Requêtes simulées',
      kpiApproved: 'Actions approuvées',
      kpiBlocked: 'Actions bloquées',
      kpiPending: 'En attente humaine',
      kpiAgents: 'Agents enregistrés',
      dailyChartTitle: 'Activité quotidienne simulée',
      dailyChartSub: 'Volume de décisions évaluées sur les derniers jours',
      distributionTitle: 'Répartition des décisions',
      securityOverviewTitle: 'Posture de politique active',
      maxCapLabel: 'Plafond simulé maximal',
      prohibitedCountLabel: 'Catégories interdites',
      approvalCountLabel: 'Catégories avec validation',
      recentActivityTitle: 'Activité simulée récente',
      viewAllLogs: 'Voir les journaux',
      reviewPending: 'Ouvrir les validations',
    },
    agents: {
      title: 'Gestion des agents IA',
      subtitle: 'Enregistrez des agents, gérez leur statut et consultez leur historique simulé.',
      registerTitle: 'Enregistrer un agent',
      nameLabel: 'Nom de l’agent',
      namePlaceholder: 'ex. Assistant Facturation Fournisseurs',
      purposeLabel: 'Objectif opérationnel',
      purposePlaceholder: 'Décrivez les tâches simulées confiées à cet agent...',
      categoryLabel: 'Catégorie de domaine',
      registerBtn: 'Enregistrer l’agent',
      registryTitle: 'Agents enregistrés',
      demoId: 'ID Agent',
      created: 'Création',
      toggleEnable: 'Activer',
      toggleDisable: 'Désactiver',
      viewActivity: 'Voir l’activité',
      activityFor: 'Activité simulée de',
      noActivityForAgent: 'Aucune requête simulée enregistrée pour cet agent.',
      closePanel: 'Fermer',
      errName: 'Veuillez saisir un nom d’agent (au moins 3 caractères).',
      errPurpose: 'Veuillez décrire l’objectif (au moins 10 caractères).',
    },
    policies: {
      title: 'Moteur de politiques de sécurité',
      subtitle: 'Configurez les règles déterministes évaluées dans un ordre fixe avant toute exécution simulée.',
      orderNotice: 'Les règles sont toujours évaluées strictement de la Règle 1 à la Règle 5.',
      maxAmountLabel: 'Montant maximal de transaction simulée (USD)',
      maxAmountHelp: 'Toute requête dépassant ce montant est automatiquement bloquée par la Règle 3.',
      categoryMatrixTitle: 'Matrice des catégories d’action',
      categoryMatrixHelp: 'Attribuez chaque catégorie à Autorisé, Validation humaine, Interdit ou Non mappé.',
      modeAllow: 'Autoriser (Règle 4)',
      modeApproval: 'Validation humaine (Règle 2)',
      modeBlock: 'Interdire (Règle 1)',
      modeUnmapped: 'Non mappé (Règle 5)',
      agentOverridesTitle: 'Permissions spécifiques par agent',
      agentOverridesHelp: 'Remplacez la politique par défaut pour certains agents.',
      overrideInherit: 'Hériter de la politique',
      overrideApproval: 'Toujours exiger validation humaine',
      overrideReadOnly: 'Lecture seule (bloquer écritures)',
      overrideBlocked: 'Explicitement bloqué (Règle 1)',
      savePolicy: 'Enregistrer la politique',
      resetPolicy: 'Rétablir les valeurs par défaut',
      evalOrderTitle: 'Ordre d’évaluation fixe',
      errAmount: 'Le plafond doit être un nombre valide supérieur ou égal à 0.',
    },
    simulator: {
      title: 'Simulateur d’actions',
      subtitle: 'Testez comment NEXUS évalue une action d’agent de manière déterministe selon vos règles actives.',
      disclaimer:
        'Simulation uniquement : le contrôle d’une action n’exécute jamais de paiement réel, d’e-mail, de suppression ou d’appel externe.',
      presetsTitle: 'Scénarios de démonstration rapides',
      agentLabel: 'Agent IA',
      selectAgent: 'Sélectionner un agent',
      actionLabel: 'Action demandée',
      actionPlaceholder: 'ex. Lire un rapport autorisé',
      categoryLabel: 'Catégorie d’action',
      amountLabel: 'Montant simulé (USD)',
      descriptionLabel: 'Description et contexte',
      descriptionPlaceholder: 'Précisez le contexte de la requête simulée...',
      checkActionBtn: 'CHECK ACTION',
      testIncompleteBtn: 'Simuler requête incomplète (Règle 5)',
      resultTitle: 'Résultat de l’évaluation',
      emptyResult: 'Soumettez une requête simulée à gauche pour afficher la décision déterministe et la règle déclenchée.',
      triggeredRuleLabel: 'Règle déclenchée',
      explanationLabel: 'Explication de la politique',
      goToApprovals: 'Ouvrir les validations',
      errAgent: 'Veuillez sélectionner un agent IA.',
      errAction: 'Veuillez indiquer l’action demandée.',
      errAmount: 'Le montant doit être égal ou supérieur à 0.',
      errDescription: 'Veuillez saisir une description d’au moins 5 caractères.',
    },
    approvals: {
      title: 'Centre de validation humaine',
      subtitle: 'Examinez les requêtes simulées mises en attente par la Règle 2 ou la Règle 5.',
      disclaimer:
        'Note : Approuver ou rejeter modifie uniquement le statut simulé de la demande et ajoute une ligne au journal.',
      reasonLabel: 'Motif de validation',
      approveBtn: 'Approuver la demande démo',
      rejectBtn: 'Rejeter la demande démo',
      reviewedAt: 'Traité le',
      emptyTitle: 'Aucune demande d’approbation',
      emptyBody: 'Simulez un e-mail ou un paiement dans le Simulateur d’actions pour créer une demande en attente.',
    },
    audit: {
      title: 'Journaux d’audit',
      subtitle: 'Historique chronologique des évaluations simulées et des décisions humaines.',
      disclaimer:
        'Journal de démonstration uniquement : non infalsifiable et non signé cryptographiquement.',
      searchPlaceholder: 'Rechercher par ID, agent, action ou règle...',
      showingCount: 'Affichage de',
      detailsLabel: 'Détails de l’évaluation',
    },
    analytics: {
      title: 'Analytique de gouvernance',
      subtitle: 'Visualisation cohérente du trafic simulé, des règles déclenchées et des approbations.',
      sampleNotice: 'Les graphiques reflètent les données de l’espace actif',
      requestsOverTime: 'Activité dans le temps',
      approvalVsBlock: 'Approuvées vs Bloquées vs Validation humaine',
      pendingRatio: 'État de la file d’approbation',
      topRulesTitle: 'Politiques les plus déclenchées',
      triggersLabel: 'déclenchements',
    },
    settings: {
      title: 'Paramètres',
      subtitle: 'Personnalisez le nom de l’application, la langue, le thème et les données.',
      appNameLabel: 'Nom de l’application',
      languageLabel: 'Langue de l’interface',
      themeLabel: 'Thème visuel',
      themeDark: 'Bleu nuit sombre (Défaut entreprise)',
      themeLight: 'Ardoise claire',
      policyQuickLabel: 'Plafond rapide de politique (USD)',
      saveSettings: 'Enregistrer les paramètres',
      companySectionTitle: 'Informations sur l’entreprise',
      companyNameLabel: 'Entreprise',
      productNameLabel: 'Produit',
      founderSectionTitle: 'Informations sur le fondateur',
      founderNameLabel: 'Fondateur & Créateur',
      founderPositionLabel: 'Fonction',
      resetSectionTitle: 'Réinitialiser le Mode Démo',
      resetSectionBody:
        'Restaure les agents, politiques, approbations, journaux et préférences du Mode Démo aux valeurs initiales (n’affecte pas les comptes personnels).',
      resetBtn: 'Réinitialiser les données démo',
      resetConfirmBtn: 'Confirmer la réinitialisation démo',
      resetDone: 'Données de démonstration réinitialisées.',
    },
    docs: {
      title: 'Documentation & Configuration',
      subtitle: 'Architecture de contrôle, modèle de règles déterministes, backend et limites du prototype.',
      sections: [
        {
          title: '1. Architecture de couche de contrôle',
          body: 'NEXUS AI GATEWAY se positionne entre les agents IA autonomes et les outils critiques. Chaque appel simulé est vérifié par des règles déterministes explicites avant toute décision.',
        },
        {
          title: '2. Ordre déterministe d’évaluation',
          body: 'Les règles sont évaluées dans un ordre strict garantissant une reproductibilité totale :',
          items: [
            'Règle 1 (BLOCK) : Agent désactivé, bloqué, restreint ou catégorie explicitement interdite.',
            'Règle 5 (HUMAN APPROVAL REQUIRED) : Requête incomplète, non classifiée ou montant manquant.',
            'Règle 3 (BLOCK) : Montant simulé supérieur au plafond maximal configuré.',
            'Règle 2 (HUMAN APPROVAL REQUIRED) : Catégorie ou agent exigeant une autorisation humaine.',
            'Règle 4 (ALLOW) : Catégorie autorisée et conformité complète avec toutes les règles.',
          ],
        },
        {
          title: '3. Authentification et base de données',
          body: 'NEXUS AI GATEWAY propose un Mode Démo séparé (localStorage) et des comptes personnels gérés par le serveur Express (server.ts) :',
          items: [
            'Hachage des mots de passe : Node.js crypto.scryptSync avec sel aléatoire et comparaison à temps constant.',
            'Sessions : Cookies HttpOnly signés par HMAC-SHA256 (définir SESSION_SECRET en production).',
            'Stockage actuel : Comptes et espaces isolés enregistrés localement dans data/nexus-auth-db.json.',
            'Mise en production : Utiliser une base managée (PostgreSQL / Cloud SQL ou Firebase Auth & Firestore), HTTPS strict, vérification d’e-mail et limitation de débit.',
          ],
        },
        {
          title: '4. Sécurité et limites du prototype',
          body: 'Ce logiciel est un prototype de démonstration (Version 1.1). Il ne fournit ni protection cybersécurité certifiée, ni sécurité bancaire réelle, ni journaux infalsifiables.',
        },
      ],
    },
    about: {
      title: 'À propos de NEXUS & Profil du fondateur',
      subtitle: 'Mission de l’entreprise, vision d’infrastructure de gouvernance et profil officiel du fondateur.',
      companyCardTitle: 'À propos de NEXUS',
      visionLabel: 'Vision de l’entreprise',
      founderCardTitle: 'Profil officiel du fondateur',
      founderLabel: 'Fondateur & Président-Directeur Général · NEXUS AI GATEWAY',
      openDashboardBtn: 'Ouvrir le tableau de bord',
      openAccountBtn: 'Compte personnel & Accès',
    },
    account: {
      title: 'Compte & Accès',
      subtitle: 'Connectez-vous ou créez un compte personnel NEXUS pour accéder à vos propres données, ou utilisez le Mode Démo pour tester.',
      signInTab: 'Connexion',
      registerTab: 'Créer un compte',
      fullNameLabel: 'Nom complet',
      fullNamePlaceholder: 'ex. Adama Watt',
      emailLabel: 'E-mail professionnel',
      emailPlaceholder: 'nom@entreprise.com',
      orgLabel: 'Entreprise / Organisation (Optionnel)',
      orgPlaceholder: 'ex. NEXUS',
      passwordLabel: 'Mot de passe',
      passwordHint: 'Minimum 8 caractères (hachage scrypt côté serveur).',
      submitSignIn: 'Se connecter au compte personnel',
      submitRegister: 'Créer mon compte personnel',
      continueDemoBtn: 'Continuer en Mode Démo (Bac à sable)',
      personalDashboardTitle: 'Tableau de bord du compte personnel',
      accountIdLabel: 'ID Compte',
      memberSinceLabel: 'Membre depuis',
      organizationLabel: 'Organisation',
      activeModeLabel: 'Mode d’espace actif',
      usePersonalBtn: 'Utiliser mon espace personnel',
      useDemoBtn: 'Basculer en Mode Démo',
      openPersonalDashboard: 'Ouvrir le tableau de bord',
      seedTemplatesBtn: 'Charger des agents et exemples de départ',
      seedDone: 'Modèles de départ ajoutés à votre espace personnel.',
      backendTitle: 'Architecture backend & base de données',
      backendBody:
        'L’inscription, la connexion et l’isolation des données par utilisateur reposent sur le serveur Express local (server.ts) avec hachage scrypt et cookies HttpOnly signés.',
      backendBullets: [
        'Stockage local : Les comptes et espaces isolés sont stockés sur disque dans data/nexus-auth-db.json.',
        'Séparation du Mode Démo : Le Mode Démo fonctionne uniquement dans localStorage pour ne jamais modifier vos données personnelles.',
        'Prérequis de production : Migration vers une base managée (PostgreSQL / Cloud SQL ou Firebase Auth & Firestore), gestionnaire de secrets pour SESSION_SECRET, cookies Secure HTTPS et vérification d’e-mail.',
      ],
      errFullName: 'Le nom complet doit contenir au moins 2 caractères.',
      errEmail: 'Veuillez saisir une adresse e-mail valide.',
      errPassword: 'Le mot de passe doit contenir au moins 8 caractères.',
    },
  },
};
