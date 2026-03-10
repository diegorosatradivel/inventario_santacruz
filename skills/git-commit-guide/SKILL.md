---
name: git-commit-guide
description: >
  Guía y estándares para la generación de mensajes de commit en el proyecto GAO. 
  Asegura que todos los commits sigan una estructura consistente, profesional y 
  visual mediante el uso de emojis y descripciones en español.
---

# Guía de Mensajes de Commit (GAO)

Esta skill define el estándar para documentar los cambios en el repositorio. Un buen mensaje de commit ayuda a entender rápidamente qué se hizo, por qué y bajo qué contexto.

## Estructura del Mensaje

Todos los commits deben seguir este formato:

```text
<emoji> <tipo>: <descripción corta en español>

[Opcional: Explicación más detallada de los cambios]
[Opcional: Referencia a tickets o IDs de tarea]
```

### Reglas de Oro:
1. **Idioma**: Siempre en ESPAÑOL.
2. **Verbo**: Usar el verbo principal en **infinitivo** (ej: "añadir", "corregir", "refactorizar", "mejorar").
3. **Brevedad**: La primera línea debe ser concisa (máximo 50-60 caracteres).
4. **Emoji**: Obligatorio al principio de cada mensaje.

---

## Catálogo de Emojis y Tipos

Usa el que mejor se adapte al cambio realizado:

| Emoji | Tipo | Cuándo usarlo |
| :--- | :--- | :--- |
| ✨ | **feat** | Una nueva característica o funcionalidad. |
| 🐛 | **fix** | Corrección de un error (bug). |
| ♻️ | **refactor** | Refactorización de código que no añade funcionalidad ni arregla bugs. |
| 📝 | **docs** | Solo cambios en la documentación. |
| 💄 | **style** | Cambios que no afectan al significado del código (espacios, formato, CSS, etc). |
| ⚡ | **perf** | Un cambio de código que mejora el rendimiento. |
| ✅ | **test** | Añadir pruebas que faltaban o corregir pruebas existentes. |
| 🔧 | **chore** | Cambios en herramientas de construcción, configuración, dependencias o auxiliares. |
| 🧱 | **arch** | Cambios significativos en la arquitectura del sistema. |
| 🚀 | **deploy** | Cambios relacionados con el despliegue o integración continua. |
| ⏪ | **revert** | Revertir un commit anterior. |

---

## Ejemplos de Mensajes

### Nueva funcionalidad
```text
✨ feat: añadir slider para el parámetro K en la cabecera de ofertas
- Implementado trigger de popover en formulario.phtml
- Añadida lógica JS para actualización en tiempo real
```

### Corrección de errores
```text
🐛 fix: corregir error de guardado en alta rápida de ofertas
- Se ha identificado que faltaba validar el ID del cliente antes de enviar.
```

### Refactorización
```text
♻️ refactor: mover lógica de cálculo de precios al modelo lineas_revision
- Se elimina la redundancia en el controlador y se centraliza la lógica.
```

### Cambios visuales (estilo)
```text
💄 style: restaurar color azul en la cabecera del card de ofertas
```

### Mantenimiento o configuración
```text
🔧 chore: añadir skill de guía de commits a la carpeta .agent
```

---

## Cómo usar el asistente para generar el commit

Cuando pidas ayuda para generar un commit, el asistente analizará los cambios realizados y te propondrá uno o varios mensajes siguiendo este estándar. Puedes decir simplemente:

> "Ayúdame a redactar el mensaje de commit para estos cambios"
