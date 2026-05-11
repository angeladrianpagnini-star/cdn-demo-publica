# Certificacion Digital Notarial - Demo publica

Demo conceptual de una plataforma de certificacion digital notarial orientada a documentos legales, cadena de custodia y contratos deportivos federados.

El objetivo de esta version publica es mostrar el alcance visual y funcional del piloto sin exponer documentacion estrategica interna, roadmap de producto, analisis de proteccion intelectual ni materiales sensibles de validacion institucional.

## Que muestra la demo

- Portada institucional clickeable.
- Panel de control de tramites notariales.
- Alta de tramite digital.
- Seleccion y validacion de escribano.
- Simulacion de identidad, hash, firma, certificacion y paquete de evidencia.
- Auditoria con cadena de custodia.
- Vertical deportiva para contratos federados, agentes FIFA, clubes, jugadores, sponsors y validacion federativa.
- Dos caminos de trabajo contractual:
  - cargar documento ya confeccionado;
  - construir documento asistido desde la plataforma.

## Ejecutar localmente

Entrar a la carpeta `demo` y ejecutar:

```powershell
start-mvp.bat
```

Luego abrir:

```text
http://localhost:4173
```

Tambien se puede ejecutar con Node.js:

```powershell
cd demo
node server.js
```

## Alcance

Esta es una prueba de concepto / MVP demostrativo. No presta servicios notariales reales, no reemplaza asesoramiento juridico, no emite certificados productivos y no integra aun servicios oficiales de identidad, firma digital, federaciones deportivas o registros profesionales.

## Estado del proyecto

Version publica de portfolio. La version privada contiene documentacion de estrategia, roadmap, analisis juridico ampliado, decisiones de proteccion intelectual y plan de validacion institucional.

## Derechos

Todos los derechos reservados. La publicacion de este repositorio permite revision y demostracion, pero no otorga permiso para copiar, explotar comercialmente, relicenciar o presentar la idea como propia.
