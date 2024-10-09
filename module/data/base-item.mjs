import CosmereUnofficialDataModel from "./base-model.mjs";

export default class CosmereUnofficialItemBase extends CosmereUnofficialDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const schema = {};

		schema.description = new fields.StringField({ required: true, blank: true });
		schema.showDetails = new fields.BooleanField({ required: true, initial: false });

		return schema;
	}
}
