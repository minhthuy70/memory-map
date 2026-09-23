import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    const host = this.configService.get<string>('MAIL_HOST');
    const port = this.configService.get<number>('MAIL_PORT', 587);
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASS');

    // If no mail config, we fall back to console logging (dev mode)
    if (!host || !user || !pass) {
      this.logger.warn(
        'Mail configuration missing (MAIL_HOST / MAIL_USER / MAIL_PASS). ' +
        'Falling back to console logging for email content.',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false, // allow self-signed certs in dev
      },
    });
  }

  /**
   * Send a verification code email.
   * Falls back to console.log when transporter is not configured.
   */
  async sendVerificationCode(
    toEmail: string,
    code: string,
    expiresAt: Date,
  ): Promise<void> {
    const fromName = this.configService.get<string>('MAIL_FROM_NAME', 'Memory Map');
    const fromEmail =
      this.configService.get<string>('MAIL_USER') || 'noreply@memorymap.app';
    const from = `"${fromName}" <${fromEmail}>`;
    const expiryText = `${Math.round((expiresAt.getTime() - Date.now()) / 60000)} phút`;

    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mã xác nhận – Memory Map</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:36px 40px 28px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <span style="font-size:28px;">📍</span>
                <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Memory Map</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              <h2 style="margin:0 0 12px;font-size:20px;color:#1e293b;font-weight:700;">
                Mã xác nhận email của bạn
              </h2>
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;">
                Bạn (hoặc ai đó) đã yêu cầu xác nhận địa chỉ email
                <strong style="color:#1e293b;">${toEmail}</strong> trên Memory Map.
                Dùng mã OTP dưới đây để hoàn tất quá trình:
              </p>

              <!-- OTP Box -->
              <div style="background:#f8fafc;border:2px dashed #6366f1;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
                <p style="margin:0 0 6px;font-size:13px;color:#6366f1;font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                  Mã xác nhận
                </p>
                <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:12px;color:#1e293b;font-family:'Courier New',monospace;">
                  ${code}
                </p>
              </div>

              <p style="margin:0 0 8px;font-size:14px;color:#64748b;">
                ⏰ Mã có hiệu lực trong <strong>${expiryText}</strong>.
              </p>
              <p style="margin:0;font-size:14px;color:#94a3b8;">
                Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} Memory Map · Email này được gửi tự động, vui lòng không trả lời.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text =
      `Mã xác nhận Memory Map của bạn là: ${code}\n` +
      `Mã có hiệu lực trong ${expiryText}.\n` +
      `Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.`;

    // ──────────────────────────────────────────────
    // Attempt real send; fall back to console.log
    // ──────────────────────────────────────────────
    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from,
          to: toEmail,
          subject: `[Memory Map] Mã xác nhận của bạn: ${code}`,
          text,
          html,
        });
        this.logger.log(`Verification email sent to ${toEmail} – messageId: ${info.messageId}`);
        return;
      } catch (err: any) {
        this.logger.error(
          `Failed to send email to ${toEmail}: ${err.message}. Falling back to console log.`,
        );
      }
    }

    // Fallback – always log for dev / when SMTP is unavailable
    this.logger.warn(`\n${'='.repeat(60)}`);
    this.logger.warn(`[EMAIL VERIFICATION] To: ${toEmail}`);
    this.logger.warn(`[EMAIL VERIFICATION] Code: ${code}`);
    this.logger.warn(`[EMAIL VERIFICATION] Expires at: ${expiresAt.toLocaleTimeString()}`);
    this.logger.warn(`${'='.repeat(60)}\n`);
  }

  /**
   * Send a password-reset link email.
   */
  async sendPasswordReset(
    toEmail: string,
    resetToken: string,
    resetUrl: string,
  ): Promise<void> {
    const fromName = this.configService.get<string>('MAIL_FROM_NAME', 'Memory Map');
    const fromEmail =
      this.configService.get<string>('MAIL_USER') || 'noreply@memorymap.app';
    const from = `"${fromName}" <${fromEmail}>`;

    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Đặt lại mật khẩu – Memory Map</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:36px 40px 28px;text-align:center;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;">📍 Memory Map</span>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 40px 28px;">
              <h2 style="margin:0 0 12px;font-size:20px;color:#1e293b;font-weight:700;">
                Yêu cầu đặt lại mật khẩu
              </h2>
              <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.6;">
                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản
                <strong style="color:#1e293b;">${toEmail}</strong>.
                Nhấn vào nút bên dưới để tiếp tục:
              </p>

              <div style="text-align:center;margin-bottom:28px;">
                <a href="${resetUrl}"
                   style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;">
                  Đặt lại mật khẩu
                </a>
              </div>

              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
                Hoặc copy đường dẫn sau vào trình duyệt:
              </p>
              <p style="margin:0 0 20px;font-size:12px;color:#6366f1;word-break:break-all;">
                ${resetUrl}
              </p>

              <p style="margin:0;font-size:14px;color:#94a3b8;">
                ⏰ Liên kết có hiệu lực trong 30 phút. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} Memory Map · Email này được gửi tự động, vui lòng không trả lời.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const text =
      `Yêu cầu đặt lại mật khẩu Memory Map\n\n` +
      `Nhấn vào đường dẫn sau để đặt lại mật khẩu:\n${resetUrl}\n\n` +
      `Liên kết có hiệu lực trong 30 phút.`;

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from,
          to: toEmail,
          subject: '[Memory Map] Yêu cầu đặt lại mật khẩu',
          text,
          html,
        });
        this.logger.log(`Password-reset email sent to ${toEmail} – messageId: ${info.messageId}`);
        return;
      } catch (err: any) {
        this.logger.error(
          `Failed to send password-reset email to ${toEmail}: ${err.message}`,
        );
      }
    }

    this.logger.warn(`[PASSWORD RESET] To: ${toEmail} | URL: ${resetUrl}`);
  }
}
