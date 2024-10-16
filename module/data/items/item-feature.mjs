import CosmereUnofficialItemBase from "../base-item.mjs";

export default class CosmereUnofficialFeature extends CosmereUnofficialItemBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		schema.type = new fields.StringField({ initial: "Path" });

		schema.active = new fields.BooleanField({ initial: false });
		schema.effects = new fields.ArrayField(new fields.ObjectField());
		schema.effectCreateType = new fields.StringField({ initial: "modifier" });
		schema.hasToggle = new fields.BooleanField({ initial: false });

		schema.hasAction = new fields.BooleanField({ initial: false });
		schema.cost = new fields.NumberField({ ...requiredInteger, initial: 0, min: -2 });

		return schema;
	}
}
