yarn:
	yarn
	find . -name *.log | xargs rm

w:
	cp $$REPOS/orbital/env/.env.test ./packages/database/.env.test
	cp $$REPOS/orbital/env/.env ./packages/database/.env

w-inv:
	cp ./packages/database/.env.test $$REPOS/orbital/env/.env.test
	cp ./packages/database/.env $$REPOS/orbital/env/.env

k:
	cp ~/dots/personal/.secrets/modtree/.env .env
	cp ~/dots/personal/.secrets/modtree/.env.test .env.test
	mv .env* ./packages/database

k-inv:
	cp ./packages/database/.env* ~/dots/personal/.secrets/modtree
