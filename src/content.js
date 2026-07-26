/**
 * Voice-matched copy for the recap, written to match Fred's tone from the
 * 2024/25 write-up: dry, deadpan, stat-citing, and roasting everyone equally.
 *
 * Data (names, points, correct answers) comes from predictions.json / summary.json;
 * this file supplies the words wrapped around it.
 */

export const hero = {
  badge: 'The Prita · 2025/26 Season Recap',
  titleLines: ['We made', 'our predictions.', 'The season', 'had other ideas.'],
  sub: 'Eleven of us. Thirty-one predictions. One long year of finding out exactly how wrong we were. Scroll to relive it.',
};

export const intro = {
  eyebrow: 'Before We Begin',
  paragraphs: [
    'A year ago, eleven of us made thirty-one predictions about the season. Here is every call against what actually happened - the masterstrokes, the nonsense, and the picks we will never live down.',
    'The final table is at the very bottom, where it belongs. No peeking.',
  ],
};

export const scoreboard = {
  eyebrow: 'The Final Reckoning',
  title: 'The Predictions Table',
  lead: 'Every correct call, partial credit and bold wildcard, added up. Forty-two points were on the table. Nobody got close to all of them.',
  // A line per finishing position, keyed by predictor name.
  lines: {
    Lucas:
      'Champion - and let the record show he wins it by a single point, entirely on the back of a +3 wildcard that Everton, incredibly, would keep the same manager. Strip that out and he’s tied on 11.',
    Eoin:
      'First season actually putting predictions on paper, and he got more questions right than anyone (nine). Second place his reward. Welcome to the Prita proper, Eoin;',
    Fred: 'Answered the entire quiz without peeking at anyone else’s submissions, a true man of principle, and was rewarded with third place and precisely nothing.',
    Oscar:
      'Last year’s champion, and still in the argument on 11. The Madueke flop and Gabriel for top defender, strong calls nobody else made.',
    Tom: 'Correctly predicted his own relegation to the gameweek. You have to admire it. Did Tom cling on all those weeks just to make that prediction come true?',
    Dymond:
      'The only person to call the Klopp award correctly, and one of only four to place a top-four team in the right spot. A tidy 10 from a quiet campaign.',
    Joe: 'Redemption arc of the year. Rooted to the bottom on 7 last season, Joe climbs to 9 - buoyed by actually reading the fantasy questions for once.',
    Harry: 'A solid ten, and one of the few to actually call Man United as a dark horse - which duly came in third. No disasters; just too few of those bold calls to climb any higher.',
    Mark: 'Backed Chelsea for the title again. Chelsea finished 10th. The club loyalty tax remains undefeated.',
    Spink:
      'This year had the most points up for grabs we’ve ever had yet Hugo has produced our all time lowest score. Only scoring points on 5 questions. Ball knowledge has hit a new low.',
    Toby:
      'Down among the also-rans on 7. Backed Liverpool for the title and got to watch them tumble out of the top four entirely - the gift that kept on giving.',
  },
};

export const groups = {
  'Premier League': {
    blurb:
      'Eight of us fancied Liverpool to go back-to-back. It was Arsenal - named by nobody. Welcome to our collective grasp of the actual football.',
  },
  Players: {
    blurb:
      'Golden boots, golden gloves, and a truly heroic amount of misplaced faith in expensive new signings.',
  },
  'The League': {
    blurb:
      'The internal politics of the Prita and the Segunda: who’d win, who’d drop, and who’d embarrass themselves the loudest.',
  },
  Fantasy: {
    blurb:
      'Which players would actually rack up the points. Spoiler: quite a few of us said Haaland wouldn’t win it and then he obviously did.',
  },
  Wildcard: {
    blurb: 'One free swing at the most unlikely thing you could imagine coming true.',
  },
};

/**
 * Per-question one-liners, keyed by slug. Missing slugs fall back to a
 * generated line. Keep them short and pointed.
 */
export const quips = {
  'title-winner':
    'A clean sweep of wrong. Eight Liverpools, a United, a City, a Chelsea - and the actual champions, Arsenal, named by nobody. Not one of us could bring ourselves to write them down; wishful thinking, probably, leaving the team we most wanted to fail off the list entirely.',
  'top-4': 'Amazingly there was nearly perfect concenus amongst us on who the top 4 would be, but we were still nowhere near. We all included Chelsea in our top 4 this year yet they were lucky to make it to top 10 in the end. Then nearly all of us shoved Liverpool in, the reigning champions finished fifth. We all banked Arsenal and City, and only Joe, ever the contrarian, stumbled into Man U’s third.',
  'top-4-order':
    'Getting the four right was hard enough; ordering them was carnage. Four of us landed City in second and that was the extent of the accuracy.',
  relegated:
    'Burnley was the banker that only Joe missed. West Ham going down was the surprise only Lucas saw, manifesting the hammer’s downfall so they can face off against his beloved QPR this year.',
  'dark-horse-high':
    'Man United, of all teams, finishing third after a 15th place finish the season before. Harry, Joe and Fred take the spoils. Spink, Toby and Lucas all put Spurs down for this, who for the second year in a row finished 17th, narrowly escaping relegation',
  'top-xmas': 'Eoin, alone, saw Arsenal sitting top come Christmas. Most of us still couldn’t see past Liverpool’s 2025 title.',
  'surprisingly-low': 'Lucas’s masterstroke: the only one to back West Ham to fall through the floor. Very wishful thinking from Mark putting down Arsenal for this question.',
  tenth: 'Nobody saw Chelsea becoming the poster boys for the mid-table, but there they sat in tenth, proudly leading the double-digit finishers',
  'first-sacked':
    'Not one correct answer. Nuno went first, Ange replaced him and lasted a heroic 39 days, and we all sat here naming managers that for the most part are still in the prem, only Slot and Potter wont be gracing our touchlines next season.',
  'golden-boot': 'The one everyone could see coming. Seven of us on Haaland; Salah, Sesko and Joao Pedro the brave dissenters.',
  'golden-glove': 'Raya retained it, and half the group knew it. Fred went for Sels, which was certainly a choice - but nothing tops Joe, who put down Maguire. A centre-back. For the goalkeeping award.',
  'biggest-flop':
    'Madueke: only 3 league goals all year, only 3 full 90’s to his name, and somehow still an England call-up. Only Oscar predicted it. In truth Wissa was the bigger flop - a monumental drop-off from a "prem proven" player - but not one of us thought to name him.',
  'biggest-success':
    '31 starts, 24 goal involvements - Joao Pedro was the clear signing of the season, and only Mark backed the Chelsea striker. Isak getting guessed here by Oscar is Ironic, a dramatic exit from Newcastle, a british record signing and only 4 goal involvements to show for it. If anyone had put him down on the previous question he definitely would’ve been our biggest flop',
  'jan-spend': 'City dropped £84m in January, signing Semenyo and Guéhi in the process. Harry, Joe and Mark cashed in. Surprisingly Crystal Palace almost matched it spending a whopping £83m and breaking their transfer record twice in one window.',
  crazy:
    'The +3 that decided the whole thing. Of all the fire-in-the-stadium and pitch-invasion punts, it was Lucas’s "Everton will keep the same manager" that came true - and it won him the title.',
  'prita-winner': 'The one nobody saw coming - literally. Ben won the Prita and not a single one of us predicted him. Six people backed Fred, the rest mostly backed themselves, and Ben strolled through the lot while we weren’t looking.',
  'players-relegated':
    'Tom and Dymond went down, and Mark and Oscar called both. A rare moment of Mark being right about anything.',
  'segunda-winner': 'Joe won the Segunda - an absolute miracle, given where he usually finishes - and, fittingly, was the only soul on earth who saw it coming, backing himself when nobody else would. Belief, at long last, rewarded.',
  'segunda-promoted': 'Eoin came up too - spotted by Joe, Fred, Lucas and the man himself. Combining the votes here and in the previous question 9/11 of us thought this would be the year Lucas would return to the top division, alas all he could manage was 4th',
  'segunda-last': 'Mark propped up the Segunda. Joe, Oscar and Lucas enjoyed calling it but we all get to look forward to Mark’s, sure to be lengthy, stay at Brixton’s finest fast food offering.',
  'blunder-award':
    'The Iheanacho Award goes to Fred, who benched Watkins in GW37 - Watkins promptly scored 15, Fred lost by two, and handed Ben the entire league. Toby, gleefully, was the only one to predict it.',
  'klopp-award':
    'A vintage two-horse race. Toby tried to block final-week transfers; Lucas had a full winter meltdown after six straight defeats. Lucas edges it, and only Dymond saw the outburst coming.',
  'title-gw': 'Decided in GW37 - one of our best title races. Eoin nailed the exact week; Joe’s guess while technically correct will not earn points here',
  'relegation-gw': 'GW36, and Tom essentially predicted his own downfall to the week. Bleak.',
  'most-fpl-points': 'Haaland topped the lot. Tom, Eoin, Fred and Lucas backed him; the Salah bloc came up short.',
  'best-first-pick': 'Same story - Haaland was the pick that carried a squad, and the same four called it.',
  'worst-first-pick': 'Palmer was a first-round pick and managed just 114 points all season - the worst return of any first-rounder. Not one of us called it; the popular pick was Wirtz (125), who was almost as bad but not quite.',
  'highest-forward': 'Haaland again, top of the forwards. A rare question most of us actually got.',
  'highest-mid': 'Bruno Fernandes edged the midfield scoring. Only Joe and Fred correctly looked past Salah, Wirtz and Palmer.',
  'highest-defender': 'Gabriel topped the defenders. Oscar, alone, saw it - everyone else was mostly chasing full-backs but the new addition of DEFCON points made all the difference.',
  'dark-horse-player':
    'Welbeck, 35 years old, 126 points and a genuine England shout at one stage. Spink’s single moment of clairvoyance.',
};

/**
 * Wildcard answers that came true but banked no points (only the single best
 * prediction earns the +3). Purely presentational: these get a tick and sort
 * up with the winner, but stay on +0. Keyed by question slug → canonical keys.
 */
export const cameTrue = {
  crazy: ['united will score goals', 'united will finish in single figures'],
};

export const awards = [
  {
    slug: 'klopp-award',
    crown: '🎙️',
    title: 'The Klopp Award',
    sub: 'Bitchiest excuses of the season',
    winner: 'Won by Lucas',
    body: 'A tight contest. Toby’s attempt to block transfers on the final day was pure, undiluted Toby - but Lucas took the crown with a genuine mid-season collapse and the excuses to match. Six defeats on the bounce will do that to a man.',
    images: [
      { src: 'lucas', cap: 'Lucas, mid-meltdown: "Would love it if my strikers stopped fucking about getting injured."' },
      { src: 'toby', cap: 'Toby, final week: pulling rank to help his matchup, "Not allowed."' },
    ],
  },
  {
    slug: 'blunder-award',
    crown: '🤦',
    title: 'The Iheanacho Award',
    sub: 'Biggest blunder of the season',
    winner: 'Won by Fred',
    body: 'Fred benched Watkins in Gameweek 37. Watkins had scored three goals in his previous two games, then bagged two more for 15 points. Fred lost his matchup in week 37 by exactly two points - handing Ben the title in the process. Toby, delighted, was the only one to predict it.',
  },
  {
    slug: 'crazy',
    crown: '🔮',
    title: 'The +3 Wildcard',
    sub: 'Craziest prediction that came true',
    winner: 'Won by Lucas',
    body: 'From a field of stadium fires, weather abandonments and David Coote comebacks, it was Lucas’s deadpan "Everton will keep the same manager" that landed. Everton have had 15 managers in the last 10 years, but Moyes keeping his job has kept Lucas in this contest',
  },
];

export const moreData = {
  eyebrow: 'For the Spreadsheet Sickos',
  title: 'More Data',
  lead: 'The story is told. But some of you will want to see the working. Three ways of slicing the same season.',
  categories: {
    title: 'Where everyone scored',
    lead: 'Points by category, one panel per predictor, best to worst. Nobody was strong everywhere. Lucas’s title-winning +3 wildcard is folded into his Prem bar, which is why it towers over the rest.',
  },
  scatter: {
    title: 'Accuracy vs boldness',
    lead: 'Up the side, accuracy: total points. Along the bottom, boldness: lone calls - picks nobody else in the room made, right or wrong. Top-right is the dream (bold and accurate); Joe was the bravest by a mile and finished mid.',
  },
  questions: {
    title: 'Hardest & easiest questions',
    lead: 'Every question ranked by the share of its points that we actually banked, out of how many were available, so partial credit counts. The Golden Boot was a gimme; the Top 4 was brutal but not a whitewash; naming the actual champions, or the first manager sacked, a step too far this time.',
  },
};

export const narrative = {
  eyebrow: 'The Long Read',
  title: 'How it actually went',
  paragraphs: [
    'Let’s start with the headline: we were, collectively, terrible at predicting the actual football. Eight of us backed Liverpool to retain the title. It was Arsenal. Not one person named the champions. Chelsea, whom everybody had in the champion’s league spots, drifted to a perfectly average tenth. Meanwhile quite a few of us had Spurs finishing high whilst others predicted United finishing low. Shots in the dark that took our prediction points with them',
    'And yet the table was decided, as these things always are, by the tiniest of margins. Lucas Fabbri is your 2025/26 champion on 14 points - but only just, and only because of a single wild shout. While everyone else was arguing over golden boots and relegation battles, his call that Everton would keep the same manager came true, banked the +3, and lifted him one point clear of Eoin on 13. Take that punt away and he’s tied in the pack. A title won on a coin toss. Very Prita.',
    'Behind him, the cruelty. Eoin got more questions right than anybody, nine, and finished second. I complete the podium in distant 3rd. Oscar, last year’s winner, loses both his trophies this season and slips to joint fourth with Tom.',
    'There were redemption arcs. Joe, bottom of the pile last year on a humiliating seven, dragged himself up to nine. There were also the usual relapses: Mark backing Chelsea for the title, again... and a bottom three finish for him, again... Right there with him is Toby, a quiet season for Mr Hanscomb, The Klopp award was his by reputation of course; Lucas only pinched it on a technicality.',
    'That leaves Harry and Dymond, keeping the mid-table seats warm. And not forgetting Spink, who has somehow managed to outdo himself, with out lowest ever score, confirming that while he’s got an eye for a naked calendar, he certainly hasn’t got one for football.',
    'So congratulations to Lucas, commiserations to everyone else, and condolences to anyone who thought they understood football back in August. See you next season, when we’ll all pretend we’ve learned our lessons before immediately tipping Chelsea to finish second, Everton to sack another manager, and Manchester United to do something completely inexplicable.',
  ],
};

export const footer = {
  line1: 'The Prita · Season 2025/26',
  line2: 'Predictions submitted August 2025. Scored with a completely straight face in 2026.',
};
