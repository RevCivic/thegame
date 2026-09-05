/**
 * Button Handlers Module
 * Refactored and function-oriented button click handlers
 */

/**
 * Handles unit upgrade button clicks
 * Allocates or deallocates upgrade points between different stats
 * @param {number} pos - Button position (1-6)
 * @param {string} type - Unit type ('soldier' or 'spear')
 */
function handleUnitUpgradeButton(pos, type) {
	// Input validation
	if (!isValidButtonPosition(pos) || !isValidUnitType(type)) {
		console.error(`Invalid button position (${pos}) or unit type (${type})`);
		return;
	}

	const typeNum = convertTypeToNum(type, "right");
	const statIndex = pos - 1; // Convert button number (1-6) to index (0-5)
	
	// Handle point allocation or deallocation
	const pointsAllocated = unitPointValues[typeNum][statIndex];
	const healthPoints = unitPointValues[typeNum][3]; // Health is always index 3
	
	if (pointsAllocated > 0) {
		// Deallocate: move point from stat back to Health
		deallocatePointFromStat(typeNum, statIndex, 3);
	} else if (healthPoints > 0) {
		// Allocate: move point from Health to stat
		allocatePointToStat(typeNum, statIndex, 3);
	}
	
	// Update display
	updateUnitUpgradeDisplay(typeNum, statIndex);
	updateUnitUpgradeDisplay(typeNum, 3); // Also update health display
	updateStatusUpgrades("", type);
	updateGoldVisual();
}

/**
 * Deallocates a point from a stat and adds it to health
 * @param {number} typeNum - Unit type number
 * @param {number} fromStatIndex - Index to deallocate from
 * @param {number} toStatIndex - Index to allocate to (usually health: 3)
 */
function deallocatePointFromStat(typeNum, fromStatIndex, toStatIndex) {
	if (!isValidStatIndex(fromStatIndex) || !isValidStatIndex(toStatIndex)) {
		return;
	}
	
	unitPointValues[typeNum][fromStatIndex]--;
	unitPointValues[typeNum][toStatIndex]++;
	handleBuyAmounts(typeNum, fromStatIndex);
	handleBuyAmounts(typeNum, toStatIndex);
}

/**
 * Allocates a point from health to a stat
 * @param {number} typeNum - Unit type number
 * @param {number} toStatIndex - Index to allocate to
 * @param {number} fromStatIndex - Index to deallocate from (usually health: 3)
 */
function allocatePointToStat(typeNum, toStatIndex, fromStatIndex) {
	if (!isValidStatIndex(toStatIndex) || !isValidStatIndex(fromStatIndex)) {
		return;
	}
	
	unitPointValues[typeNum][toStatIndex]++;
	unitPointValues[typeNum][fromStatIndex]--;
	handleBuyAmounts(typeNum, toStatIndex);
	handleBuyAmounts(typeNum, fromStatIndex);
}

/**
 * Updates visual display for a unit upgrade
 * @param {number} typeNum - Unit type number
 * @param {number} statIndex - Stat index to update
 */
function updateUnitUpgradeDisplay(typeNum, statIndex) {
	if (!isValidStatIndex(statIndex)) {
		return;
	}
	handleBuyAmounts(typeNum, statIndex);
}

/**
 * Handles building upgrade button clicks
 * Purchases building health upgrades
 * @param {number} num - Button number (currently only 0 is valid)
 * @param {string} type - Building type ('wall' or 'fence')
 */
function handleBuildingUpgradeButton(num, type) {
	// Input validation
	if (!isValidBuildingButtonNum(num) || !isValidBuildingType(type)) {
		console.error(`Invalid building button (${num}) or type (${type})`);
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
 * Gets the index for a building type
 * @param {string} type - Building type
 * @returns {number} Index (0 for wall, 1 for fence, -1 for invalid)
 */
function getBuildingTypeIndex(type) {
	if (type === 'wall') return 0;
	if (type === 'fence') return 1;
	return -1;
}

/**
 * Applies a building upgrade purchase
 * @param {string} type - Building type
 * @param {number} buildingIndex - Building index
 * @param {number} buttonNum - Button number
 * @param {number} cost - Cost of upgrade
 */
function applyBuildingUpgrade(type, buildingIndex, buttonNum, cost) {
	// Deduct gold
	gold -= cost;
	
	// Update cost for next upgrade
	const multiplier = getBuildingCostMultiplier(type);
	buildingUpgradesCost[buildingIndex][buttonNum] = calculateBuildingUpgradeCost(cost, multiplier);
	
	// Add health
	const healthGain = calculateBuildingHealthGain(type);
	if (type === 'wall') {
		wallHealth += healthGain;
		wallHealthInitial += healthGain;
	} else if (type === 'fence') {
		fenceHealth += healthGain;
		fenceHealthInitial += healthGain;
	}
}

/**
 * Updates building upgrade display
 * @param {string} type - Building type
 * @param {number} buildingIndex - Building index
 * @param {number} buttonNum - Button number
 */
function updateBuildingUpgradeDisplay(type, buildingIndex, buttonNum) {
	const health = type === 'wall' ? wallHealthInitial : fenceHealthInitial;
	const cost = buildingUpgradesCost[buildingIndex][buttonNum];
	
	document.getElementById("buyBuilding" + buttonNum).innerHTML = round1(health);
	document.getElementById("costBuilding" + buttonNum).innerHTML = round1(cost);
}

/**
 * Handles spawn rate upgrade button clicks
 * @param {string} type - Unit type
 */
function handleSpawnRateUpgradeButton(type) {
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
 * Applies a spawn rate upgrade
 * @param {number} typeNum - Unit type number
 */
function applySpawnRateUpgrade(typeNum) {
	const cost = costSpawnRate[typeNum];
	gold -= cost;
	
	// Increase cost for next upgrade
	costSpawnRate[typeNum] = calculateSpawnRateCostUpgrade(cost);
	
	// Improve spawn rate (decrease time between spawns)
	const spawnTypeIndex = Math.floor(typeNum / 2);
	initialSpawnRate[spawnTypeIndex] *= 0.95;
	spawnRate[spawnTypeIndex] *= 0.95;
	
	// Check if rate has reached minimum
	if (initialSpawnRate[spawnTypeIndex] <= 1) {
		// TODO: Disable button when rate reaches minimum
		console.warn(`Spawn rate ${spawnTypeIndex} has reached minimum`);
	}
}

/**
 * Handles purchase of additional upgrade points
 * @param {string} type - Unit type
 */
function handleBuyUpgradePointButton(type) {
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

/**
 * Applies an upgrade point purchase
 * @param {number} typeNum - Unit type number
 */
function applyUpgradePointPurchase(typeNum) {
	const cost = unitCosts[typeNum];
	gold -= cost;
	
	// Increase cost for next point
	unitCosts[typeNum] = calculateUnitUpgradeCostIncrease(cost);
	
	// Add upgrade point to health pool
	upgradePointsInitial[typeNum]++;
	unitPointValues[typeNum][3]++;
	handleBuyAmounts(typeNum, 3);
	
	// Update slider if it exists
	const slider = document.getElementById("slider");
	if (slider && slider.slider) {
		slider.slider('option', 'max', upgradePointsInitial[typeNum]);
		slider.slider('value', unitPointValues[typeNum][3]);
	}
}

/**
 * Main entry point for unit upgrade button clicks
 * (Maintains backwards compatibility with existing onclick handlers)
 * @param {number} pos - Button position
 * @param {string} type - Unit type
 */
function clickBuyButton(pos, type) {
	handleUnitUpgradeButton(pos, type);
}

/**
 * Main entry point for building upgrade button clicks
 * (Maintains backwards compatibility with existing onclick handlers)
 * @param {number} num - Button number
 * @param {string} type - Building type
 */
function clickBuildingBuyButton(num, type) {
	handleBuildingUpgradeButton(num, type);
}

/**
 * Main entry point for spawn rate upgrade button clicks
 * (Maintains backwards compatibility with existing onclick handlers)
 * @param {string} type - Unit type
 */
function clickBuySpawnRate(type) {
	handleSpawnRateUpgradeButton(type);
}

/**
 * Main entry point for upgrade point purchase button clicks
 * (Maintains backwards compatibility with existing onclick handlers)
 * @param {string} type - Unit type
 */
function buyUpgradePoint(type) {
	handleBuyUpgradePointButton(type);
}
