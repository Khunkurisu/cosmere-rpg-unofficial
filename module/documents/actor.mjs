/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
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

		const attributes = systemData.attributes;

		systemData.Capacity = {
			"MaxLift": this.getCarryCapacity(),
			"MaxCarry": this.getCarryCapacity() / 2,
			"Carrying": 0
		}
	}

	getCarryCapacity() {
		switch (actorData.system.attributes.strength.value) {
			case 0: {
				return 100;
			} case 1 || 2: {
				return 200;
			} case 3 || 4: {
				return 500;
			} case 5 || 6: {
				return 1000;
			} case 7 || 8: {
				return 5000;
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
