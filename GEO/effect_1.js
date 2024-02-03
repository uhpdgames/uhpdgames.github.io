
function background_effect($switch){
    canvas_reset();

    if($switch === 1){

        var u = 0;

        var go = function() {
            var sc, g, g1, i, j, p, x, y, z, w, a, cur,
                d = new Date() / 1000,
                rnd = shift(),
                rnd1 = d,
                rnd2 = 2.4,
                rnd3 = d * 0.2,
                rnd1c = Math.cos(rnd1),
                rnd1s = Math.sin(rnd1),
                rnd2c = Math.cos(rnd2),
                rnd2s = Math.sin(rnd2);

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            sc = Math.max(canvas.width, canvas.height);
            ctx1.translate(canvas.width * 0.5, canvas.height * 0.5);
            ctx1.scale(sc, sc);
            g = ctx1.createLinearGradient(-1, -2, 1, 2);
            g.addColorStop(0.0, 'hsla(338, 95%, 25%, 1)');
            g.addColorStop(0.5, 'hsla(260, 95%, 5%, 1)');
            g.addColorStop(1.0, 'hsla(338, 95%, 30%, 1)');
            ctx1.fillStyle = g;
            ctx1.fillRect(-0.5, -0.5, 1, 1);
            ctx1.globalCompositeOperation = 'lighter';
            ctx1.rotate(rnd3 % Math.PI * 2);
            for (i = 0; i < 300; i += 1) {
                p = rnd();
                x = (p & 0xff) / 128 - 1;
                y = (p >>> 8 & 0xff) / 128 - 1;
                z = (p >>> 16 & 0xff) / 128 - 1;
                w = (p >>> 24 & 0xff) / 256;
                z += d * 0.5;
                z = (z + 1) % 2 - 1;
                a = (z + 1) * 0.5;
                if (a < 0.9) {
                    ctx1.globalAlpha = a / 0.7;
                }else {
                    a -= 0.9;
                    ctx1.globalAlpha = 1 - a / 0.1;
                }
                cur = x * rnd1c + y * rnd1s;
                y = x * rnd1s - y * rnd1c;
                x = cur;
                cur = y * rnd2c + z * rnd2s;
                z = y * rnd2s - z * rnd2c;
                y = cur;
                z -= 0.65;
                if (z >= 0) {
                    continue;
                }
                sc = 0.1 / z;
                x *= sc;
                y *= sc;
                ctx1.save();
                g1 = ctx1.createRadialGradient(1, 1, 2, 1, 1, 1);
                g1.addColorStop(0.0, 'hsla('+i+', 70%, 40%,.8)');
                g1.addColorStop(0.5, 'hsla('+i+', 75%, 50%, 1)');
                g1.addColorStop(1.0, 'hsla('+i+', 80%, 60%, .8)');
                ctx1.fillStyle = g1;
                ctx1.translate(x, y);
                ctx1.scale(sc * 0.017, sc * 0.017);
                ctx1.beginPath();
                ctx1.moveTo(2, 0);
                for (j = 0; j < 10; j += 1) {
                    ctx1.rotate(Math.PI*2 * 0.1);
                    ctx1.lineTo(j % 2 + 1, 0);
                }
                ctx1.arc(10, 10, 1, 0, Math.PI * 2);
                ctx1.rotate(Math.PI * 2 * 0.1);
                ctx1.closePath();
                ctx1.fill();
                ctx1.restore();
            }
        };
        /*
        Marsaglia's Xorshift128 PRG: http://en.wikipedia.org/wiki/Xorshift
        */
        var shift = function(x, y, z, w) {
            x = x || 123456789;
            y = y || 362436069;
            z = z || 521288629;
            w = w || 88675123;

            return function() {
                var s = x ^ (x << 11);
                x = y;
                y = z;
                z = w;
                w = (w ^ (w >>> 19)) ^ (s ^ (s >>> 8));
                return w;
            };
        }
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }, false);

        var run = function() {
            window.requestAnimationFrame(run);
            go();
        }
        run();
    }

    if($switch === 2){

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        const color = [
            "#6600CC",
            "#FFCC00",
            "#9EA9F0",
            "#CC0000",
        ]


        var maxRadius = 20;
        var minRadius = 2;
        var mouse = {
            x: undefined,
            y: undefined
        };

        window.addEventListener('mousemove', function(event){
            mouse.x = event.x;
            mouse.y = event.y;
            console.log(mouse);
        });

        window.addEventListener('resize', function(){
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        })

        function Circle(x, y, dx, dy, radius){
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;
            this.color = color[Math.floor(Math.random() * color.length)];

            this.draw = function(){
                ctx1.beginPath();
                ctx1.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx1.fillStyle = this.color
                ctx1.fill();
                ctx1.stroke();
            }

            this.update = function(){
                this.draw();
                if(this.x + this.radius >= canvas.width || this.x - this.radius <= 0){
                    this.dx = -this.dx;
                }
                if(this.y + this.radius >= canvas.height || this.y - this.radius <= 0){
                    this.dy = -this.dy;
                }
                this.x += this.dx;
                this.y -= this.dy;

                if(mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50 && this.radius < maxRadius){
                    this.radius += 1;
                }
                else if(this.radius > minRadius){
                    this.radius -= 1;

                }

            }

        }

        var circleArray = [];

        function init(){
            circleArray = [];
            for(var i = 0; i < 200; i++){
                var r = Math.floor(Math.random() * 3) + 1 ;
                var x = Math.random() * (innerWidth - r*2) + r;
                var y = Math.random() * (innerHeight - r*2) + r;
                var dx = (Math.random() - 0.5) * 5;
                var dy = (Math.random() - 0.5) * 5;
                circleArray.push(new Circle(x, y, dx, dy, r));
            }
        }

        function animate(){
            requestAnimationFrame(animate);
            ctx1.clearRect(0, 0, innerWidth, innerHeight);
            for(i = 0; i < circleArray.length ; i++){
                circleArray[i].update();
            }
        }

        animate();
        init();
    }

    if($switch === 3){

        var planets = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'],
            scale = [1, 9, 7, 6, 11, 8, 2, 3, 4, 5, 10],
            orbitV = [.8, 47.4, 35.0, 29.8, 1.0, 24.1, 13.1, 9.7, 6.8, 5.4, 4.7];
        moon = {},
            canvasX = canvas.width, canvasY = canvas.height;

        function loadPlanets() {
            planets.forEach(function(el, i, arr){
                var star = {};
                star.name = el;
                star.img = new Image();
                star.img.src = 'https://raw.githubusercontent.com/suekam/canvas-solar-system/master/images/'+el+'.png';
                console.log(el,':',star.img.src)
                star.scale = scale[i]; //update later
                star.orbitV = orbitV[i]; //update later
                arr[i] = star;
            });
            // take moon out of planets array because its treated differently

            planets.forEach(function(el, i, arr){
                if (planets[i].name === 'moon') {
                    moon = planets[i];
                    planets.splice(i, 1);
                }
            });
        }

        function printImg(img, x, y, w, h, ctx) {
            img.onload = function() {
                ctx1.drawImage(img, x, y, w, h);
            }
            ctx1.drawImage(img, x, y, w, h);
        }

        function draw() {

            // ctx1.globalCompositeOperation = 'destination-over';
            ctx1.clearRect(0, 0, canvasX, canvasY);

            ctx1.fillStyle = '#181818';
            ctx1.fillRect(0, 0, canvasX, canvasY);

            ctx1.fillStyle = 'rgba(255,255,255,.008)';
            ctx1.strokeStyle = 'rgba(89,153,188,0.15)';
            ctx1.save();
            ctx1.translate(canvasX/2, canvasY/2);
            var pos = 0;

            for (var i=0; i<planets.length; i++) {
                ctx1.save();

                var w = planets[i].img.width * (1/planets[i].scale) * 1/2,
                    h = planets[i].img.height * (1/planets[i].scale) * 1/2,
                    x = pos - w/2,
                    y = 0 - h/2,
                    deg = Math.floor(Math.random() * (360 - 0)) + 0;;

                var time = new Date();
                ctx1.rotate( (((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds()) * planets[i].orbitV/6 );
                // ctx1.translate(0, 0);

                if (i !== 0 ) {
                    ctx1.beginPath();
                    ctx1.arc(0, 0, Math.abs(x) + w/2, 0, Math.PI*2, false); // orbit

                    ctx1.fill();
                    // ctx1.globalCompositeOperation = 'source-over';
                    ctx1.stroke();
                }

                printImg( planets[i].img, x, y, w, h, ctx );

                pos = pos + w/1.5 + 30;

                ctx1.restore();

            }
            ctx1.restore();

            ctx1.save();

            window.requestAnimationFrame(draw);

        }

        function init() {
            loadPlanets();
            window.requestAnimationFrame(draw);
        }

        window.onload = function(){
            init()
        };



    }
}

function canvas_reset( ){
    canvas = document.querySelector('canvas')
    c1 = document.getElementById("canvas1");
    ctx1 = c1.getContext("2d");
    ctx1.clearRect(0, 0, canvas.width, canvas.height);
}