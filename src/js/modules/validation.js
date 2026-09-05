/**
 * Validation Module
 * Provides input validation and error checking for game functions
 */

/**
 * Validates that a value has sufficient resources (gold)
 * @param {number} cost - The cost to check
 * @param {number} currentGold - Current gold amount
 * @returns {boolean} True if sufficient gold exists
 */
function canAfford(cost, currentGold) {
	return typeof cost === 'number' && 
	       typeof currentGold === 'number' && 
	       currentGold >= cost && 
	       cost > 0;
}

/**
 * Validates unit type string
 * @param {string} type - Unit type to validate
 * @returns {boolean} True if valid unit type
 */
function isValidUnitType(type) {
	const validTypes = ['soldier', 'spear'];
	return typeof type === 'string' && validTypes.includes(type.toLowerCase());
}

/**
 * Validates building type string
 * @param {string} type - Building type to validate
 * @returns {boolean} True if valid building type
 */
function isValidBuildingType(type) {
	const validTypes = ['wall', 'fence'];
	return typeof type === 'string' && validTypes.includes(type.toLowerCase());
}

/**
 * Validates numeric stat index
 * @param {number} index - Stat index to validate
 * @param {number} maxIndex - Maximum allowed index
 * @returns {boolean} True if valid index
 */
function isValidStatIndex(index, maxIndex = 5) {
	return typeof index === 'number' && 
	       index >= 0 && 
	       index <= maxIndex && 
	       Number.isInteger(index);
}

/**
 * Validates that a unit has available points in a stat
 * @param {array} unitPointValues - Point allocation array
 * @param {number} statIndex - Index of stat to check
 * @returns {boolean} True if stat has points allocated
 */
function hasPointsAllocated(unitPointValues, statIndex) {
	return Array.isArray(unitPointValues) && 
	       typeof statIndex === 'number' && 
	       unitPointValues[statIndex] > 0;
}

/**
 * Validates that health pool has available points
 * @param {array} unitPointValues - Point allocation array (health is index 3)
 * @returns {boolean} True if health pool has points
 */
function hasHealthPointsAvailable(unitPointValues) {
	return hasPointsAllocated(unitPointValues, 3);
}

/**
 * Validates button position for unit upgrades
 * @param {number} pos - Button position (1-6)
 * @returns {boolean} True if valid button position
 */
function isValidButtonPosition(pos) {
	return typeof pos === 'number' && pos >= 1 && pos <= 6 && Number.isInteger(pos);
}

/**
 * Validates building button number
 * @param {number} num - Button number to validate
 * @returns {boolean} True if valid button
 */
function isValidBuildingButtonNum(num) {
	return typeof num === 'number' && num === 0;
}
