export type ProjectStatus = 'live' | 'wip' | 'planned';

export type ProjectEntry = {
  id: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  playUrl?: string;
  /** Link text for playUrl. Defaults to "Play". */
  playLabel?: string;
  githubUrl?: string;
  imageSrc?: string;
  /** Full itch.io iframe src (embed or embed-upload) */
  itchEmbedSrc?: string;
  /** Native itch embed size — drives responsive aspect-ratio. Defaults 640×380. */
  itchEmbedWidth?: number;
  itchEmbedHeight?: number;
};

export type ProjectSection = {
  id: string;
  title: string;
  intro?: string;
  projects: ProjectEntry[];
};

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  live: 'Live',
  wip: 'In progress',
  planned: 'Planned',
};

export const projectSections: ProjectSection[] = [
  {
    id: 'games',
    title: 'Games',
    intro: 'Small Unity experiments. More coming once I push a few repos to GitHub.',
    projects: [
      {
        id: 'tank-drivers-ed',
        title: "Tank Driver's Ed",
        summary:
          'A Unity prototype that taught user controls, collision physics, and camera control.',
        status: 'live',
        playUrl: 'https://piancavallo.itch.io/unity-vehicle-demo',
        imageSrc: '/images/Unity Tank driving thumbnail.jpg',
        itchEmbedSrc: 'https://itch.io/embed-upload/17504485?color=333333',
        itchEmbedWidth: 980,
        itchEmbedHeight: 640,
      },
      {
        id: 'soccer',
        title: 'Soccer',
        summary: 'Another Unity prototype — try to stop the balls from going in your net.',
        status: 'live',
        playUrl: 'https://piancavallo.itch.io/soccer',
        imageSrc: '/images/Soccer.jpg',
        itchEmbedSrc: 'https://itch.io/embed-upload/17506451?color=333333',
        itchEmbedWidth: 980,
        itchEmbedHeight: 640,
      },
      {
        id: 'dodge-the-creeps',
        title: 'Dodge the Creeps!',
        summary: 'A short Godot / itch.io game — dodge the creeps and survive.',
        status: 'live',
        playUrl: 'https://piancavallo.itch.io/dodge-the-creeps',
        imageSrc: '/images/dodge-the-creeps.jpg',
        itchEmbedSrc: 'https://itch.io/embed-upload/17956928?color=333333',
        itchEmbedWidth: 640,
        itchEmbedHeight: 380,
      },
      {
        id: 'game-wip',
        title: 'More games',
        summary: 'Additional prototypes waiting to be cleaned up and pushed to GitHub.',
        status: 'wip',
      },
    ],
  },
  {
    id: 'trail-atlas',
    title: 'Trail Atlas',
    intro: 'National Parks explorer built with the NPS API.',
    projects: [
      {
        id: 'trail-atlas-api',
        title: 'Trail Atlas',
        summary:
          'A React + TypeScript app for exploring U.S. National Parks via the NPS API — routing, React Query, and API-ready architecture.',
        status: 'wip',
        playUrl: 'https://trail-atlas.netlify.app/',
        playLabel: 'Open app',
        imageSrc: '/images/NPS_API.jpg',
      },
    ],
  },
  {
    id: 'looking-ahead',
    title: 'Looking ahead',
    intro: 'Ideas and tools I want to build next — especially anything that helps in the garden.',
    projects: [
      {
        id: 'garden-tools',
        title: 'Garden helpers',
        summary:
          'Small apps and scripts to help with backyard gardening — planting, watering, and keeping track of what is growing.',
        status: 'planned',
      },
      {
        id: 'future-misc',
        title: 'Whatever comes next',
        summary: 'Open slot for the next fun problem worth coding.',
        status: 'planned',
      },
    ],
  },
];
