(function($) {

    function strToArr(str) {
        if (str === "") {
            return [];
        } else {
            return str.split(",");
        }
    }

    function arrToStr(arr) {
        return arr.join(",");
    }

    class TagInput {
        constructor(replacedInput, options) {
            this.tags = [];
            this.replacedInput = replacedInput;
            this.options = options;
            this.root = $($.parseHTML(
                `<div class="tag-input${this.options.useDefaultStyle ? " styled" : ""}"><input type="text" placeholder=""></div>`
            ));

            let self = this;
            this.root.find("input").change(function() {
                let input = $(this);
                self.addTag(input.val());
                input.val("");
            });

            this.replacedInput.hide();
            this.replacedInput.before(this.root);
        }

        addTag(tagText) {
            if (!this.tags.find((t) => t.text === tagText)) {
                let tag = {
                    text: tagText,
                    element: $($.parseHTML(
                        `<span class="tag">${tagText}<span class="delete-tag">&times;</span></span>`
                    ))
                };

                let self = this;
                tag.element.click(function() {
                    self.removeTag(tag.text);
                });

                this.tags.push(tag);
                this.root.find("input").before(tag.element);
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
    }

    $.fn.tagInput = function(options) {
        let defaults = {
            useDefaultStyle: true
        };
        options = Object.assign({}, defaults, options);

        return this.each(function() {
            let tagInput = new TagInput($(this), options);
        });
    }
}(jQuery));