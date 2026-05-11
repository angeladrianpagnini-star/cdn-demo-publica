const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const dataDir = path.join(root, "data");
const port = Number(process.env.PORT || 4173);

const defaults = {
  case: {
    expediente: "CDN-2026-000134",
    actType: "Poder general de administracion",
    jurisdiction: "Ciudad Autonoma de Buenos Aires",
    signerName: "Juan Perez",
    signerId: "DNI 24.567.890",
    requestorName: "Usuario solicitante",
    modality: "Remota con videoconferencia y validacion biometrica",
    notaryId: "notary-1",
    hash: "58AF92B1D3F8E467A21D8F34C0E29A9B7CA40E8C19F6AA78D91E0BB13A60F22"
  },
  sportsContract: {
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
  },
  notaries: [
    {
      id: "notary-1",
      name: "Maria Lopez",
      matricula: "12.345",
      colegio: "Colegio Piloto",
      jurisdiction: "Ciudad Autonoma de Buenos Aires",
      certificate: "CN=Maria Lopez, O=Colegio Piloto",
      status: "Habilitado",
      regulator: "Validado en linea ante organismo regulador",
      regulatorEvidenceId: "REG-DEMO-0001"
    },
    {
      id: "notary-2",
      name: "Damian Gonzalo Novoa",
      matricula: "24.810",
      colegio: "Registro institucional de prueba",
      jurisdiction: "Provincia de Buenos Aires",
      certificate: "CN=Damian Gonzalo Novoa, O=Registro Piloto",
      status: "Pendiente de validacion",
      regulator: "Pendiente de autenticacion regulatoria",
      regulatorEvidenceId: "REG-DEMO-0002"
    }
  ],
  audit: []
};

function ensureData() {
  fs.mkdirSync(dataDir, { recursive: true });
  for (const [name, value] of Object.entries(defaults)) {
    const file = path.join(dataDir, `${name}.json`);
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(value, null, 2));
    }
  }
}

function readStore(name) {
  ensureData();
  return JSON.parse(fs.readFileSync(path.join(dataDir, `${name}.json`), "utf8"));
}

function writeStore(name, value) {
  ensureData();
  fs.writeFileSync(path.join(dataDir, `${name}.json`), JSON.stringify(value, null, 2));
}

function appendAudit(action, payload = {}) {
  const audit = readStore("audit");
  const previousHash = audit.length ? audit[audit.length - 1].eventHash : "GENESIS";
  const event = {
    id: `AUD-${Date.now()}`,
    at: new Date().toISOString(),
    action,
    payload,
    previousHash
  };
  event.eventHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(event))
    .digest("hex")
    .toUpperCase();
  audit.push(event);
  writeStore("audit", audit);
  return event;
}

function updateSportsIntegrity(contract) {
  contract.documentHash = crypto
    .createHash("sha256")
    .update(JSON.stringify({
      expediente: contract.expediente,
      agent: contract.agent,
      contract: contract.contract,
      parties: contract.parties
    }))
    .digest("hex")
    .toUpperCase();
  contract.qrCode = `${contract.expediente}-${contract.documentHash.slice(0, 12)}`;
  return contract;
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function safeStaticPath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const requested = clean === "/" ? "/index.html" : clean;
  const fullPath = path.normalize(path.join(root, requested));
  if (!fullPath.startsWith(root)) return null;
  return fullPath;
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml"
  }[ext] || "application/octet-stream";
}

async function handleApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/api/state") {
    return sendJson(res, 200, {
      case: readStore("case"),
      sportsContract: readStore("sportsContract"),
      notaries: readStore("notaries"),
      audit: readStore("audit")
    });
  }

  if (req.method === "GET" && url.pathname === "/api/case") {
    return sendJson(res, 200, readStore("case"));
  }

  if (req.method === "GET" && url.pathname === "/api/sports-contract") {
    return sendJson(res, 200, readStore("sportsContract"));
  }

  if (req.method === "PUT" && url.pathname === "/api/sports-contract") {
    const payload = await readBody(req);
    const current = readStore("sportsContract");
    const next = {
      ...current,
      ...payload,
      agent: { ...current.agent, ...(payload.agent || {}) },
      contract: { ...current.contract, ...(payload.contract || {}) },
      parties: Array.isArray(payload.parties) ? payload.parties : current.parties,
      notifications: Array.isArray(payload.notifications) ? payload.notifications : current.notifications
    };
    updateSportsIntegrity(next);
    writeStore("sportsContract", next);
    appendAudit(payload.auditAction || "sports.contract.updated", {
      expediente: next.expediente,
      status: next.status,
      agent: next.agent.name,
      contractType: next.contract.type,
      documentHash: next.documentHash
    });
    return sendJson(res, 200, next);
  }

  if (req.method === "POST" && url.pathname === "/api/sports-contract/party") {
    const payload = await readBody(req);
    const current = readStore("sportsContract");
    const party = {
      id: `party-${Date.now()}`,
      type: String(payload.type || "").trim(),
      name: String(payload.name || "").trim(),
      identifier: String(payload.identifier || "").trim(),
      email: String(payload.email || "").trim(),
      role: String(payload.role || "").trim(),
      validationStatus: "Pendiente validacion documental",
      signatureStatus: "Pendiente firma"
    };
    if (!party.type || !party.name || !party.identifier || !party.email || !party.role) {
      return sendJson(res, 400, { error: "Faltan datos obligatorios de la parte interviniente." });
    }
    current.parties.push(party);
    current.status = "Partes en identificacion y firma";
    current.notifications.push({
      at: new Date().toISOString(),
      to: party.email,
      subject: "Alta en circuito de contrato deportivo",
      status: "Notificacion demo generada"
    });
    updateSportsIntegrity(current);
    writeStore("sportsContract", current);
    appendAudit("sports.party.added", {
      expediente: current.expediente,
      name: party.name,
      email: party.email,
      role: party.role
    });
    return sendJson(res, 201, current);
  }

  if (req.method === "POST" && url.pathname === "/api/sports-contract/sign") {
    const payload = await readBody(req);
    const current = readStore("sportsContract");
    const party = current.parties.find((item) => item.id === payload.partyId);
    if (!party) return sendJson(res, 404, { error: "Parte no encontrada." });
    party.validationStatus = "Identidad y correo validados";
    party.signatureStatus = "Firmado digitalmente";
    current.status = current.parties.every((item) => item.signatureStatus === "Firmado digitalmente")
      ? "Firmas completas - listo para federacion"
      : "Firmas parciales";
    current.notifications.push({
      at: new Date().toISOString(),
      to: party.email,
      subject: "Firma registrada en contrato deportivo",
      status: "Notificacion demo generada"
    });
    updateSportsIntegrity(current);
    writeStore("sportsContract", current);
    appendAudit("sports.party.signed", {
      expediente: current.expediente,
      name: party.name,
      email: party.email,
      role: party.role
    });
    return sendJson(res, 200, current);
  }

  if (req.method === "POST" && url.pathname === "/api/sports-contract/action") {
    const payload = await readBody(req);
    const current = readStore("sportsContract");
    current.status = payload.status || current.status;
    if (payload.notificationTo) {
      current.notifications.push({
        at: new Date().toISOString(),
        to: payload.notificationTo,
        subject: payload.subject || "Movimiento de tramite deportivo",
        status: "Notificacion demo generada"
      });
    }
    writeStore("sportsContract", current);
    const event = appendAudit(payload.action || "sports.contract.event", {
      expediente: current.expediente,
      status: current.status,
      detail: payload.detail || "",
      documentHash: current.documentHash,
      qrCode: current.qrCode
    });
    return sendJson(res, 201, { sportsContract: current, event });
  }

  if (req.method === "PUT" && url.pathname === "/api/case") {
    const payload = await readBody(req);
    const current = readStore("case");
    const next = { ...current, ...payload };
    writeStore("case", next);
    appendAudit("case.updated", {
      expediente: next.expediente,
      signerName: next.signerName,
      notaryId: next.notaryId
    });
    return sendJson(res, 200, next);
  }

  if (req.method === "GET" && url.pathname === "/api/notaries") {
    return sendJson(res, 200, readStore("notaries"));
  }

  if (req.method === "POST" && url.pathname === "/api/notaries") {
    const payload = await readBody(req);
    const notaries = readStore("notaries");
    const next = {
      id: `notary-${Date.now()}`,
      name: String(payload.name || "").trim(),
      matricula: String(payload.matricula || "").trim(),
      colegio: String(payload.colegio || "").trim(),
      jurisdiction: String(payload.jurisdiction || "").trim(),
      certificate: `CN=${String(payload.name || "").trim()}, O=${String(payload.colegio || "").trim()}`,
      status: "Pendiente de validacion",
      regulator: "Pendiente de autenticacion regulatoria por organismo regulador",
      regulatorEvidenceId: `REG-DEMO-${Date.now()}`
    };

    if (!next.name || !next.matricula || !next.colegio || !next.jurisdiction) {
      return sendJson(res, 400, { error: "Faltan datos obligatorios del escribano." });
    }

    notaries.push(next);
    writeStore("notaries", notaries);
    appendAudit("notary.created", {
      id: next.id,
      name: next.name,
      matricula: next.matricula,
      status: next.status
    });
    return sendJson(res, 201, next);
  }

  if (req.method === "POST" && url.pathname === "/api/regulator/verify") {
    const payload = await readBody(req);
    const notaries = readStore("notaries");
    const index = notaries.findIndex((notary) => notary.id === payload.notaryId);
    if (index === -1) return sendJson(res, 404, { error: "Escribano no encontrado." });

    const notary = notaries[index];
    const evidence = {
      evidenceId: `REG-${Date.now()}`,
      status: notary.status,
      checkedAt: new Date().toISOString(),
      source: "Organismo regulador simulado",
      signedResponseHash: crypto
        .createHash("sha256")
        .update(`${notary.id}:${notary.matricula}:${Date.now()}`)
        .digest("hex")
        .toUpperCase()
    };

    notary.regulatorEvidenceId = evidence.evidenceId;
    notary.regulator = notary.status === "Habilitado"
      ? `Validado en linea ante organismo regulador (${evidence.evidenceId})`
      : `Pendiente o no habilitado (${evidence.evidenceId})`;
    notaries[index] = notary;
    writeStore("notaries", notaries);
    appendAudit("regulator.verify", {
      notaryId: notary.id,
      matricula: notary.matricula,
      result: notary.status,
      evidenceId: evidence.evidenceId
    });
    return sendJson(res, 200, { notary, evidence });
  }

  if (req.method === "POST" && url.pathname === "/api/regulator/decision") {
    const payload = await readBody(req);
    const notaries = readStore("notaries");
    const index = notaries.findIndex((notary) => notary.id === payload.notaryId);
    if (index === -1) return sendJson(res, 404, { error: "Escribano no encontrado." });

    const approved = payload.decision === "approve";
    const evidenceId = `REG-DEC-${Date.now()}`;
    const notary = notaries[index];
    notary.status = approved ? "Habilitado" : "Rechazado";
    notary.regulatorEvidenceId = evidenceId;
    notary.regulator = approved
      ? `Habilitado por organismo regulador (${evidenceId})`
      : `No habilitado por organismo regulador (${evidenceId})`;
    notaries[index] = notary;
    writeStore("notaries", notaries);

    const event = appendAudit("regulator.decision", {
      notaryId: notary.id,
      name: notary.name,
      matricula: notary.matricula,
      decision: notary.status,
      evidenceId,
      operator: payload.operator || "Mesa regulatoria demo"
    });
    return sendJson(res, 200, { notary, event });
  }

  if (req.method === "POST" && url.pathname === "/api/case/event") {
    const payload = await readBody(req);
    const current = readStore("case");
    const event = appendAudit(payload.action || "case.event", {
      expediente: current.expediente,
      signerName: current.signerName,
      notaryId: current.notaryId,
      detail: payload.detail || ""
    });
    return sendJson(res, 201, event);
  }

  if (req.method === "GET" && url.pathname === "/api/audit") {
    return sendJson(res, 200, readStore("audit"));
  }

  return sendJson(res, 404, { error: "Endpoint no encontrado." });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/")) {
      return await handleApi(req, res);
    }

    const filePath = safeStaticPath(req.url);
    if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("No encontrado");
    }

    res.writeHead(200, {
      "Content-Type": contentType(filePath),
      "Cache-Control": "no-store"
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

ensureData();
appendAudit("server.started", { port });
server.listen(port, () => {
  console.log(`CDN MVP listo en http://localhost:${port}`);
});
