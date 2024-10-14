import CosmereUnofficialEquipment from "./item-equipment.mjs";

export default class CosmereUnofficialGear extends CosmereUnofficialEquipment {
	static defineSchema() {
		const fields = foundry.data.fields;
		const schema = super.defineSchema();

		schema.traits = new fields.ObjectField();
		schema.expert = new fields.ObjectField();

		return schema;
	}
}
