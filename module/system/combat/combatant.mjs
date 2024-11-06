export class CosmereUnofficialCombatant extends Combatant {
	get actor() {
		return super.actor;
	}

	/**
	 * on creation, combatants turn speed is set to slow, activation status to false, and then sets the initiative, bypassing the need to roll
	 */
	_onCreate(
		data,
		options,
		userID,
	) {
		super._onCreate(data, options, userID);
		void this.setFlag('cosmere-rpg-unofficial', 'turnSpeed', 'slow');
		void this.setFlag('cosmere-rpg-unofficial', 'activated', false);
		void this.combat?.setInitiative(
			this.id,
			this.generateInitiative(this.actor.type, 'slow'),
		);
	}

	/**
	 * Utility function to generate initiative without rolling
	 * @param type The actor type so that npc's will come after player characters
	 * @param speed Whether the combatants is set to take a slow or fast turn
	 */
	generateInitiative(type, speed) {
		let initiative = this.actor.system.attributes.speed.value;
		if (type === 'Player') initiative += 500;
		if (speed === 'fast') initiative += 1000;
		return initiative;
	}

	/**
	 * Utility function to flip the combatants current turn speed between slow and fast. It then updates initiative to force an update of the combat-tracker ui
	 */
	toggleTurnSpeed() {
		const currentSpeed = this.getFlag('cosmere-rpg-unofficial', 'turnSpeed');
		const newSpeed =
			currentSpeed === 'slow' ? 'fast' : 'slow';
		void this.setFlag('cosmere-rpg-unofficial', 'turnSpeed', newSpeed);
		void this.combat?.setInitiative(
			this.id,
			this.generateInitiative(this.actor.type, newSpeed),
		);
	}
}
