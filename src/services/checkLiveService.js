const axios = require("axios");

const checkFacebookLive = async (uid) => {
  try {
    const url = `https://graph.facebook.com/${uid}/picture?redirect=false`;
    const response = await axios.get(url);
    const data = response.data;

    // Nếu có field height thì coi như live
    if (data && data.data && data.data.height) {
      return { uid, status: "live" };
    } else {
      return { uid, status: "die" };
    }
  } catch (error) {
    return { uid, status: "die" }; // mặc định die nếu lỗi
  }
};

const checkMultipleFacebookLive = async (uids) => {
  const promises = uids.map((uid) => checkFacebookLive(uid));
  return Promise.all(promises);
};

module.exports = { checkFacebookLive, checkMultipleFacebookLive  };
