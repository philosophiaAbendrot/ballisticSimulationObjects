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

      //controller object
      var controller = {
        startFunction : function(){
          globalVariables.xVel = Number($('input#velocityInput').val().split(',')[0]);
          globalVariables.yVel = Number($('input#velocityInput').val().split(',')[1]);
          globalVariables.xPos = Number($('input#initialPositionInput').val().split(',')[0]);
          globalVariables.yPos = Number($('input#initialPositionInput').val().split(',')[1]);
          myVar = setInterval(runtime.main,globalVariables.frameIntervalM);
        },

        stopFunction : function(){
          clearInterval(myVar);
        }
      };

      //panel object
      var panel = {
        updatePanel : function(){
          $('li:nth-child(1)').text("Frame Number: " + globalVariables.index);
          $('li:nth-child(2)').text("T: : " + (globalVariables.index*globalVariables.frameInterval).toPrecision(3) + " s");
          $('li:nth-child(3)').text("Height: " + globalVariables.yPos.toPrecision(3) + " m");
          $('li:nth-child(4)').text("Down Range Distance: " + globalVariables.xPos.toPrecision(3) + " m");
          $('li:nth-child(5)').text("Horizontal Velocity: " + globalVariables.xVel.toPrecision(3) + " m/s");
          $('li:nth-child(6)').text("Vertical Velocity: " + globalVariables.yVel.toPrecision(3) + " m/s");
        },

        redraw : function(x,y){
          $('.sprite').css({'left': x, 'bottom':y});
        }
      };

      //physics object
      var physics = {
        variables: {
          yAcc : -9.8,
          xAcc : 0,
        },

        crunch : function (){
          globalVariables.index += 1;
          globalVariables.xPos += globalVariables.xVel * globalVariables.frameInterval;
          globalVariables.yPos += globalVariables.yVel * globalVariables.frameInterval;
          globalVariables.yVel += this.variables.yAcc * globalVariables.frameInterval;
          globalVariables.xVel += this.variables.xAcc * globalVariables.frameInterval;
        }
      };



      //initialize telemetry panel
      panel.updatePanel();
      $('button#startCommand').on('click', controller.startFunction);
      $('button#stopCommand').on('click', controller.stopFunction);

      var runtime = {
        main : function (){

          var bottom;
          var left;

          if (globalVariables.yPos < 0 && globalVariables.yVel < 0){
            return;
          }

          physics.crunch();

          bottom = Math.round(globalVariables.yPos / globalVariables.pixelRatio);
          left = Math.round(globalVariables.xPos / globalVariables.pixelRatio);
          panel.updatePanel();
          panel.redraw(left,bottom);
        }
      };

    });