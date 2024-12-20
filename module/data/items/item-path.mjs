import CosmereUnofficialItemBase from "../base-item.mjs";

export default class CosmereUnofficialPath extends CosmereUnofficialItemBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const schema = super.defineSchema();

		schema.specialties = new fields.ArrayField(new fields.StringField());
		schema.talents = new fields.ArrayField(new fields.ObjectField());

		schema.skill = new fields.StringField({ initial: "athletics" });
		schema.keyTalent = new fields.ObjectField();
		schema.isRadiant = new fields.BooleanField({ initial: false });
		schema.skills = new fields.ArrayField(new fields.StringField());

		return schema;
	}
}
