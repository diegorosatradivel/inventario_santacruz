---
name: agendator-modules
description: >
  Documentación de los módulos funcionales de AGENDATOR: Avance de Obra (módulo principal), Producciones,
  Administración y Ofertas. Incluye controladores, vistas, flujos de trabajo y consideraciones
  de seguridad de cada módulo. Usar cuando se necesite entender o modificar la funcionalidad de
  un módulo específico.
---

# Módulos Funcionales de AGENDATOR

## Cuándo usar esta skill

- Al **trabajar en un módulo** y necesitar contexto de sus controladores, vistas y flujos.
- Al **crear nuevas funcionalidades** dentro de un módulo existente.
- Al **investigar** cómo interactúan los módulos entre sí.
- Al necesitar entender las **restricciones de seguridad** de cada módulo.

---

# Módulo 1: Avance de Obra (Principal)

## Propósito
Concentra la operativa diaria: tablero de control, mantenimiento de expedientes y obras, asignación
de pedidos, informes y seguimiento de producciones. Todos sus controladores heredan de `AdminController`.

**Ruta**: `default/app/controllers/avancedeobra/`

## Controladores

### `GestionController`
- Dashboard principal (`index`) y limpieza de caché (`flushcache`).
- Utilidades AJAX (`json`) para autocompletado.
- Cierre de periodo de producción (`confirmarProduccion`).
- Cada acción valida divisiones mediante `usuarios::perteneceAladivision`.

### `ExpedientesController`
- Búsquedas avanzadas, listados filtrados, exportación a PDF.
- Vistas segmentadas por tipo de división (`verDDN`, `medida/ver`, `madrid/ver`).
- Creación de expedientes, JSON de obras por división.
- Verificaciones de visibilidad por división antes de permitir cambios.

### `ObrasController`
- Detalles de obra, facturas por periodo.
- Calendarios sincronizados con datos externos (datawarehouse).

### `InformesController`
- Informes filtrados (facturas, producciones por periodo, pendientes por gestor, cartera).
- Plantillas PDF con seguridad basada en divisiones permitidas.

### `ProduccionesController` (submódulo)
- Listados mensuales, acumulados y exportaciones Excel.
- Soportado por procedimientos almacenados (`ObtenerDatosPeriodos`).

### `PedidosController`
- Bandeja de pedidos: asignación a líneas de negocio, reasignación.
- Creación/actualización de expedientes con datos del pedido.
- Previsualización de PDFs y utilidades AJAX.

### `AdjuntosController`
- Subida y eliminación de ficheros asociados a expedientes.
- Registro de operaciones en logs.

## Flujos Habituales

1. **Asignación de pedidos**: `asignarPedidosALineasDeNegocio` → `asignarAObra` crea/actualiza
   expedientes.
2. **Gestión de expedientes**: Listados filtran por división/estado, enlazan con `ver` donde se
   aplican validaciones de acceso.
3. **Informes mensuales**: `informeProduccionesMes` construye PDFs combinando divisiones, responsables
   y periodo.

## Seguridad
- Todas las operaciones validan la división contra el usuario activo.
- `AdminController` redirige a login cuando no hay sesión.

---

# Módulo 2: Producciones

## Propósito
Experiencia simplificada para usuarios dedicados a introducir y consultar producciones. El `IndexController`
replica autenticación y redirige al dashboard específico.

**Ruta**: `default/app/controllers/producciones/`

## Controlador `GestionController`
- Resumen inicial (`index`) y consultas de obras (`ver`).
- Informes mensuales en PDF con restricciones de división.
- Formularios de producción por obra y año filtrados por divisiones del usuario.
- Limpieza de caché, autocompletado JSON, changelog.
- Endpoints AJAX para actualizar importes de facturación, certificaciones y producciones.
- Cierre de periodo (`confirmarProduccion`) comparte lógica con el módulo principal.

## Relación con Avance de Obra
- Comparte modelos: `expedientes`, `divisiones`, `producciones`.
- Comparte helpers: `usuarios::perteneceAladivision`, `Lite::all`.
- Los listados y exportaciones avanzadas se delegan al produccionesController del módulo Avance de Obra.

## Acceso
`AdminController` redirige automáticamente a usuarios cuyo campo `modulo` sea `producciones`.

---

# Módulo 3: Administración

## Propósito
Centraliza la gestión de usuarios, divisiones, obras maestras, perfiles de permisos, registros y
configuración del correo. Solo accesible para perfiles con `perfiles_id == 1`.

**Ruta**: `default/app/controllers/admins/`

## Controladores

### `UsuariosController`
- CRUD completo con paginación, envío de credenciales por correo, asignación de divisiones.
- Usuarios no admin solo pueden editar su propio registro.

### `DivisionesController`
- Scaffold sobre modelo `divisiones` para mantener líneas de negocio.

### `PerfilesController`
- Administra perfiles de permisos con acciones AJAX para banderas de lectura/creación/edición.

### `LogsController`
- Visualiza registros del sistema, formatea JSON para diagnóstico.

### `ConfiguracionController`
- Edita parámetros de correo (`mail.ini`) usando API de `Config`.

### `ImportacionController`
- Herramientas para importar datos históricos desde tablas auxiliares.

### `ObrasController`
- Mantenimiento de tabla maestra de obras con integración `Obrasglobe`.

## Consideraciones
- Los controladores basados en `JscaffoldController` usan plantillas `SFadmin` para CRUD automático.
- Cualquier personalización debe hacerse en vistas parciales de `default/app/views/admins`.

---

# Módulo 4: Ofertas

## Propósito
Gestión comercial de ofertas con panel Kanban, generación de PDF y CRM integrado.

**Ruta**: `default/app/controllers/ofertas/`
**Acceso web**: `http://localhost/kumbia/ofertas`

## Funcionalidades
- **Panel Kanban**: Visualización de ofertas por estado.
- **Creación de ofertas**: Generación automática de código (formato `YYYY-NNNNN`).
- **Gestión CRM**: Seguimientos, revisiones y contactos integrados en la ficha de la oferta.
- **Generación PDF**: Plantilla mPDF para exportar ofertas.
- **Gestión de clientes**: CRUD de clientes integrado.

## Relaciones del Módulo
- `ofertas` → `belongs_to`: clientes, divisiones, usuarios
- `ofertas` → `has_many`: lineas_oferta, revisiones_oferta, seguimientos

---

## Notas Generales

### Crear un Módulo Nuevo
1. Crear directorio de controladores: `controllers/[modulo]/`
2. Crear directorio de vistas: `views/[modulo]/[controller]/`
3. Crear `index_controller.php` dentro del módulo.
4. Actualizar `AdminController` si requiere permisos especiales.

### Servicio LAMP/WAMP
- **Iniciar**: Apache y MySQL desde XAMPP.
- **Acceso**: [http://localhost/kumbia/](http://localhost/kumbia/)
