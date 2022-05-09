yarn:
	yarn
	yarn build:deps
	yarn

khang:
	cp ~/dots/personal/.secrets/modtree-typeorm.env.local .env
	cp .env ./apps/backend/functions
	mv .env ./packages/modtree
