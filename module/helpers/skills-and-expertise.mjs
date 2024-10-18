import { ExpertiseManager } from "../application/expertise-manager.mjs";
/**
 * Handle adding expertise.
 * @param {Event} event   The originating click event
 * @private
 */
export function onExpertiseCreate(event) {
	event.preventDefault();
	const element = event.currentTarget;
	const dataset = element.dataset;
	const system = this.actor.system;
	const expertise = system.expertise;

	expertise.push({
		"text": "New expertise",
		"category": dataset.type,
		"source": "default",
	});

	this.render(false);
};

/**
 * Handle managing expertise.
 * @param {Event} event   The originating click event
 * @private
 */
export async function onExpertiseManage(event) {
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

	this.render(false);
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
 * Handle removing expertise.
 * @param {Event} event   The originating click event
 * @private
 */
export function onExpertiseRemove(event) {
	event.preventDefault();
	const element = event.currentTarget;
	const dataset = element.dataset;

	const system = this.actor.system;
	const expertise = system.expertise;
	let index = -1;
	for (let i = 0; i < expertise.length - 1; i++) {
		if (expertise[i].text === dataset.key) {
			index = i;
			break;
		}
	}

	if (index !== -1) {
		expertise.splice(index, 1);
	}

	this.render(false);
};

/**
	 * Handle increasing skill rank.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onSkillIncrease(event) {
	event.preventDefault();
	const element = event.currentTarget;
	const data = element.dataset;
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

	this.render(false);
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

	this.render(false);
};
