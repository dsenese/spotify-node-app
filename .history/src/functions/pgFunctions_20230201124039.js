import axios from "axios";

const pgFunctions = {

    async getWorld() {
        await axios.get('http://localhost:3001')
    },

    async getName(){
        
    }


}

export default pgFunctions;