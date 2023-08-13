import React from 'react';

function ShowBooks({ books }) {
    return (
        <div>
            <h2>Books List</h2>
            <ul>
                {/* {books.map((book, index) => (
                    <li key={index}> */}
                      <div>  Volume ID: {books.volume_id}, Owner Code: {books.owner_code}</div>
                    {/* </li>
                ))} */}
            </ul>
        </div>
    );
}

export default ShowBooks;
