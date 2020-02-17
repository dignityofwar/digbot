/*
 * Setup for Inversify and the use of .env file in the root directory
 */
import 'reflect-metadata';
require('dotenv').config();
/**/

import { Container } from 'inversify';
import Kernel from './foundation/kernel';

import commandsModule from './commands/module';
import Index, {config} from './config';

const app = new Container({autoBindInjectable: true, skipBaseClassChecks: true});

app.bind<Container>(Container).toConstantValue(app);
app.bind<Index>(Index).toConstantValue(config);
app.bind<Kernel>(Kernel).toSelf().inSingletonScope();

app.load(
    commandsModule,
);

export default app;
