import CosmereUnofficialItemBase from "../base-item.mjs";

export default class CosmereUnofficialAction extends CosmereUnofficialItemBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		schema.cost = new fields.NumberField({ ...requiredInteger, initial: 0, min: -1 });
		schema.unit = new fields.StringField({ required: true, initial: 'actions' });

		return schema;
	}
}
