const CookieTokenService = require('../services/cookieTokenService');

const getAllCookieToken = async (req, res, next) => {
    try {
        const cookietokens = await CookieTokenService.getAllCookies();
        res.json({ success: true, data: cookietokens });
    } catch (err) { next(err); }
}

const createCookieToken = async (req, res, next) => {
    try {
        const { cookie, token } = req.body;
        if (!cookie || !token) return res.status(400).json({ success: false, message: 'Cookie and token required' });
        const newCookieToken = await CookieTokenService.createCookieToken({ cookie, token });
        res.status(201).json({ success: true, data: newCookieToken });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Cookie already exists' });
        }
        next(err);
    }
};


const deleteCookieTokenById = async (req, res, next) => {
    try {
        const result = await CookieTokenService.deleteCookieTokenById(Number(req.params.id));
        if (!result) return res.status(404).json({ success: false, message: 'Cookie not found' });
        res.json({ success: true, message: 'Cookie deleted' });
    } catch (err) { next(err); }
}




const updateCookieTokenById = async (req, res, next) => {
    try {
        const { id } = req.params; // lấy id từ URL
        const { status, isRunning } = req.body;

        const updated = await CookieTokenService.updateCookieTokenById(id, {  status, isRunning });

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Update Cookie Token Fail' });
        }

        res.json({ success: true, message: 'Update Cookie Token Success', data: updated });
    } catch (err) {
        
    }
};

const deleteAllCookieToken = async (req, res) => {
    try {
        await CookieTokenService.deleteAllCookieToken();
    res.status(200).json({success: true, message: "All Cookietokens deleted successfully"});
    } catch {}
}





module.exports = {
    getAllCookieToken,
    createCookieToken,
    deleteCookieTokenById,
    updateCookieTokenById,
    deleteAllCookieToken
};