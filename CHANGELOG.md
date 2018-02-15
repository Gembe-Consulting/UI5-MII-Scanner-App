# Changelog

All notable changes to this project will be documented in this file.

============================================================================================================
git log --after 08/02/2018 --pretty=format:"%s%n%b" --reverse --no-merges | grep -v '^$' | grep -v -i '\[INTERNAL\]' | grep -v -i '\[CHORE\]' | grep -v -i '\[TEST\]' | grep -v -i '\[STYLE\]'> LATEST_FEATURES_FIXES.md
git log --after 08/02/2018 --pretty=format:"%s%n%b" --reverse --no-merges | grep -v '^$' > LATEST_CHANGES.md
============================================================================================================

[<TYPE>] (<scope>): <subject>

<body>

<footer>

Allowed <TYPE> values:
- FEATURE (new feature for the user, not a new INTERNAL|CHORE type feature )
- FIX (bug fix for the user, not a INTERNAL|CHORE type fix )
- TEST (no production code change; adding missing tests, refactoring tests, etc )
- STYLE (no production code change; formatting, missing semi colons, etc )
- REFACTOR (no production code change; renaming methods, moving objects, etc )
- INTERNAL|CHORE (no production code change; changing dev environment, updating grunt tasks, etc )

Examples:

[FEATURE] (goods issue page): add, remove, change, replace, start ...
[FIX] (roller conveyor page): fix, repair, stop

============================================================================================================


##[1.1.90.2018-02-15]
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

## [1.1.75.2018-02-08]
FIX] Unit of measure is not discovered from order component after material entry
[FIX] Not purging unit of measure if uom does not match
-This will prevent save button beeing editable if uom differ. We compare MEINH from storage unit with EINHEIT from component
[TEST] Fix combobox selection not working
-We send an ENTER key press afterwards
[ADD] Clear quantity input field when clear icon is clicked
[INTERNAL] Remove sap-no-hardcoded-url from lint
[FIX] Missing property
[INTERNAL] Update version
[INTERNAL] Update version
[FEATURE] Re-phrase goods movement menu items
-As per customer request, we changed labels. We also added gherkin test features.
[FEATURE] Include test cases from customer feedback for the following changes
[CHANGE] Rename all cancel buttons on action pages
[ADD] Add clear icon for each quantity input field
[REMOVE] Delete order number, actual quantity and target quantity from stock transfer
[ADD] Include actual quantity to storage unit fragment
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
[INTERNAL] Change readme.md  
-rename to REDAME.md  
-add commit message format

## [1.1.65.2018-02-06]
[INTERNAL] Optimize Grunt build
- Remove unnecessary tasks
- Remove test folders from dist by using .project.json
[INTERNAL] Do code cleanup
[INTERNAL] Delete generic steps from test folder (moved to external lib)
[INTERNAL] Reorganize generic test steps
- Add openui5genericapptesting to resourceroots
- Add route path to neo-app
- Update build process
[TEST] Fix some test case descriptions
[FEATURE] Add posting feature
[FEATURE] Add input validation before posting
[FEATURE] More Stock Transfer features
[FEATURE] Initial implementation of Stock Transfer page
[FEATURE] Improve Login behavior by using IllumLoginName mapping in irpt
[INTERNAL] Version Update
[FEATURE] Adjusting Business logic GR
-enable order number validation
-enable storage unit number validation 
[FEATURE] Adjusting Business logic GI 
- allow out-of-date batches to be used (warning)
- allow backflushed withdrawal

## [1.0.0] 
Optimizing Grunt build
Evaluate IllumLoginName in irpt site
Enable annonymous login if device is desktop
Fix onInit from super class not applied to action pages
Minor build adjustment
Version update
Optimizing Grunt build tasks
version update
update Grunt build
Add version support during grunt build
Fixing wrapping attribute
Enable grunt version update
Enable value state handling
read order header data on input
Improve lgort type
Enable lgort on non LE use cse
Add lableTextFormGoodsIssueBulkMaterialTooltip
Add GR posting use case
Enable goods issue posting service
Shorten unit of measure string
Add VBox to GR view to match GR view
Change title depending on WA type
Improve LE Info fragment
Fix reading UoM
Replace Login Bar with Toolbar
Update build data
Add test content to build
Add support for unplanned withdrawal and backflushed component check
Improve readability of special stock indicators
Fix to quantityInput testcase not reflacting actual test data
Add support for external input fields
Separate GR and GI test cases better
Suspend deep link with wrong user test cases
Add support for GetOrderComponentQry service call
Add support for order component checks
Refactor storage unit model and main data model. Move ExpirationDate foramtter to formatter module
set @wip for scenarios under construcion
Add Expiration Date validation
Add support for Special Stock Indicator
Enable storage unit info form
Check if posting is allowed
move _formatStorageUnitData to main class to be reusable
add storage unit change event add message strip add initial quantity value in feature file
fix feature to be storage location
rework storage unit service to be usable in both GR and GI
Update External login feature
Add some generic test steps Extend GI feature scenario
only add scanner detection if device is not desktop
Improve test cases - fix GR test feature - add GI test feature - add i hit key generic test step
Setup initial goods issue test cases
Restore project.json
Rework grunt build
Add version info
Fix not having a control on unknown scanner input
Remove UI5 scanner detection We will stick to the native jQuerey plugin for now
Fix keeping message strip after success
Change version info
Switch operation action pages to actual controllers Instead of dummy controller class
Prapare for Publish to MII
Finalizing GoodsReceipt features
Fixing UI behavior of save button
Changes to scanner detection
Add semantic barcode detection
Add Unit tests to barcode detection
Add scanner detection library
Add error message for already posted storage units
Finalize test features for GoodsReceipt page
Prepare some tests for GoodsReceipt page
Adjust quantity input position
Adjust some locales
add switch control
Update i18n strings
Adjust visible input fields
Add routing parameters
Add query parameter for more routing pattern
Add support for router dependent view manipulation
Add support for query parameters by routing
Add stock transfer page
Reformatting
Reformatting
Add some localizations
Add basic UI controls
Introduce SAP data types
Rework private vars
Hide form, if no data available
Fix after refactoring
Add i18n for storage unit fragment
Finalize GR action page ui + refactor storageBin to StorageUnit
Modify iCanSee and iEnterText feature
Add mockservice
Adjust label width
Enable wrapping on nav info text
Enable basic input handling + mockdata + Refresh data
Update resourceRoots
Add openui5.validator dependency
Replace ajv with openui5 validator based on ajv
Added some unit tests
Add RollerConvoyer controller
Add StockTransfer controller
Add GoodsIssue controller
Add data model
Add goodsReceipt controller
Update i18n strings
Add new scenarios
Add Check for UI presence
Add goods receipt test cases
rename assertiations for url param check
Fix looking for window.location within iFrame
Fix test case removing url parameter
Improve test cases
Update test to use gherkin Refactor all existing tests and introduce gherkin tests
Add test cases for external login via URL parameter
Prepare test support for upcoming features.
Add scanner specific integration tests
Enable Integration test for login (desktop) and basic navigation
Repair testing files after merge
Add iDelay parameter
Add iDelay parameter
Add testing files
Add testing files
Purge input after a duration of 100ms
improve Promise usage
Improve Promise handling.
Rework async calls
Enable async user login request - Use Promise() - Show BusyIndicator
Add AVJ library
Fix
Test new MII Model
Adjusting coding to SAP MII environment
remove mis-located file
Moving auto login to Component.js
Add auto login in case url param is given if IllumLoginName is given, we check if user is authorizes and perform a autologin.
Add moment as component dependency
Remove min files from resource list Grunt build should take care of minification
adjust moment require
Add momentjs using LibraryManager
Add lodash using LibraryManager
remove libraries
Add libraries using LibraryManager
Add momentjs library and set locale
Show on Interrupt Op, too
Add SubHeader for desktop devices only
Add .che
Add Combobox to action pages
Add Combobox to action pages
Update new Grunt build

## [0.0.1] 
Cleanup commit.
next commit 2
next commit.
web ide only?
next change 2
next change
Update repo.
Adjusting navigation
Restore some important features after server crash
...
Initial commit to github. Most of its features working.
Initial commit
