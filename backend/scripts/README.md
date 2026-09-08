# Database Migration Scripts

Hướng dẫn sử dụng các script quản lý migration và database cho Memory Map project.

## Các Script Có Sẵn

### 1. Backup Database (`db:backup`)
Tạo backup toàn bộ database dưới dạng file SQL.

```bash
npm run db:backup
```

**Chức năng:**
- Tạo backup file với timestamp trong thư mục `backups/`
- Tự động giữ 10 backup gần nhất
- Sử dụng `pg_dump` cho PostgreSQL

**Ví dụ output:**
```
backup-2024-01-15T10-30-00-000Z.sql
```

### 2. Restore Database (`db:restore`)
Khôi phục database từ file backup.

```bash
npm run db:restore <backup-file>
```

**Ví dụ:**
```bash
npm run db:restore backups/backup-2024-01-15T10-30-00-000Z.sql
```

### 3. Rollback Migration (`prisma:rollback`)
Rollback migration về trạng thái trước đó.

```bash
npm run prisma:rollback <migration-name|steps>
```

**Tùy chọn:**
- Rollback 1 bước: `npm run prisma:rollback 1`
- Rollback N bước: `npm run prisma:rollback 3`
- Rollback đến migration cụ thể: `npm run prisma:rollback 20260830153147_init`

**Chức năng:**
- Tự động tạo backup trước khi rollback
- Sử dụng `prisma migrate resolve` để đánh dấu migration đã rollback
- Tự động regenerate Prisma client sau rollback

**Lưu ý:** Prisma không hỗ trợ rollback tự động hoàn toàn, script này đánh dấu migration là đã rollback trong Prisma tracking. Bạn có thể cần áp dụng thay đổi schema thủ công nếu cần.

### 4. Test Migration (`prisma:test`)
Kiểm tra và validate migration files.

```bash
npm run prisma:test
```

**Chức năng:**
- Validate Prisma schema
- Kiểm tra pending migrations
- Format schema
- Tạo test migration (dry run)
- Validate migration files
- Test database connection
- Generate Prisma client

## Quy trình Migration An Toàn

### Khi thêm migration mới:

1. **Backup database:**
   ```bash
   npm run db:backup
   ```

2. **Test migration:**
   ```bash
   npm run prisma:test
   ```

3. **Apply migration:**
   ```bash
   npm run prisma:migrate
   ```

4. **Verify:** Kiểm tra ứng dụng hoạt động bình thường

### Khi cần rollback:

1. **Rollback migration:**
   ```bash
   npm run prisma:rollback 1
   ```

2. **Nếu có vấn đề:** Restore từ backup
   ```bash
   npm run db:restore backups/backup-2024-01-15T10-30-00-000Z.sql
   ```

## Tệp Migration

- **Schema:** `prisma/schema.prisma`
- **Migrations:** `prisma/migrations/`
- **Backups:** `backups/`

## Môi trường

Đảm bảo biến môi trường `DATABASE_URL` được cấu hình trong file `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/database_name
```

## Troubleshooting

### Migration thất bại:
1. Kiểm tra file migration SQL có đúng không
2. Xem logs lỗi chi tiết
3. Restore từ backup gần nhất
4. Fix vấn đề và thử lại

### Rollback không hoạt động:
1. Prisma không hỗ trợ rollback tự động hoàn toàn
2. Sử dụng `prisma migrate resolve` để đánh dấu migration
3. Áp dụng thay đổi schema thủ công nếu cần
4. Restore từ backup nếu cần thiết

### Database connection error:
1. Kiểm tra `DATABASE_URL` trong `.env`
2. Đảm bảo PostgreSQL đang chạy
3. Kiểm tra user/password/database name

## Tài liệu Tham khảo

- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL Backup](https://www.postgresql.org/docs/current/backup-dump.html)