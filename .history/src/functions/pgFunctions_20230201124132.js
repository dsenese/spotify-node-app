import axios from "axios";

const pgFunctions = {

    async getWorld() {
        await axios.get('http://localhost:3001')
        .then(res => {
            console.log()
        })
    },

    async getName(name){
        await axios.get('http://localhost:3001/')
    }


}

export default pgFunctions;