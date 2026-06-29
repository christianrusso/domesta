# Domesta - Marketplace de Personal Doméstico

Una plataforma moderna que conecta a personal doméstico con familias que necesitan contratar servicios en Argentina.

## 🚀 Características principales del MVP

### Para Clientes (Familias)
- ✅ Registro e inicio de sesión
- ✅ Búsqueda de personal con filtros básicos
- ✅ Ver perfiles completos de personal doméstico
- ✅ Mensajería gratuita (3 primeros mensajes)
- ✅ Moderación anti-evasión de pago (detecta datos de contacto)
- ⏳ Próximamente: Búsqueda con IA en lenguaje natural
- ⏳ Próximamente: Sistema de créditos y pagos

### Para Personal Doméstico
- ✅ Registro completo con perfil
- ✅ Múltiples skills combinables (limpieza, niñera, cocina)
- ✅ Disponibilidad y tarifa por hora
- ✅ Características personales e idiomas
- ✅ Recibir mensajes de clientes

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 16 + React + Tailwind CSS
- **Backend**: Next.js API Routes + Node.js
- **Base de datos**: SQLite (desarrollo)
- **Autenticación**: JWT + bcrypt
- **ORM**: Prisma
- **Idioma**: TypeScript

## 📦 Cómo empezar

```bash
cd domesta-app
npm install
npx prisma migrate dev
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚀 Próximos pasos

1. **Prueba el flujo de registro** como cliente y personal doméstico
2. **Completa tu perfil** si registras como personal
3. **Busca y contacta** otros perfiles
4. **Envía mensajes** (los primeros 3 son gratis)

## 📝 Características por Fase

- **MVP Fase 1** (Actual): Registro, búsqueda básica, mensajería
- **MVP Fase 2**: Búsqueda con IA, sistema de créditos, pagos
- **MVP Fase 3**: Panel admin, referencias, verificación de identidad
