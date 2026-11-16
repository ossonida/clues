// Note 01 English text. Korean stays inline in index.html; this file only supplies English.
window.HN_EN = {
ui: {
  docTitle: 'Note 01 · The Funny Board Case | Hidden Note',
  back: '← Case archive / NOTE 01',
  title: 'The Funny Board Case',
  subtitle: 'Last Customers at the Board Game Café',
  timeLeft: 'Time left',
  cluesFound: 'Clues found',
  min: n => `${n} min`,
  help: 'How to play',
  talk: 'Interview',
  accuse: 'Name the thief',
  sceneHint: 'Click an object to search it (2 min) · Interview 3 min · Wrong code 1 min',
  notebook: 'Notebook',
  noClues: 'No clues yet.',
  notebookHint: 'Tap a clue to look at it again. You can also show clues to people when you interview them.',
  summaryTitle: 'The case',
  summary: 'Last night, sometime between 21:30 and 22:20, the 20 gold-plated meeples in the showcase were swapped for fakes painted gold. Four people were in the café during that time.<br><br>Name the thief, figure out when the showcase was opened, and back it up with evidence.',
  timeUp: "Time's up",
  lockedLoc: "It's locked. You'll need to open the storeroom door in the back hallway first.",
  close: 'Close',
  ok: 'OK',
  newClues: n => n === 1 ? 'Added 1 new clue to your notebook.' : `Added ${n} new clues to your notebook.`,
  newClue: 'Added a new clue to your notebook.',
  wrongCost: 'Each wrong guess costs 1 minute.',
  giveUp: 'Step away',
  pull: 'Pull to open',
  unlocked: 'Unlocked!',
  lockOpened: 'The lock pops open!',
  lockStuck: "It won't budge. (1 min)",
  ownerPhone: "Owner's phone",
  putDown: 'Put it down',
  phoneDate: 'Tuesday, November 17',
  notiFrom: 'Regulars',
  notiText: '6 new messages',
  enterCode: 'Enter Passcode',
  cancel: 'Cancel',
  wrongCode: 'Wrong passcode. (1 min)',
  appCost: 'Opening an app for the first time costs 2 min',
  backPhone: '← Phone',
  interview: 'Interview',
  firstStatement: 'First statement',
  hear: name => `Hear ${name}'s statement`,
  showEv: 'Show them a clue from your notebook',
  noCluesOpt: '(no clues)',
  present: 'Show',
  alreadyShown: "You've already shown them that.",
  shown: title => `Showed: ${title}`,
  newClueToast: title => `New clue: ${title}`,
  cost: n => `${n} min`,
  keepInvestigating: 'Keep investigating',
  forcedMsg: "You're out of time. You have to make the call now.",
  q1: 'Who did it?',
  noUndo: "Once you confirm a step, you can't go back.",
  confirm: 'Confirm',
  q2: 'When was the showcase opened?',
  q2hint: 'Pick the most likely time, down to the minute.',
  q3: 'Your evidence',
  q3hint: name => `Pick <b>up to 3</b> clues from your notebook that show ${name} did it.`,
  emptyNotebook: 'Your notebook is empty.',
  submit: 'Submit',
  max3: 'You can only pick 3.',
  grades: ['Case closed', 'Almost there', 'Right person, but…', 'Unsolved'],
  answer: 'Answer: ',
  noneChosen: '(no clues picked)',
  s1: 'STEP 1 · The thief',
  s2: 'STEP 2 · When the showcase was opened',
  s2ans: 'Between 21:40 and 21:47',
  s3: 'STEP 3 · Evidence',
  evGood: '✔ Your case holds up',
  evBad: '✘ Not enough to go on',
  evLegend: '● points to Taesu Park · ○ not directly related',
  result: 'Result',
  usedLine: (m, c, t) => `Time used: ${m} min · Clues found: ${c}/${t}`,
  reveal: 'What really happened',
  again: 'Play again',
  toHow: 'How to play →',
  howTitle: 'How to play',
  start: 'Start investigating',
  resume: 'Back to the case',
  calMonth: 'November',
  calDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  calNotes: {6: 'Game night', 16: 'Display day!', 21: 'Restock', 25: 'Rent'},
  diceSign: '“Roll a 6 and get 10% off your drink!”',
  wbTitle: 'This week',
  wbItems: ['✔ Order wet wipes', '✔ Jenga block missing', '✔ Tidy dice tray', '☐ Tuesday surprise'],
  wbSign: '— Jia',
  expansionBox: 'Desert Market',
  storeroom: 'Storeroom',
  showcaseSign: '⚠ About this showcase',
  wallNote: '(other side: back hallway)',
  intro: `<p>10:02 a.m., November 17. Doyun Han's birthday. The first thing the owner of the Funny Board café did when he got in was open the showcase. Yesterday, for one day only, it had held a first-edition limited set of <i>Dragon Bazaar</i>, and he wanted it safely back home.</p>
  <p>He picked up one of the gold-plated meeples, and gold came off on his thumb. He rubbed it. More came off. Same with the next one, and the one after that. <b>All twenty were plain wooden meeples with a coat of gold paint.</b> The real ones, worth thousands on their own, were gone.</p>
  <p>The showcase was locked. Not a scratch on the glass or the lock.</p>
  <p>From 21:30, when he left last night, until 22:20, when the doors were locked, four people were in the café: his part-timer, two regulars, and the guy who runs the shop next door. He knows every one of them.</p>
  <p class="say">"If I call the police, the whole neighborhood's going to hear about it. Can you just quietly look into this? We open at 11:30."</p>`,
  howGoal: 'There\'s one goal: figure out <b>who swapped the meeples, when, and how</b>.',
  howSteps: [
    ['Search the café', 'Use the tabs at the top to move between rooms, and click things in the picture to search them. Anything you find goes into your <b>Notebook</b> on the right. Some things are easy to miss.'],
    ['Crack the locks', 'The phone, the CCTV recorder, and the storeroom all have codes. The hints are hidden somewhere in the café.'],
    ['Interview people', 'Hit <b>Interview</b> at the top, pick someone, and hear their statement. Then show them clues from your notebook — sometimes they\'ll tell you more.'],
    ['Name the thief', 'When you\'re ready, hit <b>Name the thief</b>. Pick the culprit, enter the time, and submit your evidence. After that you\'ll see your result and the full story.'],
  ],
  howTime: '<b>⏱ 80 minutes to investigate</b> <span style="color:var(--dim)">(game time, not real time — every action uses some up)</span>',
  howCosts: [['Search an object', '2 min'], ['Hear a statement · show a clue', '3 min'], ['Wrong code', '1 min'], ['Move between rooms · reread notebook', 'free']],
  howNote: "You won't have time to check everything. When you hit 0, you have to name the thief right away.",
  story: `It was the collector. Taesu Park.

[One week before]
The owner posted in the group chat: "Next Monday only, I'm putting the Dragon Bazaar first-edition limited set on display!" That's the day Taesu's plan started.
The next day, he went to the workshop next door and paid cash for a pot of Metal Gold MG-07 and a fine brush. He didn't leave a name. At home, he painted the 20 meeples from his own standard edition, one by one. His brushwork was sloppy. And he couldn't resist showing off: he posted a photo of his painting desk in the group chat. "new hobby lol." When someone asked what it was, all he said was "it's a secret."

[Display day, 18:12]
"all 20 gold meeples are in there, right?"
The owner didn't think twice. "yep, full set."
At 18:40, Taesu walked into the café and set up the standard edition. In his backpack were twenty gold fakes.

[21:30]
The owner went home.

[21:31]
The showcase app lost its Wi-Fi. From then on, opening the showcase would leave nothing on the owner's phone. Nobody knew. Lucky break for Taesu.

[21:40]
Gunwoo Choi walked in with a birthday present. He had no tape to seal the box, so Jia Seo went into the storeroom to find some.
Those few minutes were exactly what Taesu had been waiting for.

[21:41]
He wrote down the end time of game three and got up. He filled a paper cup at the water cooler, which sits behind the counter, right behind the drawer. He reached over and took the showcase key from the left side of the drawer. Gunwoo, standing at the counter, didn't look at the face of the customer getting water. All he remembered was something red.
The back hallway. He turned the key. Beep.
On the other side of a thin plywood wall, Jia heard it from the storeroom. She figured a customer was opening the restroom door. But that restroom door doesn't beep. It creaks.
He took out the twenty real meeples and put in the twenty fakes. Locked the door again. Dropped his empty cup in the trash next to the showcase.

[21:47]
He was back at his table setting up game four. At the same moment, Gunwoo got his tape and left. On the log sheet, 21:41 to 21:47 is blank.

[22:05]
At checkout, reaching in for his receipt, he slipped the key into the right side of the drawer, the side customers can reach. Jia always puts the key on the left side, from behind the counter. She'd never leave it on the right.
The real meeples walked out the door with him, in his backpack.

[22:10]
Jia tugged on the showcase lock and put a check on her list. It was locked, after all. She didn't open the box.

────────────

[Pinning down the time]
The showcase app is no help; it was offline from 21:31. The key is the beep. Jia heard it while she was in the storeroom looking for Gunwoo's tape. CCTV shows Gunwoo was in the café from 21:40 to 21:47. And Taesu's log sheet has a gap from 21:41 to 21:47.

[The fakes came from outside]
The café's only standard edition was the one on Table B, and all 20 of its meeples were there. The fakes were painted at home. The appraisal (painted at least two days ago, MG-07, standard-edition meeples) lines up exactly with the workshop ledger (MG-07 bought with cash six days ago, "said it's for painting meeples").

[The red herrings]
• Jia Seo: she was upset with the owner about her pay, and she had gold flakes on her hands. But when the beep happened, she was inside the storeroom. The flakes came from the wrapping paper.
• Mirae Yoon: she lied about not knowing about the display. But she showed up at 21:50, after it was all over, and only took a photo at 21:55. The sparkly gold is nail glitter.
• Gunwoo Choi: he knows his paint. But he uses MG-03, and the fakes are sloppy MG-07. He's not in the group chat, so he couldn't have known the display date ahead of time.
• Every gold trace was bait. The foil, the glitter, the MG-03. The real gold came off the tip of Taesu's brush.`,
},

cats: {'현장': 'Scene', '기록': 'Record', '물증': 'Evidence', '증언': 'Testimony'},

clues: {
  c_frame: {title: 'Framed photo'},
  c_calendar: {title: 'Wall calendar'},
  c_board: {title: 'Whiteboard', text: 'This week\n✔ Order wet wipes\n✔ Check missing Jenga block\n✔ Tidy up the discount dice tray\n☐ Get ready for Tuesday surprise 🤫\n— Jia'},
  c_dice: {title: 'Discount dice tray'},
  c_postit: {title: 'Note under the keyboard'},
  c_check: {title: 'Closing checklist', text: 'Filled in by: Jia Seo\n\n22:10 Showcase locked ✔ (tugged the lock)\n22:15 Boss\'s present wrapped ✔\n22:20 Front door locked ✔'},
  c_glitter: {title: 'Returned expansion box', text: 'Dragon Bazaar Expansion: Desert Market, returned by Mirae Yoon at 21:52.\nThere are sparkly gold specks on the corner of the lid.'},
  c_gift: {title: 'Wrapped birthday present', text: 'A box wrapped in gold foil paper. Gold flakes come off on your hands.\nInside: a dragon figurine painted gold, and a card.\n"Happy birthday, boss! — Gunwoo"\nA tiny sticker under the base: MG-03'},
  c_key: {title: 'Key in the register drawer', text: 'The drawer has two compartments.\nLeft: a few rolls of receipt paper.\nRight: the showcase key and a few card receipts.\n\n(You take the key.)'},
  c_water: {title: 'Water cooler', text: 'A water cooler for customers, with a paper cup dispenser on the side. A few cups are gone.'},
  c_cctv: {title: 'Front door CCTV log', html: `<table><tr><th>Time</th><th>Event</th></tr>
<tr><td>17:00</td><td>Jia Seo starts her shift</td></tr>
<tr><td>18:40</td><td>Taesu Park enters</td></tr>
<tr><td>19:00</td><td>2 customers enter</td></tr>
<tr><td>21:20</td><td>2 customers leave</td></tr>
<tr><td>21:30</td><td>Owner Doyun Han leaves</td></tr>
<tr><td>21:40</td><td>Gunwoo Choi enters</td></tr>
<tr><td>21:47</td><td>Gunwoo Choi leaves</td></tr>
<tr><td>21:50</td><td>Mirae Yoon enters</td></tr>
<tr><td>21:58</td><td>Mirae Yoon leaves</td></tr>
<tr><td>22:05</td><td>Taesu Park leaves</td></tr>
<tr><td>22:20</td><td>Jia Seo leaves, front door locked</td></tr>
<tr><td>until 10:00 next day</td><td>No one in or out</td></tr></table>`},
  c_cctvphoto: {title: 'CCTV stills', text: '18:40 Taesu Park — red plaid shirt\n21:30 Doyun Han — gray sweater\n21:40 Gunwoo Choi — green work apron\n21:50 Mirae Yoon — beige coat'},
  c_showapp: {title: 'Showcase app log', html: `<table><tr><th>Time</th><th>Event</th></tr>
<tr><td>21:27</td><td>Opened</td></tr><tr><td>21:29</td><td>Closed</td></tr>
<tr><td>21:31</td><td>⚠ Device disconnected</td></tr>
<tr><td>Next day 09:58</td><td>Device reconnected</td></tr><tr><td>Next day 10:02</td><td>Opened</td></tr></table>`},
  c_chat: {title: 'Regulars group chat'},
  c_sms: {title: "Jia's texts", text: 'Three days before, Jia Seo → Doyun Han\n"Boss, I still haven\'t been paid for last month 😢 If it doesn\'t come through this week I\'m seriously in trouble."\n\nDoyun Han: "So sorry 😢 I\'ll get it to you this week, I promise"'},
  c_market: {title: 'Secondhand marketplace screenshot', text: 'A screenshot the owner\'s friend sent him. Posted at 22:30 on the night of the theft.\n\nUser "MR_store":\n"Anyone know what a complete Dragon Bazaar first-edition limited set goes for? Saw one in person today."\n\nAttached photo: the limited-edition box, taken right up against the showcase glass. The photo info says it was taken at 21:55.'},
  c_beepnote: {title: 'Showcase notice', text: '"This showcase beeps when the door is opened. Every open and close is logged in the owner\'s phone app."'},
  c_fake: {title: '20 fake meeples', text: 'The 20 meeples from the limited-edition box. Every one of them is a wooden meeple painted gold.\nRub one hard and a tiny bit of gold comes off.'},
  c_appraisal: {title: 'Appraisal of the fakes', text: 'Reply from an appraiser the owner knows:\n\n• Painted at least two days ago.\n• Paint: Metal Gold MG-07\n• Underneath: genuine wooden meeples from the standard edition of Dragon Bazaar'},
  c_restroom: {title: 'Restroom door', text: 'When you open the restroom door, the hinges let out a long "creeeak."'},
  c_cup: {title: 'Paper cup in the trash', text: 'The trash can next to the showcase. The bag is fresh, and there\'s nothing in it but one paper cup with a little water left in the bottom.'},
  c_boxB: {title: 'Standard edition on Table B', text: 'The standard edition of Dragon Bazaar on Table B. You count the meeples: 20. No gold on any of them.'},
  c_sheet: {title: 'Solo play log', html: `<table><tr><th>Game</th><th>Start</th><th>End</th></tr>
<tr><td>Game 1</td><td>18:50</td><td>19:40</td></tr>
<tr><td>Game 2</td><td>19:45</td><td>20:40</td></tr>
<tr><td>Game 3</td><td>20:45</td><td>21:41</td></tr>
<tr><td>Game 4</td><td>21:47</td><td>(not finished)</td></tr></table>`},
  c_shelf: {title: 'Game shelf', text: 'There\'s only one slot for the standard edition of Dragon Bazaar. It\'s empty, with a card tucked in: "Checked out → Table B."'},
  c_tape: {title: 'Upended tape box', text: 'Under the storeroom shelf. The tape box has been tipped over and a few rolls are lying on the floor. Someone went through it in a hurry.'},
  c_foil: {title: 'Roll of gold wrapping paper', text: 'A roll of gold foil wrapping paper with the end cut off. Gold flakes come off when you touch it.'},
  c_wall: {title: 'Storeroom wall', text: 'You knock on the wall. It sounds hollow. It\'s just one sheet of plywood.'},
  c_t_seo: {title: 'Jia: "I heard a beep"', text: '"A beep? Oh, yeah, I did! It came through the wall while I was in the storeroom looking for tape for Gunwoo. I thought it was a customer opening the restroom door."'},
  c_t_choi: {title: 'Gunwoo: "Someone got water"', text: '"Oh, while Jia was in the storeroom, a customer got a cup of water from the cooler and walked off toward the back. I didn\'t see their face. I think they were wearing red, though…"'},
  c_ledger: {title: 'Workshop sales ledger', text: 'The sales ledger Gunwoo showed you (past week)\n\n7 days ago — Primer ×1 / card / Lee ○○\n6 days ago — MG-07 small ×1, fine brush ×1 / cash / (no name) Note: "said it\'s for painting meeples"\n5 days ago — MG-03 large ×1 / for workshop use\n4 days ago — MG-21 Red ×1 / card / Kim ○○\n2 days ago — Varnish ×1 / cash / (no name)'},
  c_t_park: {title: 'Taesu: changes his story', text: '"…Is getting a glass of water a crime now? I walked over toward the restroom for a second while I drank it. I just didn\'t remember earlier."'},
  c_t_yoon: {title: 'Mirae: comes clean', text: '"…Okay, yes, I took the photo. I wanted to know what it was worth. I took it around 9:55, right up against the glass, but it was already locked and I didn\'t touch a thing. I said I didn\'t know about it because… it was embarrassing."'},
},

chatHeader: `<div style="background:#1f2229;color:#eee;border-radius:10px;padding:10px 12px;margin:-4px -4px 6px"><div style="display:flex;justify-content:space-between;font-weight:700"><span>Funny Board Regulars</span><span style="color:#8a8f99;font-weight:400;font-size:12px">👥 13</span></div><div style="margin-top:6px;font-size:11px;color:#aab;line-height:1.7">Members: Doyun Han (admin) · Haneul Kim · Minseok Jung · Sora Lee · Taesu Park · Mirae Yoon · Sejin Oh · Daeun Kang · Junho Moon · Yuna Baek · Jihoo Song · Chaewon Lim · Gibeom Hong</div></div>`,
chat: {
  days: {'7일 전': '7 days ago', '5일 전': '5 days ago', '3일 전': '3 days ago', '사건 당일': 'The day of'},
  names: {'한도윤': 'Doyun Han', '김하늘': 'Haneul Kim', '정민석': 'Minseok Jung', '박태수': 'Taesu Park', '이소라': 'Sora Lee', '윤미래': 'Mirae Yoon'},
  lines: {
    '다음 주 월요일 하루, 드래곤 바자르 초판 한정판 전시합니다!': "Next Monday only, I'm putting the Dragon Bazaar first-edition limited set on display!",
    '와 실물 처음 보겠다': "whoa, I've never seen one in person",
    '그날 야근이라 ㅠㅠ': 'working late that day 😭',
    '요즘 새 취미 ㅋㅋ': 'new hobby lol',
    '오 이거 뭐예요? 귀엽다': "ooh what's that? cute",
    '레고?': 'lego?',
    '비밀 ㅋㅋ': "it's a secret lol",
    '금요일 테라포밍 마스 하실 분~': 'anyone up for Terraforming Mars on Friday?',
    '저요저요': 'me me me',
    '오늘 전시 시작! 구경 오세요~': "It's up! Come check it out~",
    '오 퇴근하고 보러 갈게요!': "ooh I'll swing by after work!",
    '사진 올려주세요 ㅠ': 'post pics pls 😭',
    '도금 미플 20개 다 들어 있는 거 맞죠?': 'all 20 gold meeples are in there, right?',
    'ㅇㅇ 꽉 채워서': 'yep, full set',
    '내일 사장님 생일인 거 다들 알죠? 케이크 사 갈게요': "you all know it's the boss's birthday tomorrow right? I'll bring a cake",
  },
},

suspects: {
  seo: {name: 'Jia Seo', sub: 'Part-timer · 24',
    base: '"Around 9:40, Gunwoo came by to drop off a birthday present for the boss. He needed tape to seal the box, so I went to the storeroom to find some. It took me three or four minutes. When I came out, he was still standing at the counter.\nMirae came in at 9:50 and I checked in her return, and after that I wrapped the present at the counter. Taesu paid and left at 10:05. At 10:10 I tugged on the showcase lock to check it, and then I went home."',
    def: '"I\'m not really sure about that."',
    ev: {
      c_showapp: '"Disconnected? The Wi-Fi cuts out at night sometimes. The boss keeps saying he\'ll get a new router…"',
      c_sms: '"…Okay, yes, I was upset about my pay. But I\'d never touch the boss\'s things. Is there any record of the showcase opening after 10, when I was here alone? There isn\'t, is there?"',
      c_key: '"The key? I always put it in the left side, from behind the counter. Customers can reach the right side, so I\'d never put it there. That\'s where customers grab their receipts when they pay."',
      c_check: '"I just tugged on the lock. It was locked, so… I didn\'t open the box and check inside."',
      c_gift: '"That gold glitter is mine. I got it all over me wrapping the boss\'s present."',
      c_foil: '"That\'s what I wrapped the present in. I grabbed it while I was looking for tape in the storeroom."',
      c_shelf: '"There\'s only one standard copy of that game. Taesu had it out on Table B all night."',
      c_tape: '"Yeah, that was me. I couldn\'t find the tape, so I just dumped the box out."',
      c_cup: '"A paper cup? I didn\'t use any cooler cups at closing. Must have been a customer."',
    }},
  park: {name: 'Taesu Park', sub: 'Regular, collector · 38',
    base: '"I played the standard edition solo all evening. Check my log sheet. The only time I left the table was once after 10, to use the restroom right before I paid. Around 9:40 I\'d just finished game three and was setting up game four at my table.\nSure, I wanted that limited edition. But I\'m not the kind of guy who steals. I\'ve never painted anything in my life."',
    def: '"What does that have to do with me?"',
    ev: {
      c_sheet: '"It took a while to set up game four after game three ended. What\'s weird about that?"',
      c_cup: '"What does a paper cup have to do with me? Am I the only one who uses cups in that place?"',
      c_chat: '"My new hobby? Oh, that… that was Lego. Not painting."',
      c_ledger: '"Got any proof I\'m the one who paid cash for paint? That shop must have tons of customers."',
      c_appraisal: '"I don\'t know anything about paint numbers."',
      c_boxB: '"See? Every meeple in the box I used is still there. It wasn\'t me."',
      c_key: '"I never touched the key. All I did was take my receipt when I paid."',
      c_cctvphoto: '"Yeah, I wore a plaid shirt that day. So?"',
    }},
  yoon: {name: 'Mirae Yoon', sub: 'Regular · 31',
    base: '"I just returned the expansion and left. I didn\'t even go near the showcase. Honestly, I didn\'t even know the limited edition was at the café that day."',
    def: '"That\'s the first I\'ve heard of it."',
    ev: {
      c_chat: '"…Fine. I did go to see it. But I didn\'t do anything."',
      c_cctv: '"I got there at 9:50. I wasn\'t in the café before that."',
      c_glitter: '"That\'s from my nails. I got glitter put on them this week."',
      c_cctvphoto: '"Cute nails, right? Gold glitter."',
    }},
  choi: {name: 'Gunwoo Choi', sub: 'Owns the workshop next door · 45',
    base: '"I painted a dragon figurine for the boss\'s birthday and went to leave it with Jia. I stood at the counter waiting for tape to seal the box, and left as soon as I had it.\nI don\'t really know board games. I had no idea what the limited edition even was. And I\'m not in that group chat."',
    def: '"Hm, that\'s not really my area."',
    ev: {
      c_appraisal: '"MG-07? I only ever use 03 for my own work. 07 is one we sell in the shop. Want to take a look at the ledger?"',
      c_fake: '"Hmm… pretty sloppy brushwork. I wouldn\'t paint it like that."',
      c_gift: '"I painted that figurine. With the paint I always use at the workshop."',
      c_showapp: '"I\'d have no way of knowing about app logs. I just stood at the counter for about seven minutes."',
      c_key: '"The drawer? I was on the customer side of the counter. I couldn\'t reach the inside compartment."',
    }},
},

hs: {
  frame: {label: 'Framed photo'},
  calendar: {label: 'Calendar'},
  board: {label: 'Whiteboard', steps: ['The staff whiteboard.']},
  dice: {label: 'Dice tray', steps: ['You take a look at the little tray at the end of the counter.']},
  dvr: {label: 'CCTV recorder', puzzle: {title: 'CCTV recorder', prompt: '4-digit admin code'}, steps: ['The recorder unlocks. You scroll back through last night.']},
  keyboard: {label: 'Keyboard', steps: ['Just a keyboard. A few keys are worn down, but nothing stands out.']},
  postit: {name: 'Under the keyboard'},
  clip: {label: 'Closing checklist', steps: ['There\'s a closing checklist on a clipboard on the counter.']},
  retbox: {label: 'Returned game box', steps: ['You look over the expansion box that was returned last night.']},
  phone: {label: "Owner's phone", puzzle: {title: "Owner's phone", prompt: '4-digit passcode'}},
  gift: {label: 'Wrapped present', steps: ['You carefully open the gold-wrapped present.']},
  drawer: {label: 'Register drawer', steps: ['You open both compartments of the register drawer.']},
  water: {label: 'Water cooler', steps: ['You check the water cooler behind the counter.']},
  shelf: {label: 'Game shelf', steps: ['The shelf is packed with popular games. Dragon Bazaar gets just one slot, and it\'s empty. A card in front says "Checked out → Table B."']},
  window: {label: 'Window', steps: ['Locked from the inside, and the security bars are intact. Nobody got in this way.']},
  tableA: {label: 'Table A', steps: ['Someone left a lighter here. Probably a daytime customer. Doesn\'t look related.']},
  tableB: {label: 'Table B', steps: ['You open the standard-edition box on Table B and count the meeples. When you lift the box, you spot a sheet of paper underneath.']},
  sheet: {name: 'Paper under the box', steps: ['You slide out the paper from under the box.']},
  tableC: {label: 'Table C', steps: ['A collapsed Jenga tower. Looks like nobody cleaned up after the daytime crowd.']},
  plant: {name: 'Plant', steps: ["The soil is bone dry. Nobody's watered it in a while."]},
  storeDoor: {label: 'Storeroom door', puzzle: {title: 'Storeroom padlock', prompt: '3-digit combination lock. Each dial has a dot painted next to it: red, yellow, and blue, from top to bottom.'}, steps: ['The storeroom door swings open.']},
  sign: {label: 'Showcase notice', steps: ['You read the notice above the showcase.']},
  showcase: {label: 'Showcase', steps: [{lockText: "The glass door is locked. You'll need a key.", text: 'You unlock the showcase. It beeps. You take out the meeples and line them up on the bottom glass shelf.'}]},
  meeples: {label: 'The fake meeples', steps: ['You send one of the meeples, with photos, to an appraiser the owner knows, and wait for an answer.']},
  wc: {label: 'Restroom door', steps: ['You open the restroom door.']},
  trash: {name: 'Trash can', steps: ['You peek into the trash can in the corner.']},
  tape: {label: 'Under the shelf', steps: ['You check under the shelf.']},
  foil: {label: 'Wrapping paper', steps: ['You go through the pile of wrapping paper.']},
  wall: {label: 'Back wall', steps: ['You knock on the wall. It sounds hollow.']},
  boxes: {label: 'Stock boxes', steps: ['Boxes of games in stock, all still shrink-wrapped.']},
},

apps: {app_show: 'Showcase app', app_chat: 'Regulars chat', app_sms: 'Messages', app_photo: 'Screenshots'},

locs: {
  counter: {name: 'Front counter', desc: 'The counter by the entrance. The water cooler is behind the counter, right behind the drawer.'},
  tables: {name: 'Game tables', desc: 'Three tables and a game shelf.'},
  back: {name: 'Back hallway', desc: 'The storeroom door, the showcase, and the restroom door, side by side.'},
  storage: {name: 'Storeroom', desc: 'A cramped storeroom packed with shelves and stock.'},
},
};
