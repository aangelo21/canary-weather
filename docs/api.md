# CanaryWeather API Documentation

## Swagger UI

La documentación interactiva de la API está disponible en: **http://localhost:85/api-docs**

### Características

- 📚 **Documentación completa** de todos los endpoints
- 🔐 **Autenticación JWT** integrada
- 🧪 **Pruebas en vivo** de la API
- 📋 **Esquemas de datos** detallados
- ✅ **Validación de requests** y responses

## Cómo Usar la Autenticación en Swagger

### Paso 1: Crear una Cuenta o Iniciar Sesión

#### Opción A: Registrar un Nuevo Usuario

1. Ve a la sección **Authentication** en Swagger UI
2. Expande el endpoint `POST /api/users` (Register new user)
3. Haz clic en "Try it out"
4. Completa el JSON con tus datos:
   ```json
   {
     "email": "tu@email.com",
     "username": "tunombre",
     "password": "tucontraseña"
   }
   ```
5. Haz clic en "Execute"
6. En la respuesta, **copia el valor del campo `token`**

#### Opción B: Iniciar Sesión con Usuario Existente

1. Ve a la sección **Authentication** en Swagger UI
2. Expande el endpoint `POST /api/users/login` (Login user)
3. Haz clic en "Try it out"
4. Completa el JSON:
   ```json
   {
     "username": "tunombre",
     "password": "tucontraseña"
   }
   ```
5. Haz clic en "Execute"
6. En la respuesta, **copia el valor del campo `token`**

### Paso 2: Autorizar en Swagger

1. Haz clic en el botón **"Authorize"** 🔓 (arriba a la derecha en Swagger UI)
2. En el campo "Value", pega tu token en el formato:
   ```
   Bearer <tu-token-aquí>
   ```
   Ejemplo:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Haz clic en "Authorize"
4. Cierra el modal

### Paso 3: Usar Endpoints Protegidos

Ahora puedes usar cualquier endpoint que requiera autenticación. Los endpoints protegidos tienen un icono de candado 🔒.

**Ejemplo**: Obtener tu perfil de usuario

1. Expande `GET /api/users/me`
2. Haz clic en "Try it out"
3. Haz clic en "Execute"
4. Verás tu información de usuario en la respuesta

## Endpoints Disponibles

### 🔐 Authentication

- `POST /api/users` - Registrar nuevo usuario (devuelve token)
- `POST /api/users/login` - Iniciar sesión (devuelve token)
- `POST /api/users/logout` - Cerrar sesión
- `POST /api/users/refresh-token` - Renovar token JWT

### 👤 Users

- `GET /api/users/me` - Obtener usuario actual 🔒
- `GET /api/users` - Listar todos los usuarios 🔒
- `GET /api/users/{id}` - Obtener usuario por ID 🔒
- `PUT /api/users/{id}` - Actualizar usuario 🔒
- `DELETE /api/users/{id}` - Eliminar usuario 🔒
- `GET /api/users/municipalities` - Obtener municipios

### 📍 Points of Interest

- `GET /api/pois` - Listar POIs
- `GET /api/pois/personal` - POIs personales 🔒
- `GET /api/pois/{id}` - Obtener POI por ID
- `POST /api/pois` - Crear POI 🔒
- `PUT /api/pois/{id}` - Actualizar POI 🔒
- `DELETE /api/pois/{id}` - Eliminar POI 🔒

### ⚠️ Alerts

- `GET /api/alerts` - Listar alertas
- `GET /api/alerts/{id}` - Obtener alerta por ID
- `POST /api/alerts` - Crear alerta
- `PUT /api/alerts/{id}` - Actualizar alerta
- `DELETE /api/alerts/{id}` - Eliminar alerta
- `POST /api/alerts/fetch` - Obtener alertas externas

### 🔔 Notifications

- `GET /api/notifications` - Listar notificaciones 🔒
- `GET /api/notifications/{id}` - Obtener notificación 🔒
- `GET /api/notifications/user/{userId}` - Notificaciones por usuario 🔒
- `POST /api/notifications` - Crear notificación 🔒
- `PUT /api/notifications/{id}` - Actualizar notificación 🔒
- `DELETE /api/notifications/{id}` - Eliminar notificación 🔒

### 📍 User Locations

- `GET /api/user-locations/{userId}` - Ubicaciones del usuario 🔒
- `POST /api/user-locations/{userId}` - Añadir ubicación 🔒
- `DELETE /api/user-locations/{userId}/{locationId}` - Eliminar ubicación 🔒

### 👨‍💼 Admin

- `GET /admin` - Dashboard de administración (requiere sesión y admin)
- `POST /admin/poi` - Crear POI global (admin)
- `POST /admin/poi/{id}/update` - Actualizar POI (admin)
- `POST /admin/poi/{id}/delete` - Eliminar POI (admin)
- `POST /admin/users` - Crear usuario (admin)
- `POST /admin/users/{id}/update` - Actualizar usuario (admin)
- `POST /admin/users/{id}/delete` - Eliminar usuario (admin)

## Notas Importantes

### Duración del Token

- Los tokens JWT tienen una duración de **15 minutos**
- Usa el endpoint `/api/users/refresh-token` para obtener un nuevo token sin volver a iniciar sesión

### Tipos de Autenticación

- **JWT Bearer Token**: Para endpoints de la API (`/api/*`)
- **Session Cookie**: Para endpoints de administración (`/admin/*`)

### Esquemas de Datos

Todos los esquemas están documentados en Swagger UI, incluyendo:

- User
- Location
- PointOfInterest
- Alert
- Notification

## OpenAPI Specification

La especificación OpenAPI en formato JSON está disponible en: **http://localhost:85/api-docs.json**
