const chunkArrayInGroups = (arr, size) => {
    const resArr = [];
  
    while (arr.length) {
      resArr.push(arr.splice(0, size));
    }
  
    return resArr;
}

module.exports = {
    chunkArrayInGroups
}