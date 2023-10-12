docker-compose -f ./docker/docker-compose.test.yml up -d 
sleep .5 
dotenv -e .env.test -- yarn prisma migrate dev 
dotenv -e .env.test -- yarn ts-node --transpile-only prisma/test/seed.ts 
dotenv -e .env.test -- jest --config ./test/jest-e2e.json ./test -i --detectOpenHandles
docker rm -f drive-more-management-test-db
