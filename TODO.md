# TODO

==================

- [x] Finish UI placement in game scene 
- [x] Draw clue labels
- [x] Draw preview of current progress in game scene
- [x] Add highlighting to currently selected row/col
- [x] Play SFX when attempting to fill a marked block
- [x] Play SFX when attempting to fill a filled block
- [x] Play SFX when attempting to mark a filled block
- [x] Lay out the title scene UI
- [x] Add "rules" reference scene
- [x] Add "options" scene
	* music on/off
	* sfx on/off
	* reset data
- [x] Add "about" scene
	* credits - puzzle by nikoli
	* copyright
- [ ] Dim clues that are already completed
- [ ] Add icons next to the mark/fill button text
- [ ] Center mark/fill icons
- [ ] Only draw preview in level select if user has completed the puzzle
- [ ] Add tutorial; baked into first few puzzles
- [ ] "play" on title screen takes you right to next (first) puzzle
- [ ] Don't allow clicking on hidden puzzle thumbnails (level select)
- [x] Can't win random puzzles

## Cordova

- [ ] Add actual link to rate on various app stores

## Arcadia

- [ ] Updating label text doesn't seem to use correct line height
- [ ] Update Arcadia to draw borders either entirely outside or entirely inside shapes
- [ ] Deactivating doesn't seem to be working correctly
- [ ] descenders in custom fonts don't always get drawn
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