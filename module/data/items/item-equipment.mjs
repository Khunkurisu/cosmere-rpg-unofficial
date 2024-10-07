import CosmereUnofficialItemBase from "../base-item.mjs";

export default class CosmereUnofficialEquipment extends CosmereUnofficialItemBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		schema.quantity = new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 });
		schema.weight = new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 });
		schema.price = new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 });
		schema.equipped = new fields.SchemaField({
			isEquipped: new fields.BooleanField({ required: true, nullable: false, initial: false }),
			slot: new fields.StringField({ initial: "worn" }),
			hands: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
		});

		return schema;
	}

	get totalWeight() {
		return this.quantity * this.weight;
	}

	get totalPrice() {
		return this.quantity * this.price;
	}

	get isEquipped() {
		return this.equipped.isEquipped;
	}
}
