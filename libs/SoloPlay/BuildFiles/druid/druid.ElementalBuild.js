/**
*  @filename    druid.ElementalBuild.js
*  @author      thatflykid, isid0re, theBGuy
*  @desc        Fire elemental based final build
*
*/

const finalBuild = {
	caster: true,
	skillstab: sdk.skills.tabs.Elemental,
	wantedskills: [sdk.skills.Firestorm, sdk.skills.Fissure],
	usefulskills: [sdk.skills.CycloneArmor],
	precastSkills: [sdk.skills.CycloneArmor],
	usefulStats: [sdk.stats.PassiveFireMastery, sdk.stats.PassiveFirePierce],
	mercDiff: sdk.difficulty.Nightmare,
	mercAct: 2,
	mercAuraWanted: "Holy Freeze",
	stats: [
		["dexterity", 35], ["strength", 48], ["vitality", 165],
		["strength", 61], ["vitality", 252], ["strength", 156], ["vitality", "all"]
	],
	skills: [
		[sdk.skills.OakSage, 6, false],
		[sdk.skills.Fissure, 11, false],
		[sdk.skills.Grizzly, 1, false],
		[sdk.skills.Volcano, 1, false],
		[sdk.skills.Fissure, 20, false],
		[sdk.skills.CycloneArmor, 1, false],
		[sdk.skills.Firestorm, 20, false],
		[sdk.skills.Volcano, 20, false],
		[sdk.skills.OakSage, 20, false],
		[sdk.skills.CycloneArmor, 20, false],
		[sdk.skills.Grizzly, 5, false],
	],
	autoEquipTiers: [ // autoequip final gear
		// Weapon - HotO
		"[type] == mace && [flag] == runeword # [itemallskills] == 3 # [tier] == 100000",
		// Helmet - Ravenlore
		"[name] == skyspirit && [quality] == unique # [passivefirepierce] >= 10 # [tier] == 100000 + tierscore(item)",
		// Belt - Arach's
		"[name] == spiderwebsash && [quality] == unique && [flag] != ethereal # [enhanceddefense] >= 90 # [tier] == 100000 + tierscore(item)",
		// Final Boots - Sandstorm Treks
		"[name] == scarabshellboots && [quality] == unique # [strength]+[vitality] >= 20 # [tier] == 100000 + tierscore(item)",
		// Boots - War Traveler
		"[name] == battleboots && [quality] == unique && [flag] != ethereal # [itemmagicbonus] >= 50 # [tier] == 5000 + tierscore(item)",
		// Armor - Enigma
		"[type] == armor && [flag] != ethereal && [flag] == runeword # [itemallskills] == 2 # [tier] == 100000",
		// Shield - Phoenix
		"[name] == monarch && [flag] != ethereal && [flag] == runeword # [passivefirepierce] >= 28 # [tier] == 100000 + tierscore(item)",
		// Final Gloves - Perfect 2x Upp'ed Magefist
		"[name] == crusadergauntlets && [quality] == unique && [flag] != ethereal # [enhanceddefense] == 30 && [addfireskills] == 1 # [tier] == 110000",
		// Gloves - 2x Upp'ed Magefist
		"[name] == crusadergauntlets && [quality] == unique && [flag] != ethereal # [enhanceddefense] >= 20 && [addfireskills] == 1 # [tier] == 100000 + tierscore(item)",
		// Gloves - Upp'ed Magefist
		"[name] == battlegauntlets && [quality] == unique && [flag] != ethereal # [enhanceddefense] >= 20 && [addfireskills] == 1 # [tier] == 100000 + tierscore(item)",
		// Gloves - Magefist
		"[name] == lightgauntlets && [quality] == unique && [flag] != ethereal # [enhanceddefense] >= 20 && [addfireskills] == 1 # [tier] == 100000 + tierscore(item)",
		// Amulet - Maras
		"[type] == amulet && [quality] == unique # [strength] == 5 && [coldresist] >= 30 # [tier] == 100000 + tierscore(item)",
		// Rings - SoJ
		"[type] == ring && [quality] == unique # [itemmaxmanapercent] == 25 # [tier] == 100000",
		// Switch - CTA
		"[minimumsockets] >= 5 && [flag] == runeword # [plusskillbattleorders] >= 1 # [secondarytier] == 100000",
		// Merc Armor - Fortitude
		"[type] == armor && [flag] == runeword # [enhanceddefense] >= 200 && [enhanceddamage] >= 300 # [merctier] == 100000",
		// Merc Final Helmet - Eth Andy's
		"[name] == demonhead && [quality] == unique && [flag] == ethereal # [strength] >= 25 && [enhanceddefense] >= 100 # [merctier] == 50000 + mercscore(item)",
		// Merc Helmet - Andy's
		"[name] == demonhead && [quality] == unique && [flag] != ethereal # [strength] >= 25 && [enhanceddefense] >= 100 # [merctier] == 40000 + mercscore(item)",
	],

	charms: {
		ResLife: {
			max: 3,
			have: [],
			classid: sdk.items.SmallCharm,
			stats: function (check) {
				return (!check.unique && check.classid === this.classid && check.allRes === 5 && check.getStat(sdk.stats.MaxHp) === 20);
			}
		},

		ResMf: {
			max: 2,
			have: [],
			classid: sdk.items.SmallCharm,
			stats: function (check) {
				return (!check.unique && check.classid === this.classid && check.allRes === 5 && check.getStat(sdk.stats.MagicBonus) === 7);
			}
		},

		ResFHR: {
			max: 1,
			have: [],
			classid: sdk.items.SmallCharm,
			stats: function (check) {
				return (!check.unique && check.classid === this.classid && check.allRes === 5 && check.getStat(sdk.stats.FHR) === 5);
			}
		},

		Skiller: {
			max: 2,
			have: [],
			classid: sdk.items.GrandCharm,
			stats: function (check) {
				return (!check.unique && check.classid === this.classid && check.getStat(sdk.stats.AddSkillTab, sdk.skills.tabs.Elemental) === 1
					&& check.getStat(sdk.stats.MaxHp) >= 40);
			}
		},
	},

	AutoBuildTemplate: {
		1:	{
			Update: function () {
				Config.AttackSkill = [-1, sdk.skills.Fissure, sdk.skills.Firestorm, sdk.skills.Fissure, sdk.skills.Firestorm, sdk.skills.ArticBlast, -1];
				Config.SummonAnimal = "Grizzly";
				Config.SummonSpirit = "Oak Sage";
			}
		},
	},

	respec: function () {
		return Check.haveItem("armor", "runeword", "Enigma");
	},

	active: function () {
		return this.respec() && me.getSkill(sdk.skills.Volcano, sdk.skills.subindex.HardPoints);
	},
};
