import {
	onManageActiveEffect,
	prepareActiveEffectCategories,
} from '../helpers/effects.mjs';
import {
	onGoalCreate,
	onGoalRemove
} from '../helpers/goals.mjs';
import {
	onConnectionCreate,
	onConnectionRemove
} from '../helpers/connections.mjs';
import {
	onExpertiseCreate,
	onExpertiseRemove
} from '../helpers/expertise.mjs';
import {
	onPlotDiceToggle,
	onAdvantageToggle,
	onDisadvantageToggle
} from '../helpers/dice-state-handling.mjs';
import {
	onItemIncrease,
	onItemDecrease,
	onItemEquip,
	onItemUnequip,
	onItemDetails
} from '../helpers/item-handling.mjs';
import { CheckCosmere } from "../system/dice/check.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class CosmereUnofficialActorSheet extends ActorSheet {
	/** @override */
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ['cosmere-rpg-unofficial', 'sheet', 'actor'],
			width: 720,
			height: 720,
			tabs: [
				{
					navSelector: '.sheet-tabs',
					contentSelector: '.sheet-body',
					initial: 'actions',
				},
			],
		});
	}

	/** @override */
	get template() {
		return `systems/cosmere-rpg-unofficial/templates/actor/actor-${this.actor.type.toLowerCase()}-sheet.hbs`;
	}

	/* -------------------------------------------- */

	/** @override */
	async getData() {
		// Retrieve the data structure from the base sheet. You can inspect or log
		// the context variable to see the structure, but some key properties for
		// sheets are the actor object, the data object, whether or not it's
		// editable, the items array, and the effects array.
		const context = super.getData();

		// Use a safe clone of the actor data for further operations.
		const actorData = this.document.toObject(false);

		// Add the actor's data to context.data for easier access, as well as flags.
		context.system = actorData.system;
		context.flags = actorData.flags;

		// Adding a pointer to CONFIG.COSMERE_UNOFFICIAL
		context.config = CONFIG.COSMERE_UNOFFICIAL;

		// Prepare character data and items.
		if (actorData.type == 'Player') {
			this._prepareItems(context);
			this._prepareCharacterData(context);

			// Enrich biography info for display
			// Enrichment turns text like `[[/r 1d20]]` into buttons
			context.enrichedBiography = await TextEditor.enrichHTML(
				this.actor.system.biography.backstory,
				{
					// Whether to show secret blocks in the finished html
					secrets: this.document.isOwner,
					// Necessary in v11, can be removed in v12
					async: true,
					// Data to fill in for inline rolls
					rollData: this.actor.getRollData(),
					// Relative UUID resolution
					relativeTo: this.actor,
				}
			);
		}

		// Prepare NPC data and items.
		if (actorData.type == 'Adversary') {
			this._prepareItems(context);

			// Enrich biography info for display
			// Enrichment turns text like `[[/r 1d20]]` into buttons
			context.enrichedBiography = await TextEditor.enrichHTML(
				this.actor.system.notes,
				{
					// Whether to show secret blocks in the finished html
					secrets: this.document.isOwner,
					// Necessary in v11, can be removed in v12
					async: true,
					// Data to fill in for inline rolls
					rollData: this.actor.getRollData(),
					// Relative UUID resolution
					relativeTo: this.actor,
				}
			);
		}

		// Prepare active effects
		context.effects = prepareActiveEffectCategories(
			// A generator that returns all effects stored on the actor
			// as well as any items
			this.actor.allApplicableEffects()
		);

		return context;
	}

	/**
	 * Character-specific context modifications
	 *
	 * @param {object} context The context object to mutate
	 */
	_prepareCharacterData(context) {
		// This is where you can enrich character-specific editor fields
		// or setup anything else that's specific to this type
	}

	/**
	 * Organize and classify Items for Actor sheets.
	 *
	 * @param {object} context The context object to mutate
	 */
	_prepareItems(context) {
		const system = context.actor.system;

		// Initialize containers.
		const gear = [];
		const weapons = [];
		const armor = [];
		const containers = [];
		const actions = [];
		const strikes = [];
		const potentialStrikes = [];
		const effects = [];
		const features = [];

		const sheet = this;

		// Iterate through items, allocating to containers
		context.items.forEach(function (item) {
			let isStored = false;
			system.containers.forEach(function (container) {
				const storage = container.system.stored;
				storage.forEach(function (obj) {
					isStored = obj === item;
				});
			});
			item.img = item.img || Item.DEFAULT_ICON;
			// Skip if stored.
			if (isStored) return;

			// Append to gear.
			if (item.type === 'Equipment') {
				gear.push(item);
			}
			// Append to features.
			else if (item.type === 'Feature') {
				features.push(item);
			}
			// Append to weapons.
			else if (item.type === 'Weapon') {
				weapons.push(item);
				if (item.system.equipped.isEquipped) {
					strikes.push(sheet._strikeFromWeapon(item, context));
				} else {
					potentialStrikes.push(sheet._strikeFromWeapon(item, context));
				}
			}
			// Append to armor.
			else if (item.type === 'Armor') {
				armor.push(item);
			}
			// Append to containers.
			else if (item.type === 'Container') {
				containers.push(item);
			}
			// Append to actions.
			else if (item.type === 'Action') {
				actions.push(item);
			}
			// Append to effects.
			else if (item.type === 'Effect') {
				effects.push(item);
			}
		});

		const mod = system.skills.physical.athletics.value;
		strikes.push({
			"name": "Unarmed Strike",
			"formula": "1d4",
			"crit": 4,
			"damageType": "[impact]",
			"modifier": (mod >= 0) ? ("+" + mod) : ("-" + mod)
		});

		// Assign and return
		context.gear = gear;
		context.weapons = weapons;
		context.armor = armor;
		context.containers = containers;
		context.effects = effects;
		context.features = features;
		context.actions = actions;
		context.strikes = strikes;
		context.potentialStrikes = potentialStrikes;
	}

	/* -------------------------------------------- */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		// Render the item sheet for viewing/editing prior to the editable check.
		html.on('click', '.item-edit', (ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			item.sheet.render(true);
		});

		// -------------------------------------------------------------
		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		// Add Inventory Item
		html.on('click', '.item-create', this._onItemCreate.bind(this));

		// Delete Inventory Item
		html.on('click', '.item-delete', (ev) => {
			const li = $(ev.currentTarget).parents('.item');
			const item = this.actor.items.get(li.data('itemId'));
			item.delete();
			li.slideUp(200, () => this.render(false));
		});

		// Increase Item Quantity
		html.on('click', '.item-quantity-inc', onItemIncrease.bind(this));

		// Decrease Item Quantity
		html.on('click', '.item-quantity-dec', onItemDecrease.bind(this));

		// Equip an Item
		html.on('click', '.item-equip', onItemEquip.bind(this));

		// Unequip an Item
		html.on('click', '.item-unequip', onItemUnequip.bind(this));

		// Active Effect management
		html.on('click', '.effect-control', (ev) => {
			const row = ev.currentTarget.closest('li');
			const document =
				row.dataset.parentId === this.actor.id
					? this.actor
					: this.actor.items.get(row.dataset.parentId);
			onManageActiveEffect(ev, document);
		});

		// Rollable abilities.
		html.on('click', '.rollable', this._onRoll.bind(this));

		// Add/Remove Biography Goal
		html.on('click', '.goal-create', onGoalCreate.bind(this));
		html.on('click', '.goal-remove', onGoalRemove.bind(this));

		// Add/Remove Biography Connection
		html.on('click', '.connection-create', onConnectionCreate.bind(this));
		html.on('click', '.connection-remove', onConnectionRemove.bind(this));

		// Add/Remove Expertise
		html.on('click', '.expertise-create', onExpertiseCreate.bind(this));
		html.on('click', '.expertise-remove', onExpertiseRemove.bind(this));

		// Enable/Disable Plot Dice
		html.on('click', '.plot-dice-on', onPlotDiceToggle.bind(this, true));
		html.on('click', '.plot-dice-off', onPlotDiceToggle.bind(this, false));

		// Enable/Disable Advantage
		html.on('click', '.advantage-on', onAdvantageToggle.bind(this, true));
		html.on('click', '.advantage-off', onAdvantageToggle.bind(this, false));

		// Enable/Disable Disadvantage
		html.on('click', '.disadvantage-on', onDisadvantageToggle.bind(this, true));
		html.on('click', '.disadvantage-off', onDisadvantageToggle.bind(this, false));

		// View Item Details
		html.on('click', '.detail-item', onItemDetails.bind(this));

		// Drag events for macros.
		if (this.actor.isOwner) {
			let handler = (ev) => this._onDragStart(ev);
			html.find('li.item').each((i, li) => {
				if (li.classList.contains('inventory-header')) return;
				li.setAttribute('draggable', true);
				li.addEventListener('dragstart', handler, false);
			});
		}
	}

	/**
	 * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
	 * @param {Event} event   The originating click event
	 * @private
	 */
	async _onItemCreate(event) {
		event.preventDefault();
		const header = event.currentTarget;
		// Get the type of item to create.
		const type = header.dataset.type;
		// Grab any data associated with this control.
		const data = foundry.utils.duplicate(header.dataset);
		// Initialize a default name.
		const name = `New ${type.capitalize()}`;
		// Prepare the item object.
		const itemData = {
			name: name,
			type: type,
			system: data,
		};
		// Remove the type from the dataset since it's in the itemData.type prop.
		delete itemData.system['type'];

		// Finally, create the item!
		return await this.actor.createEmbeddedDocuments("Item", [itemData]);
	}

	/**
	 * Handle clickable rolls.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onRoll(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;

		if (dataset.rollType == 'item') {
			const itemId = element.closest('.item').dataset.itemId;
			const item = this.actor.items.get(itemId);
			dataset.label = `Item: ${dataset.label}`;
			if (item) return item.roll();
		}

		/* const rollInfo = this.getRollInfo(dataset);
		const li = $(event.currentTarget).parents('.item');
		const item = this.actor.items.get(li.data('itemId'));

		const context = {
			actor: this.actor,
			label: rollInfo[0],
			type: rollInfo[1],
			defense: rollInfo[2] ?? null,
			item: item ?? null,
			target: game.user.targets.first()?.document.actor ?? null
		}
		CheckCosmere.roll(context, event); */

		return this.handleRoll(dataset);
	}

	handleRoll(dataset) {
		const system = this.actor.system;

		const rollInfo = this.getRollInfo(dataset);
		const label = rollInfo[0];
		const type = rollInfo[1];
		const defense = rollInfo[2];

		const context = {
			actor: this.actor,
			label: rollInfo[0],
			type: rollInfo[0],
			defense: rollInfo[2] ?? null,
			flags: {
				type: type,
				target: game.user.targets.first()?.document ?? null
			}
		}

		// Handle rolls that supply the formula directly.
		if (dataset.roll) {
			let rollData = dataset.roll;
			let plot = '';
			let flags = {
				type: type,
				target: game.user.targets.first()?.document ?? null
			};

			if (system.hasAdvantage) {
				if (!system.hasDisadvantage) {
					rollData = `{${rollData}, ${rollData}}kh`;
				}
			}
			if (system.hasDisadvantage) {
				if (!system.hasAdvantage) {
					rollData = `{${rollData}, ${rollData}}kl`;
				}
			}

			if (type === 'check') {
				if (system.usePlotDice) {
					rollData += " + 1d6[plot]";
					plot = " + 1d6";
				}
			}

			let roll = new Roll(rollData, this.actor.getRollData());
			roll._formula = dataset.roll + plot;
			if (Hooks.call("system.preRoll", roll) === false) return;

			let message = roll.toMessage({
				flags: { cosmere: flags },
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label,
				rollMode: game.settings.get('core', 'rollMode'),
			});

			return roll;
		}
	}

	getRollInfo(dataset) {
		switch (dataset.rollType) {
			case 'skill': {
				return [`Skill: ${dataset.label}`, "check", dataset.defense];
			}
			case 'strike': {
				return [`Strike: ${dataset.label}`, "check", dataset.defense];
			}
			case 'critical': {
				return [`Critical Damage: ${dataset.label}`, "damage"];
			}
			case 'damage': {
				return [`Damage: ${dataset.label}`, "damage"];
			}
			case 'graze': {
				return [`Graze: ${dataset.label}`, "damage"];
			}
		}
	}

	/**
	 * Handle weapon actions.
	 * @param {Item} weapon   The weapon to create the action from
	 * @private
	 */
	_strikeFromWeapon(weapon, context) {
		const system = context.actor.system;
		let skill = weapon.system.skill === "heavy" ? "heavy_weapons" : "light_weapons";
		let mod = system.skills.physical[skill].value;

		return {
			"name": weapon.name,
			"_id": weapon._id,
			"formula": weapon.system.damage.count + "d" + weapon.system.damage.die,
			"crit": weapon.system.damage.die,
			"defense": "physical",
			"damageType": "[" + weapon.system.damage.type + "]",
			"modifier": (mod >= 0) ? (`+${mod}`) : (`-${mod}`)
		};
	}
}
