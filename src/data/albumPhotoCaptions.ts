/**
 * Per-photo captions for map albums in src/images/albums/{AlbumName}/.
 *
 * Workflow:
 * 1. Add image to src/images/albums/{AlbumName}/your-file.jpg
 * 2. Add an entry below using the exact file name as the key
 *
 * Album keys must match the folder name passed to getAlbumPhotos() in PortfolioMap.tsx
 * (e.g. "Michigan trip", "Normandy France", "Monterey Trip").
 */
export const albumPhotoCaptions: Record<string, Record<string, string>> = {
  Denton: {},
  Arkansas: {},
  Kansas: {},
  Colorado: {},
  Monterey: {},
  Ohio: {'1 Ohio.jpg': 'Centerville, Ohio.',
    '2 ohio sibs.jpg': 'I couldn\'t have done it without the help of my siblings.',
    'CIMG1452.jpg': 'Cincinnati Zoo with dad and best friend Mitch.',
    'CIMG1564.jpg': 'POV you spent all day moving and only had enough energy to inflate an air mattress for your first night in your new room.',
    'CIMG1569.jpg': 'Move-in day!',
    'CIMG2567.jpg': 'Fulfilling my big brother duties.',
    'CIMG3963.jpg':'Cousins sleepover before our vacation trip to Michigan. They were all pretty wiped from the drive up from Kansas.',
    'CIMG4223.jpg': 'For my show-and-tell project I made a Japanese zero plane model with the help of my dad.',
    'CIMG4416.jpg': 'Huckster :-)',
    'Conner & John Paul in front of HS.jpg': 'Me and my best friend John Paul. We lived on the same road, I could get to his house with just a few pushes of my scooter down the hill. Over summer breaks I\'d spend just as much time at his house as mine.',
    'pumpkins with pumpkins.jpg': 'Could mop a floor with that hair.',
  },
  Italy: {},
  Vegas: {},
  'San Angelo': {},
  Maryland: {'FavMonu.jpg': 'Me, age 5. Favorite things: fountains, ducks, and the washington monument.',
    'FullSizeRender_2.jpg': 'Kennedy Center, 2000, with my friend Miles and his mom, Ligia.',
    'FullSizeRender_3.jpg': 'We stopped at Bob Jones University in Greenville, South Carolina on our way to get my dad in Alabama.',
    'FullSizeRender_4.jpg': 'My dad\'s Officer Training School graduation at Maxwell AFB.',
    'IMG_4993.jpg': 'Annapolis, 2000.',
    'FullSizeRender.jpg': 'One of my many masterpiece creations at preschool, August 2000.',
    'IMG_4990.jpg': 'Urban playground of my daycare, working on my bleach blond hair.',
    'FavMonument.jpg': 'First time standing next to the Washington Monument (my favorite monument). It was off limits for renovation for a long time we were there. That just made it that much sweeter when I finally got to see it up close. Summer 2000.'
  },
  Wichita: {},
  Auburn: {},
  Germany: {},
  'San Antonio': {},
  'Michigan trip': {},
  Niagara: {},
  'Normandy France': {},
  Paris: {},
  Switzerland: {},
  Venice: {},
  'Canary Islands': {},
  'Monterey Trip': {},
  Zion: {},
};
