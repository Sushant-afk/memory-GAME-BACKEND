const router = require("express").Router();
const { User } = require('../models/users');
const { GameState } = require('../models/gameState');
const mongoose = require('mongoose')
const { default: jwtDecode } = require("jwt-decode");

router.get('/prev-state', async (req, res) => {
    try {
        const token = req.header('auth-token')
		const user = jwtDecode(token)
        let gameState = await GameState.findOne({ email: user.email }, { state: 1, turns: 1, id: 1,  _id: -1 })
        return res.status(200).json({ gameState })
    } catch (err) {
        console.log(err)
        return res.status(200).json({ message: "errorrrr!!!!" })
    }
})

router.post('/save-state', async (req, res) => {
    try {
        const token = req.header('auth-token')
		const user = jwtDecode(token)
        const { state, turns } = req.body;
        let completed = true;
        for(let i = 0; i < state.length; ++i) if(!state[i].flipped) completed = false;
        if(state.length == 12 && completed) {
            await GameState.deleteOne({ email: user.email });
            let _user = await User.findOne({ email: user.email });
            if(_user.highScore == -1 || _user.highScore > turns)
               await User.updateOne({ email: user.email }, { highScore: turns })
               return res.status(200).json({
                message: 'success',
                gameState: null
               })
        } else {
            let gameState = await GameState.findOneAndUpdate({ email: user.email }, { state: state, turns: turns }, { upsert: true, new : true });
            return res.status(200).json({gameState})
        }

    } catch (err) {
        console.log("save-state ", err);
        return res.status(500).json({
            message: 'some server side error occured!'
        })
    }
});


router.post('/save-turns', async (req, res) => {
    try {
        const token = req.header('auth-token')
		const user = jwtDecode(token)
        const { turns } = req.body;
        await GameState.findOneAndUpdate({ email: user.email }, { turns: turns }, { upsert: true });
        console.log("saving turns...")
        return res.status(200).json({
            message: 'success'
        })
    } catch (err) {
        console.log("save-turns ", err);
        return res.status(500).json({
            message: 'some server side error occured!'
        })
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        let l1 = await User.find({ highScore: { $ne: -1 } }).sort({ highScore: 1 })
        let l2 = await User.find({ highScore: -1 }).sort({ highScore: 1 })
        let leaders = [...l1, ...l2].map((leader) => {
            let temp = {};
            temp.highScore = leader.highScore == -1 ? "NILL" : leader.highScore;
            temp.name = leader.email == req.user?.email ? "You" : leader.name;
            return temp;
        })
        return res.status(200).json({
            leaders
        })
    } catch (err) {
        console.log("leaderboard ", err);
        return res.status(500).json({
            message: 'some server side error occured!'
        })
    }
});

module.exports = router;