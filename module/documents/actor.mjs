import * as Effects from '../system/effects.mjs';
import { validateBaseData } from '../helpers/actor-migration.mjs';
import { getByString, setByString } from "../helpers/javascript.mjs";
/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the system.
 * @extends {Actor}
 */
export class CosmereUnofficialActor extends Actor {
	/** @override */
	prepareData() {
		// Prepare data for the actor. Calling the super version of this executes
		// the following, in order: data reset (to clear active effects),
		// prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
		// prepareDerivedData().
		super.prepareData();
	}

	/** @override */
	prepareBaseData() {
		const actorData = this;
		const attributes = actorData.system.attributes;
		// Data modifications in this step occur before processing embedded
		// documents or derived data.
		this.selectedTab ??= 'actions';
		validateBaseData(this);

		attributes.strength.value = attributes.strength.base;
		attributes.speed.value = attributes.speed.base;
		attributes.intellect.value = attributes.intellect.base;
		attributes.willpower.value = attributes.willpower.base;
		attributes.awareness.value = attributes.awareness.base;
		attributes.presence.value = attributes.presence.base;
	}

	/**
	 * @override
	 * Augment the actor source data with additional dynamic data. Typically,
	 * you'll want to handle most of your calculated/derived data in this step.
	 * Data calculated in this step should generally not exist in template.json
	 * (such as ability modifiers rather than ability scores) and should be
	 * available both inside and outside of character sheets (such as if an actor
	 * is queried and has a roll executed directly from it).
	 */
	prepareDerivedData() {
		const actorData = this;
		const systemData = actorData.system;
		const flags = actorData.flags['cosmere-rpg-unofficial'] || {};

		// Make separate methods for each Actor type (character, npc, etc.) to keep
		// things organized.
		this._preparePlayerData(actorData);
		this._prepareAdversaryData(actorData);
	}

	_getValueByString(s) {
		return getByString(this, s);
	}

	_setValueByString(s, v) {
		return setByString(this, s, v);
	}

	/**
	 * Prepare Character type specific data
	 */
	_preparePlayerData(actorData) {
		if (actorData.type !== 'Player') return;

		// Make modifications to data here. For example:
		const systemData = actorData.system;
		const attributes = actorData.system.attributes;
		const items = actorData.items._source;

		this.checkItems(actorData);
		this.setDeflect(actorData);

		this.getEffectBonuses(actorData);

		systemData.capacity.maxLift = this.getCarryCapacity(attributes);
		systemData.capacity.maxCarry = systemData.capacity.maxLift / 2

		systemData.senses = this.getSensesRange(attributes);

		systemData.movement.ground = this.getMovementRate(attributes);

		systemData.recovery = this.getRecoveryDie(attributes);

		systemData.bonusExpertises = attributes.intellect.value;

		for (let index in items) {
			const obj = items[index];
			if (obj.type === "Ancestry") {
				systemData.ancestry = obj;
			} else if (obj.type === "Path") {
				systemData.path.push(obj);
			}
		}

		systemData.path.sort((a, b) => {
			let val = 0;
			val += a.system.isRadiant ? 1 : -1;
			val += b.system.isRadiant ? -1 : 1;
			return val;
		});

		systemData.isRadiant = this.isRadiant(systemData);

		this.setSkills(systemData);

		this.setDefenses(actorData);
		this.setResources(actorData);

		this.getEffectBonuses(actorData, 'derived');

		systemData.health.value = Math.min(
			Math.max(systemData.health.value, 0), systemData.health.max
		);
		systemData.focus.value = Math.min(
			Math.max(systemData.focus.value, 0), systemData.focus.max
		);
		systemData.investiture.value = Math.min(
			Math.max(systemData.investiture.value, 0), systemData.investiture.max
		);
	}

	isRadiant(systemData) {
		let isRadiant = false;
		systemData.path.every(path => {
			if (path.system.isRadiant) {
				isRadiant = true;
				return false;
			}
			return true;
		});
		return isRadiant;
	}

	isRadiantSkill(key) {
		const systemData = this.system;
		let isRadiantSkill = false;
		systemData.path.every(path => {
			if (path.system.isRadiant) {
				if (path.system.skills.indexOf(key) > -1) {
					isRadiantSkill = true;
					return false;
				}
			}
			return true;
		});
		return isRadiantSkill;
	}

	checkItems(actorData) {
		const systemData = actorData.system;

		const effects = [];
		const equipped = [];
		const stored = [];
		const containers = [];

		actorData.items.forEach(function (item) {
			if (item.type === 'Equipment' || item.type === 'Weapon' || item.type === 'Armor') {
				systemData.capacity.carrying += item.system.totalWeight;
				item.system.displayWeight = `${item.system.totalWeight ?
					Number((item.system.totalWeight).toFixed(2)) : 0} lbs`;
				if (item.system.quantity > 0 && item.system.isEquipped) {
					equipped.push(item);
				}
			}
			else if (item.type === 'Effect') {
				effects.push(item);
			} else if (item.type === 'Feature') {
				if (item.system.effects.length > 0) {
					effects.push(item);
				}
			}
			else if (item.type === 'Container') {
				containers.push(item);
			}
		});

		containers.forEach(function (container) {
			const containerItems = [];
			container.system.stored.forEach(function (id) {
				actorData.items.forEach(function (obj) {
					if (obj._id === id) {
						containerItems.push(obj);
						stored.push(obj);
						systemData.capacity.carrying -= obj.system.totalWeight;
					}
				});
			});
			container.system.items = containerItems;
			systemData.capacity.carrying += container.system.totalWeight;
			container.system.displayWeight = `${container.system.totalWeight ?
				Number((container.system.totalWeight).toFixed(2)) : 0} lbs`;
		});

		systemData.effects = effects;
		systemData.equipped = equipped;
		systemData.stored = stored;
		systemData.containers = containers;
	}

	setSkills(systemData) {
		const attributes = systemData.attributes;
		const skills = systemData.skills;
		if (systemData.path && systemData.path.length > 0) {
			const path = systemData.path[0];
			for (let c in systemData.skills) {
				const category = systemData.skills[c];
				const pathSkill = path.system.skill;
				if ((pathSkill in category)) {
					category[pathSkill].bonusRank = 1;
				}
			}
		}
		for (var category in skills) {
			for (var key in skills[category]) {
				if (category === 'surge') {
					skills[category][key].show = this.isRadiantSkill(key);
					if (skills[category][key].show) {
						systemData.hasSurges = true;
						skills[category][key].bonusRank = 1;
					}
				}
				const attribute = attributes[skills[category][key].attribute].value;
				skills[category][key].rank = skills[category][key].initialRank + skills[category][key].bonusRank;
				const rank = skills[category][key].rank;
				skills[category][key].value = rank + attribute;
			}
		}
	}

	setResources(actorData) {
		const systemData = actorData.system;
		const attributes = systemData.attributes;

		let base = 10;
		switch (this.tier) {
			case 1: {
				base += (systemData.level - 1) * 5;
				break;
			}
			case 2: {
				base += 20;
				base += (systemData.level - 5) * 4;
				break;
			}
			case 3: {
				base += 40;
				base += (systemData.level - 10) * 3;
				break;
			}
			case 4: {
				base += 55;
				base += (systemData.level - 15) * 2;
				break;
			}
		}
		systemData.health.max = base + attributes.strength.value * Math.min(this.tier, 4);
		systemData.focus.max = 2 + attributes.willpower.value;
		const investitureBonus = Math.max(attributes.presence.value, attributes.awareness.value);
		systemData.investiture.max = systemData.isRadiant ? 2 + investitureBonus : 0;
	}

	setDeflect(actorData) {
		const system = actorData.system
		const equipped = system.equipped;
		var armor;
		for (let index in equipped) {
			const obj = equipped[index];
			if (obj.type === "Armor") {
				armor = obj;
				break;
			}
		}
		system.deflect = armor !== undefined ? armor.system.deflect : 0;
	}

	setDefenses(actorData) {
		const systemData = actorData.system;
		const attributes = systemData.attributes;
		systemData.physical = 10 + attributes.strength.value + attributes.speed.value;

		systemData.cognitive = 10 + attributes.intellect.value + attributes.willpower.value;

		systemData.spiritual = 10 + attributes.awareness.value + attributes.presence.value;
	}

	getCarryCapacity(attributes) {
		switch (attributes.strength.value) {
			case 0: {
				return 100;
			} case 1: case 2: {
				return 200;
			} case 3: case 4: {
				return 500;
			} case 5: case 6: {
				return 1000;
			} case 7: case 8: {
				return 5000;
			} default: {
				return 10000;
			}
		}
	}

	getMovementRate(attributes) {
		switch (attributes.speed.value) {
			case 0: {
				return 20;
			} case 1: case 2: {
				return 25;
			} case 3: case 4: {
				return 30;
			} case 5: case 6: {
				return 40;
			} case 7: case 8: {
				return 60;
			} default: {
				return 80;
			}
		}
	}

	getRecoveryDie(attributes) {
		switch (attributes.willpower.value) {
			case 0: {
				return 4;
			} case 1: case 2: {
				return 6;
			} case 3: case 4: {
				return 8;
			} case 5: case 6: {
				return 10;
			} case 7: case 8: {
				return 12;
			} default: {
				return 20;
			}
		}
	}

	getConnectionRate(attributes) {
		switch (attributes.presence.value) {
			case 0: {
				return 365;
			} case 1: case 2: {
				return 50;
			} case 3: case 4: {
				return 5;
			} case 5: case 6: {
				return 1;
			} case 7: case 8: {
				return 1 / 24;
			} default: {
				return 0;
			}
		}
	}

	getSensesRange(attributes) {
		switch (attributes.awareness.value) {
			case 0: {
				return 5;
			} case 1: case 2: {
				return 10;
			} case 3: case 4: {
				return 20;
			} case 5: case 6: {
				return 50;
			} case 7: case 8: {
				return 100;
			} default: {
				return 10000;
			}
		}
	}

	getEffectBonuses(actorData, stage = 'base') {
		const system = actorData.system;
		system.effects.forEach(activeEffect => {
			if (!activeEffect.system.active) return;
			activeEffect.system.effects.forEach(e => {
				if (e.type === 'modifier') {
					const effect = new Effects.ModifierEffect(e.trigger, e.target, e.predicate, e.func, e.value);
					let targetVal = this._getValueByString(effect.target);
					if (targetVal || targetVal === 0) {
						let data = {
							circumstances: [],
							value: targetVal
						}
						data = effect.TryApplyEffect(stage, data);
						if (data) {
							this._setValueByString(effect.target, data.value);
						}
					}
				}
			});
		});
	}

	get tier() {
		const system = this.system;
		switch (system.level) {
			case 1: case 2: case 3: case 4: case 5: return 1;
			case 6: case 7: case 8: case 9: case 10: return 2;
			case 11: case 12: case 13: case 14: case 15: return 3;
			case 16: case 17: case 18: case 19: case 20: return 4;
			default: return 5;
		}
	}

	/**
	 * Prepare NPC type specific data.
	 */
	_prepareAdversaryData(actorData) {
		if (actorData.type !== 'Adversary') return;

		// Make modifications to data here. For example:
		const systemData = actorData.system;
		const attributes = actorData.system.attributes;
		const items = actorData.items._source;

		this.checkItems(actorData);
		this.getEffectBonuses(actorData);

		systemData.capacity = {
			"maxLift": this.getCarryCapacity(attributes),
			"maxCarry": this.getCarryCapacity(attributes) / 2,
			"carrying": 0
		}

		systemData.senses = this.getSensesRange(attributes);

		systemData.movement.ground = this.getMovementRate(attributes);

		systemData.recovery = this.getRecoveryDie(attributes);

		systemData.bonusExpertises = attributes.intellect.value;

		/* this.setDefenses(actorData);
		this.setResources(actorData);
		this.setDeflect(actorData); */

		this.setSkills(systemData);

		this.getEffectBonuses(actorData, 'derived');

		systemData.health.value = Math.min(
			Math.max(systemData.health.value, 0), systemData.health.max
		);
		systemData.focus.value = Math.min(
			Math.max(systemData.focus.value, 0), systemData.focus.max
		);
		systemData.investiture.value = Math.min(
			Math.max(systemData.investiture.value, 0), systemData.investiture.max
		);
	}

	/**
	 * Override getRollData() that's supplied to rolls.
	 */
	getRollData() {
		// Starts off by populating the roll data with a shallow copy of `this.system`
		const data = { ...this.system };

		// Prepare character roll data.
		this._getPlayerRollData(data);
		this._getAdversaryRollData(data);

		return data;
	}

	/**
	 * Prepare character roll data.
	 */
	_getPlayerRollData(data) {
		if (this.type !== 'Player') return;

		// Process additional Player data here.
	}

	/**
	 * Prepare NPC roll data.
	 */
	_getAdversaryRollData(data) {
		if (this.type !== 'Adversary') return;

		// Process additional Adversary data here.
	}
}
