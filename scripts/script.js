//next step: Add additional fields for the telemetry panel.
//next step: Make simulation terminate when height is < 0

//changes to commit:
//Changed title on UI to "Ballistics Simulation"
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
          height: null,
          absVel: null
        },

        crunch : function (){
          this.variables.index += 1;
          this.variables.xPos += this.variables.xVel * this.variables.frameInterval;
          this.variables.yPos += this.variables.yVel * this.variables.frameInterval;
          this.variables.yVel += this.variables.yAcc * this.variables.frameInterval;
          this.variables.xVel += this.variables.xAcc * this.variables.frameInterval;
          this.variables.centerDist = Math.sqrt(Math.pow(this.variables.xPos,2) + Math.pow(this.variables.yPos,2));
          this.variables.gravMag = this.variables.gravConst * this.variables.massEarth / Math.pow(this.variables.centerDist,2);
          this.variables.gravVect = [- 1 * this.variables.xPos/this.variables.centerDist,-1 * this.variables.yPos/this.variables.centerDist];
          this.variables.xAcc = this.variables.gravMag * this.variables.gravVect[0];
          this.variables.yAcc = this.variables.gravMag * this.variables.gravVect[1];
          this.variables.height = (this.variables.centerDist - this.variables.radius);
          this.variables.absVel = Math.sqrt(Math.pow(this.variables.xVel,2) + Math.pow(this.variables.yVel,2));
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
        $('li:nth-child(3)').text("Height: " + physics.variables.height.toPrecision(3) + " m");
        $('li:nth-child(4)').text("Velocity: " + physics.variables.absVel.toPrecision(3) + " m/s");
        $('li:nth-child(5)').text("Horizontal Velocity: " + physics.variables.xVel.toPrecision(3) + " m/s");
        $('li:nth-child(6)').text("Vertical Velocity: " + physics.variables.yVel.toPrecision(3) + " m/s");
        $('li:nth-child(7)').text("Vertical Acceleration: " + physics.variables.yAcc.toPrecision(3) + " m/s2");
        $('li:nth-child(8)').text("Horizontal Acceleration: " + physics.variables.xAcc.toPrecision(3) + " m/s2");
        $('li:nth-child(9)').text("yPosition: " + physics.variables.yPos.toPrecision(3) + " m");
        $('li:nth-child(10)').text("xPosition: " + physics.variables.xPos.toPrecision(3) + " m");
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
          //if the spacecraft collides with the earth
          if (physics.variables.height < 0){
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
        }
      };

      //initialize telemetry panel
      panel.updatePanel();

    });