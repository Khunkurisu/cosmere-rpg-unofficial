import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class CosmereUnofficialItemSheet extends ItemSheet {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ['cosmere-rpg-unofficial', 'sheet', 'item'],
			width: 520,
			height: 480,
			tabs: [
				{
					navSelector: '.sheet-tabs',
					contentSelector: '.sheet-body',
					initial: 'description',
				},
			],
		});
	}

	/** @override */
	get template() {
		const path = 'systems/cosmere-rpg-unofficial/templates/item';
		// Return a single sheet for all item types.
		// return `${path}/item-sheet.hbs`;

		// Alternatively, you could use the following return statement to do a
		// unique item sheet by type, like `weapon-sheet.hbs`.
		return `${path}/item-${this.item.type.toLowerCase()}-sheet.hbs`;
	}

	/* -------------------------------------------- */

	/** @override */
	async getData() {
		// Retrieve base data structure.
		const context = super.getData();

		// Use a safe clone of the item data for further operations.
		const itemData = this.document.toObject(false);

		// Enrich description info for display
		// Enrichment turns text like `[[/r 1d20]]` into buttons
		context.enrichedDescription = await TextEditor.enrichHTML(
			this.item.system.description,
			{
				// Whether to show secret blocks in the finished html
				secrets: this.document.isOwner,
				// Necessary in v11, can be removed in v12
				async: true,
				// Data to fill in for inline rolls
				rollData: this.item.getRollData(),
				// Relative UUID resolution
				relativeTo: this.item,
			}
		);

		// Add the item's data to context.data for easier access, as well as flags.
		context.system = itemData.system;
		context.flags = itemData.flags;

		// Adding a pointer to CONFIG.COSMERE_UNOFFICIAL
		context.config = CONFIG.COSMERE_UNOFFICIAL;

		// Prepare active effects for easier access
		context.effects = prepareActiveEffectCategories(this.item.effects);

		return context;
	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Roll handlers, click handlers, etc. would go here.

		// Active Effect management
		html.on('click', '.effect-control', (ev) =>
			onManageActiveEffect(ev, this.item)
		);

		// Select Damage Type
		html.on('change', '.weapon-damage-select', this._onDamageSelect.bind(this));

		// Select Damage Die
		html.on('change', '.weapon-die-select', this._onDieSelect.bind(this));

		// Select Skill Modifier
		html.on('change', '.weapon-skill-select', this._onSkillSelect.bind(this));

		// Select Range Modifier
		html.on('change', '.weapon-range-select', this._onRangeSelect.bind(this));
	}

	/**
	 * Handle selecting damage type.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onDamageSelect(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const system = this.item.system;

		system.damage.type = element.value;

		this.render(false);
	}

	/**
	 * Handle selecting damage die.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onDieSelect(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const system = this.item.system;

		system.damage.die = element.value;

		this.render(false);
	}

	/**
	 * Handle selecting skill.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onSkillSelect(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const system = this.item.system;

		system.skill = element.value;

		this.render(false);
	}

	/**
	 * Handle selecting range.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onRangeSelect(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const system = this.item.system;

		system.range.type = element.value;

		this.render(false);
	}
}
