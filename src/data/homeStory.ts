export type StoryLinkStyle =
  | 'rose'
  | 'teal'
  | 'gold'
  | 'berry'
  | 'sky'
  | 'lime'
  | 'coral';

export type StoryEffect = 'satellite' | 'spider';

export type StorySegment =
  | { type: 'text'; value: string }
  | {
      type: 'link';
      label: string;
      href: string;
      external?: boolean;
      style?: StoryLinkStyle;
    }
  | {
      type: 'email';
      style?: StoryLinkStyle;
    }
  | {
      type: 'effect';
      label: string;
      effect: StoryEffect;
      style?: StoryLinkStyle;
    };

export type HomeStory = {
  nameLead: string;
  name: string;
  /** Swap to a cutout PNG at /images/conner-cutout.png when ready */
  portraitSrc: string;
  portraitAlt: string;
  sentences: StorySegment[][];
};

export const homeStory: HomeStory = {
  nameLead: 'This is',
  name: 'Conner Myers',
  portraitSrc: '/images/MeWhenge.png',
  portraitAlt: 'Conner Myers',
  sentences: [
    [
      { type: 'text', value: 'When people ask Conner where he\'s from, he usually shrugs.' },
    ],
    [
      { type: 'text', value: 'This is because Conner\'s lived a dozen places, give or take.' },
    ],
    [
      { type: 'text', value: 'So he made a ' },
      { type: 'link', label: 'timeline', href: '/map', style: 'sky' },
      { type: 'text', value: ' of them for you to look at.' },
    ],
    [
      { type: 'text', value: 'Conner likes to ' },
      { type: 'link', label: 'garden ', href: '/garden', style: 'lime' },
      { type: 'text', value: 'and ' },
      { type: 'link', label: 'read ', href: '/reading', style: 'berry' },
      { type: 'text', value: 'and ' },
      { type: 'link', label: 'code', href: '/projects', style: 'teal' },
      { type: 'text', value: ', among other things.' },
    ],
    [
      { type: 'text', value: 'Conner was in the ' },
      { type: 'link', label: 'Air Force', href: 'https://www.af.mil/', style: 'sky', external: true },
      { type: 'text', value: ' for four years.' },
    ],
    [
      { type: 'text', value: 'He helped miltary ' },
      { type: 'effect', label: 'satellites', effect: 'satellite', style: 'gold' },
      { type: 'text', value: " not crash into each other."},
    ],
    [
      { type: 'text', value: 'That was a very nice thing of Conner to do.' },
    ],
    [
      { type: 'text', value: 'After that, Conner moved back home to Kansas to take care of his mother.' },
    ],
    [
      { type: 'text', value: 'Once she got better, Conner went to work on a ' },
      { type: 'link', label: 'farm ', href: '/farm', style: 'coral' },
      { type: 'text', value: 'in Arkansas.' },
    ],
    // [
    //   { type: 'text', value: 'There Conner lived in a barn with lots of ' },
    //   { type: 'effect', label: 'spider', effect: 'spider', style: 'rose' },
    //   { type: 'text', value: ' roommates.' },
    // ],
    [
      { type: 'text', value: "He made many friends and memories, and met his partner there." },
    ],
    [
      { type: 'text', value: "Conner now lives with his partner on Maryland's eastern shore." },
    ],
    [
      { type: 'text', value: "He is very happy." },
    ],
    [
      { type: 'text', value: 'Recently, Conner earned his degree in computer science (2026).' },
    ],
    [
      { type: 'text', value: 'He is now on the prowl for employment.' },
    ],
    [
      { type: 'text', value: 'If you have any information about such things, please let Conner know.' },
    ],
    [
      { type: 'text', value: 'He has a more detailed ' },
      {
        type: 'link',
        label: 'résumé',
        href: '/Conner_Myers_Resume.pdf',
        external: true,
        style: 'berry',
      },
      { type: 'text', value: ", if you like that kind of thing." },
    ],
    [
      { type: 'text', value: 'Conner also has an email he sometimes checks: ' },
      { type: 'email', style: 'teal' },
    ],
    [
      { type: 'text', value: 'And that\'s all Conner wrote.' },
    ],
  ],
};
