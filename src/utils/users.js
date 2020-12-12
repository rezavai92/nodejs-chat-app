

const users =[]

// getUser , removeUser , getTotalUserInRoom, addUser


// adding user

function addUser ({name,room,id}){


    //validating empty user and empty room

    if (!name || !room){

        return {error : "empty room or username is not allowed "};
    }

    name= name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // checking existing user


    const existingUser = users.find((user)=>{return user.name === name && user.room === room });

    console.log(existingUser)
    //validating user

    if(existingUser){

        return {error:"user already exists with this name"}
    }


    
    //store user 
    const user = {name,room,id}
    users.push(user)
    //console.log(user)
    return {user};


}

// remove user from room
// no need room information as every session id will be unique no matter which room a user belong to
// did not use filter , cause filter will still run even after finding the matched item
// findIndex is a bit faster

function removeUser (id){

   
   const removableIndex= users.findIndex((u)=>{
        return u.id === id
    })

    if(removableIndex!=-1){
        const removedUser =  users.splice(removableIndex,1)[0];
        console.group(removedUser);
        return removedUser;

    }
   
    return null;

    
}

// get a user 

function getUser (id){

    const user = users.find((u)=>{return u.id===id});

    return user;
}


// get total user in room


function getTotalUsers (room){


    
    room = room.trim().toLowerCase()
   let usersInRoom= users.filter((u)=>{return u.room===room});

   
   return usersInRoom;
}




module.exports={

    addUser,
    removeUser,
    getTotalUsers,
    getUser
}