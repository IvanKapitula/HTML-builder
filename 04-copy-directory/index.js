const fs = require('fs/promises');
const { readdir } = require('fs/promises');
const path = require('path');

async function copyDir(){
    try{
        await fs.rm(path.join(__dirname, 'files-copy'), {force:true,recursive:true});
        await fs.mkdir(path.join(__dirname, 'files-copy'))

        const oldFolder = await readdir(path.join(__dirname, 'files'),{withFileTypes:true})

        for(let el of oldFolder){

            const fileOfName = el.name;
            if(el.isFile()){
                await fs.copyFile(
                    (path.join(path.join(__dirname, 'files'),fileOfName)),
                    (path.join(path.join(__dirname, 'files-copy'),fileOfName))
                )
            }else{
                await fs.mkdir(path.join(path.join(__dirname, 'files-copy')),fileOfName)

            }
        }       
        console.log('Copying was successful!');
    }catch(err){
        console.log('Oh my gosh', err);
    }
}
copyDir()