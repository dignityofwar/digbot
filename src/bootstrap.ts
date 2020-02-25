import 'reflect-metadata';
import { config as envConfig } from 'dotenv';

envConfig();

import { Container } from 'inversify';
import Kernel from './foundation/kernel';
import { configModule } from './config';

import { botModule } from './bot';
import { commandModule } from './commands';
import { statsModule } from './stats';
import { databaseModule } from './database';

const app = new Container({autoBindInjectable: true, skipBaseClassChecks: true});

app.bind<Container>(Container).toConstantValue(app);
app.bind<Kernel>(Kernel).toSelf().inSingletonScope();

app.load(
    configModule,
    botModule,
    databaseModule,
    commandModule,
    statsModule,
);

export default app;
