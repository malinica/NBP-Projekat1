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
