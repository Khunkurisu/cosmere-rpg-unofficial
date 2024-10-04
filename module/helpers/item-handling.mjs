/**
	 * Handle increasing item quantity.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onItemIncrease(event) {
	event.preventDefault();
	const li = $(event.currentTarget).parents('.item');
	const item = this.actor.items.get(li.data('itemId'));

	item.system.quantity++;

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

	item.system.quantity--;
	if (item.system.quanity < 0) item.system.quanity = 0;

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

	item.system.equipped = true;

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

	item.system.equipped = false;

	this.render(false);
};
