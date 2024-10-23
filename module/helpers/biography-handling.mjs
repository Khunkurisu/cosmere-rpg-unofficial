import { ConnectionManager } from "../application/connection-manager.mjs";
import { GoalManager } from "../application/goal-manager.mjs";

/**
 * Handle managing connection.
 * @param {Event} event   The originating click event
 * @private
 */
export async function onConnectionManage(event, target) {
	event.preventDefault();
	const system = this.actor.system;

	const options = {
		actor: this.actor,
		connections: [...system.biography.connections],
		window: {
			resizable: true,
			title: "Manage Goal",
		},
	}

	new ConnectionManager(options).render({ force: true });

	this._reRender(false);
};

/**
 * Handle managing goal.
 * @param {Event} event   The originating click event
 * @private
 */
export async function onGoalManage(event, target) {
	event.preventDefault();
	const system = this.actor.system;

	const options = {
		actor: this.actor,
		goals: [...system.biography.goals],
		window: {
			resizable: true,
			title: "Manage Goal",
		},
	}

	new GoalManager(options).render({ force: true });

	this._reRender(false);
};

/**
	 * Handle increasing goal rank.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onGoalIncrease(event, target) {
	event.preventDefault();
	const data = target.dataset;
	const system = this.actor.system;
	let goals = system.biography.goals;
	const goal = goals[data.index];
	let progress = goal.progress

	if (progress < 3) {
		progress++;
	}
	goals[data.index].progress = progress;

	this.actor.update({ "system.biography.goals": goals });

	this._reRender(false);
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
	const goal = goals[data.index];
	let progress = goal.progress

	if (progress > 0) {
		progress--;
	}
	goals[data.index].progress = progress;

	this.actor.update({ "system.biography.goals": goals });

	this._reRender(false);
};

export function onBackstoryManage(event, target) {

}

export function onBiographyChange(event) {
	event.preventDefault();
	const target = event.currentTarget;
	const data = target.dataset;

	const key = `system.biography.${data.target}`;
	const updateObj = {};
	updateObj[key] = target.value;

	this.actor.update(updateObj);

	this._reRender(false);
}
