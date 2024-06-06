export const formatDate = (dateString) => {
  return new Date(dateString).toISOString().split("T")[0];
};

export const parentIdThenIdComparator = (a, b) => {
  if (a.parentId === null && b.parentId !== null) {
    return b.id - b.parentId;
  } else if (a.parentId !== null && b.parentId === null) {
    return a.parentId - b.id;
  } else if (
    a.parentId !== null &&
    b.parentId !== null &&
    a.parentId !== b.parentId
  ) {
    return a.parentId - b.parentId;
  }
  return a.id - b.id;
};
