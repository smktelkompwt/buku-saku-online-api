db.createUser(
    {
        user : "yourusername",
        pwd : "yourpassword",
        roles : [
            {
                role : "readWrite",
                db : "buku-saku"            
            }        
        ]    
    }
)