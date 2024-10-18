import CosmereUnofficialDataModel from "./base-model.mjs";
import { version as currentVersion } from "../cosmere-rpg-unofficial.mjs";

export default class CosmereUnofficialItemBase extends CosmereUnofficialDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const schema = {
			"ver": new fields.StringField({ initial: currentVersion })
		};

		schema.description = new fields.StringField({ required: true, blank: true });
		schema.showDetails = new fields.BooleanField({ required: true, initial: false });

		return schema;
	}

	static migrateData(source) {
		if (!source.ver) source.ver = "0.2.4";
		const version = source.ver.split('.');
		const release = Number.parseInt(version[0], 10);
		const update = Number.parseInt(version[1], 10);
		const revision = Number.parseInt(version[2], 10);

		//if (release <= 0 && update <= 2 && revision < 3) { }

		source.ver = currentVersion;
		return super.migrateData(source);
	}
}
