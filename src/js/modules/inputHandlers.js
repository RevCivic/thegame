/**
 * Input Handlers Module
 * Centralizes all user input and interaction event handlers
 */

/**
 * Handles unit hover/selection
 * Shows detailed stats for unit when hovered
 * @param {number} id - Unit ID to hover
 */
function hoverAUnit(id) {
	// Clear previous hover
	if (curClickedUnit !== "-1") {
		const prevDiv = document.getElementById("unit" + curClickedUnit);
		if (prevDiv) {
			prevDiv.style.border = "0px solid black";
			prevDiv.style.marginTop = "0px";
			prevDiv.style.marginLeft = "0px";
			prevDiv.style.padding = "0px";
		}
	}

	curClickedUnit = id;

	if (id === "-1") {
		document.getElementById("victoryConditionBox").style.display = "inline-block";
		document.getElementById("unitDisplayBox").style.display = "none";
		return;
	}

	const div = document.getElementById("unit" + id);
	if (div) {
		div.style.border = "1px solid black";
		div.style.marginTop = "-1px";
		div.style.marginLeft = "-3px";
		div.style.padding = "0px 2px";
	}

	updateHover(id);

	document.getElementById("victoryConditionBox").style.display = "none";
	document.getElementById("unitDisplayBox").style.display = "inline-block";
}

/**
 * Removes hover state from current unit
 * Returns to main display
 */
function removeHover() {
	const prevDiv = document.getElementById("unit" + curClickedUnit);
	if (prevDiv) {
		prevDiv.style.border = "0px solid black";
		prevDiv.style.marginTop = "0px";
		prevDiv.style.marginLeft = "0px";
		prevDiv.style.padding = "0px";
	}
	document.getElementById("victoryConditionBox").style.display = "inline-block";
	document.getElementById("unitDisplayBox").style.display = "none";

	curClickedUnit = "-1";
}

/**
 * Processes keyboard input queue
 * Handles hotkeys for spells and actions
 */
function processKeyQueue() {
	if (myKeyQueue.length === 0) {
		return;
	}

	const key = myKeyQueue[0];
	myKeyQueue.splice(0, 1);

	if (key === 32) { // Space - Pause
		pause();
	}
	if (key === 49) { // 1 - First spell
		clickedSpell(0);
	}
	if (key === 50) { // 2 - Second spell
		clickedSpell(1);
	}

	if (myKeyQueue.length > 0) {
		processKeyQueue();
	}
}

/**
 * Initializes keyboard event listeners
 * Sets up hotkey handling
 */
function initializeKeyboardHandlers() {
	// Note: This uses jQuery for compatibility with existing code
	$(document).keydown(function (e) {
		const code = (e.charCode !== 0 ? e.charCode : e.keyCode);
		myKeyQueue.push(code);
		processKeyQueue();
	});
}

/**
 * Adds unit to spawn list
 * @param {string} unitType - Type of unit to add
 */
function addToPlaceList(unitType) {
	if (!isValidUnitType(unitType)) {
		console.error(`Invalid unit type: ${unitType}`);
		return;
	}

	if (typeof spawnList === 'undefined') {
		spawnList = [];
	}

	spawnList.push(unitType);
	showSpawnList();
	updatePlaceVisuals();
	updateConstructionVisual();
}

/**
 * Removes unit from spawn list at given index
 * @param {element} element - Element to find index from
 */
function removeFromPlaceList(element) {
	if (!element || !element.parentElement) {
		return;
	}

	const parentDiv = element.parentElement;
	const allDivs = document.querySelectorAll(".spawnDiv");
	
	for (let i = 0; i < allDivs.length; i++) {
		if (allDivs[i] === parentDiv) {
			if (i >= 0 && i < spawnList.length) {
				spawnList.splice(i, 1);
				break;
			}
		}
	}

	showSpawnList();
	updatePlaceVisuals();
	updateConstructionVisual();
}

/**
 * Moves item up in spawn list
 * @param {element} element - Element to move up
 */
function shiftPlaceListUp(element) {
	if (!element || !element.parentElement) {
		return;
	}

	const parentDiv = element.parentElement;
	const allDivs = document.querySelectorAll(".spawnDiv");
	
	for (let i = 0; i < allDivs.length; i++) {
		if (allDivs[i] === parentDiv && i > 0) {
			// Swap with previous item
			const temp = spawnList[i];
			spawnList[i] = spawnList[i - 1];
			spawnList[i - 1] = temp;
			break;
		}
	}

	showSpawnList();
	updateConstructionVisual();
}

/**
 * Moves item down in spawn list
 * @param {element} element - Element to move down
 */
function shiftPlaceListDown(element) {
	if (!element || !element.parentElement) {
		return;
	}

	const parentDiv = element.parentElement;
	const allDivs = document.querySelectorAll(".spawnDiv");
	
	for (let i = 0; i < allDivs.length; i++) {
		if (allDivs[i] === parentDiv && i < spawnList.length - 1) {
			// Swap with next item
			const temp = spawnList[i];
			spawnList[i] = spawnList[i + 1];
			spawnList[i + 1] = temp;
			break;
		}
	}

	showSpawnList();
	updateConstructionVisual();
}

/**
 * Handles toggle between main tab views
 * @param {number} tabIndex - Index of tab to show
 */
function switchMainTab(tabIndex) {
	if (typeof tabIndex !== 'number' || tabIndex < 0) {
		console.error(`Invalid tab index: ${tabIndex}`);
		return;
	}

	// Hide all tab content
	document.getElementById("warSpace").style.display = "none";
	document.getElementById("mapSpace").style.display = "none";
	document.getElementById("placesSpace").style.display = "none";
	document.getElementById("unitsSpace").style.display = "none";
	document.getElementById("buildingsSpace").style.display = "none";
	document.getElementById("spellUpgradeSpace").style.display = "none";
	document.getElementById("optionsPage").style.display = "none";

	// Hide all tab buttons
	document.getElementById("warTab").style.backgroundColor = "";
	document.getElementById("mapTab").style.backgroundColor = "";
	document.getElementById("territoryTab").style.backgroundColor = "";
	document.getElementById("unitTab").style.backgroundColor = "";
	document.getElementById("buildingsTab").style.backgroundColor = "";
	document.getElementById("manaTab").style.backgroundColor = "";
	document.getElementById("optionsTab").style.backgroundColor = "";

	// Show selected tab
	const tabElements = [
		"warSpace",
		"mapSpace",
		"placesSpace",
		"unitsSpace",
		"buildingsSpace",
		"spellUpgradeSpace",
		"optionsPage"
	];

	const tabButtons = [
		"warTab",
		"mapTab",
		"territoryTab",
		"unitTab",
		"buildingsTab",
		"manaTab",
		"optionsTab"
	];

	if (tabIndex >= 0 && tabIndex < tabElements.length) {
		const contentElement = document.getElementById(tabElements[tabIndex]);
		const buttonElement = document.getElementById(tabButtons[tabIndex]);
		
		if (contentElement) contentElement.style.display = "inline-block";
		if (buttonElement) buttonElement.style.backgroundColor = "#C0C0C0";
	}
}

/**
 * Handles game pause/resume
 */
function pause() {
	if (stop) {
		document.getElementById("pauseButton").innerHTML = 'Pause';
		stop = 0;
	} else {
		document.getElementById("pauseButton").innerHTML = 'Play';
		stop = 1;
	}
}

/**
 * Upgrades construction rate (sells land for workers)
 */
function upgradeConstructionRate() {
	const cost = 100; // Territory cost
	if (territory >= cost) {
		territory -= cost;
		constructionRate += 0.5;
		updateTerritoryVisual();
		updateConstructionVisual();
	}
}

/**
 * Handles unit click selection
 * @param {number} id - Unit ID to click
 */
function clickAUnit(id) {
	hoverAUnit(id);
}

/**
 * Handles spell click
 * Spell casting logic is implemented in spells.js
 * This stub maintains the function signature for backwards compatibility
 * @param {number} spellIndex - Index of spell to cast
 */
// Note: The actual implementation is in spells.js

/**
 * Changes unit upgrade screen view
 * Unit screen logic is implemented in graphics.js
 * This stub maintains the function signature for backwards compatibility
 * @param {string} unitType - Type of unit
 */
// Note: The actual implementation is in graphics.js

/**
 * Changes building upgrade screen view
 * Building screen logic is implemented in graphics.js
 * This stub maintains the function signature for backwards compatibility
 * @param {string} buildingType - Type of building
 */
// Note: The actual implementation is in graphics.js
