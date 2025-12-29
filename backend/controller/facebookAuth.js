const axios = require("axios");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("../model/user")(sequelize, DataTypes);

exports.facebookAuth = async (req, res) => {
    try {
        const { code } = req.body;

        // 1. Exchange code for access token
        const tokenRes = await axios.get(
            "https://graph.facebook.com/v18.0/oauth/access_token",
            {
                params: {
                    client_id: process.env.FACEBOOK_APP_ID,
                    client_secret: process.env.FACEBOOK_APP_SECRET,
                    redirect_uri: "http://localhost:5173/facebook-callback",
                    code,
                },
            }
        );

        const accessToken = tokenRes.data.access_token;

        // 2. Get user info
        const userRes = await axios.get(
            "https://graph.facebook.com/me",
            {
                params: {
                    fields: "id,name,email",
                    access_token: accessToken,
                },
            }
        );

        const { id, name, email } = userRes.data;

        let user = await User.findOne({ where: { email } });

        if (!user) {
            user = await User.create({
                name,
                email,
                facebook_id: id,
                authType: "facebook",
            });
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ success: true, token });
    } catch (err) {
        console.error("Facebook Auth Error:", err);
        res.status(401).json({ message: "Facebook login failed" });
    }
};
