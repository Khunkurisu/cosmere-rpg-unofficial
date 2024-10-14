import CosmereUnofficialActorBase from "../base-actor.mjs";

export default class CosmereUnofficialAdversary extends CosmereUnofficialActorBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		schema.tier = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 });
		schema.role = new fields.StringField({ required: true, blank: true });
		schema.type = new fields.StringField({ required: true, blank: true });

		schema.notes = new fields.StringField({ required: true, blank: true });

		return schema;
	}
}
