import React from 'react';


const Error = (error) => {
  return (
  <div className='error'>
    <h1>{error.error.toString()}</h1>
  </div>
);
}

export default Error;