import OpenAI from 'openai';
import { prisma } from './prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeMessageWithAI(
  messageId: string,
  content: string,
  conversationId: string
) {
  try {
    // Llamar OpenAI para detectar contacto obfuscado
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres un moderador que detecta si un mensaje intenta compartir datos de contacto (teléfono, email, redes sociales, WhatsApp, Telegram, Instagram, TikTok, etc.) incluso si está obfuscado o disfrazado.

Ejemplos de intentos:
- "once 4 veinte3302" (teléfono disfrazado)
- "búscame en insta: usuario123" (red social)
- "mi snap es..." (Snapchat)
- "escribime al mail" (email)

Responde SOLO con "YES" si detectas intento de contacto, "NO" si es mensaje normal.`,
        },
        {
          role: 'user',
          content: content,
        },
      ],
    });

    const decision = response.choices[0].message.content?.toUpperCase().trim();
    const isSuspicious = decision?.includes('YES');

    if (isSuspicious) {
      // 1. Obtener info del mensaje original para saber quién lo envió
      const originalMessage = await prisma.message.findUnique({
        where: { id: messageId },
        select: { senderId: true },
      });

      // 2. Borrar mensaje sospechoso
      await prisma.message.delete({
        where: { id: messageId },
      });

      // 3. Crear mensaje de rechazo del mismo usuario
      if (originalMessage?.senderId) {
        try {
          await prisma.message.create({
            data: {
              conversationId,
              senderId: originalMessage.senderId,
              content: '[Tu mensaje fue eliminado por intentar compartir datos de contacto. Compra créditos para desbloquear información de contacto.]',
              isModeratorAlert: false,
            },
          });
        } catch (err) {
          console.warn('Could not create rejection message:', err);
        }
      }

      console.log(`🚫 Message ${messageId} deleted by AI moderation (suspected contact info)`);
    }
  } catch (error) {
    console.error('❌ AI moderation error:', error);
    // No propagar error - es async, no debe fallar el flujo de mensajes
  }
}
