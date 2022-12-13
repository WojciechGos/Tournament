const mongoose = require("mongoose")
const Player = require('./Player')
const {NotFoundError} = require('../errors')

const TournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Wproawadź nazwę turnieju'],
        unique: true
    },
    amount_of_players : {
        type: Number,
        required: [true, 'Wprowadź ilość graczy '],
        min : [2, "Nie można stworzyć turnieju z mniejszą ilością graczy niż 2"],
        validate:{
            validator: Number.isInteger,
            message: `{VALUE} nie jest liczbą naturalną`
        }
    },
    start_date : {
        type: Date,
        required: [true, "Wprowadź date rozpoczęcia turnieju"]
    },
    end_date : {
        type: Date
    },
    creator_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Player',
        required: [true, "Wprowaź id założyciela"]
    }
    
})

TournamentSchema.pre('save', async function(){
    const player = await Player.findById(this.creator_id)
    if(!player)
        throw new NotFoundError(`Nie istnieje gracz o id: ${this.creator_id}`)
})

module.exports = mongoose.model('Tournament', TournamentSchema)