


module.exports = {
   
    async index(request, response) {
        
       const request = request.body
       
        const ola = 'Bem vindo!!!!'


        return response.json(ola);
    },

    async delete(request, response){
        const ola = 'deletado!!!!'


        return response.json(ola);

    }
}