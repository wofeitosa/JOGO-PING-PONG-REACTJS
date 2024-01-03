import React, { useEffect, useRef } from 'react';
import './App.css';

const PingPongGame = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gapX = 10;

    const field = {
      w: window.innerWidth,
      h: window.innerHeight,
      draw: function() {
        ctx.fillStyle = "#1e3a8a";
        ctx.fillRect(0, 0, this.w, this.h);
      }
    };

    const line = {
      w: 15,
      h: field.h,
      draw: function() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
      }
    };

    const leftPaddle = {
      x: gapX,
      y: 0,
      w: line.w,
      h: 200,
      _move: function() {
        this.y = Math.max(0, Math.min(field.h - this.h, mouse.current.y - this.h / 2));
      },
      draw: function() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x, this.y, this.w, this.h);
      }
    };

    const rightPaddle = {
      x: field.w - line.w - gapX,
      y: 100,
      w: line.w,
      h: 200,
      speed: 5,
      _move: function() {
        let targetY = ball.y - this.h / 2;
        this.y += this.y < targetY ? Math.min(this.speed, targetY - this.y) : Math.max(-this.speed, targetY - this.y);
        this.y = Math.max(0, Math.min(this.y, field.h - this.h));
      },
      draw: function() {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x, this.y, this.w, this.h);
      }
    };

    const ball = {
      x: field.w / 2,
      y: field.h / 2,
      r: 20,
      speed: 5,
      directionX: 1,
      directionY: 1,
      _calcPosition: function() {
        if (this.x < 0 || this.x > field.w) {
          // A bola saiu do campo; resetar
          this.x = field.w / 2;
          this.y = field.h / 2;
          this.directionX = this.directionY = 1;
          score.increaseComputer();
        }
        if (this.y < this.r || this.y + this.r > field.h) {
          this.directionY *= -1;
        }

        if (this.x - this.r < leftPaddle.x + leftPaddle.w && this.y > leftPaddle.y && this.y < leftPaddle.y + leftPaddle.h) {
          this.directionX *= -1;
        } else if (this.x + this.r > rightPaddle.x && this.y > rightPaddle.y && this.y < rightPaddle.y + rightPaddle.h) {
          this.directionX *= -1;
        }
      },
      _move: function() {
        this.x += this.speed * this.directionX;
        this.y += this.speed * this.directionY;
      },
      draw: function() {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        this._calcPosition();
        this._move();
      }
    };

    const score = {
      human: 0,
      computer: 0,
      increaseHuman: function() {
        this.human++;
      },
      increaseComputer: function() {
        this.computer++;
      },
      draw: function() {
        ctx.font = "bold 72px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#172554";
        ctx.fillText(this.human, field.w / 4, 50);
        ctx.fillText(this.computer, 3 * field.w / 4, 50);
      }
    };

    function setup() {
      canvas.width = field.w;
      canvas.height = field.h;
    }

    function draw() {
      field.draw();
      line.draw();
      leftPaddle.draw();
      rightPaddle.draw();
      score.draw();
      ball.draw();
    }

    function animate() {
      requestAnimationFrame(animate);
      draw();
      leftPaddle._move();
      rightPaddle._move();
    }

    setup();
    animate();

    const handleMouseMove = (e) => {
      mouse.current.y = e.pageY - canvas.offsetTop;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default PingPongGame;


