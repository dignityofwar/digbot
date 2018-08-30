//  Copyright © 2018 DIG Development team. All rights reserved.

(function() {
    module.exports = {
        mappings: {
            chitChatVoice: '290582293704343554',
            developers: '290638875309637632',
            digbot: '290638893081034758',
            digBotLog: '293062328897765378',
            events: '293061379760455693',
            general: '290582293704343553',
            herebedragons: '293062098114576394',
            ps2dig: '293061588221427722',
            staff: '293061334516367361',
            streams: '293062139696906240'
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
                    id: '293061070057111562',
                    name: 'announcements',
                    position: 1
                },
                rulesinfo: {
                    id: '293061291231412226',
                    name: 'rules-info',
                    position: 2
                },
                staff: {
                    id: '293061334516367361',
                    name: 'staff',
                    position: 3
                },
                events: {
                    id: '293061379760455693',
                    name: 'events',
                    position: 4
                },
                general: {
                    id: '290582293704343553',
                    name: 'entrance-general',
                    position: 5
                },
                ps2: {
                    id: '293061540494573580',
                    name: 'ps2',
                    position: 10
                },
                ps2dig: {
                    id: '293061588221427722',
                    name: 'ps2-dig',
                    position: 11
                },
                ps2digofficers: {
                    id: '293061636812439552',
                    name: 'ps2-digofficers',
                    position: 12
                },
                ps2digerecruitment: {
                    id: '314879384789975073',
                    name: 'ps2-dige-recruitment',
                    position: 13
                },
                ps2digetraining: {
                    id: '314879411289718786',
                    name: 'ps2-dige-training',
                    position: 14
                },
                ps2digediscussions: {
                    id: '314879439198486538',
                    name: 'ps2-dige-discussions',
                    position: 15
                },
                ps2digt: {
                    id: '222076841631023114',
                    name: 'ps2-digt',
                    position: 16
                },
                ps2millerupdates: {
                    id: '233914004345585664',
                    name: 'ps2-millerupdates',
                    position: 17
                },
                overwatch: {
                    id: '293061827926163457',
                    name: 'overwatch',
                    position: 20
                },
                warframe: {
                    id: '293061967399092224',
                    name: 'warframe',
                    position: 30
                },
                tts: {
                    id: '293062001381474304',
                    name: 'tts',
                    position: 40
                },
                media: {
                    id: '293062039994368010',
                    name: 'media',
                    position: 41
                },
                hereBeDragons: {
                    id: '293062098114576394',
                    name: 'herebedragons',
                    position: 42
                },
                streams: {
                    id: '293062139696906240',
                    name: 'streams',
                    position: 43
                },
                developers: {
                    id: '290638875309637632',
                    name: 'developers',
                    position: 50
                },
                developersArt: {
                    id: '293062219317510144',
                    name: 'developers-art',
                    position: 51
                },
                digbotspam: {
                    id: '290638893081034758',
                    name: 'digbot',
                    position: 52
                },
                digbotLog: {
                    id: '293062328897765378',
                    name: 'digbot-log',
                    position: 53
                },
                paradoxgames: {
                    id: '293062362691272704',
                    name: 'paradox-games',
                    position: 60
                },
                spaceEngineers: {
                    id: '293062408480489473',
                    name: 'spaceengineers',
                    position: 61
                },
                squad: {
                    id: '315639815657881611',
                    name: 'squad',
                    position: 62
                },
            },
            voice: {
                general: {
                    id: '290582293704343554',
                    name: '💬 Chit Chat',
                    position: 1
                },
                staff: {
                    id: '293062577624449034',
                    name: '👔 Staff',
                    position: 2
                },
                ps2DigMCS: {
                    id: '293062627767353344',
                    name: '🎮 PS2/DIG/1',
                    position: 3
                },
                ps2DigEMCS: {
                    id: '294567327939297280',
                    name: '🎮 PS2/DIGE/HIVE/1',
                    position: 53
                },
                ps2DigtMCS: {
                    id: '293062661984485386',
                    name: '🎮 PS2/DIGT/1',
                    position: 103
                },
                overwatchMCS: {
                    id: '293062696314732544',
                    name: '🎮 Overwatch/1',
                    position: 203
                },
                warframe: {
                    id: '293062837633548298',
                    name: '🎮 Warframe',
                    position: 405
                },
                recMCS: {
                    id: '293062873318555658',
                    name: '🎮 Rec/1',
                    position: 406
                },
                afk: {
                    id: '293062905518227466',
                    name: '💤 AFK',
                    position: null
                }
            }
        }
    };
}());
