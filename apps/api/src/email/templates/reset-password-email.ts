const FONT = 'Helvetica, Arial, sans-serif';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function resetPasswordEmailHtml(url: string): string {
  const safeUrl = escapeHtml(url);

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F1F3FA;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1F3FA;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E7EAF3;">
            <tr>
              <td style="background:#1A1C74;padding:36px 40px;">
                <div style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#F5A623;margin-bottom:8px;">Password Reset</div>
                <div style="font-family:${FONT};font-size:22px;font-weight:800;color:#FFFFFF;">Fonex Supply Limited</div>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px;">
                <div style="font-family:${FONT};font-size:15px;line-height:1.6;color:#27314B;">
                  We received a request to reset the password for your Fonex admin account. Click the button below to choose a new password. This link expires in 1 hour.
                </div>
                <div style="margin-top:28px;">
                  <a href="${safeUrl}" style="display:inline-block;background:#1A1C74;color:#FFFFFF;font-family:${FONT};font-size:14px;font-weight:700;text-decoration:none;padding:13px 26px;border-radius:10px;">Reset password</a>
                </div>
                <div style="margin-top:24px;font-family:${FONT};font-size:12.5px;color:#9098AE;">
                  If you didn't request this, you can safely ignore this email.
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

export function resetPasswordEmailText(url: string): string {
  return [
    'We received a request to reset the password for your Fonex admin account.',
    '',
    `Reset your password: ${url}`,
    '',
    "This link expires in 1 hour. If you didn't request this, you can safely ignore this email.",
  ].join('\n');
}
