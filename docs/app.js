(function () {
  const caseKey = "cdn_case";
  const notaryKey = "cdn_notaries";
  const sportsKey = "cdn_sports_contract";
  const passportKey = "cdn_sports_passport";
  const languageKey = "cdn_language";
  const apiEnabled = ["localhost", "127.0.0.1"].includes(location.hostname);
  let currentCase = null;
  let currentNotaries = [];
  let currentSportsContract = null;

  const defaultPassport = {
    expediente: "PD-2026-0001",
    athleteName: "Jugador/a demo",
    athleteId: "DNI 00.000.000",
    birthDate: "2012-05-12",
    academy: "Escuela deportiva piloto",
    category: "Infantil",
    tutor: "Madre / Padre / Tutor",
    email: "familia.demo@correo.local",
    channel: "Academia valida y deriva a liga",
    status: "Ficha en edicion",
    documents: [],
    events: []
  };

  const translations = {
    en: {
      "Acceso - Certificacion Digital Notarial": "Access - Digital Notarial Certification",
      "Acceso - Certificación Digital Notarial": "Access - Digital Notarial Certification",
      "Certificacion Digital Notarial": "Digital Notarial Certification",
      "Certificación Digital Notarial": "Digital Notarial Certification",
      "Demo piloto institucional": "Institutional pilot demo",
      "DEMO PILOTO": "PILOT DEMO",
      "Demo piloto": "Pilot demo",
      "Panel": "Dashboard",
      "Abordaje": "Strategy",
      "Abordaje modular": "Modular strategy",
      "Ver abordaje modular": "View modular strategy",
      "Abordaje modular y adopcion": "Modular strategy and adoption",
      "Abordaje modular para adopcion real": "Modular strategy for real adoption",
      "Pasaporte": "Passport",
      "Pasaporte documental": "Document passport",
      "Pasaporte documental deportivo": "Sports document passport",
      "Deportivo": "Sports",
      "Agente FIFA": "FIFA Agent",
      "Contratos": "Contracts",
      "Organismo regulador": "Regulatory body",
      "Mesa escribano": "Notary desk",
      "Mesa del escribano": "Notary desk",
      "Auditoria": "Audit",
      "Auditoría": "Audit",
      "Tramites": "Cases",
      "Trámites": "Cases",
      "Intervinientes": "Parties",
      "Escribanos": "Notaries",
      "Nuevo tramite": "New case",
      "Nuevo trámite": "New case",
      "Entrar a la plataforma": "Enter the platform",
      "Entrar a la herramienta": "Enter the tool",
      "Ver piloto deportivo": "View sports pilot",
      "Certificación Digital Notarial para contratos y evidencia deportiva federada": "Digital Notarial Certification for contracts and federated sports evidence",
      "Una herramienta para cargar o construir documentos, autenticar partes, validar intervención federativa, certificar con escribano y conservar evidencia verificable con hash, QR y cadena de custodia.": "A tool to upload or build documents, authenticate parties, validate federative intervention, certify through a notary and preserve verifiable evidence with hash, QR and chain of custody.",
      "Portada conceptual de certificación digital notarial y contratos deportivos": "Concept cover for digital notarial certification and sports contracts",
      "Panel del escribano": "Notary dashboard",
      "Vista de control para tramites digitales con evidencia verificable, firma digital, cifrado, trazabilidad y conservacion probatoria en el tiempo.": "Control view for digital cases with verifiable evidence, digital signature, encryption, traceability and long-term evidentiary preservation.",
      "Modo operativo:": "Operating mode:",
      "MVP con API local": "MVP with local API",
      "Iniciar tramite": "Start case",
      "Iniciar trámite": "Start case",
      "Tramite prioritario": "Priority case",
      "Trámite prioritario": "Priority case",
      "Ultimos eventos": "Latest events",
      "Últimos eventos": "Latest events",
      "Cadena de custodia": "Chain of custody",
      "Resumen institucional": "Institutional overview",
      "Certificacion guiada": "Guided certification",
      "Certificación guiada": "Guided certification",
      "Escribanos operadores": "Operating notaries",
      "Gestion de tramites": "Case management",
      "Gestión de trámites": "Case management",
      "Contratos deportivos federados": "Federated sports contracts",
      "Modelo piloto para agente FIFA, AFA/FIFA, partes deportivas, escribano y archivo probatorio.": "Pilot model for FIFA agent, AFA/FIFA, sports parties, notary and evidentiary archive.",
      "Estado actual del expediente deportivo": "Current status of the sports file",
      "Dos formas de operar": "Two ways to operate",
      "Cargar documento:": "Upload document:",
      "Construcción asistida:": "Assisted construction:",
      "Repositorio especial de contratos": "Special contract repository",
      "Validacion federativa": "Federative validation",
      "Validación federativa": "Federative validation",
      "Flujo piloto AFA / FIFA": "AFA / FIFA pilot flow",
      "Contrato ejemplo": "Sample contract",
      "Entrar al modulo deportivo": "Enter sports module",
      "Entrar al módulo deportivo": "Enter sports module",
      "Crear contrato": "Create contract",
      "Identificacion y autenticacion de Agente FIFA": "FIFA Agent identification and authentication",
      "Identificación y autenticación de Agente FIFA": "FIFA Agent identification and authentication",
      "Validar agente": "Validate agent",
      "Repertorio autorizado de contratos deportivos": "Authorized sports contract repository",
      "Seleccion del instrumento segun cliente, operacion y normativa aplicable. Luego se parametrizan clausulas particulares y se envia a validacion federativa/notarial.": "Instrument selection by client, operation and applicable regulations. Then particular clauses are parameterized and sent to federative/notarial validation.",
      "Contratos de representacion": "Representation contracts",
      "Contratos de representación": "Representation contracts",
      "Contratos comerciales y de contratacion": "Commercial and engagement contracts",
      "Contratos comerciales y de contratación": "Commercial and engagement contracts",
      "Instrumento": "Instrument",
      "Cliente": "Client",
      "Controles": "Controls",
      "Accion": "Action",
      "Acción": "Action",
      "Configurar": "Configure",
      "Constructor de clausulas y condiciones particulares": "Clause and particular conditions builder",
      "Constructor de cláusulas y condiciones particulares": "Clause and particular conditions builder",
      "Configuracion guiada para adaptar contratos deportivos sin perder controles normativos, federativos y notariales.": "Guided configuration to adapt sports contracts without losing regulatory, federative and notarial controls.",
      "Datos esenciales": "Essential data",
      "Clausulas particulares": "Particular clauses",
      "Cláusulas particulares": "Particular clauses",
      "Tipo de contrato": "Contract type",
      "Cliente representado": "Represented client",
      "Duracion": "Duration",
      "Duración": "Duration",
      "Honorarios / fee": "Fees",
      "Alcance geografico": "Geographic scope",
      "Alcance geográfico": "Geographic scope",
      "Exclusividad": "Exclusivity",
      "Enviar a validacion": "Send for validation",
      "Enviar a validación": "Send for validation",
      "Partes intervinientes": "Participating parties",
      "Agregar parte": "Add party",
      "Documento deportivo": "Sports document",
      "Firma digital": "Digital signature",
      "Certificacion notarial": "Notarial certification",
      "Certificación notarial": "Notarial certification",
      "Archivo y registro": "Archive and record",
      "Validacion AFA / federacion": "AFA / federation validation",
      "Validación AFA / federación": "AFA / federation validation",
      "Registro y archivo federativo": "Federative record and archive",
      "Linea de tiempo": "Timeline",
      "Línea de tiempo": "Timeline",
      "Paquete de evidencia": "Evidence package",
      "Idioma": "Language"
    },
    pt: {
      "Acceso - Certificacion Digital Notarial": "Acesso - Certificação Digital Notarial",
      "Acceso - Certificación Digital Notarial": "Acesso - Certificação Digital Notarial",
      "Certificacion Digital Notarial": "Certificação Digital Notarial",
      "Certificación Digital Notarial": "Certificação Digital Notarial",
      "Demo piloto institucional": "Demonstração piloto institucional",
      "DEMO PILOTO": "DEMO PILOTO",
      "Demo piloto": "Demo piloto",
      "Panel": "Painel",
      "Abordaje": "Estratégia",
      "Abordaje modular": "Estratégia modular",
      "Ver abordaje modular": "Ver estratégia modular",
      "Abordaje modular y adopcion": "Estratégia modular e adoção",
      "Abordaje modular para adopcion real": "Estratégia modular para adoção real",
      "Pasaporte": "Passaporte",
      "Pasaporte documental": "Passaporte documental",
      "Pasaporte documental deportivo": "Passaporte documental esportivo",
      "Deportivo": "Esportivo",
      "Agente FIFA": "Agente FIFA",
      "Contratos": "Contratos",
      "Organismo regulador": "Órgão regulador",
      "Mesa escribano": "Mesa do tabelião",
      "Mesa del escribano": "Mesa do tabelião",
      "Auditoria": "Auditoria",
      "Auditoría": "Auditoria",
      "Tramites": "Processos",
      "Trámites": "Processos",
      "Intervinientes": "Partes",
      "Escribanos": "Tabeliães",
      "Nuevo tramite": "Novo processo",
      "Nuevo trámite": "Novo processo",
      "Entrar a la plataforma": "Entrar na plataforma",
      "Entrar a la herramienta": "Entrar na ferramenta",
      "Ver piloto deportivo": "Ver piloto esportivo",
      "Certificación Digital Notarial para contratos y evidencia deportiva federada": "Certificação Digital Notarial para contratos e evidência esportiva federada",
      "Una herramienta para cargar o construir documentos, autenticar partes, validar intervención federativa, certificar con escribano y conservar evidencia verificable con hash, QR y cadena de custodia.": "Uma ferramenta para carregar ou construir documentos, autenticar partes, validar intervenção federativa, certificar com tabelião e conservar evidência verificável com hash, QR e cadeia de custódia.",
      "Portada conceptual de certificación digital notarial y contratos deportivos": "Capa conceitual de certificação digital notarial e contratos esportivos",
      "Panel del escribano": "Painel do tabelião",
      "Vista de control para tramites digitales con evidencia verificable, firma digital, cifrado, trazabilidad y conservacion probatoria en el tiempo.": "Visão de controle para processos digitais com evidência verificável, assinatura digital, criptografia, rastreabilidade e preservação probatória no tempo.",
      "Modo operativo:": "Modo operacional:",
      "MVP con API local": "MVP com API local",
      "Iniciar tramite": "Iniciar processo",
      "Iniciar trámite": "Iniciar processo",
      "Tramite prioritario": "Processo prioritário",
      "Trámite prioritario": "Processo prioritário",
      "Ultimos eventos": "Últimos eventos",
      "Últimos eventos": "Últimos eventos",
      "Cadena de custodia": "Cadeia de custódia",
      "Resumen institucional": "Resumo institucional",
      "Certificacion guiada": "Certificação guiada",
      "Certificación guiada": "Certificação guiada",
      "Escribanos operadores": "Tabeliães operadores",
      "Gestion de tramites": "Gestão de processos",
      "Gestión de trámites": "Gestão de processos",
      "Contratos deportivos federados": "Contratos esportivos federados",
      "Modelo piloto para agente FIFA, AFA/FIFA, partes deportivas, escribano y archivo probatorio.": "Modelo piloto para agente FIFA, AFA/FIFA, partes esportivas, tabelião e arquivo probatório.",
      "Estado actual del expediente deportivo": "Estado atual do expediente esportivo",
      "Dos formas de operar": "Duas formas de operar",
      "Cargar documento:": "Carregar documento:",
      "Construcción asistida:": "Construção assistida:",
      "Repositorio especial de contratos": "Repositório especial de contratos",
      "Validacion federativa": "Validação federativa",
      "Validación federativa": "Validação federativa",
      "Flujo piloto AFA / FIFA": "Fluxo piloto AFA / FIFA",
      "Contrato ejemplo": "Contrato exemplo",
      "Entrar al modulo deportivo": "Entrar no módulo esportivo",
      "Entrar al módulo deportivo": "Entrar no módulo esportivo",
      "Crear contrato": "Criar contrato",
      "Identificacion y autenticacion de Agente FIFA": "Identificação e autenticação de Agente FIFA",
      "Identificación y autenticación de Agente FIFA": "Identificação e autenticação de Agente FIFA",
      "Validar agente": "Validar agente",
      "Repertorio autorizado de contratos deportivos": "Repertório autorizado de contratos esportivos",
      "Seleccion del instrumento segun cliente, operacion y normativa aplicable. Luego se parametrizan clausulas particulares y se envia a validacion federativa/notarial.": "Seleção do instrumento conforme cliente, operação e norma aplicável. Depois as cláusulas particulares são parametrizadas e enviadas à validação federativa/notarial.",
      "Contratos de representacion": "Contratos de representação",
      "Contratos de representación": "Contratos de representação",
      "Contratos comerciales y de contratacion": "Contratos comerciais e de contratação",
      "Contratos comerciales y de contratación": "Contratos comerciais e de contratação",
      "Instrumento": "Instrumento",
      "Cliente": "Cliente",
      "Controles": "Controles",
      "Accion": "Ação",
      "Acción": "Ação",
      "Configurar": "Configurar",
      "Constructor de clausulas y condiciones particulares": "Construtor de cláusulas e condições particulares",
      "Constructor de cláusulas y condiciones particulares": "Construtor de cláusulas e condições particulares",
      "Configuracion guiada para adaptar contratos deportivos sin perder controles normativos, federativos y notariales.": "Configuração guiada para adaptar contratos esportivos sem perder controles normativos, federativos e notariais.",
      "Datos esenciales": "Dados essenciais",
      "Clausulas particulares": "Cláusulas particulares",
      "Cláusulas particulares": "Cláusulas particulares",
      "Tipo de contrato": "Tipo de contrato",
      "Cliente representado": "Cliente representado",
      "Duracion": "Duração",
      "Duración": "Duração",
      "Honorarios / fee": "Honorários / fee",
      "Alcance geografico": "Alcance geográfico",
      "Alcance geográfico": "Alcance geográfico",
      "Exclusividad": "Exclusividade",
      "Enviar a validacion": "Enviar para validação",
      "Enviar a validación": "Enviar para validação",
      "Partes intervinientes": "Partes intervenientes",
      "Agregar parte": "Adicionar parte",
      "Documento deportivo": "Documento esportivo",
      "Firma digital": "Assinatura digital",
      "Certificacion notarial": "Certificação notarial",
      "Certificación notarial": "Certificação notarial",
      "Archivo y registro": "Arquivo e registro",
      "Validacion AFA / federacion": "Validação AFA / federação",
      "Validación AFA / federación": "Validação AFA / federação",
      "Registro y archivo federativo": "Registro e arquivo federativo",
      "Linea de tiempo": "Linha do tempo",
      "Línea de tiempo": "Linha do tempo",
      "Paquete de evidencia": "Pacote de evidência",
      "Idioma": "Idioma"
    }
  };

  function getLanguage() {
    return localStorage.getItem(languageKey) || "es";
  }

  function translateText(text, dictionary) {
    const compact = text.replace(/\s+/g, " ").trim();
    if (!compact || !dictionary[compact]) return text;
    return text.replace(compact, dictionary[compact]);
  }

  function applyLanguage() {
    const language = getLanguage();
    const dictionary = translations[language];
    document.documentElement.lang = language;
    if (!dictionary) return;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "OPTION"].includes(parent.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      node.nodeValue = translateText(node.nodeValue, dictionary);
    });

    ["title", "aria-label", "alt", "placeholder"].forEach((attribute) => {
      document.querySelectorAll(`[${attribute}]`).forEach((element) => {
        const value = element.getAttribute(attribute);
        if (value && dictionary[value]) element.setAttribute(attribute, dictionary[value]);
      });
    });
    if (document.title && dictionary[document.title]) document.title = dictionary[document.title];
  }

  function initLanguageSelector() {
    if (document.querySelector(".language-switcher")) return;
    const wrapper = document.createElement("label");
    wrapper.className = "language-switcher";
    wrapper.innerHTML = `
      <span>Idioma</span>
      <select aria-label="Idioma">
        <option value="es">ES</option>
        <option value="en">EN</option>
        <option value="pt">PT</option>
      </select>
    `;
    const select = wrapper.querySelector("select");
    select.value = getLanguage();
    select.addEventListener("change", () => {
      localStorage.setItem(languageKey, select.value);
      window.location.reload();
    });
    document.body.appendChild(wrapper);
  }

  const defaultCase = {
    expediente: "CDN-2026-000134",
    actType: "Poder general de administracion",
    jurisdiction: "Ciudad Autonoma de Buenos Aires",
    signerName: "Juan Perez",
    signerId: "DNI 24.567.890",
    requestorName: "Usuario solicitante",
    modality: "Remota con videoconferencia y validacion biometrica",
    notaryId: "notary-1",
    hash: "58AF92B1D3F8E467A21D8F34C0E29A9B7CA40E8C19F6AA78D91E0BB13A60F22"
  };

  const defaultNotaries = [
    {
      id: "notary-1",
      name: "Maria Lopez",
      matricula: "12.345",
      colegio: "Colegio Piloto",
      jurisdiction: "Ciudad Autonoma de Buenos Aires",
      certificate: "CN=Maria Lopez, O=Colegio Piloto",
      status: "Habilitado",
      regulator: "Validado en linea ante organismo regulador"
    },
    {
      id: "notary-2",
      name: "Damian Gonzalo Novoa",
      matricula: "24.810",
      colegio: "Registro institucional de prueba",
      jurisdiction: "Provincia de Buenos Aires",
      certificate: "CN=Damian Gonzalo Novoa, O=Registro Piloto",
      status: "Pendiente de validacion",
      regulator: "Pendiente de autenticacion regulatoria"
    }
  ];

  const defaultSportsContract = {
    expediente: "CDN-DEP-2026-0001",
    status: "Borrador deportivo",
    agent: {
      name: "Agente FIFA Demo",
      license: "FIFA-AG-2026-001",
      email: "agente.demo@afa.local",
      federation: "AFA - Argentina",
      validation: "Pendiente de consulta federativa"
    },
    contract: {
      preparationMode: "Construccion asistida por la plataforma",
      uploadedDocumentName: "Sin documento cargado",
      reviewScope: "Revision contractual, validacion federativa, firma, certificacion y archivo",
      type: "Representacion individual de jugador",
      clientType: "Jugador",
      duration: "24 meses maximo si aplica a jugador/entrenador",
      durationOption: "24 meses - plazo maximo orientativo si aplica",
      renewal: "Prorroga sujeta a nueva aceptacion expresa y control federativo",
      feeOption: "Porcentaje sobre remuneracion bruta del jugador/entrenador",
      feePercent: "10%",
      feeDetail: "Sujeto a limites y control normativo vigente",
      territory: "Argentina / internacional",
      exclusivity: "No exclusiva",
      object: "Negociacion, comunicacion preparatoria y cierre de transaccion deportiva.",
      particularClauses: "Derechos, obligaciones, confidencialidad, autorizaciones, reportes y condiciones especiales del acuerdo."
    },
    parties: [
      {
        id: "party-agent",
        type: "Agente FIFA",
        name: "Agente FIFA Demo",
        identifier: "FIFA-AG-2026-001",
        email: "agente.demo@afa.local",
        role: "Agente / representante",
        validationStatus: "Licencia consultada",
        signatureStatus: "Pendiente firma"
      },
      {
        id: "party-player",
        type: "Jugador",
        name: "Jugador Demo",
        identifier: "DNI 00.000.000",
        email: "jugador.demo@correo.local",
        role: "Cliente representado",
        validationStatus: "Identidad validada",
        signatureStatus: "Pendiente firma"
      }
    ],
    notifications: [],
    documentHash: "PENDIENTE",
    qrCode: "CDN-DEP-2026-0001-PENDIENTE"
  };

  async function api(path, options = {}) {
    const response = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Error de API" }));
      throw new Error(error.error || "Error de API");
    }
    return response.json();
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async function loadState() {
    if (apiEnabled) {
      const state = await api("/api/state");
      currentCase = Object.assign({}, defaultCase, state.case || {});
      currentSportsContract = mergeSportsContract(state.sportsContract || {});
      currentNotaries = Array.isArray(state.notaries) && state.notaries.length
        ? state.notaries
        : defaultNotaries;
      return;
    }

    currentCase = Object.assign({}, defaultCase, readJson(caseKey, {}));
    currentSportsContract = mergeSportsContract(readJson(sportsKey, {}));
    currentNotaries = readJson(notaryKey, null);
    if (!Array.isArray(currentNotaries) || !currentNotaries.length) {
      currentNotaries = defaultNotaries;
      writeJson(notaryKey, currentNotaries);
    }
  }

  function getCase() {
    return currentCase || defaultCase;
  }

  function getNotaries() {
    return currentNotaries.length ? currentNotaries : defaultNotaries;
  }

  function mergeSportsContract(data) {
    return {
      ...defaultSportsContract,
      ...data,
      agent: { ...defaultSportsContract.agent, ...(data.agent || {}) },
      contract: { ...defaultSportsContract.contract, ...(data.contract || {}) },
      parties: Array.isArray(data.parties) ? data.parties : defaultSportsContract.parties,
      notifications: Array.isArray(data.notifications) ? data.notifications : defaultSportsContract.notifications
    };
  }

  function getSportsContract() {
    return currentSportsContract || defaultSportsContract;
  }

  function getPassport() {
    return { ...defaultPassport, ...readJson(passportKey, {}) };
  }

  function savePassport(passport) {
    const next = { ...defaultPassport, ...passport };
    writeJson(passportKey, next);
    return next;
  }

  function getSelectedNotary(data) {
    return getNotaries().find((item) => item.id === data.notaryId) || getNotaries()[0];
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  }

  function setStatus(selector, message, ok = true) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.textContent = message;
    target.classList.toggle("status-ok-text", ok);
    target.classList.toggle("status-error-text", !ok);
  }

  function setModeBadge() {
    document.querySelectorAll("[data-mode]").forEach((node) => {
      node.textContent = apiEnabled ? "MVP con API local" : "Demo local sin servidor";
    });
  }

  function initAccessGate() {
    const gate = document.querySelector("[data-access-gate]");
    const secureArea = document.querySelector("[data-secure-area]");
    if (!gate || !secureArea) return;

    const role = gate.dataset.accessGate;

    function unlock() {
      gate.style.display = "none";
      secureArea.classList.remove("locked");
      const stamp = document.querySelector("[data-auth-stamp]");
      if (stamp) {
        stamp.textContent = `Sesion validada: ${new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "medium" }).format(new Date())}`;
      }
    }

    secureArea.classList.add("locked");
    const button = gate.querySelector("[data-auth-button]");
    if (!button) return;

    button.addEventListener("click", () => {
      const user = gate.querySelector("[data-auth-user]").value.trim();
      const pass = gate.querySelector("[data-auth-pass]").value.trim();
      const biometric = gate.querySelector("[data-auth-biometric]").checked;
      const validUser = role === "regulator" ? "regulador.demo" : "escribano.demo";
      if (!user || !pass || !biometric) {
        alert("Complete usuario, clave y validacion biometrica demo.");
        return;
      }
      if (user !== validUser || pass !== "demo123") {
        alert(`Credencial demo invalida. Use usuario ${validUser} y clave demo123.`);
        return;
      }
      unlock();
    });

    window.addEventListener("pagehide", () => {
      secureArea.classList.add("locked");
      gate.style.display = "";
      const biometric = gate.querySelector("[data-auth-biometric]");
      const pass = gate.querySelector("[data-auth-pass]");
      if (biometric) biometric.checked = false;
      if (pass) pass.value = "";
    });
  }

  function renderCase() {
    const data = getCase();
    const notary = getSelectedNotary(data);
    const serial = (data.signerId || "").replace(/\D/g, "") || "00000000";

    const fields = {
      expediente: data.expediente,
      actType: data.actType,
      jurisdiction: data.jurisdiction,
      signerName: data.signerName,
      signerId: data.signerId,
      requestorName: data.requestorName,
      modality: data.modality,
      hash: data.hash,
      signerCertificate: `CN=${data.signerName}, serialNumber=${serial}`,
      notaryName: notary.name,
      notaryMatricula: notary.matricula,
      notaryColegio: notary.colegio,
      notaryCertificate: notary.certificate,
      notaryStatus: notary.status,
      notaryRegulator: notary.regulator
    };

    Object.entries(fields).forEach(([key, value]) => {
      setText(`[data-field="${key}"]`, value || "");
    });
  }

  function populateUploadForm() {
    const form = document.querySelector("[data-case-form]");
    if (!form) return;

    const data = getCase();
    const notaries = getNotaries();
    const notarySelect = document.getElementById("notaryId");

    Object.keys(data).forEach((key) => {
      const input = document.getElementById(key);
      if (input && input.type !== "file") input.value = data[key];
    });

    if (notarySelect) {
      notarySelect.innerHTML = "";
      notaries.forEach((notary) => {
        const option = document.createElement("option");
        option.value = notary.id;
        option.textContent = `${notary.name} - Mat. ${notary.matricula} - ${notary.status}`;
        notarySelect.appendChild(option);
      });
      notarySelect.value = data.notaryId || notaries[0].id;
      updateNotaryPreview();
      notarySelect.addEventListener("change", updateNotaryPreview);
    }
  }

  function updateNotaryPreview() {
    const select = document.getElementById("notaryId");
    if (!select) return;
    const notary = getNotaries().find((item) => item.id === select.value);
    if (!notary) return;
    setText('[data-preview="notaryName"]', notary.name);
    setText('[data-preview="notaryMatricula"]', notary.matricula);
    setText('[data-preview="notaryColegio"]', notary.colegio);
    setText('[data-preview="notaryRegulator"]', notary.regulator);
    setText('[data-preview="notaryStatus"]', notary.status);
  }

  window.saveCaseAndGo = async function (target) {
    const data = { ...getCase() };
    ["actType", "jurisdiction", "signerName", "signerId", "requestorName", "modality", "notaryId"].forEach((key) => {
      const input = document.getElementById(key);
      if (input) data[key] = input.value;
    });

    if (apiEnabled) {
      currentCase = await api("/api/case", {
        method: "PUT",
        body: JSON.stringify(data)
      });
    } else {
      writeJson(caseKey, data);
      currentCase = data;
    }
    window.location.href = target;
  };

  window.resetDemoData = function () {
    if (apiEnabled) {
      alert("En modo API, reiniciar datos se hara desde el archivo data/*.json o con una futura accion administrativa.");
      return;
    }
    writeJson(caseKey, defaultCase);
    writeJson(notaryKey, defaultNotaries);
    window.location.reload();
  };

  window.verifyNotary = async function (notaryId) {
    if (!apiEnabled) {
      alert("La validacion regulatoria real de demo requiere abrir el MVP por http://localhost:4173.");
      return;
    }
    const result = await api("/api/regulator/verify", {
      method: "POST",
      body: JSON.stringify({ notaryId })
    });
    const index = currentNotaries.findIndex((item) => item.id === result.notary.id);
    if (index >= 0) currentNotaries[index] = result.notary;
    renderNotaryAdmin();
    alert(`Consulta regulatoria registrada: ${result.evidence.evidenceId}`);
  };

  window.decideNotary = async function (notaryId, decision) {
    if (!apiEnabled) {
      alert("La decision regulatoria requiere abrir el MVP por http://localhost:4173.");
      return;
    }
    const result = await api("/api/regulator/decision", {
      method: "POST",
      body: JSON.stringify({
        notaryId,
        decision,
        operator: "Organismo regulador demo"
      })
    });
    const index = currentNotaries.findIndex((item) => item.id === result.notary.id);
    if (index >= 0) currentNotaries[index] = result.notary;
    renderRegulatorQueue();
    renderNotaryAdmin();
    renderCase();
  };

  window.caseAction = async function (action, detail, target) {
    if (apiEnabled) {
      await api("/api/case/event", {
        method: "POST",
        body: JSON.stringify({ action, detail })
      });
    }
    if (target) window.location.href = target;
  };

  function renderAuditPreview() {
    const target = document.getElementById("auditPreview");
    if (!target || !apiEnabled) return;
    api("/api/audit").then((audit) => {
      target.innerHTML = "";
      audit.slice(-6).reverse().forEach((event) => {
        const item = document.createElement("div");
        item.innerHTML = `<strong>${event.action}</strong><br>${event.at}<br><code>${event.eventHash}</code>`;
        target.appendChild(item);
      });
    }).catch(() => {});
  }

  function formatDateTime(value) {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "short",
      timeStyle: "medium"
    }).format(new Date(value));
  }

  function eventTitle(event) {
    const titles = {
      "server.started": "Servidor MVP iniciado",
      "case.updated": "Tramite actualizado",
      "notary.created": "Solicitud de alta de escribano",
      "regulator.verify": "Consulta regulatoria ejecutada",
      "regulator.decision": "Decision regulatoria registrada",
      "case.integrity.generated": "Hash e integridad documental",
      "case.review.completed": "Revision del acto completada",
      "case.signature.started": "Proceso de firma iniciado",
      "case.notary.confirmed": "Actuacion notarial confirmada",
      "case.certificate.issued": "Certificado emitido",
      "sports.agent.validated": "Agente FIFA autenticado",
      "sports.contract.configured": "Contrato deportivo parametrizado",
      "sports.party.added": "Parte deportiva agregada",
      "sports.party.signed": "Parte deportiva firmo",
      "sports.document.generated": "Documento deportivo generado",
      "sports.federation.approved": "Validacion federativa aprobada",
      "sports.federation.legal_review": "Derivacion legal federativa",
      "sports.notary.certified": "Contrato deportivo certificado"
    };
    return titles[event.action] || event.action;
  }

  function eventDetail(event) {
    const payload = event.payload || {};
    if (event.action === "regulator.decision") {
      return `${payload.name || "Escribano"} - ${payload.decision || ""} - Evidencia ${payload.evidenceId || ""}`;
    }
    if (event.action === "notary.created") {
      return `${payload.name || "Escribano"} solicito operar con matricula ${payload.matricula || ""}.`;
    }
    if (event.action && event.action.startsWith("sports.")) {
      return `${payload.name || payload.agent || "Contrato deportivo"} - expediente ${payload.expediente || ""} - ${payload.status || payload.detail || payload.role || ""}`;
    }
    if (payload.detail) return payload.detail;
    if (payload.signerName) return `${payload.signerName} - expediente ${payload.expediente || ""}.`;
    return "";
  }

  function renderAuditTimeline() {
    const timeline = document.getElementById("custodyTimeline");
    if (!timeline) return;

    if (!apiEnabled) {
      timeline.innerHTML = "<li><strong>Modo demo local</strong> Abra por localhost para ver eventos reales generados por la API.</li>";
      return;
    }

    api("/api/audit").then((audit) => {
      timeline.innerHTML = "";
      audit.forEach((event) => {
        const item = document.createElement("li");
        const detail = eventDetail(event);
        item.innerHTML = `<strong>${formatDateTime(event.at)} - ${eventTitle(event)}</strong>${detail ? `<span class="timeline-detail">${detail}</span>` : ""}<code>${event.eventHash}</code>`;
        timeline.appendChild(item);
      });
    }).catch(() => {
      timeline.innerHTML = "<li><strong>Auditoria no disponible</strong>No se pudo consultar la API local.</li>";
    });
  }

  function renderRegulatorQueue() {
    const body = document.getElementById("regulatorNotaryList");
    if (!body) return;
    body.innerHTML = "";
    getNotaries().forEach((notary) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${notary.name}</td>
        <td>${notary.matricula}</td>
        <td>${notary.colegio}</td>
        <td>${notary.jurisdiction}</td>
        <td><span class="badge-${notary.status === "Habilitado" ? "ok" : notary.status === "Rechazado" ? "error" : "pending"}">${notary.status}</span></td>
        <td>${notary.regulatorEvidenceId || "Pendiente"}</td>
        <td>
          <button type="button" onclick="decideNotary('${notary.id}', 'approve')">Habilitar</button>
          <button type="button" class="btn-secondary" onclick="decideNotary('${notary.id}', 'reject')">Rechazar</button>
        </td>
      `;
      body.appendChild(row);
    });
  }

  function renderNotaryWorkspace() {
    const target = document.getElementById("notaryWorkItems");
    if (!target) return;
    const data = getCase();
    const notary = getSelectedNotary(data);
    const canOperate = notary.status === "Habilitado";
    target.innerHTML = `
      <tr>
        <td>${data.expediente}</td>
        <td>${data.actType}</td>
        <td>${data.signerName}</td>
        <td>${notary.name}</td>
        <td><span class="badge-${canOperate ? "ok" : "pending"}">${canOperate ? "Listo para actuar" : "Bloqueado hasta habilitacion"}</span></td>
        <td>
          <a class="btn" href="document_preview.html">Revisar</a>
          <a class="btn btn-secondary" href="notary_sign.html">Actuar</a>
        </td>
      </tr>
      <tr>
        <td>${getSportsContract().expediente}</td>
        <td>${getSportsContract().contract.type}</td>
        <td>${getSportsContract().agent.name}</td>
        <td>${notary.name}</td>
        <td><span class="badge-${canOperate ? "ok" : "pending"}">${canOperate ? getSportsContract().status : "Bloqueado hasta habilitacion"}</span></td>
        <td>
          <a class="btn" href="sports_document.html">Revisar</a>
          <button type="button" class="btn-secondary" onclick="sportsAction('sports.notary.certified', 'Certificado por escribano - listo para archivo federado', 'sports_archive.html')">Certificar</button>
        </td>
      </tr>
    `;
  }

  function renderNotaryAdmin() {
    const list = document.getElementById("notaryList");
    if (!list) return;

    list.innerHTML = "";
    getNotaries().forEach((notary) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${notary.name}</td>
        <td>${notary.matricula}</td>
        <td>${notary.colegio}</td>
        <td>${notary.jurisdiction}</td>
        <td><span class="badge-${notary.status === "Habilitado" ? "ok" : "pending"}">${notary.status}</span></td>
        <td><button type="button" onclick="verifyNotary('${notary.id}')">Consultar</button></td>
      `;
      list.appendChild(row);
    });
  }

  function bindNotaryForm() {
    const form = document.getElementById("notaryForm");
    if (!form) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const next = {
        name: document.getElementById("newNotaryName").value,
        matricula: document.getElementById("newNotaryMatricula").value,
        colegio: document.getElementById("newNotaryColegio").value,
        jurisdiction: document.getElementById("newNotaryJurisdiction").value,
        status: "Pendiente de validacion"
      };

      if (apiEnabled) {
        const created = await api("/api/notaries", {
          method: "POST",
          body: JSON.stringify(next)
        });
        currentNotaries.push(created);
      } else {
        currentNotaries.push({
          id: `notary-${Date.now()}`,
          ...next,
          certificate: `CN=${next.name}, O=${next.colegio}`,
          regulator: next.status === "Habilitado"
            ? "Validado en linea ante organismo regulador"
            : "Pendiente de autenticacion regulatoria"
        });
        writeJson(notaryKey, currentNotaries);
      }

      form.reset();
      renderNotaryAdmin();
      renderRegulatorQueue();
    });
  }

  async function saveSportsContract(next, action) {
    next = mergeSportsContract(next);
    if (apiEnabled) {
      currentSportsContract = await api("/api/sports-contract", {
        method: "PUT",
        body: JSON.stringify({ ...next, auditAction: action })
      });
    } else {
      writeJson(sportsKey, next);
      currentSportsContract = next;
    }
    return currentSportsContract;
  }

  function fillValue(id, value) {
    const node = document.getElementById(id);
    if (node) node.value = value || "";
  }

  function bindSportsForms() {
    const sports = getSportsContract();
    fillValue("sportsAgentName", sports.agent.name);
    fillValue("sportsAgentLicense", sports.agent.license);
    fillValue("sportsAgentEmail", sports.agent.email);
    fillValue("sportsAgentFederation", sports.agent.federation);
    fillValue("sportsAgentValidation", sports.agent.validation);
    fillValue("sportsContractType", sports.contract.type);
    fillValue("sportsPreparationMode", sports.contract.preparationMode);
    fillValue("sportsUploadedDocumentName", sports.contract.uploadedDocumentName);
    fillValue("sportsReviewScope", sports.contract.reviewScope);
    fillValue("sportsClientType", sports.contract.clientType);
    fillValue("sportsDuration", sports.contract.duration);
    fillValue("sportsDurationOption", sports.contract.durationOption);
    fillValue("sportsRenewal", sports.contract.renewal);
    fillValue("sportsFeeOption", sports.contract.feeOption);
    fillValue("sportsFeePercent", sports.contract.feePercent);
    fillValue("sportsFeeDetail", sports.contract.feeDetail);
    fillValue("sportsTerritory", sports.contract.territory);
    fillValue("sportsExclusivity", sports.contract.exclusivity);
    fillValue("sportsObject", sports.contract.object);
    fillValue("sportsParticularClauses", sports.contract.particularClauses);
  }

  window.saveSportsAgentAndGo = async function (target) {
    const sports = mergeSportsContract(getSportsContract());
    sports.agent = {
      name: document.getElementById("sportsAgentName").value,
      license: document.getElementById("sportsAgentLicense").value,
      email: document.getElementById("sportsAgentEmail").value,
      federation: document.getElementById("sportsAgentFederation").value,
      validation: "Validado para demo - pendiente de fuente oficial integrada"
    };
    sports.status = "Agente autenticado";
    await saveSportsContract(sports, "sports.agent.validated");
    window.location.href = target;
  };

  window.saveSportsClausesAndGo = async function (target) {
    const sports = mergeSportsContract(getSportsContract());
    const uploadInput = document.getElementById("sportsUploadedDocument");
    const uploadedName = uploadInput && uploadInput.files && uploadInput.files[0]
      ? uploadInput.files[0].name
      : document.getElementById("sportsUploadedDocumentName").value;
    sports.contract = {
      preparationMode: document.getElementById("sportsPreparationMode").value,
      uploadedDocumentName: uploadedName || "Sin documento cargado",
      reviewScope: document.getElementById("sportsReviewScope").value,
      type: document.getElementById("sportsContractType").value,
      clientType: document.getElementById("sportsClientType").value,
      duration: document.getElementById("sportsDuration").value,
      durationOption: document.getElementById("sportsDurationOption").value,
      renewal: document.getElementById("sportsRenewal").value,
      feeOption: document.getElementById("sportsFeeOption").value,
      feePercent: document.getElementById("sportsFeePercent").value,
      feeDetail: document.getElementById("sportsFeeDetail").value,
      territory: document.getElementById("sportsTerritory").value,
      exclusivity: document.getElementById("sportsExclusivity").value,
      object: document.getElementById("sportsObject").value,
      particularClauses: document.getElementById("sportsParticularClauses").value
    };
    sports.status = "Clausulas configuradas";
    await saveSportsContract(sports, "sports.contract.configured");
    window.location.href = target;
  };

  window.saveSportsParty = async function () {
    const party = {
      type: document.getElementById("sportsPartyType").value,
      name: document.getElementById("sportsPartyName").value,
      identifier: document.getElementById("sportsPartyIdentifier").value,
      email: document.getElementById("sportsPartyEmail").value,
      role: document.getElementById("sportsPartyRole").value
    };
    if (apiEnabled) {
      currentSportsContract = await api("/api/sports-contract/party", {
        method: "POST",
        body: JSON.stringify(party)
      });
    } else {
      const sports = mergeSportsContract(getSportsContract());
      sports.parties.push({
        id: `party-${Date.now()}`,
        ...party,
        validationStatus: "Pendiente validacion documental",
        signatureStatus: "Pendiente firma"
      });
      sports.notifications.push({
        at: new Date().toISOString(),
        to: party.email,
        subject: "Alta en circuito de contrato deportivo",
        status: "Notificacion demo generada"
      });
      sports.status = "Partes en identificacion y firma";
      writeJson(sportsKey, sports);
      currentSportsContract = sports;
    }
    ["sportsPartyName", "sportsPartyIdentifier", "sportsPartyEmail", "sportsPartyRole"].forEach((id) => fillValue(id, ""));
    renderSportsContract();
  };

  window.signSportsParty = async function (partyId) {
    if (apiEnabled) {
      currentSportsContract = await api("/api/sports-contract/sign", {
        method: "POST",
        body: JSON.stringify({ partyId })
      });
    } else {
      const sports = mergeSportsContract(getSportsContract());
      const party = sports.parties.find((item) => item.id === partyId);
      if (party) {
        party.validationStatus = "Identidad y correo validados";
        party.signatureStatus = "Firmado digitalmente";
        sports.notifications.push({
          at: new Date().toISOString(),
          to: party.email,
          subject: "Firma registrada en contrato deportivo",
          status: "Notificacion demo generada"
        });
      }
      writeJson(sportsKey, sports);
      currentSportsContract = sports;
    }
    renderSportsContract();
  };

  window.sportsAction = async function (action, status, target) {
    if (apiEnabled) {
      const result = await api("/api/sports-contract/action", {
        method: "POST",
        body: JSON.stringify({
          action,
          status,
          detail: status,
          notificationTo: getSportsContract().agent.email,
          subject: "Movimiento de tramite deportivo federado"
        })
      });
      currentSportsContract = result.sportsContract;
    } else {
      const sports = mergeSportsContract(getSportsContract());
      sports.status = status;
      sports.notifications.push({
        at: new Date().toISOString(),
        to: sports.agent.email,
        subject: "Movimiento de tramite deportivo federado",
        status: "Notificacion demo generada"
      });
      writeJson(sportsKey, sports);
      currentSportsContract = sports;
    }
    if (target) window.location.href = target;
    else renderSportsContract();
  };

  window.savePassportProfile = function () {
    const passport = getPassport();
    const next = savePassport({
      ...passport,
      athleteName: document.getElementById("passportAthleteName")?.value || passport.athleteName,
      athleteId: document.getElementById("passportAthleteId")?.value || passport.athleteId,
      birthDate: document.getElementById("passportBirthDate")?.value || passport.birthDate,
      academy: document.getElementById("passportAcademy")?.value || passport.academy,
      category: document.getElementById("passportCategory")?.value || passport.category,
      tutor: document.getElementById("passportTutor")?.value || passport.tutor,
      email: document.getElementById("passportEmail")?.value || passport.email,
      channel: document.getElementById("passportChannel")?.value || passport.channel,
      status: "Ficha guardada - pendiente de validacion documental",
      events: [
        ...(passport.events || []),
        {
          at: new Date().toISOString(),
          action: "passport.profile.saved",
          detail: "Ficha deportiva guardada y disponible para gestion documental."
        }
      ]
    });
    setStatus("#passportSaveStatus", `Ficha guardada para ${next.athleteName}. Evento auditado y lista para gestionar documentos.`, true);
  };

  window.submitPassportDocument = function () {
    const checks = [
      ["passportBiometric", "biometria demo del operador"],
      ["passportIdentityMatch", "coincidencia documento-persona"],
      ["passportSensitiveConsent", "tratamiento de dato sensible"],
      ["passportHashConsent", "hash y evento de auditoria"]
    ];
    const missing = checks
      .filter(([id]) => !document.getElementById(id)?.checked)
      .map(([, label]) => label);
    if (missing.length) {
      setStatus("#passportUploadStatus", `No se puede incorporar: falta confirmar ${missing.join(", ")}.`, false);
      return false;
    }

    const passport = getPassport();
    const fileInput = document.getElementById("passportUploadFile");
    const fileName = fileInput?.files?.[0]?.name || "Documento demo sin archivo real";
    const documentType = document.getElementById("passportUploadType")?.value || "Documento";
    const next = savePassport({
      ...passport,
      status: "Documento incorporado a revision segura",
      documents: [
        ...(passport.documents || []),
        {
          id: `PD-DOC-${Date.now()}`,
          type: documentType,
          fileName,
          role: document.getElementById("passportUploadRole")?.value || "Operador",
          operator: document.getElementById("passportOperatorIdentity")?.value || "",
          subject: document.getElementById("passportDocumentSubject")?.value || "",
          email: document.getElementById("passportUploadEmail")?.value || passport.email,
          status: "En revision",
          hash: "SHA256-DEMO-" + Date.now().toString(16).toUpperCase(),
          at: new Date().toISOString()
        }
      ],
      events: [
        ...(passport.events || []),
        {
          at: new Date().toISOString(),
          action: "passport.document.submitted",
          detail: `${documentType} incorporado con biometria, coincidencia e integridad confirmadas.`
        }
      ]
    });
    setStatus("#passportUploadStatus", `${documentType} incorporado a revision segura para ${next.athleteName}. Hash y auditoria registrados.`, true);
    return true;
  };

  function renderSportsContract() {
    const sports = getSportsContract();
    const values = {
      sportsExpediente: sports.expediente,
      sportsStatus: sports.status,
      sportsAgentName: sports.agent.name,
      sportsAgentLicense: sports.agent.license,
      sportsAgentEmail: sports.agent.email,
      sportsAgentFederation: sports.agent.federation,
      sportsPreparationMode: sports.contract.preparationMode,
      sportsUploadedDocumentName: sports.contract.uploadedDocumentName,
      sportsReviewScope: sports.contract.reviewScope,
      sportsContractType: sports.contract.type,
      sportsClientType: sports.contract.clientType,
      sportsDuration: sports.contract.duration,
      sportsDurationOption: sports.contract.durationOption,
      sportsRenewal: sports.contract.renewal,
      sportsFeeOption: sports.contract.feeOption,
      sportsFeePercent: sports.contract.feePercent,
      sportsFeeDetail: sports.contract.feeDetail,
      sportsTerritory: sports.contract.territory,
      sportsExclusivity: sports.contract.exclusivity,
      sportsObject: sports.contract.object,
      sportsParticularClauses: sports.contract.particularClauses,
      sportsDocumentHash: sports.documentHash,
      sportsQrCode: sports.qrCode
    };
    Object.entries(values).forEach(([key, value]) => setText(`[data-sports="${key}"]`, value || ""));

    const parties = document.getElementById("sportsPartiesList");
    if (parties) {
      parties.innerHTML = "";
      sports.parties.forEach((party) => {
        const signed = party.signatureStatus === "Firmado digitalmente";
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${party.name}<br><small>${party.type} - ${party.email}</small></td>
          <td>${party.role}</td>
          <td><span class="badge-${party.validationStatus.includes("Pendiente") ? "pending" : "ok"}">${party.validationStatus}</span></td>
          <td><span class="badge-${signed ? "ok" : "pending"}">${party.signatureStatus}</span></td>
          <td>${signed ? "Firma registrada y auditada" : `<button type="button" onclick="signSportsParty('${party.id}')">Firmar demo</button>`}</td>
        `;
        parties.appendChild(row);
      });
    }

    const notifications = document.getElementById("sportsNotifications");
    if (notifications) {
      notifications.innerHTML = "";
      sports.notifications.slice(-8).reverse().forEach((item) => {
        const div = document.createElement("div");
        div.innerHTML = `<strong>${item.subject}</strong><br>${item.to}<br><small>${formatDateTime(item.at)} - ${item.status}</small>`;
        notifications.appendChild(div);
      });
    }

    renderSportsStatusBoard(sports);
    applyLanguage();
  }

  function renderSportsStatusBoard(sports) {
    const target = document.getElementById("sportsStatusBoard");
    if (!target) return;
    const status = sports.status || "";
    const signedCount = sports.parties.filter((party) => party.signatureStatus === "Firmado digitalmente").length;
    const steps = [
      ["Solicitud", "Expediente creado", true],
      ["Agente FIFA", sports.agent.validation || "Pendiente", status !== "Borrador deportivo"],
      ["Clausulas", sports.contract.type, status.includes("Clausulas") || status.includes("Partes") || status.includes("Documento") || status.includes("federacion") || status.includes("escribano") || status.includes("archivo")],
      ["Partes", `${signedCount}/${sports.parties.length} firmas`, signedCount === sports.parties.length],
      ["Documento", sports.documentHash === "PENDIENTE" ? "Hash pendiente" : "Hash generado", sports.documentHash !== "PENDIENTE"],
      ["Federacion", status.includes("federacion") || status.includes("Federacion") ? status : "En espera de control", status.includes("federacion") || status.includes("Federacion")],
      ["Escribano", status.includes("escribano") || status.includes("Certificado") ? status : "En espera de mesa del escribano", status.includes("escribano") || status.includes("Certificado")],
      ["Archivo", status.includes("archivo") || status.includes("Archivo") ? status : "Pendiente", status.includes("archivo") || status.includes("Archivo")]
    ];
    target.innerHTML = steps.map(([title, detail, complete]) => `
      <div class="status-step ${complete ? "complete" : "pending"}">
        <span></span>
        <strong>${title}</strong>
        <small>${detail}</small>
      </div>
    `).join("");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      await loadState();
      setModeBadge();
      initAccessGate();
      populateUploadForm();
      renderCase();
      renderNotaryAdmin();
      renderAuditPreview();
      renderAuditTimeline();
      renderRegulatorQueue();
      renderNotaryWorkspace();
      bindNotaryForm();
      bindSportsForms();
      renderSportsContract();
      initLanguageSelector();
      applyLanguage();
    } catch (error) {
      console.error(error);
      alert(`No se pudo iniciar la demo: ${error.message}`);
    }
  });
})();
