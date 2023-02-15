import axios from "axios";

const pgFunctions = {

    async getName() {
        await axios.get('http://localhost:3001')
    }


}

export default pgFunctions;