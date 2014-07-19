METRONIC_ASSETS = _includes/templates/metronic/assets
ANALYTICS = src/javascripts/analytics
SRC_LIB = src/dependencies/lib

.PHONY: analytics

libraries.css:
	cat $(METRONIC_ASSETS)/plugins/font-awesome/css/font-awesome.min.css \
	$(METRONIC_ASSETS)/plugins/bootstrap/css/bootstrap.min.css \
	$(METRONIC_ASSETS)/plugins/uniform/css/uniform.default.css \
	$(METRONIC_ASSETS)/plugins/gritter/css/jquery.gritter.css \
	$(METRONIC_ASSETS)/plugins/fullcalendar/fullcalendar/fullcalendar.css \
	$(METRONIC_ASSETS)/plugins/jqvmap/jqvmap/jqvmap.css \
	$(METRONIC_ASSETS)/plugins/jquery-easy-pie-chart/jquery.easy-pie-chart.css \
	$(METRONIC_ASSETS)/plugins/bootstrap-datepicker/css/datepicker.css \
	$(METRONIC_ASSETS)/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css \
	$(METRONIC_ASSETS)/plugins/bootstrap-datetimepicker/css/datetimepicker.css \
	$(METRONIC_ASSETS)/css/style-metronic.css \
	$(METRONIC_ASSETS)/css/style.css \
	$(METRONIC_ASSETS)/css/style-responsive.css \
	$(METRONIC_ASSETS)/css/plugins.css \
	$(METRONIC_ASSETS)/css/pages/tasks.css \
	$(METRONIC_ASSETS)/css/themes/default.css \
	$(METRONIC_ASSETS)/css/print.css \
	$(METRONIC_ASSETS)/css/custom.css \
	$(METRONIC_ASSETS)/plugins/select2/select2.css \
	$(METRONIC_ASSETS)/plugins/select2/select2-metronic.css \
	$(METRONIC_ASSETS)/plugins/data-tables/DT_bootstrap.css \
	$(METRONIC_ASSETS)/plugins/bootstrap-toastr/toastr.min.css \
	> $(METRONIC_ASSETS)/css/libraries.css

# ------------------------------------------------------------------------------
# ANALYTICS
#
analytics: analytics.core.js analytics.templates.js analytics.libraries.css analytics.css
	
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

analytics.libraries.css:
	cat $(SRC_LIB)/bootstrap/3.2.0/css/bootstrap.min.css \
	$(SRC_LIB)/font-awesome/4.1.0/css/font-awesome.min.css \
	$(SRC_LIB)/metronic/2.0.2/css/style-metronic.css \
	$(SRC_LIB)/metronic/2.0.2/css/style.css \
	$(SRC_LIB)/metronic/2.0.2/css/style-responsive.css \
	$(SRC_LIB)/metronic/2.0.2/css/themes/default.css \
	> public/css/analytics.libraries.css

analytics.css:
	cat src/stylesheets/analytics/app.css \
	> public/css/analytics.css
