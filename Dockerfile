FROM node:16-alpine AS builder

WORKDIR "/usr/app"

COPY . .

RUN yarn install

RUN yarn run build

FROM node:16-alpine AS production

WORKDIR "/usr/app"

COPY --from=builder /usr/app/package.json ./package.json
COPY --from=builder /usr/app/yarn.lock ./yarn.lock
COPY --from=builder /usr/app/build ./build
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/tsconfig.json ./tsconfig.json

EXPOSE 2000

CMD ["yarn", "start"]
