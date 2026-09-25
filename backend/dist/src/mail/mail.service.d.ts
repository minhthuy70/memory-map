import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly configService?;
    private readonly logger;
    private transporter;
    constructor(configService?: ConfigService);
    private initTransporter;
    sendVerificationCode(toEmail: string, code: string, expiresAt: Date): Promise<void>;
    sendPasswordReset(toEmail: string, resetToken: string, resetUrl: string): Promise<void>;
}
