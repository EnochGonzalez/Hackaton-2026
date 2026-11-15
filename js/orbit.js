/* ============================================================
   orbit.js — mini visualización de la órbita en <canvas>.
   (Idea inspirada en NASA Mission Viz, pero en 2D y muy simple.)
   ============================================================ */
var MC = globalThis.MC = globalThis.MC || {};

MC.orbit = {
  _raf: null,

  stop: function () { if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; } },

  start: function (canvas, orbitId, stations) {
    if (!canvas || !canvas.getContext) return;
    var self = this, ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;
    var R = Math.min(W, H) * 0.20;                       // radio de la Tierra
    var cfg = {
      leo:   { rx: R * 1.55, ry: R * 1.55, speed: 0.040, tilt: 0 },
      polar: { rx: R * 0.55, ry: R * 1.70, speed: 0.032, tilt: 0 },
      geo:   { rx: R * 2.30, ry: R * 2.30, speed: 0.006, tilt: 0 }
    }[orbitId] || { rx: R * 1.6, ry: R * 1.6, speed: 0.03, tilt: 0 };
    var t = 0;

    // Estaciones terrestres: ángulos fijos sobre la superficie
    var stAngles = [-0.9, 2.2, 0.6].slice(0, stations || 1);

    function frame() {
      t += cfg.speed;
      ctx.clearRect(0, 0, W, H);

      // estrellas fijas
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      for (var i = 0; i < 40; i++) {
        var sx = (i * 97.3) % W, sy = (i * 53.7 + 11) % H;
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      // órbita
      ctx.strokeStyle = 'rgba(79,209,255,.35)'; ctx.setLineDash([4, 5]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(cx, cy, cfg.rx, cfg.ry, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);

      // Tierra
      var g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.2, cx, cy, R);
      g.addColorStop(0, '#5aa9ff'); g.addColorStop(1, '#0d3b82');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

      // nave
      var sxp = cx + cfg.rx * Math.cos(t), syp = cy + cfg.ry * Math.sin(t);

      // estaciones y línea de contacto
      var inContact = false;
      stAngles.forEach(function (a) {
        var px = cx + R * Math.cos(a), py = cy + R * Math.sin(a);
        var d = Math.hypot(sxp - px, syp - py);
        var near = d < R * 1.25 || orbitId === 'geo';
        if (near) {
          inContact = true;
          ctx.strokeStyle = 'rgba(74,222,128,.8)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sxp, syp); ctx.stroke();
        }
        ctx.fillStyle = near ? '#4ade80' : '#ffb84f';
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2); ctx.fill();
      });

      // sombra (eclipse): lado opuesto al "sol" (izquierda → sol viene de la izquierda)
      var inShadow = sxp > cx && Math.abs(syp - cy) < R;
      ctx.fillStyle = inShadow ? '#ff5d6c' : '#e6edff';
      ctx.beginPath(); ctx.arc(sxp, syp, 5, 0, Math.PI * 2); ctx.fill();

      // rayos de sol
      ctx.fillStyle = 'rgba(255,184,79,.9)'; ctx.font = '15px sans-serif';
      ctx.fillText('Sol  >>', 8, 22);
      ctx.fillStyle = 'rgba(186,197,223,1)'; ctx.font = '15px sans-serif';
      ctx.fillText(inContact ? 'En contacto con la Tierra' : 'Sin contacto', 8, H - 10);
      if (inShadow) { ctx.fillStyle = '#ff5d6c'; ctx.fillText('En sombra: usa batería', W - 190, H - 30); }

      self._raf = requestAnimationFrame(frame);
    }
    this.stop();
    frame();
  }
};
