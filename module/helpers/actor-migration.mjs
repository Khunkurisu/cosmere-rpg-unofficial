export function validateBaseData(actor) {
	if (actor._stats.systemVersion !== game.system.version) {
		const ver = actor._stats.systemVersion.split('.');
		const release = ver[0];
		const update = ver[1];
		const revision = ver[2];
		if (release <= 0 && update <= 2 && revision <= 7) {
			if (actor.system.health) {
				if (actor.system.health.value) {
					actor.system.health = {
						value: actor.system.health.value,
						max: 10,
					};
				} else {
					actor.system.health = {
						value: 10,
						max: 10,
					};
				}
			}
			if (actor.system.focus) {
				if (actor.system.focus.value) {
					actor.system.focus = {
						value: actor.system.focus.value,
						max: 10,
					};
				} else {
					actor.system.focus = {
						value: 10,
						max: 10,
					};
				}
			}
			if (actor.system.value) {
				if (actor.system.value.value) {
					actor.system.value = {
						value: actor.system.value.value,
						max: 10,
					};
				} else {
					actor.system.value = {
						value: 10,
						max: 10,
					};
				}
			}
			actor.system.movement = {
				ground: 20,
			}
		}
		actor._stats.systemVersion = game.system.version;
	}
}
