    $(document).ready(function(){

      //physics object
      var physics = {
        variables: {
          frameInterval : 0.033, //30 fps
          frameIntervalM : null,
          index : 0,
          xVel : 10,
          yVel : 20,
          xPos : 0,
          yPos : 0,
          yAcc : -9.8,
          xAcc : 0,
          massEarth: 5.98E24,
          radius: 6378000,
          centerDist: null,
          gravConst: 6.67E-11,
          gravMag: null,
          gravVect: null,
          radiusPx: null,
          diamPx: null,
          pixelRatio: 0.2 //1px = 0.2m
        },

        crunch : function (){
          this.variables.index += 1;
          this.variables.xPos += this.variables.xVel * this.variables.frameInterval;
          this.variables.yPos += this.variables.yVel * this.variables.frameInterval;
          this.variables.yVel += this.variables.yAcc * this.variables.frameInterval;
          this.variables.xVel += this.variables.xAcc * this.variables.frameInterval;
        }
      };

      physics.variables.frameIntervalM = Math.round(physics.variables.frameInterval * 1000);
      physics.variables.centerDist = physics.variables.radius;
      physics.variables.radiusPx = Math.round(physics.variables.radius/physics.variables.pixelRatio);
      physics.variables.diamPx = Math.round(physics.variables.radiusPx * 2);

      var myVar;

      //controller object
      var controller = {
        startFunction : function(){
          physics.variables.xVel = Number($('input#velocityInput').val().split(',')[0]);
          physics.variables.yVel = Number($('input#velocityInput').val().split(',')[1]);
          physics.variables.xPos = Number($('input#initialPositionInput').val().split(',')[0]);
          physics.variables.yPos = Number($('input#initialPositionInput').val().split(',')[1]);
          myVar = setInterval(main,physics.variables.frameIntervalM);
        },

        stopFunction : function(){
          clearInterval(myVar);
        }
      };

      //panel object
      var panel = {
        variables : {
          bottom: 0,
          left: 0
        },

        updatePanel : function(){
          $('li:nth-child(1)').text("Frame Number: " + physics.variables.index);
          $('li:nth-child(2)').text("T: : " + (physics.variables.index*physics.variables.frameInterval).toPrecision(3) + " s");
          $('li:nth-child(3)').text("Height: " + physics.variables.yPos.toPrecision(3) + " m");
          $('li:nth-child(4)').text("Down Range Distance: " + physics.variables.xPos.toPrecision(3) + " m");
          $('li:nth-child(5)').text("Horizontal Velocity: " + physics.variables.xVel.toPrecision(3) + " m/s");
          $('li:nth-child(6)').text("Vertical Velocity: " + physics.variables.yVel.toPrecision(3) + " m/s");
        },

        redraw : function(){
          this.bottom = Math.round(physics.variables.yPos / physics.variables.pixelRatio);
          this.left = Math.round(physics.variables.xPos / physics.variables.pixelRatio);
          $('.sprite').css({'left': this.left, 'bottom': this.bottom});
        }
      };

      //initialize telemetry panel
      panel.updatePanel();
      $('button#startCommand').on('click', controller.startFunction);
      $('button#stopCommand').on('click', controller.stopFunction);

      var main = function (){
        if (physics.variables.yPos < 0 && physics.variables.yVel < 0){
          return;
        }
        physics.crunch();
        panel.updatePanel();
        panel.redraw();
      };

    });