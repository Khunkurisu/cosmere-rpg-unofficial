export default class Effect {
	type = 'base';
	trigger = 'base';
	target = '';
	predicate = [];

	constructor(trigger, target, predicate) {
		this.trigger = trigger ?? this.trigger;
		this.target = target ?? this.target;
		this.predicate = predicate ?? this.predicate;
	}

	TryApplyEffect(trigger, data) {
		if (trigger === this.trigger) {
			return this.ApplyEffect(data);
		}
		return null;
	}

	ApplyEffect(data) {
		if (this.predicate.length > 0) {
			for (let circumstance of data.circumstances) {
				if (this.predicate.indexOf(circumstance) > -1) {
					return data;
				}
			}
			return null;
		}
		return data;
	}
}
