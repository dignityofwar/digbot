//  Copyright © 2018 DIG Development Team. All rights reserved.

// REPLACE THE BELOW WITH YOUR CONFIG! This file shouldn't be version controlled.

(function() {
    module.exports = {
        mappings: {
            chitChatVoice: '224190000554573825',
            developers: '292740816185589760',
            digbot: '292741663401443331',
            digBotLog: '292741716644069376',
            events: '292739597891534851',
            general: '224190000554573824',
            herebedragons: '292740734488936459',
            staff: '292739522293399552',
            streams: '274762161148919808'
        },
        //Array and Object configs
        /*
            Text Channel ordering:
            Primary generals (general, staff, announcments)
            Community games (ps2, overwatch)
            Secondary generals (media, herebedragons)
            Recreational games (stellaris, eu4, doesn't have to be official recreational)
            Event channels (-e-)
            Temp channels (-t-)
            Whatever else (should be nothing)

            Voice:
            General
            Community games
            Recreational games
            Event channels (-e-)
            Temp channels (-t-)
            Whatever else (should be nothing)
        */
        positions: {
            text: {
                announcements: {
                    id: '292739218197839882',
                    name: 'announcements',
                    position: 1
                },
                rulesinfo: {
                    id: '288045481005678594',
                    name: 'rules-info',
                    position: 2
                },
                staff: {
                    id: '292739522293399552',
                    name: 'staff',
                    position: 3
                },
                events: {
                    id: '292739597891534851',
                    name: 'events',
                    position: 4
                },
                general: {
                    id: '224190000554573824',
                    name: 'entrance-general',
                    position: 5
                },
                ps2: {
                    id: '292739890519736320',
                    name: 'ps2',
                    position: 6
                },
                tts: {
                    id: '227718729448816641',
                    name: 'tts',
                    position: 15
                },
                media: {
                    id: '292740649235644416',
                    name: 'media',
                    position: 16
                },
                hereBeDragons: {
                    id: '292740734488936459',
                    name: 'herebedragons',
                    position: 17
                },
                streams: {
                    id: '274762161148919808',
                    name: 'streams',
                    position: 18
                },
                developers: {
                    id: '292740816185589760',
                    name: 'developers',
                    position: 19
                },
                developersArt: {
                    id: '292740896984924162',
                    name: 'developers-art',
                    position: 20
                },
                digbotspam: {
                    id: '292741663401443331',
                    name: 'digbot',
                    position: 21
                },
                digbotLog: {
                    id: '292741716644069376',
                    name: 'digbot-log',
                    position: 22
                },
                stellaris: {
                    id: '292741780431044609',
                    name: 'stellaris',
                    position: 23
                }
            },
            voice: {
                general: {
                    id: '224190000554573825',
                    name: '💬 Chit Chat',
                    position: 1
                },
                staff: {
                    id: '292742347207475202',
                    name: '👔 Staff',
                    position: 2
                },
                ps2DigMCS: {
                    id: '270160059382759424',
                    name: '🎮 PS2/DIG/1',
                    position: 3
                },
                ps2DigtMCS: {
                    id: '274410655795249153',
                    name: '🎮 PS2/DIGT/1',
                    position: 103
                },
                recMCS: {
                    id: '292742757553012736',
                    name: '🎮 Rec/1',
                    position: 406
                },
                afk: {
                    id: '274573766514704384',
                    name: '💤 AFK',
                    position: null
                }
            }
        }
    };
}());
