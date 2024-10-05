import CosmereUnofficialActorBase from "../base-actor.mjs";

export default class CosmereUnofficialPlayer extends CosmereUnofficialActorBase {
	static defineSchema() {
		console.log("player");
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = super.defineSchema();

		schema.level = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 });

		schema.biography = new fields.SchemaField({
			backstory: new fields.StringField({ required: true, blank: true }),
			purpose: new fields.StringField({ required: true, blank: true }),
			obstacle: new fields.StringField({ required: true, blank: true }),
			goals: new fields.ObjectField(),
			connections: new fields.ObjectField()
		});

		schema.ancestry = new fields.ObjectField();
		schema.path = new fields.ObjectField();

		return schema;
	}
}