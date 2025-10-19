const CookieTokenModel = require("../models/CookieTokenModel");

const getAllCookies = async () => {
    const rows = await CookieTokenModel.findAll();
    // trả về plain objects giống rows từ mysql2
    return rows.map(r => r.get({ plain: true }));
};

const createCookieToken = async ({ cookie, token }) => {
    const newRow = await CookieTokenModel.create({ cookie, token, status: true, isRunning: true });
    const plain = newRow.get({ plain: true });
    return { id: plain.id, cookie: plain.cookie, token: plain.token };
};

const deleteCookieTokenById = async (id) => {
    const deletedCount = await CookieTokenModel.destroy({ where: { id } });
    return deletedCount;
}


const updateCookieTokenById = async (id, {  status, isRunning }) => {
    const row = await CookieTokenModel.findByPk(id);
    if (!row) return null;
    // chỉ cập nhật những trường được truyền (bảo toàn dữ liệu)
    const toUpdate = {};
    if (status !== undefined) toUpdate.status = status;
    if (isRunning !== undefined) toUpdate.isRunning = isRunning;
    await row.update(toUpdate);
    return row.get({ plain: true });
};


const deleteAllCookieToken = async () => {
    await CookieTokenModel.destroy({ truncate: true, restartIdentity: true});

    return true;
}


module.exports = {
    getAllCookies,
    createCookieToken,
    deleteCookieTokenById,
    updateCookieTokenById,
    deleteAllCookieToken
};