export async function registerStatusEffects() {
	CONFIG.statusEffects = [
		{
			id: "dead",
			name: "Dead",
			img: "icons/svg/skull.svg"
		},
		{
			id: "unconscious",
			name: "Unconscious",
			img: "icons/svg/unconscious.svg"
		},
		{
			id: 'afflicted',
			name: 'Afflicted',
			img: 'icons/svg/poison.svg'
		},
		{
			id: 'determined',
			name: 'Determined',
			img: 'icons/svg/wing.svg'
		},
		{
			id: 'disoriented',
			name: 'Disoriented',
			img: 'icons/svg/deaf.svg'
		},
		{
			id: 'empowered',
			name: 'Empowered',
			img: 'icons/svg/aura.svg'
		},
		{
			id: 'enhanced',
			name: 'Enhanced',
			img: 'icons/svg/regen.svg'
		},
		{
			id: 'exhausted',
			name: 'Exhausted',
			img: 'icons/svg/sleep.svg'
		},
		{
			id: 'focused',
			name: 'Focused',
			img: 'icons/svg/eye.svg'
		},
		{
			id: 'immobilized',
			name: 'Immobilized',
			img: 'icons/svg/paralysis.svg'
		},
		{
			id: 'prone',
			name: 'Prone',
			img: 'icons/svg/falling.svg'
		},
		{
			id: 'restrained',
			name: 'Restrained',
			img: 'icons/svg/net.svg'
		},
		{
			id: 'slowed',
			name: 'Slowed',
			img: 'icons/svg/hazard.svg'
		},
		{
			id: 'stunned',
			name: 'Stunned',
			img: 'icons/svg/daze.svg'
		},
		{
			id: 'surprised',
			name: 'Surprised',
			img: 'icons/svg/silenced.svg'
		},
	];
}
