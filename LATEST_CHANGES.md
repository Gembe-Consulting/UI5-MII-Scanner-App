[INTERNAL][FIX] replace 'is' property check with 'being'
[FIX] Not comparing css color properly (rgb vs hex)
[FIX] Compare initial quantity to '' (instead of 0,000)
[FIX] Ensure to update view controls if quantity has been cleared
[FIX] Don't override previous user quantity input with storage unit data
[FIX] Wrong control id in test feature
[FIX] Check uom input against component uom
[INTERNAL] Fix lint errors
[FIX] Not calculating remaining quantity on empty quantity value
[INTERNAL] Project update
[FEATURE] Show message box after detected scan
[FEATURE] Add support for storage location and order number in Goods Receipt page
[INTERNAL] Change readme.md  -rename to REDAME.md  -add commit message format
[INTERNAL] Change readme.md  -rename to REDAME.md  -add commit message format
[INTERNAL] Create CHANGES.md
[INTERNAL] Add CHANGELOG.md to project
[FEATURE] (goodsissue) Add custom colorized header with icons
[FEATURE] (stocktransfer) Add custom colorized header with icon
[INTERNAL] Replace icon size by sapUiSmallMarginEnd
[FEATURE] (rollerconveyoer) Add custom colorized header with icon
[FIX] Adjust page title to navigation
[FEATURE] Improve visual appearance
- Add Shell container to app for better desktop support
- Add top margin to goods movement navigation page
- Add margin between icon and test in goods movement page
- Remove footer containing user name from List control
- Add footer containing username to Page control
[FEATURE] Re-align quantity input and uom
[INTERNAL] Prevent grunt build on git push
[FEATURE] Implement roller convoyer
-Add and wire ui controls
-Add completness check
-Add storage unit validation
[INTERNAL] Prevent grunt build on git push and line break on chained methods
[FEATURE] Improve Roller Conveyor Page
-Add basic test scenario
-Add test support for ui controls
-Add test support for data and view model
[FIX] Prevent posting with wrong storage unit number or order number
Fixes if users invalidate the entered storage unit number or process order number, posting button ist still active (if button was active before).
Affected pages:
- Goods Receipt
- Goods Issue
Stock transfer is not affected, because non-existing storage unit is handled using initial storage unit object. This method does also allow to hide storage unit info fragment.
[TEST] Set external login feature as WIP
[FIX] Missing }
[STYLE] Reformat chained methods
[STYLE] Reformat chained methods
[FEATURE] Add most important test cases
[FEATURE] Accept 90000000000000000000 as storage unit indicating last unit
[FEATURE] Disable Rollenbahn and Stapler if users enter last unit
[FEATURE] Add logic to switch between full, empty and last LE
-Repair pre-selected storage bin on change to last LE
-Repair entry quantity and unit
[FIX] Make emptyStorageUnit formatter detect null as empty
[INTERNAL] Cleanup formatter code
[INTERNAL] Remove content of prepareUserModel form models.js
[INTERNAL] Replace full qualified name by shortcut
[TEST] Add missing test for null, undefined and ''
[FIX] Detect null, undefined and '' as empty unit
[INTERNAL] Fix typo in comment
[INTERNAL][TEST][STYLE] Adding some tests and beautify some files
[Internal] Version update
[INTERNAL] Update chnagelog
[INTERNAL] Update changelog
[TEST] Fix feature
[STYLE] Fix missing semicolon
[INTERNAL] Build
[INTERNAL] Update Build properties
[INTERNAL] Update readme and changelog
[INTERNAL] Add latest features and fixes as separate logs
[INTERNAL] add latest features and fixes as separate logs and update changelog
[INTERNAL] (eslint): update linting rules
[INTERNAL] (build): update grunt build
[TEST] (action): add test step to check for initial data/view model
[TEST] (roller conveyor): replace ' with "
[TEST] (goods receipt): add test for view model and data model
[TEST] (goods receipt): replace ' with "
[STYLE] (goods issue): replace ' with "
[TEST] (goods issue): add test for view model and data model
[TEST] (stock transfer): add test step file
- add test for initial UI elements
- add test for view model and data model
[TEST][FIX] (action pages): Fix syntax error after ' -> " convertion
[TEST] (common): remove navigation action (use generic gherkin step instead)
[TEST] (all): rework to prevent breaking DRY guideline
[INTERNAL] (manifest, i18n): Rework routing pattern and title to be retrieved from resource bundle
[TEST] (routing, navigation): Adjust all navigation tests to new pattern
[Test] (goods issue): Fix incomplete initial data
[FIX] (stock transfer): Try to fix targetStorageBinItemSelection being "" instead of null
[INTERNAL] (eslint): ignore dist folder
[INTERNAL] (component): add eslint global "document"
[TEST] (opa, login). remove check for navigation on login page
This check is not needed on desktop devices
[Test] (goods issue): add test for initial view object for both nonLE and withLE
[TEST] (pages): add return statement
[TEST] (goods issue): refactor initial input field check to be more DRY
[STYLE] (roller conveyor): refactor some control ids and data property names
[STYLE] (roller conveyor): refactor some control ids and data property names
[STYLE] (stock transfer): adopt naming conventions on ids and properties
[STYLE] (goods issue): adopt naming conventions on ids and properties
[INTERNAL] (action pages): add missing maxLength properies
[INTERNAL] (git): try to ignore .che/project.json
[FIX] (stock transfer): remove maxLength property from storageBin selection (not supported)
[FEATURE] (action navigation pages): remove gap between items
[FEATURE] (action pages): increase font size of clear quantity icon on mobile devices
[FEATURE] (action nav): add small margin to text
[FEATURE] (goods receipt): propose default unit of measure
- set KG if storage location is not 1000 and uom was not entered before 
- clear  if storage location is 1000
[FEATURE] (goods issue): remove leading zero after LE validation
[FEATURE] (stock transfer): hide clear quantity icon, if LE is not empty
Fixes being able to clear quantity, even if quantity input is not editable
[TEST] (goods issue): rename OPA feature
