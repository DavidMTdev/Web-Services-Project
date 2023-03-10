    Method  OPTION
    Path    /{database}/{table}/datas/{id}
    Reponse 200
        {
            'description': 'List of methods',
            'methods': ['GET', 'POST', 'DELETE']
        }


# Lister les data dans une table
    Method  GET
    Path    /{database}/{table}/datas/{id}
    Reponse 200
        {
            'description': 'Data',
            'data': {
                'id': 1,
                'titre': 'string',
                'duree': 'int',
                'realisateur': 'string'
            }
        }

# Modifier les data dans une table
    Method  PUT
    Path    /{database}/{table}/datas/{id}
    Body    application/json 
        {
            'id': 2,
            'titre': 'string',
            'duree': 'int',
            'realisateur': 'string'
        }
    Reponse 200
        {
            'description': 'Data updated',
            'data': {
                'id': 2,
                'titre': 'string',
                'duree': 'int',
                'realisateur': 'string'
            }
        }

# Supprimer la data dans une table
    Method  DELETE
    Path    /{database}/{table}/datas/{id}
    Reponse 200
        {
            'description': 'Data deleted',
            'data': {
                'id': 1,
                'titre': 'string',
                'duree': 'int',
                'realisateur': 'string'
            }
        }