
const build = (payload) => {
  const myArray = [];
  if (Array.isArray(payload)) {
    payload.forEach((element) => {
      Object.keys(element).forEach((key) => {
        myArray.push(key);
      });
    });
  } else {
    Object.keys(payload).forEach((key) => {
      myArray.push(key);
    });
  }
  return myArray;
};


export default build;
