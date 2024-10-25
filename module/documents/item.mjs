/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class CosmereUnofficialItem extends Item {
	/**
	 * Augment the basic Item data model with additional dynamic data.
	 */
	prepareData() {
		// As with the actor class, items are documents that can have their data
		// preparation methods overridden (such as prepareBaseData()).
		super.prepareData();
	}

	/** @override */
	prepareBaseData() {
		// Data modifications in this step occur before processing embedded
		// documents or derived data.
		this.system.ver = currentVersion;
	}

	/**
	 * Prepare a data object which defines the data schema used by dice roll commands against this Item
	 * @override
	 */
	getRollData() {
		// Starts off by populating the roll data with a shallow copy of `this.system`
		const rollData = { ...this.system };

		// Quit early if there's no parent actor
		if (!this.actor) return rollData;

		// If present, add the actor's roll data
		rollData.actor = this.actor.getRollData();

		if (this.type === "Weapon") {
			const skills = rollData.actor.skills.physical;
			if (rollData.skill === "heavy") {
				rollData.modifier = skills.heavy_weapons.value;
			} else {
				rollData.modifier = skills.light_weapons.value;
			}
		}

		return rollData;
	}

	/**
	 * Handle clickable rolls.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	async roll() {
		const item = this;

		// Initialize chat data.
		const speaker = ChatMessage.getSpeaker({ actor: this.actor });
		const rollMode = game.settings.get('core', 'rollMode');
		const label = `[${item.type}] ${item.name}`;

		ChatMessage.create({
			speaker: speaker,
			rollMode: rollMode,
			flavor: label,
			content: item.system.description ?? '',
		});
	}
}
