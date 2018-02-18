[FEATURE] (roller conveyor): detect last unit and repair user input if required
[FEATURE] (roller conveyor): detect last unit and show message
[TEST] (roller conveyor): add tests to validate last unit logic
[FEATURE] (roller conveyor): convert entered unit into uppercase
[TEST] (roller conveyor): prepare final test cases
[REFACTOR] (roller conveyor): move isLastStorageUnit to formatter and add isNotLastStorageUnit formatter
[REFACTOR] (login): make var to const
[FEATURE] (login): rework how this app handles login and authentication
There are two scenarios to consider: Navigation from Mobile device and form Desktop device.
From a desktop, we always navigate to a deep page like "/Start" or "/WE" (= not login page). Users are always authenticated by SAP NetWeaver.
However, from a mobile device, we always navigate to "/Anmeldung" (= login page) while being authenticated by SAP NetWeaver using an default dummy user. This is why we force the user to enter his username. On successful login, we set the user model. To prevent navigation to a deeper page without an user model, all pages are based on PageBaseConroller that attaches a onBeforeNavigation event. Each time this even triggers, we check if the user model is set and valid. If not, we navigate to login page.
To prevent desktop devices to be forced to navigatio to login page, we will read the IllumLoginName and fire a validation request to MII.
[TEST] (unit): remove empty file
[TEST] (login): add several test to validate login and authentication behaviour
[FIX] (roller conveyor): misspell in binding to check storage unit empty or full
[FIX] (formatter): fix typo in storage unit empty/full formatter
[TEST] (login): renew test cases to be better in general
[FIX] (formatter): make isNotLastStorageUnit more atomic
[TEST] (all): increase performance
[INTERNAL] update version
[INTERNAL] update version
[TEST] (index): add option to start app with external UI5 library by using index-ext.irpt
[FEATURE] (home): remove back navigation and hise Logout item on desktop devices
[FIX] (roller conveyor): fix not being able to lint "=>" operator
[INTERNAL] (grunt): fix text replace task
[FEATURE] (formatter): add null-check to last storage unit formatter
[INTERNAL] (component): add missing semicolon
[INTERNAL] (component): no statement in return
[INTERNAL] (project): update settings
[STYLE] (component): remove newline and unused var
[TEST] (opa): fix typo
[INTERNAL] (mockserver): set delay to 1000ms
remember to set &serverDelay=0 when doing opa tests
[FEATURE] (models): add error messages to all models
also add message toasts on request complete when debugging is active
[TEST] (navigation): adopt latest changes to logout removal on desktop devices
[FEATURE] (roller conveyor): prepare posting support
[INTERNAL] update version to 1.2.0.2018-02-18
