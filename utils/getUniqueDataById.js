const getUniqueListById = (list) => {
  return list.reduce(
    (acc, item) => {
      if (acc.map[item.id]) {
        return acc;
      }
      acc.map[item.id] = true;
      acc.tagsArray.push(item);
      return acc;
    },
    {
      map: {},
      tagsArray: [],
    }
  );
};

export default getUniqueListById;
