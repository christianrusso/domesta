# Domesta - Arquitectura y Documentación

## 📋 Resumen Ejecutivo

**Domesta** es un marketplace de dos lados que conecta personal doméstico con familias en Argentina. Se construyó el **MVP funcional** con:

- ✅ Sistema de autenticación (registro/login)
- ✅ Perfiles del personal doméstico con skills combinables
- ✅ Dashboard de búsqueda para clientes
- ✅ Sistema de mensajería con moderación anti-evasión
- ✅ Base de datos SQLite lista para producción

## 🏗️ Arquitectura

### Frontend
- **Framework**: Next.js 16 con App Router
- **Styling**: Tailwind CSS (mobile-first responsive)
- **State**: React hooks (useState, useEffect)
- **Auth**: JWT tokens en localStorage

### Backend
- **API**: Next.js API Routes
- **ORM**: Prisma + SQLite
- **Auth**: JWT + bcrypt
- **Validación**: Zod (implementar si se necesita)

### Base de Datos
```
User (clientes + personal)
├── DomesticProfile (solo si role=DOMESTIC)
│   ├── DomesticSkill[] (CLEANING, NANNY, COOKING)
│   ├── Availability[] (día/hora)
│   └── Conversation[]
├── Conversation[]
│   └── Message[]
├── CreditPackage[]
└── Review[] (futuro)
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── auth/
│   │   ├── login/page.tsx    # Login
│   │   └── register/page.tsx # Registro
│   ├── dashboard/page.tsx    # Panel cliente (búsqueda)
│   ├── profile/
│   │   ├── [id]/page.tsx     # Ver perfil de personal
│   │   └── setup/page.tsx    # Completar perfil
│   ├── messages/
│   │   └── [id]/page.tsx     # Chat
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   └── login/route.ts
│       ├── user/
│       │   └── profile/route.ts
│       ├── profiles/
│       │   ├── route.ts
│       │   ├── [id]/route.ts
│       │   └── complete/route.ts
│       ├── conversations/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       └── messages/route.ts
├── lib/              # (crear si se necesita)
└── components/       # (create compartidos si crece)

prisma/
├── schema.prisma     # Modelos de datos
└── migrations/       # Historial de cambios DB
```

## 🔐 Flujos de Autenticación

### Registro
1. POST `/api/auth/register` → Crea User + hash password + DomesticProfile (si DOMESTIC)
2. Retorna JWT token
3. Cliente redirige a `/dashboard`
4. Personal redirige a `/profile/setup`

### Login
1. POST `/api/auth/login` → Verifica email/password
2. Retorna JWT token
3. Token se guarda en localStorage
4. Se envía en header `Authorization: Bearer <token>` en cada request

### Middleware (TODO)
- Crear middleware en `src/middleware.ts` para proteger rutas
- Validar token JWT antes de permitir acceso

## 📊 Flujo de Datos - Ejemplo

### Cliente buscando personal
```
Cliente → GET /dashboard
  └─ Fetch /api/user/profile (obtiene datos usuario)
  └─ Fetch /api/profiles?limit=10 (listado de personal)
  └─ Click en perfil
    └─ GET /profile/[id]
      └─ Fetch /api/profiles/[id] (datos completos)
```

### Contactar personal
```
Cliente → Click "Enviar mensaje"
  └─ POST /api/conversations (crea o retorna existente)
  └─ Redirect a /messages/[conversationId]
  └─ POST /api/messages (envía mensaje)
    └─ Moderación detecta emails/teléfonos → isModeratorAlert=true
```

## 🔄 Moderación Anti-Evasión

**Función**: `detectContactInfo()` en `/api/messages/route.ts`

Detecta patrones:
- Emails: `user@domain.com`
- Teléfonos: `+54 11 1234 5678`
- WhatsApp: `whatsapp`, `wa.me`

Cuando detecta:
1. `isModeratorAlert = true`
2. Mensaje se envía pero con warning
3. Próximamente: bloquear hasta que compre créditos

## 📱 Responsive Design

Tailwind CSS mobile-first:
- `sm:` - 640px (tablets)
- `md:` - 768px (tablets grandes)
- `lg:` - 1024px (desktop)

Todas las páginas son responsivas por defecto.

## 🚀 Próximas Implementaciones

### Fase 2 (Búsqueda + Pagos)
1. **Búsqueda con IA**
   - Integrar OpenAI API
   - Convertir texto libre → filtros
   - Endpoint: POST `/api/search/ai`

2. **Sistema de Créditos**
   - Tabla CreditPackage (ya existe)
   - POST `/api/credits/purchase` → Mercado Pago
   - Validar créditos antes de desbloquear contacto

3. **Desbloquear Contacto**
   - POST `/api/contacts/unlock` → Gasta 1 crédito
   - Crea registro en tabla Contact
   - Muestra email/teléfono desbloqueado

### Fase 3 (Reputación + Admin)
1. **Sistema de Referencias**
   - POST `/api/reviews` → Cliente deja review
   - Doble confirmación
   - Insignias basadas en reviews

2. **Panel Administrativo**
   - GET `/api/admin/users`
   - PUT `/api/admin/users/[id]` (suspend/approve)
   - Estadísticas dashboard

## 🔧 Variables de Entorno

```bash
DATABASE_URL="file:./dev.db"          # SQLite local
JWT_SECRET="domesta-secret-key"        # Cambiar en producción
OPENAI_API_KEY="sk-..."               # Para búsqueda con IA (futuro)
MERCADO_PAGO_TOKEN="test_..."         # Para pagos (futuro)
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev                           # Inicia servidor

# Prisma
npx prisma migrate dev               # Crea migración
npx prisma studio                    # UI de base de datos
npx prisma generate                  # Regenera cliente

# Build
npm run build                        # Build para producción
npm run start                        # Inicia en producción

# Debug
npx prisma migrate resolve           # Resuelve conflictos
npx prisma migrate reset             # Limpia DB (⚠️ destructivo)
```

## 📈 Métricas a Trackear (futuro)

- Usuarios registrados (clientes vs personal)
- Búsquedas realizadas
- Conversaciones iniciadas
- Créditos comprados
- Tasa de conversión (búsqueda → contacto → compra crédito)

## ⚠️ Deuda Técnica Conocida

1. **Sin middleware de autenticación** → agregar `src/middleware.ts`
2. **Strings JSON en BD** → considerar JSON nativo si escala
3. **No hay validación Zod** → agregar schemas en rutas API
4. **localStorage** → considerar cookies httpOnly en producción
5. **Sin rate limiting** → agregar throttling en API
6. **Sin tests** → agregar jest + React Testing Library
7. **Errores genéricos** → mejorar mensajes de error

## 🔐 Seguridad - Checklist Producción

- [ ] Cambiar JWT_SECRET a algo fuerte
- [ ] Habilitar HTTPS
- [ ] Usar cookies httpOnly (no localStorage)
- [ ] Rate limiting en API
- [ ] CORS configurado correctamente
- [ ] Validación de inputs con Zod
- [ ] Sanitización contra XSS
- [ ] SQL injection protection (Prisma ya lo hace)
- [ ] CSRF tokens si hay forms
- [ ] Audit logging para admin actions

## 📞 Contacto para Preguntas

Christian Russo - crusso@clamaco.com.ar

Proyecto: Domesta MVP
Inicio: Junio 25, 2026
Estado: MVP Fase 1 Completo
