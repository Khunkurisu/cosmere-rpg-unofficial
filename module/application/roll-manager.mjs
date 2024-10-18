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
			cancel: RollManager.onCancel,
		},
		window: {
			contentClasses: ["standard-form"],
		},
	}

	static PARTS = {
		form: {
			template: 'systems/cosmere-rpg-unofficial/templates/chat/roll-popup.hbs'
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	static #onSubmit(event, form, formData) {
		const context = this.options.context;
		const actor = this.options.actor;
		const rollData = this.options.rollData;
		if (context.hasAdvantage) {
			if (!context.hasDisadvantage) {
				rollData = `{${rollData}, ${rollData}}kh`;
			}
		}
		if (context.hasDisadvantage) {
			if (!context.hasAdvantage) {
				rollData = `{${rollData}, ${rollData}}kl`;
			}
		}

		let roll = new Roll(rollData, actor.getRollData());
		if (Hooks.call("system.preRoll", roll) === false) return;

		roll.toMessage({
			flags: { cosmere: flags },
			speaker: ChatMessage.getSpeaker({ actor: actor }),
			flavor: label,
			rollMode: game.settings.get('core', 'rollMode'),
		});

		if (context.usePlotDice) {
			let plotData = "1d6";
			let plotRoll = new Roll(plotData, actor.getRollData());

			plotRoll.toMessage({
				flags: { cosmere: flags },
				speaker: ChatMessage.getSpeaker({ actor: actor }),
				flavor: 'Raise the Stakes!',
				rollMode: game.settings.get('core', 'rollMode'),
			});
		}
	}

	static onCancel(event, target) {
		this.close();
	}

	static createModifier(event, target) {
		console.log(event);
		console.log(target);
		/* const modifiers = this.options.modifiers;

		modifiers.push({
			label: "New Modifier",
			value: 0,
		});
		console.log(modifiers); */

		this.render({ force: false });
	}

	static removeModifier(event, target) {
		const dataset = target.dataset;
		const modifiers = this.options.modifiers;

		modifiers.splice(dataset.index, 1);

		this.render({ force: false });
	}

	async _prepareContext(options) {
		const context = {
			actor: this.options.actor,
			rollLabel: this.options.label,
			rollFlags: this.options.flags,
			selectors: this.options.rollSelectors,
			rollData: this.options.rollData,
			hasAdvantage: this.options.hasAdvantage,
			hasDisadvantage: this.options.hasDisadvantage,
			usePlotDice: this.options.usePlotDice,
			modifiers: [...this.options.modifiers],
			buttons: [
				{ type: "submit", icon: "fa-solid fa-dice", label: "Roll" },
				{ type: "button", icon: "fa-solid fa-ban", label: "Cancel", action: "cancel" },
			]
		};
		context.config = CONFIG.COSMERE_UNOFFICIAL;
		return context;
	}

	_onRender(context, options) {
		const html = $(this.element);
		console.log(context);

		html.on("change", ".roll-input", this.onRollChange.bind(this));
	}

	/**
	 * Handle changing roll text.
	 * @param {Event} event   The originating change event
	 * @private
	 */
	onRollChange(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
		const modifiers = this.options.modifiers;

		modifiers[dataset.index][dataset.target] = element.value;

		this.render({ force: false });
	}
}
