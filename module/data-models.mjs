

class PlayerData extends BaseActorDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			"level": 1,
			"biography": {
				"backstory": "",
				"goals": {},
				"connections": {},
				"purpose": "",
				"obstacle": ""
			},
			"ancestry": null,
			"path": null,
			"marks": 0
		}
	}
}

class AdversaryData extends BaseActorDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			"tier": 1,
			"role": "",
			"type": "",
			"notes": ""
		}
	}
}

class BaseItemDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		return {
			"description": ""
		}
	}
}

class ItemDataModel extends BaseItemDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			"price": 0,
			"weight": 0,
			"quantity": 1,
			"equipped": false
		}
	}
}

class EquipmentDataModel extends ItemDataModel {
	static defineSchema() {
		return {
			...super.defineSchema(),
			"traits": [],
			"expert": []
		}
	}
}
