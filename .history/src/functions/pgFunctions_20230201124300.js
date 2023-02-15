import axios from "axios";

const pgFunctions = {

    async getWorld() {
        const name = await axios.get('http://localhost:3001')
        .then(res => {
            console.log(res);
            return res.data.name;
        })
        .catch(err => {
            console.log(err);
        })
        return name;
    },

    async getName(name){
        await axios.get('http://localhost:3001/')
    }


}

export default pgFunctions;