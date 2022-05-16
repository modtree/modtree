yarn:
	yarn
	find . -name *.log | xargs rm
	mkdir ./packages/database/.logs

w:
	cp $$REPOS/orbital/env/.env.test ./packages/database/.env.test
	cp $$REPOS/orbital/env/.env ./packages/database/.env

w-inv:
	cp ./packages/database/.env.test $$REPOS/orbital/env/.env.test
	cp ./packages/database/.env $$REPOS/orbital/env/.env

k:
	cp ~/dots/personal/.secrets/modtree/.env .env
	cp ~/dots/personal/.secrets/modtree/.env.test .env.test
	cp ~/dots/personal/.secrets/modtree/.env.local ./apps/web
	mv .env* ./packages/database

k-inv:
	cp ./packages/database/.env* ~/dots/personal/.secrets/modtree
	cp ./apps/web/.env.local ~/dots/personal/.secrets/modtree
