const fs = require('fs');
module.exports = uploadBase64;

function uploadBase64(data) {
      
    const path = './uploads/'+Date.now()+'.png'
 
    const imgdata = data;

    // to convert base64 format into random filename
    const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    try {
        fs.writeFileSync(path, base64Data,  {encoding: 'base64'});  
        return path;      
    } catch (error) {
        return error
    }
}