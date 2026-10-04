const { v4: uuidv4 } = require('uuid');

const trackSession = (req, res, next) => {
    // 1. Try to get session_id from headers or cookies
    let sessionId = req.headers['x-session-id'] || req.cookies?.feelfibre_session_id;

    // 2. If not present, check if we can generate one
    if (!sessionId) {
        sessionId = uuidv4();
        // Set cookie for frontend (httpOnly: false so JS can read if needed)
        res.cookie('feelfibre_session_id', sessionId, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: false,
            path: '/'
        });
    }

    // 3. Attach to req object for tracking functions
    req.sessionId = sessionId;

    // Also send back in header so frontend can catch it if cookies fail
    res.setHeader('x-session-id', sessionId);

    next();
};

module.exports = trackSession;
