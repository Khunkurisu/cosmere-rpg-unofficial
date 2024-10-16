import CosmereUnofficialItemBase from "../base-item.mjs";

export default class CosmereUnofficialEffect extends CosmereUnofficialItemBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		schema.active = new fields.BooleanField({ initial: false });

		schema.duration = new fields.SchemaField({
			value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			unit: new fields.StringField({ initial: "round" })
		});

		schema.hasToggle = new fields.BooleanField({ initial: false });
		schema.effects = new fields.ArrayField(new fields.ObjectField());
		schema.effectCreateType = new fields.StringField({ initial: "modifier" });

		return schema;
	}
}
