import axios from "axios";

const pgFunctions = {

    async getWorld() {
        await axios.get('http://localhost:3001')
    },

    async getName(){
        await axios.get('http://localhost:3001/')
    }


}

export default pgFunctions;