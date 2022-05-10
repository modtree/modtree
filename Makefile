yarn:
	yarn
	yarn build:deps
	yarn
	find . -name *.log | xargs rm

k:
	cp ~/dots/personal/.secrets/modtree2.env .env
	mv .env ./packages/database
