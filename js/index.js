
/**
 * TODO:
 * - convert from click keyboard controls (left right up down)
 * - Multiple users (e.g. ghost users so you can see other people playing - no real point but might be fun to implement)
 */
(function() {

    // the canvas context
    var ctx = undefined;

    // store some private functions
    var priv = {

        // data for our box
        box: {
            x: undefined,
            y: undefined,
            h: 20,
            w: 20,
            moveX: 0,
            moveY: 0,
            speed: 2
        },

        // data for the columns
        columns: {
            speed: 1,
            list: []
        },

        // the user's current score
        score: 0,

        // initialize the game
        init: function() {

            // add the canvas element
            var canvas = document.createElement('canvas');
            canvas.id = "canvas";
            canvas.style.position = "absolute";
            canvas.style.top = "0px";
            canvas.style.left = "0px";
            document.body.appendChild(canvas);
            priv.reset();

            // start the game cycle
            setInterval(priv.cycle, 0);
        },

        // handle a cycle of the game
        cycle: function() {

            // move the box
            priv.box.y += priv.box.moveY * priv.box.speed;
            priv.box.x += priv.box.moveX * priv.box.speed;

            // generate the columns as needed
            if(priv.columns.list.length === 0) {
                priv.columns.list.unshift(priv.generate());
            } else {
                var dist = ctx.canvas.width - (priv.columns.list[0].x + priv.columns.list[0].w);
                if(dist >= 150) {
                    if(Math.random() > .995 || dist > 400) {
                        priv.columns.list.unshift(priv.generate());
                    }
                }
            }

            // check for collisions
            for(var i = 0; i < priv.columns.list.length; ++i) {
                var col = priv.columns.list[i];
                // check if the box has entered the column on the x axis
                if(priv.box.x + priv.box.w >= col.x && priv.box.x <= col.x + col.w) {
                    // check if the box has entered the top or bottom column on the y axis
                    if(priv.box.y <= col.th || priv.box.y + priv.box.h >= ctx.canvas.height - col.bh) {
                        priv.reset();
                    }
                }
            }

            // clear the canvas in preparation for drawing
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // go through and draw each column (removing ones that are off screen)
            for(var i = priv.columns.list.length - 1; i >= 0; --i) {
                var col = priv.columns.list[i];
                col.x -= priv.columns.speed;
                if(col.x < -col.w) {
                    // remove since we are offscreen
                    priv.columns.list.splice(i, 1);
                } else {
                    // draw since we are still onscreen
                    ctx.fillRect(col.x, 0, col.w, col.th);
                    ctx.fillRect(col.x, ctx.canvas.height - col.bh, col.w, col.bh);
                }
            }

            // draw the main canvas
            ctx.fillRect(priv.box.x, priv.box.y, priv.box.w, priv.box.h);

            // draw the score and increase it
            ctx.fillText(priv.score++, 20, 20);
        },

        // generate the information for a new column
        generate: function() {
            var size = Math.floor(Math.random() * (priv.box.h * 15)) + (priv.box.h * 2);
            var th = Math.floor(Math.random() * (ctx.canvas.height - size));
            var bh = (ctx.canvas.height - th) - size;
            return {
                x: ctx.canvas.width,
                w: 50,
                h: size,
                th: th,
                bh: bh,
            };
        },

        // reset the game back to the initial state
        reset: function() {
            if(ctx === undefined) {
                ctx = document.getElementById('canvas').getContext('2d');
                ctx.canvas.width = window.innerWidth;
                ctx.canvas.height = window.innerHeight;
            }
            priv.box.x = (window.innerWidth / 4) - (priv.box.w / 2);
            priv.box.y = (window.innerHeight / 2) - (priv.box.h / 2);
            priv.columns.list = [];
            priv.score = 0;
        }
    };

    // initialize the game
    window.addEventListener('load', priv.init, false);

    window.addEventListener('keydown', function(e) {
        var code = e.keyCode || e.which;
        if(code === 37 || code === 39) {
            priv.box.moveX = code === 37 ? -1 : code === 39 ? 1 : 0;
        }
        if(code === 38 || code === 40) {
            priv.box.moveY = code === 38 ? -1 : code === 40 ? 1 : 0;
        }
    });

    window.addEventListener('keyup', function(e) {
        var code = e.keyCode || e.which;
        if(code === 37 || code === 39) priv.box.moveX = 0;
        if(code === 38 || code === 40) priv.box.moveY = 0;
    });

    // handle movement
    window.addEventListener('mousedown', function() { priv.box.move = true; }, false);
    window.addEventListener('mouseup', function() { priv.box.move = false }, false);
})();
