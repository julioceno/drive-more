docker-compose -f ./docker/docker-compose.test.yml up -d && sleep .5 && dotenv -e .env.test -- yarn prisma migrate dev && dotenv -e .env.test -- yarn prisma db seed && dotenv -e .env.test --  jest --config ./test/jest-e2e.json ./test -i --detectOpenHandles; docker rm -f dirigir-more-single-sign-on-test-db