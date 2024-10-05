import CosmereUnofficialDataModel from "../base-model.mjs";

export default class CosmereUnofficialParty extends CosmereUnofficialDataModel {
	static LOCALIZATION_PREFIXES = ["COSMERE_UNOFFICIAL"];

	static defineSchema() {
		console.log("party");
		const fields = foundry.data.fields;
		const schema = {};

		schema.members = new fields.ArrayField(new fields.ObjectField());

		return schema;
	}
}
