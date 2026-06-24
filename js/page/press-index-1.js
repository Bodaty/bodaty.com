    // fx-layer effects
    (function () {
        var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var fine = window.matchMedia('(pointer: fine)').matches;

        var canvas = document.getElementById('dust-bg');
        if (canvas && !reduced) {
            var ctx = canvas.getContext('2d');
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            var W = 0, H = 0, motes = [], running = true;
            var mouse = { x: -9999, y: -9999 };
            function makeMote() {
                var depth = 0.3 + Math.random() * 0.7;
                return {
                    x: Math.random() * W, y: Math.random() * H,
                    depth: depth,
                    r: 0.5 + depth * 1.8,
                    drift: 0.06 + depth * 0.18,
                    sway: Math.random() * Math.PI * 2,
                    swaySpeed: 0.002 + Math.random() * 0.006,
                    twinkle: Math.random() * Math.PI * 2,
                    vx: 0, vy: 0
                };
            }
            function resize() {
                W = window.innerWidth; H = window.innerHeight;
                canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
                canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                var target = Math.max(40, Math.min(140, Math.floor(W * H / 13000)));
                while (motes.length < target) motes.push(makeMote());
                motes.length = target;
            }
            resize();
            window.addEventListener('resize', resize);
            if (fine) {
                window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
                window.addEventListener('mouseout', function () { mouse.x = -9999; mouse.y = -9999; });
            }
            document.addEventListener('visibilitychange', function () {
                running = !document.hidden;
                if (running) requestAnimationFrame(frame);
            });
            function frame() {
                if (!running) return;
                ctx.clearRect(0, 0, W, H);
                for (var i = 0; i < motes.length; i++) {
                    var m = motes[i];
                    m.sway += m.swaySpeed;
                    m.twinkle += 0.02 + m.depth * 0.012;
                    if (mouse.x > -999) {
                        var dx = m.x - mouse.x, dy = m.y - mouse.y;
                        var d2 = dx * dx + dy * dy;
                        if (d2 < 19600 && d2 > 1) {
                            var d = Math.sqrt(d2);
                            var f = (1 - d / 140) * 0.5;
                            m.vx += (dx / d) * f * 0.3 - (dy / d) * f * 0.18;
                            m.vy += (dy / d) * f * 0.3 + (dx / d) * f * 0.18;
                        }
                    }
                    m.vx *= 0.94; m.vy *= 0.94;
                    m.x += Math.sin(m.sway) * 0.22 + m.vx;
                    m.y -= m.drift - m.vy;
                    if (m.y < -8) { m.y = H + 8; m.x = Math.random() * W; }
                    if (m.x < -8) m.x = W + 8; else if (m.x > W + 8) m.x = -8;
                    var alpha = (0.10 + m.depth * 0.38) * (0.6 + 0.4 * Math.sin(m.twinkle));
                    ctx.fillStyle = 'rgba(228, 181, 51, ' + alpha.toFixed(3) + ')';
                    ctx.beginPath();
                    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
                    ctx.fill();
                }
                requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
        }

        if (fine) {
            document.querySelectorAll('.section-card, .highlight, .boilerplate, .facts, .contact-box, .value, .openings').forEach(function (card) {
                card.classList.add('fx-card');
                var spot = document.createElement('div');
                spot.className = 'fx-spot';
                spot.setAttribute('aria-hidden', 'true');
                card.appendChild(spot);
                card.addEventListener('mousemove', function (e) {
                    var r = card.getBoundingClientRect();
                    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
                });
            });
        }
    })();
