//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

/* Asset module for play.js, stores youtube links, if you add a playlist try to include 50+ items to
mitigate repitition, remember newer videos/songs tend to be louder cos of loudness war */

/* If you want to add to playlists configure the vollume via a test playlist with only one index
const test = {
    1: {
        name: 'Gotta catch \'em all',
        link: 'https://www.youtube.com/watch?v=JuYeHPFR3f0',
        volume: 0.02
    }
}; */

const fun = {
    1: {
        name: 'Gangnam style',
        link: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        volume: 0.015
    },
    2: {
        name: 'In the navy',
        link: 'https://www.youtube.com/watch?v=InBXu-iY7cw',
        volume: 0.055
    },
    3: {
        name: 'YMCA',
        link: 'https://www.youtube.com/watch?v=CS9OO0S5w2k',
        volume: 0.05
    },
    4: {
        name: 'Ghostbusters',
        link: 'https://www.youtube.com/watch?v=m9We2XsVZfc',
        volume: 0.035
    },
    5: {
        name: 'Kung fu fighting',
        link: 'https://www.youtube.com/watch?v=BwBKjK7Xik0',
        volume: 0.028
    },
    6: {
        name: 'Staying alive',
        link: 'https://www.youtube.com/watch?v=_Vj092UgKwQ',
        volume: 0.03
    },
    7: {
        name: 'Turn down for what',
        link: 'https://www.youtube.com/watch?v=CES32EOxiyw',
        volume: 0.02
    },
    8: {
        name: 'Roman history',
        link: 'https://www.youtube.com/watch?v=y6gf84sw5kk',
        volume: 0.02
    },
    9: {
        name: 'Call on me',
        link: 'https://www.youtube.com/watch?v=L_fCqg92qks',
        volume: 0.04
    },
    10: {
        name: 'Stacy\'s mom',
        link: 'https://www.youtube.com/watch?v=dZLfasMPOU4',
        volume: 0.05
    },
    // 11: {
    //     name: 'Danger zone',
    //     link: 'https://www.youtube.com/watch?v=siwpn14IE7E',
    //     volume: 0.04
    // },
    12: {
        name: 'Push it to the limit',
        link: 'https://www.youtube.com/watch?v=9D-QD_HIfjA',
        volume: 0.04
    },
    13: {
        name: 'I need a hero',
        link: 'https://www.youtube.com/watch?v=OBwS66EBUcY',
        volume: 0.04
    },
    14: {
        name: 'Eye of the tiger',
        link: 'https://www.youtube.com/watch?v=btPJPFnesV4',
        volume: 0.04
    },
    15: {
        name: 'Never gonna give you up',
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        volume: 0.04
    },
    16: {
        name: 'Friday',
        link: 'https://www.youtube.com/watch?v=kfVsfOSbJY0',
        volume: 0.025
    },
    // 17: {
    //     name: 'She said',
    //     link: 'https://www.youtube.com/watch?v=rQjh9H-ymK4',
    //     volume: 0.03
    // },
    18: {
        name: 'It\'s the end of the world as we know it',
        link: 'https://www.youtube.com/watch?v=zeo0_3gN190',
        volume: 0.03
    },
    19: {
        name: 'We didn\'t start the fire',
        link: 'https://www.youtube.com/watch?v=eFTLKWw542g',
        volume: 0.03
    },
    20: {
        name: 'Uptown girl',
        link: 'https://www.youtube.com/watch?v=hCuMWrfXG4E',
        volume: 0.035
    },
    21: {
        name: 'Let it go',
        link: 'https://www.youtube.com/watch?v=kHue-HaXXzg',
        volume: 0.04
    },
    22: {
        name: 'Cups',
        link: 'https://www.youtube.com/watch?v=pjcOzqxu4JQ',
        volume: 0.04
    },
    23: {
        name: 'Bang bang',
        link: 'https://www.youtube.com/watch?v=4h5siv_mPZA',
        volume: 0.045
    },
    24: {
        name: 'Asshole',
        link: 'https://www.youtube.com/watch?v=UrgpZ0fUixs',
        volume: 0.035
    },
    25: {
        name: 'Jizz in my pants',
        link: 'https://www.youtube.com/watch?v=Y8dtyNycdM0',
        volume: 0.025
    },
    26: {
        name: 'Because I got high',
        link: 'https://www.youtube.com/watch?v=WeYsTmIzjkw',
        volume: 0.06
    },
    27: {
        name: 'I\'m sexy and I know it',
        link: 'https://www.youtube.com/watch?v=4xBQ_iydufE',
        volume: 0.025
    },
    28: {
        name: 'I\'m on a boat',
        link: 'https://www.youtube.com/watch?v=jheEi_R0kV0',
        volume: 0.025
    },
    29: {
        name: 'It wasn\'t me',
        link: 'https://www.youtube.com/watch?v=pslgz9o8meM',
        volume: 0.04
    },
    // 30: {
    //     name: 'Mr Boombastic',
    //     link: 'https://www.youtube.com/watch?v=6W5pq4bIzIw',
    //     volume: 0.04
    // },
    31: {
        name: 'Gold digger',
        link: 'https://www.youtube.com/watch?v=6vwNcNOTVzY',
        volume: 0.04
    },
    32: {
        name: 'Wonderzerg',
        link: 'https://www.youtube.com/watch?v=4lcskqHdn_4',
        volume: 0.03
    },
    33: {
        name: 'Tribute',
        link: 'https://www.youtube.com/watch?v=P5M04_qkRdY',
        volume: 0.03
    },
    34: {
        name: 'Teenage dirtbag',
        link: 'https://www.youtube.com/watch?v=FC3y9llDXuM',
        volume: 0.045
    },
    35: {
        name: 'Anything goes',
        link: 'https://www.youtube.com/watch?v=r7NJ9ylAhos',
        volume: 0.03
    },
    36: {
        name: 'Who do you think you are kidding mr Hitler',
        link: 'https://www.youtube.com/watch?v=Jvr6X054xLY',
        volume: 0.03
    },
    37: {
        name: 'Hurt',
        link: 'https://www.youtube.com/watch?v=vt1Pwfnh5pc',
        volume: 0.03
    },
    38: {
        name: 'Sunshine, lollipops and ranbows',
        link: 'https://www.youtube.com/watch?v=0zBoD_ojxFA',
        volume: 0.03
    },
    39: {
        name: 'Somewhere over the rainbow',
        link: 'https://www.youtube.com/watch?v=V1bFr2SWP1I',
        volume: 0.045
    },
    40: {
        name: 'Guren no yumiya',
        link: 'https://www.youtube.com/watch?v=Pn7dCgtwX2c',
        volume: 0.025
    },
    41: {
        name: 'Amish paradise',
        link: 'https://www.youtube.com/watch?v=lOfZLb33uCg',
        volume: 0.04
    },
    42: {
        name: 'PPAP',
        link: 'https://www.youtube.com/watch?v=Ct6BUPvE2sM',
        volume: 0.012
    },
    43: {
        name: 'Gotta catch \'em all',
        link: 'https://www.youtube.com/watch?v=JuYeHPFR3f0',
        volume: 0.02
    }
};

const nightcore = {
    1: {
        name: 'This little girl',
        link: 'https://www.youtube.com/watch?v=c0mX-5q3mrY',
        volume: 0.02
    },
    2: {
        name: 'Shelter',
        link: 'https://www.youtube.com/watch?v=GH2lIy0fyq0',
        volume: 0.025
    },
    3: {
        name: 'Faded',
        link: 'https://www.youtube.com/watch?v=F3JBn7ZCIHg',
        volume: 0.025
    },
    4: {
        name: 'Bring me to live',
        link: 'https://www.youtube.com/watch?v=wL-2Cu6zSNk',
        volume: 0.020
    },
    5: {
        name: 'Angel with a shotgun',
        link: 'https://www.youtube.com/watch?v=cvaIgq5j2Q8',
        volume: 0.030
    },
    6: {
        name: 'I\'m not here for your entertainment',
        link: 'https://www.youtube.com/watch?v=h7Nv1Jy1d0Y',
        volume: 0.025
    },
    7: {
        name: 'How do you love someone',
        link: 'https://www.youtube.com/watch?v=7RGTFmF-brI',
        volume: 0.025
    },
    8: {
        name: 'Shatter me',
        link: 'https://www.youtube.com/watch?v=WkLO8llyN64',
        volume: 0.025
    },
    9: {
        name: 'Metropolis',
        link: 'https://www.youtube.com/watch?v=SBS-1A3fD3U',
        volume: 0.025
    },
    10: {
        name: 'Fireflies',
        link: 'https://www.youtube.com/watch?v=k2pKfFP0anY',
        volume: 0.035
    },
    11: {
        name: 'Counting stars',
        link: 'https://www.youtube.com/watch?v=cSpnJjM1H24',
        volume: 0.030
    },
    12: {
        name: 'Hall of fame',
        link: 'https://www.youtube.com/watch?v=h2XTsWgN0CU',
        volume: 0.025
    },
    13: {
        name: 'Rather be',
        link: 'https://www.youtube.com/watch?v=tyaPqW0bO5M',
        volume: 0.03
    },
    14: {
        name: 'Stereo heart',
        link: 'https://www.youtube.com/watch?v=DizPgDu4s-0',
        volume: 0.02
    },
    15: {
        name: 'Glad you came',
        link: 'https://www.youtube.com/watch?v=vu5Q5Fox2ng',
        volume: 0.025
    },
    16: {
        name: 'Centuries',
        link: 'https://www.youtube.com/watch?v=mgz1wdlkzcs',
        volume: 0.035
    },
    17: {
        name: 'This is war',
        link: 'https://www.youtube.com/watch?v=y7CuNfVq790',
        volume: 0.02
    },
    18: {
        name: 'Angel of darkness',
        link: 'https://www.youtube.com/watch?v=YrhYhI3L32c',
        volume: 0.025
    },
    19: {
        name: 'God is a girl',
        link: 'https://www.youtube.com/watch?v=TiVIFMbwxOc',
        volume: 0.025
    },
    20: {
        name: 'Die young',
        link: 'https://www.youtube.com/watch?v=t-pXfYq-Omg',
        volume: 0.025
    },
    21: {
        name: 'Burn',
        link: 'https://www.youtube.com/watch?v=M2ZtCO01jL0',
        volume: 0.035
    },
    22: {
        name: 'What I\'ve done',
        link: 'https://www.youtube.com/watch?v=ZbHz930cGRo',
        volume: 0.025
    },
    23: {
        name: 'Demons',
        link: 'https://www.youtube.com/watch?v=bOpLs6qfYoI',
        volume: 0.03
    },
    24: {
        name: 'Pompeii',
        link: 'https://www.youtube.com/watch?v=ThPp2NA6Mcw',
        volume: 0.025
    },
    25: {
        name: 'Clarity',
        link: 'https://www.youtube.com/watch?v=9buluPWlkAA',
        volume: 0.025
    },
    26: {
        name: 'Payphone',
        link: 'https://www.youtube.com/watch?v=1zn-5YVG3Sw',
        volume: 0.03
    },
    27: {
        name: 'Whistle',
        link: 'https://www.youtube.com/watch?v=D-uq71pLEHQ',
        volume: 0.025
    },
    28: {
        name: 'Moves like Jagger',
        link: 'https://www.youtube.com/watch?v=0JLBvoKO9jU',
        volume: 0.025
    },
    29: {
        name: 'Courtesy call',
        link: 'https://www.youtube.com/watch?v=IevsaST5LOE',
        volume: 0.03
    },
    30: {
        name: 'You\'re gunna go far kid',
        link: 'https://www.youtube.com/watch?v=mdML5WPEhEY',
        volume: 0.025
    },
    31: {
        name: 'Whispers in the dark',
        link: 'https://www.youtube.com/watch?v=fpNJfaDTqgY',
        volume: 0.025
    },
    32: {
        name: 'Highschool never ends',
        link: 'https://www.youtube.com/watch?v=0-ZedvmqTc8',
        volume: 0.025
    },
    33: {
        name: 'Gives you hell',
        link: 'https://www.youtube.com/watch?v=FfhB_uCTdws',
        volume: 0.055
    },
    34: {
        name: 'Cheap thrills',
        link: 'https://www.youtube.com/watch?v=gRkBSvkqyoU',
        volume: 0.03
    },
    35: {
        name: 'One woman army',
        link: 'https://www.youtube.com/watch?v=VNNMOoOA68A',
        volume: 0.025
    },
    36: {
        name: 'Headphones',
        link: 'https://www.youtube.com/watch?v=IvMYDp_c66Q',
        volume: 0.020
    },
    37: {
        name: 'Circles',
        link: 'https://www.youtube.com/watch?v=Q4qjTdJh2ms',
        volume: 0.017
    },
    38: {
        name: 'Gasoline',
        link: 'https://www.youtube.com/watch?v=pPJDCBC7YU4',
        volume: 0.02
    },
    39: {
        name: 'Paper crown',
        link: 'https://www.youtube.com/watch?v=0k-JNMlnbCs',
        volume: 0.02
    },
    40: {
        name: 'Don\'t trust me',
        link: 'https://www.youtube.com/watch?v=yyRW2wWFO1I',
        volume: 0.02
    },
    41: {
        name: 'Mamma mia',
        link: 'https://www.youtube.com/watch?v=EtApr1kkgVs',
        volume: 0.025
    },
    42: {
        name: 'Kids in america',
        link: 'https://www.youtube.com/watch?v=iPgz1gqIxYg',
        volume: 0.025
    },
    43: {
        name: 'YMCA',
        link: 'https://www.youtube.com/watch?v=a_x92uAgIBM',
        volume: 0.025
    },
    // 44: {
    //     name: 'Does your mother know',
    //     link: 'https://www.youtube.com/watch?v=WkL7Fkigfn8',
    //     volume: 0.025
    // },
    45: {
        name: 'Blackout',
        link: 'https://www.youtube.com/watch?v=5I-r3Z_tm7I',
        volume: 0.025
    },
    46: {
        name: 'Battle scars',
        link: 'https://www.youtube.com/watch?v=yL45iv7lMTY',
        volume: 0.02
    },
    47: {
        name: 'Sugar we\'re going down',
        link: 'https://www.youtube.com/watch?v=UTGgTlyFg9U',
        volume: 0.02
    },
    48: {
        name: 'I will not bow',
        link: 'https://www.youtube.com/watch?v=aOTa3CKZhbA',
        volume: 0.025
    },
    49: {
        name: 'Wolf in sheep\'s clothing',
        link: 'https://www.youtube.com/watch?v=Il80XSU9ThU',
        volume: 0.025
    },
    50: {
        name: 'I write sins, not tragedies',
        link: 'https://www.youtube.com/watch?v=iauZ2QK1RVA',
        volume: 0.025
    },
    51: {
        name: 'Vivva la vida',
        link: 'https://www.youtube.com/watch?v=njq-jVEhpao',
        volume: 0.045
    },
    52: {
        name: '21 Guns',
        link: 'https://www.youtube.com/watch?v=IJk3w2kQ-K8',
        volume: 0.015
    },
    53: {
        name: 'Release me',
        link: 'https://www.youtube.com/watch?v=jzQY4H8uBo0',
        volume: 0.02
    }
};

const nineties = {
    1: {
        name: 'Bitter sweet symphony',
        link: 'https://www.youtube.com/watch?v=1lyu1KKwC74',
        volume: 0.04
    },
    // 2: {
    //     name: 'Wonderwall',
    //     link: 'https://www.youtube.com/watch?v=bx1Bh8ZvH84',
    //     volume: 0.04
    // },
    3: {
        name: 'Vouge',
        link: 'https://www.youtube.com/watch?v=GuJQSAiODqI',
        volume: 0.045
    },
    4: {
        name: 'Another day in paradise',
        link: 'https://www.youtube.com/watch?v=Qt2mbGP6vFI',
        volume: 0.06
    },
    5: {
        name: 'Cradle of love',
        link: 'https://www.youtube.com/watch?v=_OfpeVJiZIY',
        volume: 0.07
    },
    6: {
        name: 'I wanna be rich',
        link: 'https://www.youtube.com/watch?v=Ztk9t_m1FpY',
        volume: 0.04
    },
    // 7: {
    //     name: 'I do it for you',
    //     link: 'https://www.youtube.com/watch?v=fXtlWmBM-HU',
    //     volume: 0.07
    // },
    8: {
        name: 'Gunna make you sweat',
        link: 'https://www.youtube.com/watch?v=LaTGrV58wec',
        volume: 0.07
    },
    9: {
        name: 'Baby, baby',
        link: 'https://www.youtube.com/watch?v=vMXuuYnoRdI',
        volume: 0.06
    },
    10: {
        name: 'Right here, right now',
        link: 'https://www.youtube.com/watch?v=lwpjsToHzAE',
        volume: 0.06
    },
    11: {
        name: 'Good vibrations',
        link: 'https://www.youtube.com/watch?v=efJZDJTACes',
        volume: 0.05
    },
    12: {
        name: 'Shiny happy people',
        link: 'https://www.youtube.com/watch?v=YYOKMUTTDdA',
        volume: 0.05
    },
    13: {
        name: 'Baby got back',
        link: 'https://www.youtube.com/watch?v=qr89yq2wC9o',
        volume: 0.055
    },
    14: {
        name: 'Rythm is a dancer',
        link: 'https://www.youtube.com/watch?v=JYIaWeVL1JM',
        volume: 0.04
    },
    15: {
        name: 'Bohemian rhapsody',
        link: 'https://www.youtube.com/watch?v=axAtWjn3MfI',
        volume: 0.045
    },
    // 16: {
    //     name: 'Jump around',
    //     link: 'https://www.youtube.com/watch?v=XhzpxjuwZy0',
    //     volume: 0.045
    // },
    17: {
        name: 'G thang',
        link: 'https://www.youtube.com/watch?v=0twahcMCgss',
        volume: 0.06
    },
    18: {
        name: 'I would do anything for love',
        link: 'https://www.youtube.com/watch?v=ij1AJRymxvA',
        volume: 0.055
    },
    19: {
        name: 'What is love',
        link: 'https://www.youtube.com/watch?v=HEXWRTEbj1I',
        volume: 0.045
    },
    20: {
        name: 'Hero',
        link: 'https://www.youtube.com/watch?v=tLFfXTwdVbY',
        volume: 0.04
    },
    21: {
        name: 'Hero',
        link: 'https://www.youtube.com/watch?v=w7y19ED6Vrk',
        volume: 0.065
    },
    22: {
        name: 'Gangsta\'s paradise',
        link: 'https://www.youtube.com/watch?v=N6voHeEa3ig',
        volume: 0.06
    },
    23: {
        name: 'In the summer time',
        link: 'https://www.youtube.com/watch?v=JKWV7gX1UkY',
        volume: 0.06
    },
    // 24: {
    //     name: 'Cotten eyed Joe',
    //     link: 'https://www.youtube.com/watch?v=mOYZaiDZ7BM',
    //     volume: 0.06
    // },
    25: {
        name: 'Macarena',
        link: 'https://www.youtube.com/watch?v=VjC7HaMSFmo',
        volume: 0.05
    },
    26: {
        name: 'Breakfast at Tiffany\'s',
        link: 'https://www.youtube.com/watch?v=QSgJ5On8Zso',
        volume: 0.065
    },
    27: {
        name: 'I believe I can fly',
        link: 'https://www.youtube.com/watch?v=zK2ZuescJGA',
        volume: 0.05
    },
    28: {
        name: 'Wannabe',
        link: 'https://www.youtube.com/watch?v=8X-2czaa3WA',
        volume: 0.05
    },
    // 29: {
    //     name: 'I\'ll be',
    //     link: 'https://www.youtube.com/watch?v=jtvuFriX7zc',
    //     volume: 0.06
    // },
    30: {
        name: 'Go the distance',
        link: 'https://www.youtube.com/watch?v=m6v_gOmVJ4I',
        volume: 0.065
    },
    // 31: {
    //     name: 'Baby one more time',
    //     link: 'https://www.youtube.com/watch?v=C-u5WLJ9Yk4',
    //     volume: 0.055
    // },
    32: {
        name: 'Genie in a bottle',
        link: 'https://www.youtube.com/watch?v=Iu7Ixskp0dY',
        volume: 0.06
    },
    33: {
        name: 'Living la vida loca',
        link: 'https://www.youtube.com/watch?v=ltRgb4SJ1uk',
        volume: 0.04
    },
    34: {
        name: 'All star',
        link: 'https://www.youtube.com/watch?v=5xxQs34UMx4',
        volume: 0.035
    },
    35: {
        name: 'Iris',
        link: 'https://www.youtube.com/watch?v=aNO6yd66PpA',
        volume: 0.035
    },
    36: {
        name: 'Don\'t speak',
        link: 'https://www.youtube.com/watch?v=TR3Vdo5etCQ',
        volume: 0.06
    },
    37: {
        name: 'Ready to go',
        link: 'https://www.youtube.com/watch?v=JgffRW1fKDk',
        volume: 0.06
    },
    38: {
        name: 'I\'m a bitch I\'m a lover',
        link: 'https://www.youtube.com/watch?v=6ge53QaDpKQ',
        volume: 0.065
    },
    39: {
        name: 'Never there',
        link: 'https://www.youtube.com/watch?v=VxqaI_c9j_g',
        volume: 0.065
    },
    40: {
        name: 'Smells like teen spirit',
        link: 'https://www.youtube.com/watch?v=hTWKbfoikeg',
        volume: 0.065
    },
    41: {
        name: 'Losing my religion',
        link: 'https://www.youtube.com/watch?v=xwtdhWltSIg',
        volume: 0.065
    },
    42: {
        name: 'Ice ice baby',
        link: 'https://www.youtube.com/watch?v=rog8ou-ZepE',
        volume: 0.075
    },
    43: {
        name: 'Believe',
        link: 'https://www.youtube.com/watch?v=ZOm0BruEVT0',
        volume: 0.065
    },
    44: {
        name: 'Torn',
        link: 'https://www.youtube.com/watch?v=VV1XWJN3nJo',
        volume: 0.07
    },
    45: {
        name: 'Tradegy',
        link: 'https://www.youtube.com/watch?v=OiwDHHcHPh0',
        volume: 0.06
    },
    46: {
        name: 'Bring it all back',
        link: 'https://www.youtube.com/watch?v=wfcAvS4QbDg',
        volume: 0.07
    },
    47: {
        name: 'Boom boom boom boom',
        link: 'https://www.youtube.com/watch?v=llyiQ4I-mcQ',
        volume: 0.07
    },
    48: {
        name: 'Angels',
        link: 'https://www.youtube.com/watch?v=luwAMFcc2f8',
        volume: 0.07
    },
    49: {
        name: 'Three lions',
        link: 'https://www.youtube.com/watch?v=OzxMjBEazas',
        volume: 0.07
    },
    50: {
        name: 'No scrubs',
        link: 'https://www.youtube.com/watch?v=FrLequ6dUdM',
        volume: 0.055
    }
};

const noughties = {
    1: {
        name: 'Mother knows best',
        link: 'https://www.youtube.com/watch?v=yCmsZUN4r_s',
        volume: 0.055
    },
    2: {
        name: 'Smooth',
        link: 'https://www.youtube.com/watch?v=Ce1r05SSbwA',
        volume: 0.025
    },
    3: {
        name: 'Bye bye bye',
        link: 'https://www.youtube.com/watch?v=Eo-KmOd3i7s',
        volume: 0.04
    },
    4: {
        name: 'Oops I did it again',
        link: 'https://www.youtube.com/watch?v=DEsqGOHo0nI',
        volume: 0.035
    },
    5: {
        name: 'Hanging by a moment',
        link: 'https://www.youtube.com/watch?v=a4_woZ-LUvM',
        volume: 0.03
    },
    6: {
        name: 'Thank you',
        link: 'https://www.youtube.com/watch?v=hQiipuDbbxw',
        volume: 0.03
    },
    7: {
        name: 'Survivor',
        link: 'https://www.youtube.com/watch?v=Ki97oF8LBFE',
        volume: 0.025
    },
    8: {
        name: 'Don\'t tell me',
        link: 'https://www.youtube.com/watch?v=FRLHro9EPD0',
        volume: 0.035
    },
    9: {
        name: 'Dream come true',
        link: 'https://www.youtube.com/watch?v=WB9_sf6oV1o',
        volume: 0.035
    },
    10: {
        name: 'Beautiful day',
        link: 'https://www.youtube.com/watch?v=co6WMzDOh1o',
        volume: 0.025
    },
    11: {
        name: 'Hero',
        link: 'https://www.youtube.com/watch?v=Gb6thMzC0x8',
        volume: 0.03
    },
    12: {
        name: 'How you remind me',
        link: 'https://www.youtube.com/watch?v=1cQh1ccqu8M',
        volume: 0.025
    },
    // 13: {
    //     name: 'Hot in here',
    //     link: 'https://www.youtube.com/watch?v=GeZZr_p6vB8',
    //     volume: 0.025
    // },
    14: {
        name: 'Wherever you will go',
        link: 'https://www.youtube.com/watch?v=iAP9AF6DCu4',
        volume: 0.025
    },
    15: {
        name: 'A thousand miles',
        link: 'https://www.youtube.com/watch?v=Cwkej79U3ek',
        volume: 0.025
    },
    16: {
        name: 'In the end',
        link: 'https://www.youtube.com/watch?v=eVTXPUF4Oz4',
        volume: 0.018
    },
    17: {
        name: 'Complicated',
        link: 'https://www.youtube.com/watch?v=FynZChaDqQs',
        volume: 0.025
    },
    18: {
        name: 'Get the party started',
        link: 'https://www.youtube.com/watch?v=RD6V6HPccbY',
        volume: 0.015
    },
    19: {
        name: 'Whenever wherever',
        link: 'https://www.youtube.com/watch?v=wZOqrx0ETGk',
        volume: 0.04
    },
    20: {
        name: 'Sk8er boi',
        link: 'https://www.youtube.com/watch?v=6GiRYc0xgzk',
        volume: 0.03
    },
    // 21: {
    //     name: 'Ignition',
    //     link: 'https://www.youtube.com/watch?v=y6y_4_b6RS8',
    //     volume: 0.03
    // },
    22: {
        name: 'Bring me to life',
        link: 'https://www.youtube.com/watch?v=D-Fykb5eyhc',
        volume: 0.028
    },
    23: {
        name: 'I\'m with you',
        link: 'https://www.youtube.com/watch?v=s8LPUk13D9Y',
        volume: 0.033
    },
    24: {
        name: 'Where is the love',
        link: 'https://www.youtube.com/watch?v=WpYeekQkAdc',
        volume: 0.03
    },
    25: {
        name: 'Lose yourself',
        link: 'https://www.youtube.com/watch?v=6Un9HLDCTCs',
        volume: 0.03
    },
    26: {
        name: 'Rock your body',
        link: 'https://www.youtube.com/watch?v=qo9EFUWyG8A',
        volume: 0.035
    },
    // 27: {
    //     name: 'Yeah',
    //     link: 'https://www.youtube.com/watch?v=GxBSyx85Kp8',
    //     volume: 0.025
    // },
    28: {
        name: 'This love',
        link: 'https://www.youtube.com/watch?v=pI2Q8L8L3Ks',
        volume: 0.022
    },
    29: {
        name: 'White flag',
        link: 'https://www.youtube.com/watch?v=i-Hv2ZVYm7A',
        volume: 0.020
    },
    30: {
        name: 'Boulevard of broken dreams',
        link: 'https://www.youtube.com/watch?v=r5EXKDlf44M',
        volume: 0.018
    },
    31: {
        name: 'Mr brightside',
        link: 'https://www.youtube.com/watch?v=SrkeWsQZNyU',
        volume: 0.02
    },
    32: {
        name: 'Sugar we\'re going down',
        link: 'https://www.youtube.com/watch?v=Ufb70h78eO4',
        volume: 0.03
    },
    33: {
        name: 'Photograph',
        link: 'https://www.youtube.com/watch?v=vYbxjRIF-kM',
        volume: 0.03
    },
    34: {
        name: 'Because of you',
        link: 'https://www.youtube.com/watch?v=CTTjLxXFg0k',
        volume: 0.035
    },
    35: {
        name: 'Numb/Encore',
        link: 'https://www.youtube.com/watch?v=JcOwJh4F40M',
        volume: 0.025
    },
    36: {
        name: 'Bad day',
        link: 'https://www.youtube.com/watch?v=RmNTAvnSais',
        volume: 0.03
    },
    37: {
        name: 'Hips don\'t lie',
        link: 'https://www.youtube.com/watch?v=9mEibMZYfmg',
        volume: 0.025
    },
    38: {
        name: 'Unwritten',
        link: 'https://www.youtube.com/watch?v=cFFBSSntZgs',
        volume: 0.04
    },
    39: {
        name: 'Sexy back',
        link: 'https://www.youtube.com/watch?v=FdSRfdu_dLU',
        volume: 0.035
    },
    40: {
        name: 'Umbrella',
        link: 'https://www.youtube.com/watch?v=DaXvLTSxmKc',
        volume: 0.03
    },
    41: {
        name: 'The sweet escape',
        link: 'https://www.youtube.com/watch?v=psrjbmOv4RA',
        volume: 0.02
    },
    42: {
        name: 'Hey there Delilah',
        link: 'https://www.youtube.com/watch?v=hQlPzrX8u0A',
        volume: 0.023
    },
    43: {
        name: 'This ain\'t a scene, it\'s an arms race',
        link: 'https://www.youtube.com/watch?v=FJUJW589HZI',
        volume: 0.03
    },
    44: {
        name: 'Chasing cars',
        link: 'https://www.youtube.com/watch?v=GemKqzILV4w',
        volume: 0.055
    },
    45: {
        name: 'Shut up and drive',
        link: 'https://www.youtube.com/watch?v=U-Dk0O42c2s',
        volume: 0.03
    },
    46: {
        name: 'Please don\'t stop the music',
        link: 'https://www.youtube.com/watch?v=dZJ9tx_zk4A',
        volume: 0.025
    },
    // 47: {
    //     name: 'I\'m yours',
    //     link: 'https://www.youtube.com/watch?v=EkHTsc9PU2A',
    //     volume: 0.03
    // },
    48: {
        name: 'Hot \'n cold',
        link: 'https://www.youtube.com/watch?v=A_FreDrOFd0',
        volume: 0.03
    },
    49: {
        name: 'Boom boom pow',
        link: 'https://www.youtube.com/watch?v=N-Tzs5iJVa4',
        volume: 0.032
    },
    50: {
        name: 'Poker face',
        link: 'https://www.youtube.com/watch?v=bESGLojNYSo',
        volume: 0.035
    },
    51: {
        name: 'I gotta feeling',
        link: 'https://www.youtube.com/watch?v=GAFSFmnxxBc',
        volume: 0.05
    }
};

const tennies = {
    1: {
        name: 'Tik tok',
        link: 'https://www.youtube.com/watch?v=iP6XpLQM2Cs',
        volume: 0.025
    },
    2: {
        name: 'Hey soul sister',
        link: 'https://www.youtube.com/watch?v=3JV74i4yvcA',
        volume: 0.02
    },
    3: {
        name: 'Airplane',
        link: 'https://www.youtube.com/watch?v=ikCzsLqfXRk',
        volume: 0.03
    },
    4: {
        name: 'Dynamite',
        link: 'https://www.youtube.com/watch?v=sLqdRmwY6vc',
        volume: 0.03
    },
    5: {
        name: 'Break your heart',
        link: 'https://www.youtube.com/watch?v=GvrTSZ-x_Pk',
        volume: 0.025
    },
    6: {
        name: 'I like it',
        link: 'https://www.youtube.com/watch?v=KgLOeEzM0Jc',
        volume: 0.02
    },
    7: {
        name: 'Fireflies',
        link: 'https://www.youtube.com/watch?v=ytBR7ET_6uU',
        volume: 0.03
    },
    8: {
        name: 'Teenage dream',
        link: 'https://www.youtube.com/watch?v=YS_3KyMiZUU',
        volume: 0.03
    },
    9: {
        name: 'Fireworks',
        link: 'https://www.youtube.com/watch?v=AvC1nEknbyc',
        volume: 0.025
    },
    10: {
        name: 'Fuck you',
        link: 'https://www.youtube.com/watch?v=CAV0XrbEwNc',
        volume: 0.025
    },
    11: {
        name: 'Moves like Jagger',
        link: 'https://www.youtube.com/watch?v=suRsxpoAc5w',
        volume: 0.02
    },
    12: {
        name: 'Raise your glass',
        link: 'https://www.youtube.com/watch?v=570tFRoRR0A',
        volume: 0.025
    },
    13: {
        name: 'Call me maybe',
        link: 'https://www.youtube.com/watch?v=dv6a-uOEGdo',
        volume: 0.025
    },
    14: {
        name: 'Lights',
        link: 'https://www.youtube.com/watch?v=0NKUpo_xKyQ',
        volume: 0.04
    },
    15: {
        name: 'Payphone',
        link: 'https://www.youtube.com/watch?v=H1H1lI73mmE',
        volume: 0.03
    },
    16: {
        name: 'What makes you beautiful',
        link: 'https://www.youtube.com/watch?v=CjPc8RVJ0Dc',
        volume: 0.02
    },
    17: {
        name: 'Wild ones',
        link: 'https://www.youtube.com/watch?v=nOeBGlyz-Ok',
        volume: 0.013
    },
    18: {
        name: 'Starships',
        link: 'https://www.youtube.com/watch?v=u4cFNwqX8hA',
        volume: 0.015
    },
    // 19: {
    //     name: 'Part of me',
    //     link: 'https://www.youtube.com/watch?v=2Fko7_SV3Lc',
    //     volume: 0.02
    // },
    20: {
        name: 'We are never ever getting back together',
        link: 'https://www.youtube.com/watch?v=n2Ez-w-zvd4',
        volume: 0.02
    },
    21: {
        name: 'Turn me on',
        link: 'https://www.youtube.com/watch?v=WLTI2rWAlV4',
        volume: 0.025
    },
    22: {
        name: 'Radioactive',
        link: 'https://www.youtube.com/watch?v=y_8Mgn30xRU',
        volume: 0.02
    },
    23: {
        name: 'Can\'t hold us',
        link: 'https://www.youtube.com/watch?v=VG3JsmOmDqw',
        volume: 0.015
    },
    // 23: {
    //     name: 'Roar',
    //     link: 'https://www.youtube.com/watch?v=LH0itrvHiRw',
    //     volume: 0.03
    // },
    24: {
        name: 'Royals',
        link: 'https://www.youtube.com/watch?v=l0SQxIC0utQ',
        volume: 0.025
    },
    // 25: {
    //     name: 'Hall of fame',
    //     link: 'https://www.youtube.com/watch?v=NH7I79fLiSw',
    //     volume: 0.02
    // },
    26: {
        name: 'Happy',
        link: 'https://www.youtube.com/watch?v=H0m3Lfkzcw4',
        volume: 0.025
    },
    27: {
        name: 'Dark horse',
        link: 'https://www.youtube.com/watch?v=0VV-LAs51II',
        volume: 0.02
    },
    28: {
        name: 'Fancy',
        link: 'https://www.youtube.com/watch?v=vO62S3FK-7Q',
        volume: 0.018
    },
    29: {
        name: 'Shake it off',
        link: 'https://www.youtube.com/watch?v=zIOVMHMNfJ4',
        volume: 0.02
    },
    30: {
        name: 'Best day of my life',
        link: 'https://www.youtube.com/watch?v=0fTUj9mfnUk',
        volume: 0.02
    },
    31: {
        name: 'Trumpets',
        link: 'https://www.youtube.com/watch?v=r5WqquVMPAA',
        volume: 0.02
    },
    32: {
        name: 'Me and my broken heart',
        link: 'https://www.youtube.com/watch?v=ie1wU9BLGn8',
        volume: 0.02
    },
    33: {
        name: 'Uptown funk',
        link: 'https://www.youtube.com/watch?v=ziN7Y1M1v8s',
        volume: 0.02
    },
    // 34: {
    //     name: 'See you again',
    //     link: 'https://www.youtube.com/watch?v=LWfFm-fsXIc',
    //     volume: 0.02
    // },
    35: {
        name: 'Sugar',
        link: 'https://www.youtube.com/watch?v=7vw84EkHOlY',
        volume: 0.02
    },
    36: {
        name: 'Shut up and dance',
        link: 'https://www.youtube.com/watch?v=mjdIJ5ZSpSk',
        volume: 0.02
    },
    37: {
        name: 'Blank space',
        link: 'https://www.youtube.com/watch?v=e-ORhEE9VVg',
        volume: 0.02
    },
    // 38: {
    //     name: 'Cheerleader',
    //     link: 'https://www.youtube.com/watch?v=9qXAaoBePVg',
    //     volume: 0.02
    // },
    39: {
        name: 'Love me like you do',
        link: 'https://www.youtube.com/watch?v=AJtDXIazrMo',
        volume: 0.025
    },
    40: {
        name: 'Take me to church',
        link: 'https://www.youtube.com/watch?v=t0imaSCnSuA',
        volume: 0.023
    },
    41: {
        name: 'Bad blood',
        link: 'https://www.youtube.com/watch?v=QTa-5mJoyjg',
        volume: 0.025
    },
    42: {
        name: 'Centuries',
        link: 'https://www.youtube.com/watch?v=vR18NP-acL4',
        volume: 0.02
    },
    // 43: {
    //     name: 'One dance',
    //     link: 'https://www.youtube.com/watch?v=HBOKbB4Vaco',
    //     volume: 0.02
    // },
    // 44: {
    //     name: 'Stressed out',
    //     link: 'https://www.youtube.com/watch?v=ydZZ4p4pKrs',
    //     volume: 0.02
    // },
    // 45: {
    //     name: 'Can\'t stop the feeling',
    //     link: 'https://www.youtube.com/watch?v=QEZq4I2wTBc',
    //     volume: 0.02
    // },
    46: {
        name: 'Cheap thrills',
        link: 'https://www.youtube.com/watch?v=6mqbAnrtWHo',
        volume: 0.025
    },
    47: {
        name: '7 years old',
        link: 'https://www.youtube.com/watch?v=IDa4VlWnVpA',
        volume: 0.02
    },
    48: {
        name: 'Don\'t let me down',
        link: 'https://www.youtube.com/watch?v=l-gSWc7TlRA',
        volume: 0.02
    },
    49: {
        name: 'Me myself and I',
        link: 'https://www.youtube.com/watch?v=Z7CTnA3dTU0',
        volume: 0.02
    },
    // 50: {
    //     name: 'We don\'t talk any more',
    //     link: 'https://www.youtube.com/watch?v=2FuHbch1dFI',
    //     volume: 0.02
    // }
};

module.exports = {
    pass: {
        /*
        'test': {
            description: 'test',
            playlist: test
        },
        */

        'fun': {
            description: 'fun - A random and diverse collection of songs that are fun rather than objectively good',
            playlist: fun
        },

        'nightcore': {
            description: 'nightcore - Best of the daily nightcore series',
            playlist: nightcore
        },

        '90\'s': {
            description: '90\'s - Nineties pop songs',
            playlist: nineties
        },

        '00\'s': {
            description: '00\'s - Noughties pop songs',
            playlist: noughties
        },

        '10\'s': {
            description: '10\'s - Tennies pop songs',
            playlist: tennies
        }
    }
};
