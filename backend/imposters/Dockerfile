FROM node:10-alpine as build-step
RUN npm install -g mountebank
RUN mkdir /workspace
WORKDIR /workspace
COPY imposter.json mb.json
EXPOSE 2525
EXPOSE 9000
CMD pwd
CMD mb restart --configfile mb.json  --allowInjection




