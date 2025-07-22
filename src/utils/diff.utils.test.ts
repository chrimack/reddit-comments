import { assert, assertEquals, assertStringIncludes } from 'jsr:@std/assert';
import { DiffUtils } from './diff.utils.ts';

const testData = [
  {
    new: `Season: 97-39\n\nLast pick : 2-1\n\nTips: $e7775432 (cashapp,Venmo and PayPal)\n\nGood day yesterday, will have two more riskier plays soon, just wanted to get the safe bets out\n\nSafer plays: Framber Valdez over 4.5 strikeouts vs LAD (8/10) -165\n\nFramber had gone over this line in 8 out his last 19 starts and he is pitching vs LAD, that the bats are cold and just lost vs this Astros team very badly .vs Phillies he pitched for 7 IP, but his control was off and ended up game with only 3 strikeouts and 4 BB and vs A’s pitched for 6Ip with 2 ER and 5 BB, as long as he had good control, he should go over this line easily. LAD are ranking up with only 6 strikeouts last game, average 3 total of 6.33 and average total of 8.12(13 out 30)\n\nSafer plays: Ranger Suarez over 5.5 strikeouts vs Reds\n\nRanger has gone over this line 7 out 10 starts, the only 3 times he hasn’t gone over this line was vs guardians which was a hook , vs Brewers where he got hit hard 7 hits and 2 ER, and vs Pirates which got 5 hits and 2 ER and it was hook as well with 5.\nReds are ranked 24 out 30 in strikeouts, last game had 12 , average total 3 of 7.67 and total of 8.72\n\n\n\nRiskier line: Riskier line: Matthew Liberatore over 3.5 strikeouts vs Cubs -175 (9/10)\n\nMatthew has gone over this line in 9 out of his 10 starts, surprised that the books have his line so low , they are expecting the cubs to have a great game like last night, but I can’t seem him not going over this line . Only time he hasn’t gone over this line was vs  second game with royals with 2 strikeouts. He is pitching vs cubs which he already had a game on June 23 and he ended up the game with 5 strikeouts . The cubs are ranking up 7 out 30 in strikeouts , last game they had 5 and average total of 7.78\n\nRiskier line: Jonathan Cannon over 3.5 strikeouts vs Rockies -185`,
    old: `Season: 97-39\n\nLast pick : 2-1\n\nTips: $e7775432 (cashapp,Venmo and PayPal)\n\nGood day yesterday, will have two more riskier plays soon, just wanted to get the safe bets out\n\nSafer plays: Framber Valdez over 4.5 strikeouts vs LAD (8/10) -165\n\nFramber had gone over this line in 8 out his last 19 starts and he is pitching vs LAD, that the bats are cold and just lost vs this Astros team very badly .vs Phillies he pitched for 7 IP, but his control was off and ended up game with only 3 strikeouts and 4 BB and vs A’s pitched for 6Ip with 2 ER and 5 BB, as long as he had good control, he should go over this line easily. LAD are ranking up with only 6 strikeouts last game, average 3 total of 6.33 and average total of 8.12(13 out 30)\n\nSafer plays: Ranger Suarez over 5.5 strikeouts vs Reds\n\nRanger has gone over this line 7 out 10 starts, the only 3 times he hasn’t gone over this line was vs guardians which was a hook , vs Brewers where he got hit hard 7 hits and 2 ER, and vs Pirates which got 5 hits and 2 ER and it was hook as well with 5.\nReds are ranked 24 out 30 in strikeouts, last game had 12 , average total 3 of 7.67 and total of 8.72\n\n\n\nRiskier line: Riskier line: \n\nRiskier line: `,
  },
  {
    new: `Record 243-157-2 (59%)\n\n39-22 record for +140.3 units (since unit tracking start) 1 unit = 250 dollars.\n\nYESTERDAYS PICKS - 4-2(-1 unit or 250 dollars).\n\nROI STARTING 6/29/2025 - +20.1%  (+7750 total over 5 days. Risk over those 5 days totals 38,500)\n\nYESTERDAYS PICKS\n\nSTL/CHC - CHC ML (-145) ✅ BOOM. 8 home runs for CHC. WOW.\n\nLAA/TOR - TOR ML (-158) ✅ Sweaty, but we got it.\n\nBAL/ATL - ATL ML (-171) 🤮 Fire the whole coaching staff. These players are too talented for these kinds of performances through the first half of the year. They aren’t hearing anything this staff is saying and totally lack motivation. Snetker gotta go.\n\nHOU/LAD - LAD ML (-176) 🤮, OVER 9 (-120) ✅ Not at all what I expected from the game, but glad we got the over. LAD might get swept this series actually. Valdez on the mound for HOU tomorrow against Ohtani who won’t get more than 3-4 innings.  Dodger bullpen was tonight and they shit the bed. HOU saves their prime bullpen guys for tomorrow as well.\n\nDET/CLE - DET ML (-113) ✅SHOCKED!  SHOCKED I SAY!  CLE Couldn’t muster more than 1 run. Again.\n\nBOL TODAY and HAPPY 4th!!\n\nRR 2’s, 3’s and 4’s with a 2 unit 6 legger for today. 25 units risk total today with possible payout of 134 units if we sweep. Yesterday was close, but close don’t count. Let’s get it.\n\n4-2 today. Not bad. Dodgers game was strange, but that’s baseball. \n\nFinal tally in units was -1 unit.  I expected to do a lil better than that, but the inability to hedge LAD ML before they were down 6-1 made a big difference. \n\nNo harm done, on to Saturdays slate. \n\nTODAYS PICKS\n\nSTL/CHC - CHC ML (-135) Pomeranz is opening for Wicks.  Digging into Wicks history before confirming or pulling this pick.  Annnnnnnd we’re back. Wicks has had three outings in Triple A and in 11 innings has given up 7 hits, 2 runs and struck out 16!  I’m going to lean on STL still being on a slide while CHC is hot.  If STL breaks out today in 3 innings against Wicks then so be it. I do. It expect wicks to go more than 3-4 innings unless he proves VERY effective. Pomeranz will probably only go one and then we get a redemption story in Wicks. Liberatore also has to deal with the CHC lineup seeing him on short turnaround. \nSticking with the pick here.  Oh and the line has moved to -135 CHC FROM -116. \n\nDET/CLE - DET ML (-133) Mize v Allen. CLE will be faded until they prove they can score more than a run or two. DET does enough to take it. \n\nBOS/WAS - Over 9.5 (-125) Combined these teams are 8-2 against the over for this game. Both teams are sending pitchers that give up boat loads of runs….probably a trap…but it shouldn’t be. \n\nHOU/LAD - HOU +1.5 (-170) I actually like HOU to take this game straight up, but I’ll buy the extra run here. Valdez on the mound and this guy is bananas right now. HOU has won Framber’s last 10 starts in a row. 13 runs in 68 innings in those 10 starts as well.  Ohtani starting for LAD and they’re in a pinch here. He probably won’t go more than 3-4 innings tops and LAD bullpen got dinged bad Friday night. Not setting up to be a great series for LAD. \n\nNYY/NYM - NYY ML (-155) Rodon v Montas and I like Rodon to keep the NYM at bay long enough for NYY to plate 2-3 runs or more. Montas just gave up 6 to PIT in his last outing. Gimme them Yankees. \n\n\nWe keep sniffing big winning days here. Braves come back woulda been a big deal, really disappointed  there. LAD game was just nuts. \n\nBOL IF TAILING AS ALWAYS`,
    old: `Record 243-157-2 (59%)\n\n39-22 record for +140.3 units (since unit tracking start) 1 unit = 250 dollars.\n\nYESTERDAYS PICKS - 4-2(-1 unit or 250 dollars).\n\nROI STARTING 6/29/2025 - +20.1%  (+7750 total over 5 days. Risk over those 5 days totals 38,500)\n\nYESTERDAYS PICKS\n\nSTL/CHC - CHC ML (-145) ✅ BOOM. 8 home runs for CHC. WOW.\n\nLAA/TOR - TOR ML (-158) ✅ Sweaty, but we got it.\n\nBAL/ATL - ATL ML (-171) 🤮 Fire the whole coaching staff. These players are too talented for these kinds of performances through the first half of the year. They aren’t hearing anything this staff is saying and totally lack motivation. Snetker gotta go.\n\nHOU/LAD - LAD ML (-176) 🤮, OVER 9 (-120) ✅ Not at all what I expected from the game, but glad we got the over. LAD might get swept this series actually. Valdez on the mound for HOU tomorrow against Ohtani who won’t get more than 3-4 innings.  Dodger bullpen was tonight and they shit the bed. HOU saves their prime bullpen guys for tomorrow as well.\n\nDET/CLE - DET ML (-113) ✅SHOCKED!  SHOCKED I SAY!  CLE Couldn’t muster more than 1 run. Again.\n\nBOL TODAY and HAPPY 4th!!\n\nRR 2’s, 3’s and 4’s with a 2 unit 6 legger for today. 25 units risk total today with possible payout of 134 units if we sweep. Yesterday was close, but close don’t count. Let’s get it.\n\n4-2 today. Not bad. Dodgers game was strange, but that’s baseball. \n\nFinal tally in units was -1 unit.  I expected to do a lil better than that, but the inability to hedge LAD ML before they were down 6-1 made a big difference. \n\nNo harm done, on to Saturdays slate. \n\nTODAYS PICKS`,
  },
];

Deno.test('getCommentDiff - detects added lines in testData[0]', () => {
  const { old, new: newText } = testData[0];
  const diff = DiffUtils.getCommentDiff(old, newText);

  assert(diff !== undefined, 'Expected diff to be defined');
  assertStringIncludes(diff, 'Matthew Liberatore over 3.5 strikeouts');
  assertStringIncludes(diff, 'Jonathan Cannon over 3.5 s');
});

Deno.test('getCommentDiff - detects added lines in testData[1]', () => {
  const { old, new: newText } = testData[1];
  const diff = DiffUtils.getCommentDiff(old, newText);

  assert(diff !== undefined, 'Expected diff to be defined');
  // Only check for the first detected addition, which is guaranteed to be present
  assertStringIncludes(diff, 'STL/CHC - CHC ML (-135)');
});

Deno.test('getCommentDiff - returns undefined for identical input', () => {
  const text = testData[0].old;
  const diff = DiffUtils.getCommentDiff(text, text);

  assertEquals(diff, undefined);
});

Deno.test('getCommentDiff - ignores trivial changes (case, whitespace)', () => {
  const old = 'This is a test.';
  const newText = 'This   is a test.';
  const diff = DiffUtils.getCommentDiff(old, newText);

  assertEquals(diff, undefined);
});

Deno.test('getCommentDiff - trims long additions', () => {
  const longText = 'a'.repeat(200);
  const old = 'Before\n';
  const newText = old + longText + '\n';
  const diff = DiffUtils.getCommentDiff(old, newText);

  assert(diff !== undefined, 'Expected diff to be defined');
  const match = diff.match(/➕ "…[^"]+"/);
  if (!match) throw new Error('No preview found in diff');

  const preview = match[0];
  const visibleAddition = preview.replace(/.*…/, '').replace(/…".*/, '');
  console.log(visibleAddition.length);
  if (visibleAddition.length > 40) {
    throw new Error('Added text exceeds maxAddedLength');
  }
});

Deno.test('getCommentDiff - handles additions at beginning and end', () => {
  const old = 'Middle content.';
  const newText = 'Start added. ' + old + ' End added.';
  const diff = DiffUtils.getCommentDiff(old, newText);

  assert(diff !== undefined, 'Expected diff to be defined');
  assertStringIncludes(diff, 'Start added');
  assertStringIncludes(diff, 'End added');
});
