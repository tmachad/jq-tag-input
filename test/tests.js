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

            let tagInput = this.input.data("tagInput");
            assert.propEqual(tagInput.options, $.fn.tagInput.defaults, "default options applied");
            assert.ok(tagInput.root.is(".styled"), "default styling applied");
            assert.ok(!$(".twitter-typeahead").length, "no typeahead instatiated");
        });

        QUnit.test("Disable Default Styling", function(assert) {
            let options = Object.assign({}, $.fn.tagInput.defaults, {
                useDefaultStyle: false
            });

            this.input.tagInput(options);

            let tagInput = this.input.data("tagInput");
            assert.propEqual(tagInput.options, options, "options applied");
            assert.ok(!tagInput.root.is(".styled"), "default styling not applied");
        });

        QUnit.test("Set Placeholder Text", function(assert) {
            let testPlaceholderText = "Placeholder";
            let options = Object.assign({}, $.fn.tagInput.defaults, {
                placeholderText: testPlaceholderText
            });

            this.input.tagInput(options);

            let tagInput = this.input.data("tagInput");
            assert.propEqual(tagInput.options, options, "options applied");
            assert.propEqual(tagInput.input.attr("placeholder"), testPlaceholderText, "successfully set placeholder text");
        });

        QUnit.test("Set Class Names", function(assert) {
            let testClassNames = {
                overall: "test-tag-input",
                tag: "test-tag",
                tagDelete: "test-delete-tag",
                input: "test-input"
            };
            let options = Object.assign({}, $.fn.tagInput.defaults, {
                classNames: testClassNames
            });

            this.input.tagInput(options);

            let tagInput = this.input.data("tagInput");

            tagInput.addTag("test-tag");
            let tag = tagInput.getTags()[0];

            assert.propEqual(tagInput.options, options, "options applied");
            assert.ok(tagInput.root.hasClass(testClassNames.overall), "overall class name applied");
            assert.ok(tag.hasClass(testClassNames.tag), "tag class name applied");
            assert.ok(tag.find("span").hasClass(testClassNames.tagDelete), "tagDelete class name applied");
            assert.ok(tagInput.input.hasClass(testClassNames.input), "input class name applied");
        });

        QUnit.test("Enable Typeahead", function(assert) {
            let options = Object.assign({}, $.fn.tagInput.defaults, {
                typeaheadjs: {
                    datasets: [
                        {
                            name: "tags",
                            source: function(query, callback) {
                                callback(["Test"]);
                            }
                        }
                    ]
                }
            });

            this.input.tagInput(options);

            let tagInput = this.input.data("tagInput");

            assert.propEqual(tagInput.options, options, "options applied");
            assert.ok(tagInput.root.find(".twitter-typeahead").length, "typeahead instatiated");
        });
    });
});