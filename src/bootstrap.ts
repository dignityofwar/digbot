require('reflect-metadata');
require('dotenv').config();

import { Container } from 'inversify';
import Kernel from './foundation/kernel';
import config from './config';

const app = new Container({autoBindInjectable: true, skipBaseClassChecks: true});

app.bind<Container>(Container).toConstantValue(app);
app.bind<Kernel>(Kernel).toSelf().inSingletonScope();
app.load(...config.app.modules);

export default app;
