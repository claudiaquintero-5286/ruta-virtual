const steps = [
  {
    title: "Ingreso y selección del perfil",
    overline: "El punto de partida",
    owner: "Todos los usuarios",
    description: "Al ingresar, cada persona elige si es paciente, cuidador, promotor comunitario, profesional de salud, personal de farmacia o coordinador. Así, la experiencia se adapta a sus necesidades y responsabilidades.",
    action: "Elige su perfil e ingresa con un código o credenciales seguras.",
    system: "Muestra solo las funciones del rol y protege la información clínica.",
    result: "Un acceso sencillo, seguro y personalizado."
  },
  {
    title: "Registro y caracterización",
    overline: "Conocer para acompañar",
    owner: "Paciente + promotor",
    description: "Con apoyo de personal autorizado, se registran los datos indispensables para organizar el tratamiento: ubicación urbana o rural, EPS, IPS, diagnóstico general, medicamentos, fecha de la última entrega y contacto de un cuidador.",
    action: "Entrega la información necesaria y autoriza su tratamiento.",
    system: "Organiza el perfil clínico y territorial usando únicamente datos pertinentes.",
    result: "Paciente caracterizado y listo para iniciar la ruta."
  },
  {
    title: "Creación de la Tarjeta Vital",
    overline: "La información siempre a mano",
    owner: "Ruta Vital",
    description: "La plataforma crea una tarjeta digital que también puede imprimirse. Reúne el código del paciente, sus medicamentos, fechas importantes, controles pendientes y señales de alarma.",
    action: "Consulta, descarga o imprime su Tarjeta Vital.",
    system: "Concentra la información esencial en un formato claro y portátil.",
    result: "Una guía disponible incluso cuando no hay internet."
  },
  {
    title: "Consulta del tratamiento",
    overline: "Todo en un solo lugar",
    owner: "Paciente + cuidador",
    description: "Un semáforo facilita la lectura: verde significa tratamiento completo; amarillo indica una entrega próxima o un trámite pendiente; y rojo advierte una interrupción o alerta clínica.",
    action: "Revisa su semáforo y el avance de cada solicitud.",
    system: "Actualiza el estado y envía mensajes cuando ocurre un cambio.",
    result: "Información comprensible y menos incertidumbre."
  },
  {
    title: "Alerta anticipada",
    overline: "Siete días antes",
    owner: "Ruta Vital + paciente",
    description: "Antes de la fecha estimada de agotamiento, Ruta Vital se comunica por SMS, llamada o notificación. El paciente informa si está bien, si necesita medicamentos o si requiere ayuda.",
    action: "Responde una de tres opciones sencillas desde cualquier celular.",
    system: "Detecta la necesidad antes de que el tratamiento se interrumpa.",
    result: "Una respuesta temprana y preventiva."
  },
  {
    title: "Solicitud de medicamentos",
    overline: "Sin desplazarse para preguntar",
    owner: "Paciente + farmacia",
    description: "Cuando el paciente indica que necesita medicamentos, la plataforma crea la solicitud y la envía a la farmacia, EPS o institución responsable para revisar el caso.",
    action: "Indica que necesita una nueva entrega de su tratamiento.",
    system: "Verifica fórmula, autorización, fecha anterior y punto más cercano.",
    result: "Trámites revisados antes de cualquier viaje."
  },
  {
    title: "Validación y priorización",
    overline: "La respuesta se organiza",
    owner: "Farmacia + equipo de salud",
    description: "La farmacia comprueba disponibilidad, cantidades y conservación. Los casos con síntomas se priorizan y las solicitudes confirmadas se agrupan por municipio, corregimiento, vereda, barrio o sector urbano.",
    action: "Espera la confirmación sin desplazarse mientras revisan su caso.",
    system: "Resuelve pendientes, prioriza alertas y consolida la ruta territorial.",
    result: "Entregas preparadas y pacientes atendidos según su necesidad."
  },
  {
    title: "Programación y entrega",
    overline: "El tratamiento se acerca",
    owner: "Unidad móvil + paciente",
    description: "Con el tratamiento confirmado, el paciente recibe fecha, hora, lugar autorizado y código de entrega. En zona urbana acude a un punto cercano; en zona rural la unidad móvil o el equipo territorial acerca la jornada a la comunidad.",
    action: "Acude al punto confirmado y verifica que recibió el tratamiento completo.",
    system: "Programa puntos urbanos o rutas rurales, transporta la entrega y registra la atención.",
    result: "Menos filas, menos viajes y una entrega segura."
  },
  {
    title: "Seguimiento y próximo ciclo",
    overline: "La ruta vuelve a empezar",
    owner: "Paciente + coordinación",
    description: "Después de la entrega, la plataforma actualiza la Tarjeta Vital, calcula la próxima fecha de agotamiento y programa una nueva alerta. Los indicadores ayudan a mejorar el servicio.",
    action: "Confirma la entrega y consulta su próxima fecha.",
    system: "Actualiza el ciclo y mide continuidad, alertas, viajes y filas evitadas.",
    result: "Seguimiento continuo y una ruta cada vez más efectiva."
  }
];

const tabs = document.querySelector("#step-tabs");
const panel = document.querySelector("#step-panel");
const fields = {
  number: document.querySelector("#step-number"),
  owner: document.querySelector("#step-owner"),
  overline: document.querySelector("#step-overline"),
  title: document.querySelector("#step-title"),
  description: document.querySelector("#step-description"),
  action: document.querySelector("#step-action"),
  system: document.querySelector("#step-system"),
  result: document.querySelector("#step-result"),
  progressLabel: document.querySelector("#step-progress-label"),
  progressBar: document.querySelector("#step-progress-bar")
};
const previousButton = document.querySelector("#previous-step");
const nextButton = document.querySelector("#next-step");
let activeStep = 0;

function createTabs() {
  steps.forEach((step, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "step-tab";
    button.id = `step-tab-${index + 1}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", "step-panel");
    button.setAttribute("aria-selected", index === 0 ? "true" : "false");
    button.setAttribute("tabindex", index === 0 ? "0" : "-1");
    button.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><span>${step.title}</span>`;
    button.addEventListener("click", () => selectStep(index));
    button.addEventListener("keydown", handleTabKeys);
    tabs.appendChild(button);
  });
}

function selectStep(index, focusTab = false) {
  activeStep = (index + steps.length) % steps.length;
  const step = steps[activeStep];
  const allTabs = [...tabs.querySelectorAll(".step-tab")];
  allTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === activeStep;
    tab.setAttribute("aria-selected", String(selected));
    tab.setAttribute("tabindex", selected ? "0" : "-1");
  });

  fields.number.textContent = String(activeStep + 1).padStart(2, "0");
  fields.owner.textContent = step.owner;
  fields.overline.textContent = step.overline;
  fields.title.textContent = step.title;
  fields.description.textContent = step.description;
  fields.action.textContent = step.action;
  fields.system.textContent = step.system;
  fields.result.textContent = step.result;
  fields.progressLabel.textContent = `Paso ${activeStep + 1} de ${steps.length}`;
  fields.progressBar.style.width = `${((activeStep + 1) / steps.length) * 100}%`;
  panel.setAttribute("aria-labelledby", `step-tab-${activeStep + 1}`);
  nextButton.textContent = activeStep === steps.length - 1 ? "Volver al primer paso" : "Siguiente paso";

  if (focusTab) allTabs[activeStep].focus();
  allTabs[activeStep].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
}

function handleTabKeys(event) {
  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    event.preventDefault();
    selectStep(activeStep + 1, true);
  }
  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    event.preventDefault();
    selectStep(activeStep - 1, true);
  }
  if (event.key === "Home") {
    event.preventDefault();
    selectStep(0, true);
  }
  if (event.key === "End") {
    event.preventDefault();
    selectStep(steps.length - 1, true);
  }
}

previousButton.addEventListener("click", () => selectStep(activeStep - 1, true));
nextButton.addEventListener("click", () => selectStep(activeStep + 1, true));

const replyResult = document.querySelector("#reply-result");
const replyMessages = {
  "1": { className: "success", text: "Confirmado. Te recordaremos la próxima jornada y tu fecha de entrega." },
  "2": { className: "success", text: "Solicitud registrada. Prepararemos tu tratamiento para el punto comunitario." },
  "3": { className: "alert", text: "Alerta priorizada. Un integrante del equipo de salud devolverá la llamada." }
};

document.querySelectorAll("[data-reply]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-reply]").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    const response = replyMessages[button.dataset.reply];
    replyResult.className = `reply-result ${response.className}`;
    replyResult.querySelector("span:last-child").textContent = response.text;
  });
});

const registrationForm = document.querySelector("#registration-form");
const registrationResult = document.querySelector("#registration-result");
const restartRegistration = document.querySelector("#restart-registration");
const patientList = document.querySelector("#patient-list");
const registryCount = document.querySelector("#registry-count");
const clearPatientsButton = document.querySelector("#clear-patients");
const registryNote = document.querySelector(".registry-note");
const patientStorageKey = "ruta-vital-demo-patients-v1";
let selectedPatientId = null;
let storageEnabled = true;

function loadPatients() {
  try {
    const savedPatients = JSON.parse(localStorage.getItem(patientStorageKey) || "[]");
    return Array.isArray(savedPatients) ? savedPatients : [];
  } catch (error) {
    storageEnabled = false;
    return [];
  }
}

let patients = loadPatients();

function createPatientCode() {
  const timeCode = Date.now().toString(36).slice(-5).toUpperCase();
  const randomCode = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `RV-${timeCode}-${randomCode}`;
}

function savePatients() {
  try {
    localStorage.setItem(patientStorageKey, JSON.stringify(patients));
  } catch (error) {
    storageEnabled = false;
    registryNote.textContent = "El navegador bloqueó el almacenamiento local. Los registros estarán disponibles solo durante esta visita.";
  }
  renderPatientList();
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function showPatientResult(patient) {
  selectedPatientId = patient.id;
  document.querySelector("#result-name").textContent = patient.name;
  document.querySelector("#result-code").textContent = patient.code;
  document.querySelector("#result-environment").textContent = patient.environment;
  document.querySelector("#result-location").textContent = `${patient.municipality} · Zona ${patient.zone.toLowerCase()}`;
  document.querySelector("#result-channel").textContent = patient.channel;

  registrationForm.hidden = true;
  registrationResult.hidden = false;
  renderPatientList();
  registrationResult.scrollIntoView({ block: "center", behavior: "smooth" });
}

function deletePatient(patientId) {
  const patient = patients.find((item) => item.id === patientId);
  if (!patient || !window.confirm(`¿Eliminar el registro de ${patient.name}?`)) return;

  patients = patients.filter((item) => item.id !== patientId);
  if (selectedPatientId === patientId) {
    selectedPatientId = null;
    registrationResult.hidden = true;
    registrationForm.hidden = false;
  }
  savePatients();
}

function renderPatientList() {
  registryCount.textContent = String(patients.length);
  clearPatientsButton.disabled = patients.length === 0;
  patientList.replaceChildren();

  if (patients.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "registry-empty";
    emptyState.append(
      createTextElement("span", "registry-empty-icon", "+"),
      createTextElement("strong", "", "Aún no hay pacientes registrados"),
      createTextElement("p", "", "Completa el formulario para crear el primer registro de demostración.")
    );
    patientList.appendChild(emptyState);
    return;
  }

  patients.forEach((patient) => {
    const card = document.createElement("article");
    card.className = `patient-record${patient.id === selectedPatientId ? " is-selected" : ""}`;

    const initials = patient.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    const avatar = createTextElement("span", "patient-avatar", initials || "RV");
    avatar.setAttribute("aria-hidden", "true");

    const identity = document.createElement("div");
    identity.className = "patient-identity";
    identity.append(
      createTextElement("strong", "", patient.name),
      createTextElement("small", "", patient.code)
    );

    const details = createTextElement(
      "p",
      "patient-details",
      `${patient.municipality} · Zona ${patient.zone.toLowerCase()} · ${patient.environment}`
    );

    const actions = document.createElement("div");
    actions.className = "patient-actions";
    const viewButton = createTextElement("button", "patient-view", "Ver ficha");
    viewButton.type = "button";
    viewButton.setAttribute("aria-pressed", String(patient.id === selectedPatientId));
    viewButton.addEventListener("click", () => showPatientResult(patient));

    const deleteButton = createTextElement("button", "patient-delete", "Eliminar");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", () => deletePatient(patient.id));
    actions.append(viewButton, deleteButton);
    card.append(avatar, identity, details, actions);
    patientList.appendChild(card);
  });
}

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(registrationForm);
  const patient = {
    id: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    code: createPatientCode(),
    name: data.get("name").trim(),
    environment: data.get("environment"),
    municipality: data.get("municipality"),
    channel: data.get("channel"),
    zone: data.get("zone"),
    createdAt: new Date().toISOString()
  };

  patients.unshift(patient);
  savePatients();
  showPatientResult(patient);
});

restartRegistration.addEventListener("click", () => {
  registrationForm.reset();
  registrationResult.hidden = true;
  registrationForm.hidden = false;
  selectedPatientId = null;
  renderPatientList();
  document.querySelector("#register-name").focus();
});

clearPatientsButton.addEventListener("click", () => {
  if (!patients.length || !window.confirm("¿Eliminar todos los registros de pacientes guardados en este navegador?")) return;
  patients = [];
  selectedPatientId = null;
  registrationResult.hidden = true;
  registrationForm.hidden = false;
  registrationForm.reset();
  savePatients();
});

if (!storageEnabled) {
  registryNote.textContent = "El almacenamiento local no está disponible. Los registros se conservarán solo durante esta visita.";
}

renderPatientList();

createTabs();
selectStep(0);
