import axios from "axios";
import { Value } from "../store/admin/adminSlice";
const ADDRESS = 'http://lucky-serve.eu-4.evennode.com/api/v1'
// const ADDRESS = 'http://localhost:4000/api/v1'
// const ADDRESS = 'http://lucky-bingo-backend.eu-4.evennode.com/api/v1'

export const loginUser = (name: string, password: string) => {
        return axios.post(ADDRESS + '/users/login', { name, password })
}
// const config = {
//         headers: {
//                 Authorization: 'Bearer ' + localStorage.getItem('access-token')
//         },
// }

// export const createGame = (id: string, players: number[], percentage: number, betAmount: number, winAmount: number, profit: number, pattern: string) => {
//         const payload = {
//                 gameid: id,
//                 players: players,
//                 amount: betAmount,
//                 percentage,
//                 scores: [],
//                 winamount: winAmount,
//                 profit,
//                 pattern
//         }
//         const config = {
//                 timeout: 6000,
//                 headers: {
//                         Authorization: 'Bearer ' + localStorage.getItem('access-token'),
//                 },
//         }
//         return axios.post(ADDRESS + '/games', payload, config)
// }

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
                timeout: 3000,
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token'),
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

export const fetchAllUsers = () => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.get(ADDRESS + '/users/all', config)
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

export const getRoom = (id: string) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        return axios.get(ADDRESS + '/rooms/' + id, config)
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

export const buyCartela = (roomId: string, cartelaNumber: number) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        const payload = { numberselected: cartelaNumber }
        return axios.put(ADDRESS + '/rooms/buy/' + roomId, payload, config)
}

export const fetchRooms = () => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }

        return axios.get(ADDRESS + '/rooms', config)
}

export const hostGame = (gameid: string) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        // const payload = { pattern, winAmount, betAmount }
        return axios.post(ADDRESS + '/rooms', { gameid }, config)
}

export const startGameAPI = (roomID: string, winAmount: number, betAmount: number, pattern: string) => {
        const config = {
                headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('access-token')
                },
        }
        const payload = { winAmount, betAmount, pattern }
        return axios.put(ADDRESS + '/rooms/start/' + roomID, payload, config)
}