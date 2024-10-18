import { GoalManager } from "../application/goal-manager.mjs";

/**
 * Handle managing goal.
 * @param {Event} event   The originating click event
 * @private
 */
export async function onGoalManage(event) {
	event.preventDefault();
	const system = this.actor.system;
	const goal = system.goal;

	const options = {
		actor: this.actor,
		goals: [...system.biography.goals],
		window: {
			resizable: true,
			title: "Manage Goal",
		},
	}

	new GoalManager(options).render({ force: true });

	this.render(false);
};

/**
 * Handle adding goals.
 * @param {Event} event   The originating click event
 * @private
 */
export function onGoalCreate(event) {
	event.preventDefault();
	const system = this.actor.system;
	let goals = system.biography.goals;

	const count = Object.keys(goals).length;
	goals["entry_" + (count + 1)] = {
		text: "New Goal",
		progress: 0
	};

	this.actor.update({ "system.biography.goals": goals });

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
	let goals = system.biography.goals

	const index = [];
	for (var x in goals) {
		index.push(x);
	}
	delete goals[index[dataset.key]];

	this.actor.update({ "system.biography.goals": goals });

	this.render(false);
};



/**
	 * Handle increasing goal rank.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onGoalIncrease(event) {
	event.preventDefault();
	const element = event.currentTarget;
	const data = element.dataset;
	const system = this.actor.system;
	let goals = system.biography.goals;
	const goal = goals[data.goal];
	let progress = goal.progress

	if (progress < 3) {
		progress++;
	}
	goals[data.goal].progress = progress;

	this.actor.update({ "system.biography.goals": goals });

	this.render(false);
};

/**
	 * Handle reducing goal rank.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onGoalDecrease(event) {
	event.preventDefault();
	const element = event.currentTarget;
	const data = element.dataset;
	const system = this.actor.system;
	let goals = system.biography.goals;
	const goal = goals[data.goal];
	let progress = goal.progress

	if (progress > 0) {
		progress--;
	}
	goals[data.goal].progress = progress;

	this.actor.update({ "system.biography.goals": goals });

	this.render(false);
};
