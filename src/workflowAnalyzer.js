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

  if (signals.language === "es") {
    return {
      currentWorkflow: [
        `El proceso comienza cuando ${signals.actor} envia informacion, archivos o aprobaciones mediante las herramientas actuales.`,
        `El trabajo avanza por ${signals.tools.length ? signals.tools.join(", ") : "correo, planillas y carpetas compartidas"} antes de completarse.`,
        "Los responsables o duenos del proceso revisan la solicitud, resuelven excepciones y derivan el trabajo aprobado al siguiente equipo.",
        "El equipo final actualiza el sistema de registro, comunica el estado y cierra el circuito con el solicitante."
      ],
      bottlenecks: [
        "Los traspasos manuales generan esperas, cambios de contexto y propiedad poco clara.",
        "Las notas, correos o adjuntos sin estructura facilitan que falte informacion requerida.",
        "El seguimiento del estado depende de revisar bandejas de entrada o herramientas separadas en lugar de un flujo visible.",
        signals.hasPolicy
          ? "Las revisiones de politica y cumplimiento se repiten manualmente, lo que ralentiza el avance y aumenta la inconsistencia."
          : "Las reglas de decision no estan lo bastante explicitas para enrutar y gestionar excepciones de forma consistente."
      ],
      requirements: [
        "Capturar datos de ingreso estructurados, documentos requeridos y contexto del solicitante desde el inicio.",
        "Dar visibilidad de punta a punta para solicitantes, revisores y operadores.",
        "Definir reglas de derivacion, umbrales de aprobacion, caminos de excepcion y disparadores de escalamiento.",
        "Mantener una pista de auditoria que muestre quien cambio que, cuando y por que.",
        `Integrar con ${signals.tools.length ? signals.tools.slice(0, 4).join(", ") : "las herramientas actuales de comunicacion y sistema de registro"}.`
      ],
      automationOpportunities: [
        "Extraer campos estructurados desde correos, formularios, documentos y adjuntos.",
        "Clasificar solicitudes por tipo, urgencia, responsable e informacion faltante.",
        "Redactar respuestas, resumenes, notas de aprobacion y recomendaciones de proximos pasos.",
        "Validar solicitudes contra reglas de negocio, politicas y patrones historicos.",
        "Sincronizar estados y resultados finales entre herramientas de colaboracion y sistemas de registro."
      ],
      humanReviewPoints: [
        "Solicitudes de alto valor, alto riesgo o sensibles a politicas.",
        "Informacion faltante, contradictoria o de baja confianza.",
        "Comunicaciones con clientes, empleados o proveedores que requieren criterio o empatia.",
        "Aprobacion final de excepciones, anulaciones y actualizaciones irreversibles del sistema."
      ],
      implementationImpact: [
        "Ahorro estimado: reduccion del 30-45% en tiempo de ciclo cuando se automaticen ingreso, derivacion y actualizaciones de estado.",
        "Pasos manuales reducidos: eliminar carga duplicada de datos, correos repetidos de seguimiento, revision manual de estado y primer filtro de politica.",
        "Enfoque de adopcion recomendado: comenzar con un piloto supervisado para un flujo, medir resultados y ampliar la automatizacion cuando los revisores confien en las recomendaciones.",
        "Metricas de exito: tiempo promedio de ciclo, tasa de excepciones, intervenciones por solicitud, confianza de automatizacion, completitud de auditoria y satisfaccion de usuarios."
      ]
    };
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

  const storyContext = getStoryContext(analysis, signals.language);

  if (signals.language === "es") {
    return [
      createUserStory(
        1,
        "Ingreso estructurado de solicitudes",
        `Como ${signals.storyRole}, quiero enviar la informacion requerida una sola vez con documentos y contexto completos, para ${storyContext.intakeValue}.`
      ),
      createUserStory(
        2,
        "Revision guiada para aprobadores",
        `Como un revisor, quiero ver el contexto, las reglas aplicables y una recomendacion antes de aprobar o rechazar, para ${storyContext.reviewValue}.`
      ),
      createUserStory(
        3,
        "Gestion de excepciones",
        `Como un operador, quiero recibir los casos incompletos, contradictorios o sensibles en una cola priorizada, para ${storyContext.exceptionValue}.`
      ),
      createUserStory(
        4,
        "Seguimiento operativo del flujo",
        `Como un responsable del proceso, quiero consultar metricas de ciclo, volumen, excepciones y automatizacion, para ${storyContext.reportingValue}.`
      )
    ];
  }

  return [
    createUserStory(
      1,
      "Structured request intake",
      `As ${signals.storyRole}, I want to submit required information once with complete documents and context, so that ${storyContext.intakeValue}.`
    ),
    createUserStory(
      2,
      "Guided approval review",
      `As a reviewer, I want to see context, applicable rules, and a recommendation before approving or rejecting, so that ${storyContext.reviewValue}.`
    ),
    createUserStory(
      3,
      "Exception management",
      `As an operator, I want to receive incomplete, contradictory, or sensitive cases in a prioritized queue, so that ${storyContext.exceptionValue}.`
    ),
    createUserStory(
      4,
      "Workflow performance tracking",
      `As a process owner, I want to review cycle time, volume, exception, and automation metrics, so that ${storyContext.reportingValue}.`
    )
  ];
}

function extractSignals(notes) {
  const lowered = notes.toLowerCase();
  const language = detectLanguage(lowered);
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
  const actor = getActor(lowered, language);

  return {
    language,
    actor: actor.analysisRole,
    storyRole: actor.storyRole,
    tools,
    hasPolicy: /policy|compliance|audit|approval|risk|politica|cumplimiento|auditoria|aprobacion|riesgo/.test(lowered)
  };
}

function detectLanguage(loweredNotes) {
  const spanishSignals = [
    " proceso ",
    " solicitud",
    " empleado",
    " cliente",
    " aprobacion",
    " aprobaci",
    " politica",
    " cumplimiento",
    " auditoria",
    " correo",
    " adjunto",
    " factura",
    " gerente",
    " finanzas",
    " objetivo",
    " demora",
    " manual",
    " para "
  ];
  const normalized = ` ${loweredNotes.normalize("NFD").replace(/[\u0300-\u036f]/g, "")} `;
  const spanishScore = spanishSignals.filter((signal) => normalized.includes(signal)).length;
  const englishScore = [
    " process ",
    " request",
    " employee",
    " customer",
    " approval",
    " policy",
    " compliance",
    " audit",
    " email",
    " attachment",
    " manager",
    " finance",
    " goal",
    " delay"
  ].filter((signal) => normalized.includes(signal)).length;

  return spanishScore > englishScore ? "es" : "en";
}

function getActor(lowered, language) {
  if (language === "es") {
    if (/empleado|empleada/.test(lowered)) {
      return { analysisRole: "un empleado", storyRole: "un empleado" };
    }
    if (/cliente/.test(lowered)) {
      return { analysisRole: "un cliente", storyRole: "un cliente" };
    }
    if (/ventas|comercial/.test(lowered)) {
      return { analysisRole: "un representante de ventas", storyRole: "un representante de ventas" };
    }
    return { analysisRole: "un solicitante", storyRole: "un solicitante" };
  }

  if (lowered.includes("employee")) {
    return { analysisRole: "an employee", storyRole: "an employee" };
  }
  if (lowered.includes("customer")) {
    return { analysisRole: "a customer", storyRole: "a customer" };
  }
  if (lowered.includes("sales")) {
    return { analysisRole: "a sales rep", storyRole: "a sales rep" };
  }
  return { analysisRole: "a requester", storyRole: "a requester" };
}

function createUserStory(index, title, storyText) {
  return {
    id: `US-${String(index).padStart(3, "0")}`,
    title,
    storyText
  };
}

function getStoryContext(analysis, language) {
  if (language === "es") {
    const hasVisibilityRequirement = analysis.requirements?.some((item) =>
      /visibilidad|visible/i.test(item)
    );
    const hasHumanException = analysis.humanReviewPoints?.some((item) =>
      /faltante|contradictoria|baja confianza|riesgo|politica/i.test(item)
    );
    const hasMetrics = analysis.implementationImpact?.some((item) =>
      /tiempo de ciclo|tasa de excepciones|metricas|automatizacion/i.test(item)
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
    intakeValue: "the workflow can move forward with fewer repeated follow-ups and delays",
    reviewValue: hasVisibilityRequirement
      ? "reviewers can make faster decisions with end-to-end visibility"
      : "reviewers can make consistent decisions with less manual searching",
    exceptionValue: hasHumanException
      ? "the team can prioritize cases that require human judgment and risk control"
      : "the team can resolve exceptions without losing traceability",
    reportingValue: hasMetrics
      ? "the team can measure adoption, quality, and continuous improvement"
      : "the team can understand process performance and improvement opportunities"
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
