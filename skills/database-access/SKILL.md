---
name: database-access
description: >
  Cómo acceder a la base de datos MariaDB/MySQL del proyecto, ejecutar scripts PHP, y gestionar la
  caché de metadatos de KumbiaPHP. Usar cuando se necesite consultar la BD, ejecutar migraciones
  o scripts de mantenimiento.
---

# Acceso a Base de Datos y Entorno

## Cuándo usar esta skill


- Al necesitar **consultar o modificar** la base de datos directamente.
- Al **ejecutar scripts** de mantenimiento PHP.
- Al **depurar** problemas de conexión o datos.
- Al añadir **nuevas columnas** a tablas (requiere limpiar caché).

---

## 1. Debug Controller — Método PREFERENTE ⭐

La forma más cómoda y recomendada de interactuar con la base de datos es mediante el **Debug Controller**
integrado en la aplicación. Permite ejecutar consultas SQL directamente desde el navegador, sin necesidad
de abrir WSL ni terminales adicionales.

### URL de acceso

```
http://localhost/agendator/admins/debug/query
```

### Requisitos previos

1. Hacer **login** en la aplicación con las credenciales de administrador:
   - **Usuario**: `admin`
   - **Contraseña**: `admin`
2. Navegar a la URL indicada arriba.

### Cómo funciona

- Controlador: `default/app/controllers/admins/debug_controller.php` (hereda de `AdminController`)
- Vista: `default/app/views/admins/debug/query.phtml`
- **Consultas SQL**: Permite ejecutar **cualquier sentencia SQL** (SELECT, INSERT, UPDATE, DELETE, ALTER, CALL, etc.).
- **Limpieza de Caché**: Permite limpiar la caché de KumbiaPHP mediante el método `limpiarCache()`.

### Instrucciones de Uso

1. **Acceso**: Diríjase a `/debug/query`.
2. **Seguridad**: Esta herramienta es solo para entornos de desarrollo y requiere estar logueado.
3. **Ejecución**:
   - **IMPORTANTE**: Borre siempre el contenido actual del textarea antes de pegar o escribir una nueva consulta para evitar fallos de sintaxis o ejecuciones accidentales.
   - Escriba su consulta SQL (SELECT, UPDATE, INSERT, etc.).
   - Pulse "Ejecutar Consulta".
4. **Caché**: Si realiza cambios estructurales (ALTER, CREATE), pulse "Limpiar Caché de Metadatos" para que KumbiaPHP reconozca los nuevos campos/tablas.

### Uso desde el agente IA

Para ejecutar consultas o limpiar caché, **abrir el navegador** en la URL correspondiente, haciendo login si es necesario (admin/admin).

> **⭐ PREFERIR SIEMPRE** este método sobre WSL/terminal para consultas rápidas, depuración y
> verificaciones de datos.

---

## 2. Acceso Alternativo vía WSL (Terminal)

Si el Debug Controller no está disponible (servidor caído, etc.), se puede acceder a la BD directamente
desde WSL.

### Conexión

```bash
# Entrar al terminal WSL
wsl -d Debian

# Acceso directo a MySQL
mysql -u root -pKumbian agendator
```

### Datos de conexión

| Parámetro     | Valor                                    |
|---------------|------------------------------------------|
| Host          | `127.0.0.1` (o `localhost` desde WSL)    |
| Puerto        | `3306`                                   |
| Usuario       | `root`                                   |
| Password      | `Kumbian`                                |
| Base de Datos  | `agendator`                              |

---

## 3. Estructura del Proyecto

| Ruta                              | Propósito                                           |
|-----------------------------------|-----------------------------------------------------|
| `C:\desarrollo\agendator`            | Raíz del proyecto                                   |
| `default/public`                  | Carpeta pública (scripts PHP de ejecución directa)  |
| `default/app/models/`             | Modelos ActiveRecord                                |
| `default/app/controllers/`        | Controladores                                       |
| `default/app/views/`              | Vistas PHTML                                        |
| `default/app/config/`             | Archivos de configuración                           |
| `sql/estructura.sql`              | Exportación del esquema completo de la BD           |

---

## 4. Ejecución de Scripts de Mantenimiento

Para ejecutar un script PHP rápido:

1. Colocarlo en `default/public/nombre_script.php`.
2. Acceder vía navegador a `http://localhost/agendator/nombre_script.php`.
3. **Nota**: Si el script requiere conexión a BD fuera del framework, usar `127.0.0.1` en el DSN de PDO.

---

## 5. Caché de Metadatos

KumbiaPHP cachea la estructura de las tablas en `default/app/temp/cache/`.

> **⚠️ IMPORTANTE**: Si añades una columna a una tabla y no aparece en los modelos, **limpia la caché** para que el framework reescanee la estructura.

### Métodos para limpiar caché:
1.  **Navegador (Recomendado)**: Acceder a `http://localhost/agendator/admins/debug/limpiarCache`.
2.  **Terminal (WSL)**: `rm -rf default/app/temp/cache/*`
3.  **Terminal (PowerShell)**: `Remove-Item -Path "c:\desarrollo\agendator\default\app\temp\cache\*" -Recurse -Force`

---

## 6. Credenciales de Prueba (Entorno Local)

| Parámetro   | Valor   |
|-------------|---------|
| Usuario     | `admin` |
| Contraseña  | `admin` |
| Permisos    | Acceso total a todos los módulos y divisiones |

---

## 7. Acceso Web Local

La aplicación es accesible en: [http://localhost/agendator/](http://localhost/agendator/)
