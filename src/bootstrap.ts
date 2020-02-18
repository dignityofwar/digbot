/*
 * Setup for Inversify and the use of .env file in the root directory
 */
import 'reflect-metadata';

require('dotenv').config();
/**/

import { Container } from 'inversify';
import Kernel from './foundation/kernel';
import Config, { config } from './config';

import botModule from './bot';
import commandsModule from './commands';

const app = new Container({autoBindInjectable: true, skipBaseClassChecks: true});

app.bind<Container>(Container).toConstantValue(app);
app.bind<Config>(Config).toConstantValue(config);
app.bind<Kernel>(Kernel).toSelf().inSingletonScope();

app.load(
    botModule,
    commandsModule,
);

export default app;
