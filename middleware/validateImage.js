const allowedDomains = ["images.pexels.com", "cdn.wallrush.com"];

function isValidImageUrl(url) {
    try {
        const parsed = new URL(url);
        return (
            parsed.protocol === "https:" &&
            allowedDomains.some((d) => parsed.hostname.endsWith(d))
        );
    } catch {
        return false;
    }
}

module.exports = function validateImage(req, res, next) {
    const src =
        req.body?.wallpaper?.src?.original ||
        req.body?.src?.original ||
        req.body?.src;

    if (!src || !isValidImageUrl(src)) {
        return res.status(400).json({
            message: "Invalid or unsafe image URL",
        });
    }

    next();
};
