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
			goals: new fields.ArrayField(new fields.ObjectField()),
			connections: new fields.ArrayField(new fields.ObjectField()),
			height: new fields.StringField(),
			weight: new fields.StringField(),
			age: new fields.StringField(),
			ethnicity: new fields.StringField(),
		});

		schema.ancestry = new fields.ObjectField();
		schema.path = new fields.ArrayField(new fields.ObjectField());

		return schema;
	}

	static migrateData(source) {
		source = super.migrateData(source);
		let ver = source.ver ?? "0.2.4";
		const version = ver.split('.');
		const release = Number.parseInt(version[0], 10);
		const update = Number.parseInt(version[1], 10);
		const revision = Number.parseInt(version[2], 10);

		if (release <= 0 && update <= 2 && revision < 4) {
			const originalPath = { ...(source.path) };
			source.path = originalPath.hasOwnProperty('talents') ? [originalPath] : [];
		}

		return source;
	}
}
