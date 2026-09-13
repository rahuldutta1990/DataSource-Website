import nodemailer from 'nodemailer';
import { ContactEnquiry, NewsletterSubscriber } from '../../src/types.js';

interface EmailDispatchRecord {
  id: string;
  type: 'inquiry' | 'newsletter' | 'test';
  to: string;
  subject: string;
  preview: string;
  status: 'delivered' | 'simulated' | 'failed';
  timestamp: string;
  details?: Record<string, any>;
  errorMessage?: string;
}

// In-memory record of triggered admin emails for admin inspection
const mailLogs: EmailDispatchRecord[] = [];

export function getMailLogs(): EmailDispatchRecord[] {
  return [...mailLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function clearMailLogs(): void {
  mailLogs.length = 0;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback to null when no real SMTP is configured
  return null;
}

export async function sendAdminLeadNotification(inquiry: Partial<ContactEnquiry>): Promise<{
  success: boolean;
  message: string;
  recipient: string;
  mode: 'smtp' | 'simulated';
}> {
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'rd14190@gmail.com';
  const from = process.env.SMTP_FROM || 'DataSource Alerts <no-reply@datasource.tech>';
  const subject = `🚨 New High-Intent Lead: ${inquiry.name || 'Client'} (${inquiry.company || 'Enterprise'})`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0B132B; margin: 0; padding: 24px; color: #E2E8F0; }
    .card { background: #0F172A; border: 1px solid #1E293B; border-radius: 16px; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #0077FF, #00C6FF); padding: 28px; text-align: left; }
    .header h1 { margin: 0; font-size: 22px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.85); }
    .body { padding: 28px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .meta-box { background: #1E293B; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155; }
    .meta-label { font-size: 11px; text-transform: uppercase; color: #94A3B8; font-weight: 600; letter-spacing: 0.5px; }
    .meta-value { font-size: 14px; color: #F8FAFC; font-weight: 600; margin-top: 4px; word-break: break-all; }
    .requirement-box { background: #132036; border: 1px solid #0077FF33; border-radius: 10px; padding: 16px; margin: 20px 0; }
    .cta-btn { display: inline-block; background: #0077FF; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-right: 12px; }
    .footer { padding: 16px 28px; background: #0A0F1D; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #1E293B; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🚀 New Consultation Lead Captured</h1>
      <p>DataSource Technology & Solutions — Lead Alert Dispatch</p>
    </div>
    <div class="body">
      <div class="meta-grid">
        <div class="meta-box">
          <div class="meta-label">Client Name</div>
          <div class="meta-value">${inquiry.name || 'N/A'}</div>
        </div>
        <div class="meta-box">
          <div class="meta-label">Company</div>
          <div class="meta-value">${inquiry.company || 'Not Specified'}</div>
        </div>
        <div class="meta-box">
          <div class="meta-label">Email Address</div>
          <div class="meta-value"><a href="mailto:${inquiry.email}" style="color: #38BDF8;">${inquiry.email || 'N/A'}</a></div>
        </div>
        <div class="meta-box">
          <div class="meta-label">Phone</div>
          <div class="meta-value">${inquiry.phone || 'Not Provided'}</div>
        </div>
        <div class="meta-box">
          <div class="meta-label">Required Service</div>
          <div class="meta-value" style="color: #38BDF8;">${inquiry.serviceRequired || 'Consultation'}</div>
        </div>
        <div class="meta-box">
          <div class="meta-label">Budget Range</div>
          <div class="meta-value" style="color: #34D399;">${inquiry.budgetRange || 'Flexible'}</div>
        </div>
      </div>

      <div class="requirement-box">
        <div class="meta-label" style="color: #38BDF8; margin-bottom: 6px;">Client Problem & Requirements</div>
        <div style="font-size: 14px; line-height: 1.6; color: #E2E8F0; white-space: pre-wrap;">${inquiry.requirement || 'No detailed requirement provided.'}</div>
      </div>

      <div style="margin-top: 24px;">
        <a href="mailto:${inquiry.email}?subject=Re:%20DataSource%20Consultation%20Inquiry%20-%20${encodeURIComponent(inquiry.company || inquiry.name || '')}" class="cta-btn">Reply to Client</a>
      </div>
    </div>
    <div class="footer">
      Captured at ${new Date().toLocaleString()} · Stored in Firebase Firestore & Admin Panel
    </div>
  </div>
</body>
</html>
  `;

  const record: EmailDispatchRecord = {
    id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'inquiry',
    to: recipient,
    subject,
    preview: `${inquiry.name} (${inquiry.email}) requested ${inquiry.serviceRequired || 'consultation'}: "${(inquiry.requirement || '').slice(0, 80)}..."`,
    status: 'simulated',
    timestamp: new Date().toISOString(),
    details: inquiry,
  };

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to: recipient,
        replyTo: inquiry.email,
        subject,
        html: htmlContent,
      });
      record.status = 'delivered';
      mailLogs.unshift(record);
      console.log(`[MailService] Live SMTP email delivered to ${recipient}`);
      return { success: true, message: `Admin email sent to ${recipient}`, recipient, mode: 'smtp' };
    } catch (err: any) {
      console.error('[MailService] SMTP dispatch error, falling back to simulated log:', err);
      record.status = 'failed';
      record.errorMessage = err.message;
      mailLogs.unshift(record);
      return { success: true, message: `Notification logged for ${recipient}`, recipient, mode: 'simulated' };
    }
  }

  // In simulated/preview mode (development environment):
  mailLogs.unshift(record);
  console.log(`[MailService] Lead alert captured and simulated for admin ${recipient}: ${subject}`);
  return {
    success: true,
    message: `Admin mail alert triggered for ${recipient}`,
    recipient,
    mode: 'simulated',
  };
}

export async function sendAdminNewsletterNotification(subscriber: {
  email: string;
  interest?: string;
  source?: string;
}): Promise<{
  success: boolean;
  message: string;
  recipient: string;
  mode: 'smtp' | 'simulated';
}> {
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'rd14190@gmail.com';
  const from = process.env.SMTP_FROM || 'DataSource Alerts <no-reply@datasource.tech>';
  const subject = `📰 New Newsletter Subscriber: ${subscriber.email}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, sans-serif; background: #0F172A; padding: 24px; color: #F8FAFC;">
  <div style="max-width: 500px; margin: 0 auto; background: #1E293B; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
    <h2 style="color: #38BDF8; margin-top: 0;">New Mailing List Subscriber</h2>
    <p>A new visitor has subscribed to the DataSource tech briefings:</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr><td style="padding: 8px 0; color: #94A3B8;">Email:</td><td style="font-weight: bold; color: #fff;"><a href="mailto:${subscriber.email}" style="color: #38BDF8;">${subscriber.email}</a></td></tr>
      <tr><td style="padding: 8px 0; color: #94A3B8;">Topic Focus:</td><td style="color: #fff;">${subscriber.interest || 'General'}</td></tr>
      <tr><td style="padding: 8px 0; color: #94A3B8;">Source:</td><td style="color: #fff;">${subscriber.source || 'Website Footer'}</td></tr>
      <tr><td style="padding: 8px 0; color: #94A3B8;">Time:</td><td style="color: #fff;">${new Date().toLocaleString()}</td></tr>
    </table>
  </div>
</body>
</html>
  `;

  const record: EmailDispatchRecord = {
    id: `mail-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'newsletter',
    to: recipient,
    subject,
    preview: `New subscriber: ${subscriber.email} (Focus: ${subscriber.interest || 'General'})`,
    status: 'simulated',
    timestamp: new Date().toISOString(),
    details: subscriber,
  };

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to: recipient,
        subject,
        html: htmlContent,
      });
      record.status = 'delivered';
      mailLogs.unshift(record);
      return { success: true, message: `Newsletter notification sent to ${recipient}`, recipient, mode: 'smtp' };
    } catch (err: any) {
      record.status = 'failed';
      record.errorMessage = err.message;
      mailLogs.unshift(record);
      return { success: true, message: `Newsletter notification logged for ${recipient}`, recipient, mode: 'simulated' };
    }
  }

  mailLogs.unshift(record);
  console.log(`[MailService] Newsletter subscriber alert logged for admin ${recipient}: ${subscriber.email}`);
  return {
    success: true,
    message: `Admin mail notification triggered for ${recipient}`,
    recipient,
    mode: 'simulated',
  };
}
