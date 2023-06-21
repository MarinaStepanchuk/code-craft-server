const getRandomList = (list, count) => {
  const result = new Set();
  const n = count < list.length ? count : list.length;
  for (let i = 1; result.size <= n; i++) {
    result.add(list[Math.floor(Math.random() * list.length)]);
  }
  return Array.from(result);
};

export default getRandomList;
