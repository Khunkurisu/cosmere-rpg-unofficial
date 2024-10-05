import CosmereUnofficialItemBase from "../base-item.mjs";

export default class CosmereUnofficialEquipment extends CosmereUnofficialItemBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		schema.quantity = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 });
		schema.weight = new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 });
		schema.price = new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 });
		schema.equipped = new fields.BooleanField({ required: true, nullable: false, initial: false });

		return schema;
	}
}
