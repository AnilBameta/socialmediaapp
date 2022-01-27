import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
export default function Home() {
    const {loading, data} =useQuery(FETCH_POSTS_QUERY);
    if(data) {
        console.log(data)
    }
    return(
        
        <h1>Hello</h1>
        
    )
}
const FETCH_POSTS_QUERY = gql`
{
    getPosts{
    id body createdAt username 
    likes{
    username
    }
    commentCount
    comments{
    id username createdAt body
    }
    }
}
`