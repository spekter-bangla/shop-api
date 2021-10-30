export const AllCustomErrors = {
  // ... other errors

  invalidObjectIdError: {
    statusCode: 404,
    message: "ObjectId is not valid!",
  },

  unAuthorizedError: {
    errorMessage: "Unauthorized!",
    reason: `You are not authorized for this Operation`,
  },
};
