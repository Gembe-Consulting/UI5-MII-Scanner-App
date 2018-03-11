[FEATURE] (roller conveyor): prepare posting support
[REFACTOR] (component, rootView): improve id and manifest
[REFACTOR] (component, rootView): improve id and manifest
[FEATURE] (css): add custom font size for all input fields
[FEATURE] (forms): optimize SimpleForm layout
- set breakpointM to 500 -> all below 500px will be considered SMALL and use alle ~S properties
- should display more devices as small form
[REFACTOR] (action): add ids to some controls
- header
- footer
- buttons
[FIX] (action): fix title not having correct style
[FEATURE] (action): increase font size on mobile devices
[FEATURE] (locale): add languages to prevent 404
[FEATURE] (goods issue): move bulk mat indicator to storage location line
[FEATURE] (roller conveyor + stock transfer): swap key and name in combobox
[FIX] (service): correct debug mode detection
[FIX] (init): remove sap-ui-debug from localStorage to prevent cross session mess
[FEATURE] (roller conveyor): add better storage bin detection depending on dummy storage unit number
[FEATURE] (roller conveyor): add services for Roller Conveyor page
[FEATURE] (roller conveyor): add support for goods receipt of empty units
[FIX] (roller conveyor): prevent nullpointer if lenum is not found
[FEATURE] (service error): show MII transaction in error message
[FEATURE] (roller conveyor): add support for stock transfer posting
[FIX] (index): re-add correct path to mii utils
[FEATURE] (roller conveyor): add support for finding running process order
[FIX]: path to mii utils
[FIX] (roller conveyor): select correct storage bin item on dummy LE
[FEATURE] (coller conveyor): add support for posting BwA 555
[FEATURE] (roller conveyor): add busy state during service calls & clear form after
