
export const filterOutSpacesOutsideQuotes = (text: string) => {
  const spaceIndices = findSpacesOutsideQuotes(text);
  if (spaceIndices) {
    return removeCharsAtIndices(text, spaceIndices);
  } else {
    return text;
  }
};
export const amperSandChain = (newLine = false) => (text: string) => {
  // If Text is anything but a javascript path with dots, return the text
  if (
    text.length === 0
  ) {
    // vscode.window.showInformationMessage(`Its not a valid AmpersandChainner Target. Selection Includes Space Character.`);
    return text;
  }

  text = filterOutSpacesOutsideQuotes(text);

  // const arr = text.match(/(\w+|\[\'.+?\'\]|\[".+?"\]|\[[\w-]+\])/g) || [];

  const arr = text.match(/(\w+|\[[^\]]+\])/g) || [];
  let result = '';
  let current = '';
  for (let i = 0; i < arr.length; i++) {
    const prop = arr[i];

    let conditionalDelimiter = '.';
    if (current.startsWith('[')) {
      conditionalDelimiter = '';
    }
    current += (current ? conditionalDelimiter : '') + prop;
    result += `${current} && ${newLine ? '\n' : ''}`;
  }
  return result.slice(0, newLine ? -5 : -4);
};

export const chainAmpersand = amperSandChain(false);
export const chainAmpersandNewLine = amperSandChain(true);

// console.log(chainAmpersandNewLine(`selectedObj['McClure Vand'].Champlin.wof.as`));

// Function to Conditionalize the Javascript Path Notation

export const optionalChain = (newLine = false) => (text: string = 'obj.child.property') => {
  // If Text is anything but a javascript path with dots, return the text
  if (
    text.length === 0
  ) {
    // vscode.window.showInformationMessage(`Its not a valid AmpersandChainner Target. Selection Includes Space Character.`);
    return text;
  }
  text = filterOutSpacesOutsideQuotes(text);

  // const arr = text.match(/(\w+|\[\'.+?\'\]|\[".+?"\]|\[[\w-]+\])/g) || [];

  const arr = text.match(/\w+|\[\w+\]|\([^)]*\)|\[[^\]]*\]/g) || [];
  let current = '';
  for (let i = 0; i < arr.length; i++) {
    const prop = arr[i];

    let conditionalDelimiter = '?.';
    if (prop.startsWith('[')) {
      conditionalDelimiter = '?.';
    } else if (prop.startsWith('(')) {
      conditionalDelimiter = '?.';
    }
    current += (current ? conditionalDelimiter : '') + prop;
  }
  return current;
};

export const chainOptional = optionalChain(false);
export const chainOptionalNewline = optionalChain(true);


const filterEmptyWhitespaces = (text: string) => {
  text = text.trim();
  const spacer = /(?<!['"`])\s+(?!(?:[^'`"]*[`'"])?[^'`"]*$)/g;

  return text;
};

// console.log(filterEmptyWhitespaces(`selectedObj 
// ['McClure Fart']().Champlin.wof.as()`));

// console.log(chainOptional());
// console.log(chainOptional('selectedObj.McClure.Champlin.wof.as'));
// console.log(chainOptional(`selectedObj['McClure Vand'].Champlin.wof.as`));
// console.log(chainOptionalNewline(`selectedObj[var].Champlin.wof.as`));
// console.log(chainOptional(`selectedObj[2].[0].FunctionName()`));


// Input
// firstThing.secondThing. lastThing.
// Output
// 23
// Input
// firstThing.11` `secondThing. lastThing.
// Output
// 28
// Input
// firstThing.secondThing.las' What 'tThing.
// Output
// null
// Input
// firstThing.secon" "dThing. lastT'Farta Lag'hing.
// Output
// 26,38
// Input
// Gordon Swift' 'Farta Lag'hing.
// Output
// 6

function findSpacesOutsideQuotes2(str: string) {
  const spacer = /((['"`]).*?\2|\S)+/g;
  const spaceIndices = [];
  let offset = 0;

  while (true) {
    const match = spacer.exec(str);
    if (!match) {
      break;
    }
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;
    const subStr = str.slice(offset, matchStart);
    const spaceIndex = subStr.lastIndexOf(' ');
    if (spaceIndex >= 0) {
      spaceIndices.push(offset + spaceIndex);
    }
    offset = matchEnd;
  }

  return spaceIndices.length > 0 ? spaceIndices : null;
}
function findSpacesOutsideQuotes(str: string) {
  const spacer = /((['"`]).*?\2|\S)+/g;
  const spaceIndices = [];
  let offset = 0;

  while (true) {
    const match = spacer.exec(str);
    if (!match) {
      break;
    }
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;
    const subStr = str.slice(offset, matchStart);
    const spaceIndicesInSubStr = [];
    let spaceIndex = subStr.lastIndexOf(' ');
    while (spaceIndex >= 0) {
      spaceIndicesInSubStr.push(offset + spaceIndex);
      spaceIndex = subStr.slice(0, spaceIndex).lastIndexOf(' ');
    }
    spaceIndices.push(...spaceIndicesInSubStr.reverse());
    offset = matchEnd;
  }

  return spaceIndices.length > 0 ? spaceIndices : null;
}

function removeCharsAtIndices(str: string, indices: number[]) {
  let result = '';
  let lastIndex = 0;

  for (let i = 0; i < indices.length; i++) {
    result += str.substring(lastIndex, indices[i]);
    lastIndex = indices[i] + 1;
  }

  result += str.substring(lastIndex);

  return result;
}


// console.log(findSpacesOutsideQuotes(`firstThing.multiple_spaces.  lastT'Farta Lag'hing. Fl`));
// console.log(findSpacesOutsideQuotes(`firstThing.secondThing. lastThing.`));
// console.log(findSpacesOutsideQuotes(`firs
// tThing.
// secondThing. lastThing.`));
// console.log(findSpacesOutsideQuotes(`firstThing.11" "secondThing. lastThing.`));
// console.log(findSpacesOutsideQuotes(`firstThing.secondThing.las' What 'tThing.`));
// console.log(findSpacesOutsideQuotes(`firstThing.secon" "dThing. lastT'Farta Lag'hing. Fl`));
// console.log(filterOutSpacesOutsideQuotes(`firstThing.secon" "dThing. lastT'Farta Lag'hing. Fl`));
// console.log(findSpacesOutsideQuotes(`Gordon Swift' 'Farta Lag'hing.`));


function findQuotedStrings(str: string) {
  const quotes = ['"', "'", '`'];
  const result = [];
  
  let start = null;
  let quote = null;
  
  for (let i = 0; i < str.length; i++) {
    if (quotes.includes(str[i])) {
      if (start === null) {
        start = i;
        quote = str[i];
      } else if (str[i] === quote) {
        const value = str.substring(start, i+1);
        result.push({value, start, end: i});
        start = null;
        quote = null;
      }
    }
  }
  
  return result;
}

