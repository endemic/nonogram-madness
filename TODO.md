# TODO

==================

[x] Change dimensions of game to 375x667
 * Halve the dimensions of any in-game object -- easy!
[ ] Test IAP
[ ] Fix problem with referencing Grid within the TUTORIAL data structure
[ ] Go back to old icon with green columns?
[ ] Update Ruby script to output web icons
[x] Add functionality to 'reset data' button
[ ] Add URLs for rating in the about.js scene
[x] Selecting locked level then unselecting removes the red border
[x] Get rid of gulp, I don't trust its `cordova` job
[x] Remove the utf8 arrows in "back" buttons
[x] You are able to play locked levels
[x] Remove the confirmation modals for "reset" and "quit" in GameScene
[x] Add "unlock" button to upper right of level select

[x] Finish the first tutorial
	[x] tutorial layout
	[x] move board down towards buttons
	[x] hide preview and timer
	[x] expand size of hint text area
[x] Finish second tutorial
[x] Determine # of free puzzles
[x] When IAP-enabled, border of locked puzzles are red
[x] Go directly to next puzzle when first starting
[x] Got a shitload of misc scenes [About, Credits, Options, Rules] - condense
	* Ditch about, options; keep rules and credits, don't clear out saved data after credits scene
[x] Finish UnlockScene layout
[x] Make "fill" button default
[x] Add icons/splash screens to Cordova prj
[x] Bug w/ prev button when starting on page 0

[x] Add the "win" jingle -- keep the alert
[x] Test Cordova project
[x] Determine which levels are free (first 15)
[x] Change "Rate this app!" button to "Feedback"
[x] Add "-N minutes" label message when wrong guess
	- [x] Animate its y-position as well
[x] Finish UI placement in game scene
[x] Draw clue labels
[x] Draw preview of current progress in game scene
[x] Add highlighting to currently selected row/col
[x] Play SFX when attempting to fill a marked block
[x] Play SFX when attempting to fill a filled block
[x] Play SFX when attempting to mark a filled block
[x] Lay out the title scene UI
[x] Add "rules" reference scene
[x] Add "options" scene
	* music on/off
	* sfx on/off
	* reset data
[x] Add "about" scene
	* credits - puzzle by nikoli (no it's not)
	* copyright
[x] Dim clues that are already completed
[x] Don't allow clicking on hidden puzzle thumbnails (level select)
[x] Can't win random puzzles
[x] Center mark/fill icons
[x] Only draw preview in level select if user has completed the puzzle
- [x] Mark levels completed if you actually complete them
[x] Auto-select first puzzle when moving to new page (level select)
[x] Change preview to draw cached image, rather than a bunch of "pixel" objects
[x] Preview doesn't take puzzle size into account; assumes 10x10
[x] Add icons next to the mark/fill button text
[x] "play" on title screen takes you right to next (first) puzzle
[x] "lock" the mark action, where it doesn't try to toggle blocks
[x] when automatically going to game, ensure that returning to level select
	  puts you on the right page/selected puzzle
[x] Add zero-padding to minutes/seconds timer label
[x] Dim prev/next buttons on level select if scene instantiates on first/last page

## Future

[x] Add tutorial; baked into first few puzzles
[x] Add a 'tutorial data' object, which gives clues/text for each step
[ ] Add a "success!" end puzzle modal
	* Modal window subclass of Shape
[ ] Add actual link to rate on various app stores
[x] Buttons to go directly to the next puzzle, or back to level select

## Arcadia

- [ ] Updating label text doesn't seem to use correct line height
- [ ] Update Arcadia to draw borders either entirely outside or entirely inside shapes
- [x] Change buttons to use an 'respond to input' boolean property, instead of 
	  creating/destroying their own even listeners. The scene's "onPoint{whatever}"
	  method gets called, and passes down the point object to all its children that
	  'respond to input' and are active
- [x] Deactivating doesn't seem to be working correctly
- [x] descenders in custom fonts don't always get drawn
- [ ] "shake" effect

if(_fxShakeDuration > 0)
{
	_fxShakeDuration -= FlxG.elapsed;
	if(_fxShakeDuration <= 0)
	{
		_fxShakeOffset.make();
		if(_fxShakeComplete != null)
			_fxShakeComplete();
	}
	else
	{
		if((_fxShakeDirection == SHAKE_BOTH_AXES) || (_fxShakeDirection == SHAKE_HORIZONTAL_ONLY))
			_fxShakeOffset.x = (FlxG.random()*_fxShakeIntensity*width*2-_fxShakeIntensity*width)*_zoom;
		if((_fxShakeDirection == SHAKE_BOTH_AXES) || (_fxShakeDirection == SHAKE_VERTICAL_ONLY))
			_fxShakeOffset.y = (FlxG.random()*_fxShakeIntensity*height*2-_fxShakeIntensity*height)*_zoom;
	}
}
