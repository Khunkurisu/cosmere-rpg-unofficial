/**
	 * Handle toggling plot dice.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onPlotDiceToggle(shouldEnable, event) {
	console.log("event:");
	console.log(event);
	console.log("shouldEnable:");
	console.log(shouldEnable);
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
	console.log("event:");
	console.log(event);
	console.log("shouldEnable:");
	console.log(shouldEnable);
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
	console.log("event:");
	console.log(event);
	console.log("shouldEnable:");
	console.log(shouldEnable);
	event.preventDefault();
	const system = this.actor.system;

	system.hasDisadvantage = shouldEnable;

	this.render(false);
};
