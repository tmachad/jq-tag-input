(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    class TagInput {
        constructor(replacedInput, options) {
            this.tags = [];
            this.replacedInput = replacedInput;
            this.options = options;
            this.root = $($.parseHTML(
                `<div class="${this.options.classNames.overall}${this.options.useDefaultStyle ? " styled" : ""}">
                    <input class="${this.options.classNames.input}" type="text" placeholder="${this.options.placeholderText}">
                </div>`
            ));
            this.input = this.root.find("input");

            let self = this;
            this.root.click(function() {
                self.input.focus();
            });

            if (this.options.typeaheadjs) {
                this.input.typeahead(
                    this.options.typeaheadjs, 
                    ...this.options.typeaheadjs.datasets
                );

                let eventHandler = function(event, suggestion) {
                    if (!suggestion) {
                        // Suggestion is undefined, so retrieve it from input field
                        suggestion = self.input.typeahead("val");
                    }

                    if (self.addTag(suggestion)) {
                        self.input.typeahead("val", "");
                    }
                }

                this.input.bind("typeahead:autocomplete", eventHandler);
                this.input.bind("typeahead:select", eventHandler);
                this.input.change(eventHandler);
            } else {
                this.input.change(function() {
                    self.addTag(self.input.val());
                    self.input.val("");
                });
            }

            this.replacedInput.hide();
            this.replacedInput.before(this.root);
        }

        addTag(tagText) {
            if (tagText !== "" && !this.tags.find((t) => t.text === tagText)) {
                let tag = {
                    text: tagText,
                    element: $($.parseHTML(
                        `<span class="${this.options.classNames.tag}">${tagText}<span class="${this.options.classNames.tagDelete}">&times;</span></span>`
                    ))
                };

                let self = this;
                tag.element.click(function() {
                    self.removeTag(tag.text);
                });

                this.tags.push(tag);
                this.root.children().last().before(tag.element);
                this.updateReplacedInputValue();

                return true;
            }

            return false;
        }

        removeTag(tagText) {
            let tag = this.tags.find((t) => t.text === tagText);

            if (tag !== undefined) {
                tag.element.remove();
                this.tags = this.tags.filter((t) => t.text !== tag.text);
                this.updateReplacedInputValue();
            }

            return tag !== undefined;
        }

        updateReplacedInputValue() {
            this.replacedInput.val(this.tags.map((tag) => tag.text).join(",")).change();
        }

        getTags() {
            return this.tags.map((tag) => tag.element);
        }
    }

    $.fn.tagInput = function(options) {
        options = Object.assign({}, $.fn.tagInput.defaults, options);

        return this.each(function() {
            $(this).data("tagInput", new TagInput($(this), options));
        });
    }

    $.fn.tagInput.defaults = {
        classNames: {
            overall: "tag-input",
            tag: "tag",
            tagDelete: "delete-tag",
            input: ""
        },
        useDefaultStyle: true,
        placeholderText: "",
        typeaheadjs: false
    };
}));