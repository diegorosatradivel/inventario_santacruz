---
name: kumbiaphp-development
description: >
  Guía completa de desarrollo con KumbiaPHP para el proyecto GAO. Cubre stack tecnológico, estructura
  de directorios, patrones de controladores, modelos ActiveRecord, vistas PHTML, helpers, notificaciones,
  seguridad, generación de PDFs, logging y convenciones de nombrado. Usar siempre que se vaya a crear
  o modificar código PHP, vistas o modelos en el proyecto.
---

# Desarrollo con KumbiaPHP en GAO

## Cuándo usar esta skill

- Al **crear o modificar** cualquier controlador, modelo o vista del proyecto.
- Al **necesitar ejemplos** de patrones comunes (CRUD, AJAX, DataTables, PDFs, etc.).
- Al **nombrar** archivos, clases, tablas o columnas.
- Al **implementar** notificaciones, seguridad, logging o helpers.

---

## 1. Stack Tecnológico

- **Framework**: KumbiaPHP (incluido en `core/`)
- **PHP**: >= 7.4
- **Base de datos**: MariaDB/MySQL
- **Frontend**: AdminLTE 3, Bootstrap 4, jQuery, DataTables
- **Dependencias**: mPDF (PDFs), PhpSpreadsheet/OpenSpout (Excel), PHPMailer (emails)

---

## 2. Estructura de Directorios

```
default/app/
├── controllers/          # Controladores por módulo
│   ├── admins/          # Módulo administración
│   ├── avancedeobra/    # Módulo principal
│   ├── producciones/    # Módulo producción
│   ├── ofertas/         # Módulo ofertas
│   └── [nuevo_modulo]/  # Nuevos módulos aquí
├── models/              # Modelos ActiveRecord
├── views/               # Vistas PHTML
│   ├── [modulo]/[controller]/
│   └── _shared/         # Partials y scaffolds compartidos
│       ├── partials/gao/  # Partials específicos de GAO
│       └── scaffolds/     # Plantillas scaffold
├── libs/                # Clases auxiliares y controladores base
├── config/              # Configuración (routes, config, etc.)
└── temp/cache/          # Caché de metadatos de tablas (borrar si se añade columna nueva)
```

---

## 3. Filosofía: Convention over Configuration

KumbiaPHP sigue estrictamente el patrón MVC. Si sigues las convenciones de nombres, el framework hace el
trabajo automáticamente (carga de vistas, mapeo de rutas, etc.).

- **Modelos** → `default/app/models/` (lógica de negocio y acceso a datos)
- **Controladores** → `default/app/controllers/` (orquestación)
- **Vistas** → `default/app/views/` (presentación)

---

## 4. Patrones de Controladores

### 4.1 Herencia de Controladores

```php
// Controlador normal con seguridad
class MiController extends AdminController {
    // AdminController proporciona:
    // - $this->usuario (usuario activo)
    // - Verificación de sesión
    // - Control de permisos por módulo
}

// Controlador CRUD automático
class EntidadesController extends JscaffoldController {
    public string $model = 'entidades';  // Nombre del modelo
    public string $scaffold = 'SFadmin'; // Carpeta de plantillas
}
```

### 4.2 Convenciones de Acciones

```php
// Listado con paginación
public function index($page = 1) {
    $this->title = "Listado de elementos";
    $this->data = (new $this->model)->paginate("page: $page", 'order: id desc');
}

// Crear registro
public function crear() {
    $this->title = "Crear elemento";
    if (Input::hasPost("elemento")) {
        $obj = new elemento();
        if (!$obj->save(Input::post("elemento"))) {
            Flash::error('Error al guardar');
            $this->elemento = $obj;
            return;
        }
        Redirect::toAction("ver/$obj->id");
    }
    $this->elemento = new elemento();
}

// Ver/Editar registro
public function ver(int $id) {
    $this->title = "Editar elemento $id";
    $this->elemento = (new elemento())->find((int)$id);

    // Seguridad por división
    if (!usuarios::perteneceAladivision($division)) {
        Toast::error("Error de acceso", "Sin permisos");
        return Redirect::to("modulo/gestion/index");
    }

    if (Input::hasPost("elemento")) {
        if ($this->elemento->update(Input::post("elemento"))) {
            Toast::success("Guardado correctamente");
            Redirect::toAction("ver/$id");
        }
    }
}

// Respuestas JSON/AJAX
public function jsonDatos() {
    View::select(null, null); // Sin vista ni template
    echo json_encode($datos);
}
```

### 4.3 Filtro Before

```php
function before_filter() {
    if (Input::isAjax())
        View::template(null);
}
```

---

## 5. Paso de Datos

### 5.1 Controlador → Vista

Asignar a `$this->variable` en el controlador la convierte automáticamente en `$variable` en la vista:

```php
// Controlador
public function show($slug) {
    $this->programa = Load::model('programas')->find_by_slug($slug);
    $this->titulo_pagina = "Detalle de " . $this->programa->titulo;
}
```

```php
<!-- Vista views/programas/show.phtml -->
<h1><?php echo $titulo_pagina ?></h1>
<p><?php echo $programa->descripcion ?></p>
```

### 5.2 Vista → Partial

**A) Paso explícito (recomendado):**
```php
<?php View::partial('bloque_noticias', false, ['noticias' => $noticias_destacadas]) ?>
```

**B) Recuperación global:**
```php
<?php $redes = View::getVar('rrss'); ?>
```

---

## 6. Modelos ActiveRecord

### 6.1 Estructura Básica

```php
<?php
class ofertas extends ActiveRecord {

    // Relaciones
    public $belongs_to = [
        'clientes' => ['model' => 'clientes'],
        'divisiones' => ['model' => 'divisiones']
    ];

    public $has_many = [
        'lineas_oferta' => ['model' => 'lineas_oferta', 'fk' => 'ofertas_id']
    ];

    // Inicialización
    public function initialize() {
        // Configuración inicial
    }

    // Hooks de ciclo de vida
    public function before_create() {
        $this->creacion_at = date("Y-m-d H:i:s");
        // IMPORTANTE:
        // No retornar nada (null) si todo va bien.
        // Se debe retornar la cadena "cancel" para abortar la operación.
        // En esta versión de KumbiaPHP, retornar false NO aborta la operación.
    }

    public function before_update() {
        $this->modificacion_in = date("Y-m-d H:i:s");
    }

    // Getters para relaciones
    public function getClientes() {
        return (new clientes())->find($this->clientes_id);
    }

    // Cálculos
    public function getTotalLineas() {
        return (new lineas_oferta())->sum("importe", "ofertas_id = $this->id");
    }
}
```

### 6.2 Consultas Comunes

```php
// Buscar todos
$items = $this->find("es_visible = 1", "order: created_at DESC");

// Buscar uno por ID
$item = $this->find(15);

// Buscar el primero con condición
$item = $this->find_first("slug = '$slug'");

// Paginación
$page = $this->paginate("page: 1", "per_page: 10", "conditions: status='active'");
```

### 6.3 Validaciones en Hooks

```php
public function before_update() {
    // Validar estado permite cambios
    if (!$this->sePermitenCambios()) {
        Flash::error("No se permiten cambios en este estado");
        return false;
    }
    // No retornar nada si todo OK
}
```

### 6.4 Buenas Prácticas

Encapsular lógica en el modelo, NO en el controlador:

```php
// ❌ MAL (en Controlador)
$recientes = Load::model('noticias')->find("fecha > NOW()", "limit: 5");

// ✅ BIEN (en Modelo)
public function getRecientes($limite = 5) {
    return $this->find("fecha > NOW()", "limit: $limite");
}
```

---

## 7. Patrones de Vistas (PHTML)

### 7.1 Formulario con Card

```php
<?php echo Form::open(); ?>
<?php echo Form::hidden("elemento.id"); ?>

<section class="content">
    <div class="row">
        <div class="col-md-12">
            <div class="card card-primary">
                <div class="card-header">
                    <h3 class="card-title">Título</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-12 col-sm-3">
                            <?= Bs::formateandoBS("Etiqueta", "",
                                Form::text("elemento.campo", "class='form-control'")); ?>
                        </div>
                        <div class="col-12 col-sm-3">
                            <?= Bs::formateandoBS("Select", "",
                                Form::dbSelect("elemento.estados_id", null, null, null,
                                    "class='form-control'")); ?>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <a href="<?= PUBLIC_PATH ?>modulo/controller" class="btn btn-secondary">Volver</a>
                    <input type="submit" value="Guardar" class="btn btn-success float-right">
                </div>
            </div>
        </div>
    </div>
</section>
<?php echo Form::close(); ?>
```

### 7.2 Pestañas con Partials

```php
<div class="card">
    <div class="card-header d-flex p-0">
        <ul class="nav nav-pills p-1">
            <li class="nav-item">
                <a class="nav-link active" href="#tab1" data-toggle="tab">Tab 1</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#tab2" data-toggle="tab">Tab 2</a>
            </li>
        </ul>
    </div>
    <div class="card-body">
        <div class="tab-content">
            <div class="tab-pane active" id="tab1">
                <?php View::partial("gao/miPartial", false, ["data" => $data]); ?>
            </div>
            <div class="tab-pane" id="tab2">
                <!-- Contenido -->
            </div>
        </div>
    </div>
</div>
```

### 7.3 Modales de Confirmación

```php
<?= Bs::nuevomodalSiNoAEnlace(
    $registro->id,                                    // ID único
    "<span class='btn btn-danger'>Eliminar</span>",   // Botón
    "Confirmación",                                    // Título modal
    "¿Está seguro de eliminar?",                      // Mensaje
    "modulo/controller/eliminar/$registro->id",       // URL destino
    "Eliminar",                                        // Texto botón confirmar
    "",                                                // Clase extra
    "auxbotonsi="                                      // Parámetros extra
); ?>
```

### 7.4 DataTables

```php
<table id="miTabla" class="table table-bordered table-striped dataTable">
    <thead>
        <tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr>
    </thead>
    <tbody>
        <?php foreach ($registros as $r): ?>
        <tr>
            <td><?= $r->id ?></td>
            <td><?= $r->nombre ?></td>
            <td><?= Html::linkAction("ver/$r->id", "Ver", ["class" => "btn btn-sm btn-info"]) ?></td>
        </tr>
        <?php endforeach; ?>
    </tbody>
</table>

<script>
$(document).ready(function() {
    $('#miTabla').DataTable({
        "language": { "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json" }
    });
});
</script>
```

---

## 8. Helpers (Html, Tag, Form)

```php
// Enlaces
echo Html::link('contacto', 'Contáctanos', 'class="btn btn-primary"');
echo Html::link('noticias/ver/' . $item->slug, 'Leer más');
echo Html::linkAction('index', 'Volver al listado');

// Assets
echo Tag::css('estilos_propios'); // public/css/estilos_propios.css
echo Tag::js('main');             // public/javascript/main.js

// Imágenes
echo Html::img('logo.png', 'Logo de la empresa', 'class="img-fluid"');
```

---

## 9. Notificaciones

```php
// Notificaciones Toast (visual, no persisten tras redirect)
Toast::success("Operación exitosa");
Toast::error("Título error", "Descripción del error");
Toast::warning("Título", "Mensaje de alerta");
Toast::info("Información");

// Notificaciones Flash (persisten en sesión tras redirect)
Flash::error("Error grave");
Flash::valid("Operación completada");
Flash::info("Información");
```

---

## 10. Seguridad

```php
// Verificar permisos en controlador
if (!$this->usuario->tienePermiso()) {
    Redirect::to("index/index");
    exit;
}

// Verificar división
if (!usuarios::perteneceAladivision($division_id)) {
    Toast::error("Sin permisos");
    Logger::error("Acceso no autorizado", "SEGURIDAD");
    return Redirect::to("modulo/index");
}

// Sanitización
$dato = utils::limpiarCadena(Input::post("campo"));
$id = (int) $id; // Siempre castear IDs
```

---

## 11. Generación de PDFs

```php
use Mpdf\Mpdf;

public function generarPdf(int $id) {
    $elemento = (new elemento())->find($id);
    $html = View::partial("pdf/mi_template", false, ["elemento" => $elemento], true);

    $mpdf = new Mpdf(['tempDir' => APP_PATH . 'temp']);
    $mpdf->WriteHTML($html);
    $mpdf->Output("documento.pdf", "D"); // D=Download, I=Inline

    View::select(null, null);
}
```

---

## 12. Logging

```php
Log::loggear("CATEGORIA");
Log::loggear("OFERTAS", "Oferta creada: $oferta->id", $oferta->id);
Logger::error("Mensaje de error", "CATEGORIA");
```

---

## 13. Rutas y Redirecciones

```php
// config/routes.php
return [
    'routes' => [
        '/' => 'home/index',
        '/quienes-somos' => 'paginas/nosotros',
        '/producto/*' => 'productos/ver/*',
    ]
];

// Redirecciones en controladores
return Redirect::to('login/ingresar');
Redirect::toAction("ver/$id");
```

---

## 14. Constantes Útiles

- `PUBLIC_PATH`: Ruta raíz pública del proyecto (ej. `/kumbia/`).
- `APP_PATH`: Ruta al directorio `app`.

---

## 15. Convenciones de Nombrado

| Elemento           | Convención                | Ejemplo                                  |
|--------------------|---------------------------|------------------------------------------|
| Tablas BD          | snake_case plural         | `ofertas`, `lineas_oferta`               |
| Modelos            | snake_case igual que tabla | `class ofertas extends ActiveRecord`     |
| Controladores      | CamelCase + Controller    | `OfertasController`                      |
| Archivos controller | snake_case_controller.php | `ofertas_controller.php`                 |
| Vistas             | snake_case.phtml          | `ver.phtml`, `crear.phtml`               |
| Foreign keys       | tabla_singular_id         | `clientes_id`, `estados_id`              |
| Timestamps         | creacion_at, modificacion_in |                                        |

---

## 16. Crear un Módulo Nuevo

1. **Crear directorio de controladores**: `controllers/[modulo]/`
2. **Crear directorio de vistas**: `views/[modulo]/[controller]/`
3. **Crear controlador index**: `[modulo]/index_controller.php`
4. **Actualizar AdminController** si requiere permisos especiales.

---

## 17. Patrones Comunes

### Selector Ajax de Obras
```javascript
$('#select_division').change(function() {
    $.get('<?= PUBLIC_PATH ?>modulo/controller/jsonObras/' + $(this).val(), function(data) {
        $('#select_obra').html(data);
    });
});
```

### Autocomplete
```php
<?php View::partial("recursos/autocomplete", false, [
    "idcampo" => "oferta_cliente",
    "tabla" => "clientes",
    "campo" => "nombre",
    "longMinima" => "3"
]); ?>
```

### Datepicker
```php
<?php View::partial("recursos/datapicker_FechaInglesa", false, [
    "datepicker" => "oferta_fecha"
]); ?>
```

---

## 18. Reglas de Oro

1. **Siempre usar `(int)` o `(float)`** al recibir IDs o números de parámetros.
2. **Verificar permisos** antes de mostrar o modificar datos sensibles.
3. **Usar Toast** para feedback inmediato al usuario.
4. **Usar Flash** para errores que deben persistir después de redirect.
5. **Los modelos NO deben retornar nada** en hooks `before_*` si todo va bien (null). Se debe retornar
   explícitamente la cadena `"cancel"` si se desea abortar la operación.
6. **`View::select(null, null)`** para respuestas JSON/AJAX.
7. **Usar partials** para código reutilizable en vistas.
8. **Preferir `Html::link`** sobre etiquetas `<a>` hardcodeadas.
9. **Leer los modelos existentes** antes de inventar consultas SQL.
10. **Respetar MVC**: Lógica en Modelos, Orquestación en Controladores, HTML en Vistas.
