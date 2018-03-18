[FEATURE] (action): add username as external user
[INTERNAL] version 1.2.30
[FIX] (roller conveyor): set storage bin item only if ressource id has been found
[FEATURE] (roller conveyor): cleanup success messages
[FEATURE] (action pages): add support for barcode scanner integration
Main logic is located on ActionPageController. Here we attach and detach the scanner event listener everytime a page is shown and hidden.
The attached event delegate evaluates the scanned string to discover the control.
[FEATURE] (roller conveyor): set stretcher default to true
[INTERNAL] version 1.2.35.2018-03-16
[FEATURE] (stock transfer); propagate ERP errors to user
[FEATURE] (action pages): re-align UI elements on large and medium screens
[FIX] (action pages): fix typo preventing providing username to MII transaction
[INTERNAL] (i18n): remove default language properties
[INTERNAL] snapshot version
[INTERNAL] (build): try fix build problems
[FIX] (stock transfer): show error message
[INTERNAL] replace ....sId by ....getId()
[INTERNAL] version 1.2.36.2018-03-17
[FIX] (goods receipt): fix too small storage location input on very large screens
[INTERNAL] (misc): refactor some eslint warnings
[INTERNAL] (misc): refactor some eslint warnings
[REFACTOR] (goods receipt): steamline and add polish to coding
also refactor 
adjust test features accordingly
[REFACTOR] (goods issue): steamline and add polish to coding
also refactor 
adjust test features accordingly
[FEATURE] (goods receipt): purge LE data if LENUM gets invalid
[FEATURE] (goods issue): purge LE data if LENUM gets invalid
[REFACTOR] (stock transfer): steamline and add polish to coding
also refactor 
adjust test features accordingly
[TEST] [FIX] (goods receipt): fix wording
[REFACTOR] (roller conveyor): steamline and add polish to coding
also refactor 
adjust test features accordingly
[INTERNAL] (build): revert build process
[INTERNAL] version 1.2.35.2018-03-18
[INTERNAL] version 1.2.35.2018-03-18
