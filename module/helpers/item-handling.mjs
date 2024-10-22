/**
	 * Handle increasing item quantity.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onItemIncrement(event, target) {
	event.preventDefault();
	const li = $(target).parents('.item');
	const actor = game.actors.get(this.actor._id);
	const item = actor.items.get(li.data('itemId'));

	const mult = Number.parseInt(target.dataset.direction);
	const addend = (event.ctrlKey ? 10 : event.shiftKey ? 5 : 1) * mult;
	const newVal = Math.max(item.system.quantity + addend, 0);

	item.update({ "system.quantity": newVal });

	this._reRender(false);
};

/**
	 * Handle equipping item.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onItemEquip(event, target) {
	event.preventDefault();
	const li = $(target).parents('.item');
	const item = this.actor.items.get(li.data('itemId'));

	const isEquipped = !item.system.isEquipped;

	if (isEquipped && item.type === "Armor") {
		const items = Array.from(this.actor.items);
		for (let index in items) {
			const i = items[index];
			if (i.type === "Armor") {
				i.update({ "system.equipped.isEquipped": false });
			}
		}
	}

	item.update({ "system.equipped.isEquipped": isEquipped });

	this._reRender(false);
};

/**
	 * Handle showing item details.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onItemDetails(event, target) {
	event.preventDefault();
	const li = $(target).parents('.item');
	const item = this.actor.items.get(li.data('itemId'));
	item.system.showDetails = !item.system.showDetails;

	this._reRender(false);
};

/**
	 * Handle item dragging.
	 * @param {Event} event   The originating drag event
	 * @private
	 */
export function onItemDrag(event, target) {
	const item = this.actor.items.get(target.data('itemId'));
	if (item && item.type !== 'Container') {
		this.lastDragged = item._id;
	}
};

/**
	 * Handle dropping items on containers.
	 * @param {Event} event   The originating drop event
	 * @private
	 */
export function onItemDrop(event, target) {
	const items = this.actor.items;
	const itemId = this.lastDragged;
	const container = items.get(target.data('itemId'));
	if (container.type === 'Container') {
		event.preventDefault();

		const containerItems = container.system.stored;
		containerItems.push(itemId);
		container.update({ "system.stored": containerItems });

		this._reRender(false);
		return;
	}
	items.forEach(function (item) {
		if (item.type === 'Container') {
			const storedItems = [];
			item.system.stored.forEach(function (id) {
				if (itemId === id) return;
				storedItems.push(id);
			});
			item.update({ "system.stored": storedItems });
		}
	});
};

/**
	 * Handle showing container items.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onContainerToggle(event, target) {
	event.preventDefault();
	const li = $(target).parents('.item');
	const item = this.actor.items.get(li.data('itemId'));
	const showStored = !item.system.showStored;

	item.update({ "system.showStored": showStored });

	this._reRender(false);
};

/**
 * Handle weapon actions.
 * @param {Item} weapon   The weapon to create the action from
 * @private
 */
export function strikeFromWeapon(weapon, context) {
	const system = context.actor.system;
	let skill = weapon.system.skill === "heavy" ? "heavy_weapons" : weapon.system.skill === "light" ? "light_weapons" : weapon.system.skill;
	let mod = system.skills.physical[skill].value;

	return {
		"name": weapon.name,
		"_id": weapon._id,
		"formula": weapon.system.damage.count + "d" + weapon.system.damage.die,
		"crit": weapon.system.damage.die,
		"defense": "physical",
		"skill": weapon.system.skill,
		"damageType": "[" + weapon.system.damage.type + "]",
		"modifier": (mod >= 0) ? (`+${mod}`) : (`-${mod}`)
	};
}

export async function enrichItemDesc(context, item) {
	let description = '';
	if (item.type === 'Feature') {
		if (item.system.requirements.length > 0) {
			const requirementText = [];
			item.system.requirements.forEach(requirement => {
				if (requirement.type === 'skill') {
					let localSkillKey = '';
					if (requirement.skill in context.config.skills.physical) localSkillKey = 'physical';
					else if (requirement.skill in context.config.skills.cognitive) localSkillKey = 'cognitive';
					else if (requirement.skill in context.config.skills.spiritual) localSkillKey = 'spiritual';
					const localSkillName = game.i18n.localize(context.config.skills[localSkillKey][requirement.skill]);
					requirementText.push(`${localSkillName} ${requirement.value}`);
					return;
				}
				requirementText.push(`${requirement.value}`);
			});
			description += `<p><b>Requirements:</b> ${requirementText.join('; ')}</p>`;
		}
	}
	description += `${item.system.description}`;
	return await TextEditor.enrichHTML(
		description,
		{
			// Whether to show secret blocks in the finished html
			secrets: context.isOwner,
			// Data to fill in for inline rolls
			rollData: context.actor.getRollData(),
			// Relative UUID resolution
			relativeTo: item,
		}
	);
}
