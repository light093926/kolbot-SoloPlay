/*
*	@filename	cube.js
*	@author		isid0re, theBGuy
*	@desc		get cube item
*/

function cube () {
	Town.townTasks();
	print('ÿc8Kolbot-SoloPlayÿc0: starting cube');
	me.overhead("cube");

	if (!Pather.checkWP(sdk.areas.HallsoftheDeadLvl2)) {
		Pather.getWP(sdk.areas.HallsoftheDeadLvl2);
	} else {
		Pather.useWaypoint(sdk.areas.HallsoftheDeadLvl2);
	}

	Precast.doPrecast(true);
	Pather.clearToExit(sdk.areas.HallsoftheDeadLvl2, sdk.areas.HallsoftheDeadLvl3, Pather.useTeleport());
	Pather.moveToPreset(me.area, 2, 354);
	Attack.securePosition(me.x, me.y, 30, 3000, true);
	Quest.collectItem(sdk.items.quest.Cube, 354);
	Quest.stashItem(sdk.items.quest.Cube);

	return true;
}
