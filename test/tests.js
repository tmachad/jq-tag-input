$(document).ready(function() {
    let globals = {
        inputQuery: "#tag-input",
        multipleInputQuery: "#tag-input, #tag-input2"
    };

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
            assert.deepEqual($(".twitter-typeahead").length, 0, "no typeahead instatiated");
        });

        QUnit.test("Disable Default Styling", function(assert) {
            let options = $.extend({}, $.fn.tagInput.defaults, {
                useDefaultStyle: false
            });

            this.input.tagInput(options);

            let tagInput = this.input.data("tagInput");
            assert.propEqual(tagInput.options, options, "options applied");
            assert.notOk(tagInput.root.is(".styled"), "default styling not applied");
        });

        QUnit.test("Set Placeholder Text", function(assert) {
            let testPlaceholderText = "Placeholder";
            let options = $.extend({}, $.fn.tagInput.defaults, {
                placeholderText: testPlaceholderText
            });

            this.input.tagInput(options);

            let tagInput = this.input.data("tagInput");
            assert.propEqual(tagInput.options, options, "options applied");
            assert.deepEqual(
                tagInput.input.attr("placeholder"),
                testPlaceholderText,
                "successfully set placeholder text"
            );
        });

        QUnit.test("Set Class Names", function(assert) {
            let testClassNames = {
                overall: "test-tag-input",
                tag: "test-tag",
                tagDelete: "test-delete-tag",
                input: "test-input"
            };
            let options = $.extend({}, $.fn.tagInput.defaults, {
                classNames: testClassNames
            });

            this.input.tagInput(options);

            let tagInput = this.input.data("tagInput");

            tagInput.addTag("test-tag");
            let tag = tagInput.tags[0].element;

            assert.propEqual(tagInput.options, options, "options applied");
            assert.ok(tagInput.root.hasClass(testClassNames.overall), "overall class name applied");
            assert.ok(tag.hasClass(testClassNames.tag), "tag class name applied");
            assert.ok(tag.find("span").hasClass(testClassNames.tagDelete), "tagDelete class name applied");
            assert.ok(tagInput.input.hasClass(testClassNames.input), "input class name applied");
        });

        QUnit.test("Enable Typeahead", function(assert) {
            let options = $.extend({}, $.fn.tagInput.defaults, {
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

            assert.deepEqual(tagInput.root.find(".twitter-typeahead").length, 1, "typeahead instatiated");
        });
    });

    QUnit.module("Class Functionality", function(hooks) {
        hooks.beforeEach(function(assert) {
            let input = $(globals.inputQuery);
            input.tagInput();
            this.tagInput = input.data("tagInput");
        });

        QUnit.module("Add Tag", function(hooks) {
            hooks.beforeEach(function(assert) {
                this.testTagNames = [];
            });

            hooks.afterEach(function(assert) {
                this.testTagNames.forEach(name => {
                    assert.deepEqual(
                        this.tagInput.root.find(`span:contains("${name}")`).length,
                        1,
                        `successfully added tag "${name}" to html`
                    );
                });
            });

            QUnit.test("Add First Tag", function(assert) {
                this.testTagNames = ["test_1"];

                assert.ok(this.tagInput.addTag(this.testTagNames[0]), "successfully added first tag");
            });

            QUnit.test("Add Duplicate Tag", function(assert) {
                this.testTagNames = ["test_1"];

                assert.ok(this.tagInput.addTag(this.testTagNames[0]), "successfully added first tag");
                assert.notOk(this.tagInput.addTag(this.testTagNames[0]), "duplicate tag was not added");
            });

            QUnit.test("Add Multiple Tags", function(assert) {
                this.testTagNames = ["test_1", "test_2", "test_3"];

                assert.ok(this.tagInput.addTag(this.testTagNames[0]), "successfully added first tag");
                assert.ok(this.tagInput.addTag(this.testTagNames[1]), "successfully added second tag");
                assert.ok(this.tagInput.addTag(this.testTagNames[2]), "successfully added third tag");
            });
        });

        QUnit.module("Remove Tag", function(hooks) {
            this.testTagNames = ["test_1", "test_2", "test_3"];

            hooks.afterEach(function(assert) {
                this.testTagNames.forEach(name => {
                    assert.deepEqual(
                        this.tagInput.root.find(`span:contains("${name}")`).length,
                        0,
                        `success, tag "${name}" does not exist in html`
                    );
                });
            });

            QUnit.test("Remove Non-Existent Tag", function(assert) {
                assert.notOk(this.tagInput.removeTag(this.testTagNames[0]), "non-existent tag was not removed");
            });

            QUnit.test("Remove Only Tag", function(assert) {
                this.tagInput.addTag(this.testTagNames[0]);
                assert.ok(this.tagInput.removeTag(this.testTagNames[0]), "successfully removed only tag");
            });

            QUnit.test("Remove Multiple Tags", function(assert) {
                this.testTagNames.forEach(name => {
                    this.tagInput.addTag(name);
                });

                this.testTagNames.forEach(name => {
                    assert.ok(this.tagInput.removeTag(name), `successfully remove tag "${name}"`);
                });
            });
        });

        QUnit.module("Get Tags", function(hooks) {
            hooks.beforeEach(function(assert) {
                this.testTagNames = ["test_1", "test_2", "test_3"];
            });

            QUnit.test("Number of Tags Returned is Correct", function(assert) {
                this.testTagNames.forEach(name => {
                    this.tagInput.addTag(name);
                });

                assert.deepEqual(
                    this.tagInput.getTags().length,
                    this.testTagNames.length,
                    "number of tags returned is correct"
                );
            });

            QUnit.test("Tags are Returned in Same Order", function(assert) {
                this.testTagNames.forEach(name => {
                    this.tagInput.addTag(name);
                });

                this.testTagNames.forEach((name, index) => {
                    assert.deepEqual(this.tagInput.getTags()[index], name, `tag at position ${index} matches`);
                });
            });
        });
    });

    QUnit.module("User Interaction", function(hooks) {
        QUnit.module("Without Typeahead", function(hooks) {
            hooks.beforeEach(function(assert) {
                let input = $(globals.inputQuery);
                input.tagInput();
                this.tagInput = input.data("tagInput");
            });

            QUnit.test("Clicking Root Gives Input Focus", function(assert) {
                assert.notOk(this.tagInput.input.is(":focus"), "input does not have focus before click on root");
                this.tagInput.root.click();
                assert.ok(this.tagInput.input.is(":focus"), "input has focus after click on root");
            });

            QUnit.test("Add Tag Through Input", function(assert) {
                assert.deepEqual(this.tagInput.getTags().length, 0, "no tags before adding tag");
                this.tagInput.input.val("test_tag").change();
                assert.deepEqual(this.tagInput.getTags().length, 1, "one tag after adding tag");
            });

            QUnit.test("Click Tag to Remove", function(assert) {
                this.tagInput.addTag("test_tag");
                let tag = this.tagInput.tags[0].element;
                assert.ok(tag, "tag is present");
                tag.click();
                assert.deepEqual(this.tagInput.getTags().length, 0, "successfully removed tag with click");
            });
        });

        QUnit.module("With Typeahead", function(hooks) {
            hooks.beforeEach(function(assert) {
                let input = $(globals.inputQuery);
                input.tagInput({
                    typeaheadjs: {
                        datasets: [
                            {
                                name: "test_tags",
                                source: function(query, callback) {
                                    let regex = new RegExp(query, "i");

                                    let values = ["Test", "Potato", "Hello", "World", "Tomato", "Watermelon"];

                                    callback(values.filter(value => regex.test(value)));
                                }
                            }
                        ]
                    }
                });
                this.tagInput = input.data("tagInput");
            });

            QUnit.test("Add Tag Through Autocomplete", function(assert) {
                assert.deepEqual(this.tagInput.getTags().length, 0, "no tags before adding tag");
                this.tagInput.input.trigger("typeahead:autocomplete", "Test");
                assert.deepEqual(this.tagInput.getTags().length, 1, "one tag after adding tag");
            });

            QUnit.test("Add Tag Through Suggestion Selection", function(assert) {
                assert.deepEqual(this.tagInput.getTags().length, 0, "no tags before adding tag");
                this.tagInput.input.trigger("typeahead:select", "Test");
                assert.deepEqual(this.tagInput.getTags().length, 1, "one tag after adding tag");
            });

            QUnit.test("Add Tag Through Input", function(assert) {
                assert.deepEqual(this.tagInput.getTags().length, 0, "no tags before adding tag");
                this.tagInput.input.typeahead("val", "Test").change();
                assert.deepEqual(this.tagInput.getTags().length, 1, "one tag after adding tag");
            });
        });

        QUnit.module("With Typeahead Exact Match", function(hooks) {
            hooks.beforeEach(function(assert) {
                let input = $(globals.inputQuery);

                let dataset_1 = [
                    "Sasquatch",
                    "Tower",
                    "Ocean",
                    "Hungry"
                ];
                let datasource_1 = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.whitespace,
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    local: dataset_1
                });

                let dataset_2 = [
                    "Test", 
                    "Potato", 
                    "Hello", 
                    "World", 
                    "Tomato", 
                    "Watermelon"
                ];
                let datasource_2 = function(query, callback) {
                    let regex = new RegExp(query, "i");
                    callback(dataset_2.filter(value => regex.test(value)));
                }

                input.tagInput({
                    typeaheadjs: {
                        exactMatchOnly: true,
                        datasets: [
                            {
                                name: "dataset_1",
                                source: datasource_1
                            },
                            {
                                name: "dataset_2",
                                source: datasource_2
                            }
                        ]
                    }
                });
                this.tagInput = input.data("tagInput");
            });

            QUnit.test("Can Add Tag From Function Dataset", function(assert) {
                let done = assert.async();
                this.tagInput.replacedInput.on("tagInput:addTag", () => {
                    assert.deepEqual(this.tagInput.tags.length, 1, "tag was added successfully");
                    done();
                });

                this.tagInput.input.typeahead("val", "Test").change();
            });

            QUnit.test("Can Add Tag From Bloodhound Dataset", function(assert) {
                let done = assert.async();
                this.tagInput.replacedInput.on("tagInput:addTag", () => {
                    assert.deepEqual(this.tagInput.tags.length, 1, "tag was added successfully");
                    done();
                });

                this.tagInput.input.typeahead("val", "Tower").change();
            });

            QUnit.test("Cannot Add Tag Outside Of Datasets", function(assert) {
                let done = assert.async();
                this.tagInput.replacedInput.on("tagInput:addTag", () => {
                    assert.deepEqual(this.tagInput.tags.length, 1, "only one tag was added");
                    done();
                });

                this.tagInput.input.typeahead("val", "Nonexistent Tag").change();
                this.tagInput.input.typeahead("val", "Tower").change();
            });
        })

        QUnit.module("Backspace Delete", function(hooks) {
            hooks.beforeEach(function(assert) {
                let input = $(globals.inputQuery);
                input.tagInput({
                    deleteWithBackspace: true
                });
                this.tagInput = input.data("tagInput");
            });

            QUnit.test("Only Delete If Tag Exists", function(assert) {
                assert.deepEqual(this.tagInput.getTags().length, 0, "no tags before attemting to remove");
                let event = $.Event("keydown", { which: 8 })
                this.tagInput.input.trigger(event);
                assert.deepEqual(this.tagInput.getTags().length, 0, "still no tags after attempting to remove");
            });

            QUnit.test("Backspace Deletes Last Tag", function(assert) {
                this.tagInput.addTag("Test 1");
                this.tagInput.addTag("Test 2");
                this.tagInput.addTag("Test 3");

                assert.deepEqual(this.tagInput.getTags().length, 3, "three tags before removing last tag");
                let event = $.Event("keydown", { which: 8 })
                this.tagInput.input.trigger(event);
                assert.deepEqual(this.tagInput.getTags().length, 2, "two tags after removing last tag");
            });

            QUnit.test("Only Delete If Input Is Blank", function(assert) {
                this.tagInput.addTag("Test 1");
                this.tagInput.input.val("Test 2");
                assert.deepEqual(this.tagInput.getTags().length, 1, "one tag before hitting backspace");
                let event = $.Event("keydown", { which: 8 })
                this.tagInput.input.trigger(event);
                assert.deepEqual(this.tagInput.getTags().length, 1, "still one tag after hitting backspace");
            });
        });
    });

    QUnit.module("Events", function(hooks) {
        hooks.beforeEach(function(assert) {
            let input = $(globals.inputQuery);
            input.tagInput();
            this.tagInput = input.data("tagInput");
        });

        QUnit.module("Adding Tag", function(hooks) {
            QUnit.test("Triggers Change When Tag is Added", function(assert) {
                let testTagName = "test_tag";

                assert.expect(3);
                this.tagInput.replacedInput.change(() => {
                    assert.step("change event triggered");
                    assert.deepEqual(
                        this.tagInput.replacedInput.val(),
                        testTagName,
                        "replaced input value matches added tag"
                    );
                });
                this.tagInput.addTag(testTagName);
                assert.verifySteps(["change event triggered"]);
            });

            QUnit.test("Does Not Trigger Change When Tag is Duplicate", function(assert) {
                let testTagName = "test_tag";

                this.tagInput.addTag(testTagName);

                assert.expect(0);
                this.tagInput.replacedInput.change(() => {
                    assert.step("change event triggered");
                });
                this.tagInput.addTag(testTagName);
            });

            QUnit.test("Triggers tagInput:addTag When Tag is Added", function(assert) {
                let testTagName = "test_tag";

                assert.expect(3);
                this.tagInput.replacedInput.on("tagInput:addTag", (event, tag) => {
                    assert.step("tagInput:addTag event triggered");
                    assert.deepEqual(tag, testTagName, "passed tag name matches added tag");
                });
                this.tagInput.addTag(testTagName);
                assert.verifySteps(["tagInput:addTag event triggered"]);
            });

            QUnit.test("Does Not Trigger tagInput:addTag When Tag is Duplicate", function(assert) {
                let testTagName = "test_tag";

                this.tagInput.addTag(testTagName);

                assert.expect(0);
                this.tagInput.replacedInput.on("tagInput:addTag", (event, tag) => {
                    assert.step("tagInput:addTag event triggered");
                });
                this.tagInput.addTag(testTagName);
            });
        });

        QUnit.module("Removing Tag", function(hooks) {
            QUnit.test("Triggers Change When Tag Exists", function(assert) {
                let testTagName = "test_tag";

                this.tagInput.addTag(testTagName);

                assert.expect(3);
                this.tagInput.replacedInput.change(() => {
                    assert.step("change event triggered");
                    assert.deepEqual(
                        this.tagInput.replacedInput.val(),
                        "",
                        "replaced input does not include removed tag"
                    );
                });
                this.tagInput.removeTag(testTagName);
                assert.verifySteps(["change event triggered"]);
            });

            QUnit.test("Does Not Trigger Change When Tag Does Not Exist", function(assert) {
                let testTagName = "test_tag";

                assert.expect(0);
                this.tagInput.replacedInput.change(() => {
                    assert.step("change event triggered");
                });
                this.tagInput.removeTag(testTagName);
            });

            QUnit.test("Triggers tagInput:removeTag When Tag Exists", function(assert) {
                let testTagName = "test_tag";

                this.tagInput.addTag(testTagName);

                assert.expect(3);
                this.tagInput.replacedInput.on("tagInput:removeTag", (event, tag) => {
                    assert.step("tagInput:removeTag event triggered");
                    assert.deepEqual(tag, testTagName, "passed tag name matches removed tag");
                });
                this.tagInput.removeTag(testTagName);
                assert.verifySteps(["tagInput:removeTag event triggered"]);
            });

            QUnit.test("Does Not Trigger tagInput:removeTag When Tag Does Not Exist", function(assert) {
                let testTagName = "test_tag";

                assert.expect(0);
                this.tagInput.replacedInput.change((event, tag) => {
                    assert.step("tagInput:removeTag event triggered");
                });
                this.tagInput.removeTag(testTagName);
            });
        });
    });
});
