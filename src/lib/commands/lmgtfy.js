//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict'

// !lmgtfy command, generates lmgtfy link based on input args

module.exports = {
    execute: function(msg) {
        let args = msg.cleanContent.toString().split(' ');
        args.shift();
        if (args.length == 0) {return 'You still need to ask a question, I can\'t do that myself.';}
        return 'There you go! http://lmgtfy.com/?q=' + encodeURI(args.join('+'));
    }
};
