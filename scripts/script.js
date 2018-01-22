//Currently implementing: Add function which draws the Earth and the spacecraft in the appropriate position.

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
          gravVect: null
        },

        crunch : function (){
          this.variables.index += 1;
          this.variables.xPos += this.variables.xVel * this.variables.frameInterval;
          this.variables.yPos += this.variables.yVel * this.variables.frameInterval;
          this.variables.yVel += this.variables.yAcc * this.variables.frameInterval;
          this.variables.xVel += this.variables.xAcc * this.variables.frameInterval;
        }
      };

      //controller object
      var controller = {
        startFunction : function(){
          //input
          physics.variables.xVel = Number($('input#velocityInput').val().split(',')[0]);
          physics.variables.yVel = Number($('input#velocityInput').val().split(',')[1]);
          physics.variables.xPos = Number($('input#initialPositionInput').val().split(',')[0]);
          physics.variables.yPos = Number($('input#initialPositionInput').val().split(',')[1]);
          //initialize object variables
          main.mainInitializer();
          //start game loop
          myVar = setInterval(main.mainFunc,physics.variables.frameIntervalM);
        },

        stopFunction : function(){
          clearInterval(myVar);
        }
      };

      //panel object
      var panel = {
        variables : {
          bottom: 0,
          left: 0,
          windowWidth: null,
          windowHeight: null,
          //1px = 35000 m
          pixelRatio: 35000,
          //variables used to position the earth sprite
          radiusPx: null,
          diamPx: null,
          earthBottom: null,
          earthLeft: null
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
          this.bottom = Math.round(physics.variables.yPos / this.variables.pixelRatio + this.variables.windowHeight / 2);
          this.left = Math.round(physics.variables.xPos / this.variables.pixelRatio + this.variables.windowWidth / 2);
          $('.sprite').css({'left': this.left, 'bottom': this.bottom});
        }
      };

      //initialize telemetry panel
      $('button#startCommand').on('click', controller.startFunction);
      $('button#stopCommand').on('click', controller.stopFunction);

      var main = {
        //main function
        mainFunc: function(){
          if (physics.variables.yPos < 0 && physics.variables.yVel < 0){
            return;
          }
          physics.crunch();
          panel.updatePanel();
          panel.redraw();
        },

        mainInitializer: function(){
          //physics variables
          physics.variables.frameIntervalM = Math.round(physics.variables.frameInterval * 1000);
          physics.variables.centerDist = physics.variables.radius;
          //panel variables
          panel.variables.radiusPx = Math.round(physics.variables.radius / panel.variables.pixelRatio);
          panel.variables.diamPx = Math.round(panel.variables.radiusPx * 2);
          panel.variables.windowWidth = $('.drawArea').width();
          panel.variables.windowHeight = $('.drawArea').height();
          //initialize position of the earth
          panel.variables.earthBottom = Math.round(panel.variables.windowHeight / 2) - panel.variables.radiusPx;
          panel.variables.earthLeft = Math.round(panel.variables.windowWidth / 2) - panel.variables.radiusPx;
           //draw earth
          $('.drawArea .earth').css({
            left: panel.variables.earthLeft,
            bottom: panel.variables.earthBottom,
            width: panel.variables.diamPx,
            height: panel.variables.diamPx
          });
          alert("Earth Drawn. DiamPx = " + panel.variables.radiusPx);
        }
      };

      //initialize telemetry panel
      panel.updatePanel();

    });