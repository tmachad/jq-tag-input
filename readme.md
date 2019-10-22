# jq-tag-input
A jquery plugin for converting a normal text input into a tag input. Supports typeahead using Twitter's typeaheadjs library.

## Configuration
Below is an example configuration utilizing all configuration values.
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
        // See typeaheadjs docs for options
        datasets: [
            // See typeaheadjs docs for dataset syntax
        ]
    }
});
```
`classNames` is used to override the default CSS class names used by the generated elements. This can be used to avoid naming conflicts, or to apply styles from external CSS libraries. When changing the classes to use CSS libraries, it is recommended that you append additional classes while keeping the defaults, as they provide some basic structure to the input.  
 * `overall` *(Default value `"tag-input"`)* determines the class(es) of the `<div>` element that is the root of the tag input.
 * `tag` *(Default value `"tag"`)* determines the class(es) of the tags within the input.
 * `tagDelete` *(Default value `"delete-tag"`)* determines the class(es) of the delete button on each tag.
 * `input` *(Default value `""`)* determines the class(es) of the input used to enter new tags.

`useDefaultStyle` *(Default value `true`)* controls whether or not the default visual styles provided with the CSS file are applied. These styles are only intended for providing a baseline of usability while testing, and are not pretty. Setting `useDefaultStyle` to `false` will disable these styles. This has no effect on the styles used to structure the tag input.

`placeholderText` *(Default value `""`)* determines the placeholder text in the tag input.

`typeaheadjs` *(Default value `false`)* controls typeahead functionality and provides options for the typeaheadjs plugin. To enable typeahead functionality you must provided at least one dataset through the `datasets` property. Options are passed directly to the typeaheadjs plugin without modification, so any options it supports will be supported here.