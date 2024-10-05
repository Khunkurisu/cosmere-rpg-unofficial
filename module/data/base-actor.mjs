import CosmereUnofficialDataModel from "./base-model.mjs";

export default class CosmereUnofficialActorBase extends CosmereUnofficialDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = {
			"health": {
				"value": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
				"max": new fields.NumberField({ ...requiredInteger, initial: 10 })
			},
			"focus": {
				"value": new fields.NumberField({ ...requiredInteger, initial: 2, min: 0 }),
				"max": new fields.NumberField({ ...requiredInteger, initial: 2 })
			},
			"investiture": {
				"value": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
				"max": new fields.NumberField({ ...requiredInteger, initial: 0 })
			},
			"deflect": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			"physical": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
			"cognitive": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
			"spiritual": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
			"size": "medium",
			"expertise": {},
			"movement": {
				"ground": new fields.NumberField({ ...requiredInteger, initial: 25, min: 5 })
			},
			"senses": new fields.NumberField({ ...requiredInteger, initial: 5, min: 5 }),
			"marks": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
		}

		// Iterate over attribute names and create a new SchemaField for each.
		schema.attributes = new fields.SchemaField(Object.keys(CONFIG.COSMERE_UNOFFICIAL.attributes).reduce((obj, attribute) => {
			obj[attribute] = new fields.SchemaField({
				value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
			});
			return obj;
		}, {}));

		schema.skills = new fields.SchemaField({
			"physical": {
				"athletics": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "strength"
				},
				"agility": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "speed"
				},
				"heavy_weapons": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "strength"
				},
				"light_weapons": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "speed"
				},
				"stealth": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "speed"
				},
				"thievery": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "speed"
				}
			},
			"cognitive": {
				"crafting": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "intellect"
				},
				"deduction": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "intellect"
				},
				"discipline": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "willpower"
				},
				"intimidation": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "willpower"
				},
				"lore": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "intellect"
				},
				"medicine": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "intellect"
				}
			},
			"spiritual": {
				"deception": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "presence"
				},
				"insight": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "awareness"
				},
				"leadership": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "presence"
				},
				"perception": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "awareness"
				},
				"persuasion": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "presence"
				},
				"survival": {
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonus": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"attribute": "awareness"
				}
			}
		});

		return schema;
	}
}
