import axios from "axios";

const pgFunctions = {

    async getWorld() {
        var result = await axios.get('http://localhost:3001')
        .then(res => {
            console.log(res);
            return res.data.name;
        })
        .catch
    },

    async getName(name){
        await axios.get('http://localhost:3001/')
    }


}

export default pgFunctions;