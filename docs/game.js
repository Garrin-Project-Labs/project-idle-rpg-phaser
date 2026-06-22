const SAVE_KEY = 'idle-rpg-phaser-save-v1';
const SAVE_VERSION = 7;
const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000;
const TICK_MS = 1000;
const MAX_WEAPONS = 14;
const MAX_ARMORS = 12;
const MAX_ACCESSORIES = 10;
const TIER_ORDER = ['common', 'unusual', 'rare', 'epic'];

const QUESTS = [
  { id: 'stat-starter', name: 'Find Your Weird Power', description: 'Reach level 3 and unlock your first crit/dodge/luck rhythm.', metric: 'level', target: 3, rewards: { gold: 40, junk: 12, exp: 25 } },
  { id: 'first-bonks', name: 'First Bonks', description: 'Defeat 5 monsters in any zone.', metric: 'kills', target: 5, rewards: { gold: 18, junk: 6, exp: 12 } },
  { id: 'backyard-cleanup', name: 'Backyard Cleanup', description: 'Defeat 20 monsters and prove the bugs are mostly unfair.', metric: 'kills', target: 20, rewards: { gold: 55, junk: 18, exp: 35 } },
  { id: 'gear-check', name: 'Gear Check', description: 'Find 3 gear drops from monsters.', metric: 'dropsFound', target: 3, rewards: { gold: 35, junk: 25, exp: 20 } },
  { id: 'mall-scout', name: 'Scout the Mall Arcade', description: 'Reach level 4 to unlock the Abandoned Mall Arcade.', metric: 'level', target: 4, rewards: { gold: 80, junk: 20, exp: 45 } },
  { id: 'steady-hero', name: 'Steady Hero', description: 'Defeat 60 monsters total.', metric: 'kills', target: 60, rewards: { gold: 160, junk: 55, exp: 110 } },
  { id: 'trinket-test', name: 'Pocket Magic', description: 'Find 2 accessory drops from monsters.', metric: 'accessoriesFound', target: 2, rewards: { gold: 120, junk: 40, exp: 85 } },
  { id: 'monster-study', name: 'Monster Study Hall', description: 'Defeat 140 monsters total across the expanded zones.', metric: 'kills', target: 140, rewards: { gold: 320, junk: 90, exp: 260 } },
  { id: 'level-climber', name: 'Level Climber', description: 'Reach level 20 and become worryingly competent.', metric: 'level', target: 20, rewards: { gold: 650, junk: 180, exp: 500 } }
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
    boss: { name: 'Royal Rat Chancellor', hp: 820, attack: 50, exp: 560, gold: 360, junk: 76, artKey: 'enemy-crowned-sewer-rat', unlocks: 'bragging rights' },
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
  'plunger-scepter': { name: 'Plunger Scepter', attack: 28, art: 'plunger', note: 'A symbol of questionable rule.' }
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
  'decree-mail': { name: 'Decree-Mail Hauberk', defense: 18, art: 'mail', note: 'Every link is notarized.' }
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
  'ledger-orb': { name: 'Ledger Orb', crit: 0.04, dodge: 0.03, luck: 6, art: 'orb', note: 'Balances violence.' }
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
    state.maxHp += state.level % 5 === 0 ? 14 : 8;
    state.baseAttack += 1;
    if (state.level % 2 === 0) state.baseDefense += 1;
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

function questCard(quest) {
  const progress = Math.min(questProgress(quest), quest.target);
  const status = questStatus(quest);
  const rewards = `Reward: ${quest.rewards.gold || 0} gold · ${quest.rewards.junk || 0} junk · ${quest.rewards.exp || 0} EXP`;
  return `
    <div class="quest-card ${status}">
      <div>
        <strong>${quest.name}</strong>
        <small>${quest.description}</small>
        <div class="progress-track" aria-label="${quest.name} progress"><span style="width:${Math.floor((progress / quest.target) * 100)}%"></span></div>
        <small>${progress}/${quest.target} · ${rewards}</small>
      </div>
      <button data-claim-quest="${quest.id}" ${status !== 'ready' ? 'disabled' : ''}>${status === 'claimed' ? 'Claimed' : status === 'ready' ? 'Claim reward' : 'In progress'}</button>
    </div>`;
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

  document.querySelector('#questList').innerHTML = QUESTS.map(questCard).join('');
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
    state.hp = state.maxHp;
    addLog('Rested up. HP restored.');
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
