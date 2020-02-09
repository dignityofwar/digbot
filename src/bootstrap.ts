/*
 * Setup for Inversify and the use of .env file in the root directory
 */
import 'reflect-metadata';
import { config } from 'dotenv';
config();
/**/

import { Container } from 'inversify';
import Kernel from './foundation/kernel';

import discordModule from './bot/module';
import commandsModule from './commands/module';
import Config from './foundation/config';

const app: Container = new Container({autoBindInjectable: true, skipBaseClassChecks: true});

app.bind<Container>(Container).toConstantValue(app);
app.bind<Kernel>(Kernel).toSelf().inSingletonScope();
app.bind<Config>(Config).toSelf().inSingletonScope();

app.load(
    discordModule,
    commandsModule,
);

export default app;
