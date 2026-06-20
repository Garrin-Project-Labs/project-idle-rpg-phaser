const SAVE_KEY = 'idle-rpg-phaser-save-v1';
const SAVE_VERSION = 4;
const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000;
const TICK_MS = 1000;
const MAX_WEAPONS = 14;
const MAX_ARMORS = 12;
const TIER_ORDER = ['common', 'unusual', 'rare', 'epic'];

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
    weaponPool: ['cracked-bat', 'yo-yo', 'frying-pan', 'garden-rake', 'rubber-chicken'],
    armorPool: ['hoodie', 'cardboard-shield', 'bike-helmet'],
    enemies: [
      { name: 'Suspicious Ant', hp: 14, attack: 2, exp: 4, gold: 2, junk: 1 },
      { name: 'Tiny Goblin Accountant', hp: 20, attack: 3, exp: 6, gold: 4, junk: 1 },
      { name: 'Angry Trash Bag', hp: 28, attack: 4, exp: 9, gold: 6, junk: 2 }
    ]
  },
  {
    id: 'mall',
    name: 'Abandoned Mall Arcade',
    theme: 'Neon carpet, broken prize machines, and snacks with unfinished business.',
    unlockLevel: 4,
    palette: { sky: '#211a3d', ground: '#563071', path: '#3d2358', enemy: '#77b7ff', accent: '#ffcc5c' },
    dropChance: 0.22,
    weaponPool: ['plastic-sword', 'bottle-rocket', 'arcade-stool', 'soda-straw', 'laser-pointer'],
    armorPool: ['varsity-jacket', 'mall-cop-vest', 'soda-tab-mail'],
    enemies: [
      { name: 'Coin-Operated Gremlin', hp: 42, attack: 6, exp: 15, gold: 10, junk: 3 },
      { name: 'Possessed Prize Claw', hp: 54, attack: 7, exp: 19, gold: 13, junk: 3 },
      { name: 'Expired Soda Elemental', hp: 68, attack: 9, exp: 25, gold: 17, junk: 4 }
    ]
  },
  {
    id: 'office',
    name: 'Haunted Office Park',
    theme: 'Cubicles, cursed printers, and meetings that should have been emails.',
    unlockLevel: 8,
    palette: { sky: '#1b2632', ground: '#596273', path: '#343c49', enemy: '#d98bff', accent: '#b7dcff' },
    dropChance: 0.25,
    weaponPool: ['stapler', 'keyboard', 'rolling-chair', 'coffee-mug', 'briefcase'],
    armorPool: ['tie-of-denial', 'printer-toner-plate', 'conference-badge'],
    enemies: [
      { name: 'Passive-Aggressive Printer', hp: 92, attack: 12, exp: 42, gold: 26, junk: 6 },
      { name: 'Spreadsheet Wraith', hp: 112, attack: 14, exp: 54, gold: 31, junk: 7 },
      { name: 'Meeting Ooze', hp: 138, attack: 16, exp: 68, gold: 38, junk: 8 }
    ]
  },
  {
    id: 'pantry',
    name: 'Dusty Pantry Crypt',
    theme: 'Expired condiments, sacred crumbs, and jars that have become legally hostile.',
    unlockLevel: 12,
    palette: { sky: '#4a2f25', ground: '#8a6942', path: '#5f3c2e', enemy: '#d88952', accent: '#f0cf75' },
    dropChance: 0.28,
    weaponPool: ['frying-pan', 'coffee-mug', 'rubber-chicken', 'soda-straw', 'bottle-rocket'],
    armorPool: ['hoodie', 'soda-tab-mail', 'tie-of-denial'],
    enemies: [
      { name: 'Bread Mold Homunculus', hp: 178, attack: 20, exp: 92, gold: 52, junk: 10 },
      { name: 'Forklifted Pickle Jar', hp: 214, attack: 22, exp: 112, gold: 62, junk: 12 },
      { name: 'Self-Crumbing Biscuit', hp: 246, attack: 25, exp: 136, gold: 74, junk: 14 }
    ]
  },
  {
    id: 'sewers',
    name: 'Royal Sewer Scriptorium',
    theme: 'A damp royal archive where rats sign decrees and leeches demand back taxes.',
    unlockLevel: 16,
    palette: { sky: '#18332f', ground: '#315c52', path: '#223f3d', enemy: '#9fd0a0', accent: '#c6e6d0' },
    dropChance: 0.31,
    weaponPool: ['briefcase', 'stapler', 'keyboard', 'garden-rake', 'plastic-sword'],
    armorPool: ['printer-toner-plate', 'conference-badge', 'mall-cop-vest'],
    enemies: [
      { name: 'Crowned Sewer Rat', hp: 310, attack: 30, exp: 184, gold: 92, junk: 16 },
      { name: 'Royal Flush Wraith', hp: 360, attack: 34, exp: 224, gold: 108, junk: 18 },
      { name: 'Tax-Collecting Leech', hp: 420, attack: 38, exp: 270, gold: 132, junk: 22 }
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
  'briefcase': { name: 'Suspiciously Heavy Briefcase', attack: 16, art: 'case', note: 'Full of quarterly reports.' }
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
  'conference-badge': { name: 'Oversized Conference Badge', defense: 9, art: 'badge', note: 'Gets you into rooms and out of danger.' }
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
    battleRunning: false,
    selectedZone: 'backyard',
    currentEnemy: null,
    enemyHp: 0,
    weapons: structuredClone(STARTER_WEAPONS),
    armors: structuredClone(STARTER_ARMORS),
    equippedWeaponId: 'starter-cracked-bat',
    equippedArmorId: 'starter-hoodie',
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

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return freshSave();

  try {
    const loaded = JSON.parse(raw);
    const merged = { ...freshSave(), ...loaded, version: SAVE_VERSION };
    merged.weapons = Array.isArray(loaded.weapons) && loaded.weapons.length
      ? loaded.weapons.map(normalizeWeapon).slice(0, MAX_WEAPONS)
      : structuredClone(STARTER_WEAPONS);
    merged.armors = Array.isArray(loaded.armors) && loaded.armors.length
      ? loaded.armors.map(normalizeArmor).slice(0, MAX_ARMORS)
      : structuredClone(STARTER_ARMORS);
    if (!merged.weapons.some(w => w.id === merged.equippedWeaponId)) merged.equippedWeaponId = merged.weapons[0].id;
    if (!merged.armors.some(a => a.id === merged.equippedArmorId)) merged.equippedArmorId = merged.armors[0].id;
    merged.log = Array.isArray(loaded.log) ? loaded.log.slice(0, 12) : [];
    if (!ZONES.some(z => z.id === merged.selectedZone)) merged.selectedZone = 'backyard';
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

function totalAttack() {
  return state.baseAttack + equippedWeapon().attack;
}

function totalDefense() {
  return state.baseDefense + equippedArmor().defense;
}

function currentZone() {
  return ZONES.find(z => z.id === state.selectedZone) || ZONES[0];
}

function randomEnemy(zone = currentZone()) {
  return zone.enemies[Math.floor(Math.random() * zone.enemies.length)];
}

function spawnEnemy(targetState = state, announce = true) {
  const zone = ZONES.find(z => z.id === targetState.selectedZone) || ZONES[0];
  const enemy = structuredClone(randomEnemy(zone));
  targetState.currentEnemy = enemy;
  targetState.enemyHp = enemy.hp;
  if (announce) addLog(`A ${enemy.name} shuffles into bonking range.`);
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
  const power = item.attack || item.defense || 1;
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
  const statText = itemKind === 'weapon' ? `+${item.attack} attack` : `+${item.defense} defense`;
  addLog(`Found ${itemKind}: ${tierName} ${item.name} (${statText}).`);
}

function maybeDropEquipment(zone, multiplier = 1) {
  if (Math.random() > zone.dropChance * multiplier) return;
  const tier = pickTier();
  const dropsArmor = Math.random() < 0.4;
  if (dropsArmor) {
    const blueprintId = zone.armorPool[Math.floor(Math.random() * zone.armorPool.length)];
    addEquipmentDrop(createArmor(blueprintId, tier), state.armors, MAX_ARMORS, state.equippedArmorId, 'armor');
  } else {
    const blueprintId = zone.weaponPool[Math.floor(Math.random() * zone.weaponPool.length)];
    addEquipmentDrop(createWeapon(blueprintId, tier), state.weapons, MAX_WEAPONS, state.equippedWeaponId, 'weapon');
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
  addLog(`Defeated ${enemy.name}: +${exp} EXP, +${gold} gold, +${junk} junk.`);
  maybeDropEquipment(zone, multiplier);
  checkLevelUps();
}

function checkLevelUps() {
  let needed = expToNext();
  while (state.exp >= needed) {
    state.exp -= needed;
    state.level += 1;
    state.maxHp += 8;
    state.baseAttack += 1;
    if (state.level % 2 === 0) state.baseDefense += 1;
    state.hp = state.maxHp;
    addLog(`Level up! You are now level ${state.level}. HP restored.`);
    needed = expToNext();
  }
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
  const playerDamage = Math.max(1, totalAttack() + Math.floor(Math.random() * 4));
  state.enemyHp -= playerDamage;
  if (multiplier === 1 && scene) scene.playAttackAnimation(playerDamage);
  if (state.enemyHp <= 0) {
    gainRewards(enemy, multiplier);
    spawnEnemy();
  } else {
    const enemyDamage = Math.max(1, enemy.attack - Math.floor(totalDefense() / 2));
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
  return ZONES.filter(z => state.level >= z.unlockLevel);
}

function switchScreen(screen) {
  document.querySelectorAll('.menu-button').forEach(btn => btn.classList.toggle('active', btn.dataset.screen === screen));
  document.querySelectorAll('.screen').forEach(el => el.classList.toggle('active', el.id === `screen-${screen}`));
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
  const powerText = type === 'weapon' ? `+${item.attack} attack` : `+${item.defense} defense`;
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

function render() {
  const enemy = state.currentEnemy || { name: 'No enemy', hp: 1 };
  const weapon = equippedWeapon();
  const armor = equippedArmor();
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
    stat('Zone theme', zone.theme)
  ].join('');

  document.querySelector('#characterStats').innerHTML = [
    stat('Level', state.level),
    stat('EXP', `${state.exp}/${expToNext()}`),
    stat('HP', hpText),
    stat('Base attack', state.baseAttack),
    stat('Base defense', state.baseDefense),
    stat('Kills', state.kills),
    stat('Weapon', `${TIERS[weapon.tier].name} ${weapon.name} +${weapon.attack}`),
    stat('Armor', `${TIERS[armor.tier].name} ${armor.name} +${armor.defense}`)
  ].join('');

  document.querySelector('#inventoryStats').innerHTML = [
    stat('Gold', state.gold),
    stat('Junk', state.junk),
    stat('Weapon space', `${state.weapons.length}/${MAX_WEAPONS}`),
    stat('Armor space', `${state.armors.length}/${MAX_ARMORS}`),
    stat('Auto salvage', state.autoSalvageBelow === 'none' ? 'Off' : `Below ${TIERS[state.autoSalvageBelow].name}`),
    stat('Offline cap', '8 hours')
  ].join('');

  document.querySelector('#weaponList').innerHTML = state.weapons.map(w => equipmentCard(w, w.id === state.equippedWeaponId, 'weapon')).join('');
  document.querySelector('#armorList').innerHTML = state.armors.map(a => equipmentCard(a, a.id === state.equippedArmorId, 'armor')).join('');

  const weaponCost = currentUpgradeCost('weapon');
  const armorCost = currentUpgradeCost('armor');
  document.querySelector('#craftingHint').textContent = `Weapon: ${weaponCost.gold} gold + ${weaponCost.junk} junk. Armor: ${armorCost.gold} gold + ${armorCost.junk} junk.`;
  document.querySelector('#upgradeWeapon').disabled = state.gold < weaponCost.gold || state.junk < weaponCost.junk;
  document.querySelector('#upgradeArmor').disabled = state.gold < armorCost.gold || state.junk < armorCost.junk;

  document.querySelector('#combatLog').innerHTML = state.log.map(item => `<li>${item}</li>`).join('');

  const zoneSelect = document.querySelector('#zoneSelect');
  const options = unlockedZones().map(z => `<option value="${z.id}" ${z.id === state.selectedZone ? 'selected' : ''}>${z.name} · Lv.${z.unlockLevel}+</option>`).join('');
  if (zoneSelect.innerHTML !== options) zoneSelect.innerHTML = options;

  const autoSalvageSelect = document.querySelector('#autoSalvageBelow');
  if (autoSalvageSelect) autoSalvageSelect.value = state.autoSalvageBelow || 'none';

  if (scene) scene.syncFromState(state, totalAttack(), totalDefense());
}

function currentUpgradeCost(type) {
  const item = type === 'armor' ? equippedArmor() : equippedWeapon();
  const tier = TIERS[item.tier] || TIERS.common;
  return {
    gold: tier.upgradeGold * item.level,
    junk: tier.upgradeJunk * item.level
  };
}

function salvageEquipment(id, type) {
  const list = type === 'armor' ? state.armors : state.weapons;
  const equippedId = type === 'armor' ? state.equippedArmorId : state.equippedWeaponId;
  const item = list.find(i => i.id === id);
  if (!item || item.id === equippedId || list.length <= 1) return;
  const value = salvageValue(item);
  state.gold += value.gold;
  state.junk += value.junk;
  if (type === 'armor') state.armors = state.armors.filter(i => i.id !== id);
  else state.weapons = state.weapons.filter(i => i.id !== id);
  addLog(`Salvaged ${TIERS[item.tier].name} ${item.name}: +${value.junk} junk, +${value.gold} gold.`);
}

function upgradeEquipped(type) {
  const item = type === 'armor' ? equippedArmor() : equippedWeapon();
  const cost = currentUpgradeCost(type);
  if (state.gold < cost.gold || state.junk < cost.junk) return;
  state.gold -= cost.gold;
  state.junk -= cost.junk;
  item.level += 1;
  const bump = item.tier === 'epic' ? 4 : item.tier === 'rare' ? 3 : 2;
  if (type === 'armor') item.defense += Math.max(1, bump - 1);
  else item.attack += bump;
  addLog(`${TIERS[item.tier].name} ${item.name} upgraded to Lv.${item.level}.`);
}

function bindUi() {
  document.querySelectorAll('.menu-button').forEach(btn => {
    btn.addEventListener('click', () => switchScreen(btn.dataset.screen));
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

  document.querySelector('#zoneSelect').addEventListener('change', event => {
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

    this.titleText = this.add.text(28, 24, 'Menu Quest', {
      fontFamily: 'Georgia, serif', fontSize: '32px', color: '#ffefb0',
      stroke: '#3a1f18', strokeThickness: 5, shadow: { offsetX: 2, offsetY: 3, color: '#000000', blur: 2, fill: true }
    });
    this.zoneText = this.add.text(30, 66, '', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#3a1f18',
      wordWrap: { width: 650 }, lineSpacing: 3
    });

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
    this.enemyName = this.add.text(420, 205, '', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff4d0', align: 'center',
      stroke: '#3a1f18', strokeThickness: 4, wordWrap: { width: 240 }
    });

    this.statusText = this.add.text(28, 500, '', { fontFamily: 'monospace', fontSize: '17px', color: '#fff4d0', stroke: '#3a1f18', strokeThickness: 4 });
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
    this.zoneText.setText(`${zone.name} — ${zone.theme}`);
    this.enemyName.setText(enemy.name);
    this.statusText.setText(`${gameState.battleRunning ? 'AUTO-BATTLE RUNNING' : 'BATTLE PAUSED'}   HP ${gameState.hp}/${gameState.maxHp}   ATK ${attack}   DEF ${defense}   LV ${gameState.level}`);
    const danger = Math.max(0.25, gameState.enemyHp / enemy.hp);
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
