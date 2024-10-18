import { RollManager } from "../application/roll-manager.mjs";
/**
	 * Handle toggling plot dice.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onPlotDiceToggle(shouldEnable, event) {
	event.preventDefault();
	const system = this.actor.system;

	system.usePlotDice = shouldEnable;

	this.render(false);
};

/**
* Handle toggling advantage.
* @param {Event} event   The originating click event
* @param {boolean} shouldEnable   Whether the value should be enabled
* @private
*/
export function onAdvantageToggle(shouldEnable, event) {
	event.preventDefault();
	const system = this.actor.system;

	system.hasAdvantage = shouldEnable;

	this.render(false);
};

/**
* Handle toggling disadvantage.
* @param {Event} event   The originating click event
* @param {boolean} shouldEnable   Whether the value should be enabled
* @private
*/
export function onDisadvantageToggle(shouldEnable, event) {
	event.preventDefault();
	const system = this.actor.system;

	system.hasDisadvantage = shouldEnable;

	this.render(false);
};

/**
 * Handle managing roll.
 * @param {Object} context Context of the originating sheet
 * @private
 */
export function onRollManage(context) {
	const options = {
		...context,
		window: {
			resizable: true,
			title: "Manage Roll",
		},
	};

	new RollManager(options).render({ force: true });
};
