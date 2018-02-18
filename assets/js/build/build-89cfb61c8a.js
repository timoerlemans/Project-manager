"use strict";var elGridView,elListView,list,jsondata=[],body=document.querySelector("body"),modal=document.querySelector(".modal"),modalContent=document.querySelector(".modal__content"),modalCloseBtn=document.querySelector(".js-close-button"),urlParams=new URLSearchParams(window.location.search);function _init(){function e(e,n){var r=new XMLHttpRequest,i="http://www.timoerlemans.nl/xhr/xhr.php";r.onreadystatechange=function(){if(r.readyState==XMLHttpRequest.DONE){var e=JSON.parse(r.responseText);if("fail"===e.status||"error"===e.status||void 0!==e.message)o(!0,e.message,!0),t();else{var n=e.data;body.classList.contains("overview-page")?function(e){for(var o in e){var n=document.createElement("li");n.setAttribute("id",e[o].id),n.classList.add("profiles-list__item"),list.appendChild(n),n.innerHTML='<a href="/profile.html?id='+e[o].id+'" class="profiles-list__preview"><img class="profiles-list__img" src="'+e[o].picture+'"><div class="profiles-list__info"><span class="profiles-list__name">'+e[o].name+'</span><span class="profiles-list__email">'+e[o].email+"</span></div></a>"}t(!1)}(n):body.classList.contains("profile-page")?urlParams.has("id")?function(e,o){for(var n in e)e[n].id===o&&(document.querySelector(".js-profile-img").setAttribute("src",e[n].picture),document.querySelector(".js-profile-name").innerHTML=e[n].name,document.querySelector(".js-profile-birthday").innerHTML=e[n].birthday,document.querySelector(".js-profile-email").innerHTML=e[n].email,document.querySelector(".js-profile-address").innerHTML=e[n].address,document.querySelector(".js-profile-bio").innerHTML=e[n].bio,t())}(n,parseInt(urlParams.get("id"))):(o(!0,'<p>Er is geen profielID gevonden, profiel kan niet weergegeven worden. <a href="/">Ga terug naar het overzicht</a>.</p>',!0),t()):body.classList.contains("create-profile")&&t()}}},e&&"read"!==e||r.open("GET",i+"?type=read",!0),"remove"!==e||isNaN(parseInt(n))||r.open("GET",i+"?type=remove&id="+n,!0),"write"===e&&r.open("GET",i+"?type=write&"+n,!0),r.send(null)}function t(e){e?document.querySelector(".loader").classList.remove("hidden"):document.querySelector(".loader").classList.add("hidden")}function o(e,t,o){e?(modalContent.innerHTML=t,modal.classList.add("open")):(modal.classList.remove("open"),modalContent.innerHTML=""),o?(modalCloseBtn.classList.add("hidden"),modal.classList.add("hide-all")):(modalCloseBtn.classList.remove("hidden"),modal.classList.remove("hide-all"))}(e(),body.classList.contains("overview-page")&&(elGridView=document.querySelector(".js-grid-view"),elListView=document.querySelector(".js-list-view"),list=document.querySelector(".profiles__list"),elGridView.addEventListener("click",function(e){e.preventDefault(),list.classList.add("profiles__list--grid")}),elListView.addEventListener("click",function(e){e.preventDefault(),list.classList.remove("profiles__list--grid")})),body.classList.contains("profile-page"))&&document.querySelector(".js-remove-profile").addEventListener("click",function(n){var r,i;o(!0,'<p>Weet je zeker dat je dit profiel wilt verwijderen?</p><button type="button" class="js-confirm-remove">Heel zeker</button><button type="button" class="js-cancel-remove">Niet zo zeker</button>'),r=document.querySelector(".js-confirm-remove"),i=document.querySelector(".js-cancel-remove"),r.addEventListener("click",function(n){e("remove",urlParams.get("id")),t(!0),o(!1)}),i.addEventListener("click",function(e){o(!1)})});body.classList.contains("create-profile")&&document.querySelector(".js-create-profile").addEventListener("submit",function(o){o.preventDefault(),t(!0),e("write","name="+encodeURIComponent(document.querySelector("#name").value)+"&birthday="+encodeURIComponent(document.querySelector("#birthday").value)+"&email="+encodeURIComponent(document.querySelector("#emailaddress").value)+"&address="+encodeURIComponent(document.querySelector("#address").value)+"&bio="+encodeURIComponent(document.querySelector("#bio").value)+"&picture="+encodeURIComponent(document.querySelector("#picture").value))});modalCloseBtn.addEventListener("click",function(e){o()})}document.addEventListener("DOMContentLoaded",_init,!1);
//# sourceMappingURL=build.js.map
