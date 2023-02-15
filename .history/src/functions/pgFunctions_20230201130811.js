import axios from "axios";

const pgFunctions = {

    async getWorld() {
        const world = await axios.get('http://localhost:3001')
        .then(res => {
            console.log("",res);
            return res.data.name;
        })
        .catch(err => {
            console.log(err);
        })
        return world;
    },

    async getName(name){
        const result = await axios.get('http://localhost:3001/' + name)
        .then(res => {
            console.log(res);
            return res.data.name;
        })
        .catch(err => {
            console.log(err);
        })
        return result;
    }


}

export default pgFunctions;