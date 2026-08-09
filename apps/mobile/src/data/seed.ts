import { calculateExpiresAt } from '@erodr/domain';

import type {
  Conversation,
  PublicProfile,
  StoredPost,
  StoredResponse,
  University,
} from '@/types/models';

const campusFriends = require('../../assets/erodr/demo/generated-demo-campus-friends.png');
const campusQuad = require('../../assets/erodr/demo/generated-demo-campus-quad.png');
const lateNightPizza = require('../../assets/erodr/demo/generated-demo-late-night-pizza.png');

export const universities: University[] = [
  {
    id: 'mizzou',
    name: 'University of Missouri',
    shortName: 'Mizzou',
    city: 'Columbia',
    state: 'MO',
    latitude: 38.9404,
    longitude: -92.3277,
  },
  {
    id: 'missouri-state',
    name: 'Missouri State University',
    shortName: 'Missouri State',
    city: 'Springfield',
    state: 'MO',
    latitude: 37.1987,
    longitude: -93.2783,
  },
  {
    id: 'miami-ohio',
    name: 'Miami University',
    shortName: 'Miami Ohio',
    city: 'Oxford',
    state: 'OH',
    latitude: 39.5089,
    longitude: -84.7346,
  },
  {
    id: 'virginia-tech',
    name: 'Virginia Tech',
    shortName: 'Virginia Tech',
    city: 'Blacksburg',
    state: 'VA',
    latitude: 37.2284,
    longitude: -80.4234,
  },
  {
    id: 'jmu',
    name: 'James Madison University',
    shortName: 'JMU',
    city: 'Harrisonburg',
    state: 'VA',
    latitude: 38.4351,
    longitude: -78.8698,
  },
];

const firstNames = [
  'Maya', 'Caleb', 'Lauren', 'Marcus', 'Emily', 'Jordan', 'Taylor', 'Noah', 'Avery', 'Sam',
  'Rachel', 'Darius', 'Olivia', 'Ben', 'Kelsey', 'Devon', 'Priya', 'Luke', 'Morgan', 'Eli',
  'Jenna', 'Andre', 'Natalie', 'Cole', 'Sofia',
];
const lastNames = [
  'Jefferson', 'Brooks', 'Nguyen', 'Carter', 'Miller', 'Reed', 'Foster', 'Patel', 'Hughes', 'Diaz',
  'Bennett', 'Robinson', 'Kim', 'Ward', 'Hayes', 'Price', 'Shah', 'Turner', 'Bell', 'Cooper',
  'Sullivan', 'Lewis', 'Martin', 'Grant', 'Flores',
];
const avatarColors = ['#5E7D8A', '#B25C5C', '#5F8362', '#8B6C9D', '#C17B45', '#4776A3'];

export const profiles: PublicProfile[] = firstNames.map((firstName, index) => {
  const lastName = lastNames[index] ?? 'Rodie';
  const universityId = index < 19 ? 'mizzou' : universities[1 + ((index - 19) % 4)]?.id ?? 'mizzou';
  return {
    id: `profile-${index + 1}`,
    displayName: `${firstName} ${lastName}`,
    initials: `${firstName[0] ?? ''}${lastName[0] ?? ''}`,
    universityId,
    classYear: 2013 + (index % 4),
    bio: index === 0
      ? 'Journalism. Coffee. Always somewhere near the Quad.'
      : ['Trying to survive group projects.', 'Ask me where the good study spots are.', 'Mizzou made.'][index % 3] ?? '',
    avatarColor: avatarColors[index % avatarColors.length] ?? '#5E7D8A',
  };
});

const campusBodies = [
  'When all of your friends are in relationships & you\'re just like',
  'Is Ellis packed right now or can I actually find a table?',
  'Who else heard the bells and thought they were late for class?',
  'Free coffee outside the student center until they run out.',
  'The wind on College Ave is personally attacking me today.',
  'Does anyone have notes from the last ten minutes of chem?',
  'Somebody left a black umbrella in Middlebush. I turned it in downstairs.',
  'M-I-Z. That is all.',
  'Best cheap lunch within walking distance? Go.',
  'The Quad at this exact moment is why I picked Mizzou.',
  'To the person playing guitar outside Speakers Circle: keep going.',
  'Group project meeting moved again. We are never graduating.',
  'Anyone driving to St. Louis Friday afternoon with room for one?',
  'There is a very friendly dog by the columns and my day is fixed.',
  'Why is every printer on campus angry at me?',
  'Late-night pizza has never tasted this earned.',
  'If you found a gold keychain near Jesse, please message me.',
  'The line for breakfast is out the door but honestly worth it.',
  'Quiet floor means quiet floor, rodies.',
  'Need one more for intramural volleyball tonight.',
  'That exam was absolutely not written for humans.',
  'Who is going downtown after the game?',
  'I just watched someone sprint across the Quad and make the bus. Heroic.',
  'The sunset behind Jesse is doing the most tonight.',
  'Can somebody explain why my 8 a.m. professor has this much energy?',
  'Roommate appreciation post because mine brought snacks during finals.',
  'There are puppies by the rec. This is not a drill.',
  'Any journalism majors want to trade proofreading for coffee?',
  'Campus smells like rain and dining hall fries.',
  'I have two extra tickets for tonight. Private response if you want them.',
];

export interface SeedBundle {
  posts: StoredPost[];
  responses: StoredResponse[];
  conversations: Conversation[];
}

export function makeSeedBundle(now = new Date()): SeedBundle {
  const posts: StoredPost[] = Array.from({ length: 60 }, (_, index) => {
    const profileIndex = index >= 50 ? 19 + ((index - 50) % 6) : index % 19;
    const profile = profiles[profileIndex] ?? profiles[0]!;
    const university = universities.find((item) => item.id === profile.universityId) ?? universities[0]!;
    const anonymous = index % 5 === 1 || index % 7 === 0;
    const positiveCount = 3 + ((index * 7) % 41);
    const negativeCount = index % 6;
    const ageMinutes = 3 + ((index * 17) % 245);
    const createdAt = new Date(now.getTime() - ageMinutes * 60_000);
    const expiresAt = calculateExpiresAt(createdAt, { positive: positiveCount, negative: negativeCount });
    const imageSource = index % 11 === 0
      ? campusFriends
      : index % 13 === 0
        ? campusQuad
        : index % 17 === 0
          ? lateNightPizza
          : undefined;
    return {
      id: `post-${index + 1}`,
      authorId: profile.id,
      universityId: university.id,
      body: campusBodies[index % campusBodies.length] ?? 'What is happening on campus?',
      anonymous,
      anonymousGender: anonymous ? (index % 2 === 0 ? 'Woman' : 'Man') : undefined,
      imageSource,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      distanceMiles: Number((0.1 + (index % 16) * 0.17).toFixed(1)),
      positiveCount,
      negativeCount,
      responseCount: 1 + ((index * 3) % 13),
      myVote: index === 2 ? 1 : 0,
      audience: index > 49 ? (anonymous ? 'ticker' : 'national') : 'classmates',
    };
  });

  const responseBodies = [
    'Same.', 'Walking over now.', 'I was wondering this too.', 'Private response sent.',
    'It is busy but there are seats upstairs.', 'You just saved my day.', 'Can confirm.',
    'This is the most Mizzou thing I have read today.', 'Check by the front desk.', 'I can help!',
  ];
  const responses: StoredResponse[] = Array.from({ length: 108 }, (_, index) => ({
    id: `response-${index + 1}`,
    postId: `post-${1 + (index % 32)}`,
    authorId: profiles[(index + 3) % profiles.length]?.id ?? profiles[0]!.id,
    body: responseBodies[index % responseBodies.length] ?? 'Same.',
    anonymous: index % 13 === 0,
    private: false,
    createdAt: new Date(now.getTime() - (2 + index * 3) * 60_000).toISOString(),
  }));

  for (const post of posts) {
    post.responseCount = responses.filter((response) => response.postId === post.id && !response.private).length;
  }

  const conversations: Conversation[] = [
    {
      id: 'conversation-1',
      title: 'Private response',
      participantLabel: 'Anonymous poster',
      anonymousThread: true,
      lastMessage: 'Yep, the ticket is still yours if you want it.',
      updatedAt: new Date(now.getTime() - 8 * 60_000).toISOString(),
      unread: 2,
    },
    {
      id: 'conversation-2',
      title: 'Lauren Nguyen',
      participantLabel: 'Lauren Nguyen',
      anonymousThread: false,
      lastMessage: 'Meet by the columns at 7?',
      updatedAt: new Date(now.getTime() - 47 * 60_000).toISOString(),
      unread: 0,
    },
    {
      id: 'conversation-3',
      title: 'Lost keychain',
      participantLabel: 'Anonymous poster',
      anonymousThread: true,
      lastMessage: 'I left it with the desk attendant.',
      updatedAt: new Date(now.getTime() - 3 * 60 * 60_000).toISOString(),
      unread: 0,
    },
  ];

  return { posts, responses, conversations };
}
