const users = []

// addUser removeUser , getUser , getUsersInRoom

const addUser = ({id,username,room})=>{
    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data
    if(!username || !room){
        return {
            error : 'Username and Room required!'
        }
    }

    // check existing user
    const existingUser = users.find((user)=>{
        return user.username === username && user.room === room
    })

    //validate username
    if(existingUser){
        return {
            error : 'Username is use!'
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id )

    if(index!==-1){
        return users.splice(index,1 )
    }
}

const getUser = (id)=> users.find((user)=> user.id === id )

const getUsersInRoom = (room) => {
    const usersInRoom = users.filter((user)=>{
        return user.room === room
    })
    return usersInRoom
}

module.exports = {
    getUsersInRoom,
    getUser,
    addUser,
    removeUser
}