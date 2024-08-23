export const capitalizeFirstLetter = (query: string) => {
  return query?.charAt(0).toUpperCase() + query?.substring(1);
};

export const capitalizeWords = (query: string) => {
  return query
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ');
};
