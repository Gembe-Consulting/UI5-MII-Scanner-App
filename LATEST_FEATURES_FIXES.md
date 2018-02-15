[FIX] Not comparing css color properly (rgb vs hex)
[FIX] Compare initial quantity to '' (instead of 0,000)
[FIX] Ensure to update view controls if quantity has been cleared
[FIX] Don't override previous user quantity input with storage unit data
[FIX] Wrong control id in test feature
[FIX] Check uom input against component uom
[FIX] Not calculating remaining quantity on empty quantity value
[FEATURE] Show message box after detected scan
[FEATURE] Add support for storage location and order number in Goods Receipt page
[FEATURE] (goodsissue) Add custom colorized header with icons
[FEATURE] (stocktransfer) Add custom colorized header with icon
[FEATURE] (rollerconveyoer) Add custom colorized header with icon
[FIX] Adjust page title to navigation
[FEATURE] Improve visual appearance
- Add Shell container to app for better desktop support
- Add top margin to goods movement navigation page
- Add margin between icon and test in goods movement page
- Remove footer containing user name from List control
- Add footer containing username to Page control
[FEATURE] Re-align quantity input and uom
[FEATURE] Implement roller convoyer
-Add and wire ui controls
-Add completness check
-Add storage unit validation
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
[FIX] Missing }
[FEATURE] Add most important test cases
[FEATURE] Accept 90000000000000000000 as storage unit indicating last unit
[FEATURE] Disable Rollenbahn and Stapler if users enter last unit
[FEATURE] Add logic to switch between full, empty and last LE
-Repair pre-selected storage bin on change to last LE
-Repair entry quantity and unit
[FIX] Make emptyStorageUnit formatter detect null as empty
[FIX] Detect null, undefined and '' as empty unit
- add test for initial UI elements
- add test for view model and data model
[FIX] (stock transfer): Try to fix targetStorageBinItemSelection being "" instead of null
This check is not needed on desktop devices
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
