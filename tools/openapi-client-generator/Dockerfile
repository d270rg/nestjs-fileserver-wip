FROM timbru31/java-node:jdk-20
RUN npm install @openapitools/openapi-generator-cli -g
RUN mkdir /local
WORKDIR /local
COPY . .
RUN chmod 777 generate.sh
RUN chmod 777 copy.sh

ENTRYPOINT [ "./generate.sh" ]