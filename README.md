# ClassTrack Web Frontend (`classtrack.web`)

Plataforma frontend moderna para la gestión académica multi-colegio, horarios y control de asistencia con reglas de negocio avanzadas (ventana de 72 horas para docentes, multi-tenancy por esquemas y notificaciones automatizadas).

## 🚀 Tecnologías Principales

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8 con compilador React optimizado
- **Estilos:** Tailwind CSS v4
- **Enrutamiento:** React Router DOM
- **Cliente HTTP:** Axios centralizado con interceptores Bearer JWT

---

## 🏛️ Arquitectura del Proyecto

Este proyecto sigue una **Arquitectura Modular Guiada por Features (Feature-Driven / Vertical Slicing)**. Cada funcionalidad de negocio está completamente aislada y contiene sus propios componentes, hooks, interfaces y servicios.

👉 **Consulta la especificación arquitectónica detallada en [ARCHITECTURE.md](./ARCHITECTURE.md).**

### Resumen de la Estructura por Feature:

Cada módulo en `src/features/[feature-name]/` se estructura estrictamente así:

```text
src/features/[feature]/
├── components/    # Componentes visuales privados del feature
├── hooks/         # Custom hooks con estado y lógica de negocio
├── interfaces/    # Contratos TypeScript (DTOs, modelos, props)
├── services/      # Llamadas a endpoints de la API (classtrack.api)
├── pages/         # Vistas de la página para el enrutador
└── index.ts       # Entrada pública del feature
```

---

## 🛠️ Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción (TypeScript + Vite)
npm run build

# Ejecutar linter
npm run lint
```
