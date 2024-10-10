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
		// Data modifications in this step occur before processing embedded
		// documents or derived data.
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
		const flags = actorData.flags.boilerplate || {};

		// Make separate methods for each Actor type (character, npc, etc.) to keep
		// things organized.
		this._preparePlayerData(actorData);
		this._prepareAdversaryData(actorData);
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

		systemData.capacity = {
			"maxLift": this.getCarryCapacity(attributes),
			"maxCarry": this.getCarryCapacity(attributes) / 2,
			"carrying": 0
		}

		systemData.senses = this.getSensesRange(attributes);

		systemData.movement.ground = this.getMovementRate(attributes);

		systemData.recovery = this.getRecoveryDie(attributes)

		systemData.bonusExpertises = attributes.intellect.value;

		this.checkItems(actorData);


		for (let index in items) {
			const obj = items[index];
			if (obj.type === "Ancestry") {
				systemData.ancestry = obj;
			} else if (obj.type === "Path") {
				systemData.path = obj;
			}
		}

		this.setDefenses(systemData);
		this.setResources(systemData);
		this.setDeflect(actorData);

		this.setSkills(systemData);
	}

	isRadiant(systemData) { return false; }

	checkItems(actorData) {
		const systemData = actorData.system;

		const activeEffects = [];
		const equipped = [];
		const stored = [];
		const containers = [];

		actorData.items.forEach(function (item) {
			if (item.type === 'Equipment' || item.type === 'Weapon' || item.type === 'Armor') {
				systemData.capacity.carrying += item.system.totalWeight;
				item.system.displayWeight = `${item.system.totalWeight} lbs`;
				if (item.system.quantity > 0 && item.system.isEquipped) {
					equipped.push(item);
				}
			}
			else if (item.type === 'Effect') {
				if (item.system.status !== "disabled") {
					activeEffects.push(item);
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
			container.system.displayWeight = `${container.system.totalWeight} lbs`;
		});

		systemData.activeEffects = activeEffects;
		systemData.equipped = equipped;
		systemData.stored = stored;
		systemData.containers = containers;
	}

	setSkills(systemData) {
		const attributes = systemData.attributes;
		const skills = systemData.skills;
		for (var category in skills) {
			for (var key in skills[category]) {
				const attribute = attributes[skills[category][key].attribute].value;
				const bonus = skills[category][key].bonus;
				skills[category][key].value = bonus + attribute;
			}
		}
	}

	setResources(systemData) {
		const attributes = systemData.attributes;

		systemData.health.max = 10 + attributes.strength.value + this.getHealthBonuses(systemData);
		systemData.focus.max = 2 + attributes.willpower.value + this.getFocusBonuses(systemData);
		const investitureBonus = Math.max(attributes.presense.value, attributes.awareness.value);
		systemData.investiture.max = this.isRadiant(systemData) ? 2 + investitureBonus + this.getInvestitureBonuses() : 0;
	}

	getHealthBonuses(systemData) {
		return 0;
	}

	getFocusBonuses(systemData) {
		return 0;
	}

	getInvestitureBonuses(systemData) {
		return 0;
	}

	getPhysicalDefenseBonuses(systemData) {
		return 0;
	}

	getCognitiveDefenseBonuses(systemData) {
		return 0;
	}

	getSpiritualDefenseBonuses(systemData) {
		return 0;
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

	setDefenses(systemData) {
		const attributes = systemData.attributes;
		systemData.physical = 10 + attributes.strength.value + attributes.speed.value;
		systemData.physical += this.getPhysicalDefenseBonuses(systemData);

		systemData.cognitive = 10 + attributes.intellect.value + attributes.willpower.value;
		systemData.cognitive += this.getCognitiveDefenseBonuses(systemData);

		systemData.spiritual = 10 + attributes.awareness.value + attributes.presence.value;
		systemData.spiritual += this.getSpiritualDefenseBonuses(systemData);
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

	/**
	 * Prepare NPC type specific data.
	 */
	_prepareAdversaryData(actorData) {
		if (actorData.type !== 'Adversary') return;

		// Make modifications to data here. For example:
		const systemData = actorData.system;
		const attributes = actorData.system.attributes;
		const items = actorData.items._source;

		systemData.capacity = {
			"maxLift": this.getCarryCapacity(attributes),
			"maxCarry": this.getCarryCapacity(attributes) / 2,
			"carrying": 0
		}

		systemData.senses = this.getSensesRange(attributes);

		systemData.movement.ground.value = this.getMovementRate(attributes);

		systemData.recovery = this.getRecoveryDie(attributes)

		systemData.bonusExpertises = attributes.intellect.value;

		this.checkItems(actorData);

		this.setDefenses(systemData);
		this.setResources(systemData);
		this.setDeflect(actorData);

		this.setSkills(systemData);
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
