require('reflect-metadata');
require('dotenv').config();

import { Container } from 'inversify';
import Kernel from './foundation/kernel';
import ConfigContract, { CONFIGCONTRACT } from './config/contracts/configcontract';
import { configModule } from './config';

const app = new Container({autoBindInjectable: true, skipBaseClassChecks: true});

app.bind<Container>(Container).toConstantValue(app);
app.bind<Kernel>(Kernel).toSelf().inSingletonScope();
app.load(configModule);

const config = app.get<ConfigContract>(CONFIGCONTRACT);

app.load(...config.app.modules);

export default app;
