import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmCofig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'taskmanagment',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
