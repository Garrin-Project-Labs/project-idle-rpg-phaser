const SAVE_KEY = 'idle-rpg-phaser-save-v1';
const SAVE_VERSION = 3;
const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000;
const TICK_MS = 1000;
const MAX_WEAPONS = 14;
const MAX_ARMORS = 12;

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

function addEquipmentDrop(item, collection, maxItems, equippedId, itemKind) {
  const tierName = TIERS[item.tier].name;
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

class BattleScene extends Phaser.Scene {
  constructor() { super('BattleScene'); }

  create() {
    scene = this;
    this.backdrop = this.add.graphics();
    this.midground = this.add.graphics();
    this.foreground = this.add.graphics();
    this.decor = this.add.container(0, 0);

    this.titleText = this.add.text(28, 24, 'Menu Quest', {
      fontFamily: 'Georgia, serif', fontSize: '32px', color: '#ffefb0',
      stroke: '#241634', strokeThickness: 5, shadow: { offsetX: 2, offsetY: 3, color: '#000000', blur: 2, fill: true }
    });
    this.zoneText = this.add.text(30, 66, '', {
      fontFamily: 'Georgia, serif', fontSize: '15px', color: '#f7dfb0',
      wordWrap: { width: 650 }, lineSpacing: 3
    });

    this.hero = this.add.container(178, 330);
    this.heroShadow = this.add.ellipse(0, 58, 112, 24, 0x000000, 0.28);
    this.tierGlow = this.add.circle(0, -22, 92, 0xcbbd9b, 0.16);
    this.heroBody = this.add.container(0, 0);
    this.armorArt = this.add.container(0, 0);
    this.weaponArt = this.add.container(38, -20);
    this.nameTag = this.add.text(-28, -118, 'YOU', { fontFamily: 'monospace', fontSize: '14px', color: '#fff4d0', stroke: '#241634', strokeThickness: 3 });
    this.hero.add([this.heroShadow, this.tierGlow, this.heroBody, this.armorArt, this.weaponArt, this.nameTag]);
    this.rebuildHeroBody();

    this.enemy = this.add.container(540, 320);
    this.enemyShadow = this.add.ellipse(0, 62, 130, 26, 0x000000, 0.3);
    this.enemyGlow = this.add.circle(0, 2, 82, 0xff6b7a, 0.14);
    this.enemyArt = this.add.container(0, 0);
    this.enemy.add([this.enemyShadow, this.enemyGlow, this.enemyArt]);
    this.enemyName = this.add.text(420, 205, '', {
      fontFamily: 'Georgia, serif', fontSize: '18px', color: '#fff4d0', align: 'center',
      stroke: '#241634', strokeThickness: 4, wordWrap: { width: 240 }
    });

    this.statusText = this.add.text(28, 500, '', { fontFamily: 'monospace', fontSize: '17px', color: '#f8f0d8', stroke: '#241634', strokeThickness: 3 });
    this.syncFromState(state, totalAttack(), totalDefense());
  }

  drawScenery(zone) {
    const p = zone.palette;
    this.backdrop.clear();
    this.midground.clear();
    this.foreground.clear();
    this.decor.removeAll(true);

    this.backdrop.fillGradientStyle(colorNumber(p.sky), colorNumber(p.sky), 0x120d1d, 0x120d1d, 1);
    this.backdrop.fillRect(0, 0, 720, 540);
    this.backdrop.fillStyle(0xffffff, 0.07);
    for (let i = 0; i < 38; i++) this.backdrop.fillCircle((i * 83) % 720, 24 + ((i * 47) % 210), 1 + (i % 3));
    this.backdrop.fillStyle(colorNumber(p.accent), 0.82).fillCircle(618, 82, 32);
    this.backdrop.fillStyle(0xffffff, 0.16).fillCircle(608, 72, 11);

    const hillA = colorNumber(p.path);
    const hillB = colorNumber(p.ground);
    this.midground.fillStyle(hillA, 0.76).fillEllipse(250, 390, 560, 150);
    this.midground.fillStyle(hillB, 0.92).fillEllipse(500, 410, 640, 160);
    this.midground.fillStyle(colorNumber(p.ground), 1).fillRect(0, 390, 720, 150);
    this.foreground.fillStyle(colorNumber(p.path), 0.72).fillEllipse(360, 472, 780, 145);
    this.foreground.fillStyle(0x000000, 0.12).fillEllipse(360, 505, 620, 48);

    if (zone.id === 'backyard') this.drawBackyardProps(p);
    else if (zone.id === 'mall') this.drawMallProps(p);
    else this.drawOfficeProps(p);
  }

  addProp(g) { this.decor.add(g); return g; }

  drawBackyardProps(p) {
    for (const [x, h] of [[72, 80], [126, 58], [654, 70]]) {
      const g = this.add.graphics();
      g.fillStyle(0x5a3924, 1).fillRoundedRect(x - 7, 332 - h, 14, h, 7);
      g.fillStyle(colorNumber(p.accent), 0.9).fillEllipse(x, 318 - h, 70, 52);
      g.fillStyle(0xb8f08b, 0.45).fillEllipse(x - 18, 306 - h, 38, 24);
      this.addProp(g);
    }
    for (let i = 0; i < 12; i++) {
      const g = this.add.graphics();
      const x = 35 + i * 58;
      g.lineStyle(3, 0x93d66c, 0.8).beginPath().moveTo(x, 424).lineTo(x + 7, 398 - (i % 4) * 5).strokePath();
      this.addProp(g);
    }
  }

  drawMallProps(p) {
    for (const [x, y, label] of [[86, 295, 'TOKENS'], [635, 286, 'PRIZES']]) {
      const g = this.add.graphics();
      g.fillStyle(0x231a3f, 0.95).fillRoundedRect(x - 50, y - 68, 100, 120, 14);
      g.lineStyle(3, colorNumber(p.accent), 0.9).strokeRoundedRect(x - 50, y - 68, 100, 120, 14);
      g.fillStyle(colorNumber(p.enemy), 0.5).fillRoundedRect(x - 34, y - 35, 68, 46, 8);
      this.addProp(g);
      this.decor.add(this.add.text(x - 34, y - 58, label, { fontFamily: 'monospace', fontSize: '11px', color: '#ffefb0' }));
    }
    const carpet = this.add.graphics();
    for (let i = 0; i < 9; i++) carpet.fillStyle(i % 2 ? 0xffcc5c : 0x77b7ff, 0.25).fillCircle(145 + i * 55, 436 + (i % 3) * 11, 8);
    this.addProp(carpet);
  }

  drawOfficeProps(p) {
    for (const [x, w, h] of [[82, 95, 115], [624, 110, 135]]) {
      const g = this.add.graphics();
      g.fillStyle(0x2d3442, 0.95).fillRoundedRect(x - w / 2, 258, w, h, 8);
      g.lineStyle(2, colorNumber(p.accent), 0.45).strokeRoundedRect(x - w / 2, 258, w, h, 8);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) g.fillStyle(0xb7dcff, 0.18 + ((r + c) % 2) * 0.18).fillRect(x - w / 2 + 14 + c * 34, 272 + r * 24, 20, 14);
      this.addProp(g);
    }
    const fog = this.add.graphics();
    fog.fillStyle(0xb7dcff, 0.08).fillEllipse(355, 354, 400, 46);
    this.addProp(fog);
  }

  rebuildHeroBody() {
    this.heroBody.removeAll(true);
    const g = this.add.graphics();
    g.fillStyle(0x2b1d32, 0.35).fillEllipse(0, 10, 82, 108);
    g.lineStyle(8, 0x432857, 1).beginPath().moveTo(-28, -10).curveTo(-64, 0, -58, 42, -24, 36).strokePath();
    g.lineStyle(8, 0x432857, 1).beginPath().moveTo(30, -12).curveTo(64, 0, 62, 34, 28, 34).strokePath();
    g.lineStyle(9, 0x34213d, 1).beginPath().moveTo(-17, 34).lineTo(-28, 70).strokePath();
    g.lineStyle(9, 0x34213d, 1).beginPath().moveTo(17, 34).lineTo(24, 70).strokePath();
    g.fillStyle(0x2d1834, 1).fillEllipse(-30, 72, 28, 12).fillEllipse(26, 72, 28, 12);
    g.fillStyle(0xffd29d, 1).fillEllipse(0, -54, 48, 54);
    g.fillStyle(0x2d1834, 1).fillEllipse(-8, -74, 45, 22).fillEllipse(10, -78, 36, 18);
    g.fillStyle(0x241634, 1).fillCircle(-10, -56, 3).fillCircle(10, -56, 3);
    g.lineStyle(2, 0x9b5f62, 1).beginPath().moveTo(-8, -42).quadraticCurveTo(0, -36, 9, -42).strokePath();
    this.heroBody.add(g);
  }

  rebuildWeaponArt(weapon) {
    this.weaponArt.removeAll(true);
    const tierColor = colorNumber(TIERS[weapon.tier].color);
    const stroke = 0x241634;
    const art = weapon.art || 'bat';
    const g = this.add.graphics();
    g.fillStyle(tierColor, weapon.tier === 'common' ? 0.16 : 0.28).fillCircle(12, 8, 32);
    g.lineStyle(3, stroke, 1);

    const handle = () => g.lineStyle(6, 0x5b3a27, 1).beginPath().moveTo(-8, 18).lineTo(18, 4).strokePath();
    if (art === 'yo-yo') {
      g.lineStyle(3, 0xffefb0, 1).beginPath().moveTo(-8, 10).bezierCurveTo(8, -20, 38, -2, 44, 22).strokePath();
      g.fillStyle(tierColor, 1).fillCircle(48, 26, 15); g.lineStyle(3, stroke).strokeCircle(48, 26, 15); g.fillStyle(0xffefb0, 0.55).fillCircle(43, 20, 4);
    } else if (art === 'pan') {
      handle(); g.fillStyle(0x5d6173, 1).fillEllipse(44, -5, 44, 34); g.lineStyle(4, stroke).strokeEllipse(44, -5, 44, 34); g.fillStyle(tierColor, 0.45).fillEllipse(38, -11, 20, 10);
    } else if (art === 'rake') {
      g.lineStyle(6, 0x8b5e34, 1).beginPath().moveTo(-10, 16).lineTo(58, -18).strokePath();
      g.lineStyle(3, tierColor, 1); for (let i = 0; i < 5; i++) g.beginPath().moveTo(48 + i * 6, -32).lineTo(42 + i * 6, -8).strokePath();
    } else if (art === 'chicken') {
      handle(); g.fillStyle(tierColor, 1).fillEllipse(42, -4, 58, 26); g.lineStyle(3, stroke).strokeEllipse(42, -4, 58, 26); g.fillStyle(0xffd29d, 1).fillCircle(72, -11, 10); g.fillStyle(0xffcc5c, 1).fillTriangle(80, -12, 93, -8, 80, -4);
    } else if (art === 'sword') {
      g.fillStyle(tierColor, 1).fillTriangle(2, 8, 78, -24, 26, 30); g.lineStyle(3, stroke).strokeTriangle(2, 8, 78, -24, 26, 30); g.fillStyle(0xffcc5c, 1).fillRoundedRect(-9, 11, 28, 8, 4);
    } else if (art === 'rocket') {
      g.fillStyle(tierColor, 1).fillRoundedRect(8, -16, 54, 26, 14); g.lineStyle(3, stroke).strokeRoundedRect(8, -16, 54, 26, 14); g.fillStyle(0xff6b7a, 1).fillTriangle(60, -16, 86, -3, 60, 10); g.fillStyle(0xffcc5c, 1).fillTriangle(5, -11, -20, 3, 5, 10);
    } else if (art === 'stool' || art === 'chair') {
      g.fillStyle(tierColor, 1).fillEllipse(36, -16, 58, 20); g.lineStyle(3, stroke).strokeEllipse(36, -16, 58, 20); g.lineStyle(5, 0x5d6173).beginPath().moveTo(18, -5).lineTo(5, 35).moveTo(48, -5).lineTo(62, 35).strokePath();
    } else if (art === 'straw' || art === 'laser') {
      g.lineStyle(8, tierColor, 1).beginPath().moveTo(-5, 10).quadraticCurveTo(28, -22, 76, -2).strokePath(); g.fillStyle(0xff6b7a, 1).fillCircle(80, -2, 8);
    } else if (art === 'keyboard') {
      g.fillStyle(tierColor, 1).fillRoundedRect(8, -18, 76, 30, 7); g.lineStyle(3, stroke).strokeRoundedRect(8, -18, 76, 30, 7); for (let i = 0; i < 10; i++) g.fillStyle(0xffefb0, 0.8).fillRoundedRect(17 + (i % 5) * 12, -11 + Math.floor(i / 5) * 12, 8, 6, 2);
    } else if (art === 'mug') {
      g.fillStyle(tierColor, 1).fillRoundedRect(24, -20, 38, 38, 9); g.lineStyle(3, stroke).strokeRoundedRect(24, -20, 38, 38, 9); g.strokeCircle(66, -1, 12); g.fillStyle(0xffffff, 0.35).fillEllipse(34, -11, 12, 7);
    } else if (art === 'case') {
      g.fillStyle(tierColor, 1).fillRoundedRect(14, -22, 62, 42, 7); g.lineStyle(3, stroke).strokeRoundedRect(14, -22, 62, 42, 7); g.fillStyle(0x5d6173, 1).fillRoundedRect(34, -34, 22, 10, 4);
    } else {
      g.fillStyle(tierColor, 1).fillRoundedRect(8, -8, 78, 18, 9); g.lineStyle(3, stroke).strokeRoundedRect(8, -8, 78, 18, 9); g.fillStyle(0xffefb0, 0.28).fillRoundedRect(30, -15, 32, 6, 3);
    }
    this.weaponArt.add(g);
  }

  rebuildArmorArt(armor) {
    this.armorArt.removeAll(true);
    const tierColor = colorNumber(TIERS[armor.tier].color);
    const stroke = 0x241634;
    const art = armor.art || 'hoodie';
    const g = this.add.graphics();
    g.fillStyle(tierColor, 0.12).fillEllipse(0, 3, 82, 104);
    g.fillStyle(tierColor, 0.82).fillRoundedRect(-28, -18, 56, 68, 18);
    g.lineStyle(4, stroke, 1).strokeRoundedRect(-28, -18, 56, 68, 18);
    g.lineStyle(3, 0xffefb0, 0.45).beginPath().moveTo(-16, -4).quadraticCurveTo(0, 8, 16, -4).strokePath();
    if (art === 'helmet') { g.fillStyle(tierColor, 1).fillEllipse(0, -58, 58, 30); g.lineStyle(4, stroke).strokeEllipse(0, -58, 58, 30); }
    else if (art === 'box' || art === 'plate' || art === 'badge') { g.fillStyle(0xffefb0, 0.28).fillRoundedRect(-20, -8, 40, 42, 8); }
    else if (art === 'tie') { g.fillStyle(0xff6b7a, 0.9).fillTriangle(0, -12, -10, 12, 10, 12).fillTriangle(0, 44, -11, 12, 11, 12); }
    else if (art === 'mail') { for (let y = -4; y <= 34; y += 12) for (let x = -18; x <= 18; x += 12) g.lineStyle(2, 0xffefb0, 0.55).strokeCircle(x, y, 5); }
    else if (art === 'jacket' || art === 'vest') { g.lineStyle(5, 0xffefb0, 0.55).beginPath().moveTo(-25, -8).lineTo(0, 24).lineTo(25, -8).strokePath(); }
    this.armorArt.add(g);
  }

  rebuildEnemyArt(enemy, zone) {
    this.enemyArt.removeAll(true);
    const c = colorNumber(zone.palette.enemy);
    const accent = colorNumber(zone.palette.accent);
    const stroke = 0x241634;
    const g = this.add.graphics();
    const name = enemy.name || '';
    g.fillStyle(c, 1);
    if (name.includes('Printer')) {
      g.fillRoundedRect(-52, -42, 104, 78, 16); g.lineStyle(4, stroke).strokeRoundedRect(-52, -42, 104, 78, 16); g.fillStyle(0xffefb0, 0.8).fillRoundedRect(-32, -62, 64, 26, 6).fillRoundedRect(-36, 10, 72, 28, 5); g.fillStyle(stroke, 1).fillCircle(-17, -16, 4).fillCircle(17, -16, 4);
    } else if (name.includes('Claw')) {
      g.fillEllipse(0, 6, 88, 82); g.lineStyle(4, stroke).strokeEllipse(0, 6, 88, 82); g.lineStyle(8, accent).beginPath().moveTo(-22, -38).quadraticCurveTo(-52, -72, -68, -30).moveTo(22, -38).quadraticCurveTo(52, -72, 68, -30).strokePath(); g.fillStyle(0xffefb0, 1).fillCircle(-15, -6, 8).fillCircle(15, -6, 8);
    } else if (name.includes('Trash')) {
      g.fillEllipse(0, 2, 96, 92); g.fillStyle(0x000000, 0.12).fillEllipse(-16, -10, 46, 34); g.lineStyle(4, stroke).strokeEllipse(0, 2, 96, 92); g.fillStyle(0xffefb0, 1).fillCircle(-14, -8, 7).fillCircle(18, -6, 7); g.fillStyle(stroke, 1).fillTriangle(-10, 20, 12, 17, 2, 30);
    } else if (name.includes('Wraith') || name.includes('Ooze') || name.includes('Elemental')) {
      g.fillEllipse(0, -4, 88, 74); g.fillTriangle(-43, 12, -20, 62, 0, 20); g.fillTriangle(0, 18, 18, 66, 36, 18); g.lineStyle(4, stroke).strokeEllipse(0, -4, 88, 74); g.fillStyle(0xffefb0, 1).fillCircle(-16, -12, 6).fillCircle(16, -12, 6);
    } else {
      g.fillEllipse(0, 0, 90, 78); g.fillCircle(-35, -14, 22); g.fillCircle(34, -10, 18); g.lineStyle(4, stroke).strokeEllipse(0, 0, 90, 78); g.fillStyle(0xffefb0, 1).fillCircle(-16, -10, 8).fillCircle(17, -9, 8); g.fillStyle(stroke, 1).fillCircle(-14, -10, 3).fillCircle(19, -9, 3); g.lineStyle(3, stroke).beginPath().moveTo(-14, 18).quadraticCurveTo(2, 28, 20, 16).strokePath();
    }
    g.fillStyle(accent, 0.32).fillCircle(-28, -26, 9).fillCircle(34, 18, 7);
    this.enemyArt.add(g);
  }

  playAttackAnimation(damage) {
    if (!this.hero || !this.enemy) return;
    this.tweens.killTweensOf([this.hero, this.weaponArt, this.enemy]);
    this.tweens.add({ targets: this.hero, x: 232, duration: 135, yoyo: true, ease: 'Sine.easeOut' });
    this.tweens.add({ targets: this.weaponArt, angle: -48, scale: 1.3, duration: 110, yoyo: true, ease: 'Back.easeOut' });
    this.tweens.add({ targets: this.enemy, x: 565, angle: 4, duration: 70, yoyo: true, repeat: 1 });
    const slash = this.add.graphics();
    slash.lineStyle(7, colorNumber(TIERS[equippedWeapon().tier].color), 0.75).beginPath().moveTo(454, 258).quadraticCurveTo(515, 210, 594, 296).strokePath();
    this.tweens.add({ targets: slash, alpha: 0, scale: 1.18, duration: 220, onComplete: () => slash.destroy() });
    const hit = this.add.text(this.enemy.x - 12, this.enemy.y - 92, `-${damage}`, { fontFamily: 'Georgia, serif', fontSize: '26px', color: '#ffefb0', stroke: '#241634', strokeThickness: 5 });
    this.tweens.add({ targets: hit, y: hit.y - 38, alpha: 0, duration: 560, onComplete: () => hit.destroy() });
  }

  playEnemyHit(damage) {
    if (!this.hero) return;
    this.tweens.add({ targets: this.hero, x: 162, angle: -2, duration: 75, yoyo: true, repeat: 1 });
    const hit = this.add.text(this.hero.x - 28, this.hero.y - 130, `-${damage}`, { fontFamily: 'Georgia, serif', fontSize: '19px', color: '#ff6b7a', stroke: '#241634', strokeThickness: 4 });
    this.tweens.add({ targets: hit, y: hit.y - 26, alpha: 0, duration: 480, onComplete: () => hit.destroy() });
  }

  syncFromState(gameState, attack, defense) {
    if (!this.zoneText) return;
    const zone = currentZone();
    const weapon = equippedWeapon();
    const armor = equippedArmor();
    const tierColor = colorNumber(TIERS[weapon.tier].color);
    const enemy = gameState.currentEnemy || { name: 'No enemy', hp: 1 };
    if (this.lastZoneId !== zone.id) { this.drawScenery(zone); this.lastZoneId = zone.id; }
    this.enemyGlow.fillColor = colorNumber(zone.palette.enemy);
    this.tierGlow.fillColor = tierColor;
    this.tierGlow.setAlpha(weapon.tier === 'common' ? 0.12 : weapon.tier === 'unusual' ? 0.2 : weapon.tier === 'rare' ? 0.3 : 0.42);
    if (this.lastWeaponId !== weapon.id || this.lastWeaponLevel !== weapon.level) {
      this.rebuildWeaponArt(weapon);
      this.lastWeaponId = weapon.id;
      this.lastWeaponLevel = weapon.level;
    }
    if (this.lastArmorId !== armor.id || this.lastArmorLevel !== armor.level) {
      this.rebuildArmorArt(armor);
      this.lastArmorId = armor.id;
      this.lastArmorLevel = armor.level;
    }
    if (this.lastEnemyName !== enemy.name || this.lastEnemyZone !== zone.id) {
      this.rebuildEnemyArt(enemy, zone);
      this.lastEnemyName = enemy.name;
      this.lastEnemyZone = zone.id;
    }
    this.zoneText.setText(`${zone.name} — ${zone.theme}`);
    this.enemyName.setText(enemy.name);
    this.statusText.setText(`${gameState.battleRunning ? 'AUTO-BATTLE RUNNING' : 'BATTLE PAUSED'}   HP ${gameState.hp}/${gameState.maxHp}   ATK ${attack}   DEF ${defense}   LV ${gameState.level}`);
    const danger = Math.max(0.25, gameState.enemyHp / enemy.hp);
    this.enemy.setScale(0.86 + danger * 0.28);
    this.enemy.setAlpha(gameState.battleRunning ? 1 : 0.62);
    this.hero.setAlpha(gameState.hp > 0 ? 1 : 0.45);
  }

  update(time) {
    this.hero.y = 330 + Math.sin(time / 170) * (state.battleRunning ? 4 : 2);
    this.enemy.x = 540 + Math.sin(time / 210) * (state.battleRunning ? 5 : 2);
    this.enemy.y = 320 + Math.cos(time / 260) * 2;
    this.tierGlow.setScale(1 + Math.sin(time / 260) * 0.08);
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
