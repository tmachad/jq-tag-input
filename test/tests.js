$(document).ready(function() {
    let globals = {
        inputQuery: "#tag-input",
        multipleInputQuery: "#tag-input, #tag-input2"
    }

    QUnit.module("JQuery Integration", function(hooks) {
        QUnit.test("Registration", function(assert) {
            assert.ok($.fn.tagInput, "registered as a jQuery plugin");
        });
    
        QUnit.test("Creation", function(assert) {
            let input = $(globals.inputQuery);
    
            assert.ok(input.tagInput(), "successfully created tag input");
            assert.ok(input.data("tagInput"), "successfully attached tag input to element");
        });
    
        QUnit.test("Chainability", function(assert) {
            let input = $(globals.inputQuery);
    
            assert.ok(input.tagInput().addClass("testing"), "can be chained");
            assert.ok(input.hasClass("testing"), "chained successfully");
        });
    });

    QUnit.module("Options", function(hooks) {
        hooks.beforeEach(function(assert) {
            this.input = $(globals.inputQuery);
            assert.ok(this.input, "input element exists");
        });

        QUnit.test("Defaults", function(assert) {
            this.input.tagInput();
            
            assert.propEqual(this.input.data("tagInput").options, $.fn.tagInput.defaults, "default options applied");
            assert.ok(this.input.data("tagInput").root.is(".styled"), "default styling applied");
        });
    });
});