import { ContainerModule, interfaces } from 'inversify';
import Bind = interfaces.Bind;
import Handler from '../bot/handler';
// import AutoRoleAssigmentHandler from './autoroleassignmenthandler';

export default new ContainerModule((bind: Bind) => {
    // bind<Handler>(Handler).to(AutoRoleAssigmentHandler);
});
