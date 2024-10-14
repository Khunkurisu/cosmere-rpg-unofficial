import Effect from "./base-effects.mjs";

export default class DiceEffect extends Effect {
	type = 'dice';
	func = 'advantage';
	value = true;

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
			case 'advantage': {
				data.key = 'hasAdvantage'
				break;
			}
			case 'disadvantage': {
				data.key = 'hasDisadvantage'
				break;
			}
			case 'plot': {
				data.key = 'usePlotDice'
				break;
			}
		}
		data.value = this.value;
		return data;
	}
}
