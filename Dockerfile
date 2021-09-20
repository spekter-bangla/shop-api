FROM node:14
WORKDIR /app
COPY package*.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
  then npm install --only=production; \
  else npm install; \
  fi

COPY . ./
# ENV PORT 5000
# EXPOSE $PORT
CMD ["npm", "run", "start"]