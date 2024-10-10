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
	let bonus = skill.bonus

	if (bonus < 5) {
		bonus++;
	}
	const path = `system.skills.${data.skillBranch}.${data.skill}.bonus`
	const updateObject = {};
	updateObject[path] = bonus;

	this.actor.update(updateObject);

	console.log(skill.bonus);

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
	let bonus = skill.bonus

	if (bonus > 0) {
		bonus--;
	}
	const path = `system.skills.${data.skillBranch}.${data.skill}.bonus`
	const updateObject = {};
	updateObject[path] = bonus;

	this.actor.update(updateObject);

	console.log(skill.bonus);

	this.render(false);
};
