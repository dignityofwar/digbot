import {ChannelState} from '../../channel.state';

export interface NamingOnJoinContract {
    getChannelNameOnJoin(state: ChannelState): string;
}