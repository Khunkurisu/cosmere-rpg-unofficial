import Effect from "./base-effects.mjs";

export default class ModifierEffect extends Effect {
	type = 'modifier';
	func = 'add';
	value = 0;

	constructor(trigger, target, predicate, func, value) {
		super(trigger, target, predicate);
		this.func = func ?? this.func;
		this.value = value ?? this.value;
		this.value = Number.parseInt(this.value, 10);
	}

	ApplyEffect(data) {
		data = super.ApplyEffect(data);
		if (!data) return null;

		switch (this.func) {
			case 'add': {
				data.value += this.value;
				break;
			}
			case 'subtract': {
				data.value -= this.value;
				break;
			}
			case 'multiply': {
				data.value *= this.value;
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
		return data;
	}
}
