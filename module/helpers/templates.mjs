/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-effects.hbs',
    'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-features.hbs',
    'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-core.hbs',
    'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-items.hbs',
    'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-skills.hbs',
    // Item partials
    'systems/cosmere-rpg-unofficial/templates/item/parts/item-effects.hbs',
  ]);
};
