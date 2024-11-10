import CosmereUnofficialDataModel from "./base-model.mjs";
import { isNumeric, isNumber } from "../helpers/javascript.mjs";

export default class CosmereUnofficialActorBase extends CosmereUnofficialDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = {
			"health": new fields.SchemaField({
				"value": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
				"max": new fields.NumberField({ ...requiredInteger, initial: 10 })
			}),
			"focus": new fields.SchemaField({
				"value": new fields.NumberField({ ...requiredInteger, initial: 2, min: 0 }),
				"max": new fields.NumberField({ ...requiredInteger, initial: 2 })
			}),
			"investiture": new fields.SchemaField({
				"value": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
				"max": new fields.NumberField({ ...requiredInteger, initial: 0 })
			}),
			"deflect": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
			"physical": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
			"cognitive": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
			"spiritual": new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
			"size": new fields.StringField({ initial: "medium" }),
			"expertise": new fields.ArrayField(new fields.ObjectField()),
			"movement": new fields.SchemaField({
				"ground": new fields.NumberField({ ...requiredInteger, initial: 25, min: 5 })
			}),
			"senses": new fields.NumberField({ ...requiredInteger, initial: 5, min: 5 }),
			"marks": new fields.NumberField({ required: true, nullable: false, initial: 0, min: 0 }),
			"capacity": new fields.SchemaField({
				"maxLift": new fields.NumberField({ ...requiredInteger, initial: 5, min: 5 }),
				"maxCarry": new fields.NumberField({ ...requiredInteger, initial: 5, min: 5 }),
				"carrying": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
			}),
			"recovery": new fields.NumberField({ ...requiredInteger, initial: 4, min: 4 })
		}

		// Iterate over attribute names and create a new SchemaField for each.
		schema.attributes = new fields.SchemaField(
			Object.keys(CONFIG.COSMERE_UNOFFICIAL.attributes).reduce((obj, attribute) => {
				obj[attribute] = new fields.SchemaField({
					base: new fields.NumberField({ ...requiredInteger, initial: 0 }),
					value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
				});
				return obj;
			}, {}));

		schema.skills = new fields.SchemaField({
			"physical": new fields.SchemaField({
				"athletics": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "strength" })
				}),
				"agility": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "speed" })
				}),
				"heavy_weapons": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "strength" })
				}),
				"light_weapons": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "speed" })
				}),
				"stealth": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "speed" })
				}),
				"thievery": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "speed" })
				})
			}),
			"cognitive": new fields.SchemaField({
				"crafting": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "intellect" })
				}),
				"deduction": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "intellect" })
				}),
				"discipline": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "willpower" })
				}),
				"intimidation": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "willpower" })
				}),
				"lore": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "intellect" })
				}),
				"medicine": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "intellect" })
				})
			}),
			"spiritual": new fields.SchemaField({
				"deception": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "presence" })
				}),
				"insight": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "awareness" })
				}),
				"leadership": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "presence" })
				}),
				"perception": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "awareness" })
				}),
				"persuasion": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "presence" })
				}),
				"survival": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "awareness" })
				})
			}),
			"surge": new fields.SchemaField({
				"adhesion": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "presence" }),
					"show": new fields.BooleanField({ initial: false })
				}),
				"gravitation": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "awareness" }),
					"show": new fields.BooleanField({ initial: false })
				}),
				"division": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "intellect" }),
					"show": new fields.BooleanField({ initial: false })
				}),
				"abrasion": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "speed" }),
					"show": new fields.BooleanField({ initial: false })
				}),
				"progression": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "awareness" }),
					"show": new fields.BooleanField({ initial: false })
				}),
				"illumination": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "presence" }),
					"show": new fields.BooleanField({ initial: false })
				}),
				"transformation": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "willpower" }),
					"show": new fields.BooleanField({ initial: false })
				}),
				"transportation": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "intellect" }),
					"show": new fields.BooleanField({ initial: false })
				}),
				"cohesion": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "willpower" }),
					"show": new fields.BooleanField({ initial: false })
				}),
				"tension": new fields.SchemaField({
					"value": new fields.NumberField({ ...requiredInteger, initial: 0 }),
					"bonusRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"initialRank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
					"rank": new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
					"attribute": new fields.StringField({ initial: "strength" }),
					"show": new fields.BooleanField({ initial: false })
				}),
			}),
		});

		return schema;
	}
}
