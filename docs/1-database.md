    Method  OPTION
    Path    /{database}
    Reponse 200
        {
            'description': 'List of methods',
            'methods': ['GET', 'POST', 'DELETE']
        }

# Création d'une table
    Method  POST
    Path    /{database}
    Body    application/json
        {
            'table': 'films'
        }
    Reponse 201
        {
            'description': 'Table created',
            'table': 'films'
        }

# Récupération des tables d'une database
    Method  GET
    Path    /{database}
    Reponse 200
        {
            'description': 'List of tables',
            'tables': ['films', 'salles', 'seances']
        }

# Suppression d'une database
    Method  DELETE
    Path    /{database}
    Reponse 200 ou 204
        {
            'description': 'Database deleted',
            'database': 'cinema'
        }