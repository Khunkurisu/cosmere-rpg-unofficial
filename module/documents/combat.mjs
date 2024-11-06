export class CosmereUnofficialCombat extends Combat {
	turns;

	/**
	 * Sets all defeated combatants activation status to true (already activated),
	 * and all others to false (hasn't activated yet)
	 */
	resetActivations() {
		for (const combatant of this.turns) {
			void combatant.setFlag(
				'cosmere-rpg-unofficial',
				'activated',
				combatant.isDefeated ? true : false,
			);
		}
	}

	async startCombat() {
		this.resetActivations();
		return super.startCombat();
	}

	async nextRound() {
		this.resetActivations();
		return super.nextRound();
	}
}
