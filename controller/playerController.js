const Player = require('../model/Player')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {
    BadRequestError,
    NotFoundError
} = require('../errors')

const register = async (req, res)=>{

    const player = await Player.create({...req.body})

    if(!player)
        throw new BadRequestError("Niepoprawne dane")

    res.status(StatusCodes.CREATED).json(player)
}

const login = async (req, res)=>{
    const {nickname, password} = req.body

    if(!nickname || !password)
        throw new BadRequestError('Musisz podać nickname i hasło')
    const player = await Player.findOne({ nickname })
    if (!player) 
        throw new UnauthenticatedError('Nie prawidłowe dane logowania')
    
    const isPasswordCorrect = await player.comparePassword(password)

    if (!isPasswordCorrect) 
        throw new UnauthenticatedError('Nie prawidłowe dane logowania')
        

    const token = player.createJWT()
    res.status(StatusCodes.OK).json({ player: { name: player.name }, token })

}

const getPlayers = async (req, res)=>{
    let query =  Player.find()

    query = getPublicData(query)

    const players = await query    

    res.status(StatusCodes.OK).json(players)
}
const getPlayer = async (req, res)=>{
    const id = req.params.id
    let query = Player.findById(id)

    query = getPublicData(query)

    if(req.user === id){
        query = query.select('email')
    }
    const player = await query    

    if(!player){
        console.log("smt")
        throw new NotFoundError(`Gracz o id: ${id} nie istnieje`)
    }

    res.status(StatusCodes.OK).json(player)
}

const getPublicData = async (query)=>{
    return query.select(['nickname', 'first_name', 'last_name'])
}

module.exports = {
    getPlayer,
    getPlayers,
    register,
    login
}