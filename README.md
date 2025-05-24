# ICT-Project

Project สำหรับการศึกษา

## สิ่งที่ต้องเตรียม

- [docker](https://docs.docker.com/desktop/) สำหรับจัดการ Database

สร้างไฟล์ docker-compose.yml สำหรับจัดการ Database

### linux

```bash
touch docker-compose.yml
```

### windows

ใช้ Powershell

```powershell
New-Item docker-compose.yml
```

### docker compose

นำไปวางที่ docker-compose.yml โดยนะที่นี้จะใช้เป็น mysql

```yml
services:
  mysql:
    container_name: mysql
    environment:
      - MYSQL_ROOT_PASSWORD=1234 # เป็น Password ของ root
      - MYSQL_DATABASE=project # ชื่อ database
    ports:
      - 3306:3306
    image: mysql
  phpmyadmin:
    container_name: phpmyadmin
    links:
      - mysql:db
    ports:
      - 8765:80 # สามารถแก้ใข Port จาก 8765 เป็นอย่างอื่นได้ เช่น 8080
    image: phpmyadmin/phpmyadmin
networks: {}
```

จากนั้น run บน terminal

```bash
docker compose up -d
```

หรือ

```bash
docker-compose up -d
```

> เปิด localhost:8765 (ตามที่ตั้ง Port เอาไว้)  
> User : root  
> password : 1234
