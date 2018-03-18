[FEATURE] (action): add username as external user
[FIX] (roller conveyor): set storage bin item only if ressource id has been found
[FEATURE] (roller conveyor): cleanup success messages
[FEATURE] (action pages): add support for barcode scanner integration
Main logic is located on ActionPageController. Here we attach and detach the scanner event listener everytime a page is shown and hidden.
The attached event delegate evaluates the scanned string to discover the control.
[FEATURE] (roller conveyor): set stretcher default to true
[FEATURE] (stock transfer); propagate ERP errors to user
[FEATURE] (action pages): re-align UI elements on large and medium screens
[FIX] (action pages): fix typo preventing providing username to MII transaction
[FIX] (stock transfer): show error message
[FIX] (goods receipt): fix too small storage location input on very large screens
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
[REFACTOR] (roller conveyor): steamline and add polish to coding
also refactor 
adjust test features accordingly
