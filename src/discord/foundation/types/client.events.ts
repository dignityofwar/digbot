import {ClientEvents as ClientEventsEnum} from 'detritus-client/lib/constants';

export type ClientEvents = ClientEventsEnum | `${ClientEventsEnum}`;
