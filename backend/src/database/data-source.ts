import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { createDataSourceOptions } from './database.config.js';

const dataSource = new DataSource(createDataSourceOptions());

export default dataSource;
