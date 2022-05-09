FORCE:

khang:
	cp ~/dots/personal/.secrets/modtree-typeorm.env.local .env
	cp .env ./apps/backend/functions
	mv .env ./packages/modtree
