import { SiteDataSchema } from '../types';

/**
 * CENTRAL SITE DATA
 * Contains strongly-typed defaults, static configurations,
 * and standard placeholders (BOYFRIEND_NAME, GIRLFRIEND_NAME, etc.).
 *
 * This serves as the fallback and structure definition which merges with
 * runtime Supabase published content in later phases.
 */
export const siteData: SiteDataSchema = {
  meta: {
    boyfriendName: 'BOYFRIEND_NAME',
    girlfriendName: 'GIRLFRIEND_NAME',
    relationshipMilestone: 'Chapter 2026',
    birthDate: 'October 2026',
    audioAssetPath: '/audio/girlfriend-message.mp3',
    defaultBackgroundMusicPath: '/audio/ambient-piano-bg.mp3',
  },

  hero: {
    eyebrow: 'A PRIVATE STORY FOR ONE PERSON',
    title: 'Happy Birthday, BOYFRIEND_NAME',
    subtitle: 'A cinematic journey through our quiet memories, whispered wishes, and the moments that belong only to us.',
    ctaText: 'Begin Our Journey',
    atmosphericQuote: '“Every second spent with you is my favorite memory in the making.”',
  },

  quizQuestions: [
    {
      id: 'quiz-1',
      question: 'QUIZ_QUESTION_1: Where did we share our very first unforgettable laugh?',
      options: [
        { id: 'a', text: 'At that cozy café in the pouring rain' },
        { id: 'b', text: 'During that midnight rooftop walk' },
        { id: 'c', text: 'Lost in the subway station together' },
        { id: 'd', text: 'While trying to cook dinner from scratch' },
      ],
      correctOptionId: 'a',
      explanation: 'You smiled and the whole stormy evening suddenly felt warm.',
      reactionCorrect: 'You remembered! That was the moment I knew you were someone special.',
      reactionWrong: 'Close, but think back to that rainy day when we ordered warm cocoa...',
      sortOrder: 1,
    },
    {
      id: 'quiz-2',
      question: 'QUIZ_QUESTION_2: What is the one thing you always do that makes me smile instantly?',
      options: [
        { id: 'a', text: 'Singing off-key along to our favorite songs' },
        { id: 'b', text: 'Stealing my fries while pretending not to' },
        { id: 'c', text: 'Sending that silly good-morning voice note' },
        { id: 'd', text: 'All of the above — without exception' },
      ],
      correctOptionId: 'd',
      explanation: 'Every little quirk of yours makes my days infinitely brighter.',
      reactionCorrect: 'Spot on. It really is every little thing you do.',
      reactionWrong: 'Try again — you know there is more than just one answer!',
      sortOrder: 2,
    },
    {
      id: 'quiz-3',
      question: 'QUIZ_QUESTION_3: If we could travel anywhere right this second, where are we heading?',
      options: [
        { id: 'a', text: 'A cabin under the starry northern skies' },
        { id: 'b', text: 'A quiet seaside town at sunset' },
        { id: 'c', text: 'Exploring midnight neon streets together' },
        { id: 'd', text: 'Anywhere, as long as we are side by side' },
      ],
      correctOptionId: 'd',
      explanation: 'No matter the coordinates, home is always wherever you are.',
      reactionCorrect: 'Always side by side. That is my forever answer.',
      reactionWrong: 'Look deeper into what matters most...',
      sortOrder: 3,
    },
  ],

  memories: [
    {
      id: 'mem-1',
      title: 'MEMORY_TITLE_1: The Day the World Paused',
      description: 'MEMORY_DESCRIPTION_1: Walking under the amber streetlights, talking until the city went completely silent. We lost track of time, but found something timeless.',
      date: 'Autumn Evening',
      location: 'Old Town Cobblestones',
      imageUrl: '/src/assets/images/memory_autumn_city_walk_1791181913689.jpg',
      captionNote: '“We didn’t want the night to end.”',
      sortOrder: 1,
    },
    {
      id: 'mem-2',
      title: 'MEMORY_TITLE_2: Ocean Breeze & Salted Air',
      description: 'MEMORY_DESCRIPTION_2: That spontaneous weekend road trip where we escaped the rush and sat listening to the waves crash under a pastel horizon.',
      date: 'Summer Sunset',
      location: 'Coastal Cliffs',
      imageUrl: '/src/assets/images/memory_coastal_sunset_1791181927638.jpg',
      captionNote: '“Your laugh was louder than the waves.”',
      sortOrder: 2,
    },
    {
      id: 'mem-3',
      title: 'MEMORY_TITLE_3: Quiet Sunday Mornings',
      description: 'MEMORY_DESCRIPTION_3: Warm coffee, unhurried conversations, and messy hair. The simplest moments that mean everything in the world to me.',
      date: 'Sunday Morning',
      location: 'Our Favorite Nook',
      imageUrl: '/src/assets/images/memory_coffee_morning_1791181939745.jpg',
      captionNote: '“These are the quiet seconds I treasure most.”',
      sortOrder: 3,
    },
  ],

  candleConfig: {
    totalCandles: 5,
    allowMicrophoneBlow: true,
    blowThreshold: 0.15,
  },

  finalReveal: {
    title: 'Happy Birthday, My Love',
    subtitle: 'To the person who brings wonder, light, and warmth into every single day.',
    girlfriendPhotoUrl: '/src/assets/images/girlfriend_portrait_sunset_1791184188618.jpg',
    heartfeltMessage: 'FINAL_BIRTHDAY_MESSAGE: Thank you for being my anchor, my sweetest joy, and my favorite adventure. Looking back at everything we have shared, I am so grateful for the laughter, the quiet comfort, and the endless support you bring to my life. May this new year grant you every wish your heart dares to dream. I love you more than words could ever tell.',
    signoff: 'Forever and always, GIRLFRIEND_NAME ❤️',
  },
};
