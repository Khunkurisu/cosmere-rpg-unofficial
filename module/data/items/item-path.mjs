import CosmereUnofficialItemBase from "../base-item.mjs";

export default class CosmereUnofficialPath extends CosmereUnofficialItemBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const schema = super.defineSchema();

		schema.specialties = new fields.ArrayField(new fields.ObjectField());
		schema.talents = new fields.ArrayField(new fields.ObjectField());

		schema.skill = new fields.StringField({ initial: "talent" });
		schema.keyTalent = new fields.ObjectField();
		schema.isHeroic = new fields.BooleanField({ initial: false });

		return schema;
	}
}
