const generateMessage = (name,message)=>{

    return{
        name,
        message,
        createdAt : new Date().getTime()
    }

}

module.exports={generateMessage}