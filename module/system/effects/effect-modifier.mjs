import Effect from "../base-effects.mjs";

export class ModifierEffect extends Effect {
	func = 'add';
	value = 0;

	constructor(trigger, target, predicate, func, value) {
		super(trigger, target, predicate);
		this.func = func ?? this.func;
		this.value = value ?? this.value;
	}

	ApplyEffect(data) {
		data = super.ApplyEffect(data);
		if (!data) return null;

		switch (func) {
			case 'add': {
				data.value += this.value;
				break;
			}
			case 'subtract': {
				data.value -= this.value;
				break;
			}
			case 'increase': {
				if (data.value < this.value) {
					data.value = this.value;
				}
				break;
			}
			case 'decrease': {
				if (data.value > this.value) {
					data.value = this.value;
				}
				break;
			}
			case 'override': {
				data.value = this.value;
				break;
			}
		}
	}
}
