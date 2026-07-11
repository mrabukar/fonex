import type { ContactInput } from '@fonex/shared';

export type ContactNotification = ContactInput & { id: string; productName?: string };

const FONT = "Helvetica, Arial, sans-serif";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fieldRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding-bottom:16px;">
        <div style="font-family:${FONT};font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#9098AE;margin-bottom:4px;">${escapeHtml(label)}</div>
        <div style="font-family:${FONT};font-size:15px;font-weight:600;color:#0B1226;">${escapeHtml(value)}</div>
      </td>
    </tr>`;
}

function productRow(name: string, url?: string): string {
  return `
    <tr>
      <td style="padding-bottom:16px;">
        <div style="font-family:${FONT};font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#9098AE;margin-bottom:4px;">Product</div>
        <div style="font-family:${FONT};font-size:15px;font-weight:600;color:#0B1226;">${escapeHtml(name)}</div>
        ${url ? `<a href="${url}" style="font-family:${FONT};font-size:13px;font-weight:700;color:#1A1C74;text-decoration:none;">View product →</a>` : ''}
      </td>
    </tr>`;
}

export function contactNotificationHtml(submission: ContactNotification, productUrl?: string): string {
  const replySubject = encodeURIComponent('Re: Your enquiry to Fonex Supply');
  const receivedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  });

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F1F3FA;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1F3FA;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E7EAF3;">
            <tr>
              <td style="background:#1A1C74;padding:36px 40px;">
                <div style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#F5A623;margin-bottom:8px;">New Enquiry</div>
                <div style="font-family:${FONT};font-size:22px;font-weight:800;color:#FFFFFF;">Fonex Supply Limited</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${fieldRow('Name', submission.name)}
                  ${fieldRow('Email', submission.email)}
                  ${submission.phone ? fieldRow('Phone', submission.phone) : ''}
                  ${fieldRow('Interest', submission.interest)}
                  ${submission.productName ? productRow(submission.productName, productUrl) : ''}
                </table>
                <div style="font-family:${FONT};font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#9098AE;margin-bottom:10px;">Message</div>
                <div style="background:#F6F8FF;border-radius:12px;padding:18px 20px;font-family:${FONT};font-size:15px;line-height:1.6;color:#27314B;white-space:pre-wrap;">${escapeHtml(submission.message)}</div>
                <div style="margin-top:28px;">
                  <a href="mailto:${encodeURIComponent(submission.email)}?subject=${replySubject}" style="display:inline-block;background:#1A1C74;color:#FFFFFF;font-family:${FONT};font-size:14px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:10px;">Reply to ${escapeHtml(submission.name)}</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 40px;border-top:1px solid #E7EAF3;">
                <div style="font-family:${FONT};font-size:11.5px;color:#9098AE;line-height:1.6;">
                  Submission ID: ${submission.id}<br />
                  Received: ${receivedAt} UTC
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function contactNotificationText(submission: ContactNotification, productUrl?: string): string {
  const lines = [
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    submission.phone ? `Phone: ${submission.phone}` : null,
    `Interest: ${submission.interest}`,
    submission.productName ? `Product: ${submission.productName}` : null,
    submission.productName && productUrl ? `Product link: ${productUrl}` : null,
    '',
    'Message:',
    submission.message,
    '',
    `Submission ID: ${submission.id}`,
    `Received: ${new Date().toISOString()}`,
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}
