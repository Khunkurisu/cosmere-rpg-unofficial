/**
 * Overrides default tracker template to implement slow/fast buckets and combatant activation button.
 */
export class CosmereUnofficialCombatTracker extends CombatTracker {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ['cosmere-rpg-unofficial', ...super.defaultOptions.classes],
		});
	}

	get template() {
		return 'systems/cosmere-rpg-unofficial/templates/combat/combat-tracker.hbs';
	}

	/**
	 *  modifies data being sent to the combat tracker template to add turn speed, type and activation status and splitting turns between the initiative phases.
	 */
	async getData(options) {
		const data = (await super.getData(options));
		//add combatant type, speed, and activation status to existing turn data.
		data.turns = data.turns.map((turn) => {
			const combatant =
				this.viewed.getEmbeddedDocument(
					'Combatant',
					turn.id,
					{},
				);
			const newTurn = {
				...turn,
				turnSpeed: combatant.getFlag(
					'cosmere-rpg-unofficial',
					'turnSpeed',
				),
				type: combatant.actor.type,
				activated: combatant.getFlag('cosmere-rpg-unofficial', 'activated'),
			};
			//strips active player formatting
			newTurn.css = '';
			return newTurn;
		});

		//split turn data into individual turn "buckets" to separate them in the combat tracker ui
		data.fastPlayers = data.turns.filter((turn) => {
			return (
				turn.type === 'Player' &&
				turn.turnSpeed === 'fast'
			);
		});
		data.fastPlayers.sort((turnA, turnB) => {
			let val = 0;
			val += turnA.activated ? 1 : -1;
			val += turnB.activated ? -1 : 1;
			return val;
		});

		data.slowPlayers = data.turns.filter((turn) => {
			return (
				turn.type === 'Player' &&
				turn.turnSpeed === 'slow'
			);
		});
		data.slowPlayers.sort((turnA, turnB) => {
			let val = 0;
			val += turnA.activated ? 1 : -1;
			val += turnB.activated ? -1 : 1;
			return val;
		});

		data.fastNPC = data.turns.filter((turn) => {
			return (
				turn.type === 'Adversary' &&
				turn.turnSpeed === 'fast'
			);
		});
		data.fastNPC.sort((turnA, turnB) => {
			let val = 0;
			val += turnA.activated ? 1 : -1;
			val += turnB.activated ? -1 : 1;
			return val;
		});

		data.slowNPC = data.turns.filter((turn) => {
			return (
				turn.type === 'Adversary' &&
				turn.turnSpeed === 'slow'
			);
		});
		data.slowNPC.sort((turnA, turnB) => {
			let val = 0;
			val += turnA.activated ? 1 : -1;
			val += turnB.activated ? -1 : 1;
			return val;
		});

		return data;
	}

	/**
	 * add listeners to toggleTurnSpeed and activation buttons
	 */
	activateListeners(html) {
		super.activateListeners(html);
		html.find(`[data-control='toggleSpeed']`).on(
			'click',
			this._onClickToggleTurnSpeed.bind(this),
		);
		html.find(`[data-control='activateCombatant']`).on(
			'click',
			this._onActivateCombatant.bind(this),
		);
	}

	/**
	 * toggles combatant turn speed on clicking the "fast/slow" button on the combat tracker window
	 * */
	_onClickToggleTurnSpeed(event) {
		event.preventDefault();
		event.stopPropagation();
		const btn = event.currentTarget;
		const li = $(btn).parents('.combatant');
		const combatant = this.viewed.getEmbeddedDocument(
			'Combatant',
			li.data('combatantId'),
			{},
		);
		void combatant.toggleTurnSpeed();
	}

	/**
	 *  activates the combatant when clicking the activation button
	 */
	_onActivateCombatant(event) {
		event.preventDefault();
		event.stopPropagation();
		const btn = event.currentTarget;
		const li = $(btn).parents('.combatant');
		const combatant = this.viewed.getEmbeddedDocument(
			'Combatant',
			li.data('combatantId'),
			{},
		);
		void combatant.setFlag('cosmere-rpg-unofficial', 'activated', true);
	}

	/**
	 * toggles combatant turn speed on clicking the "fast/slow" option in the turn tracker context menu
	 */
	_onContextToggleTurnSpeed(li) {
		const combatant = this.viewed.getEmbeddedDocument(
			'Combatant',
			li.data('combatant-id'),
			{},
		);
		combatant.toggleTurnSpeed();
	}

	/**
	 * resets combatants activation status to hasn't activated
	 */
	_onContextResetActivation(li) {
		const combatant = this.viewed.getEmbeddedDocument(
			'Combatant',
			li.data('combatant-id'),
			{},
		);
		void combatant.setFlag('cosmere-rpg-unofficial', 'activated', false);
	}

	/**
	 * Overwrites combatants context menu options, adding toggle turn speed and reset activation options. Removes initiative rolling options from base implementation.
	 */
	_getEntryContextOptions() {
		const menu = [
			{
				name: 'COSMERE_UNOFFICIAL.Combat.ToggleTurn',
				icon: '',
				callback: this._onContextToggleTurnSpeed.bind(this),
			},
			{
				name: 'COSMERE_UNOFFICIAL.Combat.ResetActivation',
				icon: '<i class="fas fa-undo"></i>',
				callback: this._onContextResetActivation.bind(this),
			},
		];
		//pushes existing context menu options, filtering out the initiative reroll and initiative clear options
		menu.push(
			...super
				._getEntryContextOptions()
				.filter(
					(i) =>
						i.name !== 'COMBAT.CombatantReroll' &&
						i.name !== 'COMBAT.CombatantClear',
				),
		);
		return menu;
	}
}
