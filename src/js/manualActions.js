/**
 * REFACTORED: Unit upgrade button handler
 * Allocates/deallocates upgrade points between different stats
 * Now delegates to modular button handler with improved logic
 */
function clickBuyButton(pos, type) {
	// Validate inputs first
	if (!isValidButtonPosition(pos) || !isValidUnitType(type)) {
		console.error(`Invalid button click: pos=${pos}, type=${type}`);
		return;
	}

	const typeNum = convertTypeToNum(type, "right");
	const statIndex = pos - 1; // Convert button number (1-6) to index (0-5)
	
	// Get current point allocation
	const pointsAllocated = unitPointValues[typeNum][statIndex];
	const healthPoints = unitPointValues[typeNum][3]; // Health is always index 3
	
	// Determine action: allocate or deallocate
	if (pointsAllocated > 0) {
		// Deallocate: move point from stat back to Health
		deallocatePointFromStat(typeNum, statIndex, 3);
	} else if (healthPoints > 0) {
		// Allocate: move point from Health to stat
		allocatePointToStat(typeNum, statIndex, 3);
	} else {
		// No points available to allocate/deallocate
		return;
	}
	
	// Update all displays
	updateUnitUpgradeDisplay(typeNum, statIndex);
	updateUnitUpgradeDisplay(typeNum, 3); // Also update health display
	updateStatusUpgrades("", type);
	updateGoldVisual();
}

function handleBuyAmounts(y, x) {
	// Apply upgrade formula to all stat types (0-5)
	if(x < 6) {
		unitValues[y][x] = unitValuesInitial[y][x]*unitPointValues[y][x]*.4+unitValuesInitial[y][x]*Math.pow(1.15, unitPointValues[y][x]);
	}
}

/**
 * REFACTORED: Building upgrade button handler
 * Now with improved logic, better separation of concerns, and input validation
 */
function clickBuildingBuyButton(num, type) {
	// Input validation
	if (!isValidBuildingButtonNum(num) || !isValidBuildingType(type)) {
		console.error(`Invalid building upgrade: num=${num}, type=${type}`);
		return;
	}

	const buildingIndex = getBuildingTypeIndex(type);
	if (buildingIndex === -1) {
		console.error(`Unknown building type: ${type}`);
		return;
	}

	// Get current cost and check affordability
	const cost = buildingUpgradesCost[buildingIndex][num];
	if (!canAfford(cost, gold)) {
		return; // Not enough gold
	}

	// Apply purchase
	applyBuildingUpgrade(type, buildingIndex, num, cost);
	
	// Update visuals
	updateBuildingUpgradeDisplay(type, buildingIndex, num);
	updateWallHealthVisuals();
	updateGoldVisual();
}

/**
 * REFACTORED: Spawn rate upgrade button handler
 * Now with improved input validation and error handling
 */
function clickBuySpawnRate(type) {
	// Input validation
	if (!isValidUnitType(type)) {
		console.error(`Invalid unit type: ${type}`);
		return;
	}

	const typeNum = convertTypeToNum(type, "right");
	const cost = costSpawnRate[typeNum];
	
	// Check if player can afford upgrade
	if (!canAfford(cost, gold)) {
		return; // Not enough gold
	}

	// Apply upgrade
	applySpawnRateUpgrade(typeNum);
	
	// Update display
	updateStatusUpgrades("", type);
	updateGoldVisual();
}

/**
 * REFACTORED: Upgrade point purchase handler
 * Now with improved input validation and error handling
 */
function buyUpgradePoint(type) {
	// Input validation
	if (!isValidUnitType(type)) {
		console.error(`Invalid unit type: ${type}`);
		return;
	}

	const typeNum = convertTypeToNum(type, "right");
	const cost = unitCosts[typeNum];
	
	// Check if player can afford upgrade
	if (!canAfford(cost, gold)) {
		return; // Not enough gold
	}

	// Apply purchase
	applyUpgradePointPurchase(typeNum);
	
	// Update display
	updateStatusUpgrades("", type);
	updateGoldVisual();
}

function removeHover() {
	prevDiv = document.getElementById("unit"+curClickedUnit);
	if(prevDiv) {
		prevDiv.style.border = "0px solid black";
		prevDiv.style.marginTop = "0px";
		prevDiv.style.marginLeft = "0px";
		prevDiv.style.padding = "0px";
	}
	document.getElementById("victoryConditionBox").style.display="inline-block";
	document.getElementById("unitDisplayBox").style.display="none";
	
	curClickedUnit = "-1";
}

function hoverAUnit(id) {
	prevDiv = document.getElementById("unit"+curClickedUnit);
	if(prevDiv) {
		prevDiv.style.border = "0px solid black";
		prevDiv.style.marginTop = "0px";
		prevDiv.style.marginLeft = "0px";
		prevDiv.style.padding = "0px";
	}
	curClickedUnit = id;
	if(id=="-1") {
		document.getElementById("victoryConditionBox").style.display="inline-block";
		document.getElementById("unitDisplayBox").style.display="none";
		return;
	}
	div = document.getElementById("unit"+id);
	div.style.border = "1px solid black";
	div.style.marginTop = "-1px";
	div.style.marginLeft = "-3px";
	div.style.padding = "0px 2px";
	
	updateHover(id)
	
	document.getElementById("victoryConditionBox").style.display="none";
	document.getElementById("unitDisplayBox").style.display="inline-block";
}

var myKeyQueue = [];

//This happens in order to make hotkeys
$(document).keydown(function(e) {
    code = (e.charCode != 0 ? e.charCode : e.keyCode)
    myKeyQueue.push(code);
	processKeyQueue();
});

/*$(document).keyup(function(e) {
    processKeyQueue();
});*/

function processKeyQueue() {
	key = myKeyQueue[0]
	myKeyQueue.splice(0, 1);
	if(key == 32) {
		pause()
	}
	if(key == 49) { //1
		clickedSpell(0)
	}
	if(key == 50) { //2
		clickedSpell(1)
	}
	if(myKeyQueue.length > 0)
		processKeyQueue()
}


//these are variables that aren't saved, being reset per level
//using variables that are saved to set, though
function startANewstage() {
	constructionTotal = 0
	for(y = 0; y < units.length; y++) {
		for(x = units[y].length-1; x>=0; x--) {
			removeUnit(units[y][x], false);
		}
	}
	//TODO:handle different lines amounts visually
	linesEnabled = maps[stage][8];
	handleLineAmounts(linesEnabled)
	units = [[],[],[],[],[],[]];
	soldierSpawnRate = 0;
	spearSpawnRate = 0;
	spawnRate=[];
	spawnAmounts=[]
	for(j = 0; j < initialSpawnAmounts.length; j++) {
		spawnRate[j] = initialSpawnRate[j]
		spawnAmounts[j]=initialSpawnAmounts[j]
	}
	enemySpawnRate = .5;
	enemySpawnAmounts=[maps[stage][9][0], maps[stage][9][1], maps[stage][9][2]]
	enemySpawnRateIncrease=[maps[stage][10][0], maps[stage][10][1], maps[stage][10][2]]
	
	curBattles = [];
	storedArrowVisuals = [];
	storedLightningVisuals=[]
	timer = 19;
	totalTicks = 0
	curClickedUnit = -1;
	document.getElementById("stage").innerHTML=stage+1;
	document.getElementById("territoryGain").innerHTML = mapTimers[stage]>0?maps[stage][1]/5:maps[stage][1]
	document.getElementById("goldGain").innerHTML = maps[stage][0]
	//TODO: make this more clear it's the enemy health/dmg formulas
	//elevate it to more visible? These numbers will be tweaked a lot
	unitValues[1] = [Math.pow(stage+12, 2)/20-6.19999, 4, .06, Math.pow(stage+1, 2)*12+50, 0, 4.5]
	unitValues[3] = [Math.pow(stage+12, 2)/12+stage/5-6.2833333333, 15, .04, Math.pow(stage+8, 2)*2-142, 0, 16]
	//updateProgressVisual()
	enemyFenceHealthInitial = maps[stage][2]
	enemyWallHealthInitial = maps[stage][3]
	wallHealth = wallHealthInitial
	enemyWallHealth = enemyWallHealthInitial
	fenceHealth = fenceHealthInitial
	enemyFenceHealth = enemyFenceHealthInitial;
	document.getElementById("enemyFence").style.display =  enemyFenceHealth>0?'inline-block':'none';;
	document.getElementById("enemyFenceHealth").style.display = enemyFenceHealth>0?'inline-block':'none';;
	document.getElementById("fence").style.display = fenceHealth>0?'inline-block':'none';
	document.getElementById("fenceHealth").style.display = fenceHealth>0?'inline-block':'none';
	
	//addUnit("soldier", 0, "left", 1);
	
	started = 1
}