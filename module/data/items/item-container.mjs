import CosmereUnofficialEquipment from "./item-equipment.mjs";

export default class CosmereUnofficialContainer extends CosmereUnofficialEquipment {
	static defineSchema() {
		const fields = foundry.data.fields;
		const schema = super.defineSchema();

		schema.stored = new fields.ArrayField(new fields.StringField());
		schema.items = new fields.ArrayField(new fields.ObjectField());
		schema.showStored = new fields.BooleanField({ required: true, initial: false });

		return schema;
	}

	get totalWeight() {
		let weight = 0;
		this.items.forEach(function (item) {
			weight += item.system.weight * item.system.quantity ?? 0;
		});
		return weight;
	}
}
