const SAVE_KEY = 'idle-rpg-phaser-save-v1';
const SAVE_VERSION = 8;
const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000;
const TICK_MS = 1000;
const REST_HEAL_COOLDOWN_MS = 30 * 1000;
const MAX_WEAPONS = 14;
const MAX_ARMORS = 12;
const MAX_ACCESSORIES = 10;
const TIER_ORDER = ['common', 'unusual', 'rare', 'epic'];

const QUEST_RANKS = {
  bronze: { name: 'Bronze', color: '#c58b55' },
  silver: { name: 'Silver', color: '#b8c7d9' },
  gold: { name: 'Gold', color: '#ffcf68' },
  platinum: { name: 'Platinum', color: '#8ee7ff' },
  epic: { name: 'Epic', color: '#d98bff' },
  legendary: { name: 'Legendary', color: '#ff8a65' }
};

const QUEST_CATEGORY_LABELS = {
  slayer: 'Slayer Board',
  explorer: 'Explorer Notes',
  gear: 'Gear Requests',
  training: 'Training Drills',
  boss: 'Boss Tales'
};

const QUESTS = [
  { id: 'first-bonks', category: 'slayer', rank: 'bronze', name: 'First Bonks', description: 'Defeat 5 monsters in any zone.', metric: 'kills', target: 5, rewards: { gold: 18, junk: 6, exp: 12 } },
  { id: 'kill-10', category: 'slayer', rank: 'bronze', name: 'Bug-Sized Warmup', description: 'Defeat 10 enemies total.', metric: 'kills', target: 10, rewards: { gold: 30, junk: 10, exp: 22 } },
  { id: 'backyard-cleanup', category: 'slayer', rank: 'bronze', name: 'Backyard Cleanup', description: 'Defeat 20 monsters and prove the bugs are mostly unfair.', metric: 'kills', target: 20, rewards: { gold: 55, junk: 18, exp: 35 } },
  { id: 'kill-50', category: 'slayer', rank: 'silver', name: 'Fifty Bonk Parade', description: 'Defeat 50 enemies total.', metric: 'kills', target: 50, rewards: { gold: 120, junk: 42, exp: 90 } },
  { id: 'steady-hero', category: 'slayer', rank: 'silver', name: 'Steady Hero', description: 'Defeat 60 monsters total.', metric: 'kills', target: 60, rewards: { gold: 160, junk: 55, exp: 110 } },
  { id: 'kill-100', category: 'slayer', rank: 'gold', name: 'Century of Bonks', description: 'Defeat 100 enemies total.', metric: 'kills', target: 100, rewards: { gold: 260, junk: 85, exp: 210 } },
  { id: 'monster-study', category: 'slayer', rank: 'gold', name: 'Monster Study Hall', description: 'Defeat 140 monsters total across the expanded zones.', metric: 'kills', target: 140, rewards: { gold: 320, junk: 90, exp: 260 } },
  { id: 'kill-250', category: 'slayer', rank: 'platinum', name: 'A Problem For Monsters', description: 'Defeat 250 enemies total.', metric: 'kills', target: 250, rewards: { gold: 700, junk: 210, exp: 620 } },
  { id: 'kill-500', category: 'slayer', rank: 'epic', name: 'Local Legend', description: 'Defeat 500 enemies total.', metric: 'kills', target: 500, rewards: { gold: 1500, junk: 420, exp: 1350 } },
  { id: 'kill-1000', category: 'slayer', rank: 'legendary', name: 'The Thousand-Bonk Myth', description: 'Defeat 1000 enemies total.', metric: 'kills', target: 1000, rewards: { gold: 3400, junk: 900, exp: 3200 } },

  { id: 'stat-starter', category: 'explorer', rank: 'bronze', name: 'Find Your Weird Power', description: 'Reach level 3 and unlock your first crit/dodge/luck rhythm.', metric: 'level', target: 3, rewards: { gold: 40, junk: 12, exp: 25 } },
  { id: 'mall-scout', category: 'explorer', rank: 'silver', name: 'Scout the Mall Arcade', description: 'Reach level 4 to unlock the Abandoned Mall Arcade.', metric: 'level', target: 4, rewards: { gold: 80, junk: 20, exp: 45 } },
  { id: 'level-5', category: 'explorer', rank: 'silver', name: 'Five-Level Hero Permit', description: 'Reach level 5.', metric: 'level', target: 5, rewards: { gold: 115, junk: 30, exp: 70 } },
  { id: 'level-10', category: 'explorer', rank: 'gold', name: 'Double-Digit Adventurer', description: 'Reach level 10.', metric: 'level', target: 10, rewards: { gold: 320, junk: 95, exp: 260 } },
  { id: 'level-15', category: 'explorer', rank: 'platinum', name: 'Town Map Annotator', description: 'Reach level 15.', metric: 'level', target: 15, rewards: { gold: 580, junk: 165, exp: 520 } },
  { id: 'level-climber', category: 'explorer', rank: 'epic', name: 'Level Climber', description: 'Reach level 20 and become worryingly competent.', metric: 'level', target: 20, rewards: { gold: 650, junk: 180, exp: 500 } },
  { id: 'level-25', category: 'explorer', rank: 'epic', name: 'Dangerously Well-Rounded', description: 'Reach level 25.', metric: 'level', target: 25, rewards: { gold: 1250, junk: 320, exp: 1250 } },
  { id: 'level-30', category: 'explorer', rank: 'legendary', name: 'Menu Quest Veteran', description: 'Reach level 30.', metric: 'level', target: 30, rewards: { gold: 2400, junk: 650, exp: 2600 } },
  { id: 'level-35', category: 'explorer', rank: 'legendary', name: 'Late-Game Map Gremlin', description: 'Reach level 35.', metric: 'level', target: 35, rewards: { gold: 4200, junk: 1100, exp: 4800 } },
  { id: 'level-40', category: 'explorer', rank: 'legendary', name: 'Ten-Zone Trailblazer', description: 'Reach level 40.', metric: 'level', target: 40, rewards: { gold: 7200, junk: 1800, exp: 8200 } },

  { id: 'gear-check', category: 'gear', rank: 'bronze', name: 'Gear Check', description: 'Find 3 gear drops from monsters.', metric: 'dropsFound', target: 3, rewards: { gold: 35, junk: 25, exp: 20 } },
  { id: 'drops-10', category: 'gear', rank: 'silver', name: 'Loot Pockets', description: 'Find 10 gear drops from monsters.', metric: 'dropsFound', target: 10, rewards: { gold: 110, junk: 70, exp: 80 } },
  { id: 'drops-25', category: 'gear', rank: 'gold', name: 'Closet Full of Bad Ideas', description: 'Find 25 gear drops from monsters.', metric: 'dropsFound', target: 25, rewards: { gold: 360, junk: 180, exp: 260 } },
  { id: 'drops-50', category: 'gear', rank: 'platinum', name: 'Certified Loot Goblin', description: 'Find 50 gear drops from monsters.', metric: 'dropsFound', target: 50, rewards: { gold: 850, junk: 420, exp: 780 } },
  { id: 'trinket-first', category: 'gear', rank: 'bronze', name: 'First Pocket Magic', description: 'Find 1 accessory drop from monsters.', metric: 'accessoriesFound', target: 1, rewards: { gold: 55, junk: 20, exp: 35 } },
  { id: 'trinket-test', category: 'gear', rank: 'silver', name: 'Pocket Magic', description: 'Find 2 accessory drops from monsters.', metric: 'accessoriesFound', target: 2, rewards: { gold: 120, junk: 40, exp: 85 } },
  { id: 'trinkets-10', category: 'gear', rank: 'gold', name: 'Jingly Inventory', description: 'Find 10 accessory drops from monsters.', metric: 'accessoriesFound', target: 10, rewards: { gold: 440, junk: 160, exp: 360 } },
  { id: 'trinkets-25', category: 'gear', rank: 'epic', name: 'Tiny Treasure Dragon', description: 'Find 25 accessory drops from monsters.', metric: 'accessoriesFound', target: 25, rewards: { gold: 1400, junk: 460, exp: 1300 } },

  { id: 'train-attack-3', category: 'training', rank: 'bronze', name: 'Arm Day, Probably', description: 'Train attack 3 times.', metric: 'training.attack', target: 3, rewards: { gold: 90, junk: 35, exp: 70 } },
  { id: 'train-defense-3', category: 'training', rank: 'bronze', name: 'Shield Thoughts', description: 'Train defense 3 times.', metric: 'training.defense', target: 3, rewards: { gold: 90, junk: 35, exp: 70 } },
  { id: 'train-crits-3', category: 'training', rank: 'silver', name: 'Aim For The Dramatic Bit', description: 'Train crit 3 times.', metric: 'training.crit', target: 3, rewards: { gold: 160, junk: 60, exp: 120 } },
  { id: 'train-dodge-3', category: 'training', rank: 'silver', name: 'Nope Lessons', description: 'Train dodge 3 times.', metric: 'training.dodge', target: 3, rewards: { gold: 160, junk: 60, exp: 120 } },
  { id: 'train-luck-5', category: 'training', rank: 'gold', name: 'Definitely Skill, Not Luck', description: 'Train luck 5 times.', metric: 'training.luck', target: 5, rewards: { gold: 320, junk: 120, exp: 260 } },
  { id: 'train-any-20', category: 'training', rank: 'platinum', name: 'Yard Regular', description: 'Reach 20 total training ranks.', metric: 'trainingTotal', target: 20, rewards: { gold: 900, junk: 260, exp: 820 } },

  { id: 'boss-1', category: 'boss', rank: 'silver', name: 'First Boss Story', description: 'Defeat 1 zone boss.', metric: 'bossesDefeated', target: 1, rewards: { gold: 130, junk: 35, exp: 95 } },
  { id: 'boss-2', category: 'boss', rank: 'gold', name: 'Bosses Hate This One Trick', description: 'Defeat 2 zone bosses.', metric: 'bossesDefeated', target: 2, rewards: { gold: 360, junk: 100, exp: 290 } },
  { id: 'boss-3', category: 'boss', rank: 'platinum', name: 'Three Boss Receipts', description: 'Defeat 3 zone bosses.', metric: 'bossesDefeated', target: 3, rewards: { gold: 760, junk: 220, exp: 720 } },
  { id: 'boss-5', category: 'boss', rank: 'epic', name: 'World Half Saved', description: 'Defeat 5 zone bosses.', metric: 'bossesDefeated', target: 5, rewards: { gold: 2600, junk: 700, exp: 2800 } },
  { id: 'boss-7', category: 'boss', rank: 'legendary', name: 'Bosses Are A Renewable Resource', description: 'Defeat 7 zone bosses.', metric: 'bossesDefeated', target: 7, rewards: { gold: 5200, junk: 1400, exp: 5800 } },
  { id: 'boss-10', category: 'boss', rank: 'legendary', name: 'Ten Boss Victory Lap', description: 'Defeat all 10 current zone bosses.', metric: 'bossesDefeated', target: 10, rewards: { gold: 12000, junk: 3000, exp: 14000 } }
];

const SHOP_ITEMS = [
  { id: 'bigger-pack', name: 'Bigger Backpack', description: 'Carry +4 weapons and +4 armor pieces.', cost: { gold: 75, junk: 20 } },
  { id: 'field-snacks', name: 'Field Snacks', description: 'Increase max HP by 12.', cost: { gold: 55, junk: 8 } },
  { id: 'lucky-bauble', name: 'Lucky Bauble', description: 'Slightly improves gear drop chance forever.', cost: { gold: 120, junk: 35 } },
  { id: 'trinket-box', name: 'Trinket Box', description: 'Carry +4 accessories.', cost: { gold: 140, junk: 45 } },
  { id: 'training-manual', name: 'Questionable Training Manual', description: 'Permanent +2% crit and +2% dodge.', cost: { gold: 260, junk: 80 } }
];

const TIERS = {
  common: { name: 'Common', color: '#cbbd9b', attackBonus: 0, defenseBonus: 0, dropWeight: 66, salvage: 3, upgradeGold: 10, upgradeJunk: 4 },
  unusual: { name: 'Unusual', color: '#7ee081', attackBonus: 2, defenseBonus: 1, dropWeight: 24, salvage: 7, upgradeGold: 16, upgradeJunk: 7 },
  rare: { name: 'Rare', color: '#77b7ff', attackBonus: 5, defenseBonus: 3, dropWeight: 8, salvage: 14, upgradeGold: 26, upgradeJunk: 11 },
  epic: { name: 'Epic', color: '#d98bff', attackBonus: 9, defenseBonus: 6, dropWeight: 2, salvage: 28, upgradeGold: 42, upgradeJunk: 18 }
};

const ZONES = [
  {
    id: 'backyard',
    name: 'Backyard of Unfair Bugs',
    theme: 'Suburban grass, rude insects, and suspicious garden junk.',
    unlockLevel: 1,
    palette: { sky: '#25345f', ground: '#2f6f5f', path: '#214c43', enemy: '#ff6b7a', accent: '#7ee081' },
    dropChance: 0.18,
    bossKillsRequired: 10,
    boss: { name: 'Queen Picnic Ant', hp: 90, attack: 7, exp: 36, gold: 28, junk: 8, artKey: 'enemy-suspicious-ant', unlocks: 'Abandoned Mall Arcade' },
    weaponPool: ['cracked-bat', 'yo-yo', 'frying-pan', 'garden-rake', 'rubber-chicken', 'sprinkler-scepter', 'muddy-shovel'],
    armorPool: ['hoodie', 'cardboard-shield', 'bike-helmet', 'trash-can-lid', 'bug-shell-vest'],
    accessoryPool: ['friendship-bracelet', 'lucky-button', 'ant-antenna'],
    enemies: [
      { name: 'Suspicious Ant', hp: 14, attack: 2, exp: 4, gold: 2, junk: 1 },
      { name: 'Tiny Goblin Accountant', hp: 20, attack: 3, exp: 6, gold: 4, junk: 1 },
      { name: 'Angry Trash Bag', hp: 28, attack: 4, exp: 9, gold: 6, junk: 2 },
      { name: 'Overconfident Mosquito', hp: 18, attack: 4, exp: 7, gold: 4, junk: 1 },
      { name: 'Garden Gnome Intern', hp: 34, attack: 5, exp: 11, gold: 7, junk: 2 },
      { name: 'Possum With A Plan', hp: 44, attack: 6, exp: 15, gold: 9, junk: 3 }
    ]
  },
  {
    id: 'mall',
    name: 'Abandoned Mall Arcade',
    theme: 'Neon carpet, broken prize machines, and snacks with unfinished business.',
    unlockLevel: 4,
    palette: { sky: '#211a3d', ground: '#563071', path: '#3d2358', enemy: '#77b7ff', accent: '#ffcc5c' },
    dropChance: 0.22,
    bossKillsRequired: 14,
    boss: { name: 'Arcade Prize King', hp: 190, attack: 14, exp: 92, gold: 70, junk: 16, artKey: 'enemy-possessed-prize-claw', unlocks: 'Haunted Office Park' },
    weaponPool: ['plastic-sword', 'bottle-rocket', 'arcade-stool', 'soda-straw', 'laser-pointer', 'ticket-blaster', 'nacho-trident'],
    armorPool: ['varsity-jacket', 'mall-cop-vest', 'soda-tab-mail', 'prize-counter-cape', 'sticky-sneakers'],
    accessoryPool: ['token-ring', 'neon-keychain', 'coupon-crown'],
    enemies: [
      { name: 'Coin-Operated Gremlin', hp: 42, attack: 6, exp: 15, gold: 10, junk: 3 },
      { name: 'Possessed Prize Claw', hp: 54, attack: 7, exp: 19, gold: 13, junk: 3 },
      { name: 'Expired Soda Elemental', hp: 68, attack: 9, exp: 25, gold: 17, junk: 4 },
      { name: 'Carpet Pattern Mimic', hp: 78, attack: 10, exp: 30, gold: 20, junk: 5 },
      { name: 'Snack Court Revenant', hp: 88, attack: 11, exp: 36, gold: 24, junk: 6 },
      { name: 'Dance Pad Poltergeist', hp: 102, attack: 13, exp: 44, gold: 29, junk: 7 }
    ]
  },
  {
    id: 'office',
    name: 'Haunted Office Park',
    theme: 'Cubicles, cursed printers, and meetings that should have been emails.',
    unlockLevel: 8,
    palette: { sky: '#1b2632', ground: '#596273', path: '#343c49', enemy: '#d98bff', accent: '#b7dcff' },
    dropChance: 0.25,
    bossKillsRequired: 18,
    boss: { name: 'Executive Meeting Ooze', hp: 340, attack: 24, exp: 190, gold: 130, junk: 30, artKey: 'enemy-meeting-ooze', unlocks: 'Dusty Pantry Crypt' },
    weaponPool: ['stapler', 'keyboard', 'rolling-chair', 'coffee-mug', 'briefcase', 'whiteboard-halberd', 'ethernet-lasso'],
    armorPool: ['tie-of-denial', 'printer-toner-plate', 'conference-badge', 'cubicle-wall', 'ergonomic-kneepads'],
    accessoryPool: ['sticky-note-charm', 'badge-lanyard', 'coffee-bean-orbit'],
    enemies: [
      { name: 'Passive-Aggressive Printer', hp: 92, attack: 12, exp: 42, gold: 26, junk: 6 },
      { name: 'Spreadsheet Wraith', hp: 112, attack: 14, exp: 54, gold: 31, junk: 7 },
      { name: 'Meeting Ooze', hp: 138, attack: 16, exp: 68, gold: 38, junk: 8 },
      { name: 'Calendar Invite Swarm', hp: 154, attack: 18, exp: 82, gold: 45, junk: 9 },
      { name: 'Breakroom Gargoyle', hp: 172, attack: 20, exp: 98, gold: 54, junk: 11 },
      { name: 'Synergy Phantom', hp: 196, attack: 22, exp: 118, gold: 64, junk: 13 }
    ]
  },
  {
    id: 'pantry',
    name: 'Dusty Pantry Crypt',
    theme: 'Expired condiments, sacred crumbs, and jars that have become legally hostile.',
    unlockLevel: 12,
    palette: { sky: '#4a2f25', ground: '#8a6942', path: '#5f3c2e', enemy: '#d88952', accent: '#f0cf75' },
    dropChance: 0.28,
    bossKillsRequired: 22,
    boss: { name: 'Ancient Condiment Lich', hp: 560, attack: 36, exp: 340, gold: 220, junk: 48, artKey: 'enemy-forklifted-pickle-jar', unlocks: 'Royal Sewer Scriptorium' },
    weaponPool: ['frying-pan', 'coffee-mug', 'rubber-chicken', 'soda-straw', 'bottle-rocket', 'pickle-spear', 'toaster-mace'],
    armorPool: ['hoodie', 'soda-tab-mail', 'tie-of-denial', 'apron-of-omens', 'tupperware-plate'],
    accessoryPool: ['crumb-medallion', 'mustard-signet', 'spoon-of-focus'],
    enemies: [
      { name: 'Bread Mold Homunculus', hp: 178, attack: 20, exp: 92, gold: 52, junk: 10 },
      { name: 'Forklifted Pickle Jar', hp: 214, attack: 22, exp: 112, gold: 62, junk: 12 },
      { name: 'Self-Crumbing Biscuit', hp: 246, attack: 25, exp: 136, gold: 74, junk: 14 },
      { name: 'Condiment Slime Duo', hp: 286, attack: 29, exp: 162, gold: 88, junk: 17 },
      { name: 'Cereal Box Prophet', hp: 318, attack: 32, exp: 194, gold: 104, junk: 20 },
      { name: 'Freezer-Burn Knight', hp: 360, attack: 35, exp: 232, gold: 124, junk: 24 }
    ]
  },
  {
    id: 'sewers',
    name: 'Royal Sewer Scriptorium',
    theme: 'A damp royal archive where rats sign decrees and leeches demand back taxes.',
    unlockLevel: 16,
    palette: { sky: '#18332f', ground: '#315c52', path: '#223f3d', enemy: '#9fd0a0', accent: '#c6e6d0' },
    dropChance: 0.31,
    bossKillsRequired: 26,
    boss: { name: 'Royal Rat Chancellor', hp: 820, attack: 50, exp: 560, gold: 360, junk: 76, artKey: 'enemy-crowned-sewer-rat', unlocks: 'Moonlit Rooftop Bazaar' },
    weaponPool: ['briefcase', 'stapler', 'keyboard', 'garden-rake', 'plastic-sword', 'quill-rapier', 'plunger-scepter'],
    armorPool: ['printer-toner-plate', 'conference-badge', 'mall-cop-vest', 'royal-waders', 'decree-mail'],
    accessoryPool: ['wax-seal-ring', 'rat-crown-pin', 'ledger-orb'],
    enemies: [
      { name: 'Crowned Sewer Rat', hp: 310, attack: 30, exp: 184, gold: 92, junk: 16 },
      { name: 'Royal Flush Wraith', hp: 360, attack: 34, exp: 224, gold: 108, junk: 18 },
      { name: 'Tax-Collecting Leech', hp: 420, attack: 38, exp: 270, gold: 132, junk: 22 },
      { name: 'Archivist Sludge', hp: 480, attack: 42, exp: 320, gold: 156, junk: 26 },
      { name: 'Decree-Writing Ratkin', hp: 540, attack: 47, exp: 380, gold: 184, junk: 30 },
      { name: 'Royal Drain Hydra', hp: 640, attack: 54, exp: 470, gold: 230, junk: 38 }
    ]
  },
  {
    id: 'rooftops',
    name: 'Moonlit Rooftop Bazaar',
    theme: 'Windy awnings, black-market potions, and pigeons with suspicious trade permits.',
    unlockLevel: 20,
    palette: { sky: '#18213f', ground: '#4f4668', path: '#2b2948', enemy: '#ffd166', accent: '#8ee7ff' },
    dropChance: 0.34,
    bossKillsRequired: 30,
    boss: { name: 'Chimney Drake Merchant', hp: 1180, attack: 68, exp: 860, gold: 560, junk: 115, artKey: 'enemy-chimney-drake', unlocks: 'Crystal Laundromat' },
    weaponPool: ['umbrella-lance', 'chimney-broom', 'weather-vane', 'quill-rapier', 'plunger-scepter'],
    armorPool: ['moon-market-cloak', 'gutter-guard', 'windbreaker-ward', 'royal-waders'],
    accessoryPool: ['pigeon-contract', 'moon-token', 'chimney-ember'],
    enemies: [
      { name: 'Permit Pigeon', hp: 700, attack: 58, exp: 560, gold: 270, junk: 44 },
      { name: 'Awnings Goblin', hp: 780, attack: 62, exp: 640, gold: 310, junk: 50 },
      { name: 'Contraband Potion Imp', hp: 880, attack: 67, exp: 740, gold: 360, junk: 58 },
      { name: 'Rooftop Gargoyle Vendor', hp: 980, attack: 72, exp: 850, gold: 420, junk: 66 },
      { name: 'Kite String Assassin', hp: 1080, attack: 78, exp: 980, gold: 480, junk: 74 }
    ]
  },
  {
    id: 'laundromat',
    name: 'Crystal Laundromat',
    theme: 'Arcane spin cycles, glitter lint, and dryers that know your secrets.',
    unlockLevel: 24,
    palette: { sky: '#16384a', ground: '#2f7f8f', path: '#26576b', enemy: '#a8f0ff', accent: '#f7c8ff' },
    dropChance: 0.37,
    bossKillsRequired: 34,
    boss: { name: 'The Spin Cycle Oracle', hp: 2150, attack: 100, exp: 1450, gold: 900, junk: 180, artKey: 'enemy-spin-cycle-oracle', unlocks: 'Volcano Food Truck Rally' },
    weaponPool: ['detergent-flail', 'dryer-sheet-katana', 'crystal-hanger', 'umbrella-lance', 'weather-vane'],
    armorPool: ['lint-mail', 'bubblewrap-tunic', 'static-proof-robe', 'moon-market-cloak'],
    accessoryPool: ['lost-sock-sigil', 'soap-bubble-orb', 'quarter-of-fate'],
    enemies: [
      { name: 'Glitter Lint Elemental', hp: 1160, attack: 82, exp: 1080, gold: 520, junk: 82 },
      { name: 'Haunted Washing Machine', hp: 1300, attack: 88, exp: 1220, gold: 590, junk: 92 },
      { name: 'Static Cling Sprite', hp: 1440, attack: 94, exp: 1380, gold: 670, junk: 104 },
      { name: 'Missing Sock Doppelganger', hp: 1600, attack: 101, exp: 1560, gold: 760, junk: 118 },
      { name: 'Dryer Door Mimic', hp: 1780, attack: 108, exp: 1780, gold: 860, junk: 134 }
    ]
  },
  {
    id: 'volcano',
    name: 'Volcano Food Truck Rally',
    theme: 'Lava lanes, heroic snacks, and chefs who believe seasoning is combat.',
    unlockLevel: 28,
    palette: { sky: '#3d1720', ground: '#8f3b2f', path: '#5c241f', enemy: '#ff8a65', accent: '#ffd166' },
    dropChance: 0.4,
    bossKillsRequired: 38,
    boss: { name: 'Molten Taco Colossus', hp: 3450, attack: 135, exp: 2200, gold: 1350, junk: 265, artKey: 'enemy-molten-taco', unlocks: 'Sky Library of Lost Menus' },
    weaponPool: ['spatula-greatsword', 'pepper-flamethrower', 'lava-ladle', 'detergent-flail', 'crystal-hanger'],
    armorPool: ['oven-mitt-gauntlets', 'apron-of-embers', 'food-truck-fender', 'static-proof-robe'],
    accessoryPool: ['hot-sauce-halo', 'charred-receipt', 'nacho-star'],
    enemies: [
      { name: 'Salsa Slime Inferno', hp: 1880, attack: 112, exp: 1700, gold: 920, junk: 145 },
      { name: 'Food Truck Fire Imp', hp: 2100, attack: 120, exp: 1940, gold: 1040, junk: 164 },
      { name: 'Charcoal Menu Golem', hp: 2350, attack: 128, exp: 2220, gold: 1180, junk: 186 },
      { name: 'Nacho Wyvern', hp: 2620, attack: 137, exp: 2540, gold: 1340, junk: 210 },
      { name: 'Deep-Fried Phoenix Nugget', hp: 2920, attack: 147, exp: 2920, gold: 1520, junk: 238 }
    ]
  },
  {
    id: 'sky-library',
    name: 'Sky Library of Lost Menus',
    theme: 'Floating shelves, strict cloud librarians, and recipes with footnotes.',
    unlockLevel: 32,
    palette: { sky: '#203b68', ground: '#6d8fc7', path: '#435f99', enemy: '#f7e8a4', accent: '#c7f0ff' },
    dropChance: 0.43,
    bossKillsRequired: 42,
    boss: { name: 'Cloud Librarian Seraph', hp: 6200, attack: 185, exp: 4200, gold: 2450, junk: 470, artKey: 'enemy-cloud-librarian', unlocks: 'Clockwork Dragon Nursery' },
    weaponPool: ['bookmark-saber', 'index-card-cannon', 'dictionary-maul', 'spatula-greatsword', 'pepper-flamethrower'],
    armorPool: ['cloud-cardigan', 'citation-shield', 'quiet-slippers', 'apron-of-embers'],
    accessoryPool: ['overdue-stamp', 'paperclip-constellation', 'library-card-prism'],
    enemies: [
      { name: 'Overdue Book Harpy', hp: 3100, attack: 150, exp: 2780, gold: 1620, junk: 250 },
      { name: 'Footnote Familiar', hp: 3450, attack: 160, exp: 3180, gold: 1840, junk: 284 },
      { name: 'Cloud Shelf Golem', hp: 3860, attack: 171, exp: 3640, gold: 2100, junk: 324 },
      { name: 'Recipe With Teeth', hp: 4320, attack: 183, exp: 4180, gold: 2400, junk: 370 },
      { name: 'Shushing Thunderhead', hp: 4820, attack: 196, exp: 4800, gold: 2760, junk: 425 }
    ]
  },
  {
    id: 'dragon-nursery',
    name: 'Clockwork Dragon Nursery',
    theme: 'Tiny brass dragons, enormous liability forms, and lullabies with gears.',
    unlockLevel: 36,
    palette: { sky: '#2d2538', ground: '#8a6b3f', path: '#4f3f2c', enemy: '#ffcf68', accent: '#9fd0ff' },
    dropChance: 0.46,
    bossKillsRequired: 48,
    boss: { name: 'Nanny Gearwyrm Prime', hp: 10400, attack: 225, exp: 7600, gold: 5200, junk: 960, artKey: 'enemy-gearwyrm-prime', unlocks: 'bragging rights' },
    weaponPool: ['gear-rattle', 'clock-hand-scythe', 'winding-key-axe', 'bookmark-saber', 'dictionary-maul'],
    armorPool: ['brass-bib', 'nursery-gate-plate', 'music-box-mail', 'citation-shield'],
    accessoryPool: ['tiny-dragon-tooth', 'pacifier-gear', 'nap-time-hourglass'],
    enemies: [
      { name: 'Brass Hatchling', hp: 5050, attack: 178, exp: 5200, gold: 3100, junk: 480 },
      { name: 'Wind-Up Wyvern Toddler', hp: 5650, attack: 188, exp: 5980, gold: 3560, junk: 552 },
      { name: 'Lullaby Automaton', hp: 6320, attack: 198, exp: 6880, gold: 4100, junk: 635 },
      { name: 'Nursery Gate Mimic', hp: 7080, attack: 210, exp: 7920, gold: 4720, junk: 730 },
      { name: 'Teething Gear Dragon', hp: 7920, attack: 222, exp: 9120, gold: 5420, junk: 840 }
    ]
  }
];

const WEAPON_BLUEPRINTS = {
  'cracked-bat': { name: 'Cracked Tee-Ball Bat', attack: 4, art: 'bat', note: 'Reliable, if embarrassing.' },
  'yo-yo': { name: 'Yo-Yo of Mild Regret', attack: 3, art: 'yo-yo', note: 'Sometimes returns. Emotionally, mostly.' },
  'frying-pan': { name: 'Bent Frying Pan', attack: 5, art: 'pan', note: 'Breakfast adjacent.' },
  'garden-rake': { name: 'Backyard Rake of Consequences', attack: 6, art: 'rake', note: 'Step carefully.' },
  'rubber-chicken': { name: 'Squeaky Rubber Chicken', attack: 4, art: 'chicken', note: 'Morale damage counts.' },
  'plastic-sword': { name: 'Plastic Sword From The Mall', attack: 8, art: 'sword', note: 'Technically heroic.' },
  'bottle-rocket': { name: 'Lucky Bottle Rocket', attack: 10, art: 'rocket', note: 'OSHA is looking away.' },
  'arcade-stool': { name: 'Wobbly Arcade Stool', attack: 9, art: 'stool', note: 'Great against shins.' },
  'soda-straw': { name: 'Curly Soda Straw', attack: 7, art: 'straw', note: 'Absurd reach.' },
  'laser-pointer': { name: 'Laser Pointer of Distraction', attack: 8, art: 'laser', note: 'Critical against cats and managers.' },
  'stapler': { name: 'Red Stapler of Quiet Rage', attack: 13, art: 'stapler', note: 'Do not borrow.' },
  'keyboard': { name: 'Clicky Keyboard Flail', attack: 14, art: 'keyboard', note: 'Deals bonus noise.' },
  'rolling-chair': { name: 'Rolling Chair Lance', attack: 15, art: 'chair', note: 'A majestic office joust.' },
  'coffee-mug': { name: 'World’s Okayest Mug', attack: 12, art: 'mug', note: 'Warm, bitter, dangerous.' },
  'briefcase': { name: 'Suspiciously Heavy Briefcase', attack: 16, art: 'case', note: 'Full of quarterly reports.' },
  'sprinkler-scepter': { name: 'Sprinkler Scepter', attack: 7, art: 'scepter', note: 'Rotates menacingly.' },
  'muddy-shovel': { name: 'Muddy Shovel', attack: 7, art: 'shovel', note: 'Digs problems into new places.' },
  'ticket-blaster': { name: 'Ticket Blaster', attack: 11, art: 'tickets', note: 'Redeemable for panic.' },
  'nacho-trident': { name: 'Nacho Trident', attack: 12, art: 'trident', note: 'Cheese-based reach weapon.' },
  'whiteboard-halberd': { name: 'Whiteboard Halberd', attack: 17, art: 'halberd', note: 'Permanent marker, permanent consequences.' },
  'ethernet-lasso': { name: 'Ethernet Lasso', attack: 18, art: 'cable', note: 'Catches lag and ankles.' },
  'pickle-spear': { name: 'Pickle Spear', attack: 20, art: 'pickle', note: 'Briny and uncalled for.' },
  'toaster-mace': { name: 'Toaster Mace', attack: 22, art: 'toaster', note: 'Do not use near royal sewers.' },
  'quill-rapier': { name: 'Quill Rapier', attack: 26, art: 'quill', note: 'Sharper than policy.' },
  'plunger-scepter': { name: 'Plunger Scepter', attack: 28, art: 'plunger', note: 'A symbol of questionable rule.' },
  'umbrella-lance': { name: 'Umbrella Lance', attack: 32, art: 'umbrella', note: 'Excellent coverage.' },
  'chimney-broom': { name: 'Chimney Broom Pike', attack: 34, art: 'broom', note: 'Soot-powered reach.' },
  'weather-vane': { name: 'Weather Vane Spear', attack: 36, art: 'vane', note: 'Always points toward trouble.' },
  'detergent-flail': { name: 'Detergent Flail', attack: 42, art: 'flail', note: 'Removes stains and enemies.' },
  'dryer-sheet-katana': { name: 'Dryer Sheet Katana', attack: 44, art: 'katana', note: 'Softens critical hits.' },
  'crystal-hanger': { name: 'Crystal Hanger Hook', attack: 46, art: 'hanger', note: 'Dry clean only.' },
  'spatula-greatsword': { name: 'Spatula Greatsword', attack: 54, art: 'spatula', note: 'Flips the whole fight.' },
  'pepper-flamethrower': { name: 'Pepper Flamethrower', attack: 57, art: 'pepper', note: 'Season to defeat.' },
  'lava-ladle': { name: 'Lava Ladle', attack: 60, art: 'ladle', note: 'Soup-adjacent catastrophe.' },
  'bookmark-saber': { name: 'Bookmark Saber', attack: 70, art: 'bookmark', note: 'Saves your place in combat.' },
  'index-card-cannon': { name: 'Index Card Cannon', attack: 74, art: 'cannon', note: 'Alphabetized artillery.' },
  'dictionary-maul': { name: 'Dictionary Maul', attack: 78, art: 'book', note: 'Heavy definition of pain.' },
  'gear-rattle': { name: 'Gear Rattle', attack: 90, art: 'rattle', note: 'Baby toy, boss problem.' },
  'clock-hand-scythe': { name: 'Clock-Hand Scythe', attack: 95, art: 'scythe', note: 'Time to bonk.' },
  'winding-key-axe': { name: 'Winding Key Axe', attack: 100, art: 'axe', note: 'Turns the battle around.' }
};

const ARMOR_BLUEPRINTS = {
  'hoodie': { name: 'Laundry-Day Hoodie', defense: 1, art: 'hoodie', note: 'Soft, questionable, heroic.' },
  'cardboard-shield': { name: 'Cardboard Chest Guard', defense: 2, art: 'box', note: 'Mostly emotionally supportive.' },
  'bike-helmet': { name: 'Tiny Bike Helmet', defense: 2, art: 'helmet', note: 'Safety first, dignity later.' },
  'varsity-jacket': { name: 'Arcade Varsity Jacket', defense: 4, art: 'jacket', note: 'Smells like neon carpet.' },
  'mall-cop-vest': { name: 'Mall Cop Vest', defense: 5, art: 'vest', note: 'Authority sold separately.' },
  'soda-tab-mail': { name: 'Soda-Tab Chainmail', defense: 5, art: 'mail', note: 'Fizzy protection.' },
  'tie-of-denial': { name: 'Tie of Professional Denial', defense: 7, art: 'tie', note: 'Reduces awkward damage.' },
  'printer-toner-plate': { name: 'Printer Toner Plate', defense: 8, art: 'plate', note: 'Leaves marks on everything.' },
  'conference-badge': { name: 'Oversized Conference Badge', defense: 9, art: 'badge', note: 'Gets you into rooms and out of danger.' },
  'trash-can-lid': { name: 'Trash Can Lid Buckler', defense: 3, art: 'lid', note: 'Round, loud, heroic.' },
  'bug-shell-vest': { name: 'Bug Shell Vest', defense: 3, art: 'shell', note: 'Nature made it weird first.' },
  'prize-counter-cape': { name: 'Prize Counter Cape', defense: 6, art: 'cape', note: 'Costs 900 tickets emotionally.' },
  'sticky-sneakers': { name: 'Sticky Arcade Sneakers', defense: 6, art: 'shoes', note: 'You are not faster. You are attached.' },
  'cubicle-wall': { name: 'Cubicle Wall Shield', defense: 10, art: 'wall', note: 'Blocks both arrows and conversation.' },
  'ergonomic-kneepads': { name: 'Ergonomic Kneepads', defense: 10, art: 'knees', note: 'HR-approved adventuring.' },
  'apron-of-omens': { name: 'Apron of Omens', defense: 12, art: 'apron', note: 'Stained with prophecy.' },
  'tupperware-plate': { name: 'Tupperware Plate Armor', defense: 13, art: 'tupperware', note: 'Lid sold separately.' },
  'royal-waders': { name: 'Royal Sewer Waders', defense: 16, art: 'waders', note: 'Dignity waterproofed.' },
  'decree-mail': { name: 'Decree-Mail Hauberk', defense: 18, art: 'mail', note: 'Every link is notarized.' },
  'moon-market-cloak': { name: 'Moon-Market Cloak', defense: 21, art: 'cloak', note: 'Suspiciously discounted.' },
  'gutter-guard': { name: 'Gutter Guard Pauldrons', defense: 22, art: 'gutter', note: 'Keeps rain and regret off.' },
  'windbreaker-ward': { name: 'Windbreaker Ward', defense: 24, art: 'jacket', note: 'Magic, but zippered.' },
  'lint-mail': { name: 'Lint Mail', defense: 28, art: 'lint', note: 'Soft wall technology.' },
  'bubblewrap-tunic': { name: 'Bubblewrap Tunic', defense: 30, art: 'bubblewrap', note: 'Every hit is satisfying.' },
  'static-proof-robe': { name: 'Static-Proof Robe', defense: 32, art: 'robe', note: 'Grounded emotionally.' },
  'oven-mitt-gauntlets': { name: 'Oven Mitt Gauntlets', defense: 38, art: 'mitts', note: 'Handles spicy danger.' },
  'apron-of-embers': { name: 'Apron of Embers', defense: 40, art: 'apron', note: 'Chef-tier resilience.' },
  'food-truck-fender': { name: 'Food Truck Fender Plate', defense: 43, art: 'fender', note: 'Street legal armor.' },
  'cloud-cardigan': { name: 'Cloud Cardigan', defense: 50, art: 'cardigan', note: 'Cozy at altitude.' },
  'citation-shield': { name: 'Citation Shield', defense: 53, art: 'shield', note: 'Source your blocks.' },
  'quiet-slippers': { name: 'Quiet Slippers', defense: 56, art: 'slippers', note: 'Sneaky and scholarly.' },
  'brass-bib': { name: 'Brass Bib', defense: 66, art: 'bib', note: 'Spill-proof against dragons.' },
  'nursery-gate-plate': { name: 'Nursery Gate Plate', defense: 70, art: 'gate', note: 'Childproof, hero-proof.' },
  'music-box-mail': { name: 'Music Box Mail', defense: 75, art: 'musicbox', note: 'Tinkles under pressure.' }
};


const ACCESSORY_BLUEPRINTS = {
  'friendship-bracelet': { name: 'Friendship Bracelet of Bonking', crit: 0.02, dodge: 0.01, luck: 1, art: 'bracelet', note: 'Friendship is a stat now.' },
  'lucky-button': { name: 'Lucky Button', crit: 0.01, dodge: 0.01, luck: 3, art: 'button', note: 'Probably fell off a boss.' },
  'ant-antenna': { name: 'Ant Antenna Headband', crit: 0.02, dodge: 0.03, luck: 0, art: 'antenna', note: 'Receives picnic violence.' },
  'token-ring': { name: 'Arcade Token Ring', crit: 0.03, dodge: 0.01, luck: 2, art: 'ring', note: 'No refunds.' },
  'neon-keychain': { name: 'Neon Keychain', crit: 0.02, dodge: 0.04, luck: 1, art: 'keychain', note: 'Glows in bad decisions.' },
  'coupon-crown': { name: 'Coupon Crown', crit: 0.01, dodge: 0.02, luck: 5, art: 'crown', note: 'Expires never, somehow.' },
  'sticky-note-charm': { name: 'Sticky Note Charm', crit: 0.04, dodge: 0.01, luck: 2, art: 'note', note: 'Reminder: win.' },
  'badge-lanyard': { name: 'Badge Lanyard of Access', crit: 0.02, dodge: 0.03, luck: 3, art: 'lanyard', note: 'Opens doors and loot tables.' },
  'coffee-bean-orbit': { name: 'Orbiting Coffee Bean', crit: 0.05, dodge: 0.00, luck: 2, art: 'bean', note: 'Hyper-caffeinated satellite.' },
  'crumb-medallion': { name: 'Sacred Crumb Medallion', crit: 0.03, dodge: 0.03, luck: 4, art: 'crumb', note: 'Tiny but chosen.' },
  'mustard-signet': { name: 'Mustard Signet', crit: 0.04, dodge: 0.02, luck: 3, art: 'signet', note: 'Leaves authority stains.' },
  'spoon-of-focus': { name: 'Tiny Spoon of Focus', crit: 0.06, dodge: 0.01, luck: 1, art: 'spoon', note: 'Concentrates soup and intent.' },
  'wax-seal-ring': { name: 'Wax Seal Ring', crit: 0.05, dodge: 0.02, luck: 4, art: 'seal', note: 'Officially shiny.' },
  'rat-crown-pin': { name: 'Rat Crown Pin', crit: 0.03, dodge: 0.05, luck: 3, art: 'pin', note: 'Tiny monarchy energy.' },
  'ledger-orb': { name: 'Ledger Orb', crit: 0.04, dodge: 0.03, luck: 6, art: 'orb', note: 'Balances violence.' },
  'pigeon-contract': { name: 'Pigeon Contract', crit: 0.05, dodge: 0.04, luck: 7, art: 'contract', note: 'Legally cooing.' },
  'moon-token': { name: 'Moon Token', crit: 0.04, dodge: 0.05, luck: 8, art: 'token', note: 'Spend only at midnight.' },
  'chimney-ember': { name: 'Chimney Ember', crit: 0.06, dodge: 0.03, luck: 7, art: 'ember', note: 'Warm pocket danger.' },
  'lost-sock-sigil': { name: 'Lost Sock Sigil', crit: 0.05, dodge: 0.06, luck: 9, art: 'sock', note: 'Pairs with destiny.' },
  'soap-bubble-orb': { name: 'Soap Bubble Orb', crit: 0.04, dodge: 0.08, luck: 8, art: 'bubble', note: 'Fragile-looking confidence.' },
  'quarter-of-fate': { name: 'Quarter of Fate', crit: 0.07, dodge: 0.04, luck: 10, art: 'quarter', note: 'Heads, you win.' },
  'hot-sauce-halo': { name: 'Hot Sauce Halo', crit: 0.08, dodge: 0.03, luck: 10, art: 'halo', note: 'Spicy aura unlocked.' },
  'charred-receipt': { name: 'Charred Receipt', crit: 0.06, dodge: 0.06, luck: 11, art: 'receipt', note: 'Proof of purchase and pain.' },
  'nacho-star': { name: 'Nacho Star', crit: 0.07, dodge: 0.05, luck: 12, art: 'star', note: 'Five points of cheese.' },
  'overdue-stamp': { name: 'Overdue Stamp', crit: 0.08, dodge: 0.06, luck: 12, art: 'stamp', note: 'Late fees hit hard.' },
  'paperclip-constellation': { name: 'Paperclip Constellation', crit: 0.06, dodge: 0.08, luck: 13, art: 'clips', note: 'Office supplies in orbit.' },
  'library-card-prism': { name: 'Library Card Prism', crit: 0.09, dodge: 0.05, luck: 14, art: 'prism', note: 'Checks out victory.' },
  'tiny-dragon-tooth': { name: 'Tiny Dragon Tooth', crit: 0.10, dodge: 0.06, luck: 15, art: 'tooth', note: 'Small bite, big stats.' },
  'pacifier-gear': { name: 'Pacifier Gear', crit: 0.08, dodge: 0.09, luck: 16, art: 'gear', note: 'Soothes the loot table.' },
  'nap-time-hourglass': { name: 'Nap-Time Hourglass', crit: 0.09, dodge: 0.08, luck: 18, art: 'hourglass', note: 'Counts down to boss bedtime.' }
};

const STARTER_WEAPONS = [
  createWeapon('cracked-bat', 'common', 'starter-cracked-bat'),
  createWeapon('yo-yo', 'common', 'starter-yo-yo'),
  createWeapon('frying-pan', 'unusual', 'starter-frying-pan')
];

const STARTER_ARMORS = [
  createArmor('hoodie', 'common', 'starter-hoodie'),
  createArmor('cardboard-shield', 'common', 'starter-cardboard-shield')
];

const STARTER_ACCESSORIES = [
  createAccessory('friendship-bracelet', 'common', 'starter-friendship-bracelet')
];

const state = loadGame();
let scene;

function createWeapon(blueprintId, tier = 'common', id = uniqueId(blueprintId)) {
  const blueprint = WEAPON_BLUEPRINTS[blueprintId] || WEAPON_BLUEPRINTS['cracked-bat'];
  const tierData = TIERS[tier] || TIERS.common;
  return {
    id,
    blueprintId,
    type: 'weapon',
    tier,
    name: blueprint.name,
    attack: blueprint.attack + tierData.attackBonus,
    level: 1,
    art: blueprint.art,
    note: blueprint.note
  };
}

function createArmor(blueprintId, tier = 'common', id = uniqueId(blueprintId)) {
  const blueprint = ARMOR_BLUEPRINTS[blueprintId] || ARMOR_BLUEPRINTS.hoodie;
  const tierData = TIERS[tier] || TIERS.common;
  return {
    id,
    blueprintId,
    type: 'armor',
    tier,
    name: blueprint.name,
    defense: blueprint.defense + tierData.defenseBonus,
    level: 1,
    art: blueprint.art,
    note: blueprint.note
  };
}


function createAccessory(blueprintId, tier = 'common', id = uniqueId(blueprintId)) {
  const blueprint = ACCESSORY_BLUEPRINTS[blueprintId] || ACCESSORY_BLUEPRINTS['friendship-bracelet'];
  const tierRank = Math.max(0, TIER_ORDER.indexOf(tier));
  const scalar = 1 + tierRank * 0.45;
  return {
    id,
    blueprintId,
    type: 'accessory',
    tier,
    name: blueprint.name,
    crit: Math.round((blueprint.crit || 0) * scalar * 1000) / 1000,
    dodge: Math.round((blueprint.dodge || 0) * scalar * 1000) / 1000,
    luck: Math.max(0, Math.round((blueprint.luck || 0) * scalar)),
    level: 1,
    art: blueprint.art,
    note: blueprint.note
  };
}

function uniqueId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function freshSave() {
  return {
    version: SAVE_VERSION,
    level: 1,
    exp: 0,
    hp: 42,
    maxHp: 42,
    baseAttack: 2,
    baseDefense: 0,
    gold: 0,
    junk: 0,
    kills: 0,
    zoneKills: {},
    defeatedBosses: [],
    dropsFound: 0,
    accessoriesFound: 0,
    maxWeapons: MAX_WEAPONS,
    maxArmors: MAX_ARMORS,
    maxAccessories: MAX_ACCESSORIES,
    completedQuests: [],
    claimedQuests: [],
    purchasedShopItems: [],
    training: { attack: 0, defense: 0, crit: 0, dodge: 0, luck: 0 },
    battleRunning: false,
    selectedZone: 'backyard',
    currentEnemy: null,
    enemyHp: 0,
    weapons: structuredClone(STARTER_WEAPONS),
    armors: structuredClone(STARTER_ARMORS),
    accessories: structuredClone(STARTER_ACCESSORIES),
    equippedWeaponId: 'starter-cracked-bat',
    equippedArmorId: 'starter-hoodie',
    equippedAccessoryId: 'starter-friendship-bracelet',
    autoSalvageBelow: 'none',
    lastRestedAt: 0,
    log: ['Welcome to Menu Quest. Pick Battle when you are ready to bonk.'],
    lastSavedAt: Date.now()
  };
}

function normalizeWeapon(weapon, index) {
  const blueprintId = weapon.blueprintId || (WEAPON_BLUEPRINTS[weapon.id] ? weapon.id : 'cracked-bat');
  const blueprint = WEAPON_BLUEPRINTS[blueprintId] || { name: weapon.name || 'Mystery Bonker', attack: weapon.attack || 3, art: 'bat', note: weapon.note || 'Probably safe.' };
  const tier = weapon.tier && TIERS[weapon.tier] ? weapon.tier : 'common';
  return {
    id: weapon.id && !WEAPON_BLUEPRINTS[weapon.id] ? weapon.id : `${blueprintId}-legacy-${index}`,
    blueprintId,
    type: 'weapon',
    tier,
    name: weapon.name || blueprint.name,
    attack: Number.isFinite(weapon.attack) ? weapon.attack : blueprint.attack + TIERS[tier].attackBonus,
    level: Number.isFinite(weapon.level) ? weapon.level : 1,
    art: weapon.art || blueprint.art || 'bat',
    note: weapon.note || blueprint.note
  };
}

function normalizeArmor(armor, index) {
  const blueprintId = armor.blueprintId || (ARMOR_BLUEPRINTS[armor.id] ? armor.id : 'hoodie');
  const blueprint = ARMOR_BLUEPRINTS[blueprintId] || { name: armor.name || 'Mystery Padding', defense: armor.defense || 1, art: 'hoodie', note: armor.note || 'Probably protective.' };
  const tier = armor.tier && TIERS[armor.tier] ? armor.tier : 'common';
  return {
    id: armor.id && !ARMOR_BLUEPRINTS[armor.id] ? armor.id : `${blueprintId}-legacy-${index}`,
    blueprintId,
    type: 'armor',
    tier,
    name: armor.name || blueprint.name,
    defense: Number.isFinite(armor.defense) ? armor.defense : blueprint.defense + TIERS[tier].defenseBonus,
    level: Number.isFinite(armor.level) ? armor.level : 1,
    art: armor.art || blueprint.art || 'hoodie',
    note: armor.note || blueprint.note
  };
}


function normalizeAccessory(accessory, index) {
  const blueprintId = accessory.blueprintId || (ACCESSORY_BLUEPRINTS[accessory.id] ? accessory.id : 'friendship-bracelet');
  const blueprint = ACCESSORY_BLUEPRINTS[blueprintId] || ACCESSORY_BLUEPRINTS['friendship-bracelet'];
  const tier = accessory.tier && TIERS[accessory.tier] ? accessory.tier : 'common';
  const fresh = createAccessory(blueprintId, tier, accessory.id && !ACCESSORY_BLUEPRINTS[accessory.id] ? accessory.id : `${blueprintId}-legacy-${index}`);
  return {
    ...fresh,
    name: accessory.name || blueprint.name,
    crit: Number.isFinite(accessory.crit) ? accessory.crit : fresh.crit,
    dodge: Number.isFinite(accessory.dodge) ? accessory.dodge : fresh.dodge,
    luck: Number.isFinite(accessory.luck) ? accessory.luck : fresh.luck,
    level: Number.isFinite(accessory.level) ? accessory.level : 1,
    art: accessory.art || blueprint.art,
    note: accessory.note || blueprint.note
  };
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return freshSave();

  try {
    const loaded = JSON.parse(raw);
    const merged = { ...freshSave(), ...loaded, version: SAVE_VERSION };
    const loadedMaxWeapons = Number.isFinite(loaded.maxWeapons) ? loaded.maxWeapons : MAX_WEAPONS;
    const loadedMaxArmors = Number.isFinite(loaded.maxArmors) ? loaded.maxArmors : MAX_ARMORS;
    const loadedMaxAccessories = Number.isFinite(loaded.maxAccessories) ? loaded.maxAccessories : MAX_ACCESSORIES;
    merged.weapons = Array.isArray(loaded.weapons) && loaded.weapons.length
      ? loaded.weapons.map(normalizeWeapon).slice(0, loadedMaxWeapons)
      : structuredClone(STARTER_WEAPONS);
    merged.armors = Array.isArray(loaded.armors) && loaded.armors.length
      ? loaded.armors.map(normalizeArmor).slice(0, loadedMaxArmors)
      : structuredClone(STARTER_ARMORS);
    merged.accessories = Array.isArray(loaded.accessories) && loaded.accessories.length
      ? loaded.accessories.map(normalizeAccessory).slice(0, loadedMaxAccessories)
      : structuredClone(STARTER_ACCESSORIES);
    if (!merged.weapons.some(w => w.id === merged.equippedWeaponId)) merged.equippedWeaponId = merged.weapons[0].id;
    if (!merged.armors.some(a => a.id === merged.equippedArmorId)) merged.equippedArmorId = merged.armors[0].id;
    if (!merged.accessories.some(a => a.id === merged.equippedAccessoryId)) merged.equippedAccessoryId = merged.accessories[0].id;
    merged.log = Array.isArray(loaded.log) ? loaded.log.slice(0, 12) : [];
    merged.completedQuests = Array.isArray(loaded.completedQuests) ? loaded.completedQuests : [];
    merged.claimedQuests = Array.isArray(loaded.claimedQuests) ? loaded.claimedQuests : [];
    merged.defeatedBosses = Array.isArray(loaded.defeatedBosses) ? loaded.defeatedBosses : [];
    merged.zoneKills = loaded.zoneKills && typeof loaded.zoneKills === 'object' ? loaded.zoneKills : {};
    merged.purchasedShopItems = Array.isArray(loaded.purchasedShopItems) ? loaded.purchasedShopItems : [];
    merged.training = loaded.training && typeof loaded.training === 'object' ? { attack: loaded.training.attack || 0, defense: loaded.training.defense || 0, crit: loaded.training.crit || 0, dodge: loaded.training.dodge || 0, luck: loaded.training.luck || 0 } : { attack: 0, defense: 0, crit: 0, dodge: 0, luck: 0 };
    merged.dropsFound = Number.isFinite(loaded.dropsFound) ? loaded.dropsFound : 0;
    merged.accessoriesFound = Number.isFinite(loaded.accessoriesFound) ? loaded.accessoriesFound : 0;
    merged.maxWeapons = loadedMaxWeapons;
    merged.maxArmors = loadedMaxArmors;
    merged.maxAccessories = loadedMaxAccessories;
    merged.lastRestedAt = Number.isFinite(loaded.lastRestedAt) ? loaded.lastRestedAt : 0;
    if (!ZONES.some(z => z.id === merged.selectedZone)) merged.selectedZone = 'backyard';
    if (!canEnterZone(ZONES.find(z => z.id === merged.selectedZone), merged)) merged.selectedZone = 'backyard';
    if (!merged.currentEnemy) spawnEnemy(merged, false);
    return merged;
  } catch {
    return freshSave();
  }
}

function saveGame() {
  state.lastSavedAt = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  document.querySelector('#saveStatus').textContent = `Saved ${new Date(state.lastSavedAt).toLocaleTimeString()}`;
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 12);
}

function expToNext(level = state.level) {
  return Math.floor(24 * Math.pow(level, 1.55));
}

function equippedWeapon() {
  return state.weapons.find(w => w.id === state.equippedWeaponId) || state.weapons[0];
}

function equippedArmor() {
  return state.armors.find(a => a.id === state.equippedArmorId) || state.armors[0];
}

function equippedAccessory() {
  return state.accessories.find(a => a.id === state.equippedAccessoryId) || state.accessories[0];
}

function totalAttack() {
  return state.baseAttack + equippedWeapon().attack + (state.training?.attack || 0);
}

function totalDefense() {
  return state.baseDefense + equippedArmor().defense + (state.training?.defense || 0);
}

function totalCritChance() {
  const accessory = equippedAccessory();
  const shopBoost = state.purchasedShopItems?.includes('training-manual') ? 0.02 : 0;
  return Math.min(0.45, 0.05 + (accessory?.crit || 0) + (state.training?.crit || 0) * 0.01 + shopBoost);
}

function totalDodgeChance() {
  const accessory = equippedAccessory();
  const shopBoost = state.purchasedShopItems?.includes('training-manual') ? 0.02 : 0;
  return Math.min(0.35, 0.03 + (accessory?.dodge || 0) + (state.training?.dodge || 0) * 0.01 + shopBoost);
}

function totalLuck() {
  const accessory = equippedAccessory();
  return (accessory?.luck || 0) + (state.training?.luck || 0);
}

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

function currentZone() {
  return ZONES.find(z => z.id === state.selectedZone) || ZONES[0];
}

function zoneIndex(zoneId) {
  return ZONES.findIndex(z => z.id === zoneId);
}

function nextZoneAfter(zoneId) {
  const index = zoneIndex(zoneId);
  return index >= 0 ? ZONES[index + 1] : null;
}

function zoneBossDefeated(zoneId, gameState = state) {
  return gameState.defeatedBosses.includes(zoneId);
}

function zoneKills(zoneId) {
  return state.zoneKills?.[zoneId] || 0;
}

function bossReady(zone = currentZone()) {
  return !zoneBossDefeated(zone.id) && zoneKills(zone.id) >= zone.bossKillsRequired;
}

function canEnterZone(zone, gameState = state) {
  if (!zone) return false;
  if (zone.id === ZONES[0].id) return true;
  const previous = ZONES[zoneIndex(zone.id) - 1];
  return Boolean(previous && zoneBossDefeated(previous.id, gameState));
}

function randomEnemy(zone = currentZone()) {
  return zone.enemies[Math.floor(Math.random() * zone.enemies.length)];
}

function spawnEnemy(targetState = state, announce = true) {
  const zone = ZONES.find(z => z.id === targetState.selectedZone) || ZONES[0];
  const enemy = structuredClone(randomEnemy(zone));
  enemy.isBoss = false;
  targetState.currentEnemy = enemy;
  targetState.enemyHp = enemy.hp;
  if (announce) addLog(`A ${enemy.name} shuffles into bonking range.`);
}

function startBossFight() {
  const zone = currentZone();
  if (!bossReady(zone)) return;
  const boss = structuredClone(zone.boss);
  boss.isBoss = true;
  boss.zoneId = zone.id;
  state.currentEnemy = boss;
  state.enemyHp = boss.hp;
  state.battleRunning = true;
  addLog(`Boss check! ${boss.name} blocks the road to ${boss.unlocks}.`);
}

function pickTier() {
  const total = Object.values(TIERS).reduce((sum, tier) => sum + tier.dropWeight, 0);
  let roll = Math.random() * total;
  for (const [key, tier] of Object.entries(TIERS)) {
    roll -= tier.dropWeight;
    if (roll <= 0) return key;
  }
  return 'common';
}

function salvageValue(item) {
  const tier = TIERS[item.tier] || TIERS.common;
  const power = item.attack || item.defense || item.luck || 1;
  return {
    junk: tier.salvage + item.level * 2,
    gold: Math.floor((tier.salvage + power) / 2)
  };
}

function tierRank(tier) {
  return TIER_ORDER.indexOf(tier);
}

function shouldAutoSalvageDrop(item) {
  if (!state.autoSalvageBelow || state.autoSalvageBelow === 'none') return false;
  return tierRank(item.tier) >= 0 && tierRank(item.tier) < tierRank(state.autoSalvageBelow);
}

function addEquipmentDrop(item, collection, maxItems, equippedId, itemKind) {
  const tierName = TIERS[item.tier].name;
  if (shouldAutoSalvageDrop(item)) {
    const salvage = salvageValue(item);
    state.junk += salvage.junk;
    state.gold += salvage.gold;
    addLog(`Auto-salvaged ${tierName} ${item.name}: +${salvage.junk} junk, +${salvage.gold} gold.`);
    return;
  }
  if (collection.length >= maxItems) {
    const salvage = salvageValue(item);
    state.junk += salvage.junk;
    state.gold += salvage.gold;
    addLog(`Inventory full: auto-salvaged ${tierName} ${item.name} for +${salvage.junk} junk, +${salvage.gold} gold.`);
    return;
  }
  collection.push(item);
  state.dropsFound += 1;
  const statText = itemKind === 'weapon' ? `+${item.attack} attack` : itemKind === 'armor' ? `+${item.defense} defense` : `+${percent(item.crit)} crit, +${percent(item.dodge)} dodge, +${item.luck} luck`;
  addLog(`Found ${itemKind}: ${tierName} ${item.name} (${statText}).`);
  if (itemKind === 'accessory') state.accessoriesFound = (state.accessoriesFound || 0) + 1;
}

function maybeDropEquipment(zone, multiplier = 1) {
  const luckyBoost = state.purchasedShopItems?.includes('lucky-bauble') ? 0.06 : 0;
  const luckBoost = Math.min(0.12, totalLuck() * 0.006);
  if (Math.random() > (zone.dropChance + luckyBoost + luckBoost) * multiplier) return;
  const tier = pickTier();
  const dropRoll = Math.random();
  if (dropRoll < 0.18 && zone.accessoryPool?.length) {
    const blueprintId = zone.accessoryPool[Math.floor(Math.random() * zone.accessoryPool.length)];
    addEquipmentDrop(createAccessory(blueprintId, tier), state.accessories, state.maxAccessories || MAX_ACCESSORIES, state.equippedAccessoryId, 'accessory');
  } else if (dropRoll < 0.52) {
    const blueprintId = zone.armorPool[Math.floor(Math.random() * zone.armorPool.length)];
    addEquipmentDrop(createArmor(blueprintId, tier), state.armors, state.maxArmors || MAX_ARMORS, state.equippedArmorId, 'armor');
  } else {
    const blueprintId = zone.weaponPool[Math.floor(Math.random() * zone.weaponPool.length)];
    addEquipmentDrop(createWeapon(blueprintId, tier), state.weapons, state.maxWeapons || MAX_WEAPONS, state.equippedWeaponId, 'weapon');
  }
}

function gainRewards(enemy, multiplier = 1) {
  const zone = currentZone();
  const exp = Math.floor(enemy.exp * multiplier);
  const gold = Math.floor(enemy.gold * multiplier);
  const junk = Math.max(0, Math.floor(enemy.junk * multiplier));
  state.exp += exp;
  state.gold += gold;
  state.junk += junk;
  state.kills += 1;
  if (enemy.isBoss) {
    if (!state.defeatedBosses.includes(zone.id)) state.defeatedBosses.push(zone.id);
    addLog(`Boss defeated: ${enemy.name}! ${enemy.unlocks} unlocked. +${exp} EXP, +${gold} gold, +${junk} junk.`);
    state.hp = state.maxHp;
  } else {
    state.zoneKills[zone.id] = zoneKills(zone.id) + 1;
    addLog(`Defeated ${enemy.name}: +${exp} EXP, +${gold} gold, +${junk} junk.`);
    maybeDropEquipment(zone, multiplier);
    if (state.zoneKills[zone.id] === zone.bossKillsRequired) addLog(`Boss ready in ${zone.name}: ${zone.boss.name}.`);
  }
  checkLevelUps();
  checkQuestCompletion();
}

function checkLevelUps() {
  let needed = expToNext();
  while (state.exp >= needed) {
    state.exp -= needed;
    state.level += 1;
    state.maxHp += 10 + Math.floor(state.level / 4) * 2 + (state.level % 5 === 0 ? 8 : 0);
    state.baseAttack += 1 + (state.level % 6 === 0 ? 1 : 0);
    state.baseDefense += state.level % 2 === 0 ? 1 : 0;
    if (state.level >= 18 && state.level % 3 === 0) state.baseDefense += 1;
    if (state.level % 4 === 0) state.training.crit = (state.training.crit || 0) + 1;
    if (state.level % 5 === 0) state.training.dodge = (state.training.dodge || 0) + 1;
    if (state.level % 3 === 0) state.training.luck = (state.training.luck || 0) + 1;
    state.hp = state.maxHp;
    const bonusNotes = [state.level % 4 === 0 ? '+1% crit' : '', state.level % 5 === 0 ? '+1% dodge' : '', state.level % 3 === 0 ? '+1 luck' : ''].filter(Boolean);
    addLog(`Level up! You are now level ${state.level}. HP restored${bonusNotes.length ? `, ${bonusNotes.join(', ')}` : ''}.`);
    needed = expToNext();
  }
  checkQuestCompletion();
}

function questProgress(quest) {
  if (quest.metric === 'level') return state.level;
  if (quest.metric === 'bossesDefeated') return state.defeatedBosses?.length || 0;
  if (quest.metric === 'trainingTotal') return Object.values(state.training || {}).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
  if (quest.metric?.includes('.')) {
    return quest.metric.split('.').reduce((value, key) => value?.[key], state) || 0;
  }
  return state[quest.metric] || 0;
}

function questStatus(quest) {
  if (state.claimedQuests.includes(quest.id)) return 'claimed';
  if (state.completedQuests.includes(quest.id) || questProgress(quest) >= quest.target) return 'ready';
  return 'active';
}

function checkQuestCompletion() {
  for (const quest of QUESTS) {
    if (state.completedQuests.includes(quest.id) || state.claimedQuests.includes(quest.id)) continue;
    if (questProgress(quest) >= quest.target) {
      state.completedQuests.push(quest.id);
      addLog(`Quest ready at the tavern: ${quest.name}.`);
    }
  }
}

function claimQuest(questId) {
  const quest = QUESTS.find(q => q.id === questId);
  if (!quest || questStatus(quest) !== 'ready') return;
  state.completedQuests = state.completedQuests.filter(id => id !== quest.id);
  state.claimedQuests.push(quest.id);
  state.gold += quest.rewards.gold || 0;
  state.junk += quest.rewards.junk || 0;
  state.exp += quest.rewards.exp || 0;
  addLog(`Quest complete: ${quest.name}! +${quest.rewards.gold || 0} gold, +${quest.rewards.junk || 0} junk, +${quest.rewards.exp || 0} EXP.`);
  checkLevelUps();
}

function trainCost(type) {
  const ranks = state.training?.[type] || 0;
  const statPremium = ['crit', 'dodge', 'luck'].includes(type) ? 1.6 : 1;
  return { gold: Math.floor((35 + ranks * 30) * statPremium), junk: Math.floor((8 + ranks * 7) * statPremium) };
}

function trainStat(type) {
  const cost = trainCost(type);
  if (state.gold < cost.gold || state.junk < cost.junk) return;
  state.gold -= cost.gold;
  state.junk -= cost.junk;
  state.training[type] = (state.training[type] || 0) + 1;
  const labels = { attack: 'permanent +1 attack', defense: 'permanent +1 defense', crit: 'permanent +1% crit', dodge: 'permanent +1% dodge', luck: 'permanent +1 luck' };
  addLog(`Training paid off: ${labels[type] || type}.`);
}

function restCooldownRemaining(now = Date.now()) {
  if (state.hp <= 0) return 0;
  return Math.max(0, REST_HEAL_COOLDOWN_MS - (now - (state.lastRestedAt || 0)));
}

function canRestHeal(now = Date.now()) {
  return state.hp <= 0 || restCooldownRemaining(now) <= 0;
}

function restHeal() {
  const wasDead = state.hp <= 0;
  const remaining = restCooldownRemaining();
  if (remaining > 0) {
    addLog(`Rest is cooling down. Try again in ${Math.ceil(remaining / 1000)}s, unless you get flattened first.`);
    return false;
  }
  state.hp = state.maxHp;
  state.lastRestedAt = Date.now();
  addLog(wasDead ? 'Emergency rest! HP restored.' : 'Rested up. HP restored.');
  return true;
}

function buyShopItem(itemId) {
  const item = SHOP_ITEMS.find(i => i.id === itemId);
  if (!item || state.purchasedShopItems.includes(item.id)) return;
  if (state.gold < item.cost.gold || state.junk < item.cost.junk) return;
  state.gold -= item.cost.gold;
  state.junk -= item.cost.junk;
  state.purchasedShopItems.push(item.id);
  if (item.id === 'bigger-pack') {
    state.maxWeapons += 4;
    state.maxArmors += 4;
  }
  if (item.id === 'trinket-box') state.maxAccessories += 4;
  if (item.id === 'field-snacks') {
    state.maxHp += 12;
    state.hp += 12;
  }
  addLog(`Bought ${item.name}.`);
}

function battleTick(multiplier = 1) {
  if (!state.battleRunning) return;
  if (state.hp <= 0) {
    state.battleRunning = false;
    addLog('You got flattened. Battle paused, but all earned loot is safe.');
    return;
  }
  if (!state.currentEnemy) spawnEnemy(state, false);

  const enemy = state.currentEnemy;
  const crit = Math.random() < totalCritChance();
  const playerDamage = Math.max(1, Math.floor((totalAttack() + Math.floor(Math.random() * 4)) * (crit ? 1.75 : 1)));
  state.enemyHp -= playerDamage;
  if (multiplier === 1 && scene) scene.playAttackAnimation(playerDamage);
  if (state.enemyHp <= 0) {
    gainRewards(enemy, multiplier);
    spawnEnemy();
  } else {
    const dodged = Math.random() < totalDodgeChance();
    const enemyDamage = dodged ? 0 : Math.max(1, enemy.attack - Math.floor(totalDefense() / 2));
    state.hp = Math.max(0, state.hp - enemyDamage);
    if (multiplier === 1 && scene) scene.playEnemyHit(enemyDamage);
    if (state.hp <= 0) {
      state.battleRunning = false;
      addLog(`${enemy.name} bonked back too hard. Rest up, then restart battle.`);
    }
  }
}

function applyOfflineProgress() {
  const elapsed = Math.min(Date.now() - (state.lastSavedAt || Date.now()), OFFLINE_CAP_MS);
  if (!state.battleRunning || elapsed < 5000) return;
  const ticks = Math.floor(elapsed / TICK_MS);
  const beforeKills = state.kills;
  const beforeExp = state.exp;
  const beforeGold = state.gold;
  const beforeJunk = state.junk;

  for (let i = 0; i < ticks; i++) {
    battleTick(0.85);
    if (!state.battleRunning) break;
  }

  const minutes = Math.max(1, Math.floor(elapsed / 60000));
  const kills = state.kills - beforeKills;
  if (kills > 0) {
    addLog(`While you were away ${minutes}m, battle kept running: ${kills} kills, +${state.gold - beforeGold} gold, +${state.junk - beforeJunk} junk.`);
  } else if (state.exp !== beforeExp) {
    addLog(`While you were away ${minutes}m, your hero made a little progress.`);
  }
}

function unlockedZones() {
  return ZONES.filter(z => state.level >= z.unlockLevel && canEnterZone(z));
}

function bossSummary(zone = currentZone()) {
  const nextZone = nextZoneAfter(zone.id);
  if (zoneBossDefeated(zone.id)) return nextZone ? `${zone.boss.name} defeated. ${nextZone.name} is open.` : `${zone.boss.name} defeated. You cleared the current world!`;
  const kills = zoneKills(zone.id);
  const needed = zone.bossKillsRequired;
  if (kills >= needed) return `${zone.boss.name} is ready. Beat this boss to unlock ${zone.boss.unlocks}.`;
  return `Progress check: defeat ${needed - kills} more monster${needed - kills === 1 ? '' : 's'} in this zone to reveal ${zone.boss.name}.`;
}

function mainScreenFor(screen) {
  if (screen === 'battle') return 'battle';
  if (['character', 'weapons', 'armor', 'accessories', 'inventory'].includes(screen)) return 'character';
  return 'town';
}

function stageFor(screen) {
  if (screen === 'battle') return 'game';
  if (screen === 'town') return 'townStage';
  return `stage-${screen}`;
}

function switchScreen(screen) {
  const mainScreen = mainScreenFor(screen);
  document.body.dataset.stage = screen === 'battle' ? 'battle' : 'town';
  document.querySelectorAll('.menu-button').forEach(btn => btn.classList.toggle('active', btn.dataset.screen === mainScreen));
  document.querySelectorAll('.stage-view').forEach(el => el.classList.toggle('active', el.id === stageFor(screen)));
  if (screen === 'battle' && scene) scene.syncFromState(state, totalAttack(), totalDefense());
}

function stat(label, value) {
  return `<div class="stat"><b>${label}</b><span>${value}</span></div>`;
}

function tierBadge(item) {
  const tier = TIERS[item.tier] || TIERS.common;
  return `<span class="tier-badge" style="--tier:${tier.color}">${tier.name}</span>`;
}

function equipmentCard(item, equipped, type) {
  const salvage = salvageValue(item);
  const powerText = type === 'weapon' ? `+${item.attack} attack` : type === 'armor' ? `+${item.defense} defense` : `${percent(item.crit)} crit · ${percent(item.dodge)} dodge · +${item.luck} luck`;
  return `
    <div class="equipment-card ${equipped ? 'equipped' : ''}">
      <div>
        <strong>${tierBadge(item)} ${item.name} Lv.${item.level}</strong>
        <small>${powerText} · ${item.note}${equipped ? ' · equipped' : ''}</small>
        <small>Salvage value: ${salvage.junk} junk + ${salvage.gold} gold</small>
      </div>
      <div class="equipment-actions">
        <button data-equip-${type}="${item.id}" ${equipped ? 'disabled' : ''}>Equip</button>
        <button class="secondary" data-salvage-${type}="${item.id}" ${equipped ? 'disabled title="Equip another item first"' : ''}>Salvage</button>
      </div>
    </div>`;
}

function questRankBadge(quest) {
  const rank = QUEST_RANKS[quest.rank] || QUEST_RANKS.bronze;
  return `<span class="quest-rank" style="--quest-rank:${rank.color}">${rank.name}</span>`;
}

function questCard(quest) {
  const progress = Math.min(questProgress(quest), quest.target);
  const status = questStatus(quest);
  const rewards = `Reward: ${quest.rewards.gold || 0} gold · ${quest.rewards.junk || 0} junk · ${quest.rewards.exp || 0} EXP`;
  return `
    <div class="quest-card ${status} ${quest.rank || 'bronze'}">
      <div>
        <div class="quest-title-row"><strong>${quest.name}</strong>${questRankBadge(quest)}</div>
        <small>${quest.description}</small>
        <div class="progress-track" aria-label="${quest.name} progress"><span style="width:${Math.floor((progress / quest.target) * 100)}%"></span></div>
        <small>${progress}/${quest.target} · ${rewards}</small>
      </div>
      <button data-claim-quest="${quest.id}" ${status !== 'ready' ? 'disabled' : ''}>${status === 'claimed' ? 'Claimed' : status === 'ready' ? 'Claim reward' : 'In progress'}</button>
    </div>`;
}

function questCategorySection([category, quests]) {
  const readyCount = quests.filter(q => questStatus(q) === 'ready').length;
  const activeCount = quests.filter(q => questStatus(q) === 'active').length;
  return `
    <section class="quest-category">
      <h3>${QUEST_CATEGORY_LABELS[category] || category}<span>${readyCount} ready · ${activeCount} active</span></h3>
      <div class="list">${quests.map(questCard).join('')}</div>
    </section>`;
}

function groupedQuestCards() {
  const groups = Object.entries(QUESTS.reduce((all, quest) => {
    const key = quest.category || 'slayer';
    all[key] = all[key] || [];
    all[key].push(quest);
    return all;
  }, {}));
  return groups.map(questCategorySection).join('');
}

function shopCard(item) {
  const bought = state.purchasedShopItems.includes(item.id);
  const affordable = state.gold >= item.cost.gold && state.junk >= item.cost.junk;
  return `
    <div class="shop-card ${bought ? 'bought' : ''}">
      <div>
        <strong>${item.name}</strong>
        <small>${item.description}</small>
        <small>Cost: ${item.cost.gold} gold + ${item.cost.junk} junk</small>
      </div>
      <button data-buy-shop="${item.id}" ${bought || !affordable ? 'disabled' : ''}>${bought ? 'Bought' : 'Buy'}</button>
    </div>`;
}

function shortLogLine(message) {
  return message
    .replace('Auto-salvaged', 'Salvaged')
    .replace('Inventory full: auto-salvaged', 'Full: salvaged')
    .replace('A ', '')
    .replace(' shuffles into bonking range.', ' appeared.')
    .replace('Battle started. Menus are safe; bonking continues.', 'Battle started.')
    .replace('Battle is paused.', 'Battle paused.');
}

function townBadgeText() {
  const readyQuests = QUESTS.filter(q => questStatus(q) === 'ready').length;
  const weaponCost = currentUpgradeCost('weapon');
  const armorCost = currentUpgradeCost('armor');
  const canUpgrade = state.gold >= weaponCost.gold && state.junk >= weaponCost.junk || state.gold >= armorCost.gold && state.junk >= armorCost.junk;
  const canShop = SHOP_ITEMS.some(item => !state.purchasedShopItems.includes(item.id) && state.gold >= item.cost.gold && state.junk >= item.cost.junk);
  const atkCost = trainCost('attack');
  const defCost = trainCost('defense');
  const critCost = trainCost('crit');
  const dodgeCost = trainCost('dodge');
  const luckCost = trainCost('luck');
  const canTrain = state.gold >= atkCost.gold && state.junk >= atkCost.junk || state.gold >= defCost.gold && state.junk >= defCost.junk || state.gold >= critCost.gold && state.junk >= critCost.junk || state.gold >= dodgeCost.gold && state.junk >= dodgeCost.junk || state.gold >= luckCost.gold && state.junk >= luckCost.junk;
  return { readyQuests, canUpgrade, canShop, canTrain };
}

function nextPromptText() {
  if (state.hp <= 0) return 'Next: Rest at the battle panel, then restart auto-battle.';
  const readyQuests = QUESTS.filter(q => questStatus(q) === 'ready');
  if (readyQuests.length) return `Next: Claim ${readyQuests.length} reward${readyQuests.length === 1 ? '' : 's'} at the Tavern.`;
  if (bossReady()) return `Next: Challenge ${currentZone().boss.name} to unlock ${currentZone().boss.unlocks}.`;
  const weaponCost = currentUpgradeCost('weapon');
  if (state.gold >= weaponCost.gold && state.junk >= weaponCost.junk) return 'Next: Visit the Blacksmith and upgrade your weapon.';
  const armorCost = currentUpgradeCost('armor');
  if (state.gold >= armorCost.gold && state.junk >= armorCost.junk) return 'Next: Visit the Blacksmith and upgrade your armor.';
  const nextLockedByBoss = nextZoneAfter(currentZone().id);
  if (nextLockedByBoss && state.level >= nextLockedByBoss.unlockLevel && !canEnterZone(nextLockedByBoss)) return `Next: ${bossSummary(currentZone())}`;
  const nextZone = ZONES.find(z => state.level < z.unlockLevel);
  if (nextZone) return `Next: Keep battling toward level ${nextZone.unlockLevel} to unlock ${nextZone.name}.`;
  if (!state.battleRunning) return 'Next: Start auto-battle from the Road Sign.';
  return 'Next: Let auto-battle run, then check town for rewards.';
}

function render() {
  const enemy = state.currentEnemy || { name: 'No enemy', hp: 1 };
  const weapon = equippedWeapon();
  const armor = equippedArmor();
  const accessory = equippedAccessory();
  const zone = currentZone();
  const hpText = `${state.hp}/${state.maxHp}`;
  const enemyText = `${enemy.name} (${Math.max(0, state.enemyHp)}/${enemy.hp} HP)`;

  document.querySelector('#toggleBattle').textContent = state.battleRunning ? 'Pause battle' : 'Start battle';
  const restRemaining = restCooldownRemaining();
  document.querySelector('#healButton').textContent = restRemaining > 0 ? `Rest cooldown ${Math.ceil(restRemaining / 1000)}s` : state.hp <= 0 ? 'Emergency rest' : 'Rest + heal';
  document.querySelector('#healButton').disabled = restRemaining > 0;
  document.querySelector('#battleSummary').textContent = state.battleRunning
    ? `Fighting in ${zone.name}. ${zone.theme}`
    : `Battle is paused. Current zone: ${zone.name} — ${zone.theme}`;

  document.querySelector('#battleStats').innerHTML = [
    stat('Hero HP', hpText),
    stat('Enemy', enemyText),
    stat('Attack', totalAttack()),
    stat('Defense', totalDefense()),
    stat('Crit', percent(totalCritChance())),
    stat('Dodge', percent(totalDodgeChance())),
    stat('Zone progress', zoneBossDefeated(zone.id) ? 'Boss defeated' : `${Math.min(zoneKills(zone.id), zone.bossKillsRequired)}/${zone.bossKillsRequired} to boss`),
    stat('Zone theme', zone.theme)
  ].join('');

  document.querySelector('#bossSummary').textContent = bossSummary(zone);
  document.querySelector('#bossButton').disabled = !bossReady(zone) || state.currentEnemy?.isBoss;

  document.querySelector('#characterStats').innerHTML = [
    stat('Level', state.level),
    stat('EXP', `${state.exp}/${expToNext()}`),
    stat('HP', hpText),
    stat('Base attack', state.baseAttack),
    stat('Base defense', state.baseDefense),
    stat('Crit chance', percent(totalCritChance())),
    stat('Dodge chance', percent(totalDodgeChance())),
    stat('Luck', totalLuck()),
    stat('Kills', state.kills),
    stat('Weapon', `${TIERS[weapon.tier].name} ${weapon.name} +${weapon.attack}`),
    stat('Armor', `${TIERS[armor.tier].name} ${armor.name} +${armor.defense}`),
    stat('Accessory', `${TIERS[accessory.tier].name} ${accessory.name} · ${percent(accessory.crit)} crit / ${percent(accessory.dodge)} dodge / ${accessory.luck} luck`)
  ].join('');

  document.querySelector('#inventoryStats').innerHTML = [
    stat('Gold', state.gold),
    stat('Junk', state.junk),
    stat('Weapon space', `${state.weapons.length}/${state.maxWeapons || MAX_WEAPONS}`),
    stat('Armor space', `${state.armors.length}/${state.maxArmors || MAX_ARMORS}`),
    stat('Accessory space', `${state.accessories.length}/${state.maxAccessories || MAX_ACCESSORIES}`),
    stat('Auto salvage', state.autoSalvageBelow === 'none' ? 'Off' : `Below ${TIERS[state.autoSalvageBelow].name}`),
    stat('Offline cap', '8 hours')
  ].join('');

  document.querySelector('#questList').innerHTML = groupedQuestCards();
  document.querySelector('#shopList').innerHTML = SHOP_ITEMS.map(shopCard).join('');

  const atkCost = trainCost('attack');
  const defCost = trainCost('defense');
  const critCost = trainCost('crit');
  const dodgeCost = trainCost('dodge');
  const luckCost = trainCost('luck');
  document.querySelector('#trainingHint').textContent = `Attack rank ${state.training.attack}: ${atkCost.gold}g/${atkCost.junk}j. Defense rank ${state.training.defense}: ${defCost.gold}g/${defCost.junk}j. Crit rank ${state.training.crit}: ${critCost.gold}g/${critCost.junk}j. Dodge rank ${state.training.dodge}: ${dodgeCost.gold}g/${dodgeCost.junk}j. Luck rank ${state.training.luck}: ${luckCost.gold}g/${luckCost.junk}j.`;
  document.querySelector('#trainAttack').disabled = state.gold < atkCost.gold || state.junk < atkCost.junk;
  document.querySelector('#trainDefense').disabled = state.gold < defCost.gold || state.junk < defCost.junk;
  document.querySelector('#trainCrit').disabled = state.gold < critCost.gold || state.junk < critCost.junk;
  document.querySelector('#trainDodge').disabled = state.gold < dodgeCost.gold || state.junk < dodgeCost.junk;
  document.querySelector('#trainLuck').disabled = state.gold < luckCost.gold || state.junk < luckCost.junk;

  const badges = townBadgeText();
  document.querySelector('#townBlacksmithBadge').textContent = badges.canUpgrade ? 'Upgrade ready' : '';
  document.querySelector('#townTavernBadge').textContent = badges.readyQuests ? `${badges.readyQuests} quest${badges.readyQuests === 1 ? '' : 's'} ready` : '';
  document.querySelector('#townShopBadge').textContent = badges.canShop ? 'New buy' : '';
  document.querySelector('#townTrainingBadge').textContent = badges.canTrain ? 'Can train' : '';
  document.querySelector('#townRoadBadge').textContent = state.battleRunning ? 'Battle running' : 'Paused';

  document.querySelector('#weaponList').innerHTML = state.weapons.map(w => equipmentCard(w, w.id === state.equippedWeaponId, 'weapon')).join('');
  document.querySelector('#armorList').innerHTML = state.armors.map(a => equipmentCard(a, a.id === state.equippedArmorId, 'armor')).join('');
  document.querySelector('#accessoryList').innerHTML = state.accessories.map(a => equipmentCard(a, a.id === state.equippedAccessoryId, 'accessory')).join('');

  const weaponCost = currentUpgradeCost('weapon');
  const armorCost = currentUpgradeCost('armor');
  const accessoryCost = currentUpgradeCost('accessory');
  document.querySelector('#craftingHint').textContent = `Weapon: ${weaponCost.gold} gold + ${weaponCost.junk} junk. Armor: ${armorCost.gold} gold + ${armorCost.junk} junk. Accessory: ${accessoryCost.gold} gold + ${accessoryCost.junk} junk.`;
  document.querySelector('#upgradeWeapon').disabled = state.gold < weaponCost.gold || state.junk < weaponCost.junk;
  document.querySelector('#upgradeArmor').disabled = state.gold < armorCost.gold || state.junk < armorCost.junk;
  document.querySelector('#upgradeAccessory').disabled = state.gold < accessoryCost.gold || state.junk < accessoryCost.junk;

  document.querySelector('#combatLog').innerHTML = state.log.map(item => `<li>${item}</li>`).join('');
  document.querySelector('#miniCombatLog').innerHTML = state.log.slice(0, 3).map(item => `<li>${shortLogLine(item)}</li>`).join('');
  document.querySelector('#nextPrompt').textContent = nextPromptText();

  const zoneSelect = document.querySelector('#zoneSelect');
  const options = unlockedZones().map(z => `<option value="${z.id}" ${z.id === state.selectedZone ? 'selected' : ''}>${z.name} · Lv.${z.unlockLevel}+</option>`).join('');
  if (zoneSelect.innerHTML !== options) zoneSelect.innerHTML = options;

  const autoSalvageSelect = document.querySelector('#autoSalvageBelow');
  if (autoSalvageSelect) autoSalvageSelect.value = state.autoSalvageBelow || 'none';

  if (scene) scene.syncFromState(state, totalAttack(), totalDefense());
}

function currentUpgradeCost(type) {
  const item = type === 'armor' ? equippedArmor() : type === 'accessory' ? equippedAccessory() : equippedWeapon();
  const tier = TIERS[item.tier] || TIERS.common;
  return {
    gold: tier.upgradeGold * item.level,
    junk: tier.upgradeJunk * item.level
  };
}

function salvageEquipment(id, type) {
  const list = type === 'armor' ? state.armors : type === 'accessory' ? state.accessories : state.weapons;
  const equippedId = type === 'armor' ? state.equippedArmorId : type === 'accessory' ? state.equippedAccessoryId : state.equippedWeaponId;
  const item = list.find(i => i.id === id);
  if (!item || item.id === equippedId || list.length <= 1) return;
  const value = salvageValue(item);
  state.gold += value.gold;
  state.junk += value.junk;
  if (type === 'armor') state.armors = state.armors.filter(i => i.id !== id);
  else if (type === 'accessory') state.accessories = state.accessories.filter(i => i.id !== id);
  else state.weapons = state.weapons.filter(i => i.id !== id);
  addLog(`Salvaged ${TIERS[item.tier].name} ${item.name}: +${value.junk} junk, +${value.gold} gold.`);
}

function upgradeEquipped(type) {
  const item = type === 'armor' ? equippedArmor() : type === 'accessory' ? equippedAccessory() : equippedWeapon();
  const cost = currentUpgradeCost(type);
  if (state.gold < cost.gold || state.junk < cost.junk) return;
  state.gold -= cost.gold;
  state.junk -= cost.junk;
  item.level += 1;
  const bump = item.tier === 'epic' ? 4 : item.tier === 'rare' ? 3 : 2;
  if (type === 'armor') item.defense += Math.max(1, bump - 1);
  else if (type === 'accessory') {
    item.crit = Math.min(0.18, Math.round((item.crit + 0.005 * bump) * 1000) / 1000);
    item.dodge = Math.min(0.16, Math.round((item.dodge + 0.004 * bump) * 1000) / 1000);
    item.luck += Math.max(1, bump - 1);
  }
  else item.attack += bump;
  addLog(`${TIERS[item.tier].name} ${item.name} upgraded to Lv.${item.level}.`);
}

function bindUi() {
  document.querySelectorAll('.menu-button').forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.dataset.screen));
  });

  document.querySelectorAll('[data-town-target]').forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.dataset.townTarget));
  });

  document.querySelectorAll('[data-hero-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.heroTarget;
      switchScreen(target === 'stats' ? 'character' : target);
    });
  });

  document.querySelector('#toggleBattle').addEventListener('click', () => {
    state.battleRunning = !state.battleRunning;
    if (!state.currentEnemy) spawnEnemy();
    addLog(state.battleRunning ? 'Battle started. Menus are safe; bonking continues.' : 'Battle paused.');
    saveGame();
    render();
  });

  document.querySelector('#healButton').addEventListener('click', () => {
    restHeal();
    saveGame();
    render();
  });

  document.querySelector('#bossButton').addEventListener('click', () => {
    startBossFight();
    saveGame();
    render();
  });

  document.querySelector('#zoneSelect').addEventListener('change', event => {
    const requestedZone = ZONES.find(z => z.id === event.target.value);
    if (!canEnterZone(requestedZone)) {
      addLog(`Road blocked. Beat the previous zone boss before entering ${requestedZone?.name || 'that zone'}.`);
      event.target.value = state.selectedZone;
      render();
      return;
    }
    state.selectedZone = event.target.value;
    spawnEnemy();
    addLog(`Moved battle target to ${currentZone().name}.`);
    saveGame();
    render();
  });

  document.querySelector('#weaponList').addEventListener('click', event => {
    const equipId = event.target.dataset.equipWeapon;
    const salvageId = event.target.dataset.salvageWeapon;
    if (equipId) {
      state.equippedWeaponId = equipId;
      addLog(`Equipped ${TIERS[equippedWeapon().tier].name} ${equippedWeapon().name}.`);
    }
    if (salvageId) salvageEquipment(salvageId, 'weapon');
    saveGame();
    render();
  });

  document.querySelector('#armorList').addEventListener('click', event => {
    const equipId = event.target.dataset.equipArmor;
    const salvageId = event.target.dataset.salvageArmor;
    if (equipId) {
      state.equippedArmorId = equipId;
      addLog(`Equipped ${TIERS[equippedArmor().tier].name} ${equippedArmor().name}.`);
    }
    if (salvageId) salvageEquipment(salvageId, 'armor');
    saveGame();
    render();
  });


  document.querySelector('#accessoryList').addEventListener('click', event => {
    const equipId = event.target.dataset.equipAccessory;
    const salvageId = event.target.dataset.salvageAccessory;
    if (equipId) {
      state.equippedAccessoryId = equipId;
      addLog(`Equipped ${TIERS[equippedAccessory().tier].name} ${equippedAccessory().name}.`);
    }
    if (salvageId) salvageEquipment(salvageId, 'accessory');
    saveGame();
    render();
  });

  document.querySelector('#upgradeWeapon').addEventListener('click', () => {
    upgradeEquipped('weapon');
    saveGame();
    render();
  });

  document.querySelector('#upgradeArmor').addEventListener('click', () => {
    upgradeEquipped('armor');
    saveGame();
    render();
  });

  document.querySelector('#upgradeAccessory').addEventListener('click', () => {
    upgradeEquipped('accessory');
    saveGame();
    render();
  });

  document.querySelector('#questList').addEventListener('click', event => {
    const questId = event.target.dataset.claimQuest;
    if (!questId) return;
    claimQuest(questId);
    saveGame();
    render();
  });

  document.querySelector('#shopList').addEventListener('click', event => {
    const itemId = event.target.dataset.buyShop;
    if (!itemId) return;
    buyShopItem(itemId);
    saveGame();
    render();
  });

  document.querySelector('#trainAttack').addEventListener('click', () => {
    trainStat('attack');
    saveGame();
    render();
  });

  document.querySelector('#trainDefense').addEventListener('click', () => {
    trainStat('defense');
    saveGame();
    render();
  });

  document.querySelector('#trainCrit').addEventListener('click', () => {
    trainStat('crit');
    saveGame();
    render();
  });

  document.querySelector('#trainDodge').addEventListener('click', () => {
    trainStat('dodge');
    saveGame();
    render();
  });

  document.querySelector('#trainLuck').addEventListener('click', () => {
    trainStat('luck');
    saveGame();
    render();
  });

  document.querySelector('#autoSalvageBelow').addEventListener('change', event => {
    state.autoSalvageBelow = event.target.value;
    addLog(state.autoSalvageBelow === 'none' ? 'Auto-salvage turned off.' : `Auto-salvage will break down drops below ${TIERS[state.autoSalvageBelow].name}.`);
    saveGame();
    render();
  });

  document.querySelector('#resetSave').addEventListener('click', () => {
    if (!confirm('Reset local save and start over?')) return;
    localStorage.removeItem(SAVE_KEY);
    Object.assign(state, freshSave());
    spawnEnemy(state, false);
    saveGame();
    render();
  });
}

function colorNumber(hex) {
  return Phaser.Display.Color.HexStringToColor(hex).color;
}

function strokeLine(g, x1, y1, x2, y2) {
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.strokePath();
}

function strokeQuad(g, x1, y1, cx, cy, x2, y2, steps = 10) {
  g.beginPath();
  g.moveTo(x1, y1);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    g.lineTo(mt * mt * x1 + 2 * mt * t * cx + t * t * x2, mt * mt * y1 + 2 * mt * t * cy + t * t * y2);
  }
  g.strokePath();
}

function strokeBezier(g, x1, y1, c1x, c1y, c2x, c2y, x2, y2, steps = 12) {
  g.beginPath();
  g.moveTo(x1, y1);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    g.lineTo(
      mt ** 3 * x1 + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t ** 3 * x2,
      mt ** 3 * y1 + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t ** 3 * y2
    );
  }
  g.strokePath();
}

function enemyAssetKey(enemy) {
  if (enemy?.artKey) return enemy.artKey;
  return `enemy-${(enemy?.name || 'suspicious-ant').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

class BattleScene extends Phaser.Scene {
  constructor() { super('BattleScene'); }

  preload() {
    const base = './assets/manuscript/';
    for (const zone of ZONES) this.load.image(`bg-${zone.id}`, `${base}bg-${zone.id}.png`);
    this.load.image('hero-base', `${base}hero-base.png`);
    this.load.image('shadow', `${base}shadow.png`);
    for (const tier of Object.keys(TIERS)) {
      this.load.image(`glow-${tier}`, `${base}glow-${tier}.png`);
      this.load.image(`slash-${tier}`, `${base}slash-${tier}.png`);
    }
    for (const art of new Set(Object.values(WEAPON_BLUEPRINTS).map(w => w.art))) {
      this.load.image(`weapon-${art}`, `${base}weapon-${art}.png`);
    }
    for (const art of new Set(Object.values(ARMOR_BLUEPRINTS).map(a => a.art))) {
      this.load.image(`armor-${art}`, `${base}armor-${art}.png`);
    }
    for (const zone of ZONES) {
      for (const enemy of zone.enemies) this.load.image(enemyAssetKey(enemy), `${base}${enemyAssetKey(enemy)}.png`);
      this.load.image(enemyAssetKey(zone.boss), `${base}${enemyAssetKey(zone.boss)}.png`);
    }
  }

  create() {
    scene = this;
    this.bg = this.add.image(360, 270, 'bg-backyard').setDisplaySize(720, 540);

    this.topHud = this.add.rectangle(360, 48, 680, 76, 0x2a1832, 0.82).setStrokeStyle(3, 0xffcf68, 0.5);

    this.titleText = this.add.text(36, 22, 'Battle Road', {
      fontFamily: 'Georgia, serif', fontSize: '26px', color: '#ffefb0',
      stroke: '#3a1f18', strokeThickness: 4, shadow: { offsetX: 2, offsetY: 3, color: '#000000', blur: 2, fill: true }
    });
    this.zoneText = this.add.text(36, 56, '', {
      fontFamily: 'Trebuchet MS, sans-serif', fontSize: '14px', color: '#fff4d0',
      wordWrap: { width: 620 }, lineSpacing: 3
    });

    this.heroHpLabel = this.add.text(44, 104, 'Hero', { fontFamily: 'monospace', fontSize: '14px', color: '#fff4d0', stroke: '#3a1f18', strokeThickness: 3 });
    this.heroHpBack = this.add.rectangle(134, 114, 170, 14, 0x1b101d, 0.88).setOrigin(0, 0.5).setStrokeStyle(2, 0xffefb0, 0.35);
    this.heroHpFill = this.add.rectangle(134, 114, 170, 10, 0x8ff0a4, 0.95).setOrigin(0, 0.5);
    this.enemyHpLabel = this.add.text(418, 104, 'Enemy', { fontFamily: 'monospace', fontSize: '14px', color: '#fff4d0', stroke: '#3a1f18', strokeThickness: 3 });
    this.enemyHpBack = this.add.rectangle(500, 114, 170, 14, 0x1b101d, 0.88).setOrigin(0, 0.5).setStrokeStyle(2, 0xffefb0, 0.35);
    this.enemyHpFill = this.add.rectangle(500, 114, 170, 10, 0xff6b7a, 0.95).setOrigin(0, 0.5);

    this.hero = this.add.container(178, 332);
    this.heroShadow = this.add.image(0, 72, 'shadow').setScale(0.82);
    this.tierGlow = this.add.image(0, -18, 'glow-common').setScale(0.86).setBlendMode(Phaser.BlendModes.ADD);
    this.heroSprite = this.add.image(0, 0, 'hero-base').setScale(0.58);
    this.armorSprite = this.add.image(0, 18, 'armor-hoodie').setScale(0.55).setAlpha(0.82);
    this.weaponSprite = this.add.image(62, -44, 'weapon-bat').setScale(0.52).setAngle(-20);
    this.nameTag = this.add.text(-26, -116, 'YOU', { fontFamily: 'monospace', fontSize: '14px', color: '#fff4d0', stroke: '#3a1f18', strokeThickness: 3 });
    this.hero.add([this.heroShadow, this.tierGlow, this.heroSprite, this.armorSprite, this.weaponSprite, this.nameTag]);

    this.enemy = this.add.container(540, 322);
    this.enemyShadow = this.add.image(0, 84, 'shadow').setScale(1.04);
    this.enemySprite = this.add.image(0, 0, 'enemy-suspicious-ant').setScale(0.82);
    this.enemy.add([this.enemyShadow, this.enemySprite]);
    this.enemyName = this.add.text(420, 190, '', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff4d0', align: 'center',
      stroke: '#3a1f18', strokeThickness: 4, wordWrap: { width: 240 }
    });

    this.bottomHud = this.add.rectangle(360, 506, 680, 48, 0x211629, 0.86).setStrokeStyle(3, 0x8ff0a4, 0.32);
    this.statusText = this.add.text(38, 492, '', { fontFamily: 'monospace', fontSize: '16px', color: '#fff4d0', stroke: '#3a1f18', strokeThickness: 4 });
    this.syncFromState(state, totalAttack(), totalDefense());
  }

  playAttackAnimation(damage) {
    if (!this.hero || !this.enemy) return;
    this.tweens.killTweensOf([this.hero, this.weaponSprite, this.enemy]);
    this.tweens.add({ targets: this.hero, x: 232, duration: 135, yoyo: true, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: this.weaponSprite, angle: -62, scale: 0.66, duration: 110, yoyo: true, ease: 'Back.easeOut' });
    this.tweens.add({ targets: this.enemy, x: 565, angle: 4, duration: 70, yoyo: true, repeat: 1 });
    const slash = this.add.image(526, 260, `slash-${equippedWeapon().tier}`).setScale(0.95).setAngle(-8).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: slash, alpha: 0, scale: 1.25, duration: 260, onComplete: () => slash.destroy() });
    const hit = this.add.text(this.enemy.x - 12, this.enemy.y - 98, `-${damage}`, { fontFamily: 'Georgia, serif', fontSize: '26px', color: '#ffefb0', stroke: '#3a1f18', strokeThickness: 5 });
    this.tweens.add({ targets: hit, y: hit.y - 38, alpha: 0, duration: 560, onComplete: () => hit.destroy() });
  }

  playEnemyHit(damage) {
    if (!this.hero) return;
    this.tweens.add({ targets: this.hero, x: 162, angle: -2, duration: 75, yoyo: true, repeat: 1 });
    const hit = this.add.text(this.hero.x - 28, this.hero.y - 135, `-${damage}`, { fontFamily: 'Georgia, serif', fontSize: '19px', color: '#ff6b7a', stroke: '#3a1f18', strokeThickness: 4 });
    this.tweens.add({ targets: hit, y: hit.y - 26, alpha: 0, duration: 480, onComplete: () => hit.destroy() });
  }

  syncFromState(gameState, attack, defense) {
    if (!this.bg || !this.enemySprite) return;
    const zone = currentZone();
    const weapon = equippedWeapon();
    const armor = equippedArmor();
    const enemy = gameState.currentEnemy || { name: 'Suspicious Ant', hp: 1 };

    if (this.lastZoneId !== zone.id) {
      this.bg.setTexture(`bg-${zone.id}`);
      this.lastZoneId = zone.id;
    }
    if (this.lastWeaponId !== weapon.id || this.lastWeaponLevel !== weapon.level) {
      this.weaponSprite.setTexture(`weapon-${weapon.art || 'bat'}`);
      this.tierGlow.setTexture(`glow-${weapon.tier || 'common'}`);
      this.lastWeaponId = weapon.id;
      this.lastWeaponLevel = weapon.level;
    }
    if (this.lastArmorId !== armor.id || this.lastArmorLevel !== armor.level) {
      this.armorSprite.setTexture(`armor-${armor.art || 'hoodie'}`);
      this.lastArmorId = armor.id;
      this.lastArmorLevel = armor.level;
    }
    const enemyKey = enemyAssetKey(enemy);
    if (this.lastEnemyName !== enemy.name) {
      this.enemySprite.setTexture(enemyKey);
      this.lastEnemyName = enemy.name;
    }

    this.tierGlow.setAlpha(weapon.tier === 'common' ? 0.42 : weapon.tier === 'unusual' ? 0.58 : weapon.tier === 'rare' ? 0.72 : 0.9);
    this.zoneText.setText(`${zone.name} · ${zone.theme}`);
    this.enemyName.setText(enemy.name);
    this.statusText.setText(`${gameState.battleRunning ? 'AUTO-BATTLE RUNNING' : 'BATTLE PAUSED'}    LV ${gameState.level}    ATK ${attack}    DEF ${defense}    CRIT ${percent(totalCritChance())}    KILLS ${gameState.kills}`);
    const heroRatio = Phaser.Math.Clamp(gameState.hp / gameState.maxHp, 0, 1);
    const danger = Phaser.Math.Clamp(gameState.enemyHp / enemy.hp, 0, 1);
    this.heroHpFill.width = 170 * heroRatio;
    this.enemyHpFill.width = 170 * danger;
    this.heroHpLabel.setText(`Hero ${gameState.hp}/${gameState.maxHp}`);
    this.enemyHpLabel.setText(`${Math.max(0, gameState.enemyHp)}/${enemy.hp}`);
    this.enemy.setScale(0.86 + danger * 0.28);
    this.enemy.setAlpha(gameState.battleRunning ? 1 : 0.68);
    this.hero.setAlpha(gameState.hp > 0 ? 1 : 0.45);
  }

  update(time) {
    if (!this.hero || !this.enemy) return;
    this.hero.y = 332 + Math.sin(time / 170) * (state.battleRunning ? 4 : 2);
    this.enemy.x = 540 + Math.sin(time / 210) * (state.battleRunning ? 5 : 2);
    this.enemy.y = 322 + Math.cos(time / 260) * 2;
    this.tierGlow.setScale(0.86 + Math.sin(time / 260) * 0.06);
  }
}


function runRestCooldownSelfTest() {
  const originalHp = state.hp;
  const originalMaxHp = state.maxHp;
  const originalLastRestedAt = state.lastRestedAt;
  const originalLog = [...state.log];
  state.maxHp = 100;
  state.hp = 50;
  state.lastRestedAt = 0;
  const first = restHeal();
  const afterFirst = state.hp;
  state.hp = 40;
  const second = restHeal();
  const afterBlocked = state.hp;
  state.hp = 0;
  const emergency = restHeal();
  const afterEmergency = state.hp;
  state.hp = originalHp;
  state.maxHp = originalMaxHp;
  state.lastRestedAt = originalLastRestedAt;
  state.log = originalLog;
  if (!first || afterFirst !== 100 || second || afterBlocked !== 40 || !emergency || afterEmergency !== 100) {
    throw new Error('Rest cooldown self-test failed');
  }
}

function startPhaser() {
  new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 720,
    height: 540,
    pixelArt: true,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: BattleScene
  });
}

runRestCooldownSelfTest();
spawnEnemy(state, false);
applyOfflineProgress();
bindUi();
startPhaser();
render();
saveGame();
setInterval(() => {
  battleTick();
  saveGame();
  render();
}, TICK_MS);
