$ git log --after 09/02/2018 --pretty=format:"%s%n%b" --reverse --no-merges | grep -v '^$' > CHANGES.md

[<TYPE>] <subject>

<body>

<footer>

Allowed <TYPE> values:
- FEATURE (new feature for the user, not a new INTERNAL type feature )
- FIX (bug fix for the user, not a INTERNAL type fix )
- STYLE (no production code change; formatting, missing semi colons, etc )
- TEST (no production code change; adding missing tests, refactoring tests, etc )
- INTERNAL (no production code change; changing dev environment, updating grunt tasks, etc )

[FEATURE] Change type of error

 - Show as red
 - new messahe text
 
Fixes issue #123
 