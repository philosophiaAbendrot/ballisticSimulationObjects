    $(document).ready(function(){

      var frameInterval = 0.033; //30 fps
      var frameIntervalM = frameInterval * 1000;
      var pixelRatio = 0.2; //1px = 0.2m
      var start = 0;
      var myVar;
      var index = 0;
      var xVel = 10;
      var yVel = 20;
      var xPos = 0;
      var yPos = 0;


      //initialize telemetry panel
      updatePanel(frameInterval,xPos,yPos,xVel,yVel);
      $('button#startCommand').on('click', startFunction);
      $('button#stopCommand').on('click', stopFunction);


      function startFunction(){
        xVel = Number($('input#velocityInput').val().split(',')[0]);
        yVel = Number($('input#velocityInput').val().split(',')[1]);
        xPos = Number($('input#initialPositionInput').val().split(',')[0]);
        yPos = Number($('input#initialPositionInput').val().split(',')[1]);
        myVar = setInterval(main,frameIntervalM);
      }

      function stopFunction(){
        clearInterval(myVar);
      }

      function main(){
        var yAcc = -9.8;
        var xAcc = 0;
        var bottom;
        var left;

        if (yPos < 0 && yVel < 0){
          return;
        }

        index += 1;
        xPos += xVel * frameInterval;
        yPos += yVel * frameInterval;
        yVel += yAcc * frameInterval;
        xVel += xAcc * frameInterval;
        bottom = Math.round(yPos / pixelRatio);
        left = Math.round(xPos / pixelRatio);

        updatePanel(frameInterval,xPos,yPos,xVel,yVel);
        redraw(left,bottom);

      }


      function updatePanel(frameInterval,xPos,yPos,xVel,yVel){
        $('li:nth-child(1)').text("Frame Number: " + index);
        $('li:nth-child(2)').text("T: : " + (index*frameInterval).toPrecision(3) + " s");
        $('li:nth-child(3)').text("Height: " + yPos.toPrecision(3) + " m");
        $('li:nth-child(4)').text("Down Range Distance: " + xPos.toPrecision(3) + " m");
        $('li:nth-child(5)').text("Horizontal Velocity: " + xVel.toPrecision(3) + " m/s");
        $('li:nth-child(6)').text("Vertical Velocity: " + yVel.toPrecision(3) + " m/s");
      }

      function redraw(x,y){
        $('.sprite').css({'left': x, 'bottom':y});
      }
    });