[FEATURE] Use custom header for action page goods receipt
-Add style.css
-Add class to Title control
-Add Icon to header
[TEST] Add test for header icon and title style
[CHANGE] Move material number input above quantity input
-This way we want to improve useability, bc we override quantity intput in some cases
[CHANGE] Don't override quantity input if value is not equal zero
-This way, we preserve unser input. Else we would override input with remaing quantity.
[STYLE] Remove unnecessary code
[FIX] Unit of measure is not discovered from order component after material entry
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
