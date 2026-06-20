const SAVE_KEY = 'idle-rpg-phaser-save-v1';
const SAVE_VERSION = 2;
const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000;
const TICK_MS = 1000;
const MAX_WEAPONS = 14;

const TIERS = {
  common: { name: 'Common', color: '#cbbd9b', attackBonus: 0, dropWeight: 66, salvage: 3, upgradeGold: 10, upgradeJunk: 4 },
  unusual: { name: 'Unusual', color: '#7ee081', attackBonus: 2, dropWeight: 24, salvage: 7, upgradeGold: 16, upgradeJunk: 7 },
  rare: { name: 'Rare', color: '#77b7ff', attackBonus: 5, dropWeight: 8, salvage: 14, upgradeGold: 26, upgradeJunk: 11 },
  epic: { name: 'Epic', color: '#d98bff', attackBonus: 9, dropWeight: 2, salvage: 28, upgradeGold: 42, upgradeJunk: 18 }
};

const ZONES = [
  {
    id: 'backyard',
    name: 'Backyard of Unfair Bugs',
    theme: 'Suburban grass, rude insects, and suspicious garden junk.',
    unlockLevel: 1,
    palette: { sky: '#25345f', ground: '#2f6f5f', path: '#214c43', enemy: '#ff6b7a', accent: '#7ee081' },
    dropChance: 0.13,
    weaponPool: ['cracked-bat', 'yo-yo', 'frying-pan', 'garden-rake', 'rubber-chicken'],
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
    dropChance: 0.17,
    weaponPool: ['plastic-sword', 'bottle-rocket', 'arcade-stool', 'soda-straw', 'laser-pointer'],
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
    dropChance: 0.2,
    weaponPool: ['stapler', 'keyboard', 'rolling-chair', 'coffee-mug', 'briefcase'],
    enemies: [
      { name: 'Passive-Aggressive Printer', hp: 92, attack: 12, exp: 42, gold: 26, junk: 6 },
      { name: 'Spreadsheet Wraith', hp: 112, attack: 14, exp: 54, gold: 31, junk: 7 },
      { name: 'Meeting Ooze', hp: 138, attack: 16, exp: 68, gold: 38, junk: 8 }
    ]
  }
];

const WEAPON_BLUEPRINTS = {
  'cracked-bat': { name: 'Cracked Tee-Ball Bat', attack: 4, note: 'Reliable, if embarrassing.' },
  'yo-yo': { name: 'Yo-Yo of Mild Regret', attack: 3, note: 'Sometimes returns. Emotionally, mostly.' },
  'frying-pan': { name: 'Bent Frying Pan', attack: 5, note: 'Breakfast adjacent.' },
  'garden-rake': { name: 'Backyard Rake of Consequences', attack: 6, note: 'Step carefully.' },
  'rubber-chicken': { name: 'Squeaky Rubber Chicken', attack: 4, note: 'Morale damage counts.' },
  'plastic-sword': { name: 'Plastic Sword From The Mall', attack: 8, note: 'Technically heroic.' },
  'bottle-rocket': { name: 'Lucky Bottle Rocket', attack: 10, note: 'OSHA is looking away.' },
  'arcade-stool': { name: 'Wobbly Arcade Stool', attack: 9, note: 'Great against shins.' },
  'soda-straw': { name: 'Curly Soda Straw', attack: 7, note: 'Absurd reach.' },
  'laser-pointer': { name: 'Laser Pointer of Distraction', attack: 8, note: 'Critical against cats and managers.' },
  'stapler': { name: 'Red Stapler of Quiet Rage', attack: 13, note: 'Do not borrow.' },
  'keyboard': { name: 'Clicky Keyboard Flail', attack: 14, note: 'Deals bonus noise.' },
  'rolling-chair': { name: 'Rolling Chair Lance', attack: 15, note: 'A majestic office joust.' },
  'coffee-mug': { name: 'World’s Okayest Mug', attack: 12, note: 'Warm, bitter, dangerous.' },
  'briefcase': { name: 'Suspiciously Heavy Briefcase', attack: 16, note: 'Full of quarterly reports.' }
};

const STARTER_WEAPONS = [
  createWeapon('cracked-bat', 'common', 'starter-cracked-bat'),
  createWeapon('yo-yo', 'common', 'starter-yo-yo'),
  createWeapon('frying-pan', 'unusual', 'starter-frying-pan')
];

const state = loadGame();
let scene;

function createWeapon(blueprintId, tier = 'common', id = uniqueId(blueprintId)) {
  const blueprint = WEAPON_BLUEPRINTS[blueprintId] || WEAPON_BLUEPRINTS['cracked-bat'];
  const tierData = TIERS[tier] || TIERS.common;
  return {
    id,
    blueprintId,
    tier,
    name: blueprint.name,
    attack: blueprint.attack + tierData.attackBonus,
    level: 1,
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
    gold: 0,
    junk: 0,
    kills: 0,
    battleRunning: false,
    selectedZone: 'backyard',
    currentEnemy: null,
    enemyHp: 0,
    weapons: structuredClone(STARTER_WEAPONS),
    equippedWeaponId: 'starter-cracked-bat',
    log: ['Welcome to Menu Quest. Pick Battle when you are ready to bonk.'],
    lastSavedAt: Date.now()
  };
}

function normalizeWeapon(weapon, index) {
  const blueprintId = weapon.blueprintId || weapon.id || 'cracked-bat';
  const blueprint = WEAPON_BLUEPRINTS[blueprintId] || { name: weapon.name || 'Mystery Bonker', attack: weapon.attack || 3, note: weapon.note || 'Probably safe.' };
  const tier = weapon.tier && TIERS[weapon.tier] ? weapon.tier : 'common';
  return {
    id: weapon.id && !WEAPON_BLUEPRINTS[weapon.id] ? weapon.id : `${blueprintId}-legacy-${index}`,
    blueprintId,
    tier,
    name: weapon.name || blueprint.name,
    attack: Number.isFinite(weapon.attack) ? weapon.attack : blueprint.attack + TIERS[tier].attackBonus,
    level: Number.isFinite(weapon.level) ? weapon.level : 1,
    note: weapon.note || blueprint.note
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
    if (!merged.weapons.some(w => w.id === merged.equippedWeaponId)) merged.equippedWeaponId = merged.weapons[0].id;
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

function totalAttack() {
  return state.baseAttack + equippedWeapon().attack;
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

function maybeDropWeapon(zone, multiplier = 1) {
  if (Math.random() > zone.dropChance * multiplier) return;
  const blueprintId = zone.weaponPool[Math.floor(Math.random() * zone.weaponPool.length)];
  const tier = pickTier();
  const weapon = createWeapon(blueprintId, tier);
  const tierName = TIERS[tier].name;

  if (state.weapons.length >= MAX_WEAPONS) {
    const salvage = salvageValue(weapon);
    state.junk += salvage.junk;
    state.gold += salvage.gold;
    addLog(`Inventory full: auto-salvaged ${tierName} ${weapon.name} for +${salvage.junk} junk, +${salvage.gold} gold.`);
    return;
  }

  state.weapons.push(weapon);
  addLog(`Found weapon: ${tierName} ${weapon.name} (+${weapon.attack} attack).`);
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
  maybeDropWeapon(zone, multiplier);
  checkLevelUps();
}

function checkLevelUps() {
  let needed = expToNext();
  while (state.exp >= needed) {
    state.exp -= needed;
    state.level += 1;
    state.maxHp += 8;
    state.baseAttack += 1;
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
  if (state.enemyHp <= 0) {
    gainRewards(enemy, multiplier);
    spawnEnemy();
  } else {
    const enemyDamage = Math.max(1, enemy.attack - Math.floor(state.level / 3));
    state.hp = Math.max(0, state.hp - enemyDamage);
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

function tierBadge(weapon) {
  const tier = TIERS[weapon.tier] || TIERS.common;
  return `<span class="tier-badge" style="--tier:${tier.color}">${tier.name}</span>`;
}

function salvageValue(weapon) {
  const tier = TIERS[weapon.tier] || TIERS.common;
  return {
    junk: tier.salvage + weapon.level * 2,
    gold: Math.floor((tier.salvage + weapon.attack) / 2)
  };
}

function render() {
  const enemy = state.currentEnemy || { name: 'No enemy', hp: 1 };
  const weapon = equippedWeapon();
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
    stat('Zone theme', zone.theme)
  ].join('');

  document.querySelector('#characterStats').innerHTML = [
    stat('Level', state.level),
    stat('EXP', `${state.exp}/${expToNext()}`),
    stat('HP', hpText),
    stat('Base attack', state.baseAttack),
    stat('Kills', state.kills),
    stat('Equipped', `${TIERS[weapon.tier].name} ${weapon.name} +${weapon.attack}`)
  ].join('');

  document.querySelector('#inventoryStats').innerHTML = [
    stat('Gold', state.gold),
    stat('Junk', state.junk),
    stat('Weapon space', `${state.weapons.length}/${MAX_WEAPONS}`),
    stat('Offline cap', '8 hours')
  ].join('');

  document.querySelector('#weaponList').innerHTML = state.weapons.map(w => {
    const equipped = w.id === state.equippedWeaponId;
    const salvage = salvageValue(w);
    return `
      <div class="weapon-card ${equipped ? 'equipped' : ''}">
        <div>
          <strong>${tierBadge(w)} ${w.name} Lv.${w.level}</strong>
          <small>+${w.attack} attack · ${w.note}${equipped ? ' · equipped' : ''}</small>
          <small>Salvage value: ${salvage.junk} junk + ${salvage.gold} gold</small>
        </div>
        <div class="weapon-actions">
          <button data-equip="${w.id}" ${equipped ? 'disabled' : ''}>Equip</button>
          <button class="secondary" data-salvage="${w.id}" ${equipped ? 'disabled title="Equip another weapon first"' : ''}>Salvage</button>
        </div>
      </div>`;
  }).join('');

  const upgradeCost = currentUpgradeCost();
  document.querySelector('#craftingHint').textContent = `Cost: ${upgradeCost.gold} gold + ${upgradeCost.junk} junk. Higher-tier weapons cost more, but salvage feeds upgrades.`;
  document.querySelector('#upgradeWeapon').disabled = state.gold < upgradeCost.gold || state.junk < upgradeCost.junk;

  document.querySelector('#combatLog').innerHTML = state.log.map(item => `<li>${item}</li>`).join('');

  const zoneSelect = document.querySelector('#zoneSelect');
  const options = unlockedZones().map(z => `<option value="${z.id}" ${z.id === state.selectedZone ? 'selected' : ''}>${z.name} · Lv.${z.unlockLevel}+</option>`).join('');
  if (zoneSelect.innerHTML !== options) zoneSelect.innerHTML = options;

  if (scene) scene.syncFromState(state, totalAttack());
}

function currentUpgradeCost() {
  const weapon = equippedWeapon();
  const tier = TIERS[weapon.tier] || TIERS.common;
  return {
    gold: tier.upgradeGold * weapon.level,
    junk: tier.upgradeJunk * weapon.level
  };
}

function salvageWeapon(id) {
  const weapon = state.weapons.find(w => w.id === id);
  if (!weapon || weapon.id === state.equippedWeaponId || state.weapons.length <= 1) return;
  const value = salvageValue(weapon);
  state.gold += value.gold;
  state.junk += value.junk;
  state.weapons = state.weapons.filter(w => w.id !== id);
  addLog(`Salvaged ${TIERS[weapon.tier].name} ${weapon.name}: +${value.junk} junk, +${value.gold} gold.`);
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
    const equipId = event.target.dataset.equip;
    const salvageId = event.target.dataset.salvage;
    if (equipId) {
      state.equippedWeaponId = equipId;
      addLog(`Equipped ${TIERS[equippedWeapon().tier].name} ${equippedWeapon().name}.`);
    }
    if (salvageId) salvageWeapon(salvageId);
    saveGame();
    render();
  });

  document.querySelector('#upgradeWeapon').addEventListener('click', () => {
    const weapon = equippedWeapon();
    const cost = currentUpgradeCost();
    if (state.gold < cost.gold || state.junk < cost.junk) return;
    state.gold -= cost.gold;
    state.junk -= cost.junk;
    weapon.level += 1;
    weapon.attack += weapon.tier === 'epic' ? 4 : weapon.tier === 'rare' ? 3 : 2;
    addLog(`${TIERS[weapon.tier].name} ${weapon.name} upgraded to Lv.${weapon.level}.`);
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

class BattleScene extends Phaser.Scene {
  constructor() { super('BattleScene'); }

  create() {
    scene = this;
    this.sky = this.add.rectangle(360, 270, 720, 540, 0x171426).setOrigin(0.5);
    this.ground = this.add.rectangle(360, 405, 720, 150, 0x2f6f5f).setOrigin(0.5);
    this.path = this.add.rectangle(360, 455, 720, 80, 0x214c43).setOrigin(0.5);
    this.moon = this.add.circle(620, 80, 34, 0xffcc5c, 0.9);
    this.propA = this.add.rectangle(90, 345, 38, 82, 0x7ee081).setOrigin(0.5).setStrokeStyle(3, 0x132118);
    this.propB = this.add.rectangle(650, 360, 52, 58, 0xffcc5c).setOrigin(0.5).setStrokeStyle(3, 0x432857);
    this.add.text(28, 26, 'Menu Quest', { fontFamily: 'monospace', fontSize: '28px', color: '#ffcc5c', stroke: '#432857', strokeThickness: 4 });
    this.zoneText = this.add.text(28, 66, '', { fontFamily: 'monospace', fontSize: '16px', color: '#cbbd9b' });

    this.hero = this.add.container(180, 330);
    this.hero.add(this.add.rectangle(0, 0, 54, 72, 0x7ee081).setStrokeStyle(4, 0x132118));
    this.hero.add(this.add.circle(0, -50, 25, 0xffd29d).setStrokeStyle(4, 0x432857));
    this.hero.add(this.add.rectangle(42, -6, 52, 10, 0xffcc5c).setStrokeStyle(3, 0x432857));
    this.hero.add(this.add.text(-31, -92, 'YOU', { fontFamily: 'monospace', fontSize: '16px', color: '#f8f0d8' }));

    this.enemy = this.add.container(540, 320);
    this.enemyBody = this.add.rectangle(0, 0, 80, 70, 0xff6b7a).setStrokeStyle(4, 0x432857);
    this.enemyEyeA = this.add.circle(-18, -12, 7, 0xf8f0d8);
    this.enemyEyeB = this.add.circle(18, -12, 7, 0xf8f0d8);
    this.enemy.add([this.enemyBody, this.enemyEyeA, this.enemyEyeB]);
    this.enemyName = this.add.text(430, 218, '', { fontFamily: 'monospace', fontSize: '18px', color: '#f8f0d8', align: 'center', wordWrap: { width: 220 } });

    this.statusText = this.add.text(28, 500, '', { fontFamily: 'monospace', fontSize: '18px', color: '#f8f0d8' });
    this.syncFromState(state, totalAttack());
  }

  syncFromState(gameState, attack) {
    if (!this.zoneText) return;
    const zone = currentZone();
    const enemy = gameState.currentEnemy || { name: 'No enemy', hp: 1 };
    this.cameras.main.setBackgroundColor(zone.palette.sky);
    this.sky.fillColor = Phaser.Display.Color.HexStringToColor(zone.palette.sky).color;
    this.ground.fillColor = Phaser.Display.Color.HexStringToColor(zone.palette.ground).color;
    this.path.fillColor = Phaser.Display.Color.HexStringToColor(zone.palette.path).color;
    this.enemyBody.fillColor = Phaser.Display.Color.HexStringToColor(zone.palette.enemy).color;
    this.propA.fillColor = Phaser.Display.Color.HexStringToColor(zone.palette.accent).color;
    this.propB.fillColor = Phaser.Display.Color.HexStringToColor(zone.palette.enemy).color;
    this.zoneText.setText(`${zone.name} — ${zone.theme}`);
    this.enemyName.setText(enemy.name);
    this.statusText.setText(`${gameState.battleRunning ? 'AUTO-BATTLE RUNNING' : 'BATTLE PAUSED'}   HP ${gameState.hp}/${gameState.maxHp}   ATK ${attack}   LV ${gameState.level}`);
    const danger = Math.max(0.25, gameState.enemyHp / enemy.hp);
    this.enemy.setScale(0.85 + danger * 0.35);
    this.enemy.setAlpha(gameState.battleRunning ? 1 : 0.55);
    this.hero.setAlpha(gameState.hp > 0 ? 1 : 0.45);
  }

  update(time) {
    if (state.battleRunning) {
      this.hero.x = 180 + Math.sin(time / 140) * 5;
      this.enemy.x = 540 + Math.sin(time / 180) * 4;
      this.moon.y = 80 + Math.sin(time / 700) * 6;
    }
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
