// Import document classes.
import { CosmereUnofficialActor } from './documents/actor.mjs';
import { CosmereUnofficialItem } from './documents/item.mjs';
// Import sheet classes.
import { CosmereUnofficialActorSheet } from './sheets/actor-sheet.mjs';
import { CosmereUnofficialItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { COSMERE_UNOFFICIAL } from './helpers/config.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
	// Add utility classes to the global game object so that they're more easily
	// accessible in global contexts.
	game.cosmereunofficial = {
		CosmereUnofficialActor,
		CosmereUnofficialItem,
		rollItemMacro,
	};

	// Add custom constants for configuration.
	CONFIG.COSMERE_UNOFFICIAL = COSMERE_UNOFFICIAL;

	// Define custom Document classes
	CONFIG.Actor.documentClass = CosmereUnofficialActor;
	CONFIG.Item.documentClass = CosmereUnofficialItem;

	// Active Effects are never copied to the Actor,
	// but will still apply to the Actor from within the Item
	// if the transfer property on the Active Effect is true.
	CONFIG.ActiveEffect.legacyTransferral = false;

	// Register sheet application classes
	Actors.unregisterSheet('core', ActorSheet);
	Actors.registerSheet('cosmere-rpg-unofficial', CosmereUnofficialActorSheet, {
		makeDefault: true,
		label: 'COSMERE_UNOFFICIAL.SheetLabels.Actor',
	});
	Items.unregisterSheet('core', ItemSheet);
	Items.registerSheet('cosmere-rpg-unofficial', CosmereUnofficialItemSheet, {
		makeDefault: true,
		label: 'COSMERE_UNOFFICIAL.SheetLabels.Item',
	});

	// Preload Handlebars templates.
	return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

Handlebars.registerHelper('toLowerCase', function (str) {
	return str.toLowerCase();
});
Handlebars.registerHelper('toUpperCase', function (str) {
	return str.toUpperCase();
});
/* {{#ifEquals sampleString "This is a string"}}*/
/*   Your HTML here								*/
/* {{/ifEquals}}								*/
Handlebars.registerHelper('ifEquals', function (arg1, arg2) {
	return (arg1 == arg2);
});
Handlebars.registerHelper('capacityPct', function (capacityObj) {
	return (capacityObj.carrying / capacityObj.maxCarry) * 100;
});
Handlebars.registerHelper('isSelected', function (arg1, arg2) {
	return (arg1 == arg2) ? "selected" : "";
});
Handlebars.registerHelper('objToLog', function (objToLog) {
	console.log(objToLog)
	return "";
});
Handlebars.registerHelper('getWeaponSkill', function (skill) {
	return skill === "heavy" ? "heavy_weapons" : "light_weapons";
});
Handlebars.registerHelper('getModifier', function (strike, data) {
	let skill = strike.skill === "heavy" ? "heavy_weapons" : "light_weapons";
	let mod = data.skills.physical[skill].value;

	return mod >= 0 ? "+" + mod : "-" + mod;
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
	// Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
	Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
	// First, determine if this is a valid owned item.
	if (data.type !== 'Item') return;
	if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
		return ui.notifications.warn(
			'You can only create macro buttons for owned Items'
		);
	}
	// If it is, retrieve it based on the uuid.
	const item = await Item.fromDropData(data);

	// Create the macro command using the uuid.
	const command = `game.cosmereunofficial.rollItemMacro("${data.uuid}");`;
	let macro = game.macros.find(
		(m) => m.name === item.name && m.command === command
	);
	if (!macro) {
		macro = await Macro.create({
			name: item.name,
			type: 'script',
			img: item.img,
			command: command,
			flags: { 'cosmere-rpg-unofficial.itemMacro': true },
		});
	}
	game.user.assignHotbarMacro(macro, slot);
	return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
	// Reconstruct the drop data so that we can load the item.
	const dropData = {
		type: 'Item',
		uuid: itemUuid,
	};
	// Load the item from the uuid.
	Item.fromDropData(dropData).then((item) => {
		// Determine if the item loaded and if it's an owned item.
		if (!item || !item.parent) {
			const itemName = item?.name ?? itemUuid;
			return ui.notifications.warn(
				`Could not find item ${itemName}. You may need to delete and recreate this macro.`
			);
		}

		// Trigger the item roll
		item.roll();
	});
}
