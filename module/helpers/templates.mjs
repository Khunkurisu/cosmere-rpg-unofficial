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
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-items.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-skills.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-feats.hbs',
		// Item partials
		'systems/cosmere-rpg-unofficial/templates/item/parts/item-talents.hbs',
		'systems/cosmere-rpg-unofficial/templates/item/parts/item-effects.hbs',
		'systems/cosmere-rpg-unofficial/templates/item/parts/item-requirements.hbs',
		// Application partials
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-expertise.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-goals.hbs',
		'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-connections.hbs',
		'systems/cosmere-rpg-unofficial/templates/chat/roll-popup.hbs'
	]);
};
