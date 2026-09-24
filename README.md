# NestJS con arquitectura hexagonal

API de práctica con autenticación JWT, contraseñas protegidas con Argon2id y persistencia en memoria.

## Arquitectura

```text
HTTP (controller, DTO, guard)
              |
              v
       application/AuthService
              |
              v
 ports (repositorio, hash, tokens, identificadores)
              ^
              |
 adapters (memoria, Argon2id, JWT, UUID)
```

Las capas `domain` y `application` no importan NestJS. `AuthModule` es el punto de composición: construye `AuthService` y `AuthGuard` mediante `useFactory` e inyecta sus puertos.

Dentro de cada feature, `infrastructure/adapters` contiene las implementaciones de
los puertos y `infrastructure/http` agrupa controladores, DTO, guards, filtros y
decoradores relacionados con el transporte HTTP.

Los nombres de archivo indican su función mediante un sufijo, por ejemplo
`.controller.ts`, `.service.ts`, `.dto.ts`, `.vo.ts`, `.entity.ts`, `.port.ts`,
`.adapter.ts`, `.guard.ts`, `.filter.ts`, `.decorator.ts`, `.module.ts` y
`.type.ts`. Las subcarpetas más específicas, como `dto`, se crean cuando agrupan
varios archivos relacionados.

## Configuración

```bash
cp .env.example .env
pnpm install
pnpm start:dev
```

Usa un valor aleatorio de al menos 32 caracteres para `JWT_SECRET`. En producción la aplicación no inicia si la variable no está configurada. La clave incluida para desarrollo local no debe usarse en producción.

## Decisiones de seguridad

- Todas las rutas requieren autenticación por defecto. `register` y `login` se marcan explícitamente como públicas.
- El JWT contiene solamente el identificador del usuario en `sub`, expira en 15 minutos y valida `issuer` y `audience`.
- Las contraseñas requieren entre 15 y 128 caracteres y se almacenan con Argon2id.
- Un usuario inexistente y una contraseña incorrecta recorren la verificación de hash y producen la misma respuesta.
- Hay rate limiting global, con límites más estrictos para registro y login.

## Endpoints

### Registrar un usuario

```http
POST /auth/register
Content-Type: application/json

{
  "name": "Carlos",
  "email": "carlos@example.com",
  "password": "a-secure-password"
}
```

### Iniciar sesión

```http
POST /auth/login
Content-Type: application/json

{
  "email": "carlos@example.com",
  "password": "a-secure-password"
}
```

Respuesta:

```json
{ "access_token": "eyJ..." }
```

### Consultar el perfil autenticado

```http
GET /auth/me
Authorization: Bearer eyJ...
```

## Verificación

```bash
pnpm build
pnpm lint
pnpm test
pnpm test:e2e
```

El repositorio en memoria pierde todos sus datos al reiniciar el proceso. Sustituirlo por otro adaptador no requiere cambiar el dominio ni `AuthService`.

El rate limiting también usa memoria local. Una aplicación con varias instancias necesita almacenamiento compartido, por ejemplo Redis.
