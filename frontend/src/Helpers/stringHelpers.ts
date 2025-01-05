export const wrapText = (text: string, maxLength: number): string => {
  let words = text.split(' ');
  let lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    if (currentLine.length + words[i].length + 1 <= maxLength) {
      currentLine += (currentLine.length === 0 ? '' : ' ') + words[i];
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines.join('\n');
};


export const wrapText2 = (text: string, maxLength: number): string => {
  let words = text.split(' ');
  let lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    while (word.length > maxLength) {
      lines.push(word.slice(0, maxLength));
      word = word.slice(maxLength);
    }

    if (currentLine.length + word.length + 1 <= maxLength) {
      currentLine += (currentLine.length === 0 ? '' : ' ') + word;
    } else {
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines.join('\n');
};
