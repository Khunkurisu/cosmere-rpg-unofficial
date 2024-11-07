export function validateBaseData(actor) {
	const system = actor.system;
	if (actor._stats.systemVersion !== game.system.version) {
		const ver = actor._stats.systemVersion.split('.');
		const release = ver[0];
		const update = ver[1];
		const revision = ver[2];
		if (release <= 0 && update <= 2 && revision <= 10) {
			system.attributes.strength.base = system.attributes.strength.value;
			system.attributes.speed.base = system.attributes.speed.value;
			system.attributes.intellect.base = system.attributes.intellect.value;
			system.attributes.willpower.base = system.attributes.willpower.value;
			system.attributes.awareness.base = system.attributes.awareness.value;
			system.attributes.presence.base = system.attributes.presence.value;
		}
		else if (release <= 0 && update <= 2 && revision <= 7) {
			if (system.health) {
				if (system.health.value) {
					system.health = {
						value: system.health.value,
						max: 10,
					};
				} else {
					system.health = {
						value: 10,
						max: 10,
					};
				}
			}
			if (system.focus) {
				if (system.focus.value) {
					system.focus = {
						value: system.focus.value,
						max: 10,
					};
				} else {
					system.focus = {
						value: 10,
						max: 10,
					};
				}
			}
			if (system.value) {
				if (system.value.value) {
					system.value = {
						value: system.value.value,
						max: 10,
					};
				} else {
					system.value = {
						value: 10,
						max: 10,
					};
				}
			}
			system.movement = {
				ground: 20,
			}
		}
		actor._stats.systemVersion = game.system.version;
	}
}
