import { ConnectionManager } from "../application/connection-manager.mjs";

/**
 * Handle managing connection.
 * @param {Event} event   The originating click event
 * @private
 */
export async function onConnectionManage(event) {
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

	this.render(false);
};

/**
	 * Handle adding connections.
	 * @param {Event} event   The originating click event
	 * @private
	 */
export function onConnectionCreate(event) {
	event.preventDefault();
	const system = this.actor.system;
	const connections = system.biography.connections

	const count = Object.keys(connections).length;
	connections["entry-" + (count + 1)] = "New Connection";

	this.render(false);
};

/**
 * Handle removing connections.
 * @param {Event} event   The originating click event
 * @private
 */
export function onConnectionRemove(event) {
	event.preventDefault();
	const element = event.currentTarget;
	const dataset = element.dataset;

	const system = this.actor.system;
	const connections = system.biography.connections

	const index = [];
	for (var x in connections) {
		index.push(x);
	}
	delete connections[index[dataset.key]];

	this.render(false);
};
