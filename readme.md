# jq-tag-input

A jquery plugin for converting a normal text input into a tag input. Supports typeahead using the [typeahead.js](https://github.com/twitter/typeahead.js) library.

## Table of Contents

* [Installation](#Installation)
* [Commands](#Commands)
* [Usage](#Usage)
  * [API](#API)
  * [Configuration](#Configuration)
  * [Events](#Events)
* [Browser Support](#Browser-Support)
* [Versioning](#Versioning)

## Installation

* To install from npm, run `npm install jq-tag-input`.
* To install from GitHub clone the repository, install all packages with `npm install`, and build the plugin with `npm run build`.

## Commands

* `npm run build` - Builds to source and outputs the minified package to the `dist` folder.
* `npm run test` - Run all test suites. Opens `test/testingground.html` in the browser, which runs the tests using QUnit.

## Usage

### API

The `TagInput` object attached to the input can be accessed through `$("#my-input").data("tagInput")`, and provides the following methods:

* `addTag(string):boolean` - Adds a new tag with the given text to the end of the list of tags if it doesn't already exist. Returns `true` if the tag was added successfully, or `false` if no tag was added.
* `removeTag(string):boolean` - Removes the tag with the given text from the list of tags if it exists. Returns `true` if the tag was removed successfully, or `false` if no tag was removed.

### Configuration

Below is an example configuration utilizing all configuration values:

```javascript
$("#my-input").tagInput({
    classNames: {
        overall: "tag-input",
        tag: "tag",
        tagDelete: "delete-tag",
        input: ""
    },
    useDefaultStyle: true,
    placeholderText: "",
    typeaheadjs: {
        // See typeahead.js docs for options
        datasets: [
            // See typeahead.js docs for dataset syntax
        ]
    }
});
```

* `classNames` is used to override the default CSS class names used by the generated elements. These can be used to avoid naming conflicts, or to apply styles from external CSS libraries. When changing the classes to use CSS libraries, it is recommended that you append additional classes while keeping the defaults, as they provide some basic structure to the input.

  * `overall` *(Default value `"tag-input"`)* determines the class(es) of the `<div>` element that is the root of the tag input.
  * `tag` *(Default value `"tag"`)* determines the class(es) of the tags within the input.
  * `tagDelete` *(Default value `"delete-tag"`)* determines the class(es) of the delete button on each tag.
  * `input` *(Default value `""`)* determines the class(es) of the input used to enter new tags.

* `useDefaultStyle` *(Default value `true`)* controls whether or not the default visual styles provided with the CSS file are applied. These styles are only intended for providing a baseline of usability while testing, and are not pretty. Setting `useDefaultStyle` to `false` will disable these styles. This has no effect on the styles used to structure the tag input.

* `placeholderText` *(Default value `""`)* determines the placeholder text in the tag input.

* `typeaheadjs` *(Default value `false`)* controls typeahead functionality and provides options for the typeaheadjs plugin. To enable typeahead functionality you must provided at least one dataset through the `datasets` property. Options are passed directly to the typeaheadjs plugin without modification, so any options it supports will be supported here.

### Events

The following events are triggered at various times on the original input used to create the tag input:

* `change` - The normal change event you're likely familiar with. Fired every time a tag is added or removed.
* `tagInput:addTag` - Fires whenever a tag is successfully added to the tag input. The event handler will be invoked with 2 arguments: the jQuery event object, and the name of the tag that was added.
* `tagInput:removeTag` - Fires whenever a tag is successfully removed from the tag input. The event handler will be invoked with 2 arguments: the jQuery event object, and the name of the tag that was removed.

## Browser Support

* Desktop
  * Edge
  * Chrome 49+
  * Firefox 45+
  * Safari 10+
  * Opera 36+

*Note: The plugin is not tested for mobile compatibility, but probably still works.*

## Versioning

Versions are numbered using semantic versioning following the `<major>.<minor>.<patch>` format.

* `<major>` goes up each time a change breaks backwards compatibility.
* `<minor>` goes up each time new features are added without breaking backwards compatibility.
* `<patch>` goes up each time for each minor change or bugfix not covered above.
