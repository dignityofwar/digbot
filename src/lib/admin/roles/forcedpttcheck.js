//  Copyright © 2018 DIG Development team. All rights reserved.

// Detects if a member just recieved the mute tag, if so PM them VOIP tips

const config = require('config');
const logger = require('../../logger.js');

const TAG = 'Forced PTT Check';

const message = ', you were just muted manually by a Staff '
    + 'Member/Game Officer on our Discord; this was most likely due to you using "voice activity" '
    + 'as your input method. When you use voice activity your microphone tends to pick up breathing/'
    + 'music/people talking in the background if it\'s not configured perfectly. We strongly recommend '
    + 'that you use "push to talk" as your input method.'
    + '\n'
    + '\nTo set PTT as your input method please go to the settings icon at the bottom left of Discord --> '
    + 'voice --> input mode --> Push To Talk --> done. Don\'t forget to set a push to talk key and '
    + 'you\'ll be able to talk right away!'
    + '\n'
    + '\nAlternatively if you absolutely must use voice detect for some reason (You cannot do this '
    + 'unless you are using headphones), then after you have taken great care in your settings to '
    + 're-calibrate your detection threshold you should politely ask to be unmuted. You can do this '
    + 'by typing "@staff can I please be removed from the forcedPTT role I\'ve fixed my mic" in '
    + '#entrance-general';

module.exports = {
    execute(oldMember, newMember) {
        if (!newMember.roles.has(config.get('general.forcedPTTRoleID'))) { return false; }
        if (oldMember.roles.has(config.get('general.forcedPTTRoleID'))) { return false; }
        newMember.send(`Hey ${newMember.displayName} ${message}`)
            .then(() => {
                logger.info(TAG, 'Detected member was muted and informed them why');
            })
            .catch((err) => {
                logger.warning(TAG, `Failed to send message to member, error: ${err}`);
            });
        return true;
    },
};
