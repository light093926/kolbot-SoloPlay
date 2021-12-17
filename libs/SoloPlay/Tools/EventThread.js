/**
*	@filename	EventThread.js
*	@author		theBGuy
*	@desc		thread to handle in game events for Kolbot-SoloPlay
*/

js_strict(true);

include("json2.js");
include("NTItemParser.dbl");
include("OOG.js");
include("AutoMule.js");
include("Gambling.js");
include("CraftingSystem.js");
include("TorchSystem.js");
include("MuleLogger.js");
include("common/Attack.js");
include("common/Cubing.js");
include("common/CollMap.js");
include("common/Config.js");
include("common/Loader.js");
include("common/misc.js");
include("common/util.js");
include("common/Pickit.js");
include("common/Pather.js");
include("common/Precast.js");
include("common/Prototypes.js");
include("common/Runewords.js");
include("common/Storage.js");
include("common/Town.js");

if (!isIncluded("SoloPlay/Tools/Developer.js")) { include("SoloPlay/Tools/Developer.js"); }
if (!isIncluded("SoloPlay/Tools/Tracker.js")) { include("SoloPlay/Tools/Tracker.js"); }
if (!isIncluded("SoloPlay/Functions/globals.js")) { include("SoloPlay/Functions/globals.js"); }

function main () {
	let action = [];
	let profiles = [];
	let tickDelay = 0;

	print("ÿc8Kolbot-SoloPlayÿc0: Start EventThread");
	D2Bot.init();
	SetUp.include();
	Config.init(false);
	Pickit.init(false);
	Attack.init();
	Storage.Init();
	CraftingSystem.buildLists();
	Runewords.init();
	Cubing.init();

	this.pauseForEvent = function () {
		let scripts = ["default.dbj", "libs/SoloPlay/Tools/TownChicken.js", "tools/antihostile.js", "tools/party.js"];

		for (let l = 0; l < scripts.length; l += 1) {
			let script = getScript(scripts[l]);

			if (Events.townChicken) {
				print("ÿc1Trying to townChicken, don't interfere.");
				return false;
			}

			if (script) {
				if (script.running) {
					if (scripts[l] === "default.dbj") {
						print("ÿc1Pausing " + scripts[l]);
					}

					// don't pause townchicken during clone walk
					if (scripts[l] !== "libs/SoloPlay/Tools/TownChicken.js" || !Events.cloneWalked) {
						script.pause();
					}
				}
			}
		}

		return true;
	};

	this.resumeThreadsAfterEvent = function () {
		let scripts = ["default.dbj", "libs/SoloPlay/Tools/TownChicken.js", "tools/antihostile.js", "tools/party.js"];

		for (let l = 0; l < scripts.length; l += 1) {
			let script = getScript(scripts[l]);

			if (script) {
				if (!script.running) {
					// default.dbj
					if (scripts[l] === "default.dbj") {
						print("ÿc2Resuming " + scripts[l]);
					}

					// TownChicken
					if (scripts[l] === "libs/SoloPlay/Tools/TownChicken.js") {
						print("ÿc2Resuming " + scripts[l]);
					}

					script.resume();
				}
			}
		}

		return true;
	};

	this.scriptEvent = function (msg) {
		// Added from Autosorc/Sorc.js
		if (msg && typeof msg === "string" && msg !== "" && msg.substring(0, 8) === "config--") {
			Config = JSON.parse(msg.split("config--")[1]);
		}
		
		switch (msg) {
		case "testing":
		case "finishDen":
		case "dodge":
		case "skip":
		case "killdclone":
			action.push(msg);

			break;
		default:
			break;
		}
	};

	this.receiveCopyData = function (id, info) {
		// Torch
		if (id === 55) {
			let { profile, ladder, torchType } = JSON.parse(info);
			print("Mesage recived for torch...processing");

			if (profile !== me.profile && (me.hell || (me.nightmare && me.baal)) && me.ladder === ladder) {
				if (torchType === me.classid && !me.findItem(604, 0, null, 7)) {
					print("Sent Response");
					Events.sendToProfile(profile, {profile: me.profile, level: me.charlvl, event: 604});
				}
			}

			return;
		}

		// Annhilus
		if (id === 60) {
			let { profile, ladder } = JSON.parse(info);
			print("Mesage recived for Annhilus...processing");

			if (profile !== me.profile && (me.hell || (me.nightmare && me.baal)) && me.ladder === ladder) {
				if (!me.findItem(603, 0, null, 7)) {
					print("Sent Response");
					Events.sendToProfile(profile, {profile: me.profile, level: me.charlvl, event: 603});
				}
			}

			return;
		}

		if (id === 65) {
			let { profile, level, event } = JSON.parse(info);

			print("Sucess: profile that contacted me: " + profile + " level of char: " + level);
			Events.profileResponded = true;
			profiles.push({profile: profile, level: level, event: event});
			tickDelay += 1000;
		}

		if (id === 70) {
			Messaging.sendToScript("D2BotSoloPlay.dbj", "event");
			delay(100 + me.ping);
			scriptBroadcast("quit");
		}
	};

	addEventListener("scriptmsg", this.scriptEvent);
	addEventListener("gamepacket", Events.gamePacket);
	addEventListener('copydata', this.receiveCopyData);

	// Start
	while (true) {
		try {
			while (action.length) {
				if (this.pauseForEvent()) {
					try {
						Events[action.shift()]();
					} catch (e) {
						print(e);
					}

					this.resumeThreadsAfterEvent();
				} else {
					action.shift();
				}
			}

			if (profiles.length > 0) {
				let tick = getTickCount();

				while (getTickCount() - tick < tickDelay) {
					delay(500);
				}

				profiles.sort(function(a, b) {
					return a.level - b.level;
				});

				let lowestLevelProf = profiles.first();

				Events.sendToProfile(lowestLevelProf.profile, lowestLevelProf.event, 70);
				D2Bot.joinMe(lowestLevelProf.profile, me.gamename.toLowerCase(), "", me.gamepassword.toLowerCase(), true);
				profiles = [];
			}
		} catch (e) {
			D2Bot.printToConsole(JSON.stringify(e));
			print(e);
		}

		delay(20);
	}
}
