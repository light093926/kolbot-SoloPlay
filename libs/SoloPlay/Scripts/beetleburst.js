/*
*	@filename	beetleburst.js
*	@author		isid0re
*	@desc		kill beetleburst for exp
*/

function beetleburst () {
	Town.townTasks();
	print('ÿc8Kolbot-SoloPlayÿc0: starting beetleburst');

	if (!Pather.checkWP(sdk.areas.FarOasis)) {
		Pather.getWP(sdk.areas.FarOasis);
	} else {
		Pather.useWaypoint(sdk.areas.FarOasis);
	}

	Precast.doPrecast(true);
	Pather.moveToPreset(me.area, 1, 747);
	Attack.clear(15, 0, getLocaleString(2882));

	return true;
}
