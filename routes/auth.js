const router = require("express").Router();
// const passport = require("passport");
const { User } = require('../models/users');
const { GameState } = require('../models/gameState');
const mongoose = require('mongoose');
const { default: jwtDecode } = require("jwt-decode");
require('dotenv').config()

router.get("/login", async (req, res) => {
	try{
		const token = req.header('auth-token')
		const user = jwtDecode(token)
		const email = user.email
		let user1 = await User.findOne({ email: email });
		if(!user1) {
			user1 = new User({
				name: user.name,
				email: user.email,
				highScore: -1
			})
			await user1.save();
			// console.
		}
		let gameState = await GameState.findOne({ email: user.email}, { state: 1, turns: 1 })
		return res.status(200).json({
			gameState,
			highScore: user1.highScore,
			message: "success"
		})
	} catch(err) {
		console.log("Login error ", err)
		res.status(500).json({ error: true, message: "some error occured!" });
	}
});

router.get("/logout", (req, res) => {
	try {
	    req.logout();
		return res.status(200).json({ message: "success" })
	} catch (err) {
		console.log("Logout error ", err);
		return res.status(500).json({ message: "some error occured!" })
	}
});

module.exports = router;