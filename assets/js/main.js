async function getRandomUser(){
    const res = await fetch("https://randomuser.me/api")
    const data = await res.json()
    console.log(data);
   }
   getRandomUser()