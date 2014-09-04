TESTS = test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--compilers coffee:coffee-script/register \
		--recursive \
		--timeout 2000 \
			$(TESTS)

.PHONY: test