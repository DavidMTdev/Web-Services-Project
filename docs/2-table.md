    Method  OPTION
    Path    /{database}/{table}
    Reponse 200
        {
            'description': 'List of methods',
            'methods': ['GET', 'POST', 'DELETE']
        }

# Création des colonnes de la table
    Method  POST
    Path    /{database}/{table}
    Body    application/json
        {
            'columns': [
                {'id': 'int', 'primary_key': True}, 
                {'titre': 'string'}, 
                {'duree': 'int'}
            ]
        }
    Reponse 201
        {
            'description': 'Columns created',
            'columns': [
                {'id': 'int', 'primary_key': True}, 
                {'titre': 'string'}, 
                {'duree': 'int'}
            ]
        }


# Récupération des infod d'une table
    Method  GET
    Path    /{database}/{table}
    Reponse 200
        {
            'description': 'List of info',
            'count_data': int,
            'count_columns': int
        }

# Suppression d'une table
    Method  DELETE
    Path    /{database}/{table}
    Reponse 200 ou 204
        {
            'description': 'Table deleted',
            'table': 'films'
        }
