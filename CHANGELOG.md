# Changelog
All notable changes to this project will be documented in this file.

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
