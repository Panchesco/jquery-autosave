jquery-autosave
===============

jQuery to work with PHP for autosaving form entries at set intervals.

### Options

| Option | Default | Description |
-------- | ------- | ----------- |
| selector | form | Selector from which to grab form data |
| listingContainer | #autosave-list | Container for list of available autosaves|
| pages | [] | Array of regex patterns for of urls to apply autosave |
| cookieName | pnchc_atsv | Cookie name |
| cookiePath | / | Cookie path |
| interval | 5 | Interval in minutes at which autosave created |
| listUrl | /admin/autosave/rows/12 | URL to retrieve autosave data for current url |
| createUrl | /admin/autosave/create | URL to submit posted autosave data |
| keyUpSelector | input,textarea | Form elements a keyup event will trigger autosave |
| autosaveUrlId | autosave_url | Name of db field holding autosave URL |
| restoreSelector | .autosave-restore | Class assigned to clickable list items for restoring an autosave |
				
				

