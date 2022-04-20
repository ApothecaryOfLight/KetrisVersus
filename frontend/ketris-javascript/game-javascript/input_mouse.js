const mouseover_objects = {
  start_game_button: false
}

/*
Get the position of the mouse cursor.
*/
function getCursorPosition( canvas, event ) {
  let x, y;
  let myCanvas = document.getElementById('myKetrisCanvas');
  let canvasOffsetLeft = myCanvas.offsetLeft;
  let canvasOffsetTop = myCanvas.offsetTop;
  x = event.clientX + document.body.scrollLeft +
    document.documentElement.scrollLeft -
    Math.floor(canvasOffsetLeft);
  y = event.clientY + document.body.scrollTop +
    document.documentElement.scrollTop -
    Math.floor(canvasOffsetTop) + 1;
  return [x,y];
}


/*
This function transforms the coordinants of a mouse click into standardized
coordinants existing in the default coordinant space of the Ketris graphics.

This will allow us to test coordinants in a coordinant space that will always have
the same dimensions, regardless of CSS stretching applied to the canvas.
*/
function transform_mouse_coords_to_ketris_canvas( mouse_move_event ) {
  //Get a reference to the Ketris canvas.
  const myKetrisCanvas = document.getElementById("myKetrisCanvas");

  //Get the CSS adjusted height and width of the canvas.
  //Note that the enemy's part of the canvas is irrelevant, so we divide the width
  //by 2 to get the width of just the user's part of the canvas.
  const canvas_width = myKetrisCanvas.offsetWidth/2;
  const canvas_height = myKetrisCanvas.offsetHeight;

  //Next, divide the default pixel size of the canvas by the actual size.
  //This will give us the ratio of difference between the default canvas size
  //and the actual canvas size.
  const width_ratio = 320 / canvas_width;
  const height_ratio = 768 / canvas_height;

  //Now create an object with the relevant mouse position informaiton.
  //
  //The first two values, mouse_X_pos and mouse_Y_pos, will be the position
  //of the mouse cursor transformed to account for the difference between the
  //actual canvas and the default canvas. This standardizes the coordinates,
  //so we can check for default coordinants that will always be the same,
  //regardless of CSS stretching.
  //
  //For the Y coordinant, we need to adjust it by 128, to account for the space
  //above the game area where score is displayed.
  //
  //The final two values, mouse_X_grid and mouse_Y_grid, are also transformed
  //into the default coordinant space, but are further divided by the default
  //size of the Ketris tiles to give us the mouse's Ketris grid position.
  //
  //The X grid value needs to be adjusted by 1, so that it will give us zeroeth
  //positioning, to match zeroeth counting-based arrays. Arrays with zeroeth
  //counting means that arrays start at 0, and we want our mouse grid coordinants
  //to match that.
  //
  //The Y grid value also needs to be adjusted by 1 for the same reason, but
  //additionally needs to be adjusted by 4 more to account for the score area
  //above the gameplay area, so that becomes a total of 5.
  const mouse_position_object = {
    mouse_X_pos: Math.round(mouse_move_event.offsetX*width_ratio),
    mouse_Y_pos: Math.round(mouse_move_event.offsetY*width_ratio) - 128,
    mouse_X_grid: Math.ceil((mouse_move_event.offsetX*width_ratio)/31) - 1,
    mouse_Y_grid: Math.ceil((mouse_move_event.offsetY*height_ratio)/31) - 5,
    width_ratio: width_ratio,
    height_ratio: height_ratio
  }

  //Finally we return this object, which can be used for all mouse interactions
  //with the Ketris canvas.
  return mouse_position_object;
}


/*
Funtion to run upon mouse clicks.
*/
function mouse_events( mouse_event ) {
  let out = getCursorPosition( myKetrisCanvas, mouse_event );
  if( myGameState.GlobalPlay == true ) {
    if( myGameState.Paused == false ) {
      if( isMobile ) {
        if( out[1] < 305 ) {
          doUpKeyPress();
        } else if( out[1] > 305  ) {
          if( out[0] < 65 ) {
            doLeftKeyPress();
          }
          if(
          out[0] > 65 &&
          out[0] < 130
          ) {
            doDownKeyPress();
          }
          if( out[0] > 130 ) {
            doRightKeyPress();
          }
        }
      } else {
        if( out[0] < 313 ) {
          if( out[1] < (620/2) ) {
            doUpKeyPress();
          }
          if( out[1] > (620/2) && out[1] ) {
            if( out[0] < 310/3 ) {
              doLeftKeyPress();
            }
            if(
              out[0] > (310/3) &&
              out[0] < (310/3)*2
            ) {
              doDownKeyPress();
            }
            if( out[0] > (310/3)*2 ) {
              doRightKeyPress();
            }
          }
        }
      }
    }
  }

  if( myGameState.GameOver == true ) {
    //Get the standardized mouse coordinants.
    const mouse_coord_object =
      transform_mouse_coords_to_ketris_canvas( mouse_event );

    //Iterate through every menu button (presently there's only one).
    MenuButtons.forEach( (button) => {
      //If the mouse coords are over that button:
      if(
        mouse_coord_object.mouse_X_pos > button.desktop_click.xStart &&
        mouse_coord_object.mouse_X_pos < button.desktop_click.xEnd &&
        mouse_coord_object.mouse_Y_pos > button.desktop_click.yStart &&
        mouse_coord_object.mouse_Y_pos < button.desktop_click.yEnd
      ) {
        //Restart the game.
        let restart = JSON.stringify({
          type: 'game_event',
          event: 'client_restart'
        });
        connection.send( restart );
        doStartNewGame();
      }
    });

    if( isMobile ) {
      if( out[0] > 42 && out[0] < 149 ) {
        if( out[1] > 188 && out[1] < 220 ) {
          let restart = JSON.stringify({
            type: 'game_event',
            event: 'client_restart'
          });
          connection.send( restart );
          doStartNewGame();
        }
      }
    } else {
    if( out[0] > 59 && out[0] < 178 ) {
      if( out[1] > 221 && out[1] < 256 ) {
        let restart = JSON.stringify({
          type: 'game_event',
          event: 'client_restart'
        });
        connection.send( restart );
        doStartNewGame();
      }
    }
    }
  }
}




function mouse_moved( mouse_move_event ) {
  //Get the standardized mouse coordinants.
  const mouse_coord_object =
    transform_mouse_coords_to_ketris_canvas(mouse_move_event);

  //Iterate through every menu button (presently there's only one).
  MenuButtons.forEach( (button) => {
    //If the mouse coords are over that button:
    if(
      mouse_coord_object.mouse_X_pos > button.desktop_click.xStart &&
      mouse_coord_object.mouse_X_pos < button.desktop_click.xEnd &&
      mouse_coord_object.mouse_Y_pos > button.desktop_click.yStart &&
      mouse_coord_object.mouse_Y_pos < button.desktop_click.yEnd
    ) {
      //Set the menu button to be drawn in mouseover mode.
      mouseover_objects.start_game_button = true;
    } else {
      //Set the menu button to be drawn in not-mouseover mode.
      mouseover_objects.start_game_button = false;
    }
  });
}


/*
Attach mouse events to the click event.
*/
function attach_game_mouse_events() {
  const myKetrisCanvas = document.getElementById("myKetrisCanvas");

  myKetrisCanvas.addEventListener( 'click', mouse_events );
  myKetrisCanvas.addEventListener( 'mousemove', mouse_moved );
}


/*
Detach mouse events to the click event.
*/
function detach_game_mouse_events() {
  const myKetrisCanvas = document.getElementById("myKetrisCanvas");

  myKetrisCanvas.removeEventListener( 'click', mouse_events );
  myKetrisCanvas.removeEventListener( 'mousemove', mouse_moved );
}