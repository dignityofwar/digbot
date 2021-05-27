import {ChannelState} from '../../channel.state';
import {Group} from '../../group';

export interface NamingContract {
    forChannel(channel: ChannelState): string;

    forNewChannel(group: Group): string;
}