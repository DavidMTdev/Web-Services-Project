    Method  OPTION
    Path    /{database}/{table}/datas
    Reponse 200
        {
            'description': 'List of methods',
            'methods': ['GET', 'POST', 'DELETE']
        }

# Ajouter une ligne dans une table
    Method  POST
    Path    /{database}/{table}/datas
    Body    application/json 
        {
            'id': 1,
            'titre': 'string',
            'duree': 'int',
            'realisateur': 'string'
        }
    Reponse 201
        {
            'description': 'Data added',
            'data': {
                'id': 1,
                'titre': 'string',
                'duree': 'int',
                'realisateur': 'string'
            }
        }

# Lister les lignes d'une table
    Method  GET
    Path    /{database}/{table}/datas
    Reponse 200
        {
            'description': 'List of data',
            'data': [
                {
                    'id': 1,
                    'titre': 'string',
                    'duree': 'int',
                    'realisateur': 'string'
                },
                {
                    'id': 2,
                    'titre': 'string',
                    'duree': 'int',
                    'realisateur': 'string'
                }
            ]
        }

# Supprimer les lignes dans une table
    Method  DELETE
    Path    /{database}/{table}/datas
    Reponse 200
        {
            'description': 'Data deleted',
            'data': [
                {
                    'id': 1,
                    'titre': 'string',
                    'duree': 'int',
                    'realisateur': 'string'
                },
                {
                    'id': 2,
                    'titre': 'string',
                    'duree': 'int',
                    'realisateur': 'string'
                }
            ]
        }
