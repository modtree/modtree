yarn:
	yarn
	yarn build:deps
	yarn

k:
	cp ~/dots/personal/.secrets/modtree2.env .env
	mv .env ./packages/database
