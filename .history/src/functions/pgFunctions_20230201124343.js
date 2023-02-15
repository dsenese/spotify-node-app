import axios from "axios";

const pgFunctions = {

    async getWorld() {
        const result = await axios.get('http://localhost:3001')
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
        const name = await axios.get('http://localhost:3001' + name)
        .then(res => {
            console.log(res);
            return res.data.name;
        })
        .catch(err => {
            console.log(err);
        })
        return name;
    }


}

export default pgFunctions;