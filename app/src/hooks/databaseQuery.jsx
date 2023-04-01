
import React from 'react'

const useDatabaseQuery = () => {
  const databasesQuery = useQuery({
    queryKey: ["GET /"],
    queryFn: getDatabases,
    onSuccess: (res) => {
      const newData = res.databases.map((item) => {
        return {
          name: item,
          open: false,
          tables: []
        }
      })
      setData([...newData])
    },  
    initialData: () => {
      return data
    }
  })

}

export default useDatabaseQuery
