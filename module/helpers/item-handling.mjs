/**
	 * Handle increasing item quantity.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onItemIncrease(event) {
	event.preventDefault();
	const li = $(event.currentTarget).parents('.item');
	const actor = game.actors.get(this.actor._id);
	const item = actor.items.get(li.data('itemId'));

	const addend = event.ctrlKey ? 10 : event.shiftKey ? 5 : 1;
	const newVal = item.system.quantity + addend;
	item.update({ "system.quantity": newVal });

	this.render(false);
};
/**
	 * Handle decreasing item quantity.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onItemDecrease(event) {
	event.preventDefault();
	const li = $(event.currentTarget).parents('.item');
	const item = this.actor.items.get(li.data('itemId'));

	if (item.system.quantity > 0) {
		const subtrahend = Math.min(item.system.quantity, event.ctrlKey ? 10 : event.shiftKey ? 5 : 1);
		const newVal = item.system.quantity - subtrahend;
		return item.update({ "system.quantity": newVal });
	}

	this.render(false);
};

/**
	 * Handle equipping item.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onItemEquip(event) {
	event.preventDefault();
	const li = $(event.currentTarget).parents('.item');
	const item = this.actor.items.get(li.data('itemId'));

	if (item.type === "Armor") {
		const items = Array.from(this.actor.items);
		for (let index in items) {
			const i = items[index];
			if (i.type === "Armor") {
				i.update({ "system.equipped.isEquipped": false });
			}
		}
	}

	item.update({ "system.equipped.isEquipped": true });

	this.render(false);
};

/**
	 * Handle unequipping item.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onItemUnequip(event) {
	event.preventDefault();
	const li = $(event.currentTarget).parents('.item');
	const item = this.actor.items.get(li.data('itemId'));

	item.update({ "system.equipped.isEquipped": false });

	this.render(false);
};

/**
	 * Handle showing item details.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onItemDetails(event) {
	event.preventDefault();
	const li = $(event.currentTarget).parents('.item');
	const item = this.actor.items.get(li.data('itemId'));
	const showDetails = !item.system.showDetails;

	item.update({ "system.showDetails": showDetails });

	this.render(false);
};

/**
	 * Handle item dragging.
	 * @param {Event} event   The originating drag event
	 * @private
	 */
export function onItemDrag(event) {
	const li = $(event.currentTarget);
	const item = this.actor.items.get(li.data('itemId'));
	if (item.type !== 'Container') {
		this.lastDragged = item._id;
	}
};

/**
	 * Handle dropping items on containers.
	 * @param {Event} event   The originating drop event
	 * @private
	 */
export function onItemDrop(event) {
	const li = $(event.currentTarget);
	const items = this.actor.items;
	const itemId = this.lastDragged;
	const container = items.get(li.data('itemId'));
	if (container.type === 'Container') {
		event.preventDefault();

		const containerItems = container.system.stored;
		containerItems.push(itemId);
		container.update({ "system.stored": containerItems });
		console.log(containerItems);

		this.render(false);
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
export function onContainerToggle(event) {
	event.preventDefault();
	const li = $(event.currentTarget).parents('.item');
	const item = this.actor.items.get(li.data('itemId'));
	const showStored = !item.system.showStored;

	item.update({ "system.showStored": showStored });

	this.render(false);
};
