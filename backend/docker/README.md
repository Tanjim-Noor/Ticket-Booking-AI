# Docker Compose Services for Ticket Booking AI

## Services

### PostgreSQL
- **Port**: 5432
- **Database**: ticket_booking
- **Username**: user
- **Password**: password

### pgAdmin (PostgreSQL GUI)
- **Port**: 5050
- **URL**: http://localhost:5050
- **Email**: admin@admin.com
- **Password**: admin

**To connect to PostgreSQL in pgAdmin:**
1. Open http://localhost:5050
2. Login with admin@admin.com / admin
3. Add new server:
   - Name: Local PostgreSQL
   - Host: postgres
   - Port: 5432
   - Username: user
   - Password: password
   - Database: ticket_booking

### ChromaDB
- **Port**: 8001
- **URL**: http://localhost:8001
- **Persistent**: Yes

## Commands

Start all services:
```bash
docker-compose up -d
```

Stop all services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f
```

Check status:
```bash
docker-compose ps
```

Restart specific service:
```bash
docker-compose restart postgres
```
