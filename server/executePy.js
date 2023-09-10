const { exec } = require("child_process");
const multer= require('multer');
const executeUrl= require("./codes")
const executePy=(filepath)=>{
    return new Promise((resolve,reject)=>{
        exec(
            `python ${filepath}`,
            (error,stdout,stderr)=>{
                error && reject({error,stderr});
                stderr && reject(stderr);
               resolve(stdout);
            }

        );
    });
    
};
module.exports={
    executePy,
};