/**
 * Handle adding goals.
 * @param {Event} event   The originating click event
 * @private
 */
export function onGoalCreate(event) {
	event.preventDefault();
	const system = this.actor.system;
	const goals = system.biography.goals

	const count = Object.keys(goals).length;
	goals["entry-" + (count + 1)] = "New Goal";

	this.render(false);
};

/**
 * Handle removing goals.
 * @param {Event} event   The originating click event
 * @private
 */
export function onGoalRemove(event) {
	event.preventDefault();
	const element = event.currentTarget;
	const dataset = element.dataset;

	const system = this.actor.system;
	const goals = system.biography.goals

	const index = [];
	for (var x in goals) {
		index.push(x);
	}
	delete goals[index[dataset.key]];

	this.render(false);
};
