import CosmereUnofficialActorBase from "../base-actor.mjs";

export default class CosmereUnofficialPlayer extends CosmereUnofficialDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const schema = {};

		schema.members = new fields.ArrayField(new fields.SchemaField());

		return schema;
	}
}
