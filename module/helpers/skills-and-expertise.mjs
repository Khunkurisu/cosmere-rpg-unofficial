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
