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
