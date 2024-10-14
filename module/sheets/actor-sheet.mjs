import { prepareActiveEffectCategories } from '../helpers/effects.mjs';
import * as Effects from '../system/effects.mjs';
import {
	onGoalCreate,
	onGoalRemove,
	onGoalIncrease,
	onGoalDecrease
} from '../helpers/goals.mjs';
import {
	onConnectionCreate,
	onConnectionRemove
} from '../helpers/connections.mjs';
import {
	onExpertiseCreate,
	onExpertiseRemove,
	onSkillIncrease,
	onSkillDecrease
} from '../helpers/skills-and-expertise.mjs';
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
	onItemDetails,
	onItemDrag,
	onItemDrop,
	onContainerToggle
} from '../helpers/item-handling.mjs';
import { CheckCosmere } from "../system/dice/check.mjs";

const { api, sheets } = foundry.applications;

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
			width: 720,
			height: 720,
		},
		actions: {
			onEditImage: this._onEditImage,
			viewDoc: this._viewDoc,
			createDoc: this._createDoc,
			deleteDoc: this._deleteDoc,
			toggleEffect: this._onEffectToggle,
			roll: this._onRoll,
			diceModToggle: this._onDiceModifierToggle,
			quantityChange: this._onQuantityChange,
			itemEquip: this._onItemEquip,
			bioProgress: this._onBiographyChange,
			bioFunctions: this._onBiographyFunction,

		},
		// Custom property that's merged into `this.options`
		dragDrop: [{ dragSelector: '[data-drag]', dropSelector: null }],
		form: {
			submitOnChange: true,
			handler: CosmereUnofficialActorSheet._handleForm,
		},
	};

	/** @override */
	static PARTS = {
		main: {
			template: 'systems/cosmere-rpg-unofficial/templates/actor/actor-sheet.hbs',
		},
	};

	/** @override */
	_configureRenderOptions(options) {
		super._configureRenderOptions(options);
		// Not all parts always render
		options.parts = ['main'];
		// Don't show the other tabs if only limited view
		if (this.document.limited) return;
	}

	/* -------------------------------------------- */

	/** @override */
	async _prepareContext(options) {
		// Output initialization
		const context = {
			// Validates both permissions and compendium status
			editable: this.isEditable,
			owner: this.document.isOwner,
			limited: this.document.limited,
			// Add the actor document.
			actor: this.actor,
			// Add the actor's data to context.data for easier access, as well as flags.
			system: this.actor.system,
			flags: this.actor.flags,
			// Adding a pointer to CONFIG.COSMERE_UNOFFICIAL
			config: CONFIG.COSMERE_UNOFFICIAL,
			tabs: this._getTabs(['actions', 'items', 'skills', 'features', 'biography', 'effects']),
			// Necessary for formInput and formFields helpers
			fields: this.document.schema.fields,
			systemFields: this.document.system.schema.fields,
		};

		// Offloading context prep to a helper function
		this._prepareItems(context);

		return context;
	}

	/** @override */
	async _preparePartContext(partId, context) {
		switch (partId) {
			case 'actions':
			case 'items':
			case 'skills':
			case 'features':
			case 'effects':
				context.tab = context.tabs[partId];
				break;
			case 'biography':
				context.tab = context.tabs[partId];
				// Enrich biography info for display
				// Enrichment turns text like `[[/r 1d20]]` into buttons
				context.enrichedBiography = await TextEditor.enrichHTML(
					this.actor.system.biography,
					{
						// Whether to show secret blocks in the finished html
						secrets: this.document.isOwner,
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
	 * Generates the data for the generic tab navigation template
	 * @param {string[]} parts An array of named template parts to render
	 * @returns {Record<string, Partial<ApplicationTab>>}
	 * @protected
	 */
	_getTabs(actorTabs) {
		// If you have sub-tabs this is necessary to change
		const tabGroup = 'primary';

		// Default tab for first time it's rendered this session
		if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = 'actions';
		const reducedTags = actorTabs.reduce((tabs, id) => {
			const tab = {
				cssClass: '',
				group: tabGroup,
				// Matches tab property to
				id: '',
				// FontAwesome Icon, if you so choose
				icon: '',
				// Run through localization
				label: 'COSMERE_UNOFFICIAL.Actor.Tabs.',
			};
			switch (id) {
				case 'main':
					return tabs;
				case 'biography':
					tab.id = 'biography';
					tab.label += 'Biography';
					break;
				case 'features':
					tab.id = 'features';
					tab.label += 'Features';
					break;
				case 'actions':
					tab.id = 'actions';
					tab.label += 'Actions';
					break;
				case 'items':
					tab.id = 'items';
					tab.label += 'Items';
					break;
				case 'skills':
					tab.id = 'skills';
					tab.label += 'Skills';
					break;
				case 'effects':
					tab.id = 'effects';
					tab.label += 'Effects';
					break;
			}
			if (this.tabGroups[tabGroup] === tab.id) tab.cssClass = 'active';
			tabs[id] = tab;
			return tabs;
		}, {});
		return reducedTags;
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

		const sheet = this;

		// Iterate through items, allocating to containers
		this.document.items.forEach(function (item) {
			item.img = item.img || Item.DEFAULT_ICON;

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
					strikes.push(sheet._strikeFromWeapon(item, context));
				} else {
					potentialStrikes.push(sheet._strikeFromWeapon(item, context));
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
			"modifier": (mod >= 0) ? ("+" + mod) : ("-" + mod)
		});

		const activeEffects = [];
		const effects = [];
		const toggleable = [];
		system.activeEffects.forEach(effect => {
			if (effect.system.hide) return;
			if (effect.system.toggle) toggleable.push(effect);
			activeEffects.push(effect);
		});
		system.effects.forEach(effect => {
			if (effect.system.hide) return;
			if (effect.system.toggle) toggleable.push(effect);
			effects.push(effect);
		});

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
		// You may want to add other special handling here
		// Foundry comes with a large number of utility classes, e.g. SearchFilter
		// That you may want to implement yourself.

		// -------------------------------------------------------------
		// Everything below here is only needed if the sheet is editable
		if (!this.isEditable) return;

		const html = $(this.element);

		// Decrease Biography Goal Progress
		html.on('contextmenu', '.goal-pip', onGoalDecrease.bind(this));

		// Decrease Skill
		html.on('contextmenu', '.skill-pip', onSkillDecrease.bind(this));

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
		}
	}
	/**
	 * Process form submission for the sheet
	 * @this {MyApplication}                      The handler is called with the application as its bound scope
	 * @param {SubmitEvent} event                   The originating form submission event
	 * @param {HTMLFormElement} form                The form element that was submitted
	 * @param {FormDataExtended} formData           Processed data for the submitted form
	 * @returns {Promise<void>}
	 */
	static async _handleForm(event, form, formData) {
		// Do things with the returned FormData
		console.log(form);
		console.log(formData);
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
	 * Handle clickable rolls.
	 *
	 * @this CosmereUnofficialActorSheet
	 * @param {PointerEvent} event   The originating click event
	 * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
	 * @protected
	 */
	static async _onRoll(event, target) {
		event.preventDefault();
		const dataset = target.dataset;

		// Handle item rolls.
		switch (dataset.rollType) {
			case 'item':
				const item = this._getEmbeddedDocument(target);
				if (item) return item.roll();
		}

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

			let hasAdvantage = false;
			let hasDisadvantage = false;
			let usePlotDice = false;
			const rollType = dataset.rollType === 'skill' ? dataset.key : dataset.rollType;
			console.log(system.activeEffects);

			system.activeEffects.forEach(activeEffect => {
				if (activeEffect.system.status !== 'active') return;
				activeEffect.system.effects.forEach(e => {
					if (e.type === 'dice') {
						const effect = new Effects.ModifierEffect(e.trigger, e.target, e.predicate, e.func, e.value);
						let data = effect.TryApplyEffect('roll', { circumstances: [rollType] });
						if (data) {
							switch (data.key) {
								case 'hasAdvantage': {
									hasAdvantage = data.value;
									break;
								}
								case 'hasDisadvantage': {
									hasDisadvantage = data.value;
								}
								case 'usePlotDice': {
									usePlotDice = data.value;
								}
							}
						}
					}
				});
			});

			if (system.hasAdvantage || hasAdvantage) {
				if (!system.hasDisadvantage) {
					rollData = `{${rollData}, ${rollData}}kh`;
				}
			}
			if (system.hasDisadvantage || hasDisadvantage) {
				if (!system.hasAdvantage) {
					rollData = `{${rollData}, ${rollData}}kl`;
				}
			}

			if (type === 'check') {
				if (system.usePlotDice || usePlotDice) {
					rollData += " + 1d6[plot]";
					plot = " + 1d6";
				}
			}

			let roll = new Roll(rollData, this.actor.getRollData());
			if (Hooks.call("system.preRoll", roll) === false) return;

			roll.toMessage({
				flags: { cosmere: flags },
				speaker: ChatMessage.getSpeaker({ actor: this.actor }),
				flavor: label,
				rollMode: game.settings.get('core', 'rollMode'),
			});

			return roll;
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

	/** Helper Functions */

	/**
	 * Handle changing effect toggles.
	 *
	 * @this CosmereUnofficialActorSheet
	 * @param {PointerEvent} event   The originating click event
	 * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
	 * @protected
	 */
	static async _onEffectToggle(event, target) {
		event.preventDefault();
		const li = target.parents('.effect-toggle');
		const effect = this.actor.items.get(li.data('effectId'));
		const toggle = effect.system.status === 'active' ? 'inactive' : 'active';

		effect.update({ 'system.status': toggle });

		this.render(false);
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
