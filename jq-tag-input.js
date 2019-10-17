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

    $.fn.tagInput = function(options) {
        return this.each(function() {
            let self = $(this);
            
            // Generate tag input HTML
            let div = $($.parseHTML(`<div class="tag-input ${self.attr("class")}"><input type="text" placeholder=""><div class="typeahead ${self.attr("class")}"></div></div>`));

            let typeahead = div.find(".typeahead");
            typeahead.hide();

            // Add tag to list of tags when tag name is entered
            div.find("input").change(function() {
                let input = $(this);
                let inputValue = input.val().trim();

                let tags = strToArr(self.val());

                if (inputValue !== "" && !tags.includes(inputValue) && (options.tags == undefined || options.tags.includes(inputValue))) {
                    let newTag = $.parseHTML(`<span class="tag ${options.tagClass}">${inputValue}<span class="close pl-1">&times;</span></span>`);

                    $(newTag).click(function() {
                        // Remove tag from original input field value list
                        let tags = strToArr(self.val());
                        tags = tags.filter((element) => element != inputValue);
                        self.val(arrToStr(tags));
                        self.change();

                        $(this).remove();
                    });

                    // Add new tag to original input field value list
                    tags.push(inputValue);
                    self.val(arrToStr(tags));
                    self.change();

                    input.before(newTag);
                    input.val("");
                }
            });

            // Update typeahead when input changes
            div.find("input").on("input", function() {
                let input = $(this);
                let inputValue = input.val().trim();

                typeahead.empty();
                if (inputValue === "") {
                    typeahead.hide();
                } else {
                    let matches = options.tags.filter((tag) => tag.includes(inputValue));

                    matches.forEach(tag => {
                        let newMatch = $($.parseHTML(`<div class="suggestion">${tag}</div>`));

                        newMatch.click(function() {
                            let tags = strToArray(self.val());
                            tags.push(tag);

                            input.val("");
                            input.trigger("input");

                            self.val(tags.join(","));
                            self.change();
                        });

                        typeahead.append(newMatch);
                    });

                    if (matches.length > 0) {
                        typeahead.show();
                    } else {
                        typeahead.hide();
                    }
                }

            })

            // Replace input field with generated HTML
            self.hide();
            self.before(div);
        });
    }
}(jQuery));