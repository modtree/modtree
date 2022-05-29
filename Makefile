database := ./packages/database
web := ./apps/web
khang := ~/dots/personal/.secrets/modtree

yarn:
	@yarn
	@find . -name *.log | xargs rm
	@mkdir -p ./packages/database/.logs
	@if [[ $$USER == "khang" ]]; then make k; fi
	@if [[ $$USER == "weiseng" ]]; then make w; fi

w:
	cp $$REPOS/orbital/env/.env.local ./apps/web/.env.local
	cp $$REPOS/orbital/env/.env.test ./packages/database/.env.test
	cp $$REPOS/orbital/env/.env ./packages/database/.env

w-inv:
	cp ./packages/database/.env.test $$REPOS/orbital/env/.env.test
	cp ./packages/database/.env $$REPOS/orbital/env/.env

k:
	@cp $(khang)/web/.env* $(web)
	@cp $(khang)/database/.env* $(database)
	@echo "source: $(khang)"
	@echo "consider it done."

k-inv:
	@mkdir -p $(khang)/web
	@mkdir -p $(khang)/database
	@cp \
		${web}/.env.example \
		${web}/.env.local \
		$(khang)/web
	@cp \
	  $(database)/.env.example \
		$(database)/.env \
		$(database)/.env.test \
	  $(database)/.env.heroku \
		$(khang)/database
	@echo "target: $(khang)"
	@echo "consider it done."
