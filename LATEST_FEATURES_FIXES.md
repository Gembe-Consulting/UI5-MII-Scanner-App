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
[FEATURE] (action pages): only show cancle confirmation if data has been changed
[FEATURE] (roller conveyor): detect last unit and repair user input if required
[FEATURE] (roller conveyor): detect last unit and show message
[FEATURE] (roller conveyor): convert entered unit into uppercase
[REFACTOR] (roller conveyor): move isLastStorageUnit to formatter and add isNotLastStorageUnit formatter
[REFACTOR] (login): make var to const
[FEATURE] (login): rework how this app handles login and authentication
There are two scenarios to consider: Navigation from Mobile device and form Desktop device.
From a desktop, we always navigate to a deep page like "/Start" or "/WE" (= not login page). Users are always authenticated by SAP NetWeaver.
However, from a mobile device, we always navigate to "/Anmeldung" (= login page) while being authenticated by SAP NetWeaver using an default dummy user. This is why we force the user to enter his username. On successful login, we set the user model. To prevent navigation to a deeper page without an user model, all pages are based on PageBaseConroller that attaches a onBeforeNavigation event. Each time this even triggers, we check if the user model is set and valid. If not, we navigate to login page.
To prevent desktop devices to be forced to navigatio to login page, we will read the IllumLoginName and fire a validation request to MII.
[FIX] (roller conveyor): misspell in binding to check storage unit empty or full
[FIX] (formatter): fix typo in storage unit empty/full formatter
[FIX] (formatter): make isNotLastStorageUnit more atomic
[FEATURE] (home): remove back navigation and hise Logout item on desktop devices
[FIX] (roller conveyor): fix not being able to lint "=>" operator
[FEATURE] (formatter): add null-check to last storage unit formatter
remember to set &serverDelay=0 when doing opa tests
[FEATURE] (models): add error messages to all models
also add message toasts on request complete when debugging is active
[FEATURE] (roller conveyor): prepare posting support
