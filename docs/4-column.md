    Method  OPTION
    Path    /{database}/{table}/columns/{column}
    Reponse 200
        {
            'description': 'List of methods',
            'methods': ['GET', 'PUT', 'DELETE']
        }

# Récupération d'une colonne
    Method  GET
    Path    /{database}/{table}/columns/{column}
    Reponse 200
        {
            'description': 'List of columns',
            'column': {'titre': 'string'}
        }

# Modification d'une colonne
    Method  PUT
    Path    /{database}/{table}/columns/{column}
    Body    application/json
        {
            'name': 'title', 'type': 'string'
        }
    Reponse 200
        {
            'description': 'Column modified',
            'column': {'title': 'string'}
        }

# Suppression d'une colonne
    Method  DELETE
    Path    /{database}/{table}/columns/{column}
    Reponse 200 ou 204
        {
            'description': 'Column deleted',
            'column': 'titre'
        }
