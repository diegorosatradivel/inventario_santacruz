---
name: agendator-data-models
description: >
  Documentación de los modelos de datos principales del proyecto AGENDATOR, sus relaciones, validaciones,
  reglas de negocio compartidas, y las utilidades/librerías internas. Usar cuando se necesite entender
  la estructura de datos, relaciones entre modelos, o las librerías auxiliares disponibles.
---

# Modelos de Datos AGENDATORy Utilidades de GAO

## Cuándo usar esta skill

- Al necesitar **entender relaciones** entre tablas/modelos antes de implementar funcionalidad.
- Al **crear nuevos modelos** y necesitar conocer las convenciones.
- Al **depurar** problemas de validación o de persistencia.
- Al necesitar **usar utilidades** como Toast, Mail, Log, Utils.
- Antes de **escribir SQL crudo** — revisar si ya existe un método en los modelos.

---

## 1. Usuarios y Seguridad

- **`usuarios`**: Autentica y mantiene la relación con divisiones mediante tablas de enlace. Define
  utilidades para recuperar divisiones permitidas y validar permisos antes de cada acción.
- **`divisiones`**: Agrupa obras, calcula el siguiente periodo de producción y genera PDFs con informes
  por división. Expone listados de expedientes y conversión a JSON para formularios dinámicos.
- **`divisionesusuarios`**: Tabla puente que facilita consultas con información de la división.
- **`permisos`**: Trabaja junto a `usuarios::tienePermiso()` para restringir accesos en AdminController.

---

## 2. Obras y Expedientes

- **`obras`**: Relación `has_many` con expedientes y helpers para componer filtros con seguridad por
  división; agrega totales por tipo de documento y periodo.
- **`expedientes`**: Entidad más rica del dominio. Controla asociaciones con producciones, materiales,
  certificaciones, facturas, adjuntos y pedidos; valida estados, fechas y cambios antes de persistir.
  Sincroniza oficiales vinculados y calcula códigos secuenciales.

---

## 3. Producción y Facturación

- **`producciones`**: Asegura que solo se modifiquen expedientes en estados válidos, actualiza
  automáticamente el estado del expediente y guarda el usuario que registra la operación.
- **`facturas`**: Aplica validaciones de fecha mínima por división, registra cambios y prohíbe
  operaciones en expedientes bloqueados.
- **`certificaciones`**: Comparte la misma lógica de seguridad que facturas y mantiene historial de
  cambios.

---

## 4. Pedidos y Documentación

- **`pedidos`**: Importa PDFs (Iberdrola), extrae campos mediante utilidades `Parseo`, sugiere
  divisiones por código postal y detecta duplicados.
- **`adjuntos`**: Ofrece rutas públicas normalizadas para ficheros asociados a expedientes, coste o
  mediciones.

---

## 5. Regla Compartida: Control de Cambios

Antes de crear o actualizar cualquier documento relacionado con expedientes, se consulta
`expedientes::sePermitenCambios()` para evitar modificaciones sobre estados bloqueados.

Modelos que implementan esta verificación:
- `producciones`
- `facturas`
- `certificaciones`

---

## 6. Persistencia y Base de Datos

- `sql/estructura.sql` contiene la exportación de todas las tablas (adjuntos, certificaciones, clientes,
  costes, etc.), útil para alinear el esquema local con la lógica del código.
- Muchos informes usan **procedimientos almacenados** (`ObtenerDatosPeriodos`, `ObtenerDatosPeriodosTotal`)
  ejecutados a través de `Lite::all`, por lo que al depurar es importante revisar tanto PHP como las
  rutinas en la base de datos.

---

## 7. Controladores Base

- **`AdminController`**: Inicializa `$this->usuario`, registra actividad mediante `Log::loggear` y aplica
  reglas de acceso por módulo (producciones, admins) redirigiendo según perfil y permisos. Todo controlador
  de negocio debe heredar de esta clase.
- **`JscaffoldController`** y **`ScaffoldController`**: Proveen CRUD automático para tablas maestras,
  utilizados extensamente en el módulo `admins`.

---

## 8. Utilidades y Helpers de Dominio

### Utils
Colección amplia de funciones:
- Sanitización: `limpiaCadena()`, `limpiarCadena()`, `limpiarContraseña()`
- Generación de contraseñas seguras
- Depuración: `debuga()`, `imprimirEnComentario()`

### Toast
Wrapper para lanzar notificaciones Toastr desde PHP:
```php
Toast::error("Título", "Mensaje");
Toast::success("Operación exitosa");
Toast::info("Información");
Toast::warning("Título", "Alerta");
```

### Mail
Encapsula PHPMailer y carga configuración desde `config/mail.ini`, incluyendo overrides para entornos
de desarrollo.

### Log (modelo)
Guarda trazas de navegación y cambios de registros, ignorando rutas concretas para evitar ruido.

### LiteRecord
Adapta `Kumbia\ActiveRecord\LiteRecord` para ejecutar SQL raw y procedimientos almacenados, utilizado
en informes y exportaciones:
```php
$datos = Lite::all("CALL ObtenerDatosPeriodos(:division, :periodo)", [
    ':division' => $division_id,
    ':periodo' => $periodo
]);
```

---

## 9. Notas de Uso

- Antes de introducir nuevas consultas SQL crudas, considerar reutilizar `Lite::all()` o los métodos
  disponibles en los modelos existentes para mantener la lógica de seguridad.
- Las notificaciones visuales deben invocar `Toast` para mantener consistencia en la interfaz.
- En procesos automatizados, complementar con `Log::loggear`.
