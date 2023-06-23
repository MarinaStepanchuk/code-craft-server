const getUniqueListById = (list) => {
  return list.reduce(
    (acc, item) => {
      if (acc.map[item.id]) {
        return acc;
      }
      acc.map[item.id] = true;
      acc.arrayList.push(item);
      return acc;
    },
    {
      map: {},
      arrayList: [],
    }
  ).arrayList;
};

export default getUniqueListById;
