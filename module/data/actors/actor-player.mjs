import CosmereUnofficialActorBase from "../base-actor.mjs";

export default class CosmereUnofficialPlayer extends CosmereUnofficialActorBase {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		schema.level = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 });

		schema.biography = new fields.SchemaField({
			backstory: new fields.StringField({ required: true, blank: true }),
			purpose: new fields.StringField({ required: true, blank: true }),
			obstacle: new fields.StringField({ required: true, blank: true }),
			goals: new fields.SchemaField({}),
			connections: new fields.SchemaField({})
		});

		schema.ancestry = new fields.SchemaField({});
		schema.path = new fields.SchemaField({});

		return schema;
	}
}
