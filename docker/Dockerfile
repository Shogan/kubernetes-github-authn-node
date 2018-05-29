FROM node:9.5.0-alpine

RUN mkdir -p /usr/src/node-kubernetes-github-authn
WORKDIR /usr/src/node-kubernetes-github-authn
COPY . /usr/src/node-kubernetes-github-authn

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python

RUN npm install --production
EXPOSE 3000

CMD ["node", "server.js"]