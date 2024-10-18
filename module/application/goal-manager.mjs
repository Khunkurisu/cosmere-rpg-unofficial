const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class GoalManager extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		tag: "form",
		form: {
			handler: GoalManager.#onSubmit,
			submitOnChange: false,
			closeOnSubmit: false,
		},
		actions: {
			create: GoalManager.createGoal,
			remove: GoalManager.removeGoal,
			cancel: GoalManager.onCancel,
		},
		window: {
			contentClasses: ["standard-form"],
		},
	}

	static PARTS = {
		form: {
			template: 'systems/cosmere-rpg-unofficial/templates/actor/parts/actor-goals.hbs'
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	static #onSubmit(event, form, formData) {
		const actor = this.options.actor;
		const goals = this.options.goals;
		console.log(goals);
		actor.update({ "system.goal": goals });
		this.close();
	}

	static onCancel(event, target) {
		this.close();
	}

	static createGoal(event, target) {
		const dataset = target.dataset;
		const goal = this.options[dataset.type];

		goal.push({
			text: "New Goal",
			progress: 0,
		});

		this.render({ force: false });
	}

	static removeGoal(event, target) {
		const dataset = target.dataset;
		const goal = this.options[dataset.type];

		goal.splice(dataset.index, 1);

		this.render({ force: false });
	}

	async _prepareContext(options) {
		const context = {
			actor: this.options.actor,
			goals: [...this.options.actor.system.biography.goals],
			buttons: [
				{ type: "submit", icon: "fa-solid fa-save", label: "SETTINGS.Save" },
				{ type: "button", icon: "fa-solid fa-ban", label: "Cancel", action: "cancel" },
			]
		};
		return context;
	}

	_onRender(context, options) {
		const html = $(this.element);
		console.log(context);

		html.on("change", ".goal-input", this.onGoalChange.bind(this));
	}

	/**
	 * Handle changing goal text.
	 * @param {Event} event   The originating change event
	 * @private
	 */
	onGoalChange(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
		const goal = this.options[dataset.type];

		goal[dataset.index].text = element.value;

		this.render({ force: false });
	}
}
