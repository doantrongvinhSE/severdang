const { checkFacebookLive, checkMultipleFacebookLive } = require("../services/checkLiveService");
const axios = require("axios");

const checkLive = async (req, res) => {
    try {
        const { uid } = req.params;

        if (!uid) {
            return res.status(400).json({ success: false, message: "UID required" });
        }

        const result = await checkFacebookLive(uid);

        return res.json({ success: true, ...result });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const checkLives = async (req, res) => {
    try {
      const response = await axios.get("http://localhost:8080/cookies", { timeout: 5000 });
  
      if (!response.data || !response.data.data) {
        return res.status(500).json({ success: false, message: "Invalid cookies API response" });
      }
  
      const cookies = response.data.data;
      const uidRegex = /c_user=(\d+)/;
      const uidWithIds = cookies
        .map(item => {
          const match = item.cookie.match(uidRegex);
          return match ? { id: item.id, uid: match[1], oldStatus: item.status } : null;
        })
        .filter(item => item !== null);
  
      if (uidWithIds.length === 0) {
        return res.status(404).json({ success: false, message: "No UID found in cookies" });
      }
  
      // Check nhiều UID
      const uids = uidWithIds.map(i => i.uid);
      const results = await checkMultipleFacebookLive(uids);
  
      // Update status nếu khác
      for (const item of uidWithIds) {
        const result = results.find(r => r.uid === item.uid);
        if (result) {
          const newStatus = result.status === "live"; // live = true, die = false
          if (item.oldStatus !== newStatus) {
            try {
              await axios.put(
                `http://localhost:8080/cookies/${item.id}`,
                { status: newStatus },
                { timeout: 10000 }
              );
            } catch (err) {
            }
          } else {
          }
        }
      }
  
      return res.json({ success: true, results });
  
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  
module.exports = { checkLive, checkLives };
