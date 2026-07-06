import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_APPROVED,
  EMAILJS_TEMPLATE_REQUEST,
  PUBLIC_SITE_URL,
} from '../config';

export interface ReservationEmailPayload {
  email?: string;
  name: string;
  tableLabel: string;
  date: string;
  time: string;
  guests: number;
}

export function isEmailConfigured() {
  return Boolean(EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_REQUEST && EMAILJS_TEMPLATE_APPROVED);
}

/**
 * Šalje email gostu preko EmailJS REST API-ja.
 * - 'request'  → potvrda da je zahtev prosleđen osoblju
 * - 'approved' → potvrda da je rezervacija odobrena
 * Tiho preskače ako email nije unet ili servis nije konfigurisan.
 */
export async function sendReservationEmail(kind: 'request' | 'approved', reservation: ReservationEmailPayload) {
  if (!reservation.email || !isEmailConfigured()) return false;
  const templateId = kind === 'request' ? EMAILJS_TEMPLATE_REQUEST : EMAILJS_TEMPLATE_APPROVED;
  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: reservation.email,
          guest_name: reservation.name,
          table_label: reservation.tableLabel,
          date: reservation.date,
          time: reservation.time,
          guests: String(reservation.guests),
          site_url: PUBLIC_SITE_URL,
        },
      }),
    });
    return response.ok;
  } catch (error) {
    console.warn('[capanna-email] sending failed', error);
    return false;
  }
}
