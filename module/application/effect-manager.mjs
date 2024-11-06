import * as Effects from '../system/effects.mjs';

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class EffectManager extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		tag: "form",
		form: {
			handler: EffectManager.#onSubmit,
			submitOnChange: false,
			closeOnSubmit: false,
		},
		actions: {
			create: EffectManager.createEffect,
			remove: EffectManager.removeEffect,
			cancel: EffectManager.onCancel,
		},
		window: {
			contentClasses: ["standard-form"],
		},
	}

	static PARTS = {
		form: {
			template: 'systems/cosmere-rpg-unofficial/templates/dialogs/effects.hbs'
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	static #onSubmit(event, form, formData) {
		const document = this.options.document;
		const effects = this.options.effects;

		document.update({ "system.effects": effects });
		this.close();
	}

	static onCancel(event, target) {
		this.close();
	}

	static createEffect(event, target) {
		const effects = this.options.effects;

		effects.push({
			text: "New Effect",
			progress: 0,
		});

		this.render({ force: false });
	}

	static removeEffect(event, target) {
		const dataset = target.dataset;
		const effects = this.options.effects;

		effects.splice(dataset.index, 1);

		this.render({ force: false });
	}

	async _prepareContext(options) {
		const context = {
			actor: this.options.actor,
			effects: [...this.options.effects],
			buttons: [
				{ type: "submit", icon: "fa-solid fa-save", label: "SETTINGS.Save" },
				{ type: "button", icon: "fa-solid fa-ban", label: "Cancel", action: "cancel" },
			]
		};
		context.config = CONFIG.COSMERE_UNOFFICIAL;
		return context;
	}

	getModifierList(list) {
		const modifiers = {};
		switch (list) {
			case 'attributes': {
				for (let attribute in CONFIG.COSMERE_UNOFFICIAL.attributes) {
					modifiers[attribute] = CONFIG.COSMERE_UNOFFICIAL.attributes[attribute];
				}
			}
			case 'skills': {
				for (let category in CONFIG.COSMERE_UNOFFICIAL.skills) {
					for (let skill in CONFIG.COSMERE_UNOFFICIAL.skills[category]) {
						let skillLabel = CONFIG.COSMERE_UNOFFICIAL.skills[category][skill];
						modifiers[skill] = `${skillLabel} (${category})`;
					}
				}
			}
		}
	}

	_onRender(context, options) {
		const html = $(this.element);

		html.on("change", ".effect-input", this.onEffectChange.bind(this));
	}

	/**
	 * Handle changing effect text.
	 * @param {Event} event   The originating change event
	 * @private
	 */
	onEffectChange(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
		const effects = this.options.effects;

		effects[dataset.index].text = element.value;

		this.render({ force: false });
	}
}
