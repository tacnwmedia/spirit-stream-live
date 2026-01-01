// Hymn database with full lyrics
export interface Hymn {
  number: number;
  title: string;
  firstLine: string;
  verses: string[];
  chorus?: string;
}

export const hymnsDatabase: Hymn[] = [
  {
    number: 25,
    title: "Amazing Grace",
    firstLine: "Amazing grace! How sweet the sound",
    verses: [
      "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now am found;\nWas blind, but now I see.",
      "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed.",
      "Through many dangers, toils and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.",
      "When we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we'd first begun."
    ]
  },
  {
    number: 134,
    title: "Be Thou My Vision",
    firstLine: "Be thou my vision, O Lord of my heart",
    verses: [
      "Be thou my vision, O Lord of my heart;\nNaught be all else to me, save that thou art.\nThou my best thought, by day or by night,\nWaking or sleeping, thy presence my light.",
      "Be thou my wisdom, and thou my true word;\nI ever with thee and thou with me, Lord;\nThou my great Father, I thy true son;\nThou in me dwelling, and I with thee one.",
      "Riches I heed not, nor man's empty praise,\nThou mine inheritance, now and always:\nThou and thou only, first in my heart,\nHigh King of Heaven, my treasure thou art.",
      "High King of Heaven, my victory won,\nMay I reach heaven's joys, O bright heaven's Sun!\nHeart of my own heart, whatever befall,\nStill be my vision, O Ruler of all."
    ]
  },
  {
    number: 333,
    title: "Nothing but the Blood of Jesus",
    firstLine: "What can wash away my sin?",
    verses: [
      "What can wash away my sin?\nNothing but the blood of Jesus;\nWhat can make me whole again?\nNothing but the blood of Jesus.",
      "For my cleansing, this I see,\nNothing but the blood of Jesus;\nFor my pardon this my plea,\nNothing but the blood of Jesus.",
      "Nothing can for sin atone,\nNothing but the blood of Jesus;\nNaught of good that I have done,\nNothing but the blood of Jesus.",
      "This is all my hope and peace,\nNothing but the blood of Jesus;\nHe is all my righteousness,\nNothing but the blood of Jesus.",
      "Now by this I'll overcome—\nNothing but the blood of Jesus;\nNow by this I'll reach my home—\nNothing but the blood of Jesus."
    ],
    chorus: "Oh! precious is the flow\nThat makes me white as snow;\nNo other fount I know,\nNothing but the blood of Jesus."
  }
];

export const getHymnByNumber = (number: number): Hymn | undefined => {
  return hymnsDatabase.find(hymn => hymn.number === number);
};