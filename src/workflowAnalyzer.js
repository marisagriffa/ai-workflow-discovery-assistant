export const sampleNotes = `Current expense reimbursement process:
- Employee fills out a form and attaches receipts
- Sends email to manager for approval
- Manager reviews and replies
- If approved, forwarded to finance inbox
- Finance checks policy and enters data in ERP
- If issues, sends email back to employee
- Payments run weekly

Pain points:
- Many back-and-forth emails
- Missing receipts cause delays
- Manual data entry into ERP
- Hard to track status

Tools: Gmail, Google Drive, Slack, Expensify, NetSuite.
Compliance requires audit trail and policy checks.
Goal: faster cycle time and fewer manual steps.`;

export function analyzeWorkflow(rawNotes) {
  const notes = rawNotes.trim();
  const signals = extractSignals(notes);

  if (!notes) {
    return emptyAnalysis;
  }

  return {
    currentWorkflow: [
      `Process starts with ${signals.actor} submitting business information, files, or approvals through the current tools.`,
      `Work moves across ${signals.tools.length ? signals.tools.join(", ") : "email, spreadsheets, and shared folders"} before completion.`,
      "Managers or process owners review the request, resolve exceptions, and pass approved work to the next team.",
      "The final team updates a system of record, communicates status, and closes the loop with the requester."
    ],
    bottlenecks: [
      "Manual handoffs create waiting time, context switching, and unclear ownership.",
      "Unstructured notes, emails, or attachments make it easy for required information to be missed.",
      "Status tracking depends on people checking inboxes or separate tools instead of one visible workflow.",
      signals.hasPolicy
        ? "Policy and compliance checks are repeated manually, which slows throughput and increases inconsistency."
        : "Decision rules are not explicit enough for consistent routing and exception handling."
    ],
    requirements: [
      "Capture structured intake data, required documents, and requester context at the start.",
      "Provide end-to-end status visibility for requesters, reviewers, and operators.",
      "Define routing rules, approval thresholds, exception paths, and escalation triggers.",
      "Maintain an audit trail showing who changed what, when, and why.",
      `Integrate with ${signals.tools.length ? signals.tools.slice(0, 4).join(", ") : "the current communication and system-of-record tools"}.`
    ],
    automationOpportunities: [
      "Extract structured fields from emails, forms, documents, and attachments.",
      "Classify requests by type, urgency, owner, and missing information.",
      "Draft replies, summaries, approval notes, and next-step recommendations.",
      "Validate requests against business rules, policies, and historical patterns.",
      "Sync status updates and final outputs across collaboration and system-of-record tools."
    ],
    humanReviewPoints: [
      "High-value, high-risk, or policy-sensitive requests.",
      "Missing, contradictory, or low-confidence information.",
      "Customer, employee, or vendor communications that require judgment or empathy.",
      "Final approval for exceptions, overrides, and irreversible system updates."
    ],
    implementationImpact: [
      "Estimated time saved: 30-45% cycle-time reduction once intake, routing, and status updates are automated.",
      "Manual steps reduced: remove duplicate data entry, repeated follow-up emails, manual status checks, and first-pass policy screening.",
      "Recommended adoption approach: start with a supervised pilot for one workflow, measure outcomes, then expand automation after reviewers trust the recommendations.",
      "Success metrics: average cycle time, exception rate, reviewer touches per request, automation confidence, audit completeness, and user satisfaction."
    ]
  };
}

export function generateUserStories(analysis, rawNotes) {
  const notes = rawNotes.trim();
  const signals = extractSignals(notes);

  if (!notes || !analysis || analysis === emptyAnalysis) {
    return [];
  }

  const storyContext = getStoryContext(analysis);

  return [
    createUserStory(
      1,
      "Ingreso estructurado de solicitudes",
      signals.storyRole,
      "enviar la informacion requerida una sola vez con documentos y contexto completos",
      storyContext.intakeValue
    ),
    createUserStory(
      2,
      "Revision guiada para aprobadores",
      "un revisor",
      "ver el contexto, las reglas aplicables y una recomendacion antes de aprobar o rechazar",
      storyContext.reviewValue
    ),
    createUserStory(
      3,
      "Gestion de excepciones",
      "un operador",
      "recibir los casos incompletos, contradictorios o sensibles en una cola priorizada",
      storyContext.exceptionValue
    ),
    createUserStory(
      4,
      "Seguimiento operativo del flujo",
      "un responsable del proceso",
      "consultar metricas de ciclo, volumen, excepciones y automatizacion",
      storyContext.reportingValue
    )
  ];
}

function extractSignals(notes) {
  const lowered = notes.toLowerCase();
  const tools = [
    "Gmail",
    "Google Drive",
    "Slack",
    "Salesforce",
    "HubSpot",
    "Zendesk",
    "ServiceNow",
    "Jira",
    "NetSuite",
    "SAP",
    "Excel",
    "Sheets",
    "SharePoint",
    "Expensify"
  ].filter((tool) => lowered.includes(tool.toLowerCase()));

  return {
    actor: lowered.includes("employee")
      ? "an employee"
      : lowered.includes("customer")
        ? "a customer"
        : lowered.includes("sales")
          ? "a sales rep"
          : "a requester",
    storyRole: lowered.includes("employee")
      ? "un empleado"
      : lowered.includes("customer")
        ? "un cliente"
        : lowered.includes("sales")
          ? "un representante de ventas"
          : "un solicitante",
    tools,
    hasPolicy: /policy|compliance|audit|approval|risk/.test(lowered)
  };
}

function createUserStory(index, title, role, capability, value) {
  return {
    id: `US-${String(index).padStart(3, "0")}`,
    title,
    storyText: `Como ${role}, quiero ${capability}, para ${value}.`
  };
}

function getStoryContext(analysis) {
  const hasVisibilityRequirement = analysis.requirements?.some((item) =>
    item.toLowerCase().includes("visibility")
  );
  const hasHumanException = analysis.humanReviewPoints?.some((item) =>
    /missing|contradictory|low-confidence|risk|policy/i.test(item)
  );
  const hasMetrics = analysis.implementationImpact?.some((item) =>
    /cycle time|exception rate|success metrics|automation/i.test(item)
  );

  return {
    intakeValue: "reducir retrabajo, seguimientos repetidos y demoras de ciclo",
    reviewValue: hasVisibilityRequirement
      ? "mantener visibilidad de punta a punta y acelerar la decision"
      : "tomar decisiones consistentes con menos busqueda manual",
    exceptionValue: hasHumanException
      ? "priorizar los casos que requieren juicio humano y control de riesgo"
      : "resolver excepciones sin perder trazabilidad",
    reportingValue: hasMetrics
      ? "medir la adopcion, la calidad y la mejora continua del flujo"
      : "entender el rendimiento del proceso y sus oportunidades de mejora"
  };
}

const emptyAnalysis = {
  currentWorkflow: ["Add notes to generate a structured view of the current process."],
  bottlenecks: ["Bottlenecks will appear after the workflow is analyzed."],
  requirements: ["Requirements will be inferred from the notes and process goals."],
  automationOpportunities: ["Automation candidates will be ranked from intake through final system updates."],
  humanReviewPoints: ["Human review points will identify where judgment, risk control, or empathy is needed."],
  implementationImpact: [
    "Estimated time saved, manual steps reduced, adoption approach, and success metrics will appear after analysis."
  ]
};
