const processData = (csv) => {
  const allTextLines = csv.split(/\r\n|\n/);
  const lines = [];
  for (let i = 0; i < allTextLines.length; i += 1) {
    const data = allTextLines[i].split(';');
    const tarr = [];
    for (let j = 0; j < data.length; j += 1) {
      tarr.push(data[j]);
    }
    lines.push(tarr);
  }
  return (lines);
};


const getAsText = (fileToRead) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const csv = event.target.result;
    const data = processData(csv);
    resolve(data);
  };
  reader.readAsText(fileToRead);
});

export default getAsText;
