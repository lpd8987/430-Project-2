(()=>{var e={603:e=>{const t=(e,t)=>{let a=document.getElementById("errorMessage");for(const e of t)document.getElementById(`${e}`).classList.add("is-danger");a.textContent=e,a.style.display="block"};e.exports={handleError:t,sendPost:async(e,a,s)=>{const r=await fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)}),n=await r.json();n.error&&t(n.error,[]),n.redirect&&(window.location=n.redirect),s&&s(n)},hideError:e=>{document.getElementById("errorMessage").style.display="none";for(const t of e)document.getElementById(`${t}`).classList.remove("is-danger")}}}},t={};function a(s){var r=t[s];if(void 0!==r)return r.exports;var n=t[s]={exports:{}};return e[s](n,n.exports,a),n.exports}(()=>{const e=a(603),t=t=>{const a=["user","pass"];t.preventDefault(),e.hideError(a);const s=t.target.querySelector("#user").value,r=t.target.querySelector("#pass").value,n=t.target.querySelector("#_csrf").value;return s&&r?(e.sendPost(t.target.action,{username:s,pass:r,_csrf:n}),!1):(e.handleError("Username or password is empty!",a),!1)},s=t=>{const a=["user","pass","pass2"];t.preventDefault(),e.hideError(a);const s=t.target.querySelector("#user").value,r=t.target.querySelector("#pass").value,n=t.target.querySelector("#pass2").value,c=t.target.querySelector("#_csrf").value;return s&&r&&n?r!==n?(e.handleError("Passwords do not match",a),!1):(e.sendPost(t.target.action,{username:s,pass:r,pass2:n,_csrf:c}),!1):(e.handleError("All fields are required!",a),!1)},r=e=>React.createElement("form",{id:"loginForm",name:"loginForm",onSubmit:t,action:"/login",method:"POST",className:"mainForm box"},React.createElement("h3",{className:"title is-3"},React.createElement("u",null,"Login")),React.createElement("label",{className:"label",htmlFor:"username"},"Username: "),React.createElement("input",{className:"input",id:"user",type:"text",name:"username",placeholder:"username"}),React.createElement("label",{className:"label",htmlFor:"pass"},"Password: "),React.createElement("input",{className:"input",id:"pass",type:"password",name:"pass",placeholder:"password"}),React.createElement("input",{id:"_csrf",type:"hidden",name:"_csrf",value:e.csrf}),React.createElement("input",{className:"formSubmit button mt-3 is-success",type:"submit",value:"Sign in"})),n=e=>React.createElement("form",{id:"signupForm",name:"signupForm",onSubmit:s,action:"/signup",method:"POST",className:"mainForm box"},React.createElement("h3",{className:"title is-3"},React.createElement("u",null,"Signup")),React.createElement("label",{className:"label",htmlFor:"username"},"Username: "),React.createElement("input",{className:"input",id:"user",type:"text",name:"username",placeholder:"username"}),React.createElement("label",{className:"label",htmlFor:"pass"},"Password: "),React.createElement("input",{className:"input",id:"pass",type:"password",name:"pass",placeholder:"password"}),React.createElement("label",{className:"label",htmlFor:"pass2"},"Retype Password: "),React.createElement("input",{className:"input",id:"pass2",type:"password",name:"pass2",placeholder:"retype password"}),React.createElement("input",{id:"_csrf",type:"hidden",name:"_csrf",value:e.csrf}),React.createElement("input",{className:"formSubmit button mt-3 is-success",type:"submit",value:"Signup"}));window.onload=async()=>{const t=await fetch("/getToken"),a=await t.json(),s=document.getElementById("loginButton"),c=document.getElementById("signupButton");s.addEventListener("click",(t=>(t.preventDefault(),e.hideError([]),ReactDOM.render(React.createElement(r,{csrf:a.csrfToken}),document.getElementById("content")),s.classList.add("is-success"),c.classList.remove("is-success"),!1))),c.addEventListener("click",(t=>(t.preventDefault(),e.hideError([]),ReactDOM.render(React.createElement(n,{csrf:a.csrfToken}),document.getElementById("content")),s.classList.remove("is-success"),c.classList.add("is-success"),!1))),ReactDOM.render(React.createElement(r,{csrf:a.csrfToken}),document.getElementById("content"))}})()})();