const splitIds = (url: string): string => {
  return "Shop/" + url.split("Shop/").pop()!.split(".")[0];
};

export const getPublicIdsFromImageUrl = (urls: string | string[]): string[] => {
  let result: string[] = [];

  if (Array.isArray(urls)) {
    urls.forEach((url) => {
      result.push(splitIds(url));
    });
  } else {
    result.push(splitIds(urls));
  }

  return result;
};
