# 🗄️ Database Scripts

## Quick Start Commands

```bash
# 1. Create database and apply schema
psql -U postgres -c "CREATE DATABASE teacher_platform;"
psql -U postgres -d teacher_platform -f schema.sql
psql -U postgres -d teacher_platform -f init.sql

# 2. Or use npm scripts (from server directory)
cd ../server
npm install
npm run db:setup    # Create tables and load initial data
npm run db:reset    # Full reset (drops and recreates)
```

## Manual Commands

### Create Tables Only
```bash
psql -U postgres -d teacher_platform -f schema.sql
```

### Load Initial Data
```bash
psql -U postgres -d teacher_platform -f init.sql
```

### Drop All Tables
```bash
psql -U postgres -d teacher_platform -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Backup Database
```bash
pg_dump -U postgres teacher_platform > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql -U postgres -d teacher_platform -f backup_20251124.sql
```

## Useful Queries

### Check Tables
```sql
\dt
```

### Check Table Structure
```sql
\d users
\d courses
\d lessons
```

### Count Records
```sql
SELECT 
  'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'lessons', COUNT(*) FROM lessons;
```

### Check Indexes
```sql
SELECT 
  tablename, 
  indexname, 
  indexdef 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

## Database Info

- **Name**: teacher_platform
- **Tables**: 14
- **Indexes**: 25+
- **Triggers**: 8
- **Functions**: 1

## Connection Info

- **Host**: localhost (or from .env)
- **Port**: 5432 (default PostgreSQL)
- **Database**: teacher_platform
- **User**: postgres (or from .env)
- **Password**: Set in .env file

