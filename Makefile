yarn:
	yarn
	yarn build:deps
	yarn
	find . -name *.log | xargs rm

k:
	cp ~/dots/personal/.secrets/modtree/.env .env
	cp ~/dots/personal/.secrets/modtree/.env.test .env.test
	mv .env* ./packages/database

k-inv:
	cp ./packages/database/.env* ~/dots/personal/.secrets/modtree
