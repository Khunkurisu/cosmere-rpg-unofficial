import CosmereUnofficialItemBase from "../base-item.mjs";

export default class CosmereUnofficialFeature extends CosmereUnofficialItemBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		schema.level = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 });
		schema.type = new fields.StringField({ initial: "Ancestry" });

		return schema;
	}
}
