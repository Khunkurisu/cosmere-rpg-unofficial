const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class ConnectionManager extends HandlebarsApplicationMixin(ApplicationV2) {
	static DEFAULT_OPTIONS = {
		tag: "form",
		form: {
			handler: ConnectionManager.#onSubmit,
			submitOnChange: false,
			closeOnSubmit: false,
		},
		actions: {
			create: ConnectionManager.createConnection,
			remove: ConnectionManager.removeConnection,
			cancel: ConnectionManager.onCancel,
		},
		window: {
			contentClasses: ["standard-form"],
		},
	}

	static PARTS = {
		form: {
			template: 'systems/cosmere-rpg-unofficial/templates/dialogs/actor-connections.hbs'
		},
		footer: {
			template: "templates/generic/form-footer.hbs",
		},
	}

	static #onSubmit(event, form, formData) {
		const actor = this.options.actor;
		const connections = this.options.connections;
		actor.update({ "system.biography.connections": connections });
		this.close();
	}

	static onCancel(event, target) {
		this.close();
	}

	static createConnection(event, target) {
		const connections = this.options.connections;

		connections.push("New Connection");

		this.render({ force: false });
	}

	static removeConnection(event, target) {
		const dataset = target.dataset;
		const connections = this.options.connections;

		connections.splice(dataset.index, 1);

		this.render({ force: false });
	}

	async _prepareContext(options) {
		const context = {
			actor: this.options.actor,
			connections: [...this.options.connections],
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

		html.on("change", ".connection-input", this.onConnectionChange.bind(this));
	}

	/**
	 * Handle changing connection text.
	 * @param {Event} event   The originating change event
	 * @private
	 */
	onConnectionChange(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
		const connections = this.options.connections;

		connections[dataset.index] = element.value;

		this.render({ force: false });
	}
}
