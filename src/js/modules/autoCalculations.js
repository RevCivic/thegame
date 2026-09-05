/**
 * Auto-Calculations Module
 * Handles all automatic game calculations and state updates
 * Separates calculation logic from UI updates
 */

/**
 * Processes all spawn rate calculations and timers
 * Pure calculation function - returns new state without modifying globals
 * @param {object} state - Current game state
 * @returns {object} Updated state
 */
function calculateSpawnRates(state) {
	const rateReduction = getStandardRateReduction();
	let updates = {};

	// Player units - soldiers
	if (state.spawnAmounts[0] > 0) {
		updates.soldierSpawnRate = updateSpawnRate(state.soldierSpawnRate, rateReduction);
		if (updates.soldierSpawnRate <= 0) {
			updates.soldierSpawnRateReset = true;
			updates.shouldSpawnSoldiers = true;
			updates.soldierSpawnRate = state.spawnRate[0];
		}
	}

	// Player units - spears
	if (state.spawnAmounts[1] > 0) {
		updates.spearSpawnRate = updateSpawnRate(state.spearSpawnRate, rateReduction);
		if (updates.spearSpawnRate <= 0) {
			updates.spearSpawnRateReset = true;
			updates.shouldSpawnSpears = true;
			updates.spearSpawnRate = state.spawnRate[1];
		}
	}

	// Enemy units
	updates.enemySpawnRate = updateSpawnRate(state.enemySpawnRate, rateReduction);
	if (updates.enemySpawnRate <= 0) {
		updates.enemySpawnRateReset = true;
		updates.shouldSpawnEnemy = true;
		updates.enemySpawnRate = maps[stage][4];
	}

	return updates;
}

/**
 * Calculates construction progress
 * Determines which units in spawn list are affordable and ready to spawn
 * @param {array} spawnList - List of units to spawn
 * @param {number} constructionTotal - Current construction resource amount
 * @returns {object} Construction state with affordability info
 */
function calculateConstruction(spawnList, constructionTotal) {
	const constructionState = {
		total: constructionTotal,
		spawnAmounts: [0, 0], // soldier, spear
		items: []
	};

	let tempTotal = constructionTotal;
	let totalSoldierFound = 0;
	let totalSpearFound = 0;

	for (let q = 0; q < spawnList.length; q++) {
		let constructionCost = 0;
		let isAffordable = false;
		
		if (spawnList[q] === "soldier") {
			constructionCost = calculateConstructionCost(
				placeUnitTerritoryCost[0],
				placeUnitIncreaseRatio[0],
				totalSoldierFound++
			);
		} else if (spawnList[q] === "spear") {
			constructionCost = calculateConstructionCost(
				placeUnitTerritoryCost[1],
				placeUnitIncreaseRatio[1],
				totalSpearFound++
			);
		}

		isAffordable = tempTotal >= constructionCost;
		
		constructionState.items.push({
			index: q,
			type: spawnList[q],
			cost: constructionCost,
			isAffordable: isAffordable,
			progress: isAffordable ? 1 : (tempTotal > 0 ? tempTotal / constructionCost : 0)
		});

		if (isAffordable) {
			if (spawnList[q] === "soldier") constructionState.spawnAmounts[0]++;
			if (spawnList[q] === "spear") constructionState.spawnAmounts[1]++;
			tempTotal -= constructionCost;
		} else if (tempTotal > 0) {
			tempTotal -= constructionCost;
		}
	}

	return constructionState;
}

/**
 * Calculates total territory used by spawn list
 * @param {array} spawnList - List of unit placements
 * @returns {number} Total territory used
 */
function calculateTerritoryUsed(spawnList) {
	let totalSoldierFound = 0;
	let totalSpearFound = 0;
	let totalUsed = 0;

	for (let i = 0; i < spawnList.length; i++) {
		if (spawnList[i] === "soldier") {
			totalUsed += calculateConstructionCost(
				placeUnitTerritoryCost[0],
				placeUnitIncreaseRatio[0],
				totalSoldierFound++
			);
		} else if (spawnList[i] === "spear") {
			totalUsed += calculateConstructionCost(
				placeUnitTerritoryCost[1],
				placeUnitIncreaseRatio[1],
				totalSpearFound++
			);
		}
	}

	return totalUsed;
}

/**
 * Calculates upcoming construction costs for new placements
 * @param {string} unitType - Type of unit to calculate cost for
 * @param {array} spawnList - Current spawn list
 * @returns {number} Cost of next placement
 */
function calculateNextConstructionCost(unitType, spawnList) {
	const costArray = unitType === "soldier" ? placeUnitTerritoryCost : placeUnitTerritoryCost;
	const ratioArray = unitType === "soldier" ? placeUnitIncreaseRatio : placeUnitIncreaseRatio;
	
	// Count how many of this type already exist in spawn list
	const count = spawnList.filter(u => u === unitType).length;
	
	const index = unitType === "soldier" ? 0 : 1;
	return calculateConstructionCost(costArray[index], ratioArray[index], count);
}

/**
 * Validates spawn amounts are non-negative
 * @param {array} spawnAmounts - Array of spawn amounts
 * @returns {array} Validated spawn amounts
 */
function validateSpawnAmounts(spawnAmounts) {
	return spawnAmounts.map(amount => {
		const validated = Math.max(0, Math.floor(amount || 0));
		return validated;
	});
}

/**
 * Validates and sanitizes spawn rates
 * @param {number} rate - Spawn rate value
 * @returns {number} Validated spawn rate
 */
function validateSpawnRate(rate) {
	const validated = parseFloat(rate) || 0;
	return Math.max(0, validated);
}

/**
 * Calculates whether a stat update is needed
 * Checks if any upgrade points are available
 * @param {array} unitPointValues - Point allocation array
 * @returns {boolean} True if updates needed
 */
function needsStatUpdate(unitPointValues) {
	if (!Array.isArray(unitPointValues)) return false;
	// Check if any stat has points allocated
	return unitPointValues.some(points => points > 0);
}

/**
 * Calculates all upgrade costs and updated values
 * @param {number} typeNum - Unit type number
 * @returns {object} Object with calculated values
 */
function calculateUnitUpgradeCosts(typeNum) {
	return {
		unitCost: unitCosts[typeNum],
		spawnRateCost: costSpawnRate[typeNum],
		upgradePoints: upgradePointsInitial[typeNum],
		pointValues: unitPointValues[typeNum] ? [...unitPointValues[typeNum]] : []
	};
}

/**
 * Computes which spawn timer to display
 * @param {number} rate - Current spawn rate
 * @param {boolean} isActive - Whether this unit type is active
 * @returns {number} Display-ready spawn rate
 */
function formatSpawnRateForDisplay(rate, isActive) {
	if (!isActive) return 0;
	return Math.max(0, rate);
}
