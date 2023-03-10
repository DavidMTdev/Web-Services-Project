    Method  OPTION
    Path    /{database}/{table}/columns
    Reponse 200
        {
            'description': 'List of methods',
            'methods': ['GET', 'POST']
        }


# Ajouter une colonne dans table
    Method  POST
    Path    /{database}/{table}/columns
    Body    application/json 
        {
            'name': 'string', 'type': 'string'
        }
    Reponse 201
        {
            'description': 'Column added',
            'column': {'name': 'string', 'type': 'string'}
        }


# Récupération des colonnes d'une table
    Method  GET
    Path    /{database}/{table}/columns
    Reponse 200
        {
            'description': 'List of columns',
            'columns': [
                {'id': 'int', 'primary_key': True},
                {'titre': 'string'},
                {'duree': 'int'},
                {'realisateur': 'string'}
            ]
        }
        