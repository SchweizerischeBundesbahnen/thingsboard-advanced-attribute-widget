# Advanced Thingsboard Attribute Widget (ATAW)
![GitHub package.json version](https://img.shields.io/github/package-json/v/SchweizerischeBundesbahnen/thingsboard-advanced-attribute-widget)

## Description
Looking for an advanced dashboard widget in Thingsboard to edit attributes. Look no more. ATAW is very flexible. You can choose one ore many of the input field to let the user edit attribute values. The following input types are possible:
- textfield (opt. pattern check with regex)
- slider / range slider (min,max,step)
- checkbox (true|false)
- multifield (array|list)

<div style="width:200px">
<img src="/assets/images/screenshot.png" width="50%">
</div>

## Installation
1. Import advanced_thingsboard_attribute_widget__ataw_.json to widget Library

OR (if you want to make changes to the widget specific stuff and only want to import the class)

1. create new Widget (type: control widget, call it ATAW)
2. add resources:
- https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css
- https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js
- https://cdn.jsdelivr.net/gh/SchweizerischeBundesbahnen/thingsboard-advanced-attribute-widget/src/class.inputfield.js
4. copy content of src/html.html to "HTML" tab
5. copy content of src/style.css to "CSS" bab
6. copy content of src/javascript.js to javascript section
7. copy content of src/settings-schema.json to "Settings schema"
8. save widget

At step 2. you can also specify the version of the class by adding the github version behind an "@", for example: https://cdn.jsdelivr.net/gh/SchweizerischeBundesbahnen/thingsboard-advanced-attribute-widget@bc0c2280f271f915b411d9949654ccf82e172bf1/src/class.inputfield.js to get commit version "bc0c2280f271f915b411d9949654ccf82e172bf1".

## Usage
1. Create new Dashboard
2. create new entity alias
3. add new widget > select ATAW Widget
4. go to advanced tab and edit "Button label"
5. set a device command (this can be used to filter in Rules)
6. select attribute type (server|shared)
7. Set parameters via json
Example:
```
[
        {
            "title": "LED einschalten?",
            "type": "checkbox",
            "key": "led_on"
        },
        {
            "title": "Max Temp 1: %s ??C",
            "type": "range",
            "key": "temp_max",
            "min": -50,
            "max": 100,
            "step": 1
        },
        {
            "title": "Min Temp 1: %s ??C",
            "type": "range",
            "key": "temp_min",
            "min": -50,
            "max": 100,
            "step": 1
        },
        {
            "title": "Waypoint %s: ",
            "key": "waypoints",
            "type": "text",
            "default": "0",
            "multi": true,
            "multitype": "array",
            "pattern":"^[+-]?([0-9]+\\.?[0-9]*|\\.[0-9]+)$"
        },
        {
            "title": "E-Mail Alarm %s: ",
            "key": "alert_email",
            "type": "text",
            "default": "0",
            "multi": true,
            "multitype": "array",
            "pattern":"[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+"
        }
]
```
8. Save widget
9. Save dashboard
10. Try widget!

## Code Documentation
https://schweizerischebundesbahnen.github.io/thingsboard-advanced-attribute-widget/

## Tests
The directory "test" contains a simple framework to locally test the widget and debug in a Thingsboard independent enviroment.