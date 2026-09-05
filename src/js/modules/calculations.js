/**
 * Calculations Module
 * Pure functions for all game calculations
 */

/**
 * Calculates unit stat value based on point allocation
 * Uses formula: (initialValue * points * 0.4) + (initialValue * 1.15^points)
 * @param {number} initialValue - Base stat value
 * @param {number} points - Points allocated to this stat
 * @returns {number} Calculated stat value
 */
function calculateStatValue(initialValue, points) {
	if (typeof initialValue !== 'number' || typeof points !== 'number') {
		return 0;
	}
	if (points < 0) return initialValue;
	
	return initialValue * points * 0.4 + initialValue * Math.pow(1.15, points);
}

/**
 * Calculates spawn rate timer based on rate value
 * @param {number} currentRate - Current rate timer
 * @param {number} rateReduction - Amount to reduce per tick
 * @returns {number} Updated rate timer
 */
function updateSpawnRate(currentRate, rateReduction = 0.0999999) {
	return Math.max(0, currentRate - rateReduction);
}

/**
 * Calculates construction cost for a unit placement
 * @param {number} baseTerritoryCost - Base territory cost
 * @param {number} increaseRatio - Cost increase per additional placement
 * @param {number} count - Number of this unit type already in list
 * @returns {number} Construction cost for this placement
 */
function calculateConstructionCost(baseTerritoryCost, increaseRatio, count) {
	if (typeof baseTerritoryCost !== 'number' || 
	    typeof increaseRatio !== 'number' || 
	    typeof count !== 'number') {
		return 0;
	}
	return baseTerritoryCost + increaseRatio * Math.max(0, count);
}

/**
 * Calculates spawn rate cost multiplier for upgrade
 * @param {number} currentCost - Current cost
 * @returns {number} New cost after upgrade
 */
function calculateSpawnRateCostUpgrade(currentCost) {
	if (typeof currentCost !== 'number' || currentCost <= 0) {
		return 0;
	}
	return currentCost * 4;
}

/**
 * Calculates unit upgrade cost multiplier
 * @param {number} currentCost - Current cost
 * @returns {number} New cost after upgrade
 */
function calculateUnitUpgradeCostIncrease(currentCost) {
	if (typeof currentCost !== 'number' || currentCost <= 0) {
		return 0;
	}
	return currentCost * 1.6;
}

/**
 * Calculates building health upgrade cost multiplier
 * @param {number} currentCost - Current cost
 * @param {number} multiplier - Cost multiplier (wall: 1.12, fence: 1.15)
 * @returns {number} New cost after upgrade
 */
function calculateBuildingUpgradeCost(currentCost, multiplier) {
	if (typeof currentCost !== 'number' || typeof multiplier !== 'number') {
		return 0;
	}
	return Math.floor(multiplier * currentCost);
}

/**
 * Calculates health gain from building upgrade
 * @param {string} buildingType - Type of building ('wall' or 'fence')
 * @returns {number} Health to add
 */
function calculateBuildingHealthGain(buildingType) {
	if (buildingType === 'wall') {
		return 1250;
	} else if (buildingType === 'fence') {
		return 50;
	}
	return 0;
}

/**
 * Calculates building upgrade cost multiplier
 * @param {string} buildingType - Type of building
 * @returns {number} Cost multiplier
 */
function getBuildingCostMultiplier(buildingType) {
	if (buildingType === 'wall') return 1.12;
	if (buildingType === 'fence') return 1.15;
	return 1.0;
}

/**
 * Calculates spawn rate reduction amount
 * @param {number} spawnAmount - Number of units to spawn
 * @returns {boolean} Whether any units should spawn
 */
function shouldSpawn(spawnAmount) {
	return typeof spawnAmount === 'number' && spawnAmount > 0;
}

/**
 * Calculates average of two values weighted by counts
 * @param {number} val1 - First value
 * @param {number} val2 - Second value
 * @param {number} count1 - Weight for first value
 * @param {number} count2 - Weight for second value
 * @returns {number} Weighted average
 */
function calculateWeightedAverage(val1, val2, count1, count2) {
	const totalCount = count1 + count2;
	if (totalCount === 0) return 0;
	return (val1 * count1 + val2 * count2) / totalCount;
}

/**
 * Calculates spawn rate reduction per tick
 * This is a constant used in spawn rate calculations
 * @returns {number} Standard rate reduction amount
 */
function getStandardRateReduction() {
	return 0.0999999;
}
