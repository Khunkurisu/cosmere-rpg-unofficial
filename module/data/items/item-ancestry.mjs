import CosmereUnofficialItemBase from "../base-item.mjs";

export default class CosmereUnofficialAncestry extends CosmereUnofficialItemBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const schema = super.defineSchema();

		schema.talents = new fields.ArrayField(new fields.StringField());
		schema.keyTalent = new fields.ObjectField();

		return schema;
	}
}
