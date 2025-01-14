/**
*  @filename    bloodraven.js
*  @author      theBGuy
*  @desc        kill bloodraven for free merc normal and maus/crypt MF hunting for endgame
*
*/

function bloodraven () {
	Town.townTasks();
	myPrint("ÿc8Kolbot-SoloPlayÿc0: starting blood raven");

	if (!Pather.checkWP(sdk.areas.StonyField, true)) {
		Pather.getWP(sdk.areas.StonyField);
		me.charlvl < 6 && Attack.clearLevelUntilLevel(6);
	} else {
		if (me.hell && Pather.canTeleport() && me.charlvl < 74/*xp penalty makes this not worth it after 74*/) {
			Misc.getExpShrine([sdk.areas.StonyField, sdk.areas.ColdPlains, sdk.areas.DarkWood, sdk.areas.BloodMoor]);
			if (!me.inArea(sdk.areas.ColdPlains)) {
				Town.goToTown() && Pather.useWaypoint(sdk.areas.ColdPlains);
			}
		} else {
			Pather.useWaypoint(sdk.areas.ColdPlains);
			me.charlvl < 5 && Attack.clearLevelUntilLevel(5);
		}
	}

	Precast.doPrecast(true);

	me.overhead("blood raven");
	Pather.moveToExit(sdk.areas.BurialGrounds, true);
	me.sorceress && !me.normal
		? Pather.moveNearPreset(sdk.areas.BurialGrounds, sdk.unittype.Monster, sdk.monsters.preset.BloodRaven, 20)
		: Pather.moveToPreset(sdk.areas.BurialGrounds, sdk.unittype.Monster, sdk.monsters.preset.BloodRaven);
	Attack.killTarget("Blood Raven");
	Pickit.pickItems();

	if (me.normal && !me.bloodraven && Town.canTpToTown()) {
		Town.npcInteract("kashya");
		return true;
	} else if (me.paladin && Check.currentBuild().caster && !Pather.canTeleport()) {
		return true;
	}

	myPrint("blood raven :: starting mausoleum");

	if (!Pather.moveToExit([sdk.areas.BurialGrounds, sdk.areas.Mausoleum], true)) {
		console.log("ÿc8Kolbot-SoloPlayÿc0: Failed to move to Mausoleum");
	}

	me.inArea(sdk.areas.Mausoleum) && Attack.clearLevel();

	if (me.hell) {
		switch (me.gametype) {
		case sdk.game.gametype.Classic:
			if (Pather.accessToAct(3)) {
				return true;
			}

			break;
		case sdk.game.gametype.Expansion:
			if ((me.charlvl < 80 || me.charlvl > 85) && !((me.sorceress || me.druid || me.assassin) && Item.getEquippedItem(sdk.body.RightArm).tier < 100000)) {
				return true;
			}

			break;
		}
	} else {
		return true;
	}

	myPrint("blood raven :: starting crypt");
	Pather.journeyTo(sdk.areas.Crypt) && Attack.clearLevel();
	
	return true;
}
