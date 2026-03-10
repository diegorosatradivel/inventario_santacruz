---
name: kumbiaphp-rest-api
description: Guía simplificada y kit reutilizable para crear APIs REST en KumbiaPHP, centrada en configuración, autenticación JWT, controladores REST y modelos ActiveRecord.
---

# Crear una API REST con KumbiaPHP: recursos verificados y patrones esenciales

## Resumen ejecutivo

KumbiaPHP incorpora un mecanismo específico para servicios REST basado en un controlador `RestController` (que a su vez se apoya en `KumbiaRest`) que reescribe la acción a ejecutar según el método HTTP (GET/POST/PUT/DELETE), determina el formato de salida por `Accept` (JSON/XML/CSV) y parsea el cuerpo de entrada en función de `Content-Type` (incluyendo JSON). Esto reduce mucho el “boilerplate”: el patrón dominante es “un controlador REST por recurso”, con métodos `getAll()`, `get($id)`, `post()`, `put($id)` y `delete($id)`.

Para una API moderna, las prácticas esenciales son:
1.  **Rutas personalizadas**: Prefijo `/api/v1/...` en `routes.php`.
2.  **Autenticación centralizada**: Validación de JWT en `RestController::initialize()`.
3.  **Modelos robustos**: Uso de `ActiveRecord` para CRUD y validaciones.
4.  **Respuestas estandarizadas**: JSON uniforme para datos y errores.

## Patrones fundamentales

### Flujo de petición REST

El `KumbiaRest` detecta el método HTTP y reescribe la acción automáticamente:

- `GET /recurso` → `getAll()`
- `GET /recurso/123` → `get($id)`
- `POST /recurso` → `post()`
- `PUT /recurso/123` → `put($id)`
- `DELETE /recurso/123` → `delete($id)`

El input JSON se parsea automáticamente y está disponible vía `$this->param()`.

### Estructura de archivos recomendada (Mínima)

| Ruta | Propósito |
|---|---|
| `composer.json` | Dependencias (`kumbia/framework` + librerías JWT) |
| `default/app/config/databases.php` | Configuración de conexión a BD |
| `default/app/config/config.php` | Habilitar `routes` |
| `default/app/config/routes.php` | Definición de rutas `/api/v1/...` |
| `default/app/libs/rest_controller.php` | Controlador base con auth JWT |
| `default/app/controllers/productos_controller.php` | Ejemplo de CRUD REST |
| `default/app/controllers/auth_controller.php` | Endpoint de login (público) |
| `default/app/models/producto.php` | Modelo ActiveRecord |
| `default/app/views/_shared/templates/json.phtml` | Template de salida JSON |

## Guía de implementación paso a paso

### 1. Instalación y Dependencias

Si partes de un proyecto nuevo:

```bash
composer create-project kumbia/framework mi-api
cd mi-api
composer require firebase/php-jwt
```

**`composer.json`** mínimo sugerido:

```json
{
    "require": {
        "php": ">=8.0",
        "kumbia/framework": "^1.2",
        "firebase/php-jwt": "^6.10"
    }
}
```

### 2. Configuración Esencial

**`default/app/config/config.php`**
Asegúrate de activar las rutas personalizadas:

```php
'routes' => '1',
```

**`default/app/config/databases.php`**
Configura tu acceso a datos (ejemplo MySQL):

```php
return [
    'development' => [
        'host' => 'localhost',
        'username' => 'root',
        'password' => '',
        'name' => 'mi_base_de_datos',
        'type' => 'mysql',
        'charset' => 'utf8',
    ],
    // ... production
];
```

**`default/app/config/routes.php`**
Mapea tus recursos a la API:

```php
return [
    'routes' => [
        // Auth
        '/api/v1/auth' => 'auth/index',
        
        // Recursos
        '/api/v1/productos' => 'productos/index',
        '/api/v1/productos/*' => 'productos/*',
    ],
];
```

### 3. Controlador Base (Auth y Formato)

Crea `default/app/libs/rest_controller.php` para centralizar la lógica de JWT.

```php
<?php

require_once CORE_PATH . 'kumbia/kumbia_rest.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class RestController extends KumbiaRest
{
    protected array $publicControllers = ['auth'];

    final protected function initialize()
    {
        // 1. Permitir acceso público a ciertos controladores
        if (in_array($this->controller_name, $this->publicControllers, true)) {
            return true;
        }

        // 2. Validar Header Authorization
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $m)) {
            $this->data = $this->error('Token no encontrado', 401);
            return false;
        }

        // 3. Decodificar JWT
        try {
            $secret = getenv('APP_JWT_SECRET') ?: 'tu_secreto_aqui';
            $this->jwt = JWT::decode($m[1], new Key($secret, 'HS256'));
        } catch (Throwable $e) {
            $this->data = $this->error('Token inválido', 401);
            return false;
        }

        return true;
    }

    // Helper para respuestas de error consistentes
    protected function error(string $msg, int $code = 400)
    {
        http_response_code($code);
        return ['error' => ['message' => $msg, 'status' => $code]];
    }
}
```

### 4. Template JSON

Asegura que `default/app/views/_shared/templates/json.phtml` exista y devuelve JSON puro:

```php
<?php
header('Content-Type: application/json; charset=utf-8');
if (isset($data)) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} else {
    echo '{}';
}
```

### 5. Ejemplo de CRUD: Productos

**Modelo (`default/app/models/producto.php`):**

```php
<?php
class Producto extends ActiveRecord
{
    public function initialize() {
        $this->validates_presence_of('nombre');
    }
}
```

**Controlador (`default/app/controllers/productos_controller.php`):**

```php
<?php
class ProductosController extends RestController
{
    public function getAll()
    {
        // Paginación simple integrada en ActiveRecord
        $page = (int)($_GET['page'] ?? 1);
        $this->data = (new Producto)->paginate("page: $page");
    }

    public function get($id)
    {
        $item = (new Producto)->find((int)$id);
        if (!$item) {
            $this->data = $this->error('No encontrado', 404);
            return;
        }
        $this->data = $item; // O usa un método ->toArray() si prefieres filtrar campos
    }

    public function post()
    {
        $body = $this->param(); // Kumbia parsea el JSON aquí
        $item = new Producto($body);
        
        if ($item->save()) {
            http_response_code(201);
            $this->data = $item;
        } else {
            $this->data = $this->error('Error de validación', 422);
        }
    }

    public function put($id)
    {
        $item = (new Producto)->find((int)$id);
        if (!$item) {
            $this->data = $this->error('No encontrado', 404);
            return;
        }

        $body = $this->param();
        if ($item->update($body)) {
            $this->data = $item;
        } else {
            $this->data = $this->error('No se pudo actualizar', 422);
        }
    }

    public function delete($id)
    {
        if ((new Producto)->delete((int)$id)) {
            http_response_code(204);
        } else {
            $this->data = $this->error('No se pudo eliminar', 404);
        }
    }
}
```

### 6. Endpoint de Autenticación (Login)

**`default/app/controllers/auth_controller.php`**:

```php
<?php
use Firebase\JWT\JWT;

class AuthController extends RestController
{
    public function post()
    {
        $body = $this->param();
        $user = $body['user'] ?? '';
        $pass = $body['pass'] ?? '';

        // Validar credenciales (Ejemplo estático)
        if ($user !== 'admin' || $pass !== '1234') {
            $this->data = $this->error('Credenciales incorrectas', 401);
            return;
        }

        // Generar Token
        $now = time();
        $payload = [
            'sub' => $user,
            'iat' => $now,
            'exp' => $now + 3600 // 1 hora
        ];

        $token = JWT::encode($payload, getenv('APP_JWT_SECRET') ?: 'tu_secreto_aqui', 'HS256');

        $this->data = [
            'access_token' => $token,
            'expires_in' => 3600
        ];
    }
}
```

## Checklist de Seguridad para Producción

- [ ] Cambiar el secreto de JWT por una variable de entorno real.
- [ ] Activar modo producción en `config.php` (`debug` => `Off`).
- [ ] Asegurar que el servidor web redirija todas las peticiones al `index.php` (Rewrite rules).
- [ ] Validar siempre el input `$this->param()` antes de pasarlo al modelo.
