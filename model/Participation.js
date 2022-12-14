const mongoose = require('mongoose')
const Tournament = require('./Tournament')
const Player = require('./Player')
const { NotFoundError } = require('../errors')

const ParticipationSchema = mongoose.Schema({
    player_id : {
        type: mongoose.Types.ObjectId,
        required: [true, "Id gracza jest wymagane"],
        ref:'Player'
    },
    tournament_id:{
        type : mongoose.Types.ObjectId,
        required: [true, "Id turnieju jest wymagane"],
        ref: 'Tournament'
    }
})

ParticipationSchema.pre('save', async function(){
    const tournament = await Tournament.findById(this.tournament_id)
    if(!tournament)
        throw new NotFoundError(`Nie znaleziono turnieju o id: ${this.tournament_id}`)

    const player = await Player.findById(this.player_id)
    if(!player)
        throw new NotFoundError(`Nie znaleziono gracza o id: ${this.player_id}`)
})

module.exports = mongoose.model('Participation', ParticipationSchema)