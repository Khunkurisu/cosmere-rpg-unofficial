/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
	return loadTemplates([
		// Actor partials.
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-effects.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-actions.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-core.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-biography.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-notes.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-items.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-skills.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-talents.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/navigation.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/header.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/attributes.hbs',
		// Item partials
		'systems/cosmere-rpg-unofficial/templates/item/parts/item-talents.hbs',
		'systems/cosmere-rpg-unofficial/templates/item/parts/item-effects.hbs',
		'systems/cosmere-rpg-unofficial/templates/item/parts/item-requirements.hbs',
		// Application partials
		'systems/cosmere-rpg-unofficial/templates/dialogs/actor-expertise.hbs',
		'systems/cosmere-rpg-unofficial/templates/dialogs/actor-goals.hbs',
		'systems/cosmere-rpg-unofficial/templates/dialogs/actor-connections.hbs',
		'systems/cosmere-rpg-unofficial/templates/dialogs/roll-popup.hbs',
        'systems/cosmere-rpg-unofficial/templates/combat/combatant.hbs',
	]);
};
