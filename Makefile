database := ./packages/database
web := ./apps/web
khang := ~/dots/personal/.secrets/modtree
weiseng := $$REPOS/orbital/env

yarn:
	@yarn
	@find . -name *.log | xargs rm
	@mkdir -p ./packages/database/.logs
	@if [[ $$USER == "khang" ]]; then make k; fi
	@if [[ $$USER == "weiseng" ]]; then make w; fi

i:
	@if [[ $$USER == "khang" ]]; then make k-inv; fi
	@if [[ $$USER == "weiseng" ]]; then make w-inv; fi

w:
	cp $(weiseng)/.env.local $(web)/.env.local
	cp $(weiseng)/.env $(database)/.env

w-inv:
	cp $(web)/.env.local $(weiseng)/.env.local
	cp $(database)/.env $(weiseng)/.env

k:
	@cp $(khang)/web/.env* $(web)
	@cp $(khang)/database/.env* $(database)
	@echo "[installing env files]"
	@echo "source: $(khang)"
	@echo "consider it done."

k-inv:
	@mkdir -p $(khang)/web
	@mkdir -p $(khang)/database
	@cp \
		${web}/.env.local \
		${web}/.env.example \
		$(khang)/web
	@cp \
		$(database)/.env \
		${database}/.env.example \
		$(khang)/database
	@echo "[saving env files]"
	@echo "target: $(khang)"
	@echo "consider it done."
