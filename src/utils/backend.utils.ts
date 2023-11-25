import axios from "axios";
import { Value } from "../store/admin/adminSlice";
const ADDRESS = 'http://206.189.182.126:5000/api/v1'
// const ADDRESS = 'http://10.14.29.208:4000/api/v1'
// const ADDRESS = 'http://da-bingo.eu-4.evennode.com/api/v1'

export const loginUser = (name: string, password: string) => {
        return axios.post(ADDRESS + '/users/login', { name, password })
}
// const config = {
//         headers: {
//                 Authorization: 'Bearer ' + localStorage.getItem('access-token')
//         },
// }
export const createGame = (players: number[], percentage: number, betAmount: number, winAmount: number, profit: number, pattern: string) => {
        const payload = {
                players: players,
                amount: betAmount,
                percentage,
                scores: [],
                winamount: winAmount,
                profit,
                pattern
        }
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.post(ADDRESS + '/games', payload, config)
}

export const getGame = (id: string) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.get(ADDRESS + '/games/' + id, config)
}

export const addGameScore = (id: string, score: number) => {
        const config = {
                timeout: 5000, // Set a timeout of 5 seconds
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.put(ADDRESS + '/games/score/' + id, { scores: score }, config)
}

export const resetGameScores = (id: string) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.put(ADDRESS + '/games/' + id, {}, config)
}
export const setGameIsWon = (id: string, winner: number) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.put(ADDRESS + '/games/won/' + id, { winner }, config)
}
export const registerUser = (name: string, password: string, isAdmin: boolean) => {
        const payload = {
                name,
                password,
                isAdmin
        }
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.post(ADDRESS + '/users/register', payload, config)
}

export const deleteUser = (id: string) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.delete(ADDRESS + '/users/' + id, config)
}

export const fetchCashiers = () => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.get(ADDRESS + '/users/cashiers', config)
}

export const fetchAnalytics = () => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.get(ADDRESS + '/users/analytics/getall', config)
}

export const fetchCustomAnalytics = (DateRange = [] as unknown as Value) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.get(ADDRESS + '/users/analytics/getcustom?startdate=' + ((DateRange || [])[0 as keyof Value]) + '&enddate=' + (DateRange || [])[1 as keyof Value], config)
}
export const fetchGames = () => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.get(ADDRESS + '/games/get/games', config)
}

export const fetchHouses = () => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.get(ADDRESS + '/houses', config)
}

export const getHouse = (id: string) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.get(ADDRESS + '/houses/' + id, config)
}

export const createHouse = (name: string, city: string, detail: string, username: string, password: string) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        const payload = { name, city, detail, username, password }
        return axios.post(ADDRESS + '/houses', payload, config)
}

export const deleteHouse = (id: string) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.delete(ADDRESS + '/houses/' + id, config)
}

export const updateHouse = (id: string, name: string, city: string, detail: string, isActive: boolean) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        const payload = { id, name, city, detail, isActive }
        return axios.put(ADDRESS + '/houses/' + id, payload, config)
}