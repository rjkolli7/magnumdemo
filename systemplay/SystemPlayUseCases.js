const generateRandomDigit = () => {
  return Math.floor(Math.random() * 10);
};

const generateRandom4DigitNumber = (inputNumbers) => {
  if (
    inputNumbers !== null &&
    inputNumbers.length > 0 &&
    Array.isArray(inputNumbers)
  ) {
    const updateInputNumbers = [...inputNumbers];
    const hasEmptyString = updateInputNumbers.some((value) => value === "");
    for (let i = 0; i < updateInputNumbers.length; i++) {
      let digit = updateInputNumbers[i];
      const randomDigit = generateRandomDigit();
      if (hasEmptyString) {
        if (digit === "") {
          digit = `${randomDigit}`;
        }
      } else if (digit !== "R") {
        digit = `${randomDigit}`;
      }
      inputNumbers[i] = digit;
    }
    return inputNumbers;
  }
  return inputNumbers;
};

const updateItemPermutation = (item, isPermutate) => {
  if (item !== null) {
    const updatedValue = {
      ...item,
    };
    updatedValue.isPermutate = isPermutate;
    if (
      updatedValue.inputNumber !== null &&
      updatedValue.inputNumber.length > 0
    ) {
      const combinations = isPermutate
        ? generatePermutateCombinations(updatedValue.inputNumber)
        : [];
      updatedValue.combinations = combinations;
      // update the System Bet Count
      const sbCount = combinations.length > 0 ? combinations.length : 1;
      updatedValue.sbCount = sbCount;
      updatedValue.price = sbCount * 2;
    }
    return updatedValue;
  }
  return item;
};

const updateRandomNumber = (item, inputNumbers, inputNumber) => {
  if (item !== null) {
    const updatedValue = {
      ...item,
    };
    updatedValue.inputNumber = inputNumber;
    updatedValue.inputNumbers = inputNumbers;
    const hasRoll = inputNumbers.some((value) => value === "R");
    updatedValue.hasRoll = hasRoll;
    updatedValue.isPermutate = hasRoll ? false : updatedValue.isPermutate;
    const combinations = hasRoll ? generateRollCombination(inputNumber) : [];
    const isSameValue = inputNumbers.every(
      (value) => value === inputNumbers[0]
    );
    updatedValue.isSameValue = isSameValue;
    updatedValue.isPermutate = isSameValue ? false : updatedValue.isPermutate;
    updatedValue.combinations = combinations;
    // update the System Bet Count
    const sbCount = combinations.length > 0 ? combinations.length : 1;
    updatedValue.sbCount = sbCount;
    updatedValue.price = sbCount * 2;
    return updatedValue;
  }
  return item;
};

const updateInputsByFocusedInputIndex = (
  item,
  focusedInputIndex,
  inputKeyValue,
  remove
) => {
  if (item !== null) {
    const updatedValue = {
      ...item,
    };
    const inputNumbers = [...updatedValue.inputNumbers];
    inputNumbers[focusedInputIndex] = inputKeyValue;
    updatedValue.inputNumbers = inputNumbers;
    const hasEmptyString = inputNumbers.some((value) => value === "");
    // check inputNumber has Roll
    const hasRoll = inputNumbers.some((value) => value === "R");
    updatedValue.hasRoll = hasRoll;
    updatedValue.isPermutate = hasRoll ? false : updatedValue.isPermutate;

    const inputNumber = hasEmptyString ? "" : inputNumbers.join("");
    updatedValue.inputNumber = inputNumber;
    if (inputNumber !== "") {
      // check all input values are same, to disable permutate
      const isSameValue = inputNumbers.every(
        (value) => value === inputNumbers[0]
      );
      updatedValue.isSameValue = isSameValue;
      updatedValue.isPermutate = isSameValue ? false : updatedValue.isPermutate;
      // check
      // get Roll / isPermutate get the combinations based on inputnumber and update to the item
      const combinations = hasRoll
        ? generateRollCombination(inputNumber)
        : updatedValue.isPermutate
        ? generatePermutateCombinations(inputNumber)
        : [];
      updatedValue.combinations = combinations;
      // update the System Bet Count
      const sbCount = combinations.length > 0 ? combinations.length : 1;
      updatedValue.sbCount = sbCount;
      updatedValue.price = sbCount * 2;
    }

    // check is keyboard back clicked
    if (remove) {
      // if back clicked change back focus to previous input
      updatedValue.focusedInputIndex =
        focusedInputIndex > 0
          ? item.focusedInputIndex - 1
          : item.focusedInputIndex;
    } else {
      // upon input to text to input change focus to next input
      updatedValue.focusedInputIndex =
        focusedInputIndex < 3
          ? item.focusedInputIndex + 1
          : item.focusedInputIndex;
    }
    return updatedValue;
  }
  return item;
};
const getTotalSbCount = (items) => {
  let totalSbCount = 0;
  items.forEach((item) => {
    const itemsbCount = item?.sbCount ?? 0;
    totalSbCount += itemsbCount;
  });
  return totalSbCount;
};

const getTotalPrice = (totalDates, items) => {
  let totalPrice = 0;
  items.forEach((item) => {
    const itemPrice = item?.price ?? 0;
    totalPrice += itemPrice;
  });
  totalPrice = totalDates * totalPrice;
  return totalPrice;
};

const generateRollCombination = (inputNumber) => {
  if (inputNumber !== null && inputNumber.includes("R")) {
    const rollCombinations = [];
    for (let roll = 0; roll <= 9; roll++) {
      let fourDNumber = inputNumber;
      fourDNumber = fourDNumber.replace(/R/g, roll);
      rollCombinations.push(fourDNumber);
    }
    return rollCombinations;
  }
  return [];
};

const generatePermutateCombinations = (inputNumber) => {
  const result = [];
  const seen = new Set();
  generatePermutations("", inputNumber, seen, result);
  return result;
};

const generatePermutations = (prefix, remaining, seen, result) => {
  if (remaining === "") {
    if (!seen.has(prefix)) {
      result.push(prefix);
      seen.add(prefix);
    }
  } else {
    for (let i = 0; i < remaining.length; i++) {
      const currentDigit = remaining.charAt(i);
      const newPrefix = prefix + currentDigit;
      const newRemaining =
        remaining.substring(0, i) + remaining.substring(i + 1);
      generatePermutations(newPrefix, newRemaining, seen, result);
    }
  }
};

const getCartItems = (items) => {
  const updatedItems = [...items];
  if (updatedItems !== null && Array.isArray(updatedItems)) {
    const combinationItems = updatedItems.filter(
      (item) => item.inputNumber !== null && item.inputNumber.length > 0
    );
    const selectedDates = state.selectedDatesIndex.map(
      (index) => state.datesList[index]
    );
    if (selectedDates !== null && selectedDates.length > 0) {
      const cartItems = [];
      selectedDates.forEach((dateObj) => {
        const cartItem = { date: dateObj, combinations: combinationItems };
        cartItems.push(cartItem);
      });
      return cartItems;
    }
  }
  return [];
};

export {
  updateInputsByFocusedInputIndex,
  generateRandom4DigitNumber,
  getTotalSbCount,
  getTotalPrice,
  updateItemPermutation,
  updateRandomNumber,
  getCartItems,
};
