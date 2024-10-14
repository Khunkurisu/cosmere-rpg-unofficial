import CosmereUnofficialGear from "./item-gear.mjs";

export default class CosmereUnofficialArmor extends CosmereUnofficialGear {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		schema.deflect = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })

		return schema;
	}
}
