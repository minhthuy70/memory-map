export declare class CreateAuditLogDto {
    action: string;
    entityType: string;
    entityId?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: string;
}
export declare class GetAuditLogsDto {
    userId: string;
    action?: string;
    startDate?: string;
    endDate?: string;
}
