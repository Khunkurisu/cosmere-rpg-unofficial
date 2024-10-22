const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class RollManager extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		tag: "form",
		form: {
			handler: RollManager.#onSubmit,
			submitOnChange: false,
			closeOnSubmit: false,
		},
		actions: {
			create: RollManager.createModifier,
			remove: RollManager.removeModifier,
			toggle: RollManager.toggleModifier,
			cancel: RollManager.onCancel,
		},
		window: {
			contentClasses: ["standard-form"],
		},
		position: {
			width: 400,
			height: "auto",
		}
	}

	static PARTS = {
		form: {
			template: 'systems/cosmere-rpg-unofficial/templates/dialogs/roll-popup.hbs'
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	static #onSubmit(event, form, formData) {
		const dice = { ...this.options.dice };
		const flags = { ...this.options.rollFlags };
		const actor = this.options.actor;
		const modifiers = [...dice.modifiers];

		modifiers.forEach(modifier => {
			if (!modifier.enabled) return;
			let mod = modifier.value > 0 ? ` + ${modifier.value}` : ` - ${modifier.value}`;
			dice.rollData += `${mod}[${modifier.label}]`;
		});

		if (dice.hasAdvantage) {
			if (!dice.hasDisadvantage) {
				dice.rollData = `{${dice.rollData}, ${dice.rollData}}kh`;
			}
		}
		if (dice.hasDisadvantage) {
			if (!dice.hasAdvantage) {
				dice.rollData = `{${dice.rollData}, ${dice.rollData}}kl`;
			}
		}

		let roll = new Roll(dice.rollData, actor.getRollData());
		if (Hooks.call("system.preRoll", roll) === false) return;

		if (dice.usePlotDice) {
			let plotData = "1d6";
			let plotRoll = new Roll(plotData, actor.getRollData());
			if (Hooks.call("system.preRoll", roll) === false) return;

			plotRoll.toMessage({
				flags: { cosmere: flags },
				speaker: ChatMessage.getSpeaker({ actor: actor }),
				flavor: 'Raise the Stakes!',
				rollMode: game.settings.get('core', 'rollMode'),
			});
		}

		roll.toMessage({
			flags: { cosmere: flags },
			speaker: ChatMessage.getSpeaker({ actor: actor }),
			flavor: this.options.rollLabel,
			rollMode: game.settings.get('core', 'rollMode'),
		});

		this.close();
	}

	static onCancel(event, target) {
		this.close();
	}

	static createModifier(event, target) {
		const parent = $(target).parents('.modifier-fields');
		const label = $(parent).children()[0];
		const value = $(parent).children()[1];
		const modifiers = this.options.dice.modifiers;
		let l = label.value ?? 'misc';
		if (!l || l === '') l = 'misc';
		let v = value.value ?? 0;
		if ((!v && v !== 0) || v === '' || v === NaN) v = 0;

		if (v !== 0) {
			modifiers.push({
				label: l,
				value: v,
				enabled: true,
			});

			this.render({ force: false });
		}
	}

	static removeModifier(event, target) {
		const dataset = target.dataset;
		const modifiers = this.options.dice.modifiers;

		modifiers.splice(dataset.index, 1);

		this.render({ force: false });
	}

	static toggleModifier(event, target) {
		const dataset = target.dataset;
		const options = this.options.dice;

		switch (dataset.target) {
			case 'plot-dice': {
				options.usePlotDice = !options.usePlotDice;
				break;
			}
			case 'disadvantage': {
				options.hasDisadvantage = !options.hasDisadvantage;
				break;
			}
			case 'advantage': {
				options.hasAdvantage = !options.hasAdvantage;
				break;
			}
			case 'modifier': {
				const modifier = options.modifiers[dataset.index];
				modifier.enabled = !modifier.enabled;
			}
		}

		this.render({ force: false });
	}

	async _prepareContext(options) {
		const context = {
			actor: this.options.actor,
			rollLabel: this.options.label,
			rollFlags: this.options.flags,
			selectors: this.options.rollSelectors,
			dice: { ...this.options.dice },
			buttons: [
				{ type: "submit", icon: "fa-solid fa-dice", label: "Roll" },
				{ type: "button", icon: "fa-solid fa-ban", label: "Cancel", action: "cancel" },
			]
		};
		context.config = CONFIG.COSMERE_UNOFFICIAL;
		return context;
	}
}
