import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User"; // your entity

export const AppDataSource = new DataSource({
  type: "mysql", // or 'mysql', 'sqlite', etc.
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234",
  database: "project",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
