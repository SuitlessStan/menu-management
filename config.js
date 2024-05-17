import fs from 'fs'


const config = {
  port: process.env.PORT || 4000,
  mysql: {
    host:  process.env.MYSQL_HOST || "menu-management-sql",
    database:  process.env.MYSQL_DATABASE || "menu",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "root", 
  },
}

export { config }