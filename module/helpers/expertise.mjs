/**
	 * Handle adding expertise.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onExpertiseCreate(event) {
	event.preventDefault();
	const system = this.actor.system;
	const expertise = system.expertise

	const count = Object.keys(expertise).length;
	expertise["entry-" + (count + 1)] = "New expertise";

	this.render(false);
};

/**
 * Handle removing expertise.
 * @param {Event} event   The originating click event
 * @private
 */
export function onExpertiseRemove(event) {
	event.preventDefault();
	const element = event.currentTarget;
	const dataset = element.dataset;

	const system = this.actor.system;
	const expertise = system.expertise

	const index = [];
	for (var x in expertise) {
		index.push(x);
	}
	delete expertise[index[dataset.key]];

	this.render(false);
};
