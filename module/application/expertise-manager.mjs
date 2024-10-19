const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class ExpertiseManager extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		tag: "form",
		form: {
			handler: ExpertiseManager.#onSubmit,
			submitOnChange: false,
			closeOnSubmit: false,
		},
		actions: {
			create: ExpertiseManager.createExpertise,
			remove: ExpertiseManager.removeExpertise,
			cancel: ExpertiseManager.onCancel,
		},
		window: {
			contentClasses: ["standard-form"],
		},
	}

	static PARTS = {
		form: {
			template: 'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-expertise.hbs'
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	static #onSubmit(event, form, formData) {
		const actor = this.options.actor;
		const expertise = [
			...this.options.Utility,
			...this.options.Cultural,
			...this.options.Weapon,
			...this.options.Armor,
			...this.options.Special,
		];
		actor.update({ "system.expertise": expertise });
		this.close();
	}

	static onCancel(event, target) {
		this.close();
	}

	static createExpertise(event, target) {
		const dataset = target.dataset;
		const expertise = this.options[dataset.type];

		expertise.push({
			"text": "New expertise",
			"category": dataset.type,
			"source": "default",
		});

		this.render({ force: false });
	}

	static removeExpertise(event, target) {
		const dataset = target.dataset;
		const expertise = this.options[dataset.type];

		expertise.splice(dataset.index, 1);

		this.render({ force: false });
	}

	async _prepareContext(options) {
		const context = {
			actor: this.options.actor,
			utilityExpertise: this.options.Utility,
			culturalExpertise: this.options.Cultural,
			weaponExpertise: this.options.Weapon,
			armorExpertise: this.options.Armor,
			specialExpertise: this.options.Special,
			buttons: [
				{ type: "submit", icon: "fa-solid fa-save", label: "SETTINGS.Save" },
				{ type: "button", icon: "fa-solid fa-ban", label: "Cancel", action: "cancel" },
			]
		};
		context.config = CONFIG.COSMERE_UNOFFICIAL;
		return context;
	}

	_onRender(context, options) {
		const html = $(this.element);

		html.on("change", ".expertise-input", this.onExpertiseChange.bind(this));
	}

	/**
	 * Handle changing expertise text.
	 * @param {Event} event   The originating change event
	 * @private
	 */
	onExpertiseChange(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
		const expertise = this.options[dataset.type];

		expertise[dataset.index].text = element.value;

		this.render({ force: false });
	}
}
