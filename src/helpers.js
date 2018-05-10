
export const backendUrl = "http://localhost:8080";

export const putPostHeaders = {
  headers: {
    'Content-Type': 'application/json',
    'dataType': 'JSON',
    'contentType': 'application/json; charset=utf-8'
  },
  credentials: "include",
};

// export function isLoggedIn() {
//   return new Promise((resolve, reject) => {
//     const header = new Headers({ 'Content-Type': 'application/json' });
//     axios.get(`${backendUrl}/currentUser`, { header })
//       .then(user => {
//         console.log(user);
//         if (typeof user.id === 'undefined') {
//           resolve(false);
//         }
//         resolve(user);
//       })
//       .catch(err => {

//         // 401 is the default error for the user
//         // not being logged in on the server
//         if (err.status !== 401) {
//           console.log(err);
//         }
//         resolve(false);
//       })
//   })

// };