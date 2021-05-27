import {NamingContract} from './concerns/naming.contract';
import {ChannelState} from '../channel.state';
import {Group} from '../group';
import {Injectable} from '@nestjs/common';

@Injectable()
export class NumberedNaming implements NamingContract {
    forChannel(state: ChannelState): string {
        const first = Array.from(state.group.channels)
            .reduce((a, b) =>
                a.channel.rawPosition >= b.channel.rawPosition
                && a.channel.position > b.channel.position
                    ? b : a);

        return this.makeName(
            state.group,
            state.channel.position - first.channel.position + 1,
        );
    }

    forNewChannel(group: Group): string {
        return this.makeName(
            group,
            group.channels.size + 1,
        );
    }

    private makeName(group: Group, no: number): string {
        return `${group.settings.name}${no}`;
    }
}
