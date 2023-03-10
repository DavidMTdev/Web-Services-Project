    Method  OPTION
    Path    /
    Reponse 200
        {
            'description': 'List of methods',
            'methods': ['GET', 'POST']
        }

# Creaction d'une database
    Method  POST 
    Path    /
    Body    application/json 
        {
            'database': 'cinema'
        }
    Reponse 201
        {
            'description': 'Database created',
            'database': 'cinema'
        }


# Récupération des database
    Method  GET 
    Path    /
    Reponse 200
        {
            'description': 'List of databases',
            'databases': ['cinema']
        }