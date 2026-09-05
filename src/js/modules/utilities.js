/**
 * Utilities Module
 * Common helper functions and formatting utilities
 */

/**
 * Rounds a number to 1 decimal place for display
 * @param {number} val - Value to round
 * @returns {number} Rounded value
 */
function round1(val) {
	if (typeof val !== 'number') return 0;
	return Math.round(val * 10) / 10;
}

/**
 * Rounds a number to 2 decimal places for display
 * @param {number} val - Value to round
 * @returns {number} Rounded value
 */
function round2(val) {
	if (typeof val !== 'number') return 0;
	return Math.round(val * 100) / 100;
}

/**
 * Generic rounding function with precision
 * @param {number} val - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
function roundToPrecision(val, decimals = 2) {
	if (typeof val !== 'number') return 0;
	const factor = Math.pow(10, decimals);
	return Math.round(val * factor) / factor;
}

/**
 * Calculates average of two numbers
 * @param {number} val1 - First value
 * @param {number} val2 - Second value
 * @returns {number} Average
 */
function average(val1, val2) {
	if (typeof val1 !== 'number' || typeof val2 !== 'number') return 0;
	return (val1 + val2) / 2;
}

/**
 * Counts occurrences of a type in spawn list
 * @param {string} type - Type to count
 * @param {array} spawnList - Array to search
 * @returns {number} Count of type in list
 */
function findNumTypeInList(type, spawnList) {
	if (!Array.isArray(spawnList)) return 0;
	return spawnList.filter(item => item === type).length;
}

/**
 * Clamps a value between min and max
 * @param {number} val - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(val, min, max) {
	if (typeof val !== 'number') return min;
	return Math.max(min, Math.min(max, val));
}

/**
 * Formats large numbers with suffixes (K, M, B, etc)
 * @param {number} value - Value to format
 * @returns {string} Formatted value with suffix
 */
function toSuffix(value) {
	if (typeof value !== 'number' || value < 0) return '0';
	
	value = Math.round(value);
	const suffixes = ["", "K", "M", "B", "T", "C", "Q", "S"];
	const suffixNum = Math.floor((("" + value).length - 1) / 3);
	const shortValue = parseFloat(
		(suffixNum !== 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(3)
	);
	
	if (shortValue % 1 !== 0) {
		return shortValue.toFixed(1) + suffixes[suffixNum];
	}
	return shortValue + suffixes[suffixNum];
}

/**
 * Converts a number to string with appropriate formatting
 * @param {number} value - Value to convert
 * @returns {string} Formatted string
 */
function intToString(value) {
	if (typeof value !== 'number') return '0';
	if (value >= 10000) {
		return toSuffix(value);
	}
	return parseFloat(value).toFixed(2);
}

/**
 * Converts a number to rounded string
 * @param {number} value - Value to convert
 * @returns {string} Rounded string
 */
function intToStringRound(value) {
	if (typeof value !== 'number') return '0';
	if (value >= 10000) {
		return toSuffix(value);
	}
	return Math.floor(value).toString();
}

/**
 * Formats spawn rate for display
 * @param {number} rate - Spawn rate value
 * @returns {string} Formatted rate
 */
function roundtoFormat1(rate) {
	if (typeof rate !== 'number') return '0.00';
	return rate.toFixed(2);
}

/**
 * Rounds a generic value (unused duplicate)
 * @param {number} val - Value to round
 * @returns {string} Formatted value
 */
function roundtoFormat2(val) {
	if (typeof val !== 'number') return '0.00';
	return val.toFixed(2);
}

/**
 * Converts seconds to minutes format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted as "M:SS"
 */
function convertSecToMin(seconds) {
	if (typeof seconds !== 'number' || seconds < 0) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return mins + ":" + (secs < 10 ? "0" : "") + secs;
}

/**
 * Generic round function (legacy)
 * @param {number} val - Value to round
 * @returns {number} Rounded value
 */
function round(val) {
	if (typeof val !== 'number') return 0;
	return Math.round(val);
}

/**
 * Validates that array indices are in bounds
 * @param {array} arr - Array to check
 * @param {number} index - Index to validate
 * @returns {boolean} True if index is valid
 */
function isValidArrayIndex(arr, index) {
	return Array.isArray(arr) && 
	       typeof index === 'number' && 
	       index >= 0 && 
	       index < arr.length;
}

/**
 * Safely gets array element at index
 * @param {array} arr - Array to access
 * @param {number} index - Index to get
 * @param {*} defaultValue - Default if index invalid
 * @returns {*} Array element or default value
 */
function safeArrayGet(arr, index, defaultValue = 0) {
	return isValidArrayIndex(arr, index) ? arr[index] : defaultValue;
}

/**
 * Calculates percentage of value relative to max
 * @param {number} value - Current value
 * @param {number} max - Maximum value
 * @returns {number} Percentage (0-100)
 */
function calculatePercentage(value, max) {
	if (typeof value !== 'number' || typeof max !== 'number' || max === 0) {
		return 0;
	}
	return (value / max) * 100;
}
