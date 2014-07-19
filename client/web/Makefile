ANALYTICS = src/javascripts/analytics
SRC_LIB = src/dependencies/lib

.PHONY: analytics

# ------------------------------------------------------------------------------
# ANALYTICS
#
analytics: analytics.core.js analytics.libraries.min.js
	
analytics.libraries.js:
	cat src/dependencies/lib/d3/3.4.8/d3.js \
	src/dependencies/lib/jquery/1.11.1/jquery-1.11.1.js \
	src/dependencies/lib/jquery/jquery.cookie.min.js \
	src/dependencies/lib/handlebars/1.3.0/handlebars.runtime-v1.3.0.js \
	src/dependencies/lib/ember/1.5.1/ember.js \
	src/dependencies/lib/ember-data/1.0.0-beta.8/ember-data.js \
	src/dependencies/lib/de/0.0.3/de.js \
	> src/dependencies/compiled/analytics.libraries.js

analytics.libraries.min.js:
	cat src/dependencies/lib/d3/3.4.8/d3.min.js \
	src/dependencies/lib/jquery/1.11.1/jquery-1.11.1.min.js \
	src/dependencies/lib/jquery/jquery.cookie.min.js \
	src/dependencies/lib/handlebars/1.3.0/handlebars.runtime-v1.3.0.js \
	src/dependencies/lib/ember/1.5.1/ember.min.js \
	src/dependencies/lib/ember-data/1.0.0-beta.8/ember-data.min.js \
	src/dependencies/lib/de/0.0.3/de.js \
	> src/dependencies/compiled/analytics.libraries.min.js

analytics.core.js: analytics.templates.js
	@cat \
	$(ANALYTICS)/app.js \
	$(ANALYTICS)/controllers/*.js $(ANALYTICS)/controllers/*/*.js $(ANALYTICS)/controllers/*/*/*.js \
	$(ANALYTICS)/helpers/*.js \
	$(ANALYTICS)/models/*.js \
	$(ANALYTICS)/mixins/*.js \
	$(ANALYTICS)/routes/*.js $(ANALYTICS)/routes/*/*.js $(ANALYTICS)/routes/*/*/*.js \
	$(ANALYTICS)/store/*.js \
	$(ANALYTICS)/compiled/templates.js \
	$(ANALYTICS)/views/*.js \
	$(ANALYTICS)/components/*.js \
	> $(ANALYTICS)/compiled/analytics.core.js
	@printf '   created: analytics.core.js\n'

analytics.templates.js:
	@node_modules/.bin/ember precompile -d $(ANALYTICS)/templates/ -f $(ANALYTICS)/compiled/templates.js
