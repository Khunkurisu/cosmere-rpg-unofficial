import { ExpertiseManager } from "../application/expertise-manager.mjs";

/**
 * Handle managing expertise.
 * @param {Event} event   The originating click event
 * @private
 */
export async function onExpertiseManage(event, target) {
	event.preventDefault();
	const system = this.actor.system;
	const expertise = system.expertise;

	const options = {
		actor: this.actor,
		...getExpertiseCategories(expertise),
		window: {
			resizable: true,
			title: "Manage Expertise",
		},
	}

	new ExpertiseManager(options).render({ force: true });

	this._reRender(false);
};

/**
 * Handle categorizing expertise.
 * @param {Array} expertises   Expertise array from actor
 * @private
 */
export function getExpertiseCategories(expertises) {
	let lists = {
		Utility: [],
		Cultural: [],
		Weapon: [],
		Armor: [],
		Special: [],
	};

	for (let e in expertises) {
		const expertise = expertises[e];
		lists[expertise.category].push(expertise);
	}

	return lists;
}

/**
	 * Handle increasing skill rank.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onSkillIncrease(event, target) {
	event.preventDefault();
	const data = target.dataset;
	const system = this.actor.system;
	const skills = system.skills[data.skillBranch];
	const skill = skills[data.skill];
	let rank = skill.initialRank

	if (rank < 5) {
		rank++;
	}
	const path = `system.skills.${data.skillBranch}.${data.skill}.initialRank`
	const updateObject = {};
	updateObject[path] = rank;

	this.actor.update(updateObject);

	this._reRender(false);
};

/**
	 * Handle reducing skill rank.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onSkillDecrease(event) {
	event.preventDefault();
	const element = event.currentTarget;
	const data = element.dataset;
	const system = this.actor.system;
	const skills = system.skills[data.skillBranch];
	const skill = skills[data.skill];
	let rank = skill.initialRank

	if (rank > 0) {
		rank--;
	}
	const path = `system.skills.${data.skillBranch}.${data.skill}.initialRank`
	const updateObject = {};
	updateObject[path] = rank;

	this.actor.update(updateObject);

	this._reRender(false);
};
