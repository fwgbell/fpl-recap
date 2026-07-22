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

export const scoreboard = {
  eyebrow: 'The Final Reckoning',
  title: 'The Predictions Table',
  lead: 'Every correct call, partial credit and bold wildcard, added up. Forty-two points were on the table. Nobody got close to all of them.',
  // A line per finishing position, keyed by predictor name.
  lines: {
    Lucas:
      'Champion — and let the record show he wins it by a single point, entirely on the back of a +3 wildcard that Everton, incredibly, would keep the same manager. Strip that out and he’s tied on 11. A title built on one gloriously petty call.',
    Eoin:
      'The newcomer got more predictions right than anyone (nine of them) and still finished second. Welcome to the Prita, Eoin — being good is rarely enough.',
    Fred: 'Answered the entire quiz without peeking at anyone else’s submissions, a true man of principle, and was rewarded with second place and precisely nothing.',
    Oscar:
      'Last year’s champion, right back in the mix on 13. The Madueke flop, Gabriel for top defender — the man simply watches more football than the rest of us.',
    Tom: 'Correctly predicted his own relegation to the gameweek. You have to admire a man who sees the cliff coming and points at it.',
    Dymond:
      'The only person to call the Klopp award correctly, and one of only four to place a top-four team in the right spot. A tidy 11 from a quiet campaign.',
    Joe: 'Redemption arc of the year. Rooted to the bottom on 7 last season, Joe climbs to 10 — buoyed by actually reading the fantasy questions for once.',
    Harry: 'A solid ten, undone only by an unshakeable faith that Manchester United would be good, which history should have warned him against.',
    Mark: 'Backed Chelsea for the title again. Chelsea finished 10th. The club loyalty tax remains undefeated.',
    Spink:
      'Three correct answers, one of them being the only person alive to call Welbeck as a dark horse. A season of Hugo being Hugo.',
    Toby:
      'Bottom of the pile on 7, having backed Liverpool precisely nowhere and then — reportedly — tried to block transfers in the final week. Some things never change.',
  },
};

export const groups = {
  'Premier League': {
    blurb:
      'Sixteen of us fancied Liverpool to go back-to-back. It was Arsenal. Welcome to our collective grasp of the actual football.',
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
      'Which players would actually rack up the points. Spoiler: almost none of us said Haaland would win it and then he did.',
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
    'A clean sweep of wrong. Ten Liverpools, a United, a City, a Chelsea — and the actual champions, Arsenal, went unmentioned by every single one of us.',
  'top-4': 'Everyone banked Arsenal and City. Only Joe, ever the contrarian, stumbled into Man U’s third place.',
  'top-4-order':
    'Getting the four right was hard enough; ordering them was carnage. Four of us landed City in second and that was the extent of the accuracy.',
  relegated:
    'Burnley was the banker. West Ham going down was the surprise nobody saw — except Lucas, who quietly called it here and again below.',
  'dark-horse-high':
    'Man United, of all teams, finishing third after we’d unanimously written them off as bins. Harry, Joe and Fred take the spoils.',
  'top-xmas': 'Eoin, alone, saw Arsenal sitting top come Christmas. The rest of us were still emotionally invested in Liverpool.',
  'surprisingly-low': 'Lucas’s masterstroke: the only one to back West Ham to fall through the floor. He was right.',
  tenth: 'Nobody had Chelsea as the definition of mid. In fairness, neither did Chelsea, right up until they finished 10th.',
  'first-sacked':
    'Not one correct answer. Nuno went first, Ange replaced him and lasted a heroic 39 days, and we all sat here naming Pereira.',
  'golden-boot': 'The one everyone could see coming. Seven of us on Haaland; Salah and Joao Pedro the brave dissenters.',
  'golden-glove': 'Raya retained it, and half the group knew it. Fred went for Sels, which was certainly a choice.',
  'biggest-flop':
    'Madueke: one league goal all year, barely a full 90 to his name, and somehow still an England call-up. Only Oscar called it.',
  'biggest-success':
    '31 starts, 24 goal involvements — Joao Pedro was the clear signing of the season, and only Mark saw it coming.',
  'jan-spend': 'City dropped £180m in January, more than the rest of the division combined. Harry, Joe and Mark cashed in.',
  crazy:
    'The +3 that decided the whole thing. Of all the fire-in-the-stadium and pitch-invasion punts, it was Lucas’s "Everton will keep the same manager" that came true — and it won him the title.',
  'prita-winner': 'Oscar backed himself and delivered, joined only by Spink in seeing it. Five people, meanwhile, backed Fred. Awkward.',
  'players-relegated':
    'Tom and Dymond went down, and Mark and Oscar called both. A rare moment of Mark being right about anything.',
  'segunda-winner': 'Joe won the Segunda and, remarkably, was the only person to back Joe. Belief, at last.',
  'segunda-promoted': 'Eoin came up too — spotted by Joe, Fred, Lucas and the man himself.',
  'segunda-last': 'Mark propped up the Segunda. Joe, Oscar and Lucas enjoyed calling it.',
  'blunder-award':
    'The Iheanacho Award goes to Fred, who benched Watkins in GW37 — Watkins promptly scored 15, Fred lost by two, and handed Ben the entire league. Toby, gleefully, was the only one to predict it.',
  'klopp-award':
    'A vintage two-horse race. Toby tried to block final-week transfers; Lucas had a full winter meltdown after six straight defeats. Lucas edges it, and only Dymond saw the outburst coming.',
  'title-gw': 'Decided in GW37 — one of our best title races. Eoin nailed the exact week; Joe guessed "week 10", which is mathematically impossible, as ever.',
  'relegation-gw': 'GW36, and Tom essentially predicted his own downfall to the week. Bleak.',
  'most-fpl-points': 'Haaland topped the lot. Tom, Eoin, Fred and Lucas backed him; the Salah bloc came up short.',
  'best-first-pick': 'Same story — Haaland was the pick that carried a squad, and the same four called it.',
  'worst-first-pick': 'Wirtz flopped as a first-rounder. Dymond, Joe, Oscar and Fred saw the disappointment coming.',
  'highest-forward': 'Haaland again, top of the forwards. A rare question most of us actually got.',
  'highest-mid': 'Bruno Fernandes edged the midfield scoring. Only Joe and Fred looked past Salah and Palmer.',
  'highest-defender': 'Gabriel topped the defenders. Oscar, alone, saw it — everyone else chasing full-backs and Cucurella.',
  'dark-horse-player':
    'Welbeck, 35 years old, 126 points and a genuine England shout at one stage. Spink’s single moment of clairvoyance.',
};

export const awards = [
  {
    slug: 'klopp-award',
    crown: '🎙️',
    title: 'The Klopp Award',
    sub: 'Bitchiest excuses of the season',
    winner: 'Won by Lucas',
    body: 'A tight contest. Toby’s attempt to block transfers on the final day was pure, undiluted Toby — but Lucas took the crown with a genuine mid-season collapse and the excuses to match. Six defeats on the bounce will do that to a man.',
    images: [
      { src: 'lucas', cap: 'Lucas, mid-meltdown: "Would love it if my strikers stopped fucking about getting injured."' },
      { src: 'toby', cap: 'Toby, final week: offered players, then rules it "Not allowed."' },
    ],
  },
  {
    slug: 'blunder-award',
    crown: '🤦',
    title: 'The Iheanacho Award',
    sub: 'Biggest blunder of the season',
    winner: 'Won by Fred',
    body: 'Fred benched Watkins in Gameweek 37. Watkins had scored three in his previous two, then bagged two more for 15 points. Fred lost his matchup by exactly two points — handing Ben the title in the process. Toby, delighted, was the only one to predict it.',
  },
  {
    slug: 'crazy',
    crown: '🔮',
    title: 'The +3 Wildcard',
    sub: 'Craziest prediction that came true',
    winner: 'Won by Lucas',
    body: 'From a field of stadium fires, weather abandonments and David Coote comebacks, it was Lucas’s deadpan "Everton will keep the same manager" that landed. Unlikely, correct, and worth exactly the three points that won him the entire thing.',
  },
];

export const narrative = {
  eyebrow: 'The Long Read',
  title: 'How it actually went',
  paragraphs: [
    'Let’s start with the headline: we were, collectively, terrible at predicting the actual football. Sixteen of us backed Liverpool to retain the title. It was Arsenal. Not one person named the champions. We put Manchester United down as relegation fodder and dark horses in roughly equal measure; they finished third and made fools of everyone. Chelsea, whom nobody could place, drifted to a perfectly average tenth.',
    'And yet the table was decided, as these things always are, at the margins. Lucas Fabbri is your 2025/26 champion on 14 points — but only just, and only because of a single wildcard. His straight-faced call that Everton would keep the same manager came true, banked the +3, and lifted him one point clear of a three-way pile-up on 13. Take that punt away and he’s tied in the pack. A title won on pure, calculated pettiness. Very Prita.',
    'Behind him, the cruelty. Eoin, in his first season, got more predictions right than anybody — nine of them — and finished second. Fred answered the whole quiz without once peeking at everyone else’s answers, a decision of tremendous integrity and zero reward, and also finished second. Oscar, last year’s winner, quietly went about being right regarding Madueke and Gabriel and finished, you guessed it, second.',
    'There were redemption arcs. Joe, bottom of the pile last year on a humiliating seven, dragged himself up to ten by the simple expedient of reading the fantasy questions properly. There were relapses: Mark backed Chelsea for the title, again, and Chelsea finished tenth, again. And there was Toby, who backed Liverpool precisely nowhere, propped up the table on seven, and then spent the final week allegedly trying to block other people’s transfers. The Klopp award was his by reputation; Lucas only pinched it on a technicality.',
    'The fantasy questions, at least, offered some dignity. Haaland topped the points, the forwards and the first-round picks, and the sensible money that backed him did well. Bruno Fernandes edged the midfield. Gabriel took the defenders, spotted only by Oscar. And Welbeck — thirty-five years old, 126 points, briefly discussed as an England option — was called by Hugo Spink and absolutely nobody else, the single lucid moment of his campaign.',
    'So there it is. Another year, another set of confidently wrong opinions committed to a spreadsheet and now, permanently, to the internet. Lucas has the crown. The rest of us have the receipts. See you in August, when we’ll do it all again and somehow learn nothing.',
  ],
};

export const footer = {
  line1: 'The Prita · Season 2025/26',
  line2: 'Predictions submitted August 2025. Scored with a completely straight face in 2026.',
};
