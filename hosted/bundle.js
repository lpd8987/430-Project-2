(()=>{const e=e=>{document.getElementById("errorMessage").textContent=e,document.getElementById("domoMessage").classList.remove("hidden")},t=async(t,r)=>{const s=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)}),o=await s.json();document.getElementById("domoMessage").classList.add("hidden"),o.redirect&&(window.location=o.redirect),o.error&&e(o.error)};window.onload=()=>{const r=document.getElementById("signupForm"),s=document.getElementById("loginForm"),o=document.getElementById("domoForm"),n=document.getElementById("domoMessage");r&&r.addEventListener("submit",(s=>{s.preventDefault(),n.classList.add("hidden");const o=r.querySelector("#user").value,a=r.querySelector("#pass").value,d=r.querySelector("#pass2").value,u=r.querySelector("#_csrf").value;return o&&a&&d?a!==d?(e("Passwords do not match!"),!1):(t(r.getAttribute("action"),{username:o,pass:a,pass2:d,_csrf:u}),!1):(e("All fields are required!"),!1)})),s&&s.addEventListener("submit",(r=>{r.preventDefault(),n.classList.add("hidden");const o=s.querySelector("#user").value,a=s.querySelector("#pass").value,d=s.querySelector("#_csrf").value;return o&&a?(t(s.getAttribute("action"),{username:o,pass:a,_csrf:d}),!1):(e("Username or password is empty!"),!1)})),o&&o.addEventListener("submit",(r=>{r.preventDefault(),n.classList.add("hidden");const s=o.querySelector("#domoName").value,a=o.querySelector("#domoAge").value,d=o.querySelector("#_csrf").value;return s&&a?(t(o.getAttribute("action"),{name:s,age:a,_csrf:d}),!1):(e("All fields are required!"),!1)}))}})();