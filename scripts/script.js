    $(document).ready(function(){
      //global variable object
      var globalVariables = {
        frameInterval : 0.033, //30 fps
        frameIntervalM : null,
        pixelRatio : 0.2, //1px = 0.2m
        index : 0,
        xVel : 10,
        yVel : 20,
        xPos : 0,
        yPos : 0
      };

      globalVariables.frameIntervalM = Math.round(globalVariables.frameInterval * 1000);

      var myVar;

      //initialize telemetry panel
      updatePanel();
      $('button#startCommand').on('click', startFunction);
      $('button#stopCommand').on('click', stopFunction);


      function startFunction(){
        globalVariables.xVel = Number($('input#velocityInput').val().split(',')[0]);
        globalVariables.yVel = Number($('input#velocityInput').val().split(',')[1]);
        globalVariables.xPos = Number($('input#initialPositionInput').val().split(',')[0]);
        globalVariables.yPos = Number($('input#initialPositionInput').val().split(',')[1]);
        myVar = setInterval(main,globalVariables.frameIntervalM);
      }

      function stopFunction(){
        clearInterval(myVar);
      }

      function main(){
        var yAcc = -9.8;
        var xAcc = 0;
        var bottom;
        var left;

        if (globalVariables.yPos < 0 && globalVariables.yVel < 0){
          return;
        }

        globalVariables.index += 1;
        globalVariables.xPos += globalVariables.xVel * globalVariables.frameInterval;
        globalVariables.yPos += globalVariables.yVel * globalVariables.frameInterval;
        globalVariables.yVel += yAcc * globalVariables.frameInterval;
        globalVariables.xVel += xAcc * globalVariables.frameInterval;
        bottom = Math.round(globalVariables.yPos / globalVariables.pixelRatio);
        left = Math.round(globalVariables.xPos / globalVariables.pixelRatio);

        updatePanel();
        redraw(left,bottom);

      }


      function updatePanel(){
        $('li:nth-child(1)').text("Frame Number: " + globalVariables.index);
        $('li:nth-child(2)').text("T: : " + (globalVariables.index*globalVariables.frameInterval).toPrecision(3) + " s");
        $('li:nth-child(3)').text("Height: " + globalVariables.yPos.toPrecision(3) + " m");
        $('li:nth-child(4)').text("Down Range Distance: " + globalVariables.xPos.toPrecision(3) + " m");
        $('li:nth-child(5)').text("Horizontal Velocity: " + globalVariables.xVel.toPrecision(3) + " m/s");
        $('li:nth-child(6)').text("Vertical Velocity: " + globalVariables.yVel.toPrecision(3) + " m/s");
      }

      function redraw(x,y){
        $('.sprite').css({'left': x, 'bottom':y});
      }
    });