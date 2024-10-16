import Effect from "./base-effects.mjs";

export default class DiceEffect extends Effect {
	type = 'dice';
	value = true;

	constructor(trigger, target, predicate, value) {
		super(trigger, target, predicate);
		this.value = value ?? this.value;
	}

	ApplyEffect(data) {
		data = super.ApplyEffect(data);
		if (!data) return null;

		console.log(this.target);

		switch (this.target) {
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
