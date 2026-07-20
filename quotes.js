/**
 * quotes.js — Expanded Literary, English, and Mizo quote data for Witty Weather.
 *
 * Literary quotes are stored as template functions:
 *   (month, period, timeOfDay) => string
 *
 * `period`    — "early in" | "late in"
 * `timeOfDay` — "morning" | "afternoon" | "evening" | "night"
 */

const QUOTES = {
    hot: {
        en: [
            "The sun reminds us that all things must burn out eventually. Until then, enjoy sweating through your shirt.",
            "At this temperature, even your motivation has evaporated.",
            "The heat is nature's way of telling you to stay inside and reconsider your life choices.",
            "You know it's hot when you start negotiating with your air conditioner.",
            "The air feels like soup today. Unseasoned, boiling soup.",
            "It's the kind of heat that makes you question why humanity didn't evolve as aquatic creatures.",
            "I'd suggest going outside, but I don't want to be responsible for your spontaneous combustion.",
            "Perfect weather for frying an egg on the sidewalk, if eggs weren't so expensive.",
            "The thermometer is just a measure of how thoroughly your spirit is currently being cooked.",
            "Welcome to the devil's sauna. Your complimentary towel of regret is waiting."
        ],
        mz: [
            "Ni sa tak hian engkim a ral dawn tih min hriattir. Chu mi hma chu i thlan tla kha lo tuar hram hram rawh.",
            "Hetiang khaw lum ah hi chuan thawk peihna tak ngial pawh a tui ral zo ta.",
            "Khawlum lutuk hian in chhung a tawm a, kan nun uluk taka inngaihtuah tha leh turin min hrilh a ni.",
            "I AC be lungawi tura i thlem tan vel ah khan khua a lum hle tih i hre mai ang.",
            "Borual chu chawhmeh tuihang sa ver vawr, chi telh loh ang mai a ni."
        ],
        lit: [
            (m, p, t) => `On an exceptionally hot ${t}, ${p} ${m}, the young man left his garret... — Fyodor Dostoevsky, "Crime and Punishment"`,
            (m, p, t) => `It was a wrong number that started it, the telephone ringing three times in the dead of a sweltering ${m} ${t}... — Paul Auster, "City of Glass"`,
            (m, p, t) => `The heat of ${m} was like a blanket wrapped around the world, suffocating and inescapable... — Harper Lee, "To Kill a Mockingbird"`,
            (m, p, t) => `There was no escape from the blistering sun of ${m}, not in the shade, not in the sea... — Albert Camus, "The Stranger"`,
            (m, p, t) => `Meursault walked under the blazing ${m} sun, and the heat pressed against him like a wall of flame. — Albert Camus, "The Stranger"`,
            (m, p, t) => `The ${m} heat was relentless; even the dogs had given up and lay panting in the dust. — Gabriel García Márquez, "One Hundred Years of Solitude"`,
            (m, p, t) => `It was a hot ${m} ${t}, and the air hummed with the oppressive weight of impending doom. — F. Scott Fitzgerald, "The Great Gatsby"`,
            (m, p, t) => `The sun beat down on ${m}, stripping the earth of moisture and men of their patience. — John Steinbeck, "The Grapes of Wrath"`
        ],
    },

    cold: {
        en: [
            "In the freezing cold, we reflect on our own fragile existence. Also, on why we choose to live where the air hurts.",
            "It's the kind of cold that makes you question every decision that led you to this moment.",
            "Mother Nature has decided to turn the world into her personal walk-in freezer.",
            "Your blood may freeze today, but look on the bright side: so will your problems.",
            "It is currently 'I can't feel my face' degrees outside. Proceed with caution.",
            "The air is so crisp it could shatter. Much like your resolve to get anything done today.",
            "This level of cold is a direct insult to the concept of leaving bed.",
            "Step outside to experience the breathtaking beauty of immediately wanting to go back inside."
        ],
        mz: [
            "Khaw vawt ah hian kan derdep zia kan in hmu chhuak. Chu lo ah, engati nge thli in min chhem nat theihna hmunah kan awm reng le?",
            "He khaw vawt hian hetah hian eng nge maw ka tih le tih min ngaihtuah chhuah tir a ni.",
            "Khuarel hian khawvel hi a fridge ang maiah a siam a ni e.",
            "I thisen a khal thei hial ang, mahse hei hi ngaihtuah la: i buaina te pawh a khal vek thei a ni."
        ],
        lit: [
            (m, p, t) => `It was a bright cold day in ${m}, and the clocks were striking thirteen. — George Orwell, "1984"`,
            (m, p, t) => `The cold was absolute, a bitter, unforgiving chill ${p} ${m}... — Jack London, "The Call of the Wild"`,
            (m, p, t) => `The air was biting and sharp in ${m}; the frozen ground crunched beneath their boots. — Charles Dickens, "A Christmas Carol"`,
            (m, p, t) => `A frozen wind swept over the snows of ${m}, piercing through to the bone. — Boris Pasternak, "Doctor Zhivago"`,
            (m, p, t) => `The ${m} cold seeped through every crack and cranny, as if the world itself were dying. — Cormac McCarthy, "The Road"`,
            (m, p, t) => `It was so cold that ${m} ${t} that the very words seemed to freeze in the air before they could be heard. — Virginia Woolf, "Orlando"`
        ],
    },

    clearDay: {
        en: [
            "A clear sky offers boundless horizons, serving only to highlight your total lack of ambition today.",
            "The sun is out. Your excuses aren't.",
            "Blue skies and sunshine. How terribly mundane.",
            "An irritatingly perfect day. Try not to ruin it with your attitude.",
            "The weather is aggressively cheerful today. It's almost insulting.",
            "Not a cloud in sight. There is literally nothing to blame your bad mood on today.",
            "Nature has provided a perfect backdrop for you to do absolutely nothing of consequence.",
            "A beautiful day to stare at a screen indoors."
        ],
        mz: [
            "Van thengreng tak hian chinlem awmlo min hmuhtir a, vawiin a i that chhiat zia a rawn pholang chiang hle.",
            "Ni a sa vawl vawl a, chhuanlam tur a awm tawh lo.",
            "Van pawl ram leh nisa mawi tak. A va han ninawm thin em.",
            "Ni nuam tak a ni. I lungawi lohna nen ti chhe lo hram ang che."
        ],
        lit: [
            (m, p, t) => `The sun shone, having no alternative, on the nothing new in ${m}. — Samuel Beckett, "Murphy"`,
            (m, p, t) => `It was a beautiful ${m} ${t}; the sky was a deep, unblemished blue... — Ernest Hemingway, "The Sun Also Rises"`,
            (m, p, t) => `Under the blazing ${m} sun, everything seemed possible, yet nothing seemed to happen. — Gabriel García Márquez, "One Hundred Years of Solitude"`,
            (m, p, t) => `The ${m} sun poured down like molten gold, and the world shimmered in its heat. — F. Scott Fitzgerald, "Tender Is the Night"`,
            (m, p, t) => `It was one of those ${m} days when the sun shone hot and the wind blew cold: when it is summer in the light, and winter in the shade. — Charles Dickens, "Great Expectations"`,
            (m, p, t) => `A vast, indifferent blue stretched across the ${m} sky, uncaring of the mortals bustling below. — Leo Tolstoy, "War and Peace"`
        ],
    },

    clearNight: {
        en: [
            "The infinite stars remind us of our complete insignificance. Try not to let it bruise your ego too much.",
            "A perfectly clear night — ideal for existential contemplation you didn't ask for.",
            "Look at all those stars you can't see because of light pollution.",
            "The cosmos is putting on a show. You're probably looking at your phone.",
            "A cloudless night sky. The universe is watching you make poor decisions.",
            "Darkness has fallen. Time to overthink everything you said five years ago."
        ],
        mz: [
            "Arsi mawi tak tak te hian kan te zia min hriattir. I induhna kha a tih hniam phah lutuk loh nan fimkhur rawh.",
            "Zan thla eng mawi tak — i dil chhut loh buaina te ngaihtuah nan a tha.",
            "Arsi eng mawi tak tak khu light pollution vangin i hmu thei lo a nih khu.",
            "Khawvel in lemchan a buatsaih a. Nang chuan i phone chauh i bih si."
        ],
        lit: [
            (m, p, t) => `In ${m}, the night was clear and the stars seemed to hang so close you could touch them. — F. Scott Fitzgerald, "The Great Gatsby"`,
            (m, p, t) => `The night sky of ${m} was a vast, glittering expanse of cold, distant indifference. — Cormac McCarthy, "Blood Meridian"`,
            (m, p, t) => `The moon shone brightly over the sleeping world ${p} ${m}... — Charlotte Brontë, "Jane Eyre"`,
            (m, p, t) => `He looked up at the ${m} stars and felt the old, nameless longing stirring inside him. — Jack Kerouac, "On the Road"`,
            (m, p, t) => `The stars of ${m} glittered overhead like a million indifferent eyes. — Thomas Hardy, "Far from the Madding Crowd"`,
            (m, p, t) => `It was a crisp ${m} ${t}, and the stars pierced the darkness like icy needles of light. — J.R.R. Tolkien, "The Fellowship of the Ring"`
        ],
    },

    clouds: {
        en: [
            "Even behind the darkest clouds, the sun still shines. It's just actively choosing to ignore you right now.",
            "Overcast: the sky's way of matching your mood without being asked.",
            "A grey sky for a grey day. Consistency is key.",
            "The clouds are gathering to judge you collectively.",
            "It's neither sunny nor raining. It's the meteorological equivalent of 'fine'.",
            "The sky looks like a damp wool blanket. Cozy, if you're a moth.",
            "Sunlight is temporarily unavailable. Please check your existential dread for updates."
        ],
        mz: [
            "Chhum dum chhah tak karah pawh ni a la sa reng. Amah erawh chu tunah tak hi chuan a pehhel lui che a nih hi.",
            "Khua a chhum zin hian, i rilru put hmang ang chiah in van pawh hian a tilang a ni.",
            "Ni ngui takah van pawh a ngui ve. A in mil tawk chiah.",
            "Chhumte chu an rawn inkhawm khawm a, an rawn rel dawn che a nih hmel."
        ],
        lit: [
            (m, p, t) => `There was a bleak, cloudy sky in ${m}, and the sun was nowhere to be seen. — Johann Wolfgang von Goethe, "The Sorrows of Young Werther"`,
            (m, p, t) => `The leaden sky of ${m} pressed down upon the earth, heavy and silent. — Emily Brontë, "Wuthering Heights"`,
            (m, p, t) => `The gray overcast of ${m} mirrored the melancholic thoughts of the solitary traveler. — J.D. Salinger, "The Catcher in the Rye"`,
            (m, p, t) => `A heavy ${m} sky hung above, dull and listless, as if it too had given up hope. — Leo Tolstoy, "Anna Karenina"`,
            (m, p, t) => `The ${m} clouds sat low and sullen, refusing to break, refusing to weep. — Sylvia Plath, "The Bell Jar"`
        ],
    },

    fog: {
        en: [
            "Fog: nature's way of saying 'I'd rather you didn't see what's coming.'",
            "The world is hidden in mist. Lucky you — ignorance is bliss.",
            "Welcome to Silent Hill. Please try not to bump into your own repressed memories.",
            "The universe hasn't finished rendering the background yet. Please wait.",
            "A thick fog has descended to hide all the mistakes you made yesterday.",
            "The air is basically just water holding its breath."
        ],
        mz: [
            "Chhum a la te a, eng mah a lang chiang lo. Hriatloh na hi a nuam a ni ang.",
            "Khawvel chu chhum in a hliah khuh a. I vannei hle mai - hriat loh hi a hahdam thlak a nia.",
            "Silent Hill ah kan lo lawm a che. I hriatna hlui tha lo tak tak te kha i su palh hlauh ange.",
            "Khawvel hian hnunglam a la siam zo lo a. Khawngaih in lo nghak rawh."
        ],
        lit: [
            (m, p, t) => `The yellow fog that rubs its muzzle on the windowpanes of ${m}... — T.S. Eliot, "The Love Song of J. Alfred Prufrock"`,
            (m, p, t) => `Fog everywhere. Fog up the river, fog down the river, fog on the ${m} marshes... — Charles Dickens, "Bleak House"`,
            (m, p, t) => `The fog comes on little cat feet, settling over the harbor in ${m}... — Carl Sandburg, "Fog"`,
            (m, p, t) => `A thick ${m} fog crept in from the moors, swallowing the world in silence. — Arthur Conan Doyle, "The Hound of the Baskervilles"`,
            (m, p, t) => `The ${m} mist rolled through the streets like the breath of something ancient. — Bram Stoker, "Dracula"`
        ],
    },

    rain: {
        en: [
            "Rain nourishes the earth, but mostly it just gives you a beautiful excuse to cancel all your plans and stay in bed.",
            "The rain doesn't care about your hair. Neither does anyone else, honestly.",
            "Water is falling from the sky. This is somehow still surprising to people on their daily commute.",
            "Excellent weather for staring out a window and pretending you're in a sad indie movie.",
            "The sky is crying. Probably because it saw your browser history.",
            "Nature's car wash has commenced. You're standing in it.",
            "A gentle reminder from the sky that you aren't made of sugar and you won't melt."
        ],
        mz: [
            "Ruah in leilung a chawm nung a, mahse a tangkai ber chu chhuah loh chhuanlam tur tha tak min pe hi a ni.",
            "Ruah hian i sam awmdan a ngaihven lo. A nihna takah chuan, midang pawhin an ngaihven chuang lo.",
            "Van atangin tui a lo tla a. Hei hi eng tin tin emaw ni zin mi te tan chuan thil mak a la ni reng thin.",
            "Tukverh atanga pawn lam thlir a, lemchan thawnthu lungchhiatthlak taka changtupa/nu anga in ngaih theihna hun tha a ni."
        ],
        lit: [
            (m, p, t) => `It was a dark and stormy ${t} ${p} ${m}; the rain fell in torrents... — Edward Bulwer-Lytton, "Paul Clifford"`,
            (m, p, t) => `The rain of ${m} fell steadily, relentlessly, washing away the sins of the city... — Raymond Chandler, "The Big Sleep"`,
            (m, p, t) => `A heavy downpour in ${m} turned the streets into rivers and the world into a blur. — Philip K. Dick, "Do Androids Dream of Electric Sheep?"`,
            (m, p, t) => `The relentless rain of ${m} beat against the windowpane like a frantic, desperate drumming. — Edgar Allan Poe, "The Fall of the House of Usher"`,
            (m, p, t) => `It rained all ${m} ${t}, a driving, punishing rain that rattled the shutters and flooded the gutters. — Ernest Hemingway, "A Farewell to Arms"`,
            (m, p, t) => `The ${m} rain fell like a curtain between the present and the past. — Haruki Murakami, "Kafka on the Shore"`
        ],
    },

    snow: {
        en: [
            "Each snowflake is uniquely beautiful, just like everyone else. Which mathematically means none of us are special.",
            "Snow: frozen water falling slowly to inconvenience you specifically.",
            "Everything is covered in a beautiful, pristine blanket of frozen water that you now have to shovel.",
            "The world looks magical. Your commute, however, will be tragic.",
            "A winter wonderland! Assuming you don't actually have to go anywhere.",
            "The sky is dropping icy glitter. Clean-up will be extensive."
        ],
        mz: [
            "Vur tla tin te hi an mawi danglam bik theuh a, midang zawng zawng pawh. Chu chu tumah kan danglam bik lo tihna a ni.",
            "Vur: Tui khal zawimuanga tla, nangmah bika rawn ti buai tur che in.",
            "Engkim mai chu vur mawi tak hian a khuh mawi a, mahse chu chu i theh faim a ngai tawh thung.",
            "Khawvel chu dawi rama thil awm ang mai in a mawi a. I kalna tur erawh chu tah a chhuak thung ang."
        ],
        lit: [
            (m, p, t) => `It was a cold, snowy ${m} ${t}, and the world seemed to have gone to sleep. — C.S. Lewis, "The Lion, the Witch and the Wardrobe"`,
            (m, p, t) => `The snow of ${m} fell softly, blanketing the earth in a quiet, unforgiving white. — David Guterson, "Snow Falling on Cedars"`,
            (m, p, t) => `A fierce blizzard raged through ${p} ${m}, burying everything in its path. — Stephen King, "The Shining"`,
            (m, p, t) => `Snow was falling gently through the ${m} ${t}, flake after flake, softly against the lamplight. — James Joyce, "The Dead"`,
            (m, p, t) => `The woods are lovely, dark and deep, on this snowy ${m} ${t}... — Robert Frost, "Stopping by Woods on a Snowy Evening"`
        ],
    },

    thunderstorm: {
        en: [
            "Chaos in the skies is a profound reflection of your life falling apart. Or maybe it's just a thunderstorm.",
            "Thunder: the sky clearing its throat before delivering very bad news.",
            "Loud noises and flashing lights. Nature's way of throwing a terrible rave.",
            "The atmosphere is experiencing a violent existential crisis.",
            "Perfect weather for pacing furiously in a gothic mansion. Assuming you own one.",
            "A million volts of electricity discharging in the sky, and you're upset it disrupted your Wi-Fi."
        ],
        mz: [
            "Van a khawpui ri dur dur te hi, i nun buai chuar mek zia tilang tu a ni. A nih loh pawhin khawpui a ri ve mai mai a niang.",
            "Khawpui ri hi van in thu chhe tak a rawn thlen hmaa a aw a then ri a ni.",
            "Ri bengchheng leh eng phe zuai zuai. Khuarel in hunpui rapthlak tak a hmang mek a ni.",
            "Borual hi hrehawm takin a inngaihtuah buai mek a ni."
        ],
        lit: [
            (m, p, t) => `The thunder crashed in ${m}, sounding like the end of the world itself. — Mary Shelley, "Frankenstein"`,
            (m, p, t) => `Lightning tore the sky apart on that fateful ${m} ${t}... — Bram Stoker, "Dracula"`,
            (m, p, t) => `The storm of ${m} was a magnificent, terrifying display of nature's fury. — Herman Melville, "Moby Dick"`,
            (m, p, t) => `The ${m} thunder rolled across the sky like the wrath of forgotten gods. — Homer, "The Odyssey"`,
            (m, p, t) => `Blow, winds, and crack your cheeks! Rage, blow, on this ${m} ${t}! — William Shakespeare, "King Lear"`
        ],
    },

    fallback: {
        en: [
            "The weather simply is. Much like your problems, it's not going away just because you complain about it.",
            "Another day, another forecast you'll ignore while staring at your phone anyway.",
            "Look out the window. That's the weather.",
            "I could tell you the weather, but you probably won't dress appropriately anyway."
        ],
        mz: [
            "Khaw awmdan chu a thleng reng a ni. I buaina te ang chiah khan, i phun vang ringawt in a kiang dawn lo.",
            "Ni thar dang leh, i phone i bih laia khaw awmdan tur i ngaihthah lehna tur ni.",
            "Tukverh ah khan dak la. Chu chu khaw awmdan chu a ni mai.",
            "Khaw awmdan chu ka hrilh thei che a, mahse inthuam dan tur dik chu i hre dawn chuang lo."
        ],
        lit: [
            (m, p, t) => `It is a truth universally acknowledged that a weather app in ${m} must be in want of a good forecast. — Jane Austen, "Pride and Prejudice"`,
            (m, p, t) => `Whether I shall turn out to be the hero of my own ${m} forecast, or whether that station will be held by anybody else, these pages must show. — Charles Dickens, "David Copperfield"`,
            (m, p, t) => `Call me Ishmael. Some ${m} ${t}s ago — never mind how long precisely — I checked the weather. — Herman Melville, "Moby Dick"`
        ],
    },
};
