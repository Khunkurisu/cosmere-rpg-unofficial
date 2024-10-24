import { isNumber } from "../helpers/objects.mjs";
import CosmereUnofficialDataModel from "./base-model.mjs";
import { version as currentVersion } from "../cosmere-rpg-unofficial.mjs";

export default class CosmereUnofficialActorBase extends CosmereUnofficialDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const requiredInteger = { required: true, nullable: false, integer: true };
		const schema = {
			"ver": new fields.StringField({ required: true, nullable: false, initial: currentVersion }),
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
			})
		});

		return schema;
	}
}

function isNumeric(str) {
	if (typeof str != "string") return false // we only process strings!
	return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
