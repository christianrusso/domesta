# 🎨 Domesta - Guía de Diseño

## Logo
**D Estilizada Moderna**
- Minimalista y profesional
- Gradiente Indigo → Purple
- Versión con texto incluida

Ver: `src/components/Logo.tsx`

## Colores
```
Primario: Indigo #4F46E5
Secundario: Purple #7C3AED
Success: Emerald #10B981

Fondo: Slate-950 a Purple-900 (degradado)
Texto: White/Gray-300
Borders: White/10
```

## Tipografía
- **Headings**: Bold, Large (h1: 48-56px)
- **Body**: Regular, Medium (16px)
- **Buttons**: Semibold (14-16px)

## Componentes Reutilizables

### Button
```tsx
<Button variant="primary" size="md">
  Registrarse
</Button>
```

Variantes: `primary` | `secondary` | `danger` | `outline`
Tamaños: `sm` | `md` | `lg`

### Card
```tsx
<Card hoverable gradient>
  <CardBody>Contenido</CardBody>
</Card>
```

### Container
```tsx
<Container size="lg">
  Contenido centrado
</Container>
```

## Estilos Aplicados

### Landing Page
- ✅ Fondo degradado oscuro (dark mode)
- ✅ Hero section con tipografía grande
- ✅ Gradientes en textos destacados
- ✅ Cards con efecto hover y scale
- ✅ Sombras con color púrpura

### Tema General
- ✅ Colores personalizados en Tailwind
- ✅ Componentes consistentes
- ✅ Efecto glassmorphism en nav
- ✅ Gradientes en botones

## Archivo de Tema
`src/lib/theme.ts` - Centraliza colores y estilos

## Próximas Mejoras
- [ ] Animaciones en scroll
- [ ] Transiciones de página
- [ ] Modo oscuro/claro toggle
- [ ] Iconografía personalizada
- [ ] Sistema de notificaciones diseñado

## Mobile Responsive
Todos los componentes son mobile-first con breakpoints:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
