# Game Modules - Reorganized Code Structure

This directory contains refactored, modular, function-oriented code for the Pull of War game. The code has been reorganized to improve maintainability, testability, and clarity.

## Module Overview

### 1. `validation.js` - Input Validation
Provides all input validation functions used throughout the game.

**Key Functions:**
- `canAfford(cost, currentGold)` - Check if player can afford a purchase
- `isValidUnitType(type)` - Validate unit type string
- `isValidBuildingType(type)` - Validate building type string
- `isValidStatIndex(index, maxIndex)` - Validate stat index range
- `isValidButtonPosition(pos)` - Validate button position (1-6)
- `hasPointsAllocated(unitPointValues, statIndex)` - Check if stat has allocated points
- `hasHealthPointsAvailable(unitPointValues)` - Check if health pool has points

**Usage Pattern:**
Always validate inputs before processing user actions.
```javascript
if (isValidButtonPosition(pos) && isValidUnitType(type)) {
    // Process button click
}
```

### 2. `calculations.js` - Pure Calculations
Contains all game calculation functions. These are pure functions with no side effects.

**Key Functions:**
- `calculateStatValue(initialValue, points)` - Calculate stat value from points
- `updateSpawnRate(currentRate, rateReduction)` - Update spawn rate timer
- `calculateConstructionCost(baseTerritoryCost, increaseRatio, count)` - Calc building cost
- `calculateSpawnRateCostUpgrade(currentCost)` - Calculate new spawn rate upgrade cost
- `calculateUnitUpgradeCostIncrease(currentCost)` - Calculate unit upgrade cost increase
- `calculateBuildingUpgradeCost(currentCost, multiplier)` - Calculate building upgrade cost
- `calculateBuildingHealthGain(buildingType)` - Get health gain from building upgrade
- `getBuildingCostMultiplier(buildingType)` - Get cost multiplier for building type
- `calculateWeightedAverage(val1, val2, count1, count2)` - Calculate weighted average

**Design Principle:**
These functions are pure - they don't modify global state and always return the same result for the same inputs.

### 3. `utilities.js` - Helper Functions
Formatting, rounding, and common utility functions.

**Key Functions:**
- `round1(val)`, `round2(val)` - Round to decimal places
- `roundToPrecision(val, decimals)` - Generic rounding with precision
- `average(val1, val2)` - Calculate simple average
- `toSuffix(value)` - Format large numbers with K, M, B, etc.
- `intToString(value)`, `intToStringRound(value)` - Convert numbers to strings
- `roundtoFormat1(rate)`, `roundtoFormat2(val)` - Format for display
- `convertSecToMin(seconds)` - Convert seconds to MM:SS format
- `clamp(val, min, max)` - Clamp value within range
- `calculatePercentage(value, max)` - Calculate percentage

**Usage:**
Use these utilities for consistent formatting across the UI.
```javascript
document.getElementById("goldDisplay").innerHTML = intToStringRound(gold);
```

### 4. `autoCalculations.js` - Auto-Calculation Logic
Handles all automatic game state calculations (spawn rates, construction, etc.)

**Key Functions:**
- `calculateSpawnRates(state)` - Calculate all spawn rate timers
- `calculateConstruction(spawnList, constructionTotal)` - Calculate construction progress
- `calculateTerritoryUsed(spawnList)` - Calculate territory used by spawn list
- `calculateNextConstructionCost(unitType, spawnList)` - Get next placement cost
- `validateSpawnAmounts(spawnAmounts)` - Validate spawn amounts are non-negative
- `validateSpawnRate(rate)` - Validate and sanitize spawn rates
- `calculateUnitUpgradeCosts(typeNum)` - Calculate all upgrade costs for unit

**Purpose:**
Separates calculation logic from UI updates and state modifications.

### 5. `buttons.js` - Button Click Handlers
Refactored button handlers with improved logic and input validation.

**Key Functions:**
- `handleUnitUpgradeButton(pos, type)` - Handle unit stat upgrade buttons
- `handleBuildingUpgradeButton(num, type)` - Handle building upgrade buttons
- `handleSpawnRateUpgradeButton(type)` - Handle spawn rate upgrade
- `handleBuyUpgradePointButton(type)` - Handle upgrade point purchase
- `deallocatePointFromStat(typeNum, fromStatIndex, toStatIndex)` - Remove points
- `allocatePointToStat(typeNum, toStatIndex, fromStatIndex)` - Add points to stat
- `applyBuildingUpgrade(type, buildingIndex, buttonNum, cost)` - Apply building purchase
- `applySpawnRateUpgrade(typeNum)` - Apply spawn rate improvement
- `applyUpgradePointPurchase(typeNum)` - Apply point purchase

**Improvements Over Original:**
1. **Input Validation** - All functions validate inputs before processing
2. **Separation of Concerns** - Calculation, state changes, and UI updates are separated
3. **Consistent Logic** - All buttons follow the same pattern
4. **Better Error Handling** - Invalid inputs are logged and handled gracefully
5. **Pure Functions** - Helper functions are pure when possible
6. **Backwards Compatibility** - Main functions maintain original signatures

**Example - Before:**
```javascript
function clickBuyButton(pos, type) {
    typeNum = convertTypeToNum(type, "right")
    let index = pos - 1;
    if(pos === 4) {
        if(unitPointValues[typeNum][0] > 0) {
            unitPointValues[typeNum][0]--;
            unitPointValues[typeNum][3]++;
            handleBuyAmounts(typeNum, 0)
            handleBuyAmounts(typeNum, 3)
            updateStatusUpgrades("", type)
            updateGoldVisual()
        }
    } else {
        // ... more mixed logic
    }
}
```

**Example - After:**
```javascript
function clickBuyButton(pos, type) {
    if (!isValidButtonPosition(pos) || !isValidUnitType(type)) {
        console.error(`Invalid inputs`);
        return;
    }
    
    const typeNum = convertTypeToNum(type, "right");
    const statIndex = pos - 1;
    
    // Clear logic: validate, decide action, execute, update
    if (unitPointValues[typeNum][statIndex] > 0) {
        deallocatePointFromStat(typeNum, statIndex, 3);
    } else if (unitPointValues[typeNum][3] > 0) {
        allocatePointToStat(typeNum, statIndex, 3);
    }
    
    updateUnitUpgradeDisplay(typeNum, statIndex);
    updateStatusUpgrades("", type);
    updateGoldVisual();
}
```

### 6. `inputHandlers.js` - Input and Event Handlers
Centralizes all user input handling and event listeners.

**Key Functions:**
- `hoverAUnit(id)` - Handle unit hover
- `removeHover()` - Remove hover state
- `processKeyQueue()` - Process keyboard input queue
- `initializeKeyboardHandlers()` - Set up keyboard event listeners
- `addToPlaceList(unitType)` - Add unit to spawn list
- `removeFromPlaceList(element)` - Remove unit from spawn list
- `shiftPlaceListUp(element)`, `shiftPlaceListDown(element)` - Reorder spawn list
- `switchMainTab(tabIndex)` - Switch main UI tabs
- `pause()` - Toggle pause state
- `upgradeConstructionRate()` - Upgrade construction workers
- `clickAUnit(id)`, `clickedSpell(spellIndex)` - Unit/spell interactions
- `changeUnitScreen(unitType)`, `changeBuildingScreen(buildingType)` - Screen navigation

**Purpose:**
Centralizes all input handling in one place for easier maintenance and testing.

## Code Organization Principles

### 1. Separation of Concerns
- **Validation** - Input validation separated from logic
- **Calculations** - Game logic separated from state management
- **Display** - UI updates in separate functions/files
- **Input** - Event handling centralized

### 2. Function-Oriented Design
- Each function has a single responsibility
- Functions are named to clearly indicate purpose
- Related functions are grouped in modules
- Public APIs are clearly defined

### 3. Input Validation
- Always validate inputs at function entry
- Use validation module functions consistently
- Log errors for invalid inputs
- Fail gracefully with early returns

### 4. Error Handling
- Check for null/undefined values
- Validate array indices before access
- Use `safeArrayGet` for array access
- Return sensible defaults for invalid inputs

### 5. Documentation
- Every function has a JSDoc comment
- Parameters and return types are documented
- Usage examples provided where helpful
- Module purpose explained at top

## Migration Guide

### Old Code Pattern
```javascript
function clickBuyButton(pos, type) {
    typeNum = convertTypeToNum(type, "right")
    // ... mixed logic, no validation
    unitPointValues[typeNum][index]--
    updateStatusUpgrades("", type)
}
```

### New Code Pattern
```javascript
function clickBuyButton(pos, type) {
    // 1. Validate inputs
    if (!isValidButtonPosition(pos) || !isValidUnitType(type)) {
        console.error("Invalid input");
        return;
    }
    
    // 2. Get data
    const typeNum = convertTypeToNum(type, "right");
    const statIndex = pos - 1;
    
    // 3. Execute pure calculation/logic
    if (hasPointsAllocated(unitPointValues[typeNum], statIndex)) {
        deallocatePointFromStat(typeNum, statIndex, 3);
    } else if (hasHealthPointsAvailable(unitPointValues[typeNum])) {
        allocatePointToStat(typeNum, statIndex, 3);
    }
    
    // 4. Update display
    updateUnitUpgradeDisplay(typeNum, statIndex);
    updateStatusUpgrades("", type);
    updateGoldVisual();
}
```

## Testing

Each module is designed to be independently testable:

```javascript
// Pure function - easy to test
const result = calculateStatValue(100, 5);
console.assert(result > 0);

// Validation - easy to test
console.assert(isValidUnitType("soldier") === true);
console.assert(isValidUnitType("invalid") === false);

// Button handlers - can test with mock state
unitPointValues = [[0,0,0,10,0,0]];
handleUnitUpgradeButton(1, "soldier");
console.assert(unitPointValues[0][0] === 1);
```

## Future Improvements

1. **State Management Module** - Centralize global state
2. **UI Update Module** - Dedicated graphics/DOM update functions
3. **Game State Persistence** - Better save/load logic
4. **Unit Testing Framework** - Jasmine or Jest integration
5. **Type System** - TypeScript migration for type safety

## Performance Notes

- Pure functions in calculations.js can be optimized independently
- No redundant DOM queries in new code
- Input validation happens once per action
- Modular structure allows for lazy loading if needed

## Backwards Compatibility

All changes maintain backwards compatibility:
- Original function signatures preserved
- HTML onclick handlers still work
- No breaking changes to global state
- Can gradually migrate old code to use new modules
