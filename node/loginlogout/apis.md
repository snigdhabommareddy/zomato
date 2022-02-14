/*****Get all user******/
(GET)> https://zomatojwt.herokuapp.com/api/auth/users


/*******register*********/
(POST)> https://zomatojwt.herokuapp.com/api/auth/register
(body)=>{ "name":"siddu","email":"siddu@gmail.com","password":"1987866","role":"Admin"}

/******Login***********/
(POST)>https://zomatojwt.herokuapp.com/api/auth/login
(response)=>{auth:true,token:'abc'}


/********userinfo********/
(GET)> https://zomatojwt.herokuapp.com/api/auth/userinfo
(header) =>{'x-access-token':'token value from login'}