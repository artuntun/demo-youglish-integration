const bannedCharacters = [
  "'",
  '"',
  "(",
  ")",
  "[",
  "]",
  "{",
  "}",
  "<",
  ">",
  ".",
  ",",
  "'",
];

function isEditableElement(node) {
  const editableElements = ["INPUT", "TEXTAREA", "FORM"];
  const element =
    node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  return (
    editableElements.includes(element.tagName) || element.isContentEditable
  );
}

// Preprocess the selected word to remove apostrophe contractions
export const preprocessWord = (word) => {
  const contractions = [
    "'s",
    "’s",
    "'ve",
    "’ve",
    "'re",
    "’re",
    "'t",
    "’t",
    "'d",
    "’d",
    "'ll",
    "’ll",
    "'m",
    "’m",
  ];
  let processedWord = word;

  for (const contraction of contractions) {
    if (processedWord.endsWith(contraction)) {
      processedWord = processedWord.slice(0, -contraction.length);
      break; // Stop after removing one contraction
    }
  }

  return processedWord.trim();
};

export function isInvalidSelection(selection) {
  return (
    bannedCharacters.includes(selection.toString().trim()) ||
    isEditableElement(selection.anchorNode)
  );
}
