const fs = require('fs')

class FileManager{
    constructor(){}

    async loadItems(){
        if(fs.existsSync(process.cwd() + '/src/files/productsDB.json')){
            const data = await fs.promises.readFile(
                process.cwd() + '/src/files/productsDB.json'
            )
            const newProducts = JSON.parse(data)
            return newProducts
        }
        return 'el archivo no existe'
    }
}

module.exports = FileManager