import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY no configurada' },
        { status: 500 }
      );
    }

    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query requerida' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente EXPERTO en interpretar búsquedas de personal doméstico en Argentina. Debes extraer TODOS los detalles posibles.

═══ SERVICIOS DISPONIBLES ═══
CLEANING: limpiar, limpieza, barrer, fregar, lavar pisos, lavar, ordenar, higiene, desinfectar, sanitizar, profunda, general, post-obra, mudanza, vidrios
NANNY: niñera, cuidar niños, cuidadora, childcare, babysitter, guardería, niño, bebé, bebe, infante, crianza, cuidado infantil, guardería
COOKING: cocina, cocinera, chef, cocinero, cocinar, recetas, comidas, alimentación, repostería, pastelería, postres, vegetariana, vegana, cenas, preparar comidas, catering

═══ DISPONIBILIDAD: CRITICAL LOGIC ═══
AVAILABILITY (regular vs occasional):
- REGULAR (entre semana): "lunes a viernes", "de lunes a viernes", "entre semana", "weekdays", "diarios", "todos los días de semana", "permanente", "semanal"
- OCCASIONAL (fines de semana): "sábado", "sabado", "domingo", "fin de semana", "fines de semana", "weekend", "weekends", "puntual", "ocasional", "flexible"

DÍAS ESPECÍFICOS → SIEMPRE incluir en notes:
- "Solo sábados" → notes: "Sat only"
- "Únicamente domingos" → notes: "Sun only"
- "Sábados y domingos" → notes: "Weekends (Sat+Sun)"
- "Lunes, miércoles y viernes" → notes: "Mon, Wed, Fri"
- "Martes y jueves" → notes: "Tue, Thu"
- "Lunes a miércoles" → notes: "Mon-Wed"
- "Tres veces por semana" → availability: "occasional" + notes: "3x/week"
- "Una vez por semana" → availability: "occasional" + notes: "1x/week"
- "Dos veces por semana" → availability: "occasional" + notes: "2x/week"

HORARIOS DEL DÍA → agregar a notes:
- "Mañana" / "por la mañana" / "a la mañana" → "mornings"
- "Tarde" / "por la tarde" / "a la tarde" → "afternoons"
- "Noche" / "por la noche" / "a la noche" → "evenings"
- "Madrugada" → "early morning (6-8am)"
- "Tiempo completo" / "full time" / "todo el día" → "full-time"
- "Jornada completa" → "full-time"
- "Medio tiempo" → "part-time"
- "Por horas" → "hourly"

═══ FLEXIBILIDAD ═══
- "Flexible" / "Según necesidad" / "A convenir" → availability: "occasional" + notes: "flexible"
- "Permanente" / "Estable" → availability: "regular"

═══ PRECIOS (RANGO) ═══
KEYWORDS:
- "menos de $", "máximo $", "hasta $", "no más de $" → maxPrice
- "más de $", "mínimo $", "desde $", "a partir de $" → minPrice
- "entre $ y $", "de $ a $" → minPrice AND maxPrice
- "alrededor de $", "aproximadamente $", "~$" → minPrice AND maxPrice (±10%)
- "barato", "económico" → maxPrice: 2500
- "caro", "premium" → minPrice: 3500

EJEMPLOS:
- "menos de $4000" → maxPrice: 4000
- "entre $2000 y $3000" → minPrice: 2000, maxPrice: 3000
- "$1500 por hora" → minPrice: 1400, maxPrice: 1600
- "económica" → maxPrice: 2500

═══ UBICACIÓN/PROVINCIA ═══
CABA → "Capital", "CABA", "Palermo", "San Telmo", "Caballito", "Recoleta", "San Isidro"
BUENOS AIRES → "Buenos Aires", "La Plata", "Mar del Plata", "Bragado", "Junín", "Caseros", "Morón", "Ituzaingó", "Lanús"
CÓRDOBA → "Córdoba", "Córdoba Capital", "Río Cuarto"
MENDOZA → "Mendoza", "Godoy Cruz"
TUCUMÁN → "Tucumán", "San Miguel de Tucumán"

═══ SALIDA REQUERIDA ═══
{
  "skills": [],                      // Array vacío si no se menciona
  "province": null,                  // null si no se menciona
  "maxPrice": null,                  // null si no se menciona
  "minPrice": null,                  // null si no se menciona
  "availability": null,              // "regular" o "occasional" o null
  "notes": ""                        // CONCATENAR TODA INFO EXTRA: días, horarios, flexibilidad
}

═══ EJEMPLOS ═══
Input: "Limpiadora para los sábados por la mañana"
Output: {"skills": ["CLEANING"], "availability": "occasional", "notes": "Sat only, mornings"}

Input: "Chef vegetariano 3 veces por semana, máximo $3500/hora en CABA"
Output: {"skills": ["COOKING"], "province": "CABA", "maxPrice": 3500, "availability": "occasional", "notes": "3x/week, vegetarian"}

Input: "Niñera de lunes a viernes, tiempo completo, entre semana"
Output: {"skills": ["NANNY"], "availability": "regular", "notes": "Mon-Fri, full-time"}

Input: "Limpieza profunda sábados y domingos, flexible, presupuesto ajustado (económico)"
Output: {"skills": ["CLEANING"], "availability": "occasional", "notes": "Weekends (Sat+Sun), flexible, economic"}

IMPORTANTE: Retorna SOLO JSON válido. Sin explicaciones, sin markdown, sin código blocks.`,
        },
        { role: 'user', content: query },
      ],
      max_tokens: 200,
    });

    const responseText = completion.choices[0].message.content || '{}';
    const filters = JSON.parse(responseText);

    return NextResponse.json({ filters });
  } catch (error) {
    console.error('AI Search Error:', error);
    return NextResponse.json(
      { error: 'Error procesando búsqueda con IA' },
      { status: 500 }
    );
  }
}
