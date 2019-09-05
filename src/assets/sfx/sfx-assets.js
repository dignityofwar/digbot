//  Copyright © 2018 DIG Development team. All rights reserved.

/* Asset module, stores links and paths for all sfx calls
 * Note: Sound Effects are intended to be short clips, please keep all files/links about 10s max
 * If you're hosting local and not on youtube you better have a good reason, i.e. DMCAs
 */
module.exports = {
    /* Local example:
    adminabuse: {
        source: 'local',
        path: '/src/assets/sfx/mp3/admin-abuse.mp3',
        options: {volume: 0.3},
        description: 'ADMIN ABUSE!'
    },
    */
    admin: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=dBph65LMuXE',
        options: { volume: 0.8 },
        description: 'ADMIN ABUSE!',
    },
    belleh: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=N6vw1aOEVds',
        options: { volume: 1 },
        description: 'GET IN MY BELLEH!',
    },
    beta: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=b3ln3-LpPFo',
        options: { volume: 1 },
        description: 'I\'m a bad player and a beta male',
    },
    brutal: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=e3uOMCfopR8',
        options: { volume: 0.8 },
        description: 'Brutal, savage, rekt.',
    },
    build: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=4aKGkW3Vi1I',
        options: { volume: 0.3 },
        description: 'We need to build a wall',
    },
    cena: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=cW7n6GpCsPM',
        options: { volume: 0.13 },
        description: 'And his name is JOHN CENA!',
    },
    crickets: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=CpGtBnVZLSk',
        options: { volume: 0.7 },
        description: 'Cricket sounds',
    },
    damn: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=zqy8sIPc1ug',
        options: { volume: 0.2 },
        description: 'Damn son where\'d you find this',
    },
    denied: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=bHWA_ijKwXk',
        options: { volume: 0.2 },
        description: 'Denied!',
    },
    dramatic: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=rbusENG6hCE',
        options: { volume: 0.2 },
        description: 'Dun dun duuuuun',
    },
    drums: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=VqaQDiqzNW0',
        options: { volume: 0.1 },
        description: 'drum roll',
    },
    farm: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=XNGBiZbAOhw',
        options: { volume: 1.1 },
        description: 'Thanks for the farm Jesus',
    },
    horn: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=IpyingiCwV8',
        options: { volume: 0.1 },
        description: 'MLG airhorn',
    },
    inception: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=1p-DA0zvuQ8',
        options: { volume: 0.2 },
        description: 'Inception BOOOOOM',
    },
    incompetent: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=9NeL3iYwCJk',
        options: { volume: 1.1 },
        description: 'You need to be less incompetent',
    },
    leeroy: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=yOMj7WttkOA',
        options: { volume: 0.05 },
        description: 'Leeroy Jenkins',
    },
    mad: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=xzpndHtdl9A',
        options: { volume: 1 },
        description: 'It\'s only game, why you heff to be mad?',
    },
    nopower: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=fBGWtVOKTkM',
        options: { volume: 1.3 },
        description: 'You have no power here',
    },
    ohhh: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=ffAFlvLaHBM',
        options: { volume: 0.04 },
        description: 'OOOOHHHHHHH',
    },
    ohmy: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=knaQetbeBrA',
        options: { volume: 2 },
        description: 'Oh my!',
    },
    nooo: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=npz14vTKR4I',
        options: { volume: 1 },
        description: 'Nooooooo',
    },
    rekt: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=gNrhX0Q0a6s',
        options: { volume: 0.15 },
        description: 'Get rekt',
    },
    rick: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=PAhoNoQ91_c',
        options: { volume: 0.7 },
        description: 'Rick and Morty: Wubalubadubdub',
    },
    shame: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=zRYUXdxcx44',
        options: { volume: 1 },
        description: 'Shame!',
    },
    shots: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=U76-3RQAHPg',
        options: { volume: 0.2 },
        description: 'Shots fired',
    },
    sparta: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=WUzthVZfmHA',
        options: { volume: 0.14 },
        description: 'This. Is. Sparta!',
    },
    touch: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=DlsD8ALShU4',
        options: { volume: 0.8 },
        description: 'Can\'t touch this',
    },
    trigger: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=4SJ5Qn83fHk',
        options: { volume: 0.8 },
        description: 'Rick and Morty: Pull the trigger!',
    },
    triggering: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=kZpwTDvRE7g',
        options: { volume: 0.25 },
        description: 'H3H3 triggering effect, sounds hiddious',
    },
    triple: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=XlLbsTP0C_U',
        options: { volume: 0.02 },
        description: 'Ohhh baby a triple',
    },
    violin: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=bHTe5gb_LnA',
        options: { volume: 0.1 },
        description: 'QQ violin',
    },
    wall: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=4aKGkW3Vi1I',
        options: { volume: 0.4 },
        description: 'The wall just got 10 feet higher',
    },
    wow: {
        source: 'youtube',
        link: 'https://www.youtube.com/watch?v=LYkg-B6f5iA',
        options: { volume: 0.8 },
        description: 'Wooooow',
    },
};
