const SAVE_KEY = 'idle-rpg-phaser-save-v1';
const SAVE_VERSION = 1;
const OFFLINE_CAP_MS = 8 * 60 * 60 * 1000;
const TICK_MS = 1000;

const ZONES = [
  {
    id: 'backyard',
    name: 'Backyard of Unfair Bugs',
    unlockLevel: 1,
    enemies: [
      { name: 'Suspicious Ant', hp: 14, attack: 2, exp: 4, gold: 2, junk: 1 },
      { name: 'Tiny Goblin Accountant', hp: 20, attack: 3, exp: 6, gold: 4, junk: 1 },
      { name: 'Angry Trash Bag', hp: 28, attack: 4, exp: 9, gold: 6, junk: 2 }
    ]
  },
  {
    id: 'mall',
    name: 'Abandoned Mall Arcade',
    unlockLevel: 4,
    enemies: [
      { name: 'Coin-Operated Gremlin', hp: 42, attack: 6, exp: 15, gold: 10, junk: 3 },
      { name: 'Possessed Prize Claw', hp: 54, attack: 7, exp: 19, gold: 13, junk: 3 },
      { name: 'Expired Soda Elemental', hp: 68, attack: 9, exp: 25, gold: 17, junk: 4 }
    ]
  }
];

const STARTER_WEAPONS = [
  { id: 'cracked-bat', name: 'Cracked Tee-Ball Bat', attack: 4, level: 1, note: 'Reliable, if embarrassing.' },
  { id: 'yo-yo', name: 'Yo-Yo of Mild Regret', attack: 3, level: 1, note: 'Sometimes returns. Emotionally, mostly.' },
  { id: 'frying-pan', name: 'Bent Frying Pan', attack: 5, level: 1, note: 'Breakfast adjacent.' }
];

const state = loadGame();
let scene;
let autosaveTimer;

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
    equippedWeaponId: 'cracked-bat',
    log: ['Welcome to Menu Quest. Pick Battle when you are ready to bonk.'],
    lastSavedAt: Date.now()
  };
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return freshSave();

  try {
    const loaded = JSON.parse(raw);
    const merged = { ...freshSave(), ...loaded };
    merged.weapons = Array.isArray(loaded.weapons) && loaded.weapons.length ? loaded.weapons : structuredClone(STARTER_WEAPONS);
    merged.log = Array.isArray(loaded.log) ? loaded.log.slice(0, 12) : [];
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

function gainRewards(enemy, multiplier = 1) {
  const exp = Math.floor(enemy.exp * multiplier);
  const gold = Math.floor(enemy.gold * multiplier);
  const junk = Math.max(0, Math.floor(enemy.junk * multiplier));
  state.exp += exp;
  state.gold += gold;
  state.junk += junk;
  state.kills += 1;
  addLog(`Defeated ${enemy.name}: +${exp} EXP, +${gold} gold, +${junk} junk.`);
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

function render() {
  const enemy = state.currentEnemy || { name: 'No enemy', hp: 1 };
  const weapon = equippedWeapon();
  const zone = currentZone();
  const hpText = `${state.hp}/${state.maxHp}`;
  const enemyText = `${enemy.name} (${Math.max(0, state.enemyHp)}/${enemy.hp} HP)`;

  document.querySelector('#toggleBattle').textContent = state.battleRunning ? 'Pause battle' : 'Start battle';
  document.querySelector('#battleSummary').textContent = state.battleRunning
    ? `Fighting in ${zone.name}. You can leave this screen; the battle keeps running.`
    : 'Battle is paused. Start it when you want the tiny hero farming again.';

  document.querySelector('#battleStats').innerHTML = [
    stat('Hero HP', hpText),
    stat('Enemy', enemyText),
    stat('Attack', totalAttack()),
    stat('Zone', zone.name)
  ].join('');

  document.querySelector('#characterStats').innerHTML = [
    stat('Level', state.level),
    stat('EXP', `${state.exp}/${expToNext()}`),
    stat('HP', hpText),
    stat('Base attack', state.baseAttack),
    stat('Kills', state.kills),
    stat('Equipped', `${weapon.name} +${weapon.attack}`)
  ].join('');

  document.querySelector('#inventoryStats').innerHTML = [
    stat('Gold', state.gold),
    stat('Junk', state.junk),
    stat('Weapons owned', state.weapons.length),
    stat('Offline cap', '8 hours')
  ].join('');

  document.querySelector('#weaponList').innerHTML = state.weapons.map(w => `
    <div class="weapon-card">
      <div><strong>${w.name} Lv.${w.level}</strong><small>+${w.attack} attack · ${w.note}${w.id === state.equippedWeaponId ? ' · equipped' : ''}</small></div>
      <button data-equip="${w.id}" ${w.id === state.equippedWeaponId ? 'disabled' : ''}>Equip</button>
    </div>`).join('');

  const upgradeCost = currentUpgradeCost();
  document.querySelector('#craftingHint').textContent = `Cost: ${upgradeCost.gold} gold + ${upgradeCost.junk} junk. Equipped: ${weapon.name}.`;
  document.querySelector('#upgradeWeapon').disabled = state.gold < upgradeCost.gold || state.junk < upgradeCost.junk;

  document.querySelector('#combatLog').innerHTML = state.log.map(item => `<li>${item}</li>`).join('');

  const zoneSelect = document.querySelector('#zoneSelect');
  const options = unlockedZones().map(z => `<option value="${z.id}" ${z.id === state.selectedZone ? 'selected' : ''}>${z.name}</option>`).join('');
  if (zoneSelect.innerHTML !== options) zoneSelect.innerHTML = options;

  if (scene) scene.syncFromState(state, totalAttack());
}

function currentUpgradeCost() {
  const weapon = equippedWeapon();
  return { gold: 12 * weapon.level, junk: 4 * weapon.level };
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
    const id = event.target.dataset.equip;
    if (!id) return;
    state.equippedWeaponId = id;
    addLog(`Equipped ${equippedWeapon().name}.`);
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
    weapon.attack += 2;
    addLog(`${weapon.name} upgraded to Lv.${weapon.level}. It looks slightly more threatening.`);
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
    this.cameras.main.setBackgroundColor('#171426');
    this.add.rectangle(360, 405, 720, 150, 0x2f6f5f).setOrigin(0.5);
    this.add.rectangle(360, 455, 720, 80, 0x214c43).setOrigin(0.5);
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
    const enemy = gameState.currentEnemy || { name: 'No enemy', hp: 1 };
    this.zoneText.setText(currentZone().name);
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
autosaveTimer = setInterval(() => {
  battleTick();
  saveGame();
  render();
}, TICK_MS);
