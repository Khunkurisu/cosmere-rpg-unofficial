import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from '../helpers/effects.mjs';
import * as effects from '../system/effects.mjs';

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
		html.on('change', '.weapon-skill-select', this._onWeaponSkillSelect.bind(this));

		// Select Range Modifier
		html.on('change', '.weapon-range-select', this._onRangeSelect.bind(this));

		// Select Starting Skill
		html.on('change', '.path-skill-select', this._onPathSkillSelect.bind(this));

		// Select Path Type
		html.on('change', '.radiant-toggle-checkbox', this._onRadiantCheckboxToggle.bind(this));

		// Select Created Effect Type
		html.on('change', '.effect-create-select', this._onEffectSelect.bind(this));

		// Select Effect Function
		html.on('change', '.effect-func', this._onEffectFuncSelect.bind(this));

		// Update Effect Values
		html.on('change', '.effect-input', this._onEffectChange.bind(this));
		html.on('change', '.effect-toggle-checkbox', this._onEffectCheckboxToggle.bind(this));

		// Create/Delete Selected Effect Type
		html.on('click', '.effect-create', this._onEffectCreate.bind(this));
		html.on('click', '.effect-remove', this._onEffectRemove.bind(this));

		// Select Action Cost
		html.on('change', '.action-cost-selection', this._onActionCostSelect.bind(this));

		// Add/Remove Specialties
		html.on('click', '.specialty-create', this._onSpecialtyCreate.bind(this));
		html.on('click', '.specialty-remove', this._onSpecialtyRemove.bind(this));
	}

	/**
	 * Handle created selected effect type.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onEffectCreate(event) {
		event.preventDefault();
		const system = this.item.system;
		const type = this.item.system.effectCreateType;
		const modEffects = system.effects;
		let effect = null;

		if (type === 'modifier') {
			effect = new effects.ModifierEffect('load', '', [], 'add', 0);
		}
		if (effect) {
			modEffects.push(effect);
		}

		this.item.update({ "system.effects": modEffects });

		this.render(false);
	}

	/**
	 * Handle removing an effect.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onEffectRemove(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
		const modEffects = this.item.system.effects;

		modEffects.splice(dataset.key, 1);
		this.item.update({ "system.effects": modEffects });

		this.render(false);
	};

	/**
	 * Handle selecting effect creation type.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onEffectSelect(event) {
		event.preventDefault();
		const element = event.currentTarget;

		this.item.system.effectCreateType = element.value;

		this.render(false);
	}

	/**
	 * Handle selecting effect modifier type.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onEffectFuncSelect(event) {
		event.preventDefault();
		const li = $(event.currentTarget).parents('.item');
		const modEffects = this.item.system.effects;
		const effect = modEffects[li.data('itemId')];
		const element = event.currentTarget;

		if (effect) {
			effect.func = element.value;
			this.item.update({ "system.effects": modEffects });
		}

		this.render(false);
	}

	/**
	 * Handle changing effect value.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onEffectChange(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const li = $(element).parents('.item');
		const modEffects = this.item.system.effects;
		const effect = modEffects[li.data('itemId')];
		const target = element.dataset.target;

		if (effect && target) {
			effect[target] = element.value;
			this.item.update({ "system.effects": modEffects });
		}

		this.render(false);
	}

	/**
	 * Handle changing effect toggles.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onEffectCheckboxToggle(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const item = this.item;
		const target = element.dataset.toggle;

		if (target === 'action-toggle') {
			const hasToggle = !item.system.hasToggle;
			item.update({ 'system.hasToggle': hasToggle });
		} else if (target === 'has-action-toggle') {
			const hasAction = !item.system.hasAction;
			item.update({ 'system.hasAction': hasAction });
		}

		this.render(false);
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
	 * Handle selecting action cost.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onActionCostSelect(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const system = this.item.system;

		system.cost = Number.parseInt(element.value, 10);

		this.render(false);
	}

	/**
	 * Handle selecting weapon skill.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onWeaponSkillSelect(event) {
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

	/**
	 * Handle selecting path starting skill.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onPathSkillSelect(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const system = this.item.system;

		system.skill = element.value;

		this.render(false);
	}

	/**
	 * Handle toggle a path's radiance.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onRadiantCheckboxToggle(event) {
		event.preventDefault();
		const item = this.item;

		const toggle = !item.system.isRadiant;
		item.update({ 'system.isRadiant': toggle });

		this.render(false);
	}

	/**
	 * Handle adding specialties.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onSpecialtyCreate(event) {
		event.preventDefault();
		const system = this.item.system;
		const specialties = system.specialties
		console.log(specialties);

		const count = Object.keys(specialties).length;
		console.log(count);
		specialties["entry-" + (count + 1)] = "New Specialty";

		this.render(false);
	}

	/**
	 * Handle removing specialties.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onSpecialtyRemove(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;

		const system = this.item.system;
		const specialties = system.specialties

		const index = [];
		for (var x in specialties) {
			index.push(x);
		}
		delete specialties[index[dataset.key]];

		this.render(false);
	}
}
