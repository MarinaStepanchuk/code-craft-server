const getRandomList = (list, count) => {
  const indexSet = new Set();
  const n = count < list.length ? count : list.length;
  for (let i = 1; indexSet.size <= n; i++) {
    indexSet.add(Math.floor(Math.random() * list.length));
  }
  return Array.from(indexSet).map((item) => list[item]);
};

export default getRandomList;
