import * as Effects from '../system/effects.mjs';
import {
	onGoalIncrease,
	onGoalDecrease,
	onGoalManage,
	onConnectionManage,
	onBiographyChange,
} from '../helpers/biography-handling.mjs';
import {
	getExpertiseCategories,
	onExpertiseManage,
	onSkillIncrease,
	onSkillDecrease
} from '../helpers/skills-and-expertise.mjs';
import {
	onRollManage
} from '../helpers/dice-state-handling.mjs';
import {
	onItemIncrease,
	onItemDecrease,
	onItemEquip,
	onItemUnequip,
	onItemDetails,
	onItemDrag,
	onItemDrop,
	onContainerToggle,
	enrichItemDesc,
	strikeFromWeapon
} from '../helpers/item-handling.mjs';
import { CheckCosmere } from "../system/dice/check.mjs"; const { api, sheets } = foundry.applications;

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheetV2}
 */
export class CosmereUnofficialActorSheet extends api.HandlebarsApplicationMixin(
	sheets.ActorSheetV2
) {
	constructor(options = {}) {
		super(options);
		this.#dragDrop = this.#createDragDropHandlers();
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		classes: ['cosmere-rpg-unofficial', 'sheet', 'actor'],
		position: {
			width: 800,
			height: 720,
		},
		actions: {
			onEditImage: this._onEditImage,
			viewDoc: this._viewDoc,
			createDoc: this._createDoc,
			deleteDoc: this._deleteDoc,
			toggleEffect: this._toggleEffect,
			roll: this._onRoll,
			nav: this._onNav,
		},
		// Custom property that's merged into `this.options`
		dragDrop: [{ dragSelector: '[data-drag]', dropSelector: null }],
		form: {
			submitOnChange: true,
		},
	};

	/** @override */
	static PARTS = {
		sheet: {
			template: 'systems/cosmere-rpg-unofficial/templates/actor/actor-sheet.hbs',
		},
	};

	/** @override */
	_configureRenderOptions(options) {
		super._configureRenderOptions(options);
		// Not all parts always render
		options.parts = ['sheet'];
		// Don't show the other tabs if only limited view
		if (this.document.limited) return;
	}

	/* -------------------------------------------- */

	/** @override */
	async _prepareContext(options) {
		// Retrieve the data structure from the base sheet. You can inspect or log
		// the context variable to see the structure, but some key properties for
		// sheets are the actor object, the data object, whether or not it's
		// editable, the items array, and the effects array.
		const context = {
			// Validates both permissions and compendium status
			editable: this.isEditable,
			owner: this.document.isOwner,
			limited: this.document.limited,
			// Add the actor document.
			actor: this.actor,
			items: this.actor.items,
			// Add the actor's data to context.data for easier access, as well as flags.
			system: this.actor.system,
			flags: this.actor.flags,
			selectedTab: this.actor.selectedTab,
			// Adding a pointer to CONFIG.COSMERE_UNOFFICIAL
			config: CONFIG.COSMERE_UNOFFICIAL,
		};

		// Use a safe clone of the actor data for further operations.
		const actorData = this.document.toObject(false);
		this._prepareItems(context);

		switch (actorData.type) {
			case 'Player': {
				// Enrich biography info for display
				// Enrichment turns text like `[[/r 1d20]]` into buttons
				context.enrichedBiography = await TextEditor.enrichHTML(
					this.actor.system.biography.backstory,
					{
						// Whether to show secret blocks in the finished html
						secrets: context.owner,
						// Necessary in v11, can be removed in v12
						async: true,
						// Data to fill in for inline rolls
						rollData: this.actor.getRollData(),
						// Relative UUID resolution
						relativeTo: this.actor,
					}
				);
				break;
			}
			case 'Adversary':
				// Enrich biography info for display
				// Enrichment turns text like `[[/r 1d20]]` into buttons
				context.enrichedBiography = await TextEditor.enrichHTML(
					this.actor.system.notes,
					{
						// Whether to show secret blocks in the finished html
						secrets: context.owner,
						// Necessary in v11, can be removed in v12
						async: true,
						// Data to fill in for inline rolls
						rollData: this.actor.getRollData(),
						// Relative UUID resolution
						relativeTo: this.actor,
					}
				);
				break;
		}

		return context;
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
		const reactions = [];
		const freeActions = [];
		const activities = [];
		const strikes = [];
		const potentialStrikes = [];
		const features = [];
		const ancestryFeatures = [];
		const pathFeatures = [];

		// Iterate through items, allocating to containers
		context.items.forEach(async function (item) {
			item.img = item.img || Item.DEFAULT_ICON;
			item.enrichedDescription = await enrichItemDesc(context, item);

			// Append to container.
			if (item.type === 'Container') {
				containers.push(item);
				// move on;
				return;
			}

			let isStored = false;
			system.stored.every(function (obj) {
				if (obj._id === item._id) {
					isStored = true;
					return false;
				}
				return true;
			});
			// Skip if stored.
			if (isStored) return;

			// Append to gear.
			if (item.type === 'Equipment') {
				gear.push(item);
			}
			// Append to features.
			else if (item.type === 'Feature') {
				if (item.system.hasAction) {
					const action = {
						name: item.name,
						img: item.img,
						_id: item._id,
						system: {
							unit: 'actions',
							cost: item.system.cost,
							description: item.system.description,
							showDetails: item.system.showDetails,
						}
					};
					switch (action.system.cost) {
						case -1: {
							reactions.push(action);
							break;
						}
						case 0: {
							freeActions.push(action);
							break;
						}
						case 1: case 2: case 3: {
							actions.push(action);
							break;
						}
					}
				}
				switch (item.system.type) {
					case 'Ancestry': {
						ancestryFeatures.push(item);
						break;
					}
					case 'Path': {
						pathFeatures.push(item);
						break;
					}
					default: {
						features.push(item);
					}
				}
			}
			// Append to weapons.
			else if (item.type === 'Weapon') {
				weapons.push(item);
				if (item.system.equipped.isEquipped) {
					strikes.push(strikeFromWeapon(item, context));
				} else {
					potentialStrikes.push(strikeFromWeapon(item, context));
				}
			}
			// Append to armor.
			else if (item.type === 'Armor') {
				armor.push(item);
			}
			// Append to actions.
			else if (item.type === 'Action') {
				if (item.system.unit === 'actions') {
					switch (item.system.cost) {
						case -1: {
							reactions.push(item);
							break;
						}
						case 0: {
							freeActions.push(item);
							break;
						}
						case 1: case 2: case 3: {
							actions.push(item);
							break;
						}
						default: {
							activities.push(item);
						}
					}
				} else { activities.push(item); }
			}
		});

		const mod = system.skills.physical.athletics.value;
		strikes.push({
			"name": "Unarmed Strike",
			"formula": "1d4",
			"crit": 4,
			"damageType": "[impact]",
			"skill": "athletics",
			"modifier": (mod >= 0) ? ("+" + mod) : ("-" + mod)
		});

		const activeEffects = [];
		const effects = [];
		const toggleable = [];
		system.effects.forEach(effect => {
			if (effect.system.hasToggle) toggleable.push(effect);
			if (effect.type === 'Effect') {
				if (effect.system.active) {
					activeEffects.push(effect);
				} else {
					effects.push(effect);
				}
			}
		});

		toggleable.sort((a, b) => a.name.localeCompare(b.name));

		// Assign and return
		context.gear = gear;
		context.weapons = weapons;
		context.armor = armor;
		context.containers = containers;
		context.ancestryFeatures = ancestryFeatures;
		context.pathFeatures = pathFeatures;
		context.features = features;
		context.actions = actions;
		context.reactions = reactions;
		context.freeActions = freeActions;
		context.activities = activities;
		context.strikes = strikes;
		context.potentialStrikes = potentialStrikes;
		context.activeEffects = activeEffects;
		context.effects = effects;
		context.toggleable = toggleable;

		console.log(context.pathFeatures);

		let expertiseCategories = getExpertiseCategories(system.expertise);
		context.utilityExpertise = expertiseCategories["Utility"];
		context.culturalExpertise = expertiseCategories["Cultural"];
		context.weaponExpertise = expertiseCategories["Weapon"];
		context.armorExpertise = expertiseCategories["Armor"];
		context.specialExpertise = expertiseCategories["Special"];
	}

	/**
	 * Actions performed after any render of the Application.
	 * Post-render steps are not awaited by the render process.
	 * @param {ApplicationRenderContext} context      Prepared context data
	 * @param {RenderOptions} options                 Provided render options
	 * @protected
	 * @override
	 */
	_onRender(context, options) {
		this.#dragDrop.forEach((d) => d.bind(this.element));
		this.#disableOverrides();

		// -------------------------------------------------------------
		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		/* // Increase Item Quantity
		html.on('click', '.item-quantity-inc', onItemIncrease.bind(this));

		// Decrease Item Quantity
		html.on('click', '.item-quantity-dec', onItemDecrease.bind(this));

		// Equip an Item
		html.on('click', '.item-equip', onItemEquip.bind(this));

		// Unequip an Item
		html.on('click', '.item-unequip', onItemUnequip.bind(this));

		// Effect toggle.
		html.on('click', '.effect-toggle-checkbox', this._onEffectToggle.bind(this));

		// Manage Biography Connections/Goals
		html.on('click', '.connections-manage', onConnectionManage.bind(this));
		html.on('click', '.goals-manage', onGoalManage.bind(this));
		html.on('click', '.goal-pip', onGoalIncrease.bind(this));
		html.on('contextmenu', '.goal-pip', onGoalDecrease.bind(this));

		// Manage Biography Purpose and Obstacle
		html.on('change', '.biography-textarea', onBiographyChange.bind(this));

		// Manage Expertise
		html.on('click', '.expertise-manage', onExpertiseManage.bind(this));

		// Increase/Decrease Skill
		html.on('click', '.skill-pip', onSkillIncrease.bind(this));
		html.on('contextmenu', '.skill-pip', onSkillDecrease.bind(this));

		// View Item Details
		html.on('click', '.detail-item', onItemDetails.bind(this));

		// Handle Container Items
		html.on('click', '.container-toggle', onContainerToggle.bind(this));
		html.on('dragstart', '.item', onItemDrag.bind(this));
		html.on('dragover', '.item', (ev) => { ev.preventDefault(); });
		html.on('drop', '.item', onItemDrop.bind(this));
		html.on('drop', '.container-inventory', onItemDrop.bind(this));

		// Drag events for macros.
		if (this.actor.isOwner) {
			let handler = (ev) => this._onDragStart(ev);
			html.find('li.item').each((i, li) => {
				if (li.classList.contains('inventory-header')) return;
				li.setAttribute('draggable', true);
				li.addEventListener('dragstart', handler, false);
			});
		} */
	}

	/**
	 * Handle changing effect toggles.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	_onEffectToggle(event) {
		event.preventDefault();
		const li = $(event.currentTarget).parents('.effect-toggle');
		const effect = this.actor.items.get(li.data('effectId'));
		const toggle = !effect.system.active;

		effect.update({ 'system.active': toggle });

		this.render(false);
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

		if (type === 'Feature') {
			itemData.system.type = header.dataset.featType;
		}

		// Finally, create the item!
		return await this.actor.createEmbeddedDocuments("Item", [itemData]);
	}

	/**
	 * Handle clickable rolls.
	 * @param {Event} event   The originating click event
	 * @private
	 */
	static async _onRoll(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;

		if (dataset.rollType == 'item') {
			const itemId = element.closest('.item').dataset.itemId;
			const item = this.actor.items.get(itemId);
			dataset.label = `Item: ${dataset.label}`;
			if (item) return item.roll();
		}

		this.handleRoll(dataset);
	}

	handleRoll(dataset) {
		const system = this.actor.system;

		const rollInfo = this.getRollInfo(dataset);
		const label = rollInfo[0];
		const type = rollInfo[1];

		// Handle rolls that supply the formula directly.
		if (dataset.roll) {
			let rollSelectors = ['test', dataset.rollType];
			if (dataset.rollType === 'skill') {
				rollSelectors.push(`skill-${dataset.key}`);
			} else if (dataset.rollType === 'strike') {
				let key = dataset.key === 'heavy' ? 'heavy_weapons' : dataset.key === 'light' ? 'light_weapons' : dataset.key;
				rollSelectors.push('skill', `skill-${key}`);
			}

			let context = {
				actor: this.actor,
				rollLabel: label,
				rollFlags: {
					type: type,
					target: game.user.targets.first()?.document ?? null
				},
				selectors: rollSelectors,
				dice: {
					rollData: dataset.roll,
					hasAdvantage: false,
					hasDisadvantage: false,
					usePlotDice: false,
					modifiers: [],
				}
			};

			system.effects.forEach(activeEffect => {
				if (!activeEffect.system.active) return;
				activeEffect.system.effects.forEach(e => {
					if (e.type === 'dice') {
						const effect = new Effects.DiceEffect(e.trigger, e.target, e.predicate, e.value);
						let data = effect.TryApplyEffect('roll', { circumstances: rollSelectors });
						if (data) {
							context.dice[data.key] = data.value;
						}
					}
				});
			});

			onRollManage(context);
		}
	}

	getRollInfo(dataset) {
		let type = 'damage';
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
			case 'recovery': {
				type = 'healing'
			}
			default: {
				return [dataset.label, type]
			}
		}
	}

	/**************
	 *
	 *   ACTIONS
	 *
	 **************/

	/**
	 * Handle changing a Document's image.
	 *
	 * @this CosmereUnofficialActorSheet
	 * @param {PointerEvent} event   The originating click event
	 * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
	 * @returns {Promise}
	 * @protected
	 */
	static async _onEditImage(event, target) {
		const attr = target.dataset.edit;
		const current = foundry.utils.getProperty(this.document, attr);
		const { img } =
			this.document.constructor.getDefaultArtwork?.(this.document.toObject()) ??
			{};
		const fp = new FilePicker({
			current,
			type: 'image',
			redirectToRoot: img ? [img] : [],
			callback: (path) => {
				this.document.update({ [attr]: path });
			},
			top: this.position.top + 40,
			left: this.position.left + 10,
		});
		return fp.browse();
	}

	/**
	 * Renders an embedded document's sheet
	 *
	 * @this CosmereUnofficialActorSheet
	 * @param {PointerEvent} event   The originating click event
	 * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
	 * @protected
	 */
	static async _viewDoc(event, target) {
		const doc = this._getEmbeddedDocument(target);
		doc.sheet.render(true);
	}

	/**
	 * Handles item deletion
	 *
	 * @this CosmereUnofficialActorSheet
	 * @param {PointerEvent} event   The originating click event
	 * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
	 * @protected
	 */
	static async _deleteDoc(event, target) {
		const doc = this._getEmbeddedDocument(target);
		await doc.delete();
	}

	/**
	 * Handle creating a new Owned Item or ActiveEffect for the actor using initial data defined in the HTML dataset
	 *
	 * @this CosmereUnofficialActorSheet
	 * @param {PointerEvent} event   The originating click event
	 * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
	 * @private
	 */
	static async _createDoc(event, target) {
		// Retrieve the configured document class for Item or ActiveEffect
		const docCls = getDocumentClass(target.dataset.documentClass);
		// Prepare the document creation data by initializing it a default name.
		const docData = {
			name: docCls.defaultName({
				// defaultName handles an undefined type gracefully
				type: target.dataset.type,
				parent: this.actor,
			}),
		};
		// Loop through the dataset and add it to our docData
		for (const [dataKey, value] of Object.entries(target.dataset)) {
			// These data attributes are reserved for the action handling
			if (['action', 'documentClass'].includes(dataKey)) continue;
			// Nested properties require dot notation in the HTML, e.g. anything with `system`
			// An example exists in spells.hbs, with `data-system.spell-level`
			// which turns into the dataKey 'system.spellLevel'
			foundry.utils.setProperty(docData, dataKey, value);
		}

		// Finally, create the embedded document!
		await docCls.create(docData, { parent: this.actor });
	}

	/**
	 * Determines effect parent to pass to helper
	 *
	 * @this CosmereUnofficialActorSheet
	 * @param {PointerEvent} event   The originating click event
	 * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
	 * @private
	 */
	static async _toggleEffect(event, target) {
		const effect = this._getEmbeddedDocument(target);
		await effect.update({ disabled: !effect.disabled });
	}

	static async _onNav(event, target) {

	}

	/** Helper Functions */

	/**
	 * Fetches the embedded document representing the containing HTML element
	 *
	 * @param {HTMLElement} target    The element subject to search
	 * @returns {Item | ActiveEffect} The embedded Item or ActiveEffect
	 */
	_getEmbeddedDocument(target) {
		const docRow = target.closest('li[data-document-class]');
		if (docRow.dataset.documentClass === 'Item') {
			return this.actor.items.get(docRow.dataset.itemId);
		} else if (docRow.dataset.documentClass === 'ActiveEffect') {
			const parent =
				docRow.dataset.parentId === this.actor.id
					? this.actor
					: this.actor.items.get(docRow?.dataset.parentId);
			return parent.effects.get(docRow?.dataset.effectId);
		} else return console.warn('Could not find document class');
	}

	/***************
	 *
	 * Drag and Drop
	 *
	 ***************/

	/**
	 * Define whether a user is able to begin a dragstart workflow for a given drag selector
	 * @param {string} selector       The candidate HTML selector for dragging
	 * @returns {boolean}             Can the current user drag this selector?
	 * @protected
	 */
	_canDragStart(selector) {
		// game.user fetches the current user
		return this.isEditable;
	}

	/**
	 * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector
	 * @param {string} selector       The candidate HTML selector for the drop target
	 * @returns {boolean}             Can the current user drop on this selector?
	 * @protected
	 */
	_canDragDrop(selector) {
		// game.user fetches the current user
		return this.isEditable;
	}

	/**
	 * Callback actions which occur at the beginning of a drag start workflow.
	 * @param {DragEvent} event       The originating DragEvent
	 * @protected
	 */
	_onDragStart(event) {
		const docRow = event.currentTarget.closest('li');
		if ('link' in event.target.dataset) return;

		// Chained operation
		let dragData = this._getEmbeddedDocument(docRow)?.toDragData();

		if (!dragData) return;

		// Set data transfer
		event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
	}

	/**
	 * Callback actions which occur when a dragged element is over a drop target.
	 * @param {DragEvent} event       The originating DragEvent
	 * @protected
	 */
	_onDragOver(event) { }

	/**
	 * Callback actions which occur when a dragged element is dropped on a target.
	 * @param {DragEvent} event       The originating DragEvent
	 * @protected
	 */
	async _onDrop(event) {
		const data = TextEditor.getDragEventData(event);
		const actor = this.actor;
		const allowed = Hooks.call('dropActorSheetData', actor, this, data);
		if (allowed === false) return;

		// Handle different data types
		switch (data.type) {
			case 'Actor':
				return this._onDropActor(event, data);
			case 'Item':
				return this._onDropItem(event, data);
			case 'Folder':
				return this._onDropFolder(event, data);
		}
	}

	/**
	 * Handle dropping of an Actor data onto another Actor sheet
	 * @param {DragEvent} event            The concluding DragEvent which contains drop data
	 * @param {object} data                The data transfer extracted from the event
	 * @returns {Promise<object|boolean>}  A data object which describes the result of the drop, or false if the drop was
	 *                                     not permitted.
	 * @protected
	 */
	async _onDropActor(event, data) {
		if (!this.actor.isOwner) return false;
	}

	/* -------------------------------------------- */

	/**
	 * Handle dropping of an item reference or item data onto an Actor Sheet
	 * @param {DragEvent} event            The concluding DragEvent which contains drop data
	 * @param {object} data                The data transfer extracted from the event
	 * @returns {Promise<Item[]|boolean>}  The created or updated Item instances, or false if the drop was not permitted.
	 * @protected
	 */
	async _onDropItem(event, data) {
		if (!this.actor.isOwner) return false;
		const item = await Item.implementation.fromDropData(data);

		// Handle item sorting within the same Actor
		if (this.actor.uuid === item.parent?.uuid)
			return this._onSortItem(event, item);

		// Create the owned item
		return this._onDropItemCreate(item, event);
	}

	/**
	 * Handle dropping of a Folder on an Actor Sheet.
	 * The core sheet currently supports dropping a Folder of Items to create all items as owned items.
	 * @param {DragEvent} event     The concluding DragEvent which contains drop data
	 * @param {object} data         The data transfer extracted from the event
	 * @returns {Promise<Item[]>}
	 * @protected
	 */
	async _onDropFolder(event, data) {
		if (!this.actor.isOwner) return [];
		const folder = await Folder.implementation.fromDropData(data);
		if (folder.type !== 'Item') return [];
		const droppedItemData = await Promise.all(
			folder.contents.map(async (item) => {
				if (!(document instanceof Item)) item = await fromUuid(item.uuid);
				return item;
			})
		);
		return this._onDropItemCreate(droppedItemData, event);
	}

	/**
	 * Handle the final creation of dropped Item data on the Actor.
	 * This method is factored out to allow downstream classes the opportunity to override item creation behavior.
	 * @param {object[]|object} itemData      The item data requested for creation
	 * @param {DragEvent} event               The concluding DragEvent which provided the drop data
	 * @returns {Promise<Item[]>}
	 * @private
	 */
	async _onDropItemCreate(itemData, event) {
		itemData = itemData instanceof Array ? itemData : [itemData];
		return this.actor.createEmbeddedDocuments('Item', itemData);
	}

	/**
	 * Handle a drop event for an existing embedded Item to sort that Item relative to its siblings
	 * @param {Event} event
	 * @param {Item} item
	 * @private
	 */
	_onSortItem(event, item) {
		// Get the drag source and drop target
		const items = this.actor.items;
		const dropTarget = event.target.closest('[data-item-id]');
		if (!dropTarget) return;
		const target = items.get(dropTarget.dataset.itemId);

		// Don't sort on yourself
		if (item.id === target.id) return;

		// Identify sibling items based on adjacent HTML elements
		const siblings = [];
		for (let el of dropTarget.parentElement.children) {
			const siblingId = el.dataset.itemId;
			if (siblingId && siblingId !== item.id)
				siblings.push(items.get(el.dataset.itemId));
		}

		// Perform the sort
		const sortUpdates = SortingHelpers.performIntegerSort(item, {
			target,
			siblings,
		});
		const updateData = sortUpdates.map((u) => {
			const update = u.update;
			update._id = u.target._id;
			return update;
		});

		// Perform the update
		return this.actor.updateEmbeddedDocuments('Item', updateData);
	}

	/** The following pieces set up drag handling and are unlikely to need modification  */

	/**
	 * Returns an array of DragDrop instances
	 * @type {DragDrop[]}
	 */
	get dragDrop() {
		return this.#dragDrop;
	}

	// This is marked as private because there's no real need
	// for subclasses or external hooks to mess with it directly
	#dragDrop;

	/**
	 * Create drag-and-drop workflow handlers for this Application
	 * @returns {DragDrop[]}     An array of DragDrop handlers
	 * @private
	 */
	#createDragDropHandlers() {
		return this.options.dragDrop.map((d) => {
			d.permissions = {
				dragstart: this._canDragStart.bind(this),
				drop: this._canDragDrop.bind(this),
			};
			d.callbacks = {
				dragstart: this._onDragStart.bind(this),
				dragover: this._onDragOver.bind(this),
				drop: this._onDrop.bind(this),
			};
			return new DragDrop(d);
		});
	}

	/********************
	 *
	 * Actor Override Handling
	 *
	 ********************/

	/**
	 * Submit a document update based on the processed form data.
	 * @param {SubmitEvent} event                   The originating form submission event
	 * @param {HTMLFormElement} form                The form element that was submitted
	 * @param {object} submitData                   Processed and validated form data to be used for a document update
	 * @returns {Promise<void>}
	 * @protected
	 * @override
	 */
	async _processSubmitData(event, form, submitData) {
		const overrides = foundry.utils.flattenObject(this.actor.overrides);
		for (let k of Object.keys(overrides)) delete submitData[k];
		await this.document.update(submitData);
	}

	/**
	 * Disables inputs subject to active effects
	 */
	#disableOverrides() {
		const flatOverrides = foundry.utils.flattenObject(this.actor.overrides);
		for (const override of Object.keys(flatOverrides)) {
			const input = this.element.querySelector(`[name="${override}"]`);
			if (input) {
				input.disabled = true;
			}
		}
	}
}
