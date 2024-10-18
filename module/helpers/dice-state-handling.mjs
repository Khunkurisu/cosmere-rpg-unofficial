import { RollManager } from "../application/roll-manager.mjs";

/**
 * Handle managing roll.
 * @param {Object} context Context of the originating sheet
 * @private
 */
export function onRollManage(context) {
	const options = {
		...context,
		window: {
			resizable: false,
			title: "Manage Roll",
		},
	};

	new RollManager(options).render({ force: true });
};
