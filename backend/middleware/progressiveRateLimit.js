const createProgressiveRateLimit = () => {
  const clients = new Map();

  const MAX_ATTEMPTS = 5;
  const FIRST_HOLD = 30 * 1000;
  const SECOND_HOLD = 2 * 60 * 1000;

  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || "unknown";

    let data = clients.get(ip) || {
      attempts: 0,
      stage: 0,
      blockedUntil: 0,
      lastSeen: now,
    };

    data.lastSeen = now;

    // Abhi lock active hai
    if (data.blockedUntil > now) {
      const retryAfter = Math.ceil((data.blockedUntil - now) / 1000);

      res.set("Retry-After", String(retryAfter));

      return res.status(429).json({
        success: false,
        message: "Too many attempts.",
        retryAfter,
      });
    }

    // Lock expire hone par attempts reset karo,
    // lekin next lock ka stage preserve rakho.
    if (data.blockedUntil !== 0) {
      data.attempts = 0;
      data.blockedUntil = 0;
    }

    clients.set(ip, data);

    res.once("finish", () => {
      const current = clients.get(ip);
      if (!current) return;

      current.lastSeen = Date.now();

      // Failed client request count karo.
      if (
        res.statusCode >= 400 &&
        res.statusCode < 500 &&
        res.statusCode !== 429
      ) {
        current.attempts += 1;

        if (current.attempts >= MAX_ATTEMPTS) {
          const hold = current.stage === 0 ? FIRST_HOLD : SECOND_HOLD;

          current.stage = current.stage === 0 ? 1 : 2;
          current.attempts = 0;
          current.blockedUntil = Date.now() + hold;
        }

        clients.set(ip, current);
      } else if (res.statusCode < 400) {
        // Successful login par limiter state reset karo.
        clients.delete(ip);
      } else {
        clients.set(ip, current);
      }
    });

    next();
  };
};

module.exports = createProgressiveRateLimit;
